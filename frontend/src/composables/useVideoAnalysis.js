import { ref, onUnmounted } from 'vue'
import { normalizeDetectionResult } from '@/utils/faceBox'
import { API_BASE_URL } from '@/constants/api'

export function useVideoAnalysis() {
  const videoUrl = ref('')
  const isAnalyzing = ref(false)
  const currentEmotion = ref(null)
  const analysisInterval = ref(null)

  const hasPerformedAnalysis = ref(false)

  const handleVideoUpload = (file) => {
    if (file) {
      if (videoUrl.value) URL.revokeObjectURL(videoUrl.value)
      videoUrl.value = URL.createObjectURL(file)
      currentEmotion.value = null
      hasPerformedAnalysis.value = false
    }
  }

  const startVideoAnalysis = (videoRef, canvasRef) => {
    if (isAnalyzing.value) return
    isAnalyzing.value = true
    
    analysisInterval.value = setInterval(async () => {
      if (!videoRef.value || videoRef.value.paused || videoRef.value.ended) return
      
      const canvas = canvasRef.value
      const video = videoRef.value
      if (!canvas || !video || video.videoWidth === 0) return
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      canvas.toBlob(async (blob) => {
        if (!blob) return
        const formData = new FormData()
        formData.append('file', blob, 'frame.jpg')
        
        try {
          const response = await fetch(`${API_BASE_URL}/stream-frame`, {
            method: 'POST',
            body: formData
          })
          const data = await response.json()
          const result = normalizeDetectionResult(data)
          currentEmotion.value = result.faces
          hasPerformedAnalysis.value = true
        } catch (err) {
          console.error('Video frame analysis error:', err)
        }
      }, 'image/jpeg', 0.7)
    }, 1000)
  }

  const stopVideoAnalysis = () => {
    isAnalyzing.value = false
    if (analysisInterval.value) {
      clearInterval(analysisInterval.value)
      analysisInterval.value = null
    }
  }

  const resetVideo = () => {
    stopVideoAnalysis()
    if (videoUrl.value) URL.revokeObjectURL(videoUrl.value)
    videoUrl.value = ''
    currentEmotion.value = null
    hasPerformedAnalysis.value = false
  }

  onUnmounted(() => {
    resetVideo()
  })

  return {
    videoUrl,
    isAnalyzing,
    hasPerformedAnalysis,
    currentEmotion,
    handleVideoUpload,
    startVideoAnalysis,
    stopVideoAnalysis,
    resetVideo
  }
}
