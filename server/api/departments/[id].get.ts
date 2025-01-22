import type { Department, UserProfile } from '~/types'

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

    // Get the department
    const department = await getDepartment(db, id).catch((error) => {
        throw createError({
            statusCode: error.statusCode,
            message: error.message
        })
    })

    // if the user is not an admin and the department is not active return 403
    if (!user.roles.admin && !department.metadata.isActive) {
        throw createError({
            statusCode: 403,
            message: 'Forbidden'
        })
    }

    return department
})

// method to get a department
const getDepartment = async (db: FirebaseFirestore.Firestore, id: any): Promise<Department> => {
    const departmentsRef = db.collection('departments')
    const departmentRef = departmentsRef.doc(id)

    const department = await departmentRef.get()

    if (!department.exists) {
        throw createError({
            statusCode: 404,
            message: 'Department not found'
        })
    }

    return department.data() as Department
}