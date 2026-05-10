import { ref, onUnmounted } from 'vue'
import { normalizeFaceResults } from '@/utils/faceUtils'

export function useImageAnalysis() {
  const analysisResults = ref([])
  const uploadedImage = ref(null)
  const isAnalyzing = ref(false)
  const imageSize = ref({ width: 0, height: 0 })

  const processImageFile = async (file) => {
    if (!file) return
    
    // Revoke old URL if exists
    if (uploadedImage.value) {
      URL.revokeObjectURL(uploadedImage.value)
    }
    
    uploadedImage.value = URL.createObjectURL(file)
    isAnalyzing.value = true
    analysisResults.value = []

    // Get natural dimensions
    const img = new Image()
    img.onload = () => {
      imageSize.value = { width: img.naturalWidth, height: img.naturalHeight }
    }
    img.src = uploadedImage.value

    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const res = await fetch('http://localhost:8000/analyze-image', { 
        method: 'POST', 
        body: formData 
      })
      const data = await res.json()
      analysisResults.value = normalizeFaceResults(data)
    } catch (err) { 
      console.error('Image analysis error:', err) 
    } finally {
      isAnalyzing.value = false
    }
  }

  const resetImage = () => {
    if (uploadedImage.value) {
      URL.revokeObjectURL(uploadedImage.value)
    }
    uploadedImage.value = null
    analysisResults.value = []
    imageSize.value = { width: 0, height: 0 }
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
    imageSize,
    processImageFile,
    resetImage
  }
}
