<script setup>
import { ref, onMounted } from 'vue'
import { Sun, Moon, Camera, Upload, BarChart3, Home, Menu, X } from 'lucide-vue-next'

// Theme Logic
const isDark = ref(false)
const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}

// Navigation Logic
const currentTab = ref('home')
const isMenuOpen = ref(false)

const setTab = (tab) => {
  currentTab.value = tab
  isMenuOpen.value = false
}

onMounted(() => {
  // Default Light Mode is already set in CSS, but ensure data-theme is consistent
  document.documentElement.setAttribute('data-theme', 'light')
})
</script>

<template>
  <div class="app-wrapper">
    <div class="bg-gradient"></div>
    
    <!-- Navbar -->
    <nav class="navbar">
      <div class="container nav-content">
        <div class="logo" @click="setTab('home')">
          <span class="logo-text">EMOTION<span class="highlight">AI</span></span>
        </div>

        <!-- Desktop Menu -->
        <div class="nav-links">
          <button :class="['nav-item', { active: currentTab === 'home' }]" @click="setTab('home')">
            <Home :size="18" /> Home
          </button>
          <button :class="['nav-item', { active: currentTab === 'webcam' }]" @click="setTab('webcam')">
            <Camera :size="18" /> Webcam
          </button>
          <button :class="['nav-item', { active: currentTab === 'upload' }]" @click="setTab('upload')">
            <Upload :size="18" /> Upload
          </button>
          <button :class="['nav-item', { active: currentTab === 'stats' }]" @click="setTab('stats')">
            <BarChart3 :size="18" /> Stats
          </button>
          
          <div class="divider"></div>
          
          <button class="theme-toggle" @click="toggleTheme" aria-label="Toggle Theme">
            <Sun v-if="isDark" :size="20" />
            <Moon v-else :size="20" />
          </button>
        </div>

        <!-- Mobile Toggle -->
        <button class="mobile-menu-btn" @click="isMenuOpen = !isMenuOpen">
          <Menu v-if="!isMenuOpen" />
          <X v-else />
        </button>
      </div>
      
      <!-- Mobile Menu -->
      <transition name="slide">
        <div v-if="isMenuOpen" class="mobile-menu">
          <button class="mobile-nav-item" @click="setTab('home')">Home</button>
          <button class="mobile-nav-item" @click="setTab('webcam')">Webcam</button>
          <button class="mobile-nav-item" @click="setTab('upload')">Upload</button>
          <button class="mobile-nav-item" @click="setTab('stats')">Stats</button>
          <button class="mobile-nav-item" @click="toggleTheme">
            {{ isDark ? 'Switch to Light' : 'Switch to Dark' }}
          </button>
        </div>
      </transition>
    </nav>

    <!-- Main Content -->
    <main class="container main-content">
      <transition name="fade" mode="out-in">
        <div :key="currentTab">
          <!-- Home Section -->
          <section v-if="currentTab === 'home'" class="hero-section">
            <h1 class="hero-title">Nhận Diện Cảm Xúc <span class="highlight">Bằng AI</span></h1>
            <p class="hero-desc">
              Sử dụng kiến trúc ResNet50 tiên tiến để phân tích biểu cảm khuôn mặt 
              ngay lập tức qua Webcam hoặc hình ảnh tải lên.
            </p>
            <div class="hero-actions">
              <button class="btn btn-primary" @click="setTab('webcam')">Bắt đầu ngay</button>
              <button class="btn btn-outline" @click="setTab('upload')">Upload ảnh</button>
            </div>
          </section>

          <!-- Placeholder for other tabs -->
          <section v-else class="feature-section">
            <div class="card">
              <h2 v-if="currentTab === 'webcam'">Live Webcam Analysis</h2>
              <h2 v-if="currentTab === 'upload'">Image Analysis</h2>
              <h2 v-if="currentTab === 'stats'">System Dashboard</h2>
              <p class="mt-4">Tính năng đang được khởi tạo...</p>
              <div class="placeholder-box">
                 <Camera v-if="currentTab === 'webcam'" :size="48" />
                 <Upload v-if="currentTab === 'upload'" :size="48" />
                 <BarChart3 v-if="currentTab === 'stats'" :size="48" />
              </div>
            </div>
          </section>
        </div>
      </transition>
    </main>
  </div>
</template>

<style scoped>
.navbar {
  height: 70px;
  background-color: var(--surface-color);
  border-bottom: 1px solid rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

[data-theme='dark'] .navbar {
  border-bottom: 1px solid #333;
}

.nav-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  cursor: pointer;
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
  gap: 1rem;
}

.nav-item {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}

.nav-item:hover, .nav-item.active {
  color: var(--primary);
  background: rgba(118, 185, 0, 0.1);
}

.divider {
  width: 1px;
  height: 24px;
  background: rgba(0,0,0,0.1);
  margin: 0 0.5rem;
}

[data-theme='dark'] .divider {
  background: rgba(255,255,255,0.1);
}

.theme-toggle {
  background: var(--bg-color);
  border: 1px solid rgba(0,0,0,0.1);
  color: var(--text-primary);
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.hero-section {
  padding: 5rem 0;
  text-align: center;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.1;
}

.hero-desc {
  font-size: 1.25rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto 2.5rem;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--primary);
  color: var(--primary);
}

.placeholder-box {
  height: 300px;
  background: rgba(0,0,0,0.02);
  border: 2px dashed rgba(0,0,0,0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  color: var(--text-secondary);
}

[data-theme='dark'] .placeholder-box {
  background: rgba(255,255,255,0.02);
  border: 2px dashed rgba(255,255,255,0.1);
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .nav-links { display: none; }
  .mobile-menu-btn { display: block; }
  .hero-title { font-size: 2.5rem; }
}

.mobile-menu {
  position: absolute;
  top: 70px;
  left: 0;
  right: 0;
  background: var(--surface-color);
  padding: 1rem;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-nav-item {
  padding: 0.8rem;
  text-align: left;
  background: none;
  border: none;
  color: var(--text-primary);
  font-weight: 500;
  border-radius: 8px;
}

.mt-4 { margin-top: 1rem; }
</style>
