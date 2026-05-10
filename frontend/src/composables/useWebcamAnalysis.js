import { ref, onUnmounted } from 'vue'

export function useWebcamAnalysis() {
  const webcamStream = ref(null)
  const isWebcamActive = ref(false)
  const currentEmotion = ref(null)
  const webcamInterval = ref(null)

  const startWebcam = async (videoRef, canvasRef) => {
    try {
      webcamStream.value = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.value) {
        videoRef.value.srcObject = webcamStream.value
      }
      isWebcamActive.value = true
      
      webcamInterval.value = setInterval(async () => {
        if (!videoRef.value || !canvasRef.value) return
        
        const canvas = canvasRef.value
        const video = videoRef.value
        
        if (video.videoWidth === 0) return

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        canvas.toBlob(async (blob) => {
          if (!blob) return
          const formData = new FormData()
          formData.append('file', blob, 'webcam.jpg')
          try {
            const res = await fetch('http://localhost:8000/stream-frame', { 
              method: 'POST', 
              body: formData 
            })
            const data = await res.json()
            currentEmotion.value = data
          } catch (err) { 
            console.error('Webcam frame analysis error:', err) 
          }
        }, 'image/jpeg', 0.6)
      }, 1000)
    } catch (err) {
      console.error("Webcam access denied:", err)
      alert("Vui lòng cho phép truy cập camera để sử dụng tính năng này.")
    }
  }

  const stopWebcam = () => {
    isWebcamActive.value = false
    if (webcamStream.value) {
      webcamStream.value.getTracks().forEach(track => track.stop())
      webcamStream.value = null
    }
    if (webcamInterval.value) {
      clearInterval(webcamInterval.value)
      webcamInterval.value = null
    }
    currentEmotion.value = null
  }

  onUnmounted(() => {
    stopWebcam()
  })

  return {
    isWebcamActive,
    currentEmotion,
    startWebcam,
    stopWebcam
  }
}
