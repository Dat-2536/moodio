<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { 
  Sun, Moon, Camera, Upload, BarChart3, Home, Menu, X, Cpu, 
  ShieldCheck, Zap, Github, Activity, LayoutGrid, History, Settings, Play, Film
} from 'lucide-vue-next'
import AOS from 'aos'
import 'aos/dist/aos.css'
import NeuralNetworkBackground from './components/NeuralNetworkBackground.vue'

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

watch(currentTab, () => {
  nextTick(() => {
    AOS.refresh()
  })
})

// Fix Mobile Menu Bug
const handleResize = () => {
  if (window.innerWidth > 768 && isMenuOpen.value) {
    isMenuOpen.value = false
  }
}

onMounted(() => {
  document.documentElement.setAttribute('data-theme', 'light')
  window.addEventListener('resize', handleResize)
  AOS.init({
    duration: 800,
    once: false,
    mirror: true
  })
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
  { icon: Cpu, title: 'ResNet50 Model', desc: 'Kiß║┐n tr├║c Deep Learning tß╗æi ╞░u cho nhß║¡n diß╗çn biß╗âu cß║úm.' },
  { icon: Zap, title: 'Real-time', desc: '─Éß╗Ö trß╗à cß╗▒c thß║Ñp (<0.5s) ─æß║úm bß║úo trß║úi nghiß╗çm tß╗⌐c th├¼.' },
  { icon: ShieldCheck, title: 'Privacy First', desc: 'Xß╗¡ l├╜ dß╗» liß╗çu an to├án, kh├┤ng l╞░u trß╗» h├¼nh ß║únh c├í nh├ón.' }
]

// Video Analysis Logic
const videoUrl = ref('')
const videoRef = ref(null)
const videoCanvasRef = ref(null)
const isAnalyzing = ref(false)
const currentEmotion = ref(null)
const analysisInterval = ref(null)

const handleVideoUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    if (videoUrl.value) URL.revokeObjectURL(videoUrl.value)
    videoUrl.value = URL.createObjectURL(file)
  }
}

const startVideoAnalysis = () => {
  if (isAnalyzing.value) return
  isAnalyzing.value = true
  
  analysisInterval.value = setInterval(async () => {
    if (!videoRef.value || videoRef.value.paused || videoRef.value.ended) return
    
    const canvas = videoCanvasRef.value
    const video = videoRef.value
    if (!canvas || !video) return
    
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    canvas.toBlob(async (blob) => {
      const formData = new FormData()
      formData.append('file', blob, 'frame.jpg')
      
      try {
        const response = await fetch('http://localhost:8000/stream-frame', {
          method: 'POST',
          body: formData
        })
        const data = await response.json()
        currentEmotion.value = data
      } catch (err) {
        console.error('Analysis error:', err)
      }
    }, 'image/jpeg', 0.7)
  }, 1000) // Gß╗¡i frame mß╗ùi gi├óy
}

const stopVideoAnalysis = () => {
  isAnalyzing.value = false
  if (analysisInterval.value) {
    clearInterval(analysisInterval.value)
    analysisInterval.value = null
  }
}

