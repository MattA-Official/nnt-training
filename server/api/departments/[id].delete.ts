import type { Department } from '~/types'

export default defineEventHandler(async (event) => {
    const db: FirebaseFirestore.Firestore = event.context.db
    const user = event.context.user
    const body = await readBody(event)

    // If there is no user return 401
    if (!user) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized'
        })
    }

    // If the user is not an admin return 403
    if (!user.isAdmin) {
        throw createError({
            statusCode: 403,
            message: 'Forbidden'
        })
    }

    // Soft Delete the department
    const department = await softDeleteDepartment(db, body, user.id)

    return department
})

// method to soft delete a department
const softDeleteDepartment = async (db: FirebaseFirestore.Firestore, body: any, userId: string): Promise<Department> => {
    const departmentsRef = db.collection('departments')
    const departmentRef = departmentsRef.doc(body.id)

    // TODO: Return error if department does not exist
    // TODO: consider returning the entire department object or a boolean?

    const department = {
        ...body,
        metadata: {
            lastUpdatedAt: new Date(),
            lastUpdatedBy: userId,
            isActive: false
        }
    }

    await departmentRef.update(department)
    return department
}

