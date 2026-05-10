<script setup>
import { Upload } from 'lucide-vue-next'

const props = defineProps({
  samples: Array,
  selectedSample: Object,
  uploadedImage: String
})

const emit = defineEmits(['sample-select', 'image-upload'])

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    emit('image-upload', file)
  }
}
</script>

<template>
  <div class="sample-picker">
    <div class="sample-grid">
      <div 
        v-for="sample in samples" 
        :key="sample.id"
        :class="['sample-card', { active: selectedSample?.id === sample.id && !uploadedImage }]"
        @click="emit('sample-select', sample.id)"
      >
        <div class="sample-preview" :class="sample.id">
          <span class="emoji">{{ 
            sample.id === 'happy' ? '😊' : 
            sample.id === 'neutral' ? '😐' : 
            sample.id === 'angry' ? '😠' : 
            sample.id === 'sad' ? '😢' : '😲' 
          }}</span>
        </div>
        <div class="sample-label">{{ sample.label }}</div>
      </div>

      <div :class="['sample-card upload-card', { active: !!uploadedImage }]">
        <label class="upload-label">
          <div v-if="uploadedImage" class="uploaded-preview" :style="{ backgroundImage: `url(${uploadedImage})` }"></div>
          <div v-else class="upload-placeholder">
            <Upload :size="20" />
          </div>
          <input type="file" class="hidden-input" accept="image/*" @change="handleFileUpload">
        </label>
        <div class="sample-label">{{ uploadedImage ? 'Custom' : 'Upload' }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sample-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.sample-card {
  width: 88px;
  height: 92px;
  padding: 8px;
  border-radius: 14px;
  background: rgba(var(--surface-rgb), 0.4);
  border: 1px solid rgba(var(--primary-rgb), 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sample-card:hover {
  transform: translateY(-2px);
  background: rgba(var(--surface-rgb), 0.6);
  border-color: rgba(var(--primary-rgb), 0.3);
}

.sample-card.active {
  background: rgba(var(--primary-rgb), 0.12);
  border-color: var(--primary);
  box-shadow: 0 0 15px rgba(var(--primary-rgb), 0.2);
}

.sample-preview {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 6px;
  background: rgba(var(--primary-rgb), 0.05);
}

.sample-preview.happy { background: linear-gradient(135deg, rgba(246, 211, 101, 0.2) 0%, rgba(253, 160, 133, 0.2) 100%); }
.sample-preview.neutral { background: linear-gradient(135deg, rgba(161, 196, 253, 0.2) 0%, rgba(194, 233, 251, 0.2) 100%); }
.sample-preview.angry { background: linear-gradient(135deg, rgba(255, 154, 158, 0.2) 0%, rgba(254, 207, 239, 0.2) 100%); }
.sample-preview.sad { background: linear-gradient(135deg, rgba(207, 217, 223, 0.2) 0%, rgba(226, 235, 240, 0.2) 100%); }
.sample-preview.surprise { background: linear-gradient(135deg, rgba(132, 250, 176, 0.2) 0%, rgba(143, 211, 244, 0.2) 100%); }

.sample-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-secondary);
}

.sample-card.active .sample-label {
  color: var(--primary);
}

.upload-card {
  position: relative;
}

.upload-label {
  cursor: pointer;
  display: block;
}

.upload-placeholder {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  background: rgba(var(--primary-rgb), 0.08);
  border-radius: 10px;
  margin-bottom: 6px;
}

.uploaded-preview {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background-size: cover;
  background-position: center;
  margin-bottom: 6px;
}

.hidden-input {
  display: none;
}

@media (max-width: 768px) {
  .sample-grid {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .sample-card {
    width: 80px;
    height: 84px;
  }
}
</style>
