<script setup>
defineProps({
  glass: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <div :class="['card', { 'glass': glass }]">
    <slot />
  </div>
</template>

<style scoped>
/* Scoped styles for card if any */
</style>
