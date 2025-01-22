import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

export default defineEventHandler(async (event) => {
    const cookie = getCookie(event, '__session') || ''
    const db = event.context.db || getFirestore()

    // TODO: make this the actual user object from Firestore
    try {
        if (cookie) {
            const decodedClaims = await getAuth().verifySessionCookie(cookie)

            const userRef = db.collection('users').doc(decodedClaims.uid)
            const userDoc = await userRef.get()

            if (!userDoc.exists) {
                throw createError({
                    statusCode: 404,
                    message: 'User not found'
                })
            }

            event.context.user = userDoc.data()
        } else {
            event.context.user = null
        }
    } catch (error) {
        event.context.user = null
    }
})