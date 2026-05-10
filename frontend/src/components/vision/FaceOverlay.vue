<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Smile, Frown, ScanFace } from 'lucide-vue-next'
import { getContainSize, scaleBoxToDisplay } from '@/utils/faceUtils'

const props = defineProps({
  faces: {
    type: Array,
    default: () => []
  },
  mediaSize: {
    type: Object, // { width, height } natural size
    required: true
  }
})

const containerRef = ref(null)
const displayRect = ref({ x: 0, y: 0, width: 0, height: 0 })

const updateDisplayRect = () => {
  if (!containerRef.value || !props.mediaSize.width) return
  
  const { clientWidth, clientHeight } = containerRef.value
  displayRect.value = getContainSize(
    clientWidth, 
    clientHeight, 
    props.mediaSize.width, 
    props.mediaSize.height
  )
}

let resizeObserver = null

onMounted(() => {
  updateDisplayRect()
  resizeObserver = new ResizeObserver(updateDisplayRect)
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value)
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})

watch(() => props.mediaSize, updateDisplayRect, { deep: true })

const getBoxStyle = (box) => {
  return scaleBoxToDisplay(box, displayRect.value)
}

const getEmotionIcon = (emotion) => {
  const emo = (emotion || '').toLowerCase()
  if (['happy', 'surprise'].includes(emo)) return Smile
  if (['sad', 'angry', 'fear', 'disgust'].includes(emo)) return Frown
  return ScanFace
}

const formatConfidence = (conf) => {
  return Math.round(conf * 100) + '%'
}
</script>

<template>
  <div ref="containerRef" class="face-overlay-container">
    <div 
      v-for="face in faces" 
      :key="face.id"
      class="face-box"
      :style="getBoxStyle(face.box)"
    >
      <div class="box-border"></div>
      <div class="box-label">
        <component :is="getEmotionIcon(face.emotion)" :size="14" />
        <span class="emo-text">{{ face.emotion }}</span>
        <span class="conf-text">{{ formatConfidence(face.confidence) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.face-overlay-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
  overflow: hidden;
}

.face-box {
  position: absolute;
  transition: all 0.2s linear;
}

.box-border {
  position: absolute;
  inset: 0;
  border: 2px solid var(--primary);
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(var(--primary-rgb), 0.4);
  animation: box-pulse 2s infinite ease-in-out;
}

@keyframes box-pulse {
  0%, 100% { border-color: var(--primary); opacity: 1; }
  50% { border-color: white; opacity: 0.8; }
}

.box-label {
  position: absolute;
  top: -32px;
  left: 0;
  background: var(--primary);
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  animation: label-appear 0.3s ease-out;
}

@keyframes label-appear {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.emo-text {
  text-transform: capitalize;
}

.conf-text {
  opacity: 0.8;
  font-size: 0.7rem;
  background: rgba(0,0,0,0.2);
  padding: 1px 4px;
  border-radius: 3px;
}

/* Handle labels near the top edge */
.face-box[style*="top: 0"],
.face-box[style*="top: 1"],
.face-box[style*="top: 2"] {
  .box-label {
    top: 6px;
    left: 6px;
  }
}
</style>
