<script setup lang="ts">
import LoginForm from '~/components/auth/LoginForm.vue';

definePageMeta({
    middleware: ['auth']
})
</script>

<template>
    <div>
        <h1>Login</h1>
        <LoginForm />
        <p>Don't have an account? <a href="/auth/register">Register</a></p>
    </div>
</template>