<template>
    <BaseFormButton type="reset" :disabled="disabled" @click="handleReset">
        Reset
    </BaseFormButton>
</template>

<script setup lang="ts">
import BaseFormButton from './BaseFormButton.vue';

defineProps({
    onReset: {
        type: Function,
        required: true
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['reset'])

const handleReset = () => {
    emit('reset')
}
</script>