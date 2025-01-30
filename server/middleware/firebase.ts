import { getApps, initializeApp, cert, type App } from 'firebase-admin/app'
import { Auth, getAuth } from 'firebase-admin/auth'
import { getFirestore, Firestore } from 'firebase-admin/firestore'
import { UserProfile } from '~/types'

// Extend H3 EventContext
declare module 'h3' {
    interface H3EventContext {
        db: Firestore
        auth: Auth
        user: UserProfile | null
    }
}

let app: App | undefined

export default defineEventHandler(async (event) => {
    // Initialize Firebase Admin if not already initialized
    if (!app && getApps().length === 0) {
        try {
            const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
                ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
                : await import('~/service-account.json')

            app = initializeApp({
                credential: cert(serviceAccount)
            })

            event.context.auth = getAuth(app)
            event.context.db = getFirestore(app)

            console.log('Firebase Admin initialized successfully')
        } catch (error) {
            console.error('Firebase Admin initialization error:', error)
            throw createError({
                statusCode: 500,
                message: 'Internal server error during Firebase initialization'
            })
        }
    } else if (app) {
        event.context.auth = getAuth(app)
        event.context.db = getFirestore(app)
    }

    // Handle user authentication
    const cookie = getCookie(event, '__session') || ''

    try {
        if (cookie) {
            const decodedClaims = await event.context.auth.verifySessionCookie(cookie) // TODO: When auth is moved to API with jwt, update this
            const userDoc = await event.context.db.collection('users').doc(decodedClaims.uid).get()

            if (!userDoc.exists) {
                event.context.user = null
                return
            }

            event.context.user = userDoc.data() as UserProfile
        } else {
            event.context.user = null
        }
    } catch (error) {
        event.context.user = null
    }
})
