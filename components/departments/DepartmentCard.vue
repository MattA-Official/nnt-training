<template>
    <div class="department-card">
        <div>
            <div class="card-header">
                <i :class="department.icon" class="icon" />
                <h3 class="title">{{ department.name }}</h3>
            </div>
            <p class="description">{{ department.description }}</p>
        </div>
        <div class="actions">
            <NuxtLink :to="`/training/departments/${department.slug}`" class="">View</NuxtLink>
            <NuxtLink :to="`/training/departments/${department.slug}/edit`" class="">Edit</NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Department } from '~/types'

defineProps<{
    department: Department
}>()
</script>

<style scoped>
.department-card {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    padding: 1rem;
    align-items: center;
    justify-content: space-between;
}

.actions {
    display: flex;
    gap: 1rem;
}
</style>