// PATCH /api/modules/:id
// Update a module by ID (admin only)

import { requireAdmin } from "~/server/utils/roles"
import { UpdateModuleForm, Module } from "~/types"

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
    const data = await readBody<UpdateModuleForm>(event)

    // Check if the module exists
    const module = await event.context.db.collection('modules').doc(id).get()
    if (!module.exists) {
        throw createError({
            statusCode: 404,
            message: 'Module not found'
        })
    }

    // Check if the category exists
    if (data.categoryId) {
        const category = await event.context.db.collection('categories').doc(data.categoryId).get()
        if (!category.exists) {
            throw createError({
                statusCode: 400,
                message: 'Category not found'
            })
        }
    }

    // Check the name and slug are unique
    const existingModule = await event.context.db.collection('modules').where('name', '==', data.name).get()
    if (!existingModule.empty) {
        throw createError({
            statusCode: 400,
            message: 'Module name must be unique'
        })
    }

    const existingSlug = await event.context.db.collection('modules').where('slug', '==', data.slug).get()
    if (!existingSlug.empty) {
        throw createError({
            statusCode: 400,
            message: 'Module slug must be unique'
        })
    }

    // Update the module
    await event.context.db.collection('modules').doc(id).update(data)
    return { id, ...data } as Module
})