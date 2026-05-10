<script setup>
import { ScanFace } from 'lucide-vue-next'
import EmotionResultCard from './EmotionResultCard.vue'

const props = defineProps({
  faces: {
    type: Array,
    default: () => []
  },
  isAnalyzing: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="face-result-list">
    <div v-if="isAnalyzing && faces.length === 0" class="status-card glass p-6 mb-4">
      <div class="flex flex-col items-center gap-3">
        <ScanFace :size="32" class="animate-pulse text-primary" />
        <p class="text-sm font-bold uppercase tracking-wider">Moodio Analyzing...</p>
      </div>
    </div>

    <div v-if="faces.length > 0" class="results-scroll-container app-scrollbar">
      <EmotionResultCard 
        v-for="(face, index) in faces"
        :key="face.id"
        :title="`Face #${index + 1}`"
        :emotion="face.emotion"
        :confidence="face.confidence * 100"
        :all-probs="face.all_probs"
        class="mb-4"
      >
        <template #footer>
          <div class="box-coords mt-3 pt-3 border-t border-white/10 text-[10px] font-mono opacity-50 flex gap-3">
            <span>X: {{ Math.round(face.box.x) }}%</span>
            <span>Y: {{ Math.round(face.box.y) }}%</span>
            <span>W: {{ Math.round(face.box.width) }}%</span>
            <span>H: {{ Math.round(face.box.height) }}%</span>
          </div>
        </template>
      </EmotionResultCard>
    </div>

    <div v-else-if="!isAnalyzing" class="empty-state-card glass p-8">
      <ScanFace :size="48" class="mx-auto mb-4 opacity-20" />
      <p class="text-secondary italic text-sm text-center">No faces detected yet.</p>
    </div>
  </div>
</template>

<style scoped>
.face-result-list {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.results-scroll-container {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
  max-height: calc(100vh - 350px);
}

.status-card, .empty-state-card {
  border-radius: 20px;
}
</style>
