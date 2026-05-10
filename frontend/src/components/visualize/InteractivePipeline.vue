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
  <div class="pipeline-shell">
    <div class="pipeline-track">
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
        <div class="step-connector" v-if="index > 0"></div>
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
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.pipeline-shell::-webkit-scrollbar {
  display: none;
}

.pipeline-track {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 700px;
  padding: 10px 0;
}

.pipeline-step {
  flex: 1;
  position: relative;
  cursor: pointer;
}

.step-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 2;
}

.step-marker {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(var(--surface-rgb), 0.8);
  border: 2px solid rgba(var(--primary-rgb), 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.marker-inner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-connector {
  position: absolute;
  left: -50%;
  right: 50%;
  top: 21px;
  height: 3px;
  background: rgba(var(--primary-rgb), 0.1);
  z-index: 1;
  transition: background 0.3s ease;
}

.pipeline-step.active .step-marker {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
  box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.4);
  transform: scale(1.15);
}

.pipeline-step.completed .step-marker {
  background: rgba(var(--primary-rgb), 0.1);
  color: var(--primary);
  border-color: var(--primary);
}

.pipeline-step.completed .step-connector {
  background: var(--primary);
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
