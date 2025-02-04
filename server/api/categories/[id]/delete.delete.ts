// DELETE /api/categories/:id
// Delete a category by ID (admin only)

import { requireAdmin } from "~/server/utils/roles"
import { Category } from "~/types"

export default defineEventHandler(async (event) => {
    // Check if the user is an admin
    requireAdmin(event)

    const id = getRouterParam(event, 'id')
    if (!id) {
        throw createError({
            statusCode: 400,
            message: 'Category ID is required'
        })
    }

    // Check if the category is being soft deleted
    const { soft } = getQuery(event)

    // Check if the category exists
    const category = await event.context.db.collection('categories').doc(id).get()
    if (!category.exists) {
        throw createError({
            statusCode: 404,
            message: 'Category not found'
        })
    }

    // Delete the category
    if (soft) {
        await event.context.db.collection('categories').doc(id).update({
            metadata: {
                isActive: false
            }
        })
        return { id } as Category
    }

    await event.context.db.collection('categories').doc(id).delete()
    return { id } as Category
})