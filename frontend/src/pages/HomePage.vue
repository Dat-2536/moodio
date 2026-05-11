<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Cpu, Zap, ShieldCheck, Camera, Image, BarChart3, Brain, Layers, Database, ArrowRight } from 'lucide-vue-next'
import AOS from 'aos'

const router = useRouter()

const features = [
  { icon: Cpu, title: 'ResNet18 Model', desc: 'Kiến trúc Deep Learning 18 lớp, tối ưu cho nhận diện biểu cảm khuôn mặt với residual connections.' },
  { icon: Zap, title: 'Real-time Processing', desc: 'Độ trễ cực thấp (<0.1s) với pipeline tối ưu, đảm bảo trải nghiệm phân tích tức thì.' },
  { icon: ShieldCheck, title: 'Privacy First', desc: 'Xử lý hoàn toàn on-device, không lưu trữ hay truyền tải hình ảnh cá nhân ra ngoài.' }
]

const steps = [
  { num: '01', icon: Camera, title: 'Thu thập đầu vào', desc: 'Hệ thống nhận hình ảnh từ Webcam, ảnh upload hoặc video. Dữ liệu được chuẩn hóa về tensor (224×224 Grayscale).', color: '#76b900' },
  { num: '02', icon: Brain, title: 'Xử lý vùng mặt', desc: 'Hệ thống xác định và trích xuất vùng khuôn mặt (minh hoạ), loại bỏ nhiễu nền để tập trung vào đặc trưng quan trọng.', color: '#00b4d8' },
  { num: '03', icon: Layers, title: 'Trích xuất đặc trưng', desc: 'ResNet18 backbone với 18 lớp Convolution xử lý hình ảnh, học các pattern phức tạp từ cơ bản đến trừu tượng.', color: '#7209b7' },
  { num: '04', icon: BarChart3, title: 'Phân loại cảm xúc', desc: 'Lớp Softmax cuối cùng xuất ra phân phối xác suất trên 7 nhãn cảm xúc. Kết quả được hiển thị trực quan tức thì.', color: '#f72585' }
]

const emotions = [
  { label: 'Happy', emoji: '😊', color: '#f6d365', desc: 'Vui vẻ, hạnh phúc' },
  { label: 'Sad', emoji: '😢', color: '#a1c4fd', desc: 'Buồn bã, thất vọng' },
  { label: 'Angry', emoji: '😠', color: '#ff9a9e', desc: 'Tức giận, bực bội' },
  { label: 'Surprise', emoji: '😲', color: '#84fab0', desc: 'Ngạc nhiên, bất ngờ' },
  { label: 'Neutral', emoji: '😐', color: '#d4d4d4', desc: 'Bình thường, trung lập' },
  { label: 'Disgust', emoji: '🤢', color: '#b7e4c7', desc: 'Ghê tởm, phản cảm' },
  { label: 'Fear', emoji: '😨', color: '#fbc2eb', desc: 'Sợ hãi, lo lắng' }
]

const techStack = [
  { icon: Brain, name: 'ResNet18', detail: 'Deep Learning backbone với 18 lớp tích chập. Pre-trained trên ImageNet, fine-tuned cho FER.' },
  { icon: Cpu, name: 'FastAPI + Python', detail: 'Backend hiệu năng cao với async processing. Pipeline AI tối ưu cho tốc độ inference.' },
  { icon: Layers, name: 'Vue 3 + Vite', detail: 'Frontend reactive với Composition API. Vite đảm bảo build time cực nhanh.' },
  { icon: Database, name: 'FER2013 Dataset', detail: '35,887 ảnh khuôn mặt 48×48 pixel. 7 nhãn cảm xúc cơ bản theo chuẩn Ekman.' }
]

onMounted(() => {
  AOS.refresh()
})
</script>

