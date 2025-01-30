import type { Category, UserProfile } from '~/types'

// TODO: add the ability to completely delete a category including references to it
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

    // If the user is not an admin return 403
    if (!user.roles.admin) {
        throw createError({
            statusCode: 403,
            message: 'Forbidden'
        })
    }

    // Soft Delete the category
    const category = await softDeleteCategory(db, id, user.uid).catch((error) => {
        throw createError({
            statusCode: error.statusCode,
            message: error.message
        })
    })

    return category
})

// method to soft delete a category
const softDeleteCategory = async (db: FirebaseFirestore.Firestore, id: any, userId: string): Promise<Category> => {
    const categoriesRef = db.collection('categories')
    const categoryRef = categoriesRef.doc(id)

    const categoryDoc = await categoryRef.get()

    if (!categoryDoc.exists) {
        throw createError({
            statusCode: 404,
            message: 'Category not found'
        })
    }

    const category = {
        ...categoryDoc.data(),
        metadata: {
            lastUpdatedAt: new Date(),
            lastUpdatedBy: userId,
            isActive: false
        }
    }

    await categoryRef.update(category)
    return category as Category
}

