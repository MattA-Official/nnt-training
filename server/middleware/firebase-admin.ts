import { getApps, initializeApp, cert, type App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

let app: App | undefined

export default defineEventHandler(async (event) => {
  if (!app && getApps().length === 0) {
    try {
      // Load service account from environment variable or file
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
        : await import('~/service-account.json')

      // Initialize Firebase Admin
      app = initializeApp({
        credential: cert(serviceAccount)
      })

      // Add Firebase services to event context
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
  }
})