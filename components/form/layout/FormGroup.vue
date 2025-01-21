<template>
    <div class="form-group" :class="[type, outline ? 'outline' : '']">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { inject, provide, computed } from 'vue'

const props = defineProps({
    label: {
        type: String,
        default: null
    },
    type: {
        type: String,
        default: 'row',
        validator: (value: string) => ['row', 'column'].includes(value)
    },
    outline: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        default: null
    }
})

const parentGroupPath = inject('groupPath', [] as string[])
const currentGroupPath = computed(() =>
    props.name ? [...parentGroupPath, props.name] : parentGroupPath
)

// Provide group path to child components
provide('groupPath', currentGroupPath.value)
</script>

<style scoped>
.form-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
}

.form-group.column {
    flex-direction: column;
    gap: 0;
}

.form-group.outline {
    /* TODO: change this to be easily configurable */
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    padding: 0.5rem;
}
</style>