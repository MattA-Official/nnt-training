// GET /api/departments
// List all departments

import { Department } from "~/types"

export default defineEventHandler(async (event) => {
    const departments = await event.context.db.collection('departments').get()
    const data: Department[] = departments.docs.map((doc: FirebaseFirestore.DocumentSnapshot) => doc.data() as Department)

    if (!data.length) {
        throw createError({
            statusCode: 404,
            message: 'No departments found'
        })
    }

    return data
})