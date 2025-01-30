// POST /api/modules
// Create a module (admin only)

import { requireAdmin } from "~/server/utils/roles"
import { CreateModuleForm, Module } from "~/types"

export default defineEventHandler(async (event) => {
    // Check if the user is an admin
    requireAdmin(event)

    const data = await readBody<CreateModuleForm>(event)

    // Check if the category exists
    const category = await event.context.db.collection('categories').doc(data.categoryId).get()
    if (!category.exists) {
        throw createError({
            statusCode: 404,
            message: 'Category not found'
        })
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

    // Create the module
    const module = await event.context.db.collection('modules').add(data)
    return { id: module.id, ...data } as Module
})
