<script setup>
defineProps({
  isAnalyzing: Boolean
})
</script>

<template>
  <div class="vision-main card glass">
    <div class="hud-container">
      <slot />
      <div v-if="isAnalyzing" class="scanner-bar"></div>
    </div>
  </div>
</template>

<style scoped>
.vision-main {
  min-height: 600px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.hud-container {
  flex: 1;
  background: #000;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

:deep(.webcam-video), :deep(.main-video), :deep(.analyzed-img) {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 12px;
}

.scanner-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
  box-shadow: 0 0 15px var(--primary);
  animation: scan 4s infinite linear;
  z-index: 5;
}

@keyframes scan {
  0% { top: 0; }
  100% { top: 100%; }
}

@media (max-width: 768px) {
  .vision-main { min-height: 400px; }
}
</style>
