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
        const departmentRef = doc(db, 'departments', id!)
        // Soft delete by setting isActive to false
        await updateDoc(departmentRef, {
            'metadata.isActive': false
        })
        return { message: 'Department deleted successfully' }
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            message: error.message
        })
    }
})
