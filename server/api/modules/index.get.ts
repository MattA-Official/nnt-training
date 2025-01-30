import type { Module, UserProfile } from '~/types'

export default defineEventHandler(async (event) => {
    const db: FirebaseFirestore.Firestore = event.context.db
    const user: UserProfile = event.context.user

    // If there is no user return 401
    if (!user) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized'
        })
    }

    // Get the modules
    const modules = await getModules(db)

    return modules
})

// method to get modules
const getModules = async (db: FirebaseFirestore.Firestore): Promise<Module[]> => {
    const modulesRef = db.collection('modules')
    const modules = await modulesRef.get()

    return modules.docs.map(doc => doc.data() as Module)
}