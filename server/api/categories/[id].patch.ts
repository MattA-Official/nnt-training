import type { Category, UserProfile } from '~/types'
import { isUpdateCategoryForm } from '~/types/guards'

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
    // If the body is empty or it does not match the UpdateCategoryForm type return 400
    if (!body || !isUpdateCategoryForm(body)) {
        throw createError({
            statusCode: 400,
            message: 'Bad Request'
        })
    }

    // Update the category
    const category = await updateCategory(db, body, id, user.uid).catch((error) => {
        throw createError({
            statusCode: error.statusCode,
            message: error.message
        })
    })

    return category
})

// method to update a category. merge the body with the existing category
const updateCategory = async (db: FirebaseFirestore.Firestore, body: any, id: any, userId: string): Promise<Category> => {
    const categoriesRef = db.collection('categories')
    const categoryRef = categoriesRef.doc(id)

    const categoryDoc = await categoryRef.get()

    if (!categoryDoc.exists) {
        throw createError({
            statusCode: 404,
            message: 'Category not found'
        })
    }

    if (body.slug !== categoryDoc.data()?.slug) {
        const slugRef = categoriesRef.where('slug', '==', body.slug).limit(1)
        const slugDoc = await slugRef.get()

        if (!slugDoc.empty) {
            throw createError({
                statusCode: 409,
                message: 'Category slug already exists'
            })
        }
    }

    if (body.name !== categoryDoc.data()?.name) {
        const nameRef = categoriesRef.where('name', '==', body.name).limit(1)
        const nameDoc = await nameRef.get()

        if (!nameDoc.empty) {
            throw createError({
                statusCode: 409,
                message: 'Category name already exists'
            })
        }
    }

    const category = {
        ...categoryDoc.data(),
        ...body,
        metadata: {
            ...body.metadata,
            updatedAt: new Date(),
            updatedBy: userId
        }
    }

    await categoryRef.update(category)
    return category
}