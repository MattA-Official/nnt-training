// GET /api/categories
// List all categories

import { Category } from "~/types"

export default defineEventHandler(async (event) => {
    const categories = await event.context.db.collection('categories').get()
    const data: Category[] = categories.docs.map((doc: FirebaseFirestore.DocumentSnapshot) => doc.data() as Category)

    if (!data.length) {
        throw createError({
            statusCode: 404,
            message: 'No categories found'
        })
    }

    return data
})