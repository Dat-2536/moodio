<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Cpu, Zap, ShieldCheck } from 'lucide-vue-next'
import AOS from 'aos'

const router = useRouter()

const features = [
  { icon: Cpu, title: 'ResNet50 Model', desc: 'Kiến trúc Deep Learning tối ưu cho nhận diện biểu cảm.' },
  { icon: Zap, title: 'Real-time', desc: 'Độ trễ cực thấp (<0.5s) đảm bảo trải nghiệm tức thì.' },
  { icon: ShieldCheck, title: 'Privacy First', desc: 'Xử lý dữ liệu an toàn, không lưu trữ hình ảnh cá nhân.' }
]

onMounted(() => {
  AOS.refresh()
})
</script>

<template>
  <section class="hero-section">
    <div class="hero-content">
      <div class="hero-badge" data-aos="fade-down">Deep Learning Engine v1.0</div>
      <h1 class="hero-title" data-aos="zoom-in" data-aos-delay="100">
        <span class="word-group">Nhận Diện </span>
        <span class="word-group">Cảm Xúc</span> <br/> 
        <span class="glow-text">Intelligence</span>
      </h1>
      <p class="hero-desc" data-aos="fade-up" data-aos-delay="200">
        Hệ thống AI tiên tiến dựa trên ResNet50, cung cấp khả năng phân tích biểu cảm 
        khuôn mặt với độ chính xác vượt trội.
      </p>
      <div class="hero-actions">
        <button class="btn btn-primary btn-glow" @click="router.push('/webcam')">Trải nghiệm ngay</button>
        <button class="btn btn-outline" @click="router.push('/guide')">Xem hướng dẫn</button>
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
          <h2 class="text-3xl font-bold mb-6" data-aos="fade-right" style="color: var(--primary);">Nghiên Cứu Deep Learning</h2>
          <p class="mb-4" data-aos="fade-up" data-aos-delay="100" style="line-height: 1.8; font-size: 1.1rem; color: var(--text-secondary);">
            Ứng dụng này là minh chứng trực quan cho sức mạnh của mạng nơ-ron tích chập sâu (Deep Convolutional Neural Networks). 
            Được tinh chỉnh dựa trên kiến trúc <strong>ResNet50</strong> (Residual Networks), mô hình đã giải quyết thành công bài toán <em>Vanishing Gradient</em>, 
            cho phép trích xuất các đặc trưng khuôn mặt với độ sâu lên đến 50 lớp.
          </p>
          <p class="mb-6" data-aos="fade-up" data-aos-delay="200" style="line-height: 1.8; font-size: 1.1rem; color: var(--text-secondary);">
            Bằng cách áp dụng các kỹ thuật như Data Augmentation, Transfer Learning và tối ưu hóa hàm suy hao, 
            hệ thống không chỉ đạt độ chính xác cao trên tập dữ liệu kiểm thử mà còn có khả năng tổng quát hóa 
            vượt trội trong các điều kiện môi trường thực tế (ánh sáng phức tạp, góc nghiêng khuôn mặt).
          </p>
          
          <h3 class="mb-4 font-bold" data-aos="fade-right" data-aos-delay="300" style="font-size: 1.2rem;">Kiến Trúc Hệ Thống (ResNet50 Flow)</h3>
          <div class="architecture-diagram" data-aos="zoom-in" data-aos-delay="400">
            <div class="arch-box">Input Layer <br/><small>(224x224 RGB)</small></div>
            <div class="arch-arrow">➔</div>
            <div class="arch-box highlight-box">ResNet50 Backbone <br/><small>(Feature Extraction)</small></div>
            <div class="arch-arrow">➔</div>
            <div class="arch-box">Global Average Pooling <br/><small>(Dimensionality Reduction)</small></div>
            <div class="arch-arrow">➔</div>
            <div class="arch-box end-box">Softmax Output <br/><small>(Emotion Classes)</small></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  padding: 2rem 0;
  text-align: center;
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

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 5rem;
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

.academic-section {
  margin-top: 5rem;
}

.architecture-diagram {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding: 2rem;
  background: rgba(var(--primary-rgb), 0.05);
  border-radius: 15px;
  overflow-x: auto;
}

.arch-box {
  padding: 1rem;
  background: var(--surface-color);
  border: 1px solid rgba(var(--primary-rgb), 0.2);
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
  min-width: 140px;
}

.highlight-box {
  background: var(--primary);
  color: white;
  border: none;
  box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.4);
}

.arch-arrow {
  color: var(--primary);
  font-weight: bold;
}

@media (max-width: 1024px) {
  .hero-title { font-size: 3.5rem; }
  .features-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .hero-title { font-size: 2.8rem; }
  .features-grid { grid-template-columns: 1fr; }
  .architecture-diagram {
    flex-direction: column;
    gap: 1.5rem;
  }
  .arch-arrow {
    transform: rotate(90deg);
  }
}
</style>
