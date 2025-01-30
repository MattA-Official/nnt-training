export default defineNuxtRouteMiddleware(async (to) => {
    const { user } = useAuth()

    // If user is logged in and trying to access auth pages, redirect to home
    if (user.value && (to.path === '/auth/login' || to.path === '/auth/register')) {
        return navigateTo('/')
    } else if (!user.value && (to.path !== '/auth/login' && to.path !== '/auth/register')) {
        // If user is not logged in and trying to access protected pages, redirect to login
        return navigateTo('/auth/login')
    }
})
