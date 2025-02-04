// GET /api/departments
// List all departments

// Query filters: showInactive

import { convertTimestamps } from "~/server/utils/timestamp"
import { Department } from "~/types"

export default defineEventHandler(async (event) => {
    const { showInactive } = getQuery(event)

    const query = event.context.db.collection('departments')

    if (!showInactive) {
        query.where('metadata.isActive', '==', true)
    } else {
        // check if user is admin
        requireAdmin(event)
    }

    const departments = await query.get()

    const data: Department[] = departments.docs.map((doc: FirebaseFirestore.DocumentSnapshot) => convertTimestamps(doc.data() as Department))

    if (!data.length) {
        throw createError({
            statusCode: 404,
            message: 'No departments found'
        })
    }

    return data
})