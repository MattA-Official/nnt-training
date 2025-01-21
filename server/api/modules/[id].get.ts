import { useFirestore } from 'vuefire'
import { useAuth } from '~/composables/useAuth'
import { doc, getDoc } from 'firebase/firestore'
import type { Module } from '~/types'

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
        const docRef = doc(db, 'modules', id!)
        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
            throw createError({
                statusCode: 404,
                message: 'Module not found'
            })
        }

        return { id: docSnap.id, ...docSnap.data() } as Module
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            message: error.message
        })
    }
})
