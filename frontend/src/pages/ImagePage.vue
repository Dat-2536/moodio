<script setup>
import { onMounted, onUnmounted } from 'vue'
import { Upload, ScanFace } from 'lucide-vue-next'
import PageHeader from '@/components/common/PageHeader.vue'
import AppButton from '@/components/common/AppButton.vue'
import UploadBox from '@/components/common/UploadBox.vue'
import VisionFrame from '@/components/vision/VisionFrame.vue'
import FaceOverlay from '@/components/vision/FaceOverlay.vue'
import FaceResultList from '@/components/vision/FaceResultList.vue'
import { useImageAnalysis } from '@/composables/useImageAnalysis'
import { useDragDrop } from '@/composables/useDragDrop'

const { 
  analysisResults, 
  uploadedImage, 
  isAnalyzing, 
  imageSize,
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
      title="Moodio Image Analysis" 
      subtitle="Tải ảnh lên hoặc Ctrl+V để phân tích biểu cảm với ResNet-18."
    />

    <div v-if="!uploadedImage" class="container">
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

    <div v-else class="container">
      <div class="vision-grid relative-container"
           :class="{ dragging: isDragging }"
           @dragover.prevent @dragenter="handleDragEnter" @dragleave="handleDragLeave"
           @drop="handleDrop">
        
        <div v-if="isDragging" class="drop-overlay">
          <div class="drop-overlay-content">
            <Upload :size="48" />
            <p>Thả ảnh vào đây để thay đổi</p>
          </div>
        </div>

        <div class="vision-main">
          <VisionFrame :is-analyzing="isAnalyzing">
            <div class="media-frame">
              <img :src="uploadedImage" class="analyzed-img">
              
              <FaceOverlay 
                v-if="analysisResults.length > 0"
                :faces="analysisResults"
                :media-size="imageSize"
              />
            </div>
          </VisionFrame>
        </div>

        <div class="vision-sidebar card glass p-6">
          <div class="sidebar-header border-b border-white/10 pb-4 mb-6">
             <div class="flex items-center justify-between">
                <h3 class="text-lg font-black uppercase tracking-tighter">Analysis Results</h3>
                <div class="flex gap-2">
                  <span v-if="analysisResults.length > 0" class="px-2 py-1 bg-primary/20 text-primary rounded text-[10px] font-bold">
                    {{ analysisResults.length }} DETECTED
                  </span>
                </div>
             </div>
          </div>

          <FaceResultList 
            :faces="analysisResults"
            :is-analyzing="isAnalyzing"
          />

          <div class="mt-8 flex flex-col gap-3">
            <AppButton variant="outline" full @click="resetImage">
              Tải ảnh khác
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
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

.mt-8 { margin-top: 2rem; }
</style>
