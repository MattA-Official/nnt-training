import type { Module, UserProfile } from '~/types'
import { isUpdateModuleForm } from '~/types/guards'

export default defineEventHandler(async (event) => {
    const db: FirebaseFirestore.Firestore = event.context.db
    const user: UserProfile = event.context.user
    const id = getRouterParam(event, 'id')
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
    // If the body is empty or it does not match the UpdateModuleForm type return 400
    if (!body || !isUpdateModuleForm(body)) {
        throw createError({
            statusCode: 400,
            message: 'Bad Request'
        })
    }

    // Update the module
    const module = await updateModule(db, body, id, user.uid).catch((error) => {
        throw createError({
            statusCode: error.statusCode,
            message: error.message
        })
    })

    return module
})

// method to update a module. merge the body with the existing module
const updateModule = async (db: FirebaseFirestore.Firestore, body: any, id: any, userId: string): Promise<Module> => {
    const modulesRef = db.collection('modules')
    const moduleRef = modulesRef.doc(id)

    const moduleDoc = await moduleRef.get()

    if (!moduleDoc.exists) {
        throw createError({
            statusCode: 404,
            message: 'Module not found'
        })
    }

    if (body.slug !== moduleDoc.data()?.slug) {
        const slugRef = modulesRef.where('slug', '==', body.slug).limit(1)
        const slugDoc = await slugRef.get()

        if (!slugDoc.empty) {
            throw createError({
                statusCode: 409,
                message: 'Module slug already exists'
            })
        }
    }

    if (body.name !== moduleDoc.data()?.name) {
        const nameRef = modulesRef.where('name', '==', body.name).limit(1)
        const nameDoc = await nameRef.get()

        if (!nameDoc.empty) {
            throw createError({
                statusCode: 409,
                message: 'Module name already exists'
            })
        }
    }

    const module = {
        ...moduleDoc.data(),
        ...body,
        metadata: {
            ...body.metadata,
            updatedAt: new Date(),
            updatedBy: userId
        }
    }

    await moduleRef.update(module)
    return module
}