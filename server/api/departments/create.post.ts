import type { Department, UserProfile } from '~/types'
import { isCreateDepartmentForm } from '~/types/guards'

export default defineEventHandler(async (event) => {
    const db: FirebaseFirestore.Firestore = event.context.db
    const user: UserProfile = event.context.user
    const body = await readBody(event)

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

    // If the body is empty or it does not match the CreateDepartmentForm type return 400
    if (!body || !isCreateDepartmentForm(body)) {
        throw createError({
            statusCode: 400,
            message: 'Bad Request'
        })
    }

    // Create a new department
    const department = await createDepartment(db, body, user.uid).catch((error) => {
        throw createError({
            statusCode: error.statusCode,
            message: error.message
        })
    })

    return department
})

// method to create a department
const createDepartment = async (db: FirebaseFirestore.Firestore, body: any, userId: string): Promise<Department> => {
    const departmentsRef = db.collection('departments')
    const newDepartmentRef = departmentsRef.doc()

    const slugRef = departmentsRef.where('slug', '==', body.slug).limit(1)
    const slugDoc = await slugRef.get()

    if (!slugDoc.empty) {
        throw createError({
            statusCode: 409,
            message: 'Department slug already exists'
        })
    }

    const nameRef = departmentsRef.where('name', '==', body.name).limit(1)
    const nameDoc = await nameRef.get()

    if (!nameDoc.empty) {
        throw createError({
            statusCode: 409,
            message: 'Department name already exists'
        })
    }

    const department: Department = {
        id: newDepartmentRef.id,
        ...body,
        metadata: {
            createdAt: new Date(),
            createdBy: userId,
            isActive: true
        }
    }

    await newDepartmentRef.set(department)
    return department
}
