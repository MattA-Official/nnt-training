// PATCH /api/departments/:id
// Update a department by ID (admin only)

import { requireAdmin } from "~/server/utils/roles"
import { UpdateDepartmentForm, Department } from "~/types"

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
    const data = await readBody<UpdateDepartmentForm>(event)

    // Check if the department exists
    const department = await event.context.db.collection('departments').doc(id).get()
    if (!department.exists) {
        throw createError({
            statusCode: 404,
            message: 'Department not found'
        })
    }

    // Check the contact exists and is on committee
    if (data.contact?.userId) {
        const user = await event.context.db.collection('users').doc(data.contact.userId).get()
        if (!user.exists || !(user.data()?.roles.committee?.role)) {
            throw createError({
                statusCode: 400,
                message: 'User not found or not on committee'
            })
        }
    }

    // Check the name and slug are unique
    const existingDepartment = await event.context.db.collection('departments').where('name', '==', data.name).get()
    if (!existingDepartment.empty && existingDepartment.docs[0].id !== id) {
        throw createError({
            statusCode: 400,
            message: 'Department name must be unique'
        })
    }

    const existingSlug = await event.context.db.collection('departments').where('slug', '==', data.slug).get()
    if (!existingSlug.empty && existingSlug.docs[0].id !== id) {
        throw createError({
            statusCode: 400,
            message: 'Department slug must be unique'
        })
    }

    // Update the department
    await event.context.db.collection('departments').doc(id).update(data)
    return { id, ...data } as Department
})