<script setup>
import FaceDetectionAnimation from './FaceDetectionAnimation.vue'
import PreprocessingAnimation from './PreprocessingAnimation.vue'
import FeatureMapPanel from './FeatureMapPanel.vue'
import EmotionProbabilityBars from './EmotionProbabilityBars.vue'
import { Activity } from 'lucide-vue-next'

const props = defineProps({
  activeStepId: String,
  activeStep: Object,
  uploadedImage: String,
  selectedSample: Object,
  isRunning: Boolean,
  emotionScores: Object,
  animatedScores: Object
})
</script>

<template>
  <div class="recognition-stage card glass">
    <div class="stage-header">
      <div class="stage-info">
        <Activity :size="16" class="activity-icon" :class="{ pulse: isRunning }" />
        <div class="step-details">
          <span class="step-name">{{ activeStep?.title }}</span>
          <span class="status-badge" :class="{ active: isRunning }">
            {{ isRunning ? activeStep?.status : 'System Idle' }}
          </span>
        </div>
      </div>
    </div>

    <div class="stage-body">
      <!-- Technical Grid Background -->
      <div class="stage-grid-bg"></div>
      
      <transition name="fade-scale" mode="out-in">
        <div :key="activeStepId" class="stage-viewport">
          <!-- Input Step -->
          <div v-if="activeStepId === 'input'" class="view-container">
            <div class="input-display">
              <div class="image-card glass-premium">
                <img v-if="uploadedImage" :src="uploadedImage" class="main-img" />
                <div v-else class="sample-placeholder" :class="selectedSample?.id">
                   <span class="emoji">{{ 
                    selectedSample?.id === 'happy' ? '😊' : 
                    selectedSample?.id === 'neutral' ? '😐' : 
                    selectedSample?.id === 'angry' ? '😠' : 
                    selectedSample?.id === 'sad' ? '😢' : '😲' 
                  }}</span>
                </div>
                <div class="img-label">Raw RGB Matrix</div>
              </div>
            </div>
          </div>

          <!-- Face Detection Step -->
          <div v-else-if="activeStepId === 'face-detection'" class="view-container">
             <div class="demo-frame-large">
               <FaceDetectionAnimation 
                :image-src="uploadedImage" 
                :sample-id="selectedSample?.id"
                :is-active="true" 
              />
             </div>
          </div>

          <!-- Preprocessing Step -->
          <div v-else-if="activeStepId === 'preprocessing'" class="view-container">
            <div class="demo-frame-large">
              <PreprocessingAnimation 
                :image-src="uploadedImage" 
                :sample-id="selectedSample?.id"
                :is-active="true" 
              />
            </div>
          </div>

          <!-- Deep Learning Step -->
          <div v-else-if="activeStepId === 'deep-learning'" class="view-container split-view">
            <FeatureMapPanel :is-active="true" />
            <div class="model-note-badge">
              <Activity :size="14" />
              <span>Extracting {{ selectedSample?.label }} Features</span>
            </div>
          </div>

          <!-- Prediction Step -->
          <div v-else-if="activeStepId === 'prediction'" class="view-container">
            <div class="prediction-full-width">
              <EmotionProbabilityBars 
                :scores="emotionScores" 
                :animated-scores="animatedScores" 
                :is-active="true" 
              />
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.recognition-stage {
  min-height: 520px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.stage-header {
  padding: 16px 24px;
  border-bottom: 1px solid rgba(var(--primary-rgb), 0.1);
  background: rgba(var(--surface-rgb), 0.2);
  z-index: 10;
}

.stage-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.activity-icon {
  color: var(--text-secondary);
}

.activity-icon.pulse {
  color: var(--primary);
  filter: drop-shadow(0 0 5px var(--primary));
  animation: pulse-ring 1.5s infinite;
}

.step-details {
  display: flex;
  flex-direction: column;
}

.step-name {
  font-size: 14px;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.2;
}

.status-badge {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-secondary);
  opacity: 0.7;
}

.status-badge.active {
  color: var(--primary);
  opacity: 1;
}

.stage-body {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
}

.stage-grid-bg {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(var(--primary-rgb), 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(var(--primary-rgb), 0.03) 1px, transparent 1px);
  background-size: 30px 30px;
  pointer-events: none;
}

.stage-viewport {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
}

.view-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.demo-frame-large {
  width: 100%;
  max-width: 640px;
}

.input-display {
  width: 100%;
  max-width: 440px;
}

.glass-premium {
  background: rgba(var(--surface-rgb), 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--primary-rgb), 0.15);
  border-radius: 24px;
  padding: 16px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}

.main-img {
  width: 100%;
  border-radius: 16px;
  margin-bottom: 12px;
  border: 1px solid rgba(var(--primary-rgb), 0.1);
}

.sample-placeholder {
  width: 100%;
  aspect-ratio: 4/3;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
  margin-bottom: 12px;
}

.sample-placeholder.happy { background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); }
.sample-placeholder.neutral { background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%); }
.sample-placeholder.angry { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%); }
.sample-placeholder.sad { background: linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%); }
.sample-placeholder.surprise { background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); }

.img-label {
  font-size: 12px;
  font-weight: 800;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.split-view {
  flex-direction: column;
  gap: 24px;
}

.model-note-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(var(--primary-rgb), 0.1);
  border: 1px solid rgba(var(--primary-rgb), 0.2);
  border-radius: 100px;
  color: var(--primary);
  font-size: 13px;
  font-weight: 700;
}

.prediction-full-width {
  width: 100%;
  max-width: 500px;
}

@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.96);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(1.04);
}

@media (max-width: 768px) {
  .recognition-stage {
    min-height: 400px;
  }
  .stage-body {
    padding: 16px;
  }
  .input-display {
    max-width: 320px;
  }
}
</style>
