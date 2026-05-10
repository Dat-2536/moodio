<script setup>
import { ref } from 'vue'
import { Camera, ScanFace, Smile, Frown } from 'lucide-vue-next'
import PageHeader from '@/components/common/PageHeader.vue'
import AppButton from '@/components/common/AppButton.vue'
import StatusPill from '@/components/common/StatusPill.vue'
import VisionFrame from '@/components/vision/VisionFrame.vue'
import EmotionResultCard from '@/components/vision/EmotionResultCard.vue'
import { useWebcamAnalysis } from '@/composables/useWebcamAnalysis'

const videoRef = ref(null)
const canvasRef = ref(null)
const { isWebcamActive, detectedFaces, startWebcam, stopWebcam } = useWebcamAnalysis()

const handleStart = () => {
  startWebcam(videoRef, canvasRef)
}
</script>

<template>
  <section class="service-page">
    <PageHeader 
      title="Moodio Live Analysis" 
      subtitle="Nhận diện cảm xúc thời gian thực sử dụng ResNet-18 qua Camera."
    >
      <template #right>
        <StatusPill 
          v-if="isWebcamActive" 
          :active="true" 
          text="ResNet-18 Engine Active" 
        />
      </template>
    </PageHeader>

    <div class="vision-grid">
      <VisionFrame :is-analyzing="isWebcamActive">
        <div class="webcam-container">
          <video 
            v-show="isWebcamActive" 
            ref="videoRef" 
            autoplay 
            playsinline 
            class="webcam-video"
          ></video>
          
          <!-- Bounding Boxes Overlay -->
          <div v-if="isWebcamActive" class="face-overlay">
            <div 
              v-for="face in detectedFaces" 
              :key="face.face_id"
              class="face-box-container"
              :style="{
                top: face.bounding_box.top + '%',
                left: face.bounding_box.left + '%',
                width: face.bounding_box.width + '%',
                height: face.bounding_box.height + '%'
              }"
            >
              <div class="face-box-border"></div>
              <div class="face-emotion-tag">
                <Smile v-if="['happy', 'surprise'].includes(face.emotion.toLowerCase())" :size="14" />
                <Frown v-else-if="['sad', 'angry', 'fear', 'disgust'].includes(face.emotion.toLowerCase())" :size="14" />
                <ScanFace v-else :size="14" />
                <span class="emo-text">{{ face.emotion }}</span>
                <span class="conf-text">{{ face.confidence }}%</span>
              </div>
            </div>
          </div>

          <div v-if="!isWebcamActive" class="camera-placeholder">
            <div class="icon-stack">
              <ScanFace :size="64" class="faint-icon" />
            </div>
            <p>Sẵn sàng kết nối với trí tuệ nhân tạo Moodio</p>
            <AppButton class="mt-6" @click="handleStart">
              Kích hoạt Camera
            </AppButton>
          </div>
        </div>
        
        <canvas ref="canvasRef" style="display: none;"></canvas>
      </VisionFrame>

      <div class="vision-sidebar">
        <div class="sidebar-header">
          <div class="flex items-center justify-between">
             <h3>Detected Emotions</h3>
             <StatusPill v-if="isWebcamActive" :active="true" :text="detectedFaces.length + ' Face'" />
          </div>
        </div>

        <div class="results-list">
          <EmotionResultCard 
            v-for="face in detectedFaces"
            :key="'list-' + face.face_id"
            :title="'Face Analysis'"
            :emotion="face.emotion"
            :confidence="face.confidence"
            :all-probs="face.all_probs"
          />
          
          <div v-if="detectedFaces.length === 0 && isWebcamActive" class="empty-state">
            <ScanFace :size="32" class="mb-4 opacity-20" />
            Searching for faces...
          </div>
        </div>
        
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
.webcam-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: inherit;
}

.webcam-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.face-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.face-box-container {
  position: absolute;
  transition: all 0.3s ease;
}

.face-box-border {
  position: absolute;
  inset: 0;
  border: 2px solid var(--primary);
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(var(--primary-rgb), 0.5);
  animation: box-pulse 2s infinite ease-in-out;
}

@keyframes box-pulse {
  0%, 100% { border-color: var(--primary); opacity: 1; }
  50% { border-color: white; opacity: 0.8; }
}

.face-emotion-tag {
  position: absolute;
  top: -30px;
  left: 0;
  background: var(--primary);
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 800;
  display: flex;
  gap: 8px;
  white-space: nowrap;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

.conf-text {
  opacity: 0.8;
  font-weight: 600;
}

.sidebar-header {
  margin-bottom: 1rem;
}

.sidebar-header h3 {
  font-size: 1.1rem;
  font-weight: 800;
}

.sidebar-header p {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 5px;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
  font-style: italic;
  font-size: 0.9rem;
}

.camera-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  opacity: 0.6;
  background: rgba(0,0,0,0.05);
}

.faint-icon { 
  opacity: 0.5; 
  margin-bottom: 1rem; 
}

.vision-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.mt-6 { margin-top: 1.5rem; }

/* Custom Scrollbar for results list */
.results-list::-webkit-scrollbar {
  width: 4px;
}
.results-list::-webkit-scrollbar-track {
  background: transparent;
}
.results-list::-webkit-scrollbar-thumb {
  background: rgba(var(--primary-rgb), 0.2);
  border-radius: 10px;
}
</style>
