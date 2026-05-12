<script setup>
/**
 * FaceOverlay.vue
 *
 * Absolutely-positioned overlay drawn over the media element (video/image)
 * inside VisionFrame's .hud-container.
 *
 * Bounding boxes arrive in ORIGINAL media pixel coordinates from the backend.
 * We measure the container (our parentElement, which is .hud-container) and
 * use computeObjectFitContainRect + scaleFaceBoxToDisplay to convert them to
 * CSS pixel positions relative to the container.
 *
 * This overlay itself is position:absolute inset:0, so "left/top" values are
 * relative to .hud-container, which is position:relative.
 */
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { computeObjectFitContainRect, scaleFaceBoxToDisplay, clampDisplayBox } from '@/utils/faceBox'

const props = defineProps({
  /** Normalized faces array from normalizeDetectionResult() */
  faces: {
    type: Array,
    default: () => [],
  },
  /**
   * Original media dimensions { width, height }.
   * Must be the actual pixel size of the source image/video, NOT the display size.
   */
  mediaSize: {
    type: Object,
    required: true,
  },
})

// We attach this ref to the overlay div itself, then use parentElement to
// measure the container so we don't need the parent to expose a ref.
const overlayRef    = ref(null)
const containerSize = ref({ width: 0, height: 0 })
const displayRect   = ref({ x: 0, y: 0, width: 0, height: 0 })

function updateLayout() {
  const el = overlayRef.value
  if (!el) return

  // The overlay is inset:0 inside .hud-container, so its own clientWidth/Height
  // equals the container's inner dimensions.
  const w = el.clientWidth
  const h = el.clientHeight
  if (w === 0 || h === 0) return

  containerSize.value = { width: w, height: h }

  if (!props.mediaSize?.width || !props.mediaSize?.height) return

  displayRect.value = computeObjectFitContainRect(
    w, h,
    props.mediaSize.width,
    props.mediaSize.height,
  )
}

let ro = null

onMounted(() => {
  updateLayout()
  ro = new ResizeObserver(updateLayout)
  if (overlayRef.value) ro.observe(overlayRef.value)
})

onUnmounted(() => {
  if (ro) ro.disconnect()
})

// Re-compute when mediaSize changes (new image selected, video metadata loaded)
watch(() => props.mediaSize, updateLayout, { deep: true })

// ── Per-face box style ─────────────────────────────────────────────────────────

const EMOTION_COLORS = {
  happy:    '#22c55e',
  surprise: '#f59e0b',
  neutral:  '#6366f1',
  sad:      '#60a5fa',
  angry:    '#ef4444',
  fear:     '#a855f7',
  disgust:  '#84cc16',
}

function emotionColor(emotion) {
  return EMOTION_COLORS[(emotion || '').toLowerCase()] || '#6366f1'
}

function getBoxStyle(face) {
  if (!face.bounding_box) return { display: 'none' }

  const scaled = scaleFaceBoxToDisplay(face.bounding_box, props.mediaSize, displayRect.value)
  const clamped = clampDisplayBox(scaled, displayRect.value)

  if (clamped.width < 4 || clamped.height < 4) return { display: 'none' }

  const color = emotionColor(face.emotion)

  return {
    left:   `${clamped.left}px`,
    top:    `${clamped.top}px`,
    width:  `${clamped.width}px`,
    height: `${clamped.height}px`,
    '--face-color': color,
  }
}

function getLabelStyle(face) {
  // If box is near top edge, push label inside instead of above
  const scaled = face.bounding_box
    ? scaleFaceBoxToDisplay(face.bounding_box, props.mediaSize, displayRect.value)
    : { top: 999 }
  return scaled.top < 36 ? { top: '6px', bottom: 'auto' } : { top: '-32px', bottom: 'auto' }
}

function pct(conf) {
  return Math.round(conf * 100) + '%'
}
</script>

<template>
  <div ref="overlayRef" class="face-overlay" aria-hidden="true">
    <div
      v-for="(face, idx) in faces"
      :key="face.id ?? idx"
      class="face-box"
      :style="getBoxStyle(face)"
    >
      <div class="box-border"></div>

      <!-- Corner accents -->
      <span class="corner tl"></span>
      <span class="corner tr"></span>
      <span class="corner bl"></span>
      <span class="corner br"></span>

      <!-- Label badge -->
      <div class="box-label" :style="getLabelStyle(face)">
        <span class="face-idx">#{{ idx + 1 }}</span>
        <span class="emo-text">{{ face.emotion }}</span>
        <span class="conf-text">{{ pct(face.confidence) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.face-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
  overflow: hidden;
}

.face-box {
  position: absolute;
  transition: left 0.15s linear, top 0.15s linear,
              width 0.15s linear, height 0.15s linear;
}

/* Main border */
.box-border {
  position: absolute;
  inset: 0;
  border: 2px solid var(--face-color, var(--primary));
  border-radius: 6px;
  box-shadow:
    0 0 0 1px rgba(0,0,0,0.4),
    0 0 12px -2px var(--face-color, var(--primary));
}

/* Corner accents */
.corner {
  position: absolute;
  width: 10px;
  height: 10px;
  border-color: var(--face-color, var(--primary));
  border-style: solid;
}
.tl { top: -1px;  left: -1px;  border-width: 2px 0 0 2px; border-radius: 4px 0 0 0; }
.tr { top: -1px;  right: -1px; border-width: 2px 2px 0 0; border-radius: 0 4px 0 0; }
.bl { bottom: -1px; left: -1px;  border-width: 0 0 2px 2px; border-radius: 0 0 0 4px; }
.br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; border-radius: 0 0 4px 0; }

/* Label */
.box-label {
  position: absolute;
  left: -1px;
  background: var(--face-color, var(--primary));
  color: #fff;
  padding: 3px 8px;
  border-radius: 5px 5px 5px 0;
  font-size: 0.7rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  animation: label-in 0.2s ease-out;
  line-height: 1.4;
}

@keyframes label-in {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}

.face-idx {
  opacity: 0.75;
  font-size: 0.65rem;
}

.emo-text {
  text-transform: capitalize;
}

.conf-text {
  opacity: 0.85;
  font-size: 0.65rem;
  background: rgba(0,0,0,0.2);
  padding: 1px 4px;
  border-radius: 3px;
}
</style>
