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

    // Create a new department
    const department = await createDepartment(db, body, user.id)

    return department
})

// method to create a department
const createDepartment = async (db: FirebaseFirestore.Firestore, body: any, userId: string): Promise<Department> => {
    const departmentsRef = db.collection('departments')
    const newDepartmentRef = departmentsRef.doc()


    // TODO: Check for collisions with existing department names and slugs
    const department: Department = {
        id: newDepartmentRef.id,
        name: body.name,
        slug: body.slug,
        icon: body.icon,
        description: body.description,
        contact: body.contact,
        metadata: {
            createdAt: new Date(),
            createdBy: userId,
            isActive: true
        }
    }

    await newDepartmentRef.set(department)
    return department
}
