<script setup>
import PageHeader from '@/components/common/PageHeader.vue'
import AppCard from '@/components/common/AppCard.vue'
</script>

<template>
  <section class="service-page">
    <PageHeader 
      title="Hướng dẫn sử dụng" 
      subtitle="Tìm hiểu cách thức hoạt động và sử dụng hệ thống EmotionAI."
    />
    
    <div class="guide-grid">
      <AppCard class="p-8">
        <h3>1. Webcam thời gian thực</h3>
        <p>Mở tab Webcam, nhấn "Kích hoạt" và AI sẽ tự động khoanh vùng khuôn mặt bạn để nhận diện cảm xúc mỗi giây.</p>
      </AppCard>
      <AppCard class="p-8">
        <h3>2. Phân tích ảnh tĩnh</h3>
        <p>Bạn có thể kéo thả tệp, chọn từ máy hoặc đơn giản là nhấn **Ctrl+V** để dán ảnh đã copy vào tab Image.</p>
      </AppCard>
      <AppCard class="p-8">
        <h3>3. Phân tích Video</h3>
        <p>Tải lên video của bạn, hệ thống sẽ phân tích từng khung hình trong lúc video đang phát.</p>
      </AppCard>
    </div>
  </section>
</template>

<style scoped>
.service-page {
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.guide-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.guide-grid h3 {
  color: var(--primary);
  margin-bottom: 1rem;
}

.guide-grid p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.p-8 { padding: 2rem; }
</style>
