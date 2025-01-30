import type { Category, UserProfile } from '~/types'
import { isCreateCategoryForm } from '~/types/guards'

export default defineEventHandler(async (event) => {
    const db: FirebaseFirestore.Firestore = event.context.db
    const user: UserProfile = event.context.user
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

    // If the body is empty or it does not match the CreateCategoryForm type return 400
    if (!body || !isCreateCategoryForm(body)) {
        throw createError({
            statusCode: 400,
            message: 'Bad Request'
        })
    }

    // Create a new category
    const category = await createCategory(db, body, user.uid).catch((error) => {
        throw createError({
            statusCode: error.statusCode,
            message: error.message
        })
    })

    return category
})

// method to create a category
const createCategory = async (db: FirebaseFirestore.Firestore, body: any, userId: string): Promise<Category> => {
    const categoriesRef = db.collection('categories')
    const newCategoryRef = categoriesRef.doc()

    const slugRef = categoriesRef.where('slug', '==', body.slug).limit(1)
    const slugDoc = await slugRef.get()

    if (!slugDoc.empty) {
        throw createError({
            statusCode: 409,
            message: 'Category slug already exists'
        })
    }

    const nameRef = categoriesRef.where('name', '==', body.name).limit(1)
    const nameDoc = await nameRef.get()

    if (!nameDoc.empty) {
        throw createError({
            statusCode: 409,
            message: 'Category name already exists'
        })
    }

    const category: Category = {
        id: newCategoryRef.id,
        ...body,
        metadata: {
            createdAt: new Date(),
            createdBy: userId,
            isActive: true
        }
    }

    await newCategoryRef.set(category)
    return category
}
