import type { Category, UserProfile } from '~/types'

// Allow the user to find a category by slug
// TODO: add more options for finding a category

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

    // Get the category
    const category = await findCategory(db, slug).catch((error) => {
        throw createError({
            statusCode: error.statusCode,
            message: error.message
        })
    })

    return category
})

// method to a category by slug
const findCategory = async (db: FirebaseFirestore.Firestore, slug: any): Promise<Category> => {
    const categoriesRef = db.collection('categories')
    const categoryRef = categoriesRef.where('slug', '==', slug).limit(1)

    const category = await categoryRef.get()

    if (category.empty) {
        throw createError({
            statusCode: 404,
            message: 'Category not found'
        })
    }

    return category.docs[0].data() as Category
}