import { useFirestore } from 'vuefire'
import { useAuth } from '~/composables/useAuth'
import { collection, doc, setDoc } from 'firebase/firestore'
import type { Category } from '~/types'

export default defineEventHandler(async (event) => {
    const { userProfile } = useAuth()
    const db = useFirestore()
    const body = await readBody(event)

    // Verify authentication and admin role
    if (!userProfile.value?.roles.admin) {
        throw createError({
            statusCode: 403,
            message: 'Admin access required'
        })
    }

    try {
        const categorysRef = collection(db, 'categories')
        const newCategoryRef = doc(categorysRef)

        const category: Category = {
            id: newCategoryRef.id,
            departmentId: body.departmentId,
            name: body.name,
            slug: body.slug,
            description: body.description,
            order: body.order,
            metadata: {
                createdAt: new Date(),
                createdBy: userProfile.value.uid,
                isActive: true
            }
        }

        await setDoc(newCategoryRef, category)
        return category
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            message: error.message
        })
    }
})
