import { useFirestore } from 'vuefire'
import { useAuth } from '~/composables/useAuth'
import { collection, doc, setDoc } from 'firebase/firestore'
import type { Department } from '~/types'

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
        const departmentsRef = collection(db, 'departments')
        const newDepartmentRef = doc(departmentsRef)

        const department: Department = {
            id: newDepartmentRef.id,
            name: body.name,
            slug: body.slug,
            icon: body.icon,
            description: body.description,
            contact: body.contact,
            metadata: {
                createdAt: new Date(),
                createdBy: userProfile.value.uid,
                isActive: true
            }
        }

        await setDoc(newDepartmentRef, department)
        return department
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            message: error.message
        })
    }
})
