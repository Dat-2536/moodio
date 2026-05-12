import { ref, onUnmounted } from 'vue'
import { normalizeDetectionResult } from '@/utils/faceBox'
import { API_BASE_URL } from '@/constants/api'
import { saveLocalLog } from '@/utils/localStats'

/**
 * Loads an image from an object URL and resolves with { width, height }.
 * Rejects on error. This avoids a race between onload and the fetch response.
 */
function loadImageDimensions(objectUrl) {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload  = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = reject
    img.src = objectUrl
  })
}

export function useImageAnalysis() {
  const analysisResults      = ref([])
  const uploadedImage        = ref(null)   // object URL
  const isAnalyzing          = ref(false)
  const hasPerformedAnalysis = ref(false)
  const imageSize            = ref({ width: 0, height: 0 })
  const errorMessage         = ref(null)

  const processImageFile = async (file) => {
    if (!file) return

    // Revoke the previous object URL to free memory
    if (uploadedImage.value) {
      URL.revokeObjectURL(uploadedImage.value)
    }

    const objectUrl = URL.createObjectURL(file)
    uploadedImage.value        = objectUrl
    isAnalyzing.value          = true
    analysisResults.value      = []
    hasPerformedAnalysis.value = false
    errorMessage.value         = null
    imageSize.value            = { width: 0, height: 0 }

    const startTime = performance.now()
    const requestId = crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`

    // Load image dimensions and run inference in parallel — both use the same blob/URL.
    const formData = new FormData()
    formData.append('file', file)

    try {
      // Run both in parallel; we need dimensions before rendering boxes
      const [dimensions, res] = await Promise.all([
        loadImageDimensions(objectUrl),
        fetch(`${API_BASE_URL}/analyze-image`, {
          method: 'POST',
          body: formData,
          headers: { 'X-Request-ID': requestId },
        }),
      ])

      // Store natural dimensions (needed for bounding box scaling)
      imageSize.value = dimensions

      if (!res.ok) {
        const text = await res.text()
        console.error('[Moodio] image analyze failed', {
          requestId,
          status: res.status,
          statusText: res.statusText,
          body: text.slice(0, 300),
        })
        errorMessage.value = `API error ${res.status}: ${res.statusText}`
        return
      }

      const data = await res.json()
      const result = normalizeDetectionResult(data)

      // If backend returned image_size, prefer it (it measured the actual decoded image)
      if (result.image_size?.width && result.image_size?.height) {
        imageSize.value = { width: result.image_size.width, height: result.image_size.height }
      }

      analysisResults.value      = result.faces
      hasPerformedAnalysis.value = true

      // Log to local stats
      if (result.faces.length > 0) {
        saveLocalLog({
          source: 'image',
          detectedFaces: result.faces.length,
          topEmotion: result.faces[0].emotion,
          confidence: result.faces[0].confidence,
          latencyMs: performance.now() - startTime,
        })
      }
    } catch (err) {
      console.error(`[Moodio] Image analysis error [${requestId}]:`, err)
      if (err instanceof TypeError && err.message.includes('fetch')) {
        errorMessage.value = 'Network error – cannot reach backend.'
      } else {
        errorMessage.value = 'Unexpected error during analysis.'
      }
    } finally {
      isAnalyzing.value = false
    }
  }

  const resetImage = () => {
    if (uploadedImage.value) {
      URL.revokeObjectURL(uploadedImage.value)
    }
    uploadedImage.value        = null
    analysisResults.value      = []
    hasPerformedAnalysis.value = false
    imageSize.value            = { width: 0, height: 0 }
    errorMessage.value         = null
  }

  onUnmounted(() => {
    if (uploadedImage.value) {
      URL.revokeObjectURL(uploadedImage.value)
    }
  })

  return {
    analysisResults,
    uploadedImage,
    isAnalyzing,
    hasPerformedAnalysis,
    imageSize,
    errorMessage,
    processImageFile,
    resetImage,
  }
}
