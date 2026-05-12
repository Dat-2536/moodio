<script setup>
import PageHeader from '@/components/common/PageHeader.vue'
import VisualizeControls from '@/components/visualize/VisualizeControls.vue'
import SampleImagePicker from '@/components/visualize/SampleImagePicker.vue'
import InteractivePipeline from '@/components/visualize/InteractivePipeline.vue'
import RecognitionStage from '@/components/visualize/RecognitionStage.vue'
import ModelLayerFlow from '@/components/visualize/ModelLayerFlow.vue'
import StepExplanationPanel from '@/components/visualize/StepExplanationPanel.vue'
import EmotionProbabilityBars from '@/components/visualize/EmotionProbabilityBars.vue'
import { useRecognitionSimulation } from '@/composables/useRecognitionSimulation'

const {
  steps,
  samples,
  activeStep,
  completedSteps,
  isRunning,
  isPaused,
  speed,
  mode,
  selectedLayer,
  selectedSample,
  uploadedImage,
  emotionScores,
  animatedScores,
  activeLayerIndex,
  setSpeed,
  setMode,
  selectSample,
  setUploadedImage,
  selectLayer,
  runSimulation,
  pauseSimulation,
  resumeSimulation,
  resetSimulation,
  nextStep,
  previousStep,
  goToStep
} = useRecognitionSimulation()
</script>

<template>
  <section class="service-page visualize-page">
    <div class="visualize-shell">
      <PageHeader 
        title="AI Process Visualization" 
        subtitle="Khám phá cơ chế hoạt động của mô hình Deep Learning trong việc phân tích và nhận diện cảm xúc khuôn mặt thông qua lab tương tác."
        compact
      />

      <div class="visualize-lab-panel card glass">
        <div class="visualize-input-section">
          <div class="section-kicker mb-3">Choose Input Data</div>
          <SampleImagePicker 
            :samples="samples"
            :selected-sample="selectedSample"
            :uploaded-image="uploadedImage"
            @sample-select="selectSample"
            @image-upload="setUploadedImage"
          />
        </div>

        <div class="visualize-control-section">
          <div class="section-kicker mb-3">Simulation Controls</div>
          <VisualizeControls 
            :is-running="isRunning"
            :is-paused="isPaused"
            :speed="speed"
            :mode="mode"
            @run="runSimulation"
            @pause="pauseSimulation"
            @resume="resumeSimulation"
            @reset="resetSimulation"
            @next="nextStep"
            @previous="previousStep"
            @speed-change="setSpeed"
            @mode-change="setMode"
          />
        </div>
      </div>

      <div class="pipeline-card card glass">
        <InteractivePipeline 
          :steps="steps"
          :active-step="activeStep"
          :completed-steps="completedSteps"
          :is-running="isRunning"
          @step-click="goToStep"
        />
      </div>

      <div class="visualize-main-grid">
        <div class="recognition-stage-column">
          <RecognitionStage 
            :active-step-id="activeStep?.id"
            :active-step="activeStep"
            :uploaded-image="uploadedImage"
            :selected-sample="selectedSample"
            :is-running="isRunning"
            :emotion-scores="emotionScores"
            :animated-scores="animatedScores"
          />
        </div>

        <div class="explanation-column">
          <StepExplanationPanel 
            :active-step="activeStep"
            :mode="mode"
          />
        </div>
      </div>

      <div class="lower-sections-shell">
        <ModelLayerFlow 
          :active-layer-index="activeLayerIndex"
          :selected-layer="selectedLayer"
          :is-active="activeStep?.id === 'deep-learning'"
          @layer-click="selectLayer"
        />

        <div class="probability-card card glass p-8" v-if="completedSteps.includes('prediction') || isRunning">
          <div class="section-kicker mb-4">Final Prediction Results</div>
          <EmotionProbabilityBars 
            :scores="emotionScores" 
            :animated-scores="animatedScores" 
            :is-active="completedSteps.includes('prediction')" 
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.visualize-page {
  padding-bottom: 5rem;
}

.visualize-shell {
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 2rem 1.5rem;
}

.compact-header {
  margin-bottom: 0.5rem;
}

.visualize-lab-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 40px;
  padding: 32px;
  align-items: flex-start;
  position: relative;
  z-index: 20;
}

.section-kicker {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--primary);
  letter-spacing: 0.05em;
}

.pipeline-card {
  padding: 24px 32px;
}

.visualize-main-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(360px, 0.65fr);
  gap: 32px;
  align-items: stretch;
}

.lower-sections-shell {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

@media (max-width: 1180px) {
  .visualize-lab-panel {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .visualize-main-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .visualize-shell {
    gap: 20px;
  }
  
  .visualize-lab-panel {
    padding: 20px;
  }
  
  .pipeline-card {
    padding: 16px;
  }
}

@media (max-width: 460px) {
  .visualize-shell {
    padding: 1.5rem 1rem;
    gap: 16px;
  }
  
  .visualize-lab-panel {
    padding: 16px 12px;
    gap: 16px;
  }
}
</style>
