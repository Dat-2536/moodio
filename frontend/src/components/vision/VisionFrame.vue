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
  width: 100%;
  aspect-ratio: 16 / 9;
  min-height: 350px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .vision-main {
    aspect-ratio: 4 / 3;
    padding: 0.5rem;
  }
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

/*
  Use object-fit: contain so the media never crops and bounding box scaling
  via computeObjectFitContainRect() always matches what's displayed.
  Letter-box/pillarbox areas will be black (matching .hud-container background).
*/
:deep(.webcam-video),
:deep(.main-video),
:deep(.analyzed-img),
:deep(video),
:deep(img.analyzed-img) {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 12px;
  display: block;
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
  pointer-events: none;
}

@keyframes scan {
  0%   { top: 0; }
  100% { top: 100%; }
}

.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 4;
  pointer-events: none;
}
.shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(var(--primary-rgb), 0.15), transparent);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
