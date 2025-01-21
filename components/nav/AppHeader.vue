<template>
    <header class="header">
        <nav>
            <NuxtLink to="/" class="site-title">NNT Training</NuxtLink>
            <div class="auth-section">
                <template v-if="user">
                    <button @click="handleLogout">Logout</button>
                </template>
                <template v-else>
                    <NuxtLink to="/auth/login">Login</NuxtLink>
                </template>
            </div>
        </nav>
    </header>
</template>

<script setup lang="ts">
const { user } = useAuth()
const { logoutUser } = useFirebase()
const router = useRouter()

const handleLogout = async () => {
    try {
        await logoutUser()
        router.push('/auth/login')
    } catch (error: any) {
        console.error('Logout error:', error.message)
    }
}
</script>

<style scoped>
.header {
    padding: 1rem;
    background-color: #fff;
}

nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.auth-section {
    text-align: right;
}
</style>