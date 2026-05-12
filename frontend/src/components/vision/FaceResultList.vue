<script setup>
import { computed } from 'vue'
import { ScanFace, AlertCircle } from 'lucide-vue-next'
import EmotionResultCard from './EmotionResultCard.vue'

const props = defineProps({
  faces: {
    type: Array,
    default: () => [],
  },
  isAnalyzing: {
    type: Boolean,
    default: false,
  },
  hasPerformedAnalysis: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: null,
  },
  /** 'webcam' | 'image' – affects no-face wording */
  source: {
    type: String,
    default: 'image',
  },
})

const noFaceText = computed(() =>
  props.source === 'webcam'
    ? 'No face detected in current frame'
    : 'No face detected in this image'
)
</script>

<template>
  <div class="face-result-list">

    <!-- ① Analyzing / loading -->
    <div v-if="isAnalyzing" class="status-card glass p-6 mb-4">
      <div class="flex flex-col items-center gap-3">
        <ScanFace :size="32" class="animate-pulse text-primary" />
        <p class="text-sm font-bold uppercase tracking-wider">Moodio Analyzing…</p>
      </div>
    </div>

    <!-- ② API / network error (distinct from no-face) -->
    <div v-else-if="errorMessage" class="error-card glass p-6 mb-4">
      <div class="flex flex-col items-center gap-3">
        <AlertCircle :size="32" class="text-red-400" />
        <p class="text-sm font-semibold text-center text-red-300">{{ errorMessage }}</p>
      </div>
    </div>

    <!-- ③ Results: one or more faces -->
    <div v-else-if="faces.length > 0" class="results-scroll-container app-scrollbar">
      <EmotionResultCard
        v-for="(face, index) in faces"
        :key="face.id ?? index"
        :title="`Face #${index + 1}`"
        :emotion="face.emotion"
        :confidence="Math.round(face.confidence * 100)"
        :all-probs="face.all_probs
          ? Object.fromEntries(Object.entries(face.all_probs).map(([k,v]) => [k, Math.round(v * 100)]))
          : null"
        class="mb-4"
      >
        <template #footer>
          <div
            v-if="face.bounding_box"
            class="box-coords mt-3 pt-3 border-t border-white/10 text-xxs font-mono opacity-50 flex gap-3 flex-wrap"
          >
            <span>X: {{ Math.round(face.bounding_box.x) }}</span>
            <span>Y: {{ Math.round(face.bounding_box.y) }}</span>
            <span>W: {{ Math.round(face.bounding_box.width) }}</span>
            <span>H: {{ Math.round(face.bounding_box.height) }}</span>
          </div>
        </template>
      </EmotionResultCard>
    </div>

    <!-- ④ No face detected (only after a completed analysis) -->
    <div
      v-else-if="!isAnalyzing && hasPerformedAnalysis && !errorMessage"
      class="empty-state-card glass p-8"
    >
      <ScanFace :size="48" class="mx-auto mb-4 opacity-20" />
      <p class="text-secondary italic text-sm text-center">{{ noFaceText }}</p>
    </div>

    <!-- ⑤ Ready state (no analysis yet, no error) -->
    <div v-else-if="!isAnalyzing" class="empty-state-card glass p-8">
      <ScanFace :size="48" class="mx-auto mb-4 opacity-20" />
      <p class="text-secondary italic text-sm text-center">Ready to analyze faces.</p>
    </div>

  </div>
</template>

<style scoped>
.face-result-list {
  display: flex;
  flex-direction: column;
}

.results-scroll-container {
  overflow-y: auto;
  padding-right: 8px;
  max-height: calc(100vh - 350px);
}

.status-card,
.empty-state-card {
  border-radius: 20px;
}

.error-card {
  border-radius: 20px;
  border: 1px solid rgba(248, 113, 113, 0.3);
  background: rgba(239, 68, 68, 0.08);
}

/* Utility — keep consistent with global style.css */
.text-primary  { color: var(--primary); }
.text-red-400  { color: #f87171; }
.text-red-300  { color: #fca5a5; }
.text-secondary{ color: var(--text-secondary); }
.animate-pulse { animation: pulse 2s cubic-bezier(0.4,0,0.6,1) infinite; }
@keyframes pulse { 0%,100%{ opacity:1; } 50%{ opacity:.4; } }
.flex           { display: flex; }
.flex-col       { flex-direction: column; }
.items-center   { align-items: center; }
.gap-3          { gap: 0.75rem; }
.text-sm        { font-size: 0.875rem; }
.text-center    { text-align: center; }
.font-bold      { font-weight: 700; }
.font-semibold  { font-weight: 600; }
.uppercase      { text-transform: uppercase; }
.tracking-wider { letter-spacing: 0.05em; }
.italic         { font-style: italic; }
.mb-4           { margin-bottom: 1rem; }
.mx-auto        { margin-left: auto; margin-right: auto; }
.mt-3           { margin-top: 0.75rem; }
.pt-3           { padding-top: 0.75rem; }
.p-6            { padding: 1.5rem; }
.p-8            { padding: 2rem; }
.opacity-20     { opacity: 0.2; }
.opacity-50     { opacity: 0.5; }
.flex-wrap      { flex-wrap: wrap; }
</style>
