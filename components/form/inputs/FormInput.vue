<template>
    <FormGroup outline>
        <div v-if="icon && !loading" class="input-icon">
            <i :class="icon"></i>
        </div>
        <div v-if="loading" class="input-icon">
            <div class="" role="status">
                <span class="hidden">Loading...</span>
            </div>
        </div>

        <input :id="id" :name="name" :placeholder="placeholder" :required="required" :disabled="disabled"
            :value="modelValue" @input="onInput" @change="onChange" class="form-input" :class="[varient, color]" />
    </FormGroup>
</template>

<script setup lang="ts">
import { inject, onMounted, watch } from 'vue'
import FormGroup from '../layout/FormGroup.vue';
import type { FormField } from '../types';

const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: ''
    },
    id: {
        type: String,
        default: null
    },
    name: {
        type: String,
        default: null
    },
    placeholder: {
        type: String,
        default: null
    },
    required: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    icon: {
        type: String,
        default: null
    },
    loading: {
        type: Boolean,
        default: false
    },
    varient: {
        type: String,
        default: 'outline',
        validator: (value: string) => ['outline'].includes(value) // styling varients
    },
    color: {
        type: String,
        default: 'primary',
        validator: (value: string) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info'].includes(value) // color varients
    },
    error: { // TODO: display error message
        type: String,
        default: null
    }
})

const emit = defineEmits(['update:modelValue', 'change'])

const groupPath = inject('groupPath', [] as string[])
const registerFormField = inject('registerFormField') as (field: FormField) => void

onMounted(() => {
    if (props.name) {
        registerFormField({
            name: props.name,
            value: props.modelValue,
            groupPath
        })
    }
})

// Watch for modelValue changes
watch(() => props.modelValue, (newValue) => {
    if (props.name) {
        registerFormField({
            name: props.name,
            value: newValue,
            groupPath
        })
    }
})

const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    const value = target.value.trim()

    emit('update:modelValue', value)

    if (props.name) {
        registerFormField({
            name: props.name,
            value,
            groupPath
        })
    }
}

// Simplify onChange to use onInput
const onChange = (event: Event) => {
    onInput(event)
    emit('change', (event.target as HTMLInputElement).value)
}
</script>