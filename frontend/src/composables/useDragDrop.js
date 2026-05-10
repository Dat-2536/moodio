import { ref, onMounted, onUnmounted } from 'vue'

export function useDragDrop(callback) {
  const isDragging = ref(false)

  const handleDragEnter = (e) => {
    e.preventDefault()
    isDragging.value = true
  }

  const handleDragLeave = (e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return
    isDragging.value = false
  }

  const handleDrop = (e) => {
    e.preventDefault()
    isDragging.value = false
    const file = e.dataTransfer?.files?.[0]
    if (file && callback) callback(file)
  }

  onMounted(() => {
    const resetDrag = () => { isDragging.value = false }
    window.addEventListener('dragend', resetDrag)
    window.addEventListener('drop', resetDrag)
    
    onUnmounted(() => {
      window.removeEventListener('dragend', resetDrag)
      window.removeEventListener('drop', resetDrag)
    })
  })

  return {
    isDragging,
    handleDragEnter,
    handleDragLeave,
    handleDrop
  }
}
