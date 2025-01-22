<script setup lang="ts">
import type { Department } from '~/types'
import DepartmentCard from './DepartmentCard.vue';

defineProps({
    departments: {
        type: Array as () => Department[],
        required: true
    }
})
</script>

<template>
    <div class="departments-list">
        <DepartmentCard v-for="department in departments" :key="department.id" :department="department" />
    </div>
</template>

<style scoped>
.departments-list {
    display: flex;
    gap: 1rem;
    flex-direction: column;
    width: 100%;
}
</style>
