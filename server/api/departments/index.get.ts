import type { Department } from '~/types'

export default defineEventHandler(async (event) => {
    const db: FirebaseFirestore.Firestore = event.context.db
    const user = event.context.user

    // If there is no user return 401
    if (!user) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized'
        })
    }

    // Get the departments
    const departments = await getDepartments(db)

    return departments
})

// method to get departments
const getDepartments = async (db: FirebaseFirestore.Firestore): Promise<Department[]> => {
    const departmentsRef = db.collection('departments')
    const departments = await departmentsRef.get()

    return departments.docs.map(doc => doc.data() as Department)
}