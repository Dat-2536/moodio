<script setup>
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Zap, BookOpen, Cpu } from 'lucide-vue-next'

const props = defineProps({
  isRunning: Boolean,
  isPaused: Boolean,
  speed: Number,
  mode: String
})

const emit = defineEmits([
  'run', 'pause', 'resume', 'reset', 'next', 'previous', 'speed-change', 'mode-change'
])
</script>

<template>
  <div class="visualize-controls">
    <div class="control-card">
      <!-- Primary Actions -->
      <div class="control-row primary">
        <button v-if="!isRunning || isPaused" class="btn btn-primary btn-glow main-play-btn" @click="isRunning ? emit('resume') : emit('run')">
          <Play :size="16" />
          <span>{{ isRunning ? 'Resume' : 'Run Simulation' }}</span>
        </button>
        <button v-else class="btn btn-primary main-play-btn" @click="emit('pause')">
          <Pause :size="16" />
          <span>Pause Lab</span>
        </button>
        
        <div class="btn-group">
          <button class="btn btn-outline icon-btn" @click="emit('previous')" title="Previous Step">
            <ChevronLeft :size="18" />
          </button>
          <button class="btn btn-outline icon-btn" @click="emit('reset')" title="Reset Simulation">
            <RotateCcw :size="18" />
          </button>
          <button class="btn btn-outline icon-btn" @click="emit('next')" title="Next Step">
            <ChevronRight :size="18" />
          </button>
        </div>
      </div>

      <!-- Secondary Settings -->
      <div class="control-row secondary">
        <div class="setting-group speed-selector">
          <Zap :size="14" class="setting-icon" />
          <select :value="speed" @change="emit('speed-change', parseFloat($event.target.value))" class="select-input">
            <option :value="0.5">0.5x</option>
            <option :value="1">1.0x</option>
            <option :value="1.5">1.5x</option>
            <option :value="2">2.0x</option>
          </select>
        </div>

        <div class="mode-toggle">
          <button 
            :class="['mode-option', { active: mode === 'beginner' }]" 
            @click="emit('mode-change', 'beginner')"
          >
            <BookOpen :size="14" />
            <span>Beginner</span>
          </button>
          <button 
            :class="['mode-option', { active: mode === 'technical' }]" 
            @click="emit('mode-change', 'technical')"
          >
            <Cpu :size="14" />
            <span>Technical</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.control-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: stretch;
}

.control-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-row.primary {
  justify-content: flex-end;
}

.control-row.secondary {
  justify-content: flex-end;
}

.btn {
  height: 40px;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
}

.main-play-btn {
  min-width: 150px;
  justify-content: center;
}

.btn-group {
  display: flex;
  gap: 6px;
}

.icon-btn {
  width: 40px;
  padding: 0;
  justify-content: center;
}

.setting-group {
  height: 40px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  background: rgba(var(--primary-rgb), 0.05);
  border: 1px solid rgba(var(--primary-rgb), 0.1);
  border-radius: 10px;
}

.setting-icon {
  color: var(--primary);
}

.select-input {
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  outline: none;
}

.mode-toggle {
  display: flex;
  background: rgba(var(--surface-rgb), 0.4);
  padding: 3px;
  border-radius: 10px;
  border: 1px solid rgba(var(--primary-rgb), 0.08);
}

.mode-option {
  height: 34px;
  padding: 0 12px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.mode-option.active {
  background: var(--primary);
  color: white;
  box-shadow: 0 2px 8px rgba(var(--primary-rgb), 0.3);
}

@media (max-width: 1180px) {
  .control-row.primary, .control-row.secondary {
    justify-content: flex-start;
  }
}

@media (max-width: 600px) {
  .control-row.primary {
    flex-direction: column;
    align-items: stretch;
  }
  
  .main-play-btn {
    width: 100%;
  }
  
  .btn-group {
    justify-content: space-between;
  }
  
  .btn-group .btn {
    flex: 1;
  }
  
  .control-row.secondary {
    justify-content: space-between;
  }
  
  .speed-selector {
    flex: 1;
  }
  
  .mode-toggle {
    flex: 2;
  }
  
  .mode-option {
    flex: 1;
    justify-content: center;
  }
}
</style>
