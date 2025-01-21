<template>
    <BaseForm @submit="handleSubmit" @cancel="handleCancel">
        <FormGroup name="personal">
            <FormInput name="firstName" label="First Name" placeholder="Enter first name" />
            <FormInput name="lastName" label="Last Name" placeholder="Enter last name" />
        </FormGroup>
        <FormGroup name="contact">
            <FormInput name="email" label="Email" placeholder="Enter email" />
            <FormGroup name="address">
                <FormInput name="street" label="Street" placeholder="Enter street" />
                <FormInput name="city" label="City" placeholder="Enter city" />
            </FormGroup>
        </FormGroup>
    </BaseForm>

    <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
</template>

<script setup lang="ts">
import FormInput from '~/components/form/inputs/FormInput.vue';
import FormGroup from '~/components/form/layout/FormGroup.vue';
import BaseForm from '~/components/form/templates/BaseForm.vue';

const formData = ref({}) // Fix: Initialize as empty object, not string

const handleSubmit = (data: any) => {
    console.log('Form submitted with data:', data)
    formData.value = data // Add this line to update the displayed data
}

const handleCancel = () => {
    console.log('Form cancelled')
}
</script>