<template>
    <div class="container">
        <DepartmentHeader v-if="department" :department="department">
            <template #title>Edit {{ department.name }}</template>
        </DepartmentHeader>

        <div v-if="fetchError" class="error">
            Failed to load department
        </div>

        <div v-else-if="!department" class="loading">
            Loading...
        </div>

        <template v-else>
            <DepartmentForm type="edit" :initial-data="department" @submit="handleSubmit" @cancel="handleCancel" />

            <div v-if="error" class="error">
                {{ error }}
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import DepartmentForm from '~/components/departments/DepartmentForm.vue'
import DepartmentHeader from '~/components/departments/DepartmentHeader.vue'
import type { Department, UpdateDepartmentForm } from '~/types'

const route = useRoute()
const router = useRouter()

const { data: department, error: fetchError } = await useFetch<Department>(`/api/departments/find?slug=${route.params.slug}`)

const error = ref<string | null>(null)
const isSubmitting = ref(false)

const handleSubmit = async (updatedDepartment: UpdateDepartmentForm) => {
    if (isSubmitting.value) return

    console.log(updatedDepartment)

    try {
        isSubmitting.value = true
        error.value = null

        await $fetch(`/api/departments/${department.value?.id}`, {
            method: 'PATCH',
            body: updatedDepartment
        })

        await router.push(`/training/departments/${updatedDepartment.slug}`)
    } catch (err: any) {
        error.value = err.message || 'Failed to update department'
    } finally {
        isSubmitting.value = false
    }
}

const handleCancel = () => {
    router.push(`/training/departments/${route.params.slug}`)
}

definePageMeta({
    middleware: ['auth', 'admin']
})
</script>

<style scoped>
.error {
    color: #ef4444;
    padding: 1rem;
    border: 1px solid #ef4444;
    border-radius: 0.375rem;
    margin: 1rem 0;
}

.loading {
    text-align: center;
    padding: 2rem;
    color: #6b7280;
}
</style>