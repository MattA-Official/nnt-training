import type { Department, UserProfile } from '~/types'

// Allow the user to find a department by slug
// TODO: add more options for finding a department

export default defineEventHandler(async (event) => {
    const db: FirebaseFirestore.Firestore = event.context.db
    const user: UserProfile = event.context.user
    const { slug } = getQuery(event)

    // If there is no user return 401
    if (!user) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized'
        })
    }

    // If there is no slug return 400
    if (!slug) {
        throw createError({
            statusCode: 400,
            message: 'Bad Request'
        })
    }

    // Get the department
    const department = await findDepartment(db, slug).catch((error) => {
        throw createError({
            statusCode: error.statusCode,
            message: error.message
        })
    })

    return department
})

// method to a department by slug
const findDepartment = async (db: FirebaseFirestore.Firestore, slug: any): Promise<Department> => {
    const departmentsRef = db.collection('departments')
    const departmentRef = departmentsRef.where('slug', '==', slug).limit(1)

    const department = await departmentRef.get()

    if (department.empty) {
        throw createError({
            statusCode: 404,
            message: 'Department not found'
        })
    }

    return department.docs[0].data() as Department
}