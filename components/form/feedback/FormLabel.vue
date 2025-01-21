<template>
    <label :for="htmlFor" class="form-label" :class="{ required }">
        <slot>{{ text }}</slot>
    </label>
</template>

<script setup lang="ts">
defineProps({
    htmlFor: {
        type: String,
        default: null
    },
    text: {
        type: String,
        default: null
    },
    required: { // For the associated input
        type: Boolean,
        default: false
    }
})
</script>

<style scoped>
.form-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.5rem;
}

.form-label.required:after {
    content: "*";
    color: #dc2626;
    margin-left: 0.25rem;
}
</style>