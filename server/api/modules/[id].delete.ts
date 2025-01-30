import type { Department, UserProfile } from '~/types'

// TODO: add the ability to completely delete a department including references to it
export default defineEventHandler(async (event) => {
    const db: FirebaseFirestore.Firestore = event.context.db
    const user: UserProfile = event.context.user
    const id = getRouterParam(event, 'id')

    // If there is no user return 401
    if (!user) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized'
        })
    }

    // If the user is not an admin return 403
    if (!user.roles.admin) {
        throw createError({
            statusCode: 403,
            message: 'Forbidden'
        })
    }

    // Soft Delete the department
    const department = await softDeleteDepartment(db, id, user.uid).catch((error) => {
        throw createError({
            statusCode: error.statusCode,
            message: error.message
        })
    })

    return department
})

// method to soft delete a department
const softDeleteDepartment = async (db: FirebaseFirestore.Firestore, id: any, userId: string): Promise<Department> => {
    const departmentsRef = db.collection('departments')
    const departmentRef = departmentsRef.doc(id)

    const departmentDoc = await departmentRef.get()

    if (!departmentDoc.exists) {
        throw createError({
            statusCode: 404,
            message: 'Department not found'
        })
    }

    const department = {
        ...departmentDoc.data(),
        metadata: {
            lastUpdatedAt: new Date(),
            lastUpdatedBy: userId,
            isActive: false
        }
    }

    await departmentRef.update(department)
    return department as Department
}

