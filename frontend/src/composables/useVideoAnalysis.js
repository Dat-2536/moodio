import { ref, onUnmounted } from 'vue'

export function useVideoAnalysis() {
  const videoUrl = ref('')
  const isAnalyzing = ref(false)
  const currentEmotion = ref(null)
  const analysisInterval = ref(null)

  const handleVideoUpload = (file) => {
    if (file) {
      if (videoUrl.value) URL.revokeObjectURL(videoUrl.value)
      videoUrl.value = URL.createObjectURL(file)
      currentEmotion.value = null
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
          const response = await fetch('http://localhost:8000/stream-frame', {
            method: 'POST',
            body: formData
          })
          const data = await response.json()
          currentEmotion.value = data
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
  }

  onUnmounted(() => {
    resetVideo()
  })

  return {
    videoUrl,
    isAnalyzing,
    currentEmotion,
    handleVideoUpload,
    startVideoAnalysis,
    stopVideoAnalysis,
    resetVideo
  }
}
