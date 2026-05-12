import { ref, onUnmounted } from 'vue'
import { normalizeDetectionResult } from '@/utils/faceBox'
import { API_BASE_URL } from '@/constants/api'
import { saveLocalLog } from '@/utils/localStats'

export const WEBCAM_INTERVAL_MODES = {
  ECO:    3000,
  NORMAL: 2000,
  FAST:   1000,
}

export function useWebcamAnalysis() {
  // ── Reactive state ──────────────────────────────────────────────────────────
  const webcamStream          = ref(null)
  const isRunning             = ref(false)   // webcam is active
  const isProcessingFrame     = ref(false)   // a fetch is in-flight
  const hasCompletedAnalysis  = ref(false)   // at least one successful response received
  const detectedFaces         = ref([])
  const lastResult            = ref(null)
  const errorMessage          = ref(null)
  const videoSize             = ref({ width: 0, height: 0 })

  // ── Private frame-timing state (not reactive; no need to trigger re-renders) ─
  let intervalId              = null
  let currentFrameId          = 0            // monotonically incremented per sent frame
  let latestAcceptedFrameId   = -1           // highest frameId whose response we've committed
  let lastLogTime             = 0

  // ── Helpers ──────────────────────────────────────────────────────────────────

  function _clearInterval() {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  // ── Core capture + analyze ────────────────────────────────────────────────────

  async function _captureAndAnalyzeFrame(videoRef, canvasRef) {
    // Guard: skip if webcam stopped or a request is already in-flight
    if (!isRunning.value || isProcessingFrame.value) return

    const video = videoRef.value
    const canvas = canvasRef.value
    if (!video || !canvas) return
    if (video.readyState < 2 || video.videoWidth === 0) return

    // Mark in-flight
    isProcessingFrame.value = true

    // Assign a monotonically increasing frame ID
    const frameId = ++currentFrameId

    const startTime = performance.now()

    try {
      // 1. Resize for transmission speed (max dimension 640px)
      // This reduces payload size and backend processing time significantly.
      const maxDim = 640
      let w = video.videoWidth
      let h = video.videoHeight
      if (w > maxDim || h > maxDim) {
        const scale = maxDim / Math.max(w, h)
        w = Math.round(w * scale)
        h = Math.round(h * scale)
      }

      canvas.width  = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, w, h)

      // Encode to JPEG blob
      const blob = await new Promise(resolve =>
        canvas.toBlob(resolve, 'image/jpeg', 0.8)
      )
      if (!blob) return

      const formData = new FormData()
      formData.append('file', blob, 'webcam.jpg')

      const res = await fetch(`${API_BASE_URL}/analyze-image?source=webcam`, {
        method: 'POST',
        body: formData,
      })

      // ── Stale-response guard ─────────────────────────────────────────────────
      // If the webcam was stopped while we were awaiting the response, discard.
      if (!isRunning.value) return
      // If a newer frame has already been committed, discard this older response.
      if (frameId <= latestAcceptedFrameId) return

      if (!res.ok) {
        const text = await res.text()
        console.error('[Moodio] webcam analyze failed', {
          frameId,
          status: res.status,
          statusText: res.statusText,
          body: text.slice(0, 300),
        })
        errorMessage.value = `API error ${res.status}: ${res.statusText}`
        return
      }

      const data = await res.json()

      // Guard again after JSON parse (small async gap)
      if (!isRunning.value || frameId <= latestAcceptedFrameId) return

      // Commit this result
      latestAcceptedFrameId = frameId
      errorMessage.value = null

      const result = normalizeDetectionResult(data)

      // Use image_size from backend if available; fall back to canvas/video dimensions
      if (result.image_size?.width && result.image_size?.height) {
        videoSize.value = { width: result.image_size.width, height: result.image_size.height }
      } else if (video.videoWidth && video.videoHeight) {
        videoSize.value = { width: video.videoWidth, height: video.videoHeight }
      }

      detectedFaces.value       = result.faces
      lastResult.value          = result
      hasCompletedAnalysis.value = true

      // Throttled local stats logging (at most once per 5 s)
      const now = Date.now()
      if (result.faces.length > 0 && now - lastLogTime > 5000) {
        saveLocalLog({
          source: 'webcam',
          detectedFaces: result.faces.length,
          topEmotion: result.faces[0].emotion,
          confidence: result.faces[0].confidence,
          latencyMs: performance.now() - startTime,
        })
        lastLogTime = now
      }
    } catch (err) {
      if (isRunning.value) {
        console.error(`[Moodio] Webcam frame error (frameId=${frameId}):`, err)
        // Only surface network errors; don't clear existing detectedFaces
        if (err instanceof TypeError && err.message.includes('fetch')) {
          errorMessage.value = 'Network error – cannot reach backend.'
        }
      }
    } finally {
      isProcessingFrame.value = false
    }
  }

  // ── Public API ────────────────────────────────────────────────────────────────

  const startWebcam = async (videoRef, canvasRef, intervalMs = WEBCAM_INTERVAL_MODES.NORMAL) => {
    // Prevent double-start
    if (isRunning.value || intervalId !== null) {
      console.warn('[Moodio] startWebcam() called while already running – ignored.')
      return
    }

    try {
      webcamStream.value = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
      })

      if (videoRef.value) {
        videoRef.value.srcObject = webcamStream.value

        // Capture true video dimensions once metadata arrives
        videoRef.value.onloadedmetadata = () => {
          if (videoRef.value) {
            videoSize.value = {
              width:  videoRef.value.videoWidth,
              height: videoRef.value.videoHeight,
            }
          }
        }
      }

      isRunning.value = true
      errorMessage.value = null

      // Reset frame counters so a leftover latestAcceptedFrameId never blocks new frames
      currentFrameId        = 0
      latestAcceptedFrameId = -1

      // Start exactly ONE interval
      intervalId = setInterval(() => {
        _captureAndAnalyzeFrame(videoRef, canvasRef)
      }, intervalMs)

    } catch (err) {
      console.error('[Moodio] Webcam access denied:', err)
      errorMessage.value = 'Camera access denied. Please allow camera permission and try again.'
    }
  }

  const stopWebcam = () => {
    // Mark as not running FIRST so any in-flight response is discarded on return
    isRunning.value           = false
    isProcessingFrame.value   = false
    hasCompletedAnalysis.value = false

    _clearInterval()

    if (webcamStream.value) {
      webcamStream.value.getTracks().forEach(t => t.stop())
      webcamStream.value = null
    }

    detectedFaces.value = []
    lastResult.value    = null
    errorMessage.value  = null
  }

  onUnmounted(() => {
    stopWebcam()
  })

  return {
    // State
    isWebcamActive:       isRunning,       // alias kept for backwards-compat with WebcamPage.vue
    isRunning,
    isProcessingFrame,
    hasPerformedAnalysis: hasCompletedAnalysis, // alias for backwards-compat
    hasCompletedAnalysis,
    detectedFaces,
    lastResult,
    errorMessage,
    videoSize,
    // Actions
    startWebcam,
    stopWebcam,
  }
}
