// GET /api/categories/:id/modules
// Get all modules for a category by ID

import { convertTimestamps } from "~/server/utils/timestamp"
import { Module } from "~/types"

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    const modules = await event.context.db.collection('modules').where('categoryId', '==', id).get().then((querySnapshot) => {
        if (querySnapshot.empty) {
            throw createError({
                statusCode: 404,
                message: 'Modules not found'
            })
        }

        const data: Module[] = querySnapshot.docs.map((doc: FirebaseFirestore.DocumentSnapshot) => convertTimestamps(doc.data() as Module))

        return data
    })

    return modules
})