import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

export default defineEventHandler(async (event) => {
    const cookie = getCookie(event, 'session') || ''

    // TODO: make this the actual user object from Firestore
    try {
        if (cookie) {
            const decodedClaims = await getAuth().verifySessionCookie(cookie)
            event.context.user = decodedClaims
        } else {
            event.context.user = {}
        }
    } catch (error) {
        event.context.user = {}
    }
})