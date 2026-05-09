<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  Sun, Moon, Camera, Upload, BarChart3, Home, Menu, X, Cpu, 
  ShieldCheck, Zap, Github, Activity, LayoutGrid, History, Settings
} from 'lucide-vue-next'

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

// Fix Mobile Menu Bug
const handleResize = () => {
  if (window.innerWidth > 768 && isMenuOpen.value) {
    isMenuOpen.value = false
  }
}

onMounted(() => {
  document.documentElement.setAttribute('data-theme', 'light')
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// Mock Data for UI
const emotions = [
  { name: 'Happy', value: 85 },
  { name: 'Neutral', value: 12 },
  { name: 'Sad', value: 3 }
]

const stats = [
  { label: 'Total Scans', value: '1,284', icon: Activity },
  { label: 'Avg Accuracy', value: '94.2%', icon: ShieldCheck },
  { label: 'Latency', value: '12ms', icon: Zap }
]

const features = [
  { icon: Cpu, title: 'ResNet50 Model', desc: 'Kiến trúc Deep Learning tối ưu cho nhận diện biểu cảm.' },
  { icon: Zap, title: 'Real-time', desc: 'Độ trễ cực thấp (<0.5s) đảm bảo trải nghiệm tức thì.' },
  { icon: ShieldCheck, title: 'Privacy First', desc: 'Xử lý dữ liệu an toàn, không lưu trữ hình ảnh cá nhân.' }
]
</script>

<template>
  <div class="app-wrapper">
    <div class="bg-dots"></div>
    <div class="bg-gradient"></div>
    
    <!-- Navbar -->
    <nav class="navbar">
      <div class="container nav-content">
        <div class="logo" @click="setTab('home')">
          <div class="logo-icon"></div>
          <span class="logo-text">EMOTION<span class="highlight">AI</span></span>
        </div>

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
          
          <button class="theme-toggle" @click="toggleTheme">
            <Sun v-if="isDark" :size="20" />
            <Moon v-else :size="20" />
          </button>

          <a href="https://github.com/Dat-2536/emoreg" target="_blank" class="github-link">
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
          <button class="mobile-nav-item" @click="setTab('home')"><Home :size="18"/> Home</button>
          <button class="mobile-nav-item" @click="setTab('webcam')"><Camera :size="18"/> Webcam</button>
          <button class="mobile-nav-item" @click="setTab('upload')"><Upload :size="18"/> Upload</button>
          <button class="mobile-nav-item" @click="setTab('stats')"><BarChart3 :size="18"/> Stats</button>
          <button class="mobile-nav-item theme-mobile" @click="toggleTheme">
             <Sun v-if="isDark" :size="18" />
             <Moon v-else :size="18" />
             {{ isDark ? 'Chế độ Sáng' : 'Chế độ Tối' }}
          </button>
        </div>
      </transition>
    </nav>

    <!-- Main Content -->
    <main class="main-container">
      <div class="container">
        <transition name="fade" mode="out-in">
          <div :key="currentTab">
            
            <!-- HOME TAB -->
            <section v-if="currentTab === 'home'" class="hero-section">
              <div class="hero-badge">Deep Learning Engine v1.0</div>
              <h1 class="hero-title">Nhận Diện Cảm Xúc <br/> <span class="glow-text">Intelligence</span></h1>
              <p class="hero-desc">
                Hệ thống AI tiên tiến dựa trên ResNet50, cung cả khả năng phân tích biểu cảm 
                khuôn mặt với độ chính xác vượt trội.
              </p>
              <div class="hero-actions">
                <button class="btn btn-primary btn-glow" @click="setTab('webcam')">Trải nghiệm ngay</button>
                <button class="btn btn-outline" @click="setTab('upload')">Xem hướng dẫn</button>
              </div>

              <div class="features-grid">
                <div v-for="f in features" :key="f.title" class="feature-card glass">
                  <div class="feature-icon-box">
                    <component :is="f.icon" :size="24" />
                  </div>
                  <h3>{{ f.title }}</h3>
                  <p>{{ f.desc }}</p>
                </div>
              </div>
            </section>

            <!-- WEBCAM TAB -->
            <section v-else-if="currentTab === 'webcam'" class="service-page">
              <div class="page-header">
                <div>
                  <h2 class="page-title">Live Vision Analysis</h2>
                  <p class="page-subtitle">Nhận diện thời gian thực qua luồng camera của bạn.</p>
                </div>
                <div class="status-pill"><span class="pulse-dot"></span> AI Engine Running</div>
              </div>

              <div class="vision-grid">
                <div class="vision-main card glass">
                  <div class="hud-container">
                    <div class="hud-corners">
                      <div class="corner tl"></div><div class="corner tr"></div>
                      <div class="corner bl"></div><div class="corner br"></div>
                    </div>
                    <div class="scanner-bar"></div>
                    <div class="camera-placeholder">
                        <Camera :size="64" class="faint-icon" />
                        <p>Waiting for Camera access...</p>
                        <button class="btn btn-primary mt-6">Kích hoạt Camera</button>
                    </div>
                  </div>
                </div>

                <div class="vision-sidebar">
                  <div class="sidebar-card card glass">
                    <h3>Emotion Analysis</h3>
                    <div class="emotion-list">
                      <div v-for="e in emotions" :key="e.name" class="emotion-item">
                        <div class="emotion-info">
                          <span>{{ e.name }}</span>
                          <span>{{ e.value }}%</span>
                        </div>
                        <div class="progress-bg"><div class="progress-fill" :style="{ width: e.value + '%' }"></div></div>
                      </div>
                    </div>
                  </div>
                  <div class="sidebar-card card glass">
                    <h3>System Logs</h3>
                    <div class="log-list">
                      <div class="log-entry">Detecting face #1...</div>
                      <div class="log-entry">Confidence: 98.4%</div>
                      <div class="log-entry">Status: Stable</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- UPLOAD TAB -->
            <section v-else-if="currentTab === 'upload'" class="service-page">
              <div class="page-header">
                <div>
                  <h2 class="page-title">Image Analysis</h2>
                  <p class="page-subtitle">Tải ảnh lên để phân tích biểu cảm khuôn mặt chi tiết.</p>
                </div>
              </div>

              <div class="upload-container card glass">
                <div class="drop-zone">
                    <div class="upload-icon-circle"><Upload :size="32" /></div>
                    <h3>Kéo thả ảnh vào đây</h3>
                    <p>Hỗ trợ định dạng JPG, PNG, WEBP (Tối đa 5MB)</p>
                    <button class="btn btn-outline mt-8">Chọn từ máy tính</button>
                </div>
              </div>
            </section>

            <!-- STATS TAB -->
            <section v-else-if="currentTab === 'stats'" class="service-page">
              <div class="page-header">
                <div>
                  <h2 class="page-title">Analytics Dashboard</h2>
                  <p class="page-subtitle">Tổng quan hiệu năng và dữ liệu nhận diện của hệ thống.</p>
                </div>
              </div>

              <div class="stats-grid">
                <div v-for="s in stats" :key="s.label" class="stat-card card glass">
                    <div class="stat-icon"><component :is="s.icon" :size="20" /></div>
                    <div class="stat-content">
                      <span class="stat-label">{{ s.label }}</span>
                      <span class="stat-value">{{ s.value }}</span>
                    </div>
                </div>
              </div>

              <div class="chart-container card glass">
                <div class="chart-header">
                    <h3>Detection Trends</h3>
                    <div class="chart-filters">
                      <button class="filter-btn active">Week</button>
                      <button class="filter-btn">Month</button>
                    </div>
                </div>
                <div class="chart-placeholder">
                    <BarChart3 :size="48" class="faint-icon" />
                    <p>Dữ liệu đang được tổng hợp...</p>
                </div>
              </div>
            </section>

          </div>
        </transition>
      </div>
    </main>

    <footer class="footer">
      <div class="container">
        <p>© 2026 EmotionAI Project. Built for high-performance AI monitoring.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Layout Spacing Improvements */
.main-container {
  padding-top: 3rem;
  padding-bottom: 5rem;
  flex: 1;
}

.service-page {
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3.5rem; /* Increased margin for better breathing room */
}

.page-title {
  font-size: 2.8rem; /* Slightly larger */
  font-weight: 900;
  margin-bottom: 0.75rem;
}

/* Vision Grid Spacing */
.vision-grid {
  display: grid;
  grid-template-columns: 1fr 380px; /* Wider sidebar */
  gap: 3rem; /* Increased gap */
}

.vision-main {
  min-height: 600px;
  padding: 1.5rem; /* Better internal padding */
  display: flex;
  flex-direction: column;
}

.vision-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* Gap between sidebar cards */
}

.sidebar-card {
  padding: 2rem; /* Better internal padding */
}

.sidebar-card h3 {
  font-size: 1.1rem;
  margin-bottom: 2rem; /* More space below titles */
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.emotion-list { display: flex; flex-direction: column; gap: 1.5rem; }

/* Upload Spacing */
.upload-container {
  padding: 6rem 4rem; /* More vertical padding */
  text-align: center;
  border: 2px dashed rgba(var(--primary-rgb), 0.2);
}

.drop-zone { gap: 2rem; }

.upload-icon-circle { margin-bottom: 1.5rem; }

/* Stats Spacing */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem; /* More space between stat cards */
  margin-bottom: 3rem;
}

.stat-card {
  padding: 2.5rem; /* Better internal padding */
}

.chart-container {
  padding: 2.5rem; /* Better internal padding */
  margin-top: 2rem;
}

.chart-header { margin-bottom: 3rem; }

/* Utility Spacing */
.mt-6 { margin-top: 1.5rem; }
.mt-8 { margin-top: 2.5rem; }

@media (max-width: 1100px) {
  .vision-grid { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .main-container { padding-top: 2rem; }
  .page-header { margin-bottom: 2.5rem; flex-direction: column; align-items: flex-start; gap: 1.5rem; }
  .page-title { font-size: 2.2rem; }
  .stats-grid { grid-template-columns: 1fr; gap: 1.5rem; }
  .upload-container { padding: 4rem 2rem; }
}
</style>

<style scoped>
/* Page Layouts */
.service-page {
  padding: 2rem 0;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2.5rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.status-pill {
  padding: 0.5rem 1rem;
  background: rgba(var(--primary-rgb), 0.1);
  border: 1px solid rgba(var(--primary-rgb), 0.2);
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: var(--primary);
  border-radius: 50%;
  animation: pulse-dot 1.5s infinite;
}

@keyframes pulse-dot {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0.7); }
  70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(var(--primary-rgb), 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0); }
}

