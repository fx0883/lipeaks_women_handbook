import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface UserPreferences {
  themeId?: string
  language?: string
  autoSave?: boolean
  showTutorial?: boolean
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const preferences = ref<UserPreferences>({
    themeId: 'pink-dream',
    language: 'zh-CN',
    autoSave: true,
    showTutorial: true
  })

  // 动作
  const setTheme = (themeId: string): void => {
    preferences.value.themeId = themeId
    saveToLocal()
  }

  const setLanguage = (language: string): void => {
    preferences.value.language = language
    saveToLocal()
  }

  const setAutoSave = (autoSave: boolean): void => {
    preferences.value.autoSave = autoSave
    saveToLocal()
  }

  const setShowTutorial = (showTutorial: boolean): void => {
    preferences.value.showTutorial = showTutorial
    saveToLocal()
  }

  const updatePreferences = (updates: Partial<UserPreferences>): void => {
    preferences.value = { ...preferences.value, ...updates }
    saveToLocal()
  }

  const saveToLocal = (): void => {
    localStorage.setItem('handbook-user-preferences', JSON.stringify(preferences.value))
  }

  const restoreFromLocal = (): void => {
    const saved = localStorage.getItem('handbook-user-preferences')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        preferences.value = { ...preferences.value, ...parsed }
      } catch (error) {
        console.warn('Failed to restore user preferences from localStorage:', error)
      }
    }
  }

  const resetPreferences = (): void => {
    preferences.value = {
      themeId: 'pink-dream',
      language: 'zh-CN',
      autoSave: true,
      showTutorial: true
    }
    saveToLocal()
  }

  return {
    preferences,
    setTheme,
    setLanguage,
    setAutoSave,
    setShowTutorial,
    updatePreferences,
    restoreFromLocal,
    resetPreferences
  }
})
