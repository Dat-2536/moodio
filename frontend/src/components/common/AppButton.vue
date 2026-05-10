<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary' // 'primary', 'outline'
  },
  full: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'button'
  },
  glow: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>

<template>
  <button
    :type="type"
    :class="[
      'btn',
      variant === 'primary' ? 'btn-primary' : 'btn-outline',
      { 'btn-glow': glow, 'w-full': full }
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped>
.w-full {
  width: 100%;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
