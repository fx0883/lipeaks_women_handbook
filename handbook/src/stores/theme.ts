import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Theme } from '@/types/theme'
import { applyTheme, resetToDefaultTheme } from '@/utils/theme'

export const useThemeStore = defineStore('theme', () => {
  // 状态
  const themes = ref<Theme[]>([])
  const currentThemeId = ref<string>('pink-dream')

  // 计算属性
  const current = computed(() => {
    return themes.value.find(theme => theme.id === currentThemeId.value) || null
  })

  // 动作
  const loadThemes = (themeList: Theme[]): void => {
    themes.value = themeList
    
    // 如果当前主题不存在，设置为第一个主题
    if (!themes.value.find(theme => theme.id === currentThemeId.value)) {
      if (themes.value.length > 0) {
        currentThemeId.value = themes.value[0].id
      }
    }
    
    // 应用当前主题
    const currentTheme = current.value
    if (currentTheme) {
      applyTheme(currentTheme)
    } else {
      resetToDefaultTheme()
    }
  }

  const switchTheme = (themeOrId: Theme | string): void => {
    let theme: Theme | undefined
    
    if (typeof themeOrId === 'string') {
      theme = themes.value.find(t => t.id === themeOrId)
      currentThemeId.value = themeOrId
    } else {
      theme = themeOrId
      currentThemeId.value = theme.id
    }
    
    if (theme) {
      applyTheme(theme)
      // 保存到本地存储
      localStorage.setItem('handbook-theme', theme.id)
    }
  }

  const restoreFromLocal = (): void => {
    const savedThemeId = localStorage.getItem('handbook-theme')
    if (savedThemeId && themes.value.find(theme => theme.id === savedThemeId)) {
      currentThemeId.value = savedThemeId
      const theme = current.value
      if (theme) {
        applyTheme(theme)
      }
    }
  }

  return {
    themes,
    current,
    loadThemes,
    switchTheme,
    restoreFromLocal
  }
})
