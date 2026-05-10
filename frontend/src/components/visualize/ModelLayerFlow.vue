<script setup>
import { 
  Box, 
  Layers, 
  Activity, 
  Minimize2, 
  Repeat, 
  Network, 
  BarChart3,
  ArrowRight
} from 'lucide-vue-next'

const props = defineProps({
  activeLayerIndex: Number,
  selectedLayer: Object,
  isActive: Boolean
})

const emit = defineEmits(['layer-click'])

const layers = [
  { id: 'input-tensor', title: 'Input Tensor', icon: Box },
  { id: 'convolution', title: 'Convolution', icon: Layers },
  { id: 'relu', title: 'ReLU', icon: Activity },
  { id: 'pooling', title: 'Pooling', icon: Minimize2 },
  { id: 'residual-blocks', title: 'Res Blocks', icon: Repeat },
  { id: 'dense', title: 'Dense', icon: Network },
  { id: 'softmax', title: 'Softmax', icon: BarChart3 }
]
</script>

<template>
  <div class="model-flow-card card glass p-8">
    <div class="section-kicker mb-6">Model Architecture Flow</div>
    
    <div class="layers-container">
      <div 
        v-for="(layer, index) in layers" 
        :key="layer.id"
        class="layer-item"
      >
        <div 
          :class="[
            'layer-card', 
            { active: activeLayerIndex === index },
            { selected: selectedLayer?.id === layer.id }
          ]"
          @click="emit('layer-click', layer)"
        >
          <div class="layer-icon-wrapper">
            <component :is="layer.icon" :size="20" />
          </div>
          <div class="layer-title">{{ layer.title }}</div>
          
          <div class="particle-container" v-if="isActive && activeLayerIndex === index">
            <div class="particle p1"></div>
            <div class="particle p2"></div>
            <div class="particle p3"></div>
          </div>
        </div>
        
        <div class="layer-connector" v-if="index < layers.length - 1">
          <ArrowRight :size="16" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.model-flow-card {
  width: 100%;
}

.section-kicker {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--primary);
  letter-spacing: 0.1em;
  text-align: center;
}

.layers-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.layer-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.layer-card {
  width: 140px;
  height: 100px;
  padding: 16px;
  border-radius: 16px;
  background: rgba(var(--surface-rgb), 0.4);
  border: 1px solid rgba(var(--primary-rgb), 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.layer-card:hover {
  background: rgba(var(--surface-rgb), 0.6);
  border-color: rgba(var(--primary-rgb), 0.4);
  transform: translateY(-4px);
}

.layer-card.active {
  background: rgba(var(--primary-rgb), 0.15);
  border-color: var(--primary);
  box-shadow: 0 0 25px rgba(var(--primary-rgb), 0.25);
  transform: scale(1.05);
}

.layer-card.selected {
  background: rgba(var(--primary-rgb), 0.08);
  border-color: var(--primary);
}

.layer-icon-wrapper {
  color: var(--primary);
  background: rgba(var(--primary-rgb), 0.1);
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.layer-card.active .layer-icon-wrapper {
  background: var(--primary);
  color: white;
}

.layer-title {
  font-size: 12px;
  font-weight: 800;
  color: var(--text-primary);
  text-align: center;
  line-height: 1.2;
}

.layer-connector {
  color: var(--text-secondary);
  opacity: 0.3;
}

.particle-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 10;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--primary);
  border-radius: 50%;
  opacity: 0.8;
  filter: blur(1px);
}

.p1 { animation: move 0.8s infinite linear; top: 20%; left: -10%; }
.p2 { animation: move 1.2s infinite linear; top: 50%; left: -10%; animation-delay: 0.2s; }
.p3 { animation: move 1s infinite linear; top: 80%; left: -10%; animation-delay: 0.4s; }

@keyframes move {
  to { left: 110%; }
}

@media (max-width: 1200px) {
  .layer-connector {
    display: none;
  }
  .layers-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    width: 100%;
  }
  .layer-item {
    justify-content: center;
  }
  .layer-card {
    width: 100%;
  }
}

@media (max-width: 900px) {
  .layers-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 640px) {
  .layers-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  .layer-card {
    height: 90px;
    padding: 12px;
  }
  .layer-title {
    font-size: 11px;
  }
}
</style>
