// GET /api/modules
// List all modules

import { convertTimestamps } from "~/server/utils/timestamp"
import { Module } from "~/types"

export default defineEventHandler(async (event) => {
    const modules = await event.context.db.collection('modules').get()
    const data: Module[] = modules.docs.map((doc: FirebaseFirestore.DocumentSnapshot) => convertTimestamps(doc.data() as Module))

    if (!data.length) {
        throw createError({
            statusCode: 404,
            message: 'No modules found'
        })
    }

    return data
})