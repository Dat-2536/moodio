<script setup>
import { Info, Target, Cpu, Lightbulb, GraduationCap, Activity } from 'lucide-vue-next'

const props = defineProps({
  activeStep: Object,
  mode: String
})

const beginnerExplanations = {
  'input': {
    what: 'Hệ thống nhận vào một hình ảnh hoặc luồng video thô từ người dùng.',
    why: 'Đây là dữ liệu đầu vào chứa khuôn mặt và các biểu cảm cần được phân tích.',
    change: 'Hình ảnh được chuyển đổi từ pixel thành một mảng số lớn (Matrix).',
    fact: 'Máy tính không "thấy" màu sắc, nó chỉ thấy các con số từ 0 đến 255.'
  },
  'face-detection': {
    what: 'AI tìm kiếm các đặc điểm giống khuôn mặt (mắt, mũi, miệng) trong ảnh.',
    why: 'Để loại bỏ nền nhiễu và chỉ tập trung vào phần quan trọng nhất: khuôn mặt.',
    change: 'Xác định tọa độ (X, Y) và kích thước của vùng khuôn mặt.',
    fact: 'Thuật toán hiện đại có thể nhận diện hàng trăm khuôn mặt trong một mili giây.'
  },
  'preprocessing': {
    what: 'Khuôn mặt được cắt ra, xoay thẳng và đưa về kích thước chuẩn (224x224).',
    why: 'Giúp mô hình nhận diện ổn định hơn, không bị ảnh hưởng bởi ánh sáng hay góc độ.',
    change: 'Ảnh được chuyển sang grayscale (3-ch) và chuẩn hóa dữ liệu.',
    fact: 'Chuẩn hóa giúp quá trình tính toán của AI nhanh và chính xác hơn gấp nhiều lần.'
  },
  'deep-learning': {
    what: 'Mô hình CNN (Mạng thần kinh nhân chập) trích xuất các đặc điểm biểu cảm.',
    why: 'Tìm ra các đường nét đặc trưng như độ cong của môi hay nếp nhăn chân mày.',
    change: 'Dữ liệu đi qua hàng chục lớp lọc để tạo ra các bản đồ đặc trưng (Feature Maps).',
    fact: 'Càng vào sâu, AI càng hiểu được các khái niệm trừu tượng hơn về cảm xúc.'
  },
  'prediction': {
    what: 'Lớp cuối cùng so sánh các đặc điểm thu được với 7 loại cảm xúc cơ bản.',
    why: 'Đưa ra kết luận cuối cùng về trạng thái cảm xúc của người dùng.',
    change: 'Một danh sách các con số xác suất (0-100%) cho mỗi loại cảm xúc.',
    fact: 'Cảm xúc con người rất phức tạp, AI thường chọn cái có xác suất cao nhất.'
  }
}

const technicalExplanations = {
  'input': {
    what: 'Dữ liệu đầu vào là Tensor 3D (Height x Width x Channels).',
    why: 'Để thực hiện các phép toán đại số tuyến tính trong các lớp tiếp theo.',
    change: 'Pixel values [0, 255] được float-converted sang vùng [0, 1].',
    fact: 'Batch processing cho phép xử lý nhiều frame cùng lúc để tăng throughput.'
  },
  'face-detection': {
    what: 'Hệ thống định vị vùng khuôn mặt trong ảnh (Đang sử dụng minh họa).',
    why: 'Region of Interest (ROI) extraction giảm computational cost cho giai đoạn sau.',
    change: 'Output là tọa độ [top, left, width, height] và confidence score.',
    fact: 'Việc tách biệt khuôn mặt giúp AI không bị nhầm lẫn bởi các vật thể ở phông nền.'
  },
  'preprocessing': {
    what: 'Thực hiện Grayscale conversion và Image Resizing (224x224).',
    why: 'Loại bỏ variance về illumination và spatial scale.',
    change: 'Dữ liệu được reshape về định dạng Tensor (1, 3, 224, 224).',
    fact: 'Mô hình ResNet18 yêu cầu input 3 kênh màu, nên ảnh xám được nhân bản lên 3 kênh.'
  },
  'deep-learning': {
    what: 'Thực hiện Convolution, Max Pooling và Batch Normalization.',
    why: 'Feature extraction thông qua các bộ lọc (Kernels) có trọng số tối ưu.',
    change: 'Từ spatial data chuyển sang high-dimensional feature vector.',
    fact: 'ReLU activation function giúp mô hình học được các hàm phi tuyến phức tạp.'
  },
  'prediction': {
    what: 'Sử dụng Softmax function ở lớp Fully Connected cuối cùng.',
    why: 'Chuyển đổi logits thành xác suất phân phối xác định (Sum = 1).',
    change: 'Vector (1, 7) đại diện cho các lớp: Angry, Disgust, Fear, Happy, Sad, Surprise, Neutral.',
    fact: 'Cross-entropy loss là hàm mục tiêu chính trong quá trình training các lớp này.'
  }
}
</script>

