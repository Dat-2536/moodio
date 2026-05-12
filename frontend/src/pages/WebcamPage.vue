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

const {
  isWebcamActive,
  isProcessingFrame,
  hasPerformedAnalysis,
  detectedFaces,
  videoSize,
  errorMessage,
  startWebcam,
  stopWebcam,
} = useWebcamAnalysis()

const handleStart = () => {
  startWebcam(videoRef, canvasRef, selectedInterval.value)
}

const changeInterval = (val) => {
  selectedInterval.value = val
  if (isWebcamActive.value) {
    stopWebcam()
    // Small delay so stopWebcam fully resets before restarting
    setTimeout(handleStart, 100)
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
            text="ResNet-18 Active"
          />
        </div>
      </template>
    </PageHeader>

    <div class="container">
      <div class="vision-grid">

        <!-- ── Left: media frame ──────────────────────────────────────────── -->
        <div class="vision-main">
          <VisionFrame :is-analyzing="isWebcamActive && isProcessingFrame">
            <!-- hud-inner-frame: fills hud-container; overlay is measured against this -->
            <div class="hud-inner-frame">
              <video
                v-show="isWebcamActive"
                ref="videoRef"
                autoplay
                playsinline
              ></video>

              <!-- Overlay drawn in original-image-coordinate space -->
              <FaceOverlay
                v-if="isWebcamActive && (detectedFaces.length > 0 || hasPerformedAnalysis)"
                :faces="detectedFaces"
                :media-size="videoSize"
              />

              <!-- Camera placeholder while stopped -->
              <div v-if="!isWebcamActive" class="camera-placeholder">
                <div class="icon-stack">
                  <ScanFace :size="64" class="faint-icon" />
                </div>
                <p>Sẵn sàng kết nối với Moodio AI</p>
                <AppButton class="mt-6" @click="handleStart">
                  Kích hoạt Camera
                </AppButton>
              </div>
            </div>

            <!-- Hidden offscreen canvas for frame capture -->
            <canvas ref="canvasRef" style="display: none;"></canvas>
          </VisionFrame>

          <div v-if="isWebcamActive" class="cloud-note mt-4 glass p-4 text-xs">
            <p><strong>Analysis Mode:</strong> Phân tích một frame mỗi {{ selectedInterval / 1000 }} giây.</p>
          </div>
        </div>

        <!-- ── Right: results sidebar ─────────────────────────────────────── -->
        <div class="vision-sidebar card glass p-6">
          <div class="sidebar-header border-b border-white/10 pb-4 mb-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-black uppercase tracking-tighter">Live Results</h3>
              <div class="flex gap-2">
                <span
                  v-if="isWebcamActive"
                  class="px-2 py-1 bg-primary/20 text-primary rounded text-xxs font-bold"
                >
                  {{ detectedFaces.length }} FACES
                </span>
              </div>
            </div>
          </div>

          <!-- Interval selector -->
          <div class="interval-selector mb-8">
            <h4 class="text-xxs font-bold uppercase tracking-widest text-primary mb-3">
              Inference Speed
            </h4>
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
            :is-analyzing="isProcessingFrame"
            :has-performed-analysis="hasPerformedAnalysis"
            :error-message="errorMessage"
            source="webcam"
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
/* hud-inner-frame: fills the .hud-container completely.
   position:absolute + inset:0 intentionally overrides the global .media-frame rule. */
.hud-inner-frame {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
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
  background: rgba(0, 0, 0, 0.05);
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
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
  transition: all 0.2s ease;
  text-transform: uppercase;
  cursor: pointer;
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

/* Utility classes used in template */
.flex            { display: flex; }
.gap-2           { gap: 0.5rem; }
.gap-3           { gap: 0.75rem; }
.items-center    { align-items: center; }
.justify-between { justify-content: space-between; }
.mt-4            { margin-top: 1rem; }
.mt-6            { margin-top: 1.5rem; }
.mb-6            { margin-bottom: 1.5rem; }
.mb-8            { margin-bottom: 2rem; }
.pb-4            { padding-bottom: 1rem; }
.p-4             { padding: 1rem; }
.p-6             { padding: 1.5rem; }
.text-xs         { font-size: 0.75rem; }
.text-lg         { font-size: 1.125rem; }
.font-black      { font-weight: 900; }
.font-bold       { font-weight: 700; }
.uppercase       { text-transform: uppercase; }
.tracking-tighter{ letter-spacing: -0.05em; }
.tracking-widest { letter-spacing: 0.1em; }
.text-primary    { color: var(--primary); }
.rounded         { border-radius: 6px; }
.px-2            { padding-left: 0.5rem; padding-right: 0.5rem; }
.py-1            { padding-top: 0.25rem; padding-bottom: 0.25rem; }
.hidden          { display: none; }
@media (min-width: 768px) { .md\:flex { display: flex; } }
</style>
