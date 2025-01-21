import { useFirestore } from 'vuefire'
import { useAuth } from '~/composables/useAuth'
import { doc, getDoc } from 'firebase/firestore'
import type { Department } from '~/types'

export default defineEventHandler(async (event) => {
    const { userProfile } = useAuth()
    const db = useFirestore()
    const id = getRouterParam(event, 'id')

    // Verify authentication
    if (!userProfile.value) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized'
        })
    }

    try {
        const docRef = doc(db, 'departments', id!)
        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
            throw createError({
                statusCode: 404,
                message: 'Department not found'
            })
        }

        return { id: docSnap.id, ...docSnap.data() } as Department
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            message: error.message
        })
    }
})
