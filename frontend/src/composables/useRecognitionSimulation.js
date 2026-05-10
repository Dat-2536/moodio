import { ref, computed, onUnmounted } from 'vue'
import { 
  EMOTION_CLASSES, 
  EMOTION_DISPLAY_NAMES, 
  EMOTION_COLORS 
} from '@/constants/emotions'

export function useRecognitionSimulation() {
  const steps = [
    {
      id: 'input',
      title: 'Input Frame',
      short_title: 'Input',
      duration_ms: 1200,
      status: 'Reading input frame...',
      beginner_explanation: {
        what_happens: "Hệ thống nhận ảnh đầu vào từ file ảnh hoặc webcam frame.",
        why_it_matters: "Chất lượng ảnh, ánh sáng và góc khuôn mặt ảnh hưởng trực tiếp đến kết quả nhận diện.",
        data_change: "Ảnh đầu vào vẫn là dữ liệu thô, chưa được AI xử lý sâu.",
        technical_note: "Ảnh RGB gồm nhiều pixel, mỗi pixel có ba kênh màu Red, Green và Blue."
      },
      technical_explanation: {
        what_happens: "Input image hoặc webcam frame được nạp vào pipeline xử lý.",
        why_it_matters: "Đây là nguồn dữ liệu ban đầu cho toàn bộ quá trình inference.",
        data_change: "Image file / frame buffer → RGB image matrix.",
        technical_note: "Dữ liệu ảnh có thể được biểu diễn dưới dạng ma trận H × W × C."
      }
    },
    {
      id: 'face-detection',
      title: 'Face Detection',
      short_title: 'Detect',
      duration_ms: 1800,
      status: 'Scanning face region...',
      beginner_explanation: {
        what_happens: "AI tìm vùng khuôn mặt trong ảnh và đánh dấu bằng một khung nhận diện.",
        why_it_matters: "Cảm xúc chủ yếu thể hiện trên khuôn mặt, nên hệ thống cần tập trung vào vùng này thay vì toàn bộ ảnh.",
        data_change: "Ảnh đầy đủ được rút gọn thành vùng quan trọng chứa khuôn mặt.",
        technical_note: "Khung nhận diện thường gồm tọa độ x, y, chiều rộng và chiều cao."
      },
      technical_explanation: {
        what_happens: "Face detector xác định bounding box của khuôn mặt trong ảnh.",
        why_it_matters: "Việc localize khuôn mặt giúp giảm nhiễu từ nền và các vật thể không liên quan.",
        data_change: "Full image → face bounding box.",
        technical_note: "Bounding box có dạng { x, y, width, height } hoặc { top, left, width, height }."
      }
    },
    {
      id: 'preprocessing',
      title: 'Preprocessing',
      short_title: 'Preprocess',
      duration_ms: 2000,
      status: 'Cropping and converting image to tensor...',
      beginner_explanation: {
        what_happens: "Khuôn mặt được cắt ra, resize về kích thước cố định và chuẩn hóa trước khi đưa vào mô hình.",
        why_it_matters: "Mô hình cần ảnh đầu vào có kích thước ổn định để xử lý chính xác.",
        data_change: "Ảnh khuôn mặt được biến thành dạng dữ liệu số.",
        technical_note: "Deep Learning không xử lý ảnh như con người nhìn thấy, mà xử lý các tensor số."
      },
      technical_explanation: {
        what_happens: "Face crop được resize, chuyển sang Grayscale và chuẩn hóa thành tensor đầu vào.",
        why_it_matters: "Mô hình yêu cầu input shape và phân phối dữ liệu ổn định giống lúc huấn luyện.",
        data_change: "Face crop → 224 × 224 Grayscale tensor (3-ch).",
        technical_note: "Pixel values được chuẩn hóa bằng ImageNet mean/std sau khi chuyển sang grayscale."
      }
    },
    {
      id: 'deep-learning',
      title: 'Deep Learning Model',
      short_title: 'Model',
      duration_ms: 3000,
      status: 'Extracting facial emotion features...',
      beginner_explanation: {
        what_happens: "Mô hình học các đặc trưng trên khuôn mặt như mắt, miệng, lông mày và đường nét biểu cảm.",
        why_it_matters: "Những đặc trưng này giúp AI phân biệt các cảm xúc khác nhau.",
        data_change: "Ảnh đã xử lý được chuyển thành các đặc trưng có ý nghĩa cho việc dự đoán.",
        technical_note: "Các layer đầu học đặc trưng đơn giản, các layer sâu hơn học đặc trưng phức tạp hơn."
      },
      technical_explanation: {
        what_happens: "Tensor đi qua các lớp CNN/ResNet để trích xuất feature vectors.",
        why_it_matters: "Feature extractor học biểu diễn phân biệt giữa các trạng thái cảm xúc.",
        data_change: "Input tensor → hierarchical feature maps → feature vector.",
        technical_note: "Convolution filters phát hiện đặc trưng cục bộ; residual blocks giúp mô hình học sâu hơn."
      }
    },
    {
      id: 'prediction',
      title: 'Emotion Prediction',
      short_title: 'Predict',
      duration_ms: 1800,
      status: 'Calculating emotion probabilities...',
      beginner_explanation: {
        what_happens: "AI đưa ra xác suất cho từng cảm xúc và chọn cảm xúc có xác suất cao nhất.",
        why_it_matters: "Kết quả không chỉ là một nhãn cảm xúc, mà còn có độ tin cậy đi kèm.",
        data_change: "Đặc trưng khuôn mặt được chuyển thành bảng xác suất cảm xúc.",
        technical_note: "Cảm xúc có xác suất cao nhất được chọn làm dự đoán cuối cùng."
      },
      technical_explanation: {
        what_happens: "Classifier và Softmax chuyển feature vector thành phân phối xác suất.",
        why_it_matters: "Softmax giúp so sánh mức độ tin cậy giữa các class cảm xúc.",
        data_change: "Feature vector → logits → softmax probabilities.",
        technical_note: "Tổng xác suất của tất cả nhãn sau Softmax xấp xỉ 100%."
      }
    }
  ]

  const samples = [
    {
      id: 'happy',
      label: 'Happy',
      scores: { happy: 82, neutral: 8, surprise: 5, sad: 2, angry: 2, fear: 1, disgust: 0 }
    },
    {
      id: 'neutral',
      label: 'Neutral',
      scores: { neutral: 76, sad: 8, happy: 7, angry: 4, surprise: 3, fear: 2, disgust: 0 }
    },
    {
      id: 'angry',
      label: 'Angry',
      scores: { angry: 71, neutral: 12, sad: 7, fear: 5, surprise: 3, happy: 2, disgust: 0 }
    },
    {
      id: 'sad',
      label: 'Sad',
      scores: { sad: 74, neutral: 11, fear: 6, angry: 4, surprise: 3, happy: 2, disgust: 0 }
    },
    {
      id: 'surprise',
      label: 'Surprise',
      scores: { surprise: 78, fear: 8, happy: 6, neutral: 5, sad: 2, angry: 1, disgust: 0 }
    }
  ]

  const activeStepIndex = ref(0)
  const completedSteps = ref([])
  const isRunning = ref(false)
  const isPaused = ref(false)
  const speed = ref(1)
  const mode = ref('beginner') // 'beginner' | 'technical'
  const selectedLayer = ref(null)
  const selectedSampleId = ref('happy')
  const uploadedImage = ref(null)
  const animatedScores = ref({})
  const activeLayerIndex = ref(-1)
  
  let simulationTimeout = null
  let layerInterval = null

  const activeStep = computed(() => steps[activeStepIndex.value])
  const selectedSample = computed(() => samples.find(s => s.id === selectedSampleId.value))
  const emotionScores = computed(() => {
    if (uploadedImage.value && customScores.value) return customScores.value
    return selectedSample.value?.scores || {}
  })

  const setSpeed = (val) => { speed.value = val }
  const setMode = (val) => { mode.value = val }
  
  const selectSample = (id) => {
    selectedSampleId.value = id
    resetSimulation()
  }

  const customScores = ref(null)

  const setUploadedImage = async (fileOrUrl) => {
    if (uploadedImage.value) URL.revokeObjectURL(uploadedImage.value)
    
    if (typeof fileOrUrl === 'string') {
       uploadedImage.value = fileOrUrl
       resetSimulation()
       return
    }

    const file = fileOrUrl
    uploadedImage.value = URL.createObjectURL(file)
    resetSimulation()

    // Try to get real analysis if backend is available
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('http://localhost:8000/analyze-image', { method: 'POST', body: formData })
      const data = await res.json()
      if (data && data.faces && data.faces.length > 0) {
        const primaryEmotion = data.faces[0].emotion
        const confidence = data.faces[0].confidence // Already in 0-100 from backend
        
        const newScores = {}
        EMOTION_CLASSES.forEach(cls => { newScores[cls] = 2 })
        
        newScores[primaryEmotion] = Math.round(confidence)
        const remaining = 100 - confidence
        const others = EMOTION_CLASSES.filter(k => k !== primaryEmotion)
        others.forEach(k => { newScores[k] = Math.max(0, Math.floor(remaining / others.length)) })
        
        customScores.value = newScores
      }
    } catch (err) {
      console.warn('Backend analysis failed, using mock data', err)
      customScores.value = null
    }
  }

  const selectLayer = (layer) => {
    selectedLayer.value = layer
  }

  const resetSimulation = () => {
    clearTimers()
    activeStepIndex.value = 0
    completedSteps.value = []
    isRunning.value = false
    isPaused.value = false
    animatedScores.value = {}
    activeLayerIndex.value = -1
    selectedLayer.value = null
    customScores.value = null
  }

  const clearTimers = () => {
    if (simulationTimeout) {
      clearTimeout(simulationTimeout)
      simulationTimeout = null
    }
    if (layerInterval) {
      clearInterval(layerInterval)
      layerInterval = null
    }
  }

  const runSimulation = async () => {
    if (isRunning.value && !isPaused.value) return
    
    isRunning.value = true
    isPaused.value = false

    while (activeStepIndex.value < steps.length && isRunning.value && !isPaused.value) {
      const currentStep = steps[activeStepIndex.value]
      
      if (currentStep.id === 'deep-learning') {
        startLayerAnimation()
      } else {
        activeLayerIndex.value = -1
      }

      if (currentStep.id === 'prediction') {
        animateProbabilityBars()
      }

      await wait(currentStep.duration_ms / speed.value)
      
      if (!isPaused.value && isRunning.value) {
        completedSteps.value.push(currentStep.id)
        if (activeStepIndex.value < steps.length - 1) {
          activeStepIndex.value++
        } else {
          isRunning.value = false
          break
        }
      }
    }
  }

  const pauseSimulation = () => {
    isPaused.value = true
    clearTimers()
  }

  const resumeSimulation = () => {
    isPaused.value = false
    runSimulation()
  }

  const nextStep = () => {
    if (activeStepIndex.value < steps.length - 1) {
      completedSteps.value.push(steps[activeStepIndex.value].id)
      activeStepIndex.value++
    }
  }

  const previousStep = () => {
    if (activeStepIndex.value > 0) {
      activeStepIndex.value--
      completedSteps.value = completedSteps.value.filter(id => id !== steps[activeStepIndex.value].id)
    }
  }

  const goToStep = (index) => {
    activeStepIndex.value = index
    completedSteps.value = steps.slice(0, index).map(s => s.id)
  }

  const wait = (ms) => new Promise(resolve => {
    simulationTimeout = setTimeout(resolve, ms)
  })

  const startLayerAnimation = () => {
    activeLayerIndex.value = 0
    layerInterval = setInterval(() => {
      activeLayerIndex.value = (activeLayerIndex.value + 1) % 7
    }, 400 / speed.value)
  }

  const animateProbabilityBars = () => {
    const targets = emotionScores.value
    Object.keys(targets).forEach(key => {
      animatedScores.value[key] = 0
      const step = targets[key] / 20
      let current = 0
      const intv = setInterval(() => {
        current += step
        if (current >= targets[key]) {
          animatedScores.value[key] = targets[key]
          clearInterval(intv)
        } else {
          animatedScores.value[key] = Math.round(current)
        }
      }, 50 / speed.value)
    })
  }

  onUnmounted(() => {
    clearTimers()
    if (uploadedImage.value) URL.revokeObjectURL(uploadedImage.value)
  })

  return {
    steps,
    samples,
    activeStepIndex,
    activeStep,
    completedSteps,
    isRunning,
    isPaused,
    speed,
    mode,
    selectedLayer,
    selectedSample,
    uploadedImage,
    emotionScores,
    animatedScores,
    activeLayerIndex,
    setSpeed,
    setMode,
    selectSample,
    setUploadedImage,
    selectLayer,
    runSimulation,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
    nextStep,
    previousStep,
    goToStep
  }
}
