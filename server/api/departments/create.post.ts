import type { Department } from '~/types'
import { serverFirestore, serverAuth } from '~/utils/firebase-admin'

export default defineEventHandler(async (event) => {
    const db = await serverFirestore()
    const auth = await serverAuth()
    const body = await readBody(event)

    // Get session cookie
    const sessionCookie = getCookie(event, '__session')
    if (!sessionCookie) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized'
        })
    }

    // Verify session
    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie)
        const userDoc = await db.collection('users').doc(decodedClaims.uid).get()
        const userData = userDoc.data()

        console.log('User:', userData)

        if (!userData?.roles?.admin) {
            throw createError({
                statusCode: 403,
                message: 'Admin access required'
            })
        }

        const departmentsRef = db.collection('departments')
        const newDepartmentRef = departmentsRef.doc()

        const department: Department = {
            id: newDepartmentRef.id,
            name: body.name,
            slug: body.slug,
            icon: body.icon,
            description: body.description,
            contact: body.contact,
            metadata: {
                createdAt: new Date(),
                createdBy: decodedClaims.uid,
                isActive: true
            }
        }

        await newDepartmentRef.set(department)
        return department
    } catch (error: any) {
        throw createError({
            statusCode: error.code === 'auth/session-cookie-expired' ? 401 : error.statusCode || 500,
            message: error.message
        })
    }
})
