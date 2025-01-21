<template>
    <BaseForm @submit="handleSubmit" @cancel="handleCancel">
        <FormRow name="personal">
            <FormInput name="firstName" label="First Name" placeholder="Enter first name" />
            <FormInput name="lastName" label="Last Name" placeholder="Enter last name" />
        </FormRow>
        <FormGroup name="contact">
            <FormInput name="email" label="Email" placeholder="Enter email" />
            <FormColumn name="address">
                <FormInput name="street" label="Street" placeholder="Enter street" />
                <FormInput name="city" label="City" placeholder="Enter city" />
            </FormColumn>
        </FormGroup>
    </BaseForm>

    <pre>{{ JSON.stringify(formData, null, 2) }}</pre>

    <div v-if="!user">
        <a href="/auth/login">Login</a>
        <br />
        <a href="/auth/register">Register</a>
    </div>
    <div v-else>
        <button @click="handleLogout">Logout</button>
    </div>
</template>

<script setup lang="ts">
import FormInput from '~/components/form/inputs/FormInput.vue';
import FormColumn from '~/components/form/layout/FormColumn.vue';
import FormGroup from '~/components/form/layout/FormGroup.vue';
import FormRow from '~/components/form/layout/FormRow.vue';
import BaseForm from '~/components/form/templates/BaseForm.vue';

const formData = ref({}) // Fix: Initialize as empty object, not string

const { user } = useAuth()
const { logoutUser } = useFirebase()
const router = useRouter()

const handleSubmit = (data: any) => {
    console.log('Form submitted with data:', data)
    formData.value = data // Add this line to update the displayed data
}

const handleCancel = () => {
    console.log('Form cancelled')
}

const handleLogout = async () => {
    try {
        await logoutUser()
        router.push('/auth/login')
    } catch (error: any) {
        console.error('Logout error:', error.message)
    }
}
</script>