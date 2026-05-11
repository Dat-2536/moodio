<script setup>
import { ref } from 'vue'
import { Camera, ScanFace } from 'lucide-vue-next'
import PageHeader from '@/components/common/PageHeader.vue'
import AppButton from '@/components/common/AppButton.vue'
import StatusPill from '@/components/common/StatusPill.vue'
import VisionFrame from '@/components/vision/VisionFrame.vue'
import FaceOverlay from '@/components/vision/FaceOverlay.vue'
import FaceResultList from '@/components/vision/FaceResultList.vue'
import { useWebcamAnalysis, WEBCAM_INTERVAL_MODES } from '@/composables/useWebcamAnalysis'

const videoRef = ref(null)
const canvasRef = ref(null)
const selectedInterval = ref(WEBCAM_INTERVAL_MODES.NORMAL)
const { isWebcamActive, isProcessingFrame, detectedFaces, videoSize, startWebcam, stopWebcam } = useWebcamAnalysis()

const handleStart = () => {
  startWebcam(videoRef, canvasRef, selectedInterval.value)
}

const changeInterval = (val) => {
  selectedInterval.value = val
  if (isWebcamActive.value) {
    stopWebcam()
    handleStart()
  }
}
</script>

<template>
  <section class="service-page">
    <PageHeader 
      title="Moodio Live Analysis" 
      subtitle="Nhận diện cảm xúc thời gian thực sử dụng ResNet-18 qua Camera."
    >
      <template #right>
        <div class="flex gap-3">
          <StatusPill 
            v-if="isWebcamActive" 
            :active="true" 
            :text="`Interval: ${selectedInterval}ms`" 
            class="hidden md:flex"
          />
          <StatusPill 
            v-if="isWebcamActive" 
            :active="true" 
            text="ResNet-18 Engine Active" 
          />
        </div>
      </template>
    </PageHeader>

    <div class="container">
      <div class="vision-grid">
        <div class="vision-main">
          <VisionFrame :is-analyzing="isWebcamActive && isProcessingFrame">
            <div class="media-frame">
              <video 
                v-show="isWebcamActive" 
                ref="videoRef" 
                autoplay 
                playsinline 
              ></video>
              
              <FaceOverlay 
                v-if="isWebcamActive && detectedFaces.length > 0"
                :faces="detectedFaces"
                :media-size="videoSize"
              />

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
          
          <div v-if="isWebcamActive" class="cloud-note mt-4 glass p-4 text-xs">
            <p><strong>Cloud Demo Mode:</strong> Hệ thống đang phân tích một frame mỗi {{ selectedInterval/1000 }} giây để tối ưu hoá tài nguyên CPU Free Tier.</p>
          </div>
        </div>

        <div class="vision-sidebar card glass p-6">
          <div class="sidebar-header border-b border-white/10 pb-4 mb-6">
             <div class="flex items-center justify-between">
                <h3 class="text-lg font-black uppercase tracking-tighter">Live Results</h3>
                <div class="flex gap-2">
                  <span v-if="isWebcamActive" class="px-2 py-1 bg-primary/20 text-primary rounded text-[10px] font-bold">
                    {{ detectedFaces.length }} FACES
                  </span>
                </div>
             </div>
          </div>

          <div class="interval-selector mb-8">
             <h4 class="text-[10px] font-bold uppercase tracking-widest text-primary mb-3">Inference Speed</h4>
             <div class="flex gap-2">
                <button 
                  v-for="(val, key) in WEBCAM_INTERVAL_MODES" 
                  :key="key"
                  class="speed-btn"
                  :class="{ active: selectedInterval === val }"
                  @click="changeInterval(val)"
                >
                  {{ key }}
                </button>
             </div>
          </div>

          <FaceResultList 
            :faces="detectedFaces"
            :is-analyzing="isWebcamActive"
          />
          
          <AppButton 
            v-if="isWebcamActive" 
            variant="outline" 
            full 
            class="mt-6"
            @click="stopWebcam"
          >
            Tắt Camera
          </AppButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
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

.speed-btn {
  flex: 1;
  padding: 0.5rem;
  font-size: 0.7rem;
  font-weight: 800;
  border-radius: 8px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: var(--text-secondary);
  transition: all 0.2s ease;
  text-transform: uppercase;
}

.speed-btn.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
  box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3);
}

.cloud-note {
  border-left: 3px solid var(--primary);
  color: var(--text-secondary);
}

.mt-4 { margin-top: 1rem; }
.mt-6 { margin-top: 1.5rem; }
.mb-8 { margin-bottom: 2rem; }
</style>
