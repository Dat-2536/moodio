<script setup>
defineProps({
  emotion: String,
  confidence: Number,
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
        Confidence: {{ Math.round(confidence * 100) }}%
      </div>
    </div>
    <div class="placeholder-text" v-else>
      <slot name="placeholder">Đang chờ nhận diện...</slot>
    </div>
  </div>
</template>

<style scoped>
.sidebar-card {
  padding: 2rem;
}

.sidebar-card h3 {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.current-emotion-large {
  text-align: center;
  padding: 2rem 0;
}

.emotion-badge {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--primary);
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 20px rgba(var(--primary-rgb), 0.3);
}

.confidence-text {
  color: var(--text-secondary);
  font-weight: 600;
}

.placeholder-text {
  color: var(--text-secondary);
  font-style: italic;
  padding: 2rem 0;
  text-align: center;
}
</style>
