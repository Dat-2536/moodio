import { ref, onMounted } from 'vue'

const isDark = ref(false)

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value
    document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  onMounted(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    isDark.value = savedTheme === 'dark'
    document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  })

  return {
    isDark,
    toggleTheme
  }
}
