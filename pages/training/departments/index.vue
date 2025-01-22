<script setup lang="ts">
import DepartmentHeader from '~/components/departments/DepartmentHeader.vue';
import DepartmentList from '~/components/departments/DepartmentList.vue';

const { data: departments } = await useFetch('/api/departments', {
    transform: (departments) => departments.map(dept => ({
        ...dept,
        metadata: {
            ...dept.metadata,
            createdAt: new Date(dept.metadata.createdAt),
            lastUpdatedAt: dept.metadata.lastUpdatedAt ? new Date(dept.metadata.lastUpdatedAt) : undefined
        }
    }))
})
</script>

<template>
    <div class="container">
        <DepartmentHeader title="Departments" description="Manage training departments">
            <NuxtLink to="/training/departments/new" class="">Create Department</NuxtLink>
        </DepartmentHeader>

        <DepartmentList :departments="departments || []" />
    </div>
</template>

<style scoped></style>