<template>
    <div class="form-section">
        <div class="form-section__header" v-if="title || $slots.title">
            <h3 class="form-section__title">
                <slot name="title">{{ title }}</slot>
            </h3>
            <p class="form-section__description" v-if="description || $slots.description">
                <slot name="description">{{ description }}</slot>
            </p>
        </div>
        <div class="form-section__content">
            <slot></slot>
        </div>
        <FormDivider />
    </div>
</template>

<script setup lang="ts">
import FormDivider from './FormDivider.vue'

defineProps({
    title: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    }
})
</script>