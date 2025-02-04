<template>
    <BaseForm @submit="handleSubmit" @cancel="handleCancel">
        <FormInput name="email" label="Email" placeholder="Enter your email" required />
        <FormInput name="password" label="Password" placeholder="Enter your password" required />
    </BaseForm>
</template>

<script setup lang="ts">
import FormInput from '../form/inputs/FormInput.vue'
import BaseForm from '../form/templates/BaseForm.vue'

const props = defineProps<{
    redirect?: string
}>()

const { loginUser } = useFirebase()
const router = useRouter()

const processing = ref(false)

const handleSubmit = async (data: any) => {
    console.log('Login form data received:', { ...data, password: '[REDACTED]' })

    if (!data.email || !data.password) {
        console.error('Missing email or password')
        return
    }

    if (processing.value) {
        return
    }

    processing.value = true
    try {
        await loginUser(data.email, data.password)
        await router.push(props.redirect || '/')
    } catch (error: any) {
        console.error('Login error:', {
            code: error.code,
            message: error.message
        })
    } finally {
        processing.value = false
    }
}

const handleCancel = () => {
    router.push(props.redirect || '/')
}
</script>
