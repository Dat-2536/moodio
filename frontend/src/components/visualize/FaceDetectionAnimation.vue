<script setup>
const props = defineProps({
  imageSrc: String,
  isActive: Boolean,
  sampleId: String
})

// Mock bounding boxes based on sample
const boundingBoxes = {
  happy: { top: '15%', left: '30%', width: '40%', height: '50%' },
  neutral: { top: '20%', left: '32%', width: '36%', height: '48%' },
  angry: { top: '18%', left: '31%', width: '38%', height: '52%' },
  sad: { top: '22%', left: '33%', width: '34%', height: '45%' },
  surprise: { top: '10%', left: '28%', width: '44%', height: '60%' }
}
</script>

<template>
  <div class="face-detection-container">
    <div class="image-wrapper glass">
      <div v-if="!imageSrc" class="sample-placeholder" :class="sampleId">
        <span class="emoji">{{ 
          sampleId === 'happy' ? '😊' : 
          sampleId === 'neutral' ? '😐' : 
          sampleId === 'angry' ? '😠' : 
          sampleId === 'sad' ? '😢' : '😲' 
        }}</span>
      </div>
      <img v-else :src="imageSrc" class="source-image" />
      
      <div v-if="isActive" class="scan-line"></div>
      
      <div v-if="isActive" class="detection-overlay">
        <div class="face-box" :style="boundingBoxes[sampleId] || boundingBoxes.happy">
          <div class="box-label">Face detected</div>
          <div class="corner tl"></div>
          <div class="corner tr"></div>
          <div class="corner bl"></div>
          <div class="corner br"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.face-detection-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-wrapper {
  position: relative;
  width: 100%;
  max-width: 600px;
  height: 380px;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(var(--primary-rgb), 0.1);
}

.source-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sample-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
}

.sample-placeholder.happy { background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); }
.sample-placeholder.neutral { background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%); }
.sample-placeholder.angry { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%); }
.sample-placeholder.sad { background: linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%); }
.sample-placeholder.surprise { background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); }

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--primary);
  box-shadow: 0 0 20px var(--primary);
  z-index: 2;
  animation: scan 2s infinite ease-in-out;
}

@keyframes scan {
  0% { top: 0%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

.detection-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.face-box {
  position: absolute;
  border: 2px solid rgba(var(--primary-rgb), 0.5);
  box-shadow: 0 0 30px rgba(var(--primary-rgb), 0.2);
  animation: appear 0.5s forwards ease-out;
  animation-delay: 1s;
  opacity: 0;
}

@keyframes appear {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.box-label {
  position: absolute;
  top: -25px;
  left: -2px;
  background: var(--primary);
  color: white;
  padding: 2px 8px;
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 4px 4px 0 0;
  white-space: nowrap;
}

.corner {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 2px solid var(--primary);
}

.tl { top: -2px; left: -2px; border-right: 0; border-bottom: 0; }
.tr { top: -2px; right: -2px; border-left: 0; border-bottom: 0; }
.bl { bottom: -2px; left: -2px; border-right: 0; border-top: 0; }
.br { bottom: -2px; right: -2px; border-left: 0; border-top: 0; }
</style>
