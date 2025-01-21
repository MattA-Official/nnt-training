import { doc, onSnapshot } from 'firebase/firestore'
import type { User } from 'firebase/auth'
import type { UserProfile } from '~/types'

export const useAuth = () => {
    const { auth, db } = useFirebase()

    const user = useState<User | null>('user', () => null)
    const userProfile = useState<UserProfile | null>('userProfile', () => null)
    const loading = useState<boolean>('loading', () => true)

    // Track if we're already subscribed
    const subscribed = ref(false)
    let unsubProfile: (() => void) | undefined

    // Watch auth state changes
    if (!subscribed.value) {
        console.log('Setting up auth state listener')
        subscribed.value = true
        const unsubAuth = auth.onAuthStateChanged(async (newUser) => {
            console.log('Auth state changed:', newUser ? 'User logged in' : 'User logged out')
            user.value = newUser
            loading.value = false

            // Cleanup previous profile subscription if it exists
            if (unsubProfile) {
                console.log('Cleaning up previous profile subscription')
                unsubProfile()
                unsubProfile = undefined
            }

            if (newUser) {
                console.log('Setting up Firestore profile listener for user:', newUser.uid)
                // Watch user profile in Firestore
                unsubProfile = onSnapshot(doc(db, 'users', newUser.uid), (doc) => {
                    if (doc.exists()) {
                        console.log('Firestore profile updated for user:', newUser.uid)
                        userProfile.value = doc.data() as UserProfile
                    }
                })
            } else {
                userProfile.value = null
            }
        })

        // Cleanup on component unmount
        onUnmounted(() => {
            unsubAuth()
            if (unsubProfile) {
                unsubProfile()
            }
            subscribed.value = false
        })
    }

    return {
        user,
        userProfile,
        loading
    }
}
