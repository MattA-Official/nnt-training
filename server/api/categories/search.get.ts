import type { Category, UserProfile } from '~/types'

interface Query {
    name?: string
    slug?: string
    description?: string
    department?: string // Department ID
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

    const categories = await searchCategories(db, query).catch((error) => {
        throw createError({
            statusCode: error.statusCode,
            message: error.message
        })
    })

    return categories.length === 1 ? categories[0] : categories
})

const searchCategories = async (db: FirebaseFirestore.Firestore, query: any): Promise<Category[]> => {
    const categoriesRef = db.collection('categories')
    let queryRef: FirebaseFirestore.Query = categoriesRef

    Object.entries(query).forEach(([key, value]) => {
        if (value) {
            queryRef = queryRef.where(key, '==', value)
        }
    })

    const categories = await queryRef.get()

    if (categories.empty) {
        throw createError({
            statusCode: 404,
            message: 'No categories found'
        })
    }

    return categories.docs.map(doc => doc.data() as Category)
}
