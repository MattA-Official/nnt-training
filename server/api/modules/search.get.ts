import type { Module, UserProfile } from '~/types'

export default defineEventHandler(async (event) => {
    const db: FirebaseFirestore.Firestore = event.context.db
    const user: UserProfile = event.context.user
    const query = getQuery(event)

    if (!user) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized'
        })
    }

    if (Object.keys(query).length === 0) {
        throw createError({
            statusCode: 400,
            message: 'At least one search parameter is required'
        })
    }

    const modules = await searchModules(db, query).catch((error) => {
        throw createError({
            statusCode: error.statusCode,
            message: error.message
        })
    })

    return modules.length === 1 ? modules[0] : modules
})

const searchModules = async (db: FirebaseFirestore.Firestore, query: any): Promise<Module[]> => {
    const modulesRef = db.collection('modules')
    let queryRef: FirebaseFirestore.Query = modulesRef

    // Build query based on provided parameters
    Object.entries(query).forEach(([key, value]) => {
        if (value) {
            queryRef = queryRef.where(key, '==', value)
        }
    })

    const modules = await queryRef.get()

    if (modules.empty) {
        throw createError({
            statusCode: 404,
            message: 'No modules found'
        })
    }

    return modules.docs.map(doc => doc.data() as Module)
}
