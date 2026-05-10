<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  Home, Camera, Upload, BrainCircuit, BarChart3, Sun, Moon, Github, Menu, X, 
  ScanEye,
  ScanFace
} from 'lucide-vue-next'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
const isMenuOpen = ref(false)
const route = useRoute()

const handleResize = () => {
  if (window.innerWidth > 768 && isMenuOpen.value) {
    isMenuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <nav class="navbar">
    <div class="container nav-content">
      <RouterLink to="/" class="logo">
        <div class="logo-icon"></div>
        <span class="logo-text">MOODIO<span class="highlight">AI</span></span>
      </RouterLink>

      <div class="nav-links">
        <RouterLink to="/home" class="nav-item" active-class="active">
          <Home :size="18" /> Home
        </RouterLink>
        <RouterLink to="/webcam" class="nav-item" active-class="active">
          <Camera :size="18" /> Webcam
        </RouterLink>
        <RouterLink to="/image" class="nav-item" active-class="active">
          <Upload :size="18" /> Image
        </RouterLink>
        <RouterLink to="/visualize" class="nav-item" active-class="active">
          <ScanFace :size="18" /> Visualize
        </RouterLink>
        <RouterLink to="/stats" class="nav-item" active-class="active">
          <BarChart3 :size="18" /> Stats
        </RouterLink>
        
        <div class="divider"></div>
        
        <button class="theme-toggle" @click="toggleTheme">
          <Sun v-if="isDark" :size="20" />
          <Moon v-else :size="20" />
        </button>

        <a href="https://github.com/Dat-2536/moodio" target="_blank" class="github-link">
          <Github :size="20" />
        </a>
      </div>

      <button class="mobile-menu-btn" @click="isMenuOpen = !isMenuOpen">
        <Menu v-if="!isMenuOpen" />
        <X v-else />
      </button>
    </div>
    
    <transition name="slide">
      <div v-if="isMenuOpen" class="mobile-menu">
        <RouterLink to="/home" class="mobile-nav-item" @click="isMenuOpen = false"><Home :size="18"/> Home</RouterLink>
        <RouterLink to="/webcam" class="mobile-nav-item" @click="isMenuOpen = false"><Camera :size="18"/> Webcam</RouterLink>
        <RouterLink to="/image" class="mobile-nav-item" @click="isMenuOpen = false"><Upload :size="18"/> Image</RouterLink>
        <RouterLink to="/visualize" class="mobile-nav-item" @click="isMenuOpen = false"><BrainCircuit :size="18"/> Visualize</RouterLink>
        <RouterLink to="/stats" class="mobile-nav-item" @click="isMenuOpen = false"><BarChart3 :size="18"/> Stats</RouterLink>
        <button class="mobile-nav-item theme-mobile" @click="toggleTheme(); isMenuOpen = false">
           <Sun v-if="isDark" :size="18" />
           <Moon v-else :size="18" />
           {{ isDark ? 'Chế độ Sáng' : 'Chế độ Tối' }}
        </button>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
.navbar {
  height: 80px;
  background-color: rgba(var(--surface-rgb), 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(var(--primary-rgb), 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: var(--primary);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  box-shadow: 0 0 15px var(--primary);
}

.logo-text {
  font-weight: 800;
  font-size: 1.5rem;
  letter-spacing: -1px;
}

.highlight {
  color: var(--primary);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-item {
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.nav-item:hover, .nav-item.active {
  color: var(--primary);
  background: rgba(var(--primary-rgb), 0.08);
}

.divider {
  width: 1px;
  height: 24px;
  background: rgba(var(--primary-rgb), 0.1);
  margin: 0 0.5rem;
}

.theme-toggle, .github-link {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--primary-rgb), 0.05);
  border: 1px solid rgba(var(--primary-rgb), 0.1);
  color: var(--text-primary);
  cursor: pointer;
  margin-left: 0.5rem;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
}

.mobile-menu {
  position: absolute;
  top: 80px;
  left: 0;
  right: 0;
  background: var(--surface-color);
  padding: 1.5rem;
  border-bottom: 1px solid rgba(var(--primary-rgb), 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  z-index: 99;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(var(--primary-rgb), 0.05);
  border: none;
  border-radius: 12px;
  color: var(--text-primary);
  font-weight: 700;
  text-decoration: none;
}

.theme-mobile { 
  background: var(--primary); 
  color: white;
  justify-content: center;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from, .slide-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

@media (max-width: 768px) {
  .nav-links { display: none; }
  .mobile-menu-btn { display: block; }
}
</style>
