<script setup lang="ts">
import LoginForm from '~/components/auth/LoginForm.vue';

definePageMeta({
    middleware: ['auth']
})

const { redirect } = useRoute().query
const redirectPath = computed(() => typeof redirect === 'string' ? redirect : undefined)

console.log('Redirect:', redirect)
</script>

<template>
    <div>
        <LoginForm :redirect="redirectPath" />
        <p>Don't have an account? <a href="/auth/register">Register</a></p>
    </div>
</template>