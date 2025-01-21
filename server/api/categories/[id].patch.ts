import { useFirestore } from 'vuefire'
import { useAuth } from '~/composables/useAuth'
import { doc, updateDoc } from 'firebase/firestore'

export default defineEventHandler(async (event) => {
    const { userProfile } = useAuth()
    const db = useFirestore()
    const id = getRouterParam(event, 'id')
    const updates = await readBody(event)

    // Verify authentication and admin role
    if (!userProfile.value?.roles.admin) {
        throw createError({
            statusCode: 403,
            message: 'Admin access required'
        })
    }

    try {
        const categoryRef = doc(db, 'categories', id!)
        await updateDoc(categoryRef, updates)
        return { message: 'Category updated successfully' }
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            message: error.message
        })
    }
})
