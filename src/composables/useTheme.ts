import { ref } from 'vue'

type Theme = 'dark'

const STORAGE_KEY = 'blog-theme-preference'
const theme = ref<Theme>('dark')
let initialized = false

const isBrowser = typeof window !== 'undefined'

function applyTheme(value: Theme) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = value
}

export function initTheme() {
  if (initialized) return
  theme.value = 'dark'
  applyTheme(theme.value)
  if (isBrowser) {
    window.localStorage.setItem(STORAGE_KEY, 'dark')
  }
  initialized = true
}

export function useTheme() {
  initTheme()
  const setTheme = () => {
    theme.value = 'dark'
    applyTheme('dark')
  }
  return { theme, setTheme }
}
