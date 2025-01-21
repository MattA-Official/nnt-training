import { useFirestore } from 'vuefire'
import { useAuth } from '~/composables/useAuth'
import { collection, getDocs } from 'firebase/firestore'
import type { Category } from '~/types'

export default defineEventHandler(async (event) => {
    const { userProfile } = useAuth()
    const db = useFirestore()

    // Verify authentication
    if (!userProfile.value) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized'
        })
    }

    try {
        const querySnapshot = await getDocs(collection(db, 'categories'))
        const categories: Category[] = []

        querySnapshot.forEach((doc) => {
            categories.push({ id: doc.id, ...doc.data() } as Category)
        })

        return categories
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            message: error.message
        })
    }
})