<template>
  <div class="home-page">

    <!-- ── HERO ── -->
    <section class="hero-section">
      <div class="hero-badge" data-aos="fade-down">Introduction to Artificial Intelligence - Homework 4 - HK252</div>
      <h1 class="hero-title" data-aos="zoom-in" data-aos-delay="100">
        <span class="word-group">Nhận Diện </span>
        <span class="word-group">Cảm Xúc</span> <br/>
        <span class="logo-text">MOODIO<span class="highlight">AI</span></span>
      </h1>
      <p class="hero-desc" data-aos="fade-up" data-aos-delay="200">
        Ứng dụng AI dựa trên ResNet18, cung cấp khả năng phân tích biểu cảm
        khuôn mặt với độ chính xác vượt trội trong thời gian thực.
      </p>
      <div class="hero-actions" data-aos="fade-up" data-aos-delay="300">
        <button class="btn btn-primary btn-glow" @click="router.push('/webcam')">Trải nghiệm ngay</button>
        <button class="btn btn-outline" @click="router.push('/visualize')">Xem AI hoạt động</button>
      </div>

      <div class="hero-stats" data-aos="fade-up" data-aos-delay="400">
        <div class="stat-item">
          <div class="stat-num">18</div>
          <div class="stat-label">Model Layers</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-num">&lt;0.1s</div>
          <div class="stat-label">Inference Time</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-num">11M+</div>
          <div class="stat-label">Parameters</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-num">7</div>
          <div class="stat-label">Emotion Classes</div>
        </div>
      </div>

      <div class="features-grid">
        <div v-for="(f, idx) in features" :key="f.title" class="feature-card glass"
          data-aos="flip-up" :data-aos-delay="500 + (idx * 100)">
          <div class="feature-icon-box">
            <component :is="f.icon" :size="24" />
          </div>
          <h3>{{ f.title }}</h3>
          <p>{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ── HOW IT WORKS ── -->
    <section class="section-block">
      <div class="section-header" data-aos="fade-up">
        <div class="section-kicker">Pipeline</div>
        <h2>Cách hệ thống hoạt động</h2>
        <p>Từ pixel thô đến kết quả cảm xúc - quy trình 4 bước của AI</p>
      </div>

      <div class="steps-grid">
        <div v-for="(step, idx) in steps" :key="step.num"
          class="step-card glass"
          data-aos="fade-up" :data-aos-delay="idx * 100">
          <div class="step-num" :style="{ color: step.color }">{{ step.num }}</div>
          <div class="step-icon-box" :style="{ background: step.color + '22', color: step.color }">
            <component :is="step.icon" :size="22" />
          </div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.desc }}</p>
          <div class="step-connector" v-if="idx < steps.length - 1">
            <ArrowRight :size="20" />
          </div>
        </div>
      </div>
    </section>

    <!-- ── EMOTION CLASSES ── -->
    <section class="section-block">
      <div class="section-header" data-aos="fade-up">
        <div class="section-kicker">Nhận diện</div>
        <h2>7 Cảm Xúc Cơ Bản</h2>
        <p>Dựa trên lý thuyết cảm xúc cơ bản của Paul Ekman - phổ quát toàn cầu</p>
      </div>

      <div class="emotions-grid">
        <div v-for="(emo, idx) in emotions" :key="emo.label"
          class="emotion-card glass"
          data-aos="zoom-in" :data-aos-delay="idx * 80">
          <div class="emo-emoji" :style="{ background: emo.color + '33' }">{{ emo.emoji }}</div>
          <div class="emo-label">{{ emo.label }}</div>
          <div class="emo-desc">{{ emo.desc }}</div>
        </div>
      </div>
    </section>

    <!-- ── ARCHITECTURE ── -->
    <section class="section-block">
      <div class="arch-two-col">
        <div class="arch-text" data-aos="fade-right">
          <div class="section-kicker">Deep Learning</div>
          <h2>Kiến Trúc ResNet18</h2>
          <p>
            ResNet18 giải quyết bài toán <strong>Vanishing Gradient</strong> nhờ
            <em>Residual Connections</em> - các "đường tắt" cho phép gradient lan truyền ngược
            hiệu quả qua 18 lớp mạng.
          </p>
          <p style="margin-top: 1rem;">
            Với khoảng <strong>11 triệu tham số</strong>, mô hình được pre-train trên ImageNet
            (1.2M ảnh) rồi fine-tune trên FER2013 để đạt độ chính xác tối ưu cho bài toán
            nhận diện cảm xúc.
          </p>
          <div class="arch-tags">
            <span class="tag">Batch Normalization</span>
            <span class="tag">ReLU Activation</span>
            <span class="tag">Global Avg Pooling</span>
            <span class="tag">Softmax Classifier</span>
            <span class="tag">Transfer Learning</span>
            <span class="tag">Data Augmentation</span>
          </div>
          <button class="btn btn-primary mt-6" @click="router.push('/visualize')" style="margin-top: 2rem;">
            Xem trực quan hoá
          </button>
        </div>

        <div class="arch-diagram" data-aos="fade-left" data-aos-delay="100">
          <div class="arch-flow">
            <div class="arch-box input-box">
              <div class="abox-label">Input</div>
              <div class="abox-detail">224×224 Grayscale</div>
            </div>
            <div class="flow-arrow">▼</div>
            <div class="arch-box conv-box">
              <div class="abox-label">Conv Block</div>
              <div class="abox-detail">Basic Blocks (18 layers)</div>
            </div>
            <div class="flow-arrow">▼</div>
            <div class="arch-box res-box">
              <div class="abox-label">Residual Blocks</div>
              <div class="abox-detail">Skip Connections</div>
            </div>
            <div class="flow-arrow">▼</div>
            <div class="arch-box pool-box">
              <div class="abox-label">Global Avg Pool</div>
              <div class="abox-detail">512-dim vector</div>
            </div>
            <div class="flow-arrow">▼</div>
            <div class="arch-box out-box">
              <div class="abox-label">Softmax</div>
              <div class="abox-detail">7 Emotion Classes</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── TECH STACK ── -->
    <section class="section-block">
      <div class="section-header" data-aos="fade-up">
        <div class="section-kicker">Công nghệ</div>
        <h2>Technology Stack</h2>
        <p>Kết hợp các công nghệ hiện đại nhất để xây dựng một hệ thống AI hoàn chỉnh</p>
      </div>

      <div class="tech-grid">
        <div v-for="(tech, idx) in techStack" :key="tech.name"
          class="tech-card glass"
          data-aos="fade-up" :data-aos-delay="idx * 100">
          <div class="tech-icon">
            <component :is="tech.icon" :size="28" />
          </div>
          <div class="tech-info">
            <h4>{{ tech.name }}</h4>
            <p>{{ tech.detail }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CTA ── -->
    <section class="cta-section" data-aos="zoom-in">
      <div class="cta-card glass">
        <div class="cta-glow"></div>
        <h2>Sẵn sàng trải nghiệm?</h2>
        <p>Khám phá sức mạnh của AI trong việc hiểu cảm xúc con người. Không cần cài đặt - chạy trực tiếp trên trình duyệt.</p>
        <div class="cta-actions">
          <button class="btn btn-primary btn-glow" @click="router.push('/webcam')">
            <Camera :size="18" /> Bật Webcam
          </button>
          <button class="btn btn-outline" @click="router.push('/image')">
            <Image :size="18" /> Upload Ảnh
          </button>
          <button class="btn btn-outline" @click="router.push('/visualize')">
            <Brain :size="18" /> AI Lab
          </button>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.home-page {
  padding: 2rem 0 4rem;
}

/* ── HERO ── */
.hero-section {
  text-align: center;
  padding-bottom: 4rem;
}

.hero-badge {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  background: rgba(var(--primary-rgb), 0.1);
  color: var(--primary);
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 2rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(var(--primary-rgb), 0.2);
}

.hero-title {
  font-size: 4.5rem;
  font-weight: 900;
  letter-spacing: -2px;
  margin-bottom: 1.5rem;
  line-height: 1.05;
}

.glow-text {
  color: var(--primary);
  text-shadow: 0 0 40px rgba(var(--primary-rgb), 0.5);
}

.logo-text {
  font-weight: 800;
  font-size: 1.5em;
  letter-spacing: -1px;
}

.highlight {
  color: var(--primary);
}

.hero-desc {
  font-size: 1.2rem;
  color: var(--text-secondary);
  max-width: 620px;
  margin: 0 auto 2.5rem;
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin: 4rem auto;
  padding: 2rem 3rem;
  background: rgba(var(--surface-rgb), 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--primary-rgb), 0.1);
  border-radius: 20px;
  max-width: 720px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-num {
  font-size: 2rem;
  font-weight: 900;
  color: var(--primary);
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(var(--primary-rgb), 0.15);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 1rem;
}

.feature-card {
  padding: 2rem;
  border-radius: 20px;
  text-align: left;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  border-color: var(--primary);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.feature-icon-box {
  width: 48px;
  height: 48px;
  background: var(--primary);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
}

.feature-card h3 { font-size: 1rem; font-weight: 800; margin-bottom: 0.5rem; }
.feature-card p { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; }

/* ── SECTION BLOCK ── */
.section-block {
  margin-top: 6rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-kicker {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--primary);
  letter-spacing: 0.15em;
  margin-bottom: 0.75rem;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 0.75rem;
}

.section-header p {
  font-size: 1.05rem;
  color: var(--text-secondary);
  max-width: 560px;
  margin: 0 auto;
}

/* ── HOW IT WORKS ── */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.step-card {
  padding: 2rem;
  border-radius: 20px;
  position: relative;
  text-align: left;
  transition: all 0.3s ease;
}

.step-card:hover {
  transform: translateY(-6px);
}

.step-num {
  font-size: 2.5rem;
  font-weight: 900;
  line-height: 1;
  margin-bottom: 1rem;
  opacity: 0.25;
}

.step-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.step-card h3 { font-size: 1rem; font-weight: 800; margin-bottom: 0.5rem; }
.step-card p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; }

.step-connector {
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(var(--primary-rgb), 0.3);
  z-index: 2;
}

/* ── EMOTIONS ── */
.emotions-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem;
}

