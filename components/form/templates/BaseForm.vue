<template>
    <form @submit.prevent="handleSubmit" class="base-form">
        <slot></slot>
        <FormButtonGroup v-if="showActions">
            <FormSubmit :disabled="loading" @submit="handleSubmit">
                {{ submitLabel }}
            </FormSubmit>
            <FormCancel v-if="showCancel" @cancel="handleCancel">
                {{ cancelLabel }}
            </FormCancel>
        </FormButtonGroup>
    </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import FormButtonGroup from '../buttons/FormButtonGroup.vue'
import FormCancel from '../buttons/FormCancel.vue'
import FormSubmit from '../buttons/FormSubmit.vue'
import type { FormField, FormGroup } from '../types'

const formData = ref<{ [key: string]: any }>({})

const formStructure = ref<FormGroup>({
    fields: {},
    groups: {}
})

// Make formData reactive to formStructure changes
watch(formStructure, () => {
    updateFormData()
}, { deep: true })

// Updated registration method for nested structure
provide('registerFormField', (field: FormField) => {
    let target = formStructure.value
    if (field.groupPath) {
        for (const groupName of field.groupPath) {
            if (!target.groups[groupName]) {
                target.groups[groupName] = { fields: {}, groups: {} }
            }
            target = target.groups[groupName]
        }
    }
    target.fields[field.name] = field.value
    updateFormData()
})

// Function to flatten form structure into formData
const updateFormData = () => {
    formData.value = flattenFormStructure(formStructure.value)
}

const flattenFormStructure = (group: FormGroup): { [key: string]: any } => {
    let result: { [key: string]: any } = {}

    // Add direct fields
    if (Object.keys(group.fields).length > 0) {
        result = { ...group.fields }
    }

    // Add nested groups recursively
    Object.entries(group.groups).forEach(([groupName, groupData]) => {
        result[groupName] = flattenFormStructure(groupData)
    })

    return result
}

// Provide an update method for child components
provide('updateFormField', (name: string, value: any) => {
    formData.value[name] = value
})

defineProps({
    showActions: {
        type: Boolean,
        default: true
    },
    showCancel: {
        type: Boolean,
        default: false
    },
    submitLabel: {
        type: String,
        default: 'Submit'
    },
    cancelLabel: {
        type: String,
        default: 'Cancel'
    },
    loading: {
        type: Boolean,
        default: false
    },
    onSubmit: {
        type: Function,
        default: (data: any) => undefined
    },
    onCancel: {
        type: Function,
        default: () => undefined
    }
})

const emit = defineEmits(['submit', 'cancel'])

const handleSubmit = () => {
    updateFormData() // Ensure latest data
    emit('submit', formData.value)
}

const handleCancel = () => {
    emit('cancel')
}
</script>
