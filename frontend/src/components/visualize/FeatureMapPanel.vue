<script setup>
const props = defineProps({
  isActive: Boolean
})

const maps = [
  { id: 'edges', label: 'Edges', icon: '▥' },
  { id: 'eyes', label: 'Eyes Region', icon: '👁' },
  { id: 'mouth', label: 'Mouth Curve', icon: '👄' },
  { id: 'brows', label: 'Eyebrows', icon: '〰' },
  { id: 'texture', label: 'Texture', icon: '░' },
  { id: 'pattern', label: 'Expression', icon: '🎭' }
]
</script>

<template>
  <div class="feature-map-panel">
    <div class="panel-header mb-4">
      <h3>Learned Feature Maps</h3>
      <p>Hidden layers detect specific patterns to distinguish emotions.</p>
    </div>

    <div class="maps-grid">
      <div 
        v-for="map in maps" 
        :key="map.id" 
        class="map-card"
        :class="{ pulse: isActive }"
      >
        <div class="map-visual">
          <div class="map-icon">{{ map.icon }}</div>
          <div class="noise-overlay"></div>
        </div>
        <div class="map-label">{{ map.label }}</div>
      </div>
    </div>
    <div class="note mt-4">* Illustrative feature maps</div>
  </div>
</template>

<style scoped>
.feature-map-panel {
  width: 100%;
}

.panel-header {
  text-align: center;
}

.panel-header h3 {
  font-size: 1rem;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: 4px;
}

.panel-header p {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.maps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.map-card {
  text-align: center;
  transition: all 0.3s ease;
}

.map-visual {
  aspect-ratio: 1;
  background: #080808;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(var(--primary-rgb), 0.15);
}

.map-icon {
  font-size: 1.5rem;
  color: var(--primary);
  opacity: 0.7;
  filter: blur(0.5px);
}

.noise-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAElBMVEUAAAAAAAAAAAAAAAAAAAAAAADgK8oBAAAAAnRSTlMAAQGU/N4AAAAnSURBVDjXY2AgD3DAbWAAYEAXcMBtYABgQBdwIGRgAGBAF3DAZWAAYCAnYmX+1mYAAAAASUVORK5CYII=');
  opacity: 0.15;
  mix-blend-mode: screen;
}

.map-label {
  font-size: 10px;
  font-weight: 800;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.map-card.pulse .map-visual {
  animation: mapPulse 2s infinite ease-in-out;
}

@keyframes mapPulse {
  0%, 100% { border-color: rgba(var(--primary-rgb), 0.15); box-shadow: none; }
  50% { border-color: var(--primary); box-shadow: 0 0 15px rgba(var(--primary-rgb), 0.2); }
}

.note {
  font-size: 10px;
  color: var(--text-secondary);
  font-style: italic;
  text-align: center;
  opacity: 0.6;
}
</style>
