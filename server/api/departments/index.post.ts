// POST /api/departments
// Create a department (admin only)

import { requireAdmin } from "~/server/utils/roles"
import { CreateDepartmentForm, Department, UserProfile } from "~/types"

export default defineEventHandler(async (event) => {
    // Check if the user is an admin
    requireAdmin(event)

    const data = await readBody<CreateDepartmentForm>(event)

    // Check the user exists and is on committee
    const user = await event.context.db.collection('users').doc(data.contact.userId).get()
    if (!user.exists || !(user.data() as UserProfile).roles.committee?.role) {
        throw createError({
            statusCode: 400,
            message: 'User not found or not on committee'
        })
    }

    // Check the name and slug are unique
    const existingDepartment = await event.context.db.collection('departments').where('name', '==', data.name).get()
    if (!existingDepartment.empty) {
        throw createError({
            statusCode: 400,
            message: 'Department name must be unique'
        })
    }

    const existingSlug = await event.context.db.collection('departments').where('slug', '==', data.slug).get()
    if (!existingSlug.empty) {
        throw createError({
            statusCode: 400,
            message: 'Department slug must be unique'
        })
    }

    // Create the department
    const department = await event.context.db.collection('departments').add(data)
    return { id: department.id, ...data } as Department
})