/* Vision Grid */
.vision-grid {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.vision-main {
  min-height: 550px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.hud-container {
  flex: 1;
  background: #000;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.hud-corners .corner {
  position: absolute;
  width: 30px;
  height: 30px;
  border: 2px solid var(--primary);
}

.tl { top: 20px; left: 20px; border-right: 0; border-bottom: 0; }
.tr { top: 20px; right: 20px; border-left: 0; border-bottom: 0; }
.bl { bottom: 20px; left: 20px; border-right: 0; border-top: 0; }
.br { bottom: 20px; right: 20px; border-left: 0; border-top: 0; }

.scanner-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
  box-shadow: 0 0 15px var(--primary);
  animation: scan 4s infinite linear;
  z-index: 5;
}

.camera-placeholder {
  text-align: center;
  opacity: 0.6;
}

.faint-icon { opacity: 0.2; margin-bottom: 1rem; }

/* Sidebar */
.sidebar-card h3 {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.emotion-list { display: flex; flex-direction: column; gap: 1.2rem; }

.emotion-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.progress-bg {
  height: 8px;
  background: rgba(var(--primary-rgb), 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 10px;
  transition: width 1s ease-out;
}

.log-list {
  font-family: monospace;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.log-entry { margin-bottom: 0.5rem; padding-left: 1rem; border-left: 2px solid var(--primary); }

/* Upload Area */
.upload-container {
  padding: 4rem;
  text-align: center;
  border: 2px dashed rgba(var(--primary-rgb), 0.2);
}

.drop-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.upload-icon-circle {
  width: 80px;
  height: 80px;
  background: rgba(var(--primary-rgb), 0.1);
  color: var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: var(--primary);
  color: #fff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-label { display: block; font-size: 0.9rem; color: var(--text-secondary); }
.stat-value { display: block; font-size: 1.8rem; font-weight: 800; }

.chart-placeholder {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.filter-btn {
  padding: 0.4rem 1rem;
  background: transparent;
  border: 1px solid rgba(var(--primary-rgb), 0.2);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  margin-left: 0.5rem;
}

.filter-btn.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.mt-6 { margin-top: 1.5rem; }
.mt-8 { margin-top: 2rem; }

@media (max-width: 1100px) {
  .vision-grid { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .page-title { font-size: 2rem; }
  .stats-grid { grid-template-columns: 1fr; }
  .upload-container { padding: 2rem; }
}
</style>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  height: 80px;
  background-color: rgba(var(--surface-rgb), 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(var(--primary-rgb), 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: var(--primary);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  box-shadow: 0 0 15px var(--primary);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-item {
  background: transparent;
  border: none;
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

.hero-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(var(--primary-rgb), 0.1);
  color: var(--primary);
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 2rem;
  border: 1px solid rgba(var(--primary-rgb), 0.2);
}

.hero-title {
  font-size: 4.5rem;
  font-weight: 900;
  letter-spacing: -2px;
  margin-bottom: 1.5rem;
}

.glow-text {
  color: var(--primary);
  text-shadow: 0 0 30px rgba(var(--primary-rgb), 0.4);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 5rem;
}

.glass {
  background: rgba(var(--surface-rgb), 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--primary-rgb), 0.1);
}

.feature-card {
  padding: 2.5rem;
  border-radius: 20px;
  text-align: left;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
  border-color: var(--primary);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.feature-icon-box {
  width: 50px;
  height: 50px;
  background: var(--primary);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.main-card {
  height: 500px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scanner-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
  animation: scan 3s infinite linear;
  z-index: 2;
}

@keyframes scan {
  0% { top: 0; }
  100% { top: 100%; }
}

.ui-frames .frame {
  position: absolute;
  width: 40px;
  height: 40px;
  border: 3px solid var(--primary);
  opacity: 0.5;
}

.top-left { top: 20px; left: 20px; border-right: 0; border-bottom: 0; }
.top-right { top: 20px; right: 20px; border-left: 0; border-bottom: 0; }
.bottom-left { bottom: 20px; left: 20px; border-right: 0; border-top: 0; }
.bottom-right { bottom: 20px; right: 20px; border-left: 0; border-top: 0; }

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.dot {
  width: 10px;
  height: 10px;
  background: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 10px #22c55e;
}

.footer {
  margin-top: auto;
  padding: 2rem 0;
  border-top: 1px solid rgba(var(--primary-rgb), 0.1);
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

@media (max-width: 1024px) {
  .hero-title { font-size: 3.5rem; }
  .features-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .hero-title { font-size: 2.8rem; }
  .features-grid { grid-template-columns: 1fr; }
  .mobile-menu {
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    gap: 1rem;
    background: var(--surface-color);
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    border-bottom: 1px solid rgba(var(--primary-rgb), 0.1);
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
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
  }
  .theme-mobile { background: var(--primary); color: white; }
}
</style>

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
