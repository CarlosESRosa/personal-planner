<template>
    <UButton :color="color" :variant="variant" :size="size" :loading="loading" :disabled="disabled" v-bind="$attrs">
        <slot />
    </UButton>
</template>

<script setup>
defineProps({
    color: {
        type: String,
        default: 'primary'
    },
    variant: {
        type: String,
        default: 'solid'
    },
    size: {
        type: String,
        default: 'md'
    },
    loading: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    }
})
</script>