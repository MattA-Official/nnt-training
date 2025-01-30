import type { Module, UserProfile } from '~/types'
import { isCreateModuleForm } from '~/types/guards'

export default defineEventHandler(async (event) => {
    const db: FirebaseFirestore.Firestore = event.context.db
    const user: UserProfile = event.context.user
    const body = await readBody(event)

    // If there is no user return 401
    if (!user) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized'
        })
    }

    // If the user is not an admin return 403
    if (!user.roles.admin) {
        throw createError({
            statusCode: 403,
            message: 'Forbidden'
        })
    }

    // If the body is empty or it does not match the CreateModuleForm type return 400
    if (!body || !isCreateModuleForm(body)) {
        throw createError({
            statusCode: 400,
            message: 'Bad Request'
        })
    }

    // Create a new module
    const module = await createModule(db, body, user.uid).catch((error) => {
        throw createError({
            statusCode: error.statusCode,
            message: error.message
        })
    })

    return module
})

// method to create a module
const createModule = async (db: FirebaseFirestore.Firestore, body: any, userId: string): Promise<Module> => {
    const modulesRef = db.collection('modules')
    const newModuleRef = modulesRef.doc()

    const slugRef = modulesRef.where('slug', '==', body.slug).limit(1)
    const slugDoc = await slugRef.get()

    if (!slugDoc.empty) {
        throw createError({
            statusCode: 409,
            message: 'Module slug already exists'
        })
    }

    const nameRef = modulesRef.where('name', '==', body.name).limit(1)
    const nameDoc = await nameRef.get()

    if (!nameDoc.empty) {
        throw createError({
            statusCode: 409,
            message: 'Module name already exists'
        })
    }

    const module: Module = {
        id: newModuleRef.id,
        ...body,
        metadata: {
            createdAt: new Date(),
            createdBy: userId,
            isActive: true
        }
    }

    await newModuleRef.set(module)
    return module
}
