<script setup>
import { ref } from 'vue'
import { Camera } from 'lucide-vue-next'
import PageHeader from '@/components/common/PageHeader.vue'
import AppButton from '@/components/common/AppButton.vue'
import StatusPill from '@/components/common/StatusPill.vue'
import VisionFrame from '@/components/vision/VisionFrame.vue'
import EmotionResultCard from '@/components/vision/EmotionResultCard.vue'
import { useWebcamAnalysis } from '@/composables/useWebcamAnalysis'

const videoRef = ref(null)
const canvasRef = ref(null)
const { isWebcamActive, currentEmotion, startWebcam, stopWebcam } = useWebcamAnalysis()

const handleStart = () => {
  startWebcam(videoRef, canvasRef)
}
</script>

<template>
  <section class="service-page">
    <PageHeader 
      title="Live Vision Analysis" 
      subtitle="Nhận diện thời gian thực qua luồng camera của bạn."
    >
      <template #right>
        <StatusPill 
          v-if="isWebcamActive" 
          :active="true" 
          text="AI Engine Running" 
        />
      </template>
    </PageHeader>

    <div class="vision-grid">
      <VisionFrame :is-analyzing="isWebcamActive">
        <video 
          v-show="isWebcamActive" 
          ref="videoRef" 
          autoplay 
          playsinline 
          class="webcam-video"
        ></video>
        <canvas ref="canvasRef" style="display: none;"></canvas>
        
        <div v-if="!isWebcamActive" class="camera-placeholder">
          <Camera :size="64" class="faint-icon" />
          <p>Vui lòng kích hoạt camera để bắt đầu</p>
          <AppButton class="mt-6" @click="handleStart">
            Kích hoạt Camera
          </AppButton>
        </div>
      </VisionFrame>

      <div class="vision-sidebar">
        <EmotionResultCard 
          title="Real-time Emotion"
          :emotion="currentEmotion?.emotion"
          :confidence="currentEmotion?.confidence"
        />
        
        <AppButton 
          v-if="isWebcamActive" 
          variant="outline" 
          full 
          @click="stopWebcam"
        >
          Tắt Camera
        </AppButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.camera-placeholder {
  text-align: center;
  opacity: 0.6;
}

.faint-icon { 
  opacity: 0.2; 
  margin-bottom: 1rem; 
}

.vision-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.mt-6 { margin-top: 1.5rem; }
</style>
