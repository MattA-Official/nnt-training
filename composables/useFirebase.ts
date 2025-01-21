import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from 'firebase/auth'
import { getFirestore, doc, setDoc, query, collection, where, getDocs, updateDoc } from 'firebase/firestore'
import type { UserProfile } from '~/types'

export const useFirebase = () => {
    const auth = getAuth()
    const db = getFirestore()

    const generateUniqueSlug = async (baseSlug: string): Promise<string> => {
        console.log('Generating unique slug from:', baseSlug)
        let slug = baseSlug
        let counter = 0

        while (true) {
            const currentSlug = counter === 0 ? slug : `${slug}-${counter}`

            // Check if slug exists
            const q = query(
                collection(db, 'users'),
                where('slug', '==', currentSlug)
            )
            const querySnapshot = await getDocs(q)

            if (querySnapshot.empty) {
                console.log('Found unique slug:', currentSlug)
                return currentSlug
            }

            counter++
        }
    }

    const registerUser = async (email: string, password: string, profile: Partial<UserProfile>) => {
        console.log('Starting registration for email:', email)
        const { user } = await createUserWithEmailAndPassword(auth, email, password)
        console.log('Firebase Auth user created:', user.uid)

        const baseSlug = (profile.displayName || '').toLowerCase().replace(/\s+/g, '-')
        const uniqueSlug = await generateUniqueSlug(baseSlug)

        // Create user profile in Firestore
        const userProfile: UserProfile = {
            uid: user.uid,
            displayName: profile.displayName || '',
            email: user.email || '',
            slug: uniqueSlug,
            roles: {
                trainer: false,
                admin: false
            },
            profile: {
                photoURL: '',
                bio: '',
                contactNumber: ''
            },
            metadata: {
                createdAt: new Date(),
                lastLoginAt: new Date(),
                lastUpdatedAt: new Date()
            }
        }

        console.log('Attempting to create Firestore profile for user:', user.uid)
        await setDoc(doc(db, 'users', user.uid), userProfile)
        console.log('Firestore profile created successfully for user:', user.uid)
        return userProfile
    }

    const loginUser = async (email: string, password: string) => {
        const result = await signInWithEmailAndPassword(auth, email, password)

        // Update lastLoginAt in Firestore
        await updateDoc(doc(db, 'users', result.user.uid), {
            'metadata.lastLoginAt': new Date()
        })

        return result
    }

    const logoutUser = async () => {
        await signOut(auth)
    }

    return {
        auth,
        db,
        registerUser,
        loginUser,
        logoutUser
    }
}
