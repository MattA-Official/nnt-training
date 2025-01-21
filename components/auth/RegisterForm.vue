<template>
    <BaseForm @submit="handleSubmit" @cancel="handleCancel">
        <FormInput name="displayName" label="Display Name" placeholder="Enter your full name" required />
        <FormInput name="email" label="Email" placeholder="Enter your email" required />
        <FormInput name="password" label="Password" placeholder="Enter your password" required />
    </BaseForm>
</template>

<script setup lang="ts">
import FormInput from '../form/inputs/FormInput.vue'
import BaseForm from '../form/templates/BaseForm.vue'

const { registerUser } = useFirebase()
const router = useRouter()

const processing = ref(false)

const handleSubmit = async (data: any) => {
    if (processing.value) {
        console.log('Registration already in progress, preventing duplicate submission')
        return
    }

    console.log('Starting registration process with data:', { ...data, password: '[REDACTED]' })
    processing.value = true

    try {
        const result = await registerUser(data.email, data.password, {
            displayName: data.displayName
        })
        console.log('Registration successful, user profile created:', result.uid)
        await router.push('/')
    } catch (error: any) {
        console.error('Registration error:', {
            code: error.code,
            message: error.message,
            stack: error.stack
        })
    } finally {
        processing.value = false
    }
}

const handleCancel = () => {
    router.push('/')
}
</script>
