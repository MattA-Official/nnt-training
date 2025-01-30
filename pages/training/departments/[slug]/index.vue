<template>
    <div v-if="error || !data" class="">
        <!-- <ErrorDisplay :error="error" /> -->
        <p v-if="error">An error occurred: {{ error.message }}</p>
    </div>
    <div v-else class="">
        <div class="">
            <h1 class="">{{ data.name }}</h1>
            <NuxtLink v-if="userProfile?.roles.admin" :to="`/training/departments/${route.params.slug}/edit`" class="">
                Edit Department
            </NuxtLink>
        </div>
        <div class="">
            <p>{{ data.description }}</p>
            <p>Created: {{ data.metadata.createdAt.toDateString() }}</p>
            <p v-if="data.metadata.lastUpdatedAt">Last Updated: {{ data.metadata.lastUpdatedAt.toDateString() }}</p>

            <NuxtLink to="/training/departments" class="">Back to Departments</NuxtLink>
        </div>

    </div>
</template>

<script setup lang="ts">
import type { Department } from '~/types';

const route = useRoute()
const { userProfile } = useAuth()

const { data, error } = await useFetch(`/api/departments/${route.params.slug}`, {
    transform: (data: Department) => ({
        ...data,
        metadata: {
            ...data.metadata,
            createdAt: new Date(data.metadata.createdAt),
            lastUpdatedAt: data.metadata.lastUpdatedAt ? new Date(data.metadata.lastUpdatedAt) : undefined
        }
    })
})

definePageMeta({
    middleware: ['auth']
})
</script>