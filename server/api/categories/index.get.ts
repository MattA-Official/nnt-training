import type { Category, UserProfile } from '~/types'

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

    // Get the categories
    const categories = await getCategories(db)

    return categories
})

// method to get categories
const getCategories = async (db: FirebaseFirestore.Firestore): Promise<Category[]> => {
    const categoriesRef = db.collection('categories')
    const categories = await categoriesRef.get()

    return categories.docs.map(doc => doc.data() as Category)
}