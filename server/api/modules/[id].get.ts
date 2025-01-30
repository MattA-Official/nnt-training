import type { Module, UserProfile } from '~/types'

export default defineEventHandler(async (event) => {
    const db: FirebaseFirestore.Firestore = event.context.db
    const user: UserProfile = event.context.user
    const id = getRouterParam(event, 'id')

    // If there is no user return 401
    if (!user) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized'
        })
    }

    // Get the module
    const module = await getModule(db, id).catch((error) => {
        throw createError({
            statusCode: error.statusCode,
            message: error.message
        })
    })

    // if the user is not an admin and the module is not active return 403
    if (!user.roles.admin && !module.metadata.isActive) {
        throw createError({
            statusCode: 403,
            message: 'Forbidden'
        })
    }

    return module
})

// method to get a module
const getModule = async (db: FirebaseFirestore.Firestore, id: any): Promise<Module> => {
    const modulesRef = db.collection('modules')
    const moduleRef = modulesRef.doc(id)

    const module = await moduleRef.get()

    if (!module.exists) {
        throw createError({
            statusCode: 404,
            message: 'Module not found'
        })
    }

    return module.data() as Module
}