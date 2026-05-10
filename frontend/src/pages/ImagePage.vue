<script setup>
import { onMounted, onUnmounted } from 'vue'
import { Upload } from 'lucide-vue-next'
import PageHeader from '@/components/common/PageHeader.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'
import UploadBox from '@/components/common/UploadBox.vue'
import VisionFrame from '@/components/vision/VisionFrame.vue'
import EmotionResultCard from '@/components/vision/EmotionResultCard.vue'
import { useImageAnalysis } from '@/composables/useImageAnalysis'
import { useDragDrop } from '@/composables/useDragDrop'

const { 
  analysisResults, 
  uploadedImage, 
  isAnalyzing, 
  processImageFile, 
  resetImage 
} = useImageAnalysis()

const { 
  isDragging, 
  handleDragEnter, 
  handleDragLeave, 
  handleDrop 
} = useDragDrop(processImageFile)

const handlePaste = (e) => {
  const items = e.clipboardData.items
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      const file = items[i].getAsFile()
      processImageFile(file)
      break
    }
  }
}

onMounted(() => {
  window.addEventListener('paste', handlePaste)
})

onUnmounted(() => {
  window.removeEventListener('paste', handlePaste)
})
</script>

<template>
  <section class="service-page">
    <PageHeader 
      title="Image Analysis" 
      subtitle="Tải ảnh lên hoặc Ctrl+V để phân tích biểu cảm chi tiết."
    />

    <div v-if="!uploadedImage">
      <UploadBox 
        title="Kéo thả hoặc dán (Ctrl+V) ảnh"
        subtitle="Hỗ trợ JPG, PNG, WEBP (Tối đa 5MB)"
        accept="image/*"
        :dragging="isDragging"
        :icon="Upload"
        @file-change="processImageFile"
        @dragover.prevent
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
      />
    </div>

    <div v-else :class="['vision-grid', 'relative-container', { dragging: isDragging }]"
         @dragover.prevent @dragenter="handleDragEnter" @dragleave="handleDragLeave"
         @drop="handleDrop">
      
      <div v-if="isDragging" class="drop-overlay">
        <div class="drop-overlay-content">
          <Upload :size="48" />
          <p>Thả ảnh vào đây để thay đổi</p>
        </div>
      </div>

      <VisionFrame :is-analyzing="isAnalyzing">
        <img :src="uploadedImage" class="analyzed-img">
        <div v-if="analysisResults" class="face-overlay">
          <div v-for="face in analysisResults.faces" :key="face.face_id" class="face-box" 
                :style="{ 
                  top: face.bounding_box.top + 'px', 
                  left: face.bounding_box.left + 'px', 
                  width: face.bounding_box.width + 'px', 
                  height: face.bounding_box.height + 'px' 
                }">
            <div class="face-label">
              {{ face.emotion }} ({{ Math.round(face.confidence * 100) }}%)
            </div>
          </div>
        </div>
      </VisionFrame>

      <div class="vision-sidebar">
        <AppCard class="sidebar-card" v-if="analysisResults">
          <h3>Face Summary</h3>
          <div class="face-summary-list">
            <div v-for="face in analysisResults.faces" :key="face.face_id" class="face-summary-item">
              <div class="face-id">Face #{{ face.face_id + 1 }}</div>
              <div class="face-res">
                <strong>{{ face.emotion }}</strong> - {{ Math.round(face.confidence * 100) }}%
              </div>
            </div>
          </div>
        </AppCard>
        
        <EmotionResultCard 
          v-else
          title="Analysis Status"
          :emotion="null"
        >
          <template #placeholder>
            {{ isAnalyzing ? 'Đang phân tích hình ảnh...' : 'Sẵn sàng phân tích' }}
          </template>
        </EmotionResultCard>

        <AppButton variant="outline" full @click="resetImage">
          Tải ảnh khác
        </AppButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.face-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.face-box {
  position: absolute;
  border: 2px solid var(--primary);
  border-radius: 4px;
  box-shadow: 0 0 15px rgba(var(--primary-rgb), 0.5);
  transition: all 0.3s ease;
}

.face-label {
  position: absolute;
  top: -25px;
  left: -2px;
  background: var(--primary);
  color: white;
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: bold;
  border-radius: 4px 4px 0 0;
  white-space: nowrap;
}

.vision-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-card {
  padding: 2rem;
}

.sidebar-card h3 {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.face-summary-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(var(--primary-rgb), 0.1);
}

.face-id {
  font-weight: 700;
  color: var(--primary);
}

.relative-container {
  position: relative;
}

.drop-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(var(--primary-rgb), 0.15);
  backdrop-filter: blur(8px);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px dashed var(--primary);
  border-radius: 20px;
  box-shadow: inset 0 0 50px rgba(var(--primary-rgb), 0.4);
  pointer-events: none;
}

.drop-overlay-content {
  text-align: center;
  color: var(--primary);
  font-weight: 700;
}

.drop-overlay-content p {
  margin-top: 1rem;
  font-size: 1.2rem;
}
</style>
