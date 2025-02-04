// DELETE /api/modules/:id
// Delete a module by ID (admin only)

import { requireAdmin } from "~/server/utils/roles"
import { Module } from "~/types"

export default defineEventHandler(async (event) => {
    // Check if the user is an admin
    requireAdmin(event)

    const id = getRouterParam(event, 'id')
    if (!id) {
        throw createError({
            statusCode: 400,
            message: 'Module ID is required'
        })
    }

    // Check if the module is being soft deleted
    const { soft } = getQuery(event)

    // Check if the module exists
    const module = await event.context.db.collection('modules').doc(id).get()
    if (!module.exists) {
        throw createError({
            statusCode: 404,
            message: 'Module not found'
        })
    }

    // Delete the module
    if (soft) {
        await event.context.db.collection('modules').doc(id).update({
            metadata: {
                isActive: false
            }
        })
        return { id } as Module
    }

    await event.context.db.collection('modules').doc(id).delete()
    return { id } as Module
})