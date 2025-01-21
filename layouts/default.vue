<script setup lang="ts">
import AppHeader from '~/components/nav/AppHeader.vue';
import AppFooter from '~/components/nav/AppFooter.vue';

</script>

<template>
    <div>
        <AppHeader />
        <slot />
        <AppFooter />
    </div>
</template>