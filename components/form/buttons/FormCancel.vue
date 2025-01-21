<template>
    <BaseFormButton type="button" :disabled="disabled" @click="handleCancel">
        Cancel
    </BaseFormButton>
</template>

<script setup lang="ts">
import BaseFormButton from './BaseFormButton.vue';

defineProps({
    onCancel: {
        type: Function,
        required: true
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['cancel'])

const handleCancel = () => {
    emit('cancel')
}
</script>