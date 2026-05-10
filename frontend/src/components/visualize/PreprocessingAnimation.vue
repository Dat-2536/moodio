<script setup>
import TensorGrid from './TensorGrid.vue'
import { ArrowRight } from 'lucide-vue-next'

const props = defineProps({
  imageSrc: String,
  isActive: Boolean,
  sampleId: String
})
</script>

<template>
  <div class="preprocessing-container">
    <div class="flow-wrapper">
      <div class="flow-item glass">
        <div class="item-label">Original Crop</div>
        <div class="crop-preview" :class="sampleId">
          <img v-if="imageSrc" :src="imageSrc" />
          <span v-else class="emoji">{{ 
            sampleId === 'happy' ? '😊' : 
            sampleId === 'neutral' ? '😐' : 
            sampleId === 'angry' ? '😠' : 
            sampleId === 'sad' ? '😢' : '😲' 
          }}</span>
        </div>
      </div>

      <div class="flow-arrow" :class="{ active: isActive }">
        <ArrowRight :size="24" />
        <span class="process-text">Resize & Norm</span>
      </div>

      <div class="flow-item glass">
        <div class="item-label">224x224 Tensor</div>
        <div class="tensor-wrapper">
          <TensorGrid :active="isActive" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preprocessing-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flow-wrapper {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  max-width: 600px;
  width: 100%;
}

.flow-item {
  flex: 1;
  padding: 1rem;
  border-radius: 16px;
  text-align: center;
  animation: float 4s infinite ease-in-out;
}

.item-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.75rem;
}

.crop-preview {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--primary-rgb), 0.05);
}

.crop-preview.happy { background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); }
.crop-preview.neutral { background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%); }
.crop-preview.angry { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%); }
.crop-preview.sad { background: linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%); }
.crop-preview.surprise { background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); }

.crop-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.emoji { font-size: 3rem; }

.flow-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text-secondary);
  gap: 0.5rem;
  opacity: 0.3;
  transition: all 0.5s ease;
}

.flow-arrow.active {
  opacity: 1;
  color: var(--primary);
  animation: pulse 1.5s infinite;
}

.process-text {
  font-size: 0.7rem;
  font-weight: 700;
  white-space: nowrap;
}

.tensor-wrapper {
  width: 100%;
  aspect-ratio: 1;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@media (max-width: 600px) {
  .flow-wrapper {
    flex-direction: column;
    gap: 1rem;
  }
  .flow-arrow {
    transform: rotate(90deg);
  }
}
</style>
