<template>
    <div class="container">
        <h1>Departments</h1>
        <div class="departments-list">
            <div v-for="dept in departments" :key="dept.id" class="department-item">
                <span>{{ dept.name }}</span>
                <div class="group">
                    <a :href="'/training/departments/' + dept.slug">
                        View
                    </a>
                    <a :href="'/training/departments/' + dept.slug + '/edit'">
                        Edit
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { data: departments } = await useFetch('/api/departments')
</script>

<style scoped>
.departments-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.department-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
}

.button-group {
    display: flex;
    gap: 0.5rem;
}

.btn {
    padding: 0.5rem 1rem;
    color: white;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
}

.btn-view {
    background-color: #3b82f6;
}

.btn-edit {
    background-color: #22c55e;
}
</style>