<template>
  <div class="explanation-card card glass p-8">
    <div class="panel-header mb-6">
      <div class="title-row">
        <div class="icon-box">
          <GraduationCap v-if="mode === 'beginner'" :size="24" />
          <Cpu v-else :size="24" />
        </div>
        <div class="title-stack">
          <h3>{{ mode === 'beginner' ? 'AI Classroom' : 'Technical Lab' }}</h3>
          <p>Step {{ activeStep?.id === 'input' ? '1' : activeStep?.id === 'face-detection' ? '2' : activeStep?.id === 'preprocessing' ? '3' : activeStep?.id === 'deep-learning' ? '4' : '5' }}: {{ activeStep?.title }}</p>
        </div>
      </div>
    </div>

    <div class="explanation-grid">
      <div class="exp-block">
        <div class="block-label">
          <Info :size="14" />
          <span>WHAT HAPPENS</span>
        </div>
        <p class="block-text">{{ (mode === 'beginner' ? beginnerExplanations : technicalExplanations)[activeStep?.id]?.what }}</p>
      </div>

      <div class="exp-block">
        <div class="block-label">
          <Target :size="14" />
          <span>WHY IT MATTERS</span>
        </div>
        <p class="block-text">{{ (mode === 'beginner' ? beginnerExplanations : technicalExplanations)[activeStep?.id]?.why }}</p>
      </div>

      <div class="exp-divider"></div>

      <div class="exp-block">
        <div class="block-label">
          <Activity :size="14" />
          <span>DATA CHANGE</span>
        </div>
        <p class="block-text">{{ (mode === 'beginner' ? beginnerExplanations : technicalExplanations)[activeStep?.id]?.change }}</p>
      </div>

      <div class="exp-block">
        <div class="block-label highlight">
          <Lightbulb :size="14" />
          <span>{{ mode === 'beginner' ? 'DID YOU KNOW?' : 'TECHNICAL NOTE' }}</span>
        </div>
        <p class="block-text italic">{{ (mode === 'beginner' ? beginnerExplanations : technicalExplanations)[activeStep?.id]?.fact }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.explanation-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-header {
  border-bottom: 1px solid rgba(var(--primary-rgb), 0.1);
  padding-bottom: 20px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(var(--primary-rgb), 0.1);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-stack h3 {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
}

.title-stack p {
  font-size: 0.85rem;
  color: var(--primary);
  font-weight: 700;
  margin: 2px 0 0 0;
}

.explanation-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 12px;
}

.exp-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.block-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 800;
  color: var(--text-secondary);
  letter-spacing: 0.05em;
  opacity: 0.8;
}

.block-label.highlight {
  color: var(--primary);
  opacity: 1;
}

.block-text {
  font-size: 0.9rem;
  line-height: 1.6;
}

@media (max-width: 600px) {
  .explanation-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
