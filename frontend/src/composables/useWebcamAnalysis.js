import { ref, onUnmounted } from 'vue'
import { normalizeFaceResults } from '@/utils/faceUtils'

export const WEBCAM_INFERENCE_INTERVAL_MS = 500

export function useWebcamAnalysis() {
  const webcamStream = ref(null)
  const isWebcamActive = ref(false)
  const isProcessingFrame = ref(false)
  const detectedFaces = ref([])
  const webcamInterval = ref(null)
  const videoSize = ref({ width: 0, height: 0 })

  const startWebcam = async (videoRef, canvasRef) => {
    try {
      webcamStream.value = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 1280 }, height: { ideal: 720 } } 
      })
      
      if (videoRef.value) {
        videoRef.value.srcObject = webcamStream.value
        
        // Track video size when metadata is loaded
        videoRef.value.onloadedmetadata = () => {
          videoSize.value = {
            width: videoRef.value.videoWidth,
            height: videoRef.value.videoHeight
          }
        }
      }
      
      isWebcamActive.value = true
      
      webcamInterval.value = setInterval(async () => {
        if (!videoRef.value || !canvasRef.value || isProcessingFrame.value) return
        
        const video = videoRef.value
        if (video.readyState < 2 || video.videoWidth === 0) return

        isProcessingFrame.value = true
        
        try {
          const canvas = canvasRef.value
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          const ctx = canvas.getContext('2d')
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          
          const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.7))
          if (!blob) return

          const formData = new FormData()
          formData.append('file', blob, 'webcam.jpg')
          
          const res = await fetch('http://localhost:8000/stream-frame', { 
            method: 'POST', 
            body: formData 
          })
          const data = await res.json()
          detectedFaces.value = normalizeFaceResults(data)
        } catch (err) { 
          console.error('Webcam frame analysis error:', err) 
        } finally {
          isProcessingFrame.value = false
        }
      }, WEBCAM_INFERENCE_INTERVAL_MS)
    } catch (err) {
      console.error("Webcam access denied:", err)
      alert("Vui lòng cho phép truy cập camera để sử dụng tính năng này.")
    }
  }

  const stopWebcam = () => {
    isWebcamActive.value = false
    isProcessingFrame.value = false
    if (webcamStream.value) {
      webcamStream.value.getTracks().forEach(track => track.stop())
      webcamStream.value = null
    }
    if (webcamInterval.value) {
      clearInterval(webcamInterval.value)
      webcamInterval.value = null
    }
    detectedFaces.value = []
  }

  onUnmounted(() => {
    stopWebcam()
  })

  return {
    isWebcamActive,
    isProcessingFrame,
    detectedFaces,
    videoSize,
    startWebcam,
    stopWebcam
  }
}
