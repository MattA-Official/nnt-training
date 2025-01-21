import { useFirestore } from 'vuefire'
import { useAuth } from '~/composables/useAuth'
import { doc, updateDoc } from 'firebase/firestore'

export default defineEventHandler(async (event) => {
    const { userProfile } = useAuth()
    const db = useFirestore()
    const id = getRouterParam(event, 'id')

    // Verify authentication and admin role
    if (!userProfile.value?.roles.admin) {
        throw createError({
            statusCode: 403,
            message: 'Admin access required'
        })
    }

    try {
        const categoryRef = doc(db, 'categories', id!)
        // Soft delete by setting isActive to false
        await updateDoc(categoryRef, {
            'metadata.isActive': false
        })
        return { message: 'Category deleted successfully' }
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            message: error.message
        })
    }
})
