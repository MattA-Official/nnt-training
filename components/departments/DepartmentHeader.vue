<script setup lang="ts">
import type { Department } from '~/types'

defineProps<{
    department?: Department
    title?: string
    description?: string
}>()
</script>

<template>
    <div class="department-header">
        <h1 class="title">
            <slot name="title">
                {{ department?.name || title }}
            </slot>
        </h1>
        <p class="description">
            <slot name="description">
                {{ department?.description || description }}
            </slot>
        </p>
        <slot></slot>
    </div>
</template>

<style scoped>
.department-header {
    margin-bottom: 2rem;
}

.title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.description {
    color: #666;
}
</style>
