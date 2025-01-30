// GET /api/departments/:id/categories
// Get all categories for a department by ID

import { convertTimestamps } from "~/server/utils/timestamp"
import { Category } from "~/types"

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    const categories = await event.context.db.collection('categories').where('departmentId', '==', id).get().then((querySnapshot) => {
        if (querySnapshot.empty) {
            throw createError({
                statusCode: 404,
                message: 'Categories not found'
            })
        }

        const data: Category[] = querySnapshot.docs.map((doc: FirebaseFirestore.DocumentSnapshot) => convertTimestamps(doc.data() as Category))

        return data
    })

    return categories
})