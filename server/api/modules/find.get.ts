import type { Module, UserProfile } from '~/types'

// Allow the user to find a module by slug
// TODO: add more options for finding a module

export default defineEventHandler(async (event) => {
    const db: FirebaseFirestore.Firestore = event.context.db
    const user: UserProfile = event.context.user
    const { slug } = getQuery(event)

    // If there is no user return 401
    if (!user) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized'
        })
    }

    // If there is no slug return 400
    if (!slug) {
        throw createError({
            statusCode: 400,
            message: 'Bad Request'
        })
    }

    // Get the module
    const module = await findModule(db, slug).catch((error) => {
        throw createError({
            statusCode: error.statusCode,
            message: error.message
        })
    })

    return module
})

// method to a module by slug
const findModule = async (db: FirebaseFirestore.Firestore, slug: any): Promise<Module> => {
    const modulesRef = db.collection('modules')
    const moduleRef = modulesRef.where('slug', '==', slug).limit(1)

    const module = await moduleRef.get()

    if (module.empty) {
        throw createError({
            statusCode: 404,
            message: 'Module not found'
        })
    }

    return module.docs[0].data() as Module
}