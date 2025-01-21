import { useFirestore } from 'vuefire'
import { useAuth } from '~/composables/useAuth'
import { collection, doc, setDoc } from 'firebase/firestore'
import type { Module } from '~/types'

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
        const modulesRef = collection(db, 'modules')
        const newModuleRef = doc(modulesRef)

        const module: Module = {
            id: newModuleRef.id,
            name: body.name,
            slug: body.slug,
            description: body.description,
            categoryId: body.categoryId,
            order: body.order,
            safety: body.safety || false,
            requirements: body.requirements || null,
            metadata: {
                createdAt: new Date(),
                lastUpdatedAt: new Date(),
                createdBy: userProfile.value.uid,
                isActive: true
            }
        }

        await setDoc(newModuleRef, module)
        return module
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            message: error.message
        })
    }
})