.emotion-card {
  padding: 1.5rem 1rem;
  border-radius: 16px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: default;
}

.emotion-card:hover {
  transform: translateY(-6px);
}

.emo-emoji {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.75rem;
}

.emo-label {
  font-size: 0.85rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
}

.emo-desc {
  font-size: 0.72rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* ── ARCHITECTURE ── */
.arch-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.arch-text .section-kicker { text-align: left; }
.arch-text h2 { font-size: 2.2rem; font-weight: 900; margin-bottom: 1rem; }
.arch-text p { color: var(--text-secondary); line-height: 1.8; }

.arch-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.tag {
  padding: 0.35rem 0.85rem;
  background: rgba(var(--primary-rgb), 0.08);
  border: 1px solid rgba(var(--primary-rgb), 0.15);
  border-radius: 100px;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--primary);
}

.arch-diagram {
  display: flex;
  justify-content: center;
}

.arch-flow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  width: 100%;
  max-width: 280px;
}

.arch-box {
  width: 100%;
  padding: 1rem 1.5rem;
  border-radius: 14px;
  text-align: center;
  border: 1px solid rgba(var(--primary-rgb), 0.1);
  background: rgba(var(--surface-rgb), 0.5);
  backdrop-filter: blur(5px);
}

.abox-label { font-weight: 800; font-size: 0.9rem; margin-bottom: 2px; }
.abox-detail { font-size: 0.75rem; color: var(--text-secondary); }

