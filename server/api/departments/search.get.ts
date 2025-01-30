import type { Department, UserProfile } from '~/types'

interface Query {
    name?: string
    slug?: string
    description?: string
    limit?: number
}

export default defineEventHandler(async (event) => {
    const db: FirebaseFirestore.Firestore = event.context.db
    const user: UserProfile = event.context.user
    const query = getQuery(event)

    if (!user) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized'
        })
    }

    if (Object.keys(query).length === 0) {
        throw createError({
            statusCode: 400,
            message: 'At least one search parameter is required'
        })
    }

    const departments = await searchDepartments(db, query).catch((error) => {
        throw createError({
            statusCode: error.statusCode,
            message: error.message
        })
    })

    return departments.length === 1 ? departments[0] : departments
})

const searchDepartments = async (db: FirebaseFirestore.Firestore, query: any): Promise<Department[]> => {
    const departmentsRef = db.collection('departments')
    let queryRef: FirebaseFirestore.Query = departmentsRef

    Object.entries(query).forEach(([key, value]) => {
        if (value) {
            queryRef = queryRef.where(key, '==', value)
        }
    })

    const departments = await queryRef.get()

    if (departments.empty) {
        throw createError({
            statusCode: 404,
            message: 'No departments found'
        })
    }

    return departments.docs.map(doc => doc.data() as Department)
}
