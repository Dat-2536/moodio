<script setup>
const props = defineProps({
  active: Boolean,
  size: {
    type: Number,
    default: 8
  }
})

const grid = Array.from({ length: props.size * props.size })
const randomVal = () => (Math.random() * 2 - 1).toFixed(2)
</script>

<template>
  <div class="tensor-grid" :class="{ active }">
    <div 
      v-for="(cell, i) in grid" 
      :key="i" 
      class="tensor-cell"
      :style="{ animationDelay: `${Math.random() * 2}s` }"
    >
      <span v-if="active && Math.random() > 0.7">{{ randomVal() }}</span>
    </div>
  </div>
</template>

<style scoped>
.tensor-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 2px;
  width: 100%;
  aspect-ratio: 1;
  background: rgba(var(--primary-rgb), 0.05);
  padding: 4px;
  border-radius: 8px;
  border: 1px solid rgba(var(--primary-rgb), 0.1);
}

.tensor-cell {
  background: rgba(var(--primary-rgb), 0.1);
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.4rem;
  color: var(--primary);
  font-family: monospace;
  transition: all 0.3s ease;
}

.tensor-grid.active .tensor-cell {
  animation: flicker 2s infinite ease-in-out;
}

@keyframes flicker {
  0% { background: rgba(var(--primary-rgb), 0.1); }
  50% { background: rgba(var(--primary-rgb), 0.3); }
  100% { background: rgba(var(--primary-rgb), 0.1); }
}
</style>
