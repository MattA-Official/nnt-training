// DELETE /api/departments/:id
// Delete a department by ID (admin only)

import { requireAdmin } from "~/server/utils/roles"
import { Department } from "~/types"

export default defineEventHandler(async (event) => {
    // Check if the user is an admin
    requireAdmin(event)

    const id = getRouterParam(event, 'id')
    if (!id) {
        throw createError({
            statusCode: 400,
            message: 'Department ID is required'
        })
    }

    // Check if the department is being soft deleted
    const { soft } = getQuery(event)

    // Check if the department exists
    const department = await event.context.db.collection('departments').doc(id).get()
    if (!department.exists) {
        throw createError({
            statusCode: 404,
            message: 'Department not found'
        })
    }

    // Delete the department
    if (soft) {
        await event.context.db.collection('departments').doc(id).update({
            metadata: {
                isActive: false
            }
        })
        return { id } as Department
    }

    await event.context.db.collection('departments').doc(id).delete()
    return { id } as Department
})