// POST /api/categories
// Create a category (admin only)

import { requireAdmin } from "~/server/utils/roles"
import { CreateCategoryForm, Category } from "~/types"

export default defineEventHandler(async (event) => {
    // Check if the user is an admin
    requireAdmin(event)

    const data = await readBody<CreateCategoryForm>(event)

    // Check if the department exists
    const department = await event.context.db.collection('departments').doc(data.departmentId).get()
    if (!department.exists || !department.data()?.metadata.isActive) {
        throw createError({
            statusCode: 404,
            message: 'Department not found'
        })
    }

    // Check the name and slug are unique
    const existingCategory = await event.context.db.collection('categories').where('name', '==', data.name).get()
    if (!existingCategory.empty) {
        throw createError({
            statusCode: 400,
            message: 'Category name must be unique'
        })
    }

    const existingSlug = await event.context.db.collection('categories').where('slug', '==', data.slug).get()
    if (!existingSlug.empty) {
        throw createError({
            statusCode: 400,
            message: 'Category slug must be unique'
        })
    }

    // Create the category
    const category = await event.context.db.collection('categories').add(data)
    return { id: category.id, ...data } as Category
})