<template>
    <button :type="type" :disabled="disabled || loading" :aria-disabled="disabled || loading" class="base-form-button"
        :class="{ 'loading': loading }">
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
defineProps({
    type: {
        type: String as () => 'button' | 'submit' | 'reset',
        default: 'button',
        validator: (value: string) => ['button', 'submit', 'reset'].includes(value)
    },
    disabled: {
        type: Boolean,
        default: false
    },
    loading: {
        type: Boolean,
        default: false
    }
})
</script>

<style scoped>
button {
    /* TODO */
}
</style>