onUnmounted(() => {
  stopVideoAnalysis()
  if (videoUrl.value) URL.revokeObjectURL(videoUrl.value)
})

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
          <button :class="['nav-item', { active: currentTab === 'video' }]" @click="setTab('video')">
            <Film :size="18" /> Video
          </button>
          <button :class="['nav-item', { active: currentTab === 'stats' }]" @click="setTab('stats')">
            <BarChart3 :size="18" /> Stats
          </button>
          
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
          <button class="mobile-nav-item" @click="setTab('home')"><Home :size="18"/> Home</button>
          <button class="mobile-nav-item" @click="setTab('webcam')"><Camera :size="18"/> Webcam</button>
          <button class="mobile-nav-item" @click="setTab('upload')"><Upload :size="18"/> Upload</button>
          <button class="mobile-nav-item" @click="setTab('video')"><Film :size="18"/> Video</button>
          <button class="mobile-nav-item" @click="setTab('stats')"><BarChart3 :size="18"/> Stats</button>
          <button class="mobile-nav-item theme-mobile" @click="toggleTheme">
             <Sun v-if="isDark" :size="18" />
             <Moon v-else :size="18" />
             {{ isDark ? 'Chß║┐ ─æß╗Ö S├íng' : 'Chß║┐ ─æß╗Ö Tß╗æi' }}
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
              <NeuralNetworkBackground />
              <div class="hero-content">
                <div class="hero-badge" data-aos="fade-down">Deep Learning Engine v1.0</div>
                <h1 class="hero-title" data-aos="zoom-in" data-aos-delay="100">
                  <span class="word-group">Nhß║¡n Diß╗çn</span>
                  <span class="word-group">Cß║úm X├║c</span> <br/> 
                  <span class="glow-text">Intelligence</span>
                </h1>
                <p class="hero-desc" data-aos="fade-up" data-aos-delay="200">
                  Hß╗ç thß╗æng AI ti├¬n tiß║┐n dß╗▒a tr├¬n ResNet50, cung cß║Ñp khß║ú n─âng ph├ón t├¡ch biß╗âu cß║úm 
                  khu├┤n mß║╖t vß╗¢i ─æß╗Ö ch├¡nh x├íc v╞░ß╗út trß╗Öi.
                </p>
                <div class="hero-actions">
                  <button class="btn btn-primary btn-glow" @click="setTab('webcam')">Trß║úi nghiß╗çm ngay</button>
                  <button class="btn btn-outline" @click="setTab('upload')">Xem h╞░ß╗¢ng dß║½n</button>
                </div>

                <div class="features-grid">
                  <div v-for="(f, idx) in features" :key="f.title" class="feature-card glass" data-aos="flip-up" :data-aos-delay="400 + (idx * 100)">
                    <div class="feature-icon-box">
                      <component :is="f.icon" :size="24" />
                    </div>
                    <h3>{{ f.title }}</h3>
                    <p>{{ f.desc }}</p>
                  </div>
                </div>

                <div class="academic-section mt-12" data-aos="fade-up">
                  <div class="card glass text-left" style="padding: 3rem; border-radius: 20px;">
                    <h2 class="text-3xl font-bold mb-6" data-aos="fade-right" style="color: var(--primary);">Nghi├¬n Cß╗⌐u Deep Learning</h2>
                    <p class="mb-4" data-aos="fade-up" data-aos-delay="100" style="line-height: 1.8; font-size: 1.1rem; color: var(--text-secondary);">
                      ß╗¿ng dß╗Ñng n├áy l├á minh chß╗⌐ng trß╗▒c quan cho sß╗⌐c mß║ính cß╗ºa mß║íng n╞í-ron t├¡ch chß║¡p s├óu (Deep Convolutional Neural Networks). 
                      ─É╞░ß╗úc tinh chß╗ënh dß╗▒a tr├¬n kiß║┐n tr├║c <strong>ResNet50</strong> (Residual Networks), m├┤ h├¼nh ─æ├ú giß║úi quyß║┐t th├ánh c├┤ng b├ái to├ín <em>Vanishing Gradient</em>, 
                      cho ph├⌐p tr├¡ch xuß║Ñt c├íc ─æß║╖c tr╞░ng khu├┤n mß║╖t vß╗¢i ─æß╗Ö s├óu l├¬n ─æß║┐n 50 lß╗¢p.
                    </p>
                    <p class="mb-6" data-aos="fade-up" data-aos-delay="200" style="line-height: 1.8; font-size: 1.1rem; color: var(--text-secondary);">
                      Bß║▒ng c├ích ├íp dß╗Ñng c├íc kß╗╣ thuß║¡t nh╞░ Data Augmentation, Transfer Learning v├á tß╗æi ╞░u h├│a h├ám suy hao, 
                      hß╗ç thß╗æng kh├┤ng chß╗ë ─æß║ít ─æß╗Ö ch├¡nh x├íc cao tr├¬n tß║¡p dß╗» liß╗çu kiß╗âm thß╗¡ m├á c├▓n c├│ khß║ú n─âng tß╗òng qu├ít h├│a 
                      v╞░ß╗út trß╗Öi trong c├íc ─æiß╗üu kiß╗çn m├┤i tr╞░ß╗¥ng thß╗▒c tß║┐ (├ính s├íng phß╗⌐c tß║íp, g├│c nghi├¬ng khu├┤n mß║╖t).
                    </p>
                    
                    <h3 class="mb-4 font-bold" data-aos="fade-right" data-aos-delay="300" style="font-size: 1.2rem;">Kiß║┐n Tr├║c Hß╗ç Thß╗æng (ResNet50 Flow)</h3>
                    <div class="architecture-diagram" data-aos="zoom-in" data-aos-delay="400">
                      <div class="arch-box">Input Layer <br/><small>(224x224 RGB)</small></div>
                      <div class="arch-arrow">Γ₧ö</div>
                      <div class="arch-box highlight-box">ResNet50 Backbone <br/><small>(Feature Extraction)</small></div>
                      <div class="arch-arrow">Γ₧ö</div>
                      <div class="arch-box">Global Average Pooling <br/><small>(Dimensionality Reduction)</small></div>
                      <div class="arch-arrow">Γ₧ö</div>
                      <div class="arch-box end-box">Softmax Output <br/><small>(Emotion Classes)</small></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- WEBCAM TAB -->
            <section v-else-if="currentTab === 'webcam'" class="service-page">
              <div class="page-header">
                <div>
                  <h2 class="page-title">Live Vision Analysis</h2>
                  <p class="page-subtitle">Nhß║¡n diß╗çn thß╗¥i gian thß╗▒c qua luß╗ông camera cß╗ºa bß║ín.</p>
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
                        <button class="btn btn-primary mt-6">K├¡ch hoß║ít Camera</button>
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

            <!-- VIDEO TAB -->
            <section v-else-if="currentTab === 'video'" class="service-page">
              <div class="page-header">
                <div>
                  <h2 class="page-title">Video Analysis</h2>
                  <p class="page-subtitle">Tß║úi l├¬n video ─æß╗â ph├ón t├¡ch cß║úm x├║c tß╗½ng khung h├¼nh.</p>
                </div>
                <div v-if="videoUrl" class="status-pill"><span class="pulse-dot"></span> Analyzing Frames...</div>
              </div>

              <div v-if="!videoUrl" class="upload-container card glass" @click="$refs.videoInput.click()">
                <div class="drop-zone">
                    <div class="upload-icon-circle"><Film :size="32" /></div>
                    <h3>Chß╗ìn Video ─æß╗â ph├ón t├¡ch</h3>
                    <p>Hß╗ù trß╗ú MP4, WebM (Tß╗æi ─æa 50MB)</p>
                    <button class="btn btn-outline mt-8">Chß╗ìn tß╗½ m├íy t├¡nh</button>
                    <input type="file" ref="videoInput" hidden accept="video/*" @change="handleVideoUpload">
                </div>
              </div>

              <div v-else class="vision-grid">
                <div class="vision-main card glass">
                  <div class="hud-container video-hud">
                    <video 
                      ref="videoRef" 
                      :src="videoUrl" 
                      controls 
                      class="main-video"
                      @play="startVideoAnalysis"
                      @pause="stopVideoAnalysis"
                    ></video>
                    <canvas ref="videoCanvasRef" style="display: none;"></canvas>
                    <div class="scanner-bar" v-if="isAnalyzing"></div>
                  </div>
                </div>

                <div class="vision-sidebar">
                  <div class="sidebar-card card glass">
                    <h3>Real-time Detection</h3>
                    <div class="current-emotion-large" v-if="currentEmotion">
                      <div class="emotion-badge">{{ currentEmotion.emotion }}</div>
                      <div class="confidence-text">Confidence: {{ Math.round(currentEmotion.confidence * 100) }}%</div>
                    </div>
                    <div class="placeholder-text" v-else>─Éang chß╗¥ khung h├¼nh...</div>
                  </div>
                  <button class="btn btn-outline w-full" @click="videoUrl = ''; stopVideoAnalysis()">Tß║úi video kh├íc</button>
                </div>
              </div>
            </section>

            <!-- UPLOAD TAB -->
            <section v-else-if="currentTab === 'upload'" class="service-page">
              <div class="page-header">
                <div>
                  <h2 class="page-title">Image Analysis</h2>
                  <p class="page-subtitle">Tß║úi ß║únh l├¬n ─æß╗â ph├ón t├¡ch biß╗âu cß║úm khu├┤n mß║╖t chi tiß║┐t.</p>
                </div>
              </div>

              <div class="upload-container card glass">
                <div class="drop-zone">
                    <div class="upload-icon-circle"><Upload :size="32" /></div>
                    <h3>K├⌐o thß║ú ß║únh v├áo ─æ├óy</h3>
                    <p>Hß╗ù trß╗ú ─æß╗ïnh dß║íng JPG, PNG, WEBP (Tß╗æi ─æa 5MB)</p>
                    <button class="btn btn-outline mt-8">Chß╗ìn tß╗½ m├íy t├¡nh</button>
                </div>
              </div>
            </section>

            <!-- STATS TAB -->
            <section v-else-if="currentTab === 'stats'" class="service-page">
              <div class="page-header">
                <div>
                  <h2 class="page-title">Analytics Dashboard</h2>
                  <p class="page-subtitle">Tß╗òng quan hiß╗çu n─âng v├á dß╗» liß╗çu nhß║¡n diß╗çn cß╗ºa hß╗ç thß╗æng.</p>
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
                    <p>Dß╗» liß╗çu ─æang ─æ╞░ß╗úc tß╗òng hß╗úp...</p>
                </div>
              </div>
            </section>

          </div>
        </transition>
      </div>
    </main>

    <footer class="footer">
      <div class="container">
        <p>┬⌐ 2026 EmotionAI Project. Built for high-performance AI monitoring.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Layout Spacing Improvements */
