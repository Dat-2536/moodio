import { ref, onUnmounted } from 'vue'

export function useImageAnalysis() {
  const analysisResults = ref(null)
  const uploadedImage = ref(null)
  const isAnalyzing = ref(false)

  const processImageFile = async (file) => {
    if (!file) return
    
    // Revoke old URL if exists
    if (uploadedImage.value) {
      URL.revokeObjectURL(uploadedImage.value)
    }
    
    uploadedImage.value = URL.createObjectURL(file)
    isAnalyzing.value = true
    analysisResults.value = null

    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const res = await fetch('http://localhost:8000/analyze-image', { 
        method: 'POST', 
        body: formData 
      })
      analysisResults.value = await res.json()
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
    analysisResults.value = null
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
    processImageFile,
    resetImage
  }
}
