<script setup>
import { EMOTION_CLASSES, EMOTION_DISPLAY_NAMES, EMOTION_COLORS } from '@/constants/emotions'

const props = defineProps({
  scores: Object,
  animatedScores: Object,
  isActive: Boolean
})

const emotions = EMOTION_CLASSES.map(cls => ({
  id: cls,
  name: EMOTION_DISPLAY_NAMES[cls],
  color: EMOTION_COLORS[cls]
}))

const getScore = (emotionId) => {
  return props.animatedScores[emotionId] || 0
}

const isHighest = (emotionId) => {
  const max = Math.max(...Object.values(props.scores))
  return props.scores[emotionId] === max
}
</script>

<template>
  <div class="probability-bars">
    <div class="panel-header mb-6">
      <h3>Prediction Confidence</h3>
      <p>The model outputs a probability distribution across all emotion classes.</p>
    </div>

    <div class="bars-container">
      <div 
        v-for="emo in emotions" 
        :key="emo.id" 
        class="bar-item"
        :class="{ highest: isHighest(emo.id) && isActive }"
      >
        <div class="bar-info">
          <span class="emo-name">{{ emo.name }}</span>
          <span class="emo-val">{{ getScore(emo.id) }}%</span>
        </div>
        <div class="bar-bg">
          <div 
            class="bar-fill" 
            :style="{ 
              width: `${getScore(emo.id)}%`, 
              backgroundColor: isActive && isHighest(emo.id) ? 'var(--primary)' : emo.color
            }"
          ></div>
        </div>
      </div>
    </div>

    <div v-if="isActive" class="prediction-summary mt-6">
      <div class="summary-label">Final Decision</div>
      <div class="summary-result">
        <span class="result-emotion">{{ EMOTION_DISPLAY_NAMES[EMOTION_CLASSES.find(cls => isHighest(cls))] }}</span>
        <span class="result-confidence">{{ Math.max(...Object.values(scores)) }}% Confidence</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.probability-bars {
  width: 100%;
}

.panel-header {
  text-align: center;
}

.panel-header h3 {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: 4px;
}

.panel-header p {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.bars-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bar-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: all 0.3s ease;
}

.bar-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  font-weight: 700;
}

.emo-name { color: var(--text-primary); }
.emo-val { color: var(--primary); }

.bar-bg {
  height: 10px;
  background: rgba(var(--primary-rgb), 0.05);
  border-radius: 100px;
  overflow: hidden;
  border: 1px solid rgba(var(--primary-rgb), 0.05);
}

.bar-fill {
  height: 100%;
  border-radius: 100px;
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.bar-item.highest {
  transform: translateX(4px);
}

.prediction-summary {
  padding: 20px;
  background: rgba(var(--primary-rgb), 0.08);
  border-radius: 20px;
  border: 1px solid rgba(var(--primary-rgb), 0.15);
  text-align: center;
  animation: badge-appear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 10px 25px rgba(var(--primary-rgb), 0.1);
}

.summary-label {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 4px;
  letter-spacing: 0.1em;
}

.result-emotion {
  display: block;
  font-size: 2rem;
  font-weight: 900;
  color: var(--primary);
  line-height: 1;
}

.result-confidence {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-secondary);
}

@keyframes badge-appear {
  0% { opacity: 0; transform: scale(0.8) translateY(20px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
