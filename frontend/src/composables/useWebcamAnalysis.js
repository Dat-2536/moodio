import { ref, onUnmounted } from 'vue'
import { normalizeFaceResults } from '@/utils/faceUtils'
import { API_BASE_URL } from '@/constants/api'
import { saveLocalLog } from '@/utils/localStats'

export const WEBCAM_INTERVAL_MODES = {
  ECO: 3000,
  NORMAL: 2000,
  FAST: 1000
}

export function useWebcamAnalysis() {
  const webcamStream = ref(null)
  const isWebcamActive = ref(false)
  const isProcessingFrame = ref(false)
  const detectedFaces = ref([])
  const webcamInterval = ref(null)
  const videoSize = ref({ width: 0, height: 0 })
  let lastLogTime = 0

  const startWebcam = async (videoRef, canvasRef, intervalMs = WEBCAM_INTERVAL_MODES.NORMAL) => {
    if (webcamInterval.value) {
      console.warn('[Moodio] Webcam analysis interval already exists. Skipping start.')
      return
    }

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
        if (!isWebcamActive.value || !videoRef.value || !canvasRef.value || isProcessingFrame.value) return
        
        const video = videoRef.value
        if (video.readyState < 2 || video.videoWidth === 0) return

        isProcessingFrame.value = true
        
        const requestId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`
        const startTime = performance.now()
        
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
          
          const res = await fetch(`${API_BASE_URL}/analyze-image`, { 
            method: 'POST', 
            body: formData,
            headers: {
              'X-Request-ID': requestId
            }
          })

          if (!res.ok) {
            const text = await res.text()
            if (isWebcamActive.value) {
              console.error('[Moodio] webcam analyze failed', {
                requestId,
                url: `${API_BASE_URL}/analyze-image`,
                status: res.status,
                statusText: res.statusText,
                body: text.slice(0, 500)
              })
            }
            throw new Error(`Analyze API failed: ${res.status} ${res.statusText} requestId=${requestId}`)
          }

          const data = await res.json()
          
          const results = normalizeFaceResults(data)
          detectedFaces.value = results

          // Log to local stats (throttled to once per 5 seconds for webcam)
          const now = Date.now()
          if (results.length > 0 && now - lastLogTime > 5000) {
            saveLocalLog({
              source: 'webcam',
              detectedFaces: results.length,
              topEmotion: results[0].emotion,
              confidence: results[0].confidence,
              latencyMs: performance.now() - startTime
            })
            lastLogTime = now
          }
        } catch (err) { 
          if (isWebcamActive.value) {
            console.error(`[Moodio] Webcam frame analysis error [${requestId}]:`, err) 
          }
        } finally {
          isProcessingFrame.value = false
        }
      }, intervalMs)
    } catch (err) {
      console.error("[Moodio] Webcam access denied:", err)
      alert("Vui lòng cho phép truy cập camera để sử dụng tính năng này.")
    }
  }

  const stopWebcam = () => {
    isWebcamActive.value = false
    isProcessingFrame.value = false
    
    if (webcamInterval.value) {
      clearInterval(webcamInterval.value)
      webcamInterval.value = null
    }

    if (webcamStream.value) {
      webcamStream.value.getTracks().forEach(track => track.stop())
      webcamStream.value = null
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
