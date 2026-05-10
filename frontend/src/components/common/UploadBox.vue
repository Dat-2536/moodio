<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: String,
  subtitle: String,
  accept: String,
  dragging: Boolean,
  icon: Object
})

const emit = defineEmits(['file-change', 'drop-file'])
const fileInput = ref(null)

const handleClick = () => {
  fileInput.value.click()
}

const handleChange = (e) => {
  const file = e.target.files[0]
  if (file) emit('file-change', file)
}
</script>

<template>
  <div 
    :class="['upload-container', 'card', 'glass', { dragging: dragging }]" 
    @click="handleClick"
  >
    <div class="drop-zone">
      <div class="upload-icon-circle">
        <component :is="icon" :size="32" />
      </div>
      <h3>{{ title }}</h3>
      <p>{{ subtitle }}</p>
      <slot name="action">
        <button class="btn btn-outline mt-8">Chọn từ máy tính</button>
      </slot>
      <input 
        type="file" 
        ref="fileInput" 
        hidden 
        :accept="accept" 
        @change="handleChange"
      >
    </div>
  </div>
</template>

<style scoped>
.upload-container {
  padding: 6rem 4rem;
  text-align: center;
  border: 2px dashed rgba(var(--primary-rgb), 0.2);
  cursor: pointer;
}

.upload-container.dragging {
  border-color: var(--primary);
  background: rgba(var(--primary-rgb), 0.15);
  transform: scale(1.01);
  box-shadow: 0 0 40px rgba(var(--primary-rgb), 0.4), inset 0 0 30px rgba(var(--primary-rgb), 0.2);
  animation: pulse-glow 1.5s infinite;
}

.drop-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.upload-icon-circle {
  width: 80px;
  height: 80px;
  background: rgba(var(--primary-rgb), 0.1);
  color: var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.mt-8 {
  margin-top: 2rem;
}

@keyframes pulse-glow {
  0% { box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.3); }
  50% { box-shadow: 0 0 50px rgba(var(--primary-rgb), 0.6); }
  100% { box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.3); }
}

@media (max-width: 768px) {
  .upload-container {
    padding: 4rem 2rem;
  }
}
</style>
