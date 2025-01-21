<script setup lang="ts">
import FormGroup from './FormGroup.vue';

defineProps({
    name: {
        type: String,
        default: null
    },
    outline: {
        type: Boolean,
        default: false
    }
})
</script>

<template>
    <FormGroup :name="name" type="column" :outline="outline">
        <slot></slot>
    </FormGroup>
</template>