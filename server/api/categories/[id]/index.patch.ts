// PATCH /api/categories/:id
// Update a category by ID (admin only)

import { requireAdmin } from "~/server/utils/roles"
import { UpdateCategoryForm, Category } from "~/types"

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
    const data = await readBody<UpdateCategoryForm>(event)

    // Check if the category exists
    const category = await event.context.db.collection('categories').doc(id).get()
    if (!category.exists) {
        throw createError({
            statusCode: 404,
            message: 'Category not found'
        })
    }

    // Check if the department exists
    if (data.departmentId) {
        const department = await event.context.db.collection('departments').doc(data.departmentId).get()
        if (!department.exists || !department.data()?.metadata.isActive) {
            throw createError({
                statusCode: 400,
                message: 'Department not found'
            })
        }
    }

    // Check the name and slug are unique
    const existingCategory = await event.context.db.collection('categories').where('name', '==', data.name).get()
    if (!existingCategory.empty && existingCategory.docs[0].id !== id) {
        throw createError({
            statusCode: 400,
            message: 'Category name must be unique'
        })
    }

    const existingSlug = await event.context.db.collection('categories').where('slug', '==', data.slug).get()
    if (!existingSlug.empty && existingSlug.docs[0].id !== id) {
        throw createError({
            statusCode: 400,
            message: 'Category slug must be unique'
        })
    }

    // Update the category
    await event.context.db.collection('categories').doc(id).update(data)
    return { id, ...data } as Category
})