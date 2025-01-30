import type { Category, UserProfile } from '~/types'

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

    // Get the category
    const category = await getCategory(db, id).catch((error) => {
        throw createError({
            statusCode: error.statusCode,
            message: error.message
        })
    })

    // if the user is not an admin and the category is not active return 403
    if (!user.roles.admin && !category.metadata.isActive) {
        throw createError({
            statusCode: 403,
            message: 'Forbidden'
        })
    }

    return category
})

// method to get a category
const getCategory = async (db: FirebaseFirestore.Firestore, id: any): Promise<Category> => {
    const categoriesRef = db.collection('categories')
    const categoryRef = categoriesRef.doc(id)

    const category = await categoryRef.get()

    if (!category.exists) {
        throw createError({
            statusCode: 404,
            message: 'Category not found'
        })
    }

    return category.data() as Category
}