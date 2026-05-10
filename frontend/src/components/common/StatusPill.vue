<script setup>
defineProps({
  active: {
    type: Boolean,
    default: false
  },
  text: String
})
</script>

<template>
  <div class="status-pill">
    <span :class="['pulse-dot', { active }]"></span>
    {{ text }}
  </div>
</template>

<style scoped>
.status-pill {
  padding: 0.5rem 1rem;
  background: rgba(var(--primary-rgb), 0.1);
  border: 1px solid rgba(var(--primary-rgb), 0.2);
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: var(--primary);
  border-radius: 50%;
  animation: pulse-dot 1.5s infinite;
}

.pulse-dot:not(.active) {
  animation: none;
  background: #94a3b8;
}

@keyframes pulse-dot {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0.7); }
  70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(var(--primary-rgb), 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0); }
}
</style>
