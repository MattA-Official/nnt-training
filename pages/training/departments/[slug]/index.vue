<template>
    <div v-if="error || !data" class="">
        <!-- <ErrorDisplay :error="error" /> -->
        <p v-if="error">An error occurred: {{ error.message }}</p>
    </div>
    <div v-else class="">
        <h1 class="">{{ data.name }}</h1>
        <div class="">
            <p>{{ data.description }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data, error } = await useFetch(`/api/departments/find?slug=${route.params.slug}`)
</script>