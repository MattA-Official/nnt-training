import { getCurrentUser } from 'vuefire'

export default defineNuxtRouteMiddleware(async (to) => {
    const user = await getCurrentUser()

    // If user is logged in and trying to access auth pages, redirect to home
    if (user && (to.path === '/auth/login' || to.path === '/auth/register')) {
        return navigateTo('/')
    } else if (!user && to.meta.requiresAuth) {
        // If user is not logged in and trying to access protected pages, redirect to login
        return navigateTo('/auth/login')
    }
})
