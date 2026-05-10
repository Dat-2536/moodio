<script setup>
import { ref } from 'vue'
import { Film } from 'lucide-vue-next'
import PageHeader from '@/components/common/PageHeader.vue'
import AppButton from '@/components/common/AppButton.vue'
import StatusPill from '@/components/common/StatusPill.vue'
import VisionFrame from '@/components/vision/VisionFrame.vue'
import EmotionResultCard from '@/components/vision/EmotionResultCard.vue'
import { useVideoAnalysis } from '@/composables/useVideoAnalysis'
import { useDragDrop } from '@/composables/useDragDrop'

const videoRef = ref(null)
const canvasRef = ref(null)

const { 
  videoUrl, 
  isAnalyzing, 
  currentEmotion, 
  handleVideoUpload, 
  startVideoAnalysis, 
  stopVideoAnalysis,
  resetVideo
} = useVideoAnalysis()

const { 
  isDragging, 
  handleDragEnter, 
  handleDragLeave, 
  handleDrop 
} = useDragDrop(handleVideoUpload)

const onPlay = () => {
  startVideoAnalysis(videoRef, canvasRef)
}

const onPause = () => {
  stopVideoAnalysis()
}
</script>

<template>
  <section class="service-page">
    <PageHeader 
      title="Video Analysis" 
      subtitle="Tải lên video để phân tích cảm xúc từng khung hình."
    >
      <template #right>
        <StatusPill 
          v-if="videoUrl" 
          :active="isAnalyzing" 
          :text="isAnalyzing ? 'Analyzing Frames...' : 'Video Loaded'" 
        />
      </template>
    </PageHeader>

    <div v-if="!videoUrl">
      <UploadBox 
        title="Chọn Video để phân tích"
        subtitle="Hỗ trợ MP4, WebM (Tối đa 50MB)"
        accept="video/*"
        :dragging="isDragging"
        :icon="Film"
        @file-change="handleVideoUpload"
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
          <Film :size="48" />
          <p>Thả video vào đây để thay đổi</p>
        </div>
      </div>

      <VisionFrame :is-analyzing="isAnalyzing">
        <video 
          ref="videoRef" 
          :src="videoUrl" 
          controls 
          class="main-video"
          @play="onPlay"
          @pause="onPause"
        ></video>
        <canvas ref="canvasRef" style="display: none;"></canvas>
      </VisionFrame>

      <div class="vision-sidebar">
        <EmotionResultCard 
          title="Real-time Detection"
          :emotion="currentEmotion?.emotion"
          :confidence="currentEmotion?.confidence"
        >
          <template #placeholder>
            {{ isAnalyzing ? 'Đang chờ khung hình...' : 'Nhấn Play để bắt đầu phân tích' }}
          </template>
        </EmotionResultCard>
        
        <AppButton variant="outline" full @click="resetVideo">
          Tải video khác
        </AppButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.main-video {
  width: 100%;
  max-height: 500px;
  border-radius: 8px;
}

.vision-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
