import type { Department } from '~/types'

export default defineEventHandler(async (event) => {
    const db: FirebaseFirestore.Firestore = event.context.db
    const user = event.context.user
    const id = getRouterParam(event, 'id')

    // If there is no user return 401
    if (!user) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized'
        })
    }

    // Get the department
    const department = await getDepartment(db, id)

    return department
})

// method to get a department
const getDepartment = async (db: FirebaseFirestore.Firestore, id: any): Promise<Department> => {
    const departmentsRef = db.collection('departments')
    const departmentRef = departmentsRef.doc(id)

    // TODO: Return error if department does not exist

    const department = await departmentRef.get()
    return department.data()
}