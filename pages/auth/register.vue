<script setup lang="ts">
import RegisterForm from '~/components/auth/RegisterForm.vue';

definePageMeta({
    middleware: ['auth']
})
</script>

<template>
    <div>
        <h1>Register</h1>
        <RegisterForm />
        <p>Already have an account? <a href="/auth/login">Login</a></p>
    </div>
</template>