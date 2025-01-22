import type { Department, UserProfile } from '~/types'
import { isUpdateDepartmentForm } from '~/types/guards'

export default defineEventHandler(async (event) => {
    const db: FirebaseFirestore.Firestore = event.context.db
    const user: UserProfile = event.context.user
    const id = getRouterParam(event, 'id')
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
    // If the body is empty or it does not match the UpdateDepartmentForm type return 400
    if (!body || !isUpdateDepartmentForm(body)) {
        throw createError({
            statusCode: 400,
            message: 'Bad Request'
        })
    }

    // Update the department
    const department = await updateDepartment(db, body, id, user.uid).catch((error) => {
        throw createError({
            statusCode: error.statusCode,
            message: error.message
        })
    })

    return department
})

// method to update a department. merge the body with the existing department
const updateDepartment = async (db: FirebaseFirestore.Firestore, body: any, id: any, userId: string): Promise<Department> => {
    const departmentsRef = db.collection('departments')
    const departmentRef = departmentsRef.doc(id)

    const departmentDoc = await departmentRef.get()

    if (!departmentDoc.exists) {
        throw createError({
            statusCode: 404,
            message: 'Department not found'
        })
    }

    if (body.slug !== departmentDoc.data()?.slug) {
        const slugRef = departmentsRef.where('slug', '==', body.slug).limit(1)
        const slugDoc = await slugRef.get()

        if (!slugDoc.empty) {
            throw createError({
                statusCode: 409,
                message: 'Department slug already exists'
            })
        }
    }

    if (body.name !== departmentDoc.data()?.name) {
        const nameRef = departmentsRef.where('name', '==', body.name).limit(1)
        const nameDoc = await nameRef.get()

        if (!nameDoc.empty) {
            throw createError({
                statusCode: 409,
                message: 'Department name already exists'
            })
        }
    }

    const department = {
        ...departmentDoc.data(),
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