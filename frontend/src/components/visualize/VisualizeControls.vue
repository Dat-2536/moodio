<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Zap, BookOpen, Cpu, ChevronDown } from 'lucide-vue-next'

const props = defineProps({
  isRunning: Boolean,
  isPaused: Boolean,
  speed: Number,
  mode: String
})

const emit = defineEmits([
  'run', 'pause', 'resume', 'reset', 'next', 'previous', 'speed-change', 'mode-change'
])

const isSpeedOpen = ref(false)
const speedDropdownRef = ref(null)

const handleSpeedSelect = (s) => {
  emit('speed-change', s)
  isSpeedOpen.value = false
}

const handleClickOutside = (event) => {
  if (speedDropdownRef.value && !speedDropdownRef.value.contains(event.target)) {
    isSpeedOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('mousedown', handleClickOutside)
})
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
        <div class="setting-group speed-selector-wrapper" ref="speedDropdownRef">
          <button class="speed-toggle-btn" @click="isSpeedOpen = !isSpeedOpen">
            <Zap :size="14" class="setting-icon" />
            <span class="speed-value">{{ speed }}x</span>
            <ChevronDown :size="14" :class="['chevron-icon', { rotate: isSpeedOpen }]" />
          </button>
          
          <transition name="fade-scale">
            <div v-if="isSpeedOpen" class="speed-dropdown glass card">
              <div 
                v-for="s in [0.5, 1, 1.5, 2]" 
                :key="s"
                :class="['speed-option', { active: speed === s }]"
                @click="handleSpeedSelect(s)"
              >
                {{ s.toFixed(1) }}x
              </div>
            </div>
          </transition>
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

.speed-selector-wrapper {
  position: relative;
  height: 40px;
}

.speed-toggle-btn {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  background: rgba(var(--primary-rgb), 0.08);
  border: 1px solid rgba(var(--primary-rgb), 0.15);
  border-radius: 10px;
  color: var(--text-primary);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 85px;
}

.speed-toggle-btn:hover {
  background: rgba(var(--primary-rgb), 0.15);
  border-color: var(--primary);
}

.setting-icon {
  color: var(--primary);
}

.speed-value {
  flex: 1;
  text-align: left;
}

.chevron-icon {
  opacity: 0.5;
  transition: transform 0.3s ease;
}

.chevron-icon.rotate {
  transform: rotate(180deg);
}

.speed-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 100px;
  padding: 6px;
  z-index: 1000;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  border: 1px solid rgba(var(--primary-rgb), 0.2);
}

.speed-option {
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.speed-option:hover {
  background: rgba(var(--primary-rgb), 0.1);
  color: var(--primary);
}

.speed-option.active {
  background: var(--primary);
  color: white;
}

/* Transitions */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-10px);
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

@media (max-width: 460px) {
  .control-row.secondary {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  
  .speed-selector-wrapper {
    width: 100%;
  }
  
  .speed-toggle-btn {
    width: 100%;
    justify-content: center;
  }
  
  .mode-toggle {
    width: 100%;
  }
  
  .mode-option span {
    font-size: 11px;
  }
}
</style>
