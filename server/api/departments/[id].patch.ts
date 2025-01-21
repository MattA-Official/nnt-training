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

    // Update the department
    const department = await updateDepartment(db, body, user.id)

    return department
})

// method to update a department. merge the body with the existing department
const updateDepartment = async (db: FirebaseFirestore.Firestore, body: any, userId: string): Promise<Department> => {
    const departmentsRef = db.collection('departments')
    const departmentRef = departmentsRef.doc(body.id)

    // TODO: Return error if department does not exist
    // TODO: Check for collisions with other department names and slugs
    // TODO: consider returning the entire updated department object

    const department = {
        ...body,
        metadata: {
            ...body.metadata,
            updatedAt: new Date(),
            updatedBy: userId
        }
    }

    await departmentRef.update(department)
    return department
}