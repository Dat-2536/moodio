<script setup>
defineProps({
  emotion: String,
  confidence: Number,
  allProbs: Object,
  title: {
    type: String,
    default: 'Detection Result'
  }
})
</script>

<template>
  <div class="sidebar-card card glass">
    <h3>{{ title }}</h3>
    <div class="current-emotion-large" v-if="emotion">
      <div class="emotion-badge">{{ emotion }}</div>
      <div class="confidence-text">
        Confidence: {{ confidence }}%
      </div>

      <!-- Probability Bars -->
      <div v-if="allProbs" class="prob-list mt-6">
        <div v-for="(prob, name) in allProbs" :key="name" class="prob-item">
          <div class="prob-info">
            <span class="prob-name">{{ name }}</span>
            <span class="prob-value">{{ prob }}%</span>
          </div>
          <div class="prob-bar-bg">
            <div 
              class="prob-bar-fill" 
              :style="{ 
                width: prob + '%',
                background: name === emotion.toLowerCase() ? 'var(--primary)' : 'rgba(var(--primary-rgb), 0.3)'
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div class="placeholder-text" v-else>
      <slot name="placeholder">Đang chờ nhận diện...</slot>
    </div>
  </div>
</template>

<style scoped>
.sidebar-card {
  padding: 1.5rem;
}

.sidebar-card h3 {
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 800;
}

.current-emotion-large {
  text-align: center;
}

.emotion-badge {
  font-size: 2rem;
  font-weight: 900;
  color: var(--primary);
  text-transform: uppercase;
  margin-bottom: 0.25rem;
  text-shadow: 0 0 15px rgba(var(--primary-rgb), 0.3);
}

.confidence-text {
  color: var(--text-secondary);
  font-weight: 700;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.prob-list {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.prob-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.prob-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.prob-name { color: var(--text-secondary); }
.prob-value { color: var(--text-primary); }

.prob-bar-bg {
  height: 4px;
  background: rgba(var(--primary-rgb), 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.prob-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.placeholder-text {
  color: var(--text-secondary);
  font-style: italic;
  padding: 2rem 0;
  text-align: center;
}

.mt-6 { margin-top: 1.5rem; }
</style>
