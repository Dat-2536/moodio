<script setup>
import { Check, Search, Settings2, Brain, BarChart3, Presentation } from 'lucide-vue-next'

const props = defineProps({
  steps: Array,
  activeStep: Object,
  completedSteps: Array,
  isRunning: Boolean
})

const emit = defineEmits(['step-click'])

const getStepIcon = (id) => {
  switch (id) {
    case 'input': return Presentation
    case 'face-detection': return Search
    case 'preprocessing': return Settings2
    case 'deep-learning': return Brain
    case 'prediction': return BarChart3
    default: return Check
  }
}
</script>

<template>
  <div class="pipeline-shell app-scrollbar">
    <div class="pipeline-track">
      <!-- Continuous Background Track -->
      <div class="track-wrapper" :style="{ 
        left: `${(1 / (2 * steps.length)) * 100}%`, 
        right: `${(1 / (2 * steps.length)) * 100}%` 
      }">
        <div class="track-base"></div>
        <div 
          class="track-progress" 
          :style="{ width: `${(completedSteps.length > 1 ? (completedSteps.length - 1) / (steps.length - 1) : 0) * 100}%` }"
        ></div>
      </div>

      <div 
        v-for="(step, index) in steps" 
        :key="step.id"
        :class="[
          'pipeline-step',
          { active: activeStep?.id === step.id },
          { completed: completedSteps.includes(step.id) }
        ]"
        @click="emit('step-click', index)"
      >
        <div class="step-node">
          <div class="step-marker">
            <div class="marker-inner">
              <Check v-if="completedSteps.includes(step.id) && activeStep?.id !== step.id" :size="18" />
              <component v-else :is="getStepIcon(step.id)" :size="18" />
            </div>
          </div>
          <div class="step-label">
            <div class="step-count">Step {{ index + 1 }}</div>
            <div class="step-title">{{ step.short_title }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pipeline-shell {
  width: 100%;
  overflow-x: auto;
}

.pipeline-track {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 700px;
  padding: 20px 30px;
  position: relative;
}

.track-wrapper {
  position: absolute;
  top: 41px; /* Vertical center: padding (20px) + marker radius (21px) */
  height: 4px;
  z-index: 1;
}

.track-base {
  position: absolute;
  inset: 0;
  background: rgba(var(--primary-rgb), 0.1);
  border-radius: 99px;
}

.track-progress {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: var(--primary);
  border-radius: 99px;
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 0 10px rgba(var(--primary-rgb), 0.3);
}

.pipeline-step {
  flex: 1;
  position: relative;
  cursor: pointer;
  z-index: 2;
}

.step-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.step-marker {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  /* Use solid background to hide the line behind */
  background: var(--surface-color);
  border: 2px solid rgba(var(--primary-rgb), 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 3;
}

.marker-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4;
}

.pipeline-step.active .step-marker {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
  box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.5);
  transform: scale(1.2);
}

.pipeline-step.completed .step-marker {
  background: white;
  color: var(--primary);
  border-color: var(--primary);
  box-shadow: 0 4px 10px rgba(var(--primary-rgb), 0.15);
}

[data-theme='dark'] .pipeline-step.completed .step-marker {
  background: #1e293b; /* Solid dark color matching surface */
  color: var(--primary);
  border-color: var(--primary);
}

.step-label {
  text-align: center;
  transition: all 0.3s ease;
}

.step-count {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--text-secondary);
  opacity: 0.6;
  margin-bottom: 2px;
}

.step-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-secondary);
  white-space: nowrap;
}

.pipeline-step.active .step-title,
.pipeline-step.active .step-count {
  color: var(--primary);
  opacity: 1;
}

.pipeline-step:hover .step-marker {
  border-color: var(--primary);
}

@media (max-width: 768px) {
  .pipeline-track {
    padding: 10px 20px;
  }
}
</style>
