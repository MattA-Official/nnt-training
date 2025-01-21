<template>
    <BaseFormButton type="submit" :disabled="disabled" @click="handleSubmit">
        Submit
    </BaseFormButton>
</template>

<script setup lang="ts">
import BaseFormButton from './BaseFormButton.vue';

defineProps({
    onSubmit: {
        type: Function,
        required: true
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['submit'])

const handleSubmit = () => {
    emit('submit')
}
</script>