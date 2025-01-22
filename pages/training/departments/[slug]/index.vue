<template>
    <div v-if="error || !data" class="">
        <!-- <ErrorDisplay :error="error" /> -->
        <p v-if="error">An error occurred: {{ error.message }}</p>
    </div>
    <div v-else class="">
        <div class="">
            <h1 class="">{{ data.name }}</h1>
            <NuxtLink v-if="isAdmin" :to="`/training/departments/${route.params.slug}/edit`" class="">
                Edit Department
            </NuxtLink>
        </div>
        <div class="">
            <p>{{ data.description }}</p>
        </div>

    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { userProfile } = useAuth() // Assuming you have a user composable
const isAdmin = computed(() => userProfile.value?.roles.admin)
const { data, error } = await useFetch(`/api/departments/find?slug=${route.params.slug}`)
</script>