.res-box { background: rgba(var(--primary-rgb), 0.12); border-color: var(--primary); }
.res-box .abox-label { color: var(--primary); }
.out-box { background: var(--primary); color: white; }
.out-box .abox-label, .out-box .abox-detail { color: rgba(255,255,255,0.9); }

.flow-arrow {
  font-size: 1.2rem;
  color: rgba(var(--primary-rgb), 0.4);
  margin: 4px 0;
}

/* ── TECH GRID ── */
.tech-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.tech-card {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  padding: 1.75rem;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.tech-card:hover {
  transform: translateY(-4px);
}

.tech-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: rgba(var(--primary-rgb), 0.1);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tech-info h4 { font-size: 1rem; font-weight: 800; margin-bottom: 0.4rem; }
.tech-info p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; }

/* ── CTA ── */
.cta-section {
  margin-top: 6rem;
}

.cta-card {
  position: relative;
  overflow: hidden;
  padding: 4rem 3rem;
  border-radius: 28px;
  text-align: center;
  border: 1px solid rgba(var(--primary-rgb), 0.15);
}

.cta-glow {
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
  height: 200px;
  background: radial-gradient(circle, rgba(var(--primary-rgb), 0.25), transparent 70%);
  pointer-events: none;
}

.cta-card h2 {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
}

.cta-card p {
  font-size: 1.05rem;
  color: var(--text-secondary);
  max-width: 560px;
  margin: 0 auto 2.5rem;
  line-height: 1.7;
}

.cta-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

/* ── RESPONSIVE ── */
@media (max-width: 1200px) {
  .emotions-grid { grid-template-columns: repeat(4, 1fr); }
  .steps-grid { grid-template-columns: repeat(2, 1fr); }
  .step-connector { display: none; }
}

@media (max-width: 1024px) {
  .hero-title { font-size: 3.5rem; }
  .features-grid { grid-template-columns: repeat(2, 1fr); }
  .arch-two-col { grid-template-columns: 1fr; gap: 3rem; }
  .arch-diagram { order: -1; }
  .arch-flow { max-width: 400px; }
}

@media (max-width: 768px) {
  .hero-title { font-size: 2.6rem; }
  .hero-stats { gap: 1.5rem; padding: 1.5rem 2rem; }
  .stat-divider { display: none; }
  .features-grid { grid-template-columns: 1fr; }
  .steps-grid { grid-template-columns: 1fr; }
  .emotions-grid { grid-template-columns: repeat(3, 1fr); }
  .tech-grid { grid-template-columns: 1fr; }
  .section-header h2 { font-size: 2rem; }
  .cta-card { padding: 2.5rem 1.5rem; }
  .cta-card h2 { font-size: 2rem; }
}

@media (max-width: 480px) {
  .hero-title { font-size: 2.2rem; }
  .emotions-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
