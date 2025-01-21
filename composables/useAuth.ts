import { useCurrentUser, useFirestore } from 'vuefire'
import { doc, onSnapshot } from 'firebase/firestore'
import type { UserProfile } from '~/types'

export const useAuth = () => {
    const user = useCurrentUser()
    const db = useFirestore()
    const userProfile = useState<UserProfile | null>('userProfile', () => null)
    const loading = useState<boolean>('loading', () => true)

    // Track if we're already subscribed
    const subscribed = ref(false)
    let unsubProfile: (() => void) | undefined

    // Watch auth state changes
    if (!subscribed.value) {
        console.log('Setting up auth state watcher')
        subscribed.value = true

        watch(user, (newUser) => {
            console.log('Auth state changed:', newUser ? 'User logged in' : 'User logged out')
            loading.value = false

            // Cleanup previous profile subscription
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
        }, { immediate: true })

        // Cleanup on component unmount
        onUnmounted(() => {
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
