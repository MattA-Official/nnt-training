export default defineNuxtRouteMiddleware(async (to) => {
    const { user, userProfile } = useAuth()

    // check if user is admin
    if (user.value && !userProfile.value?.roles.admin) {
        return navigateTo('/')
    }
})