.main-container {
  padding-top: 1rem;
  padding-bottom: 3rem;
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
  padding: 2rem 0;
  text-align: center;
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.word-group {
  display: inline-block;
  white-space: nowrap;
  margin-right: 0.2em;
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
  background: var(--surface-color);
  border: 1px solid var(--primary);
  color: var(--text-primary);
  transition: all 0.3s ease;
}
.btn-outline:hover {
  background: rgba(var(--primary-rgb), 0.1);
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

.video-hud {
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-video {
  width: 100%;
  max-height: 500px;
  border-radius: 8px;
}

.current-emotion-large {
  text-align: center;
  padding: 2rem 0;
}

.emotion-badge {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--primary);
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 20px rgba(var(--primary-rgb), 0.3);
}

.confidence-text {
  color: var(--text-secondary);
  font-weight: 600;
}

.placeholder-text {
  color: var(--text-secondary);
  font-style: italic;
  padding: 2rem 0;
  text-align: center;
}

.w-full { width: 100%; }

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
.mt-12 { margin-top: 4rem; }

.hero-section {
  position: relative;
}

.hero-content {
  position: relative;
  z-index: 1;
  pointer-events: auto;
}

.academic-section {
  position: relative;
  z-index: 2;
}

.architecture-diagram {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  background: rgba(var(--primary-rgb), 0.05);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px dashed rgba(var(--primary-rgb), 0.3);
}

.arch-box {
  background: var(--surface-color);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
  flex: 1;
  min-width: 150px;
}

[data-theme='dark'] .arch-box {
  border-color: rgba(255, 255, 255, 0.1);
}

.highlight-box {
  background: var(--primary);
  color: white;
  border: none;
}

.end-box {
  border-color: var(--primary);
  color: var(--primary);
}

.arch-arrow {
  color: var(--primary);
  font-weight: bold;
}

@media (max-width: 768px) {
  .architecture-diagram {
    flex-direction: column;
  }
  .arch-arrow {
    transform: rotate(90deg);
  }
}
</style>
