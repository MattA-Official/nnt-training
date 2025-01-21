import { getApps, initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'

const initializeFirebaseAdmin = async () => {
    console.log('Apps:', getApps().length)

    if (getApps().length === 0) {
        const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
            ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
            : await import('~/service-account.json')

        initializeApp({
            credential: cert(serviceAccount)
        })
    }
}

export const serverFirestore = async () => {
    await initializeFirebaseAdmin()
    return getFirestore()
}

export const serverAuth = async () => {
    await initializeFirebaseAdmin()
    return getAuth()
}
