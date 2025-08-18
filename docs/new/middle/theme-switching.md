# 出片手账 主题切换实现文档

## 📖 文档信息
- **版本**: v1.0
- **项目**: 出片手账 Vue 3 Web版
- **更新时间**: 2024-01-20
- **目标**: 为AI提供完整的动态主题切换技术实现指导

## 🎯 主题系统概述

### 设计理念
- **少女心温暖**: 专为12-20岁小女生设计的温暖治愈色彩
- **动态切换**: 支持实时主题切换，无需刷新页面
- **个性化**: 用户可自定义主题色彩
- **一致性**: 统一的设计令牌系统
- **性能优化**: 高效的CSS变量切换机制

### 核心功能
- 预设主题切换
- 自定义主题创建
- 主题历史记录
- 主题预览功能
- 主题持久化存储
- 响应式主题适配

## 🎨 主题数据结构

### 主题类型定义
```typescript
// types/theme.ts
export interface Theme {
  id: string
  name: string
  category: 'pink' | 'purple' | 'mint' | 'peach' | 'lavender' | 'coral' | 'custom'
  description: string
  colors: ThemeColor
  isCustom: boolean
  createdAt: string
  updatedAt?: string
}

export interface ThemeColor {
  id: string
  name: string
  primary: string
  primaryHover: string
  primaryPressed: string
  secondary: string
  accent: string
  preview: string
  background: string
  surface: string
  text: {
    primary: string
    secondary: string
    tertiary: string
  }
  border: string
  shadow: string
}

export interface ThemeSettings {
  currentThemeId: string
  themeHistory: string[]
  customThemes: Theme[]
  autoSwitch: boolean
  switchTime?: string
}
```

### 预设主题配置
```typescript
// constants/themes.ts
export const PRESET_THEMES: Theme[] = [
  {
    id: 'pink-dream',
    name: '粉色梦境',
    category: 'pink',
    description: '温柔浪漫的粉色系，充满少女心',
    colors: {
      id: 'pink-dream',
      name: '粉色梦境',
      primary: '#ff6b9d',
      primaryHover: '#ff5a8c',
      primaryPressed: '#ff4a7a',
      secondary: '#ffeef4',
      accent: '#ffb3d1',
      preview: '#ff6b9d',
      background: '#ffffff',
      surface: '#fafafa',
      text: {
        primary: '#1f2937',
        secondary: '#6b7280',
        tertiary: '#9ca3af'
      },
      border: '#e5e7eb',
      shadow: 'rgba(255, 107, 157, 0.1)'
    },
    isCustom: false,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'purple-fantasy',
    name: '紫色幻想',
    category: 'purple',
    description: '神秘优雅的紫色系，充满想象力',
    colors: {
      id: 'purple-fantasy',
      name: '紫色幻想',
      primary: '#a855f7',
      primaryHover: '#9333ea',
      primaryPressed: '#7c3aed',
      secondary: '#f8f7ff',
      accent: '#ddd6fe',
      preview: '#a855f7',
      background: '#ffffff',
      surface: '#fafafa',
      text: {
        primary: '#1f2937',
        secondary: '#6b7280',
        tertiary: '#9ca3af'
      },
      border: '#e5e7eb',
      shadow: 'rgba(168, 85, 247, 0.1)'
    },
    isCustom: false,
    createdAt: '2024-01-01T00:00:00Z'
  }
]
```

## 🏪 主题状态管理

### Pinia主题Store
```typescript
// stores/theme.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Theme, ThemeSettings } from '@/types/theme'
import { PRESET_THEMES } from '@/constants/themes'
import { LocalStorage } from '@/utils/storage'

export const useThemeStore = defineStore('theme', () => {
  // 状态
  const currentTheme = ref<Theme>(PRESET_THEMES[0])
  const themeHistory = ref<string[]>([])
  const customThemes = ref<Theme[]>([])
  const settings = ref<ThemeSettings>({
    currentThemeId: 'pink-dream',
    themeHistory: [],
    customThemes: [],
    autoSwitch: false
  })

  // 计算属性
  const allThemes = computed(() => [
    ...PRESET_THEMES,
    ...customThemes.value
  ])

  const availableThemes = computed(() => {
    return allThemes.value.filter(theme => 
      !themeHistory.value.includes(theme.id) || 
      theme.id === currentTheme.value.id
    )
  })

  const themeCategories = computed(() => {
    const categories = new Set(allThemes.value.map(theme => theme.category))
    return Array.from(categories)
  })

  // 方法
  const applyTheme = (theme: Theme) => {
    currentTheme.value = theme
    settings.value.currentThemeId = theme.id
    
    // 更新CSS变量
    updateCSSVariables(theme.colors)
    
    // 添加到历史记录
    addToHistory(theme.id)
    
    // 保存设置
    saveSettings()
    
    // 触发主题切换事件
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: theme }))
  }

  const switchTheme = (themeId: string) => {
    const theme = allThemes.value.find(t => t.id === themeId)
    if (theme) {
      applyTheme(theme)
    }
  }

  const createCustomTheme = (themeData: Partial<Theme>): Theme => {
    const customTheme: Theme = {
      id: generateId(),
      name: themeData.name || '自定义主题',
      category: 'custom',
      description: themeData.description || '用户自定义主题',
      colors: themeData.colors || PRESET_THEMES[0].colors,
      isCustom: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    customThemes.value.push(customTheme)
    settings.value.customThemes.push(customTheme)
    
    saveSettings()
    return customTheme
  }

  const updateCustomTheme = (themeId: string, updates: Partial<Theme>) => {
    const index = customThemes.value.findIndex(t => t.id === themeId)
    if (index > -1) {
      customThemes.value[index] = {
        ...customThemes.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      
      // 如果当前主题被更新，重新应用
      if (currentTheme.value.id === themeId) {
        applyTheme(customThemes.value[index])
      }
      
      saveSettings()
    }
  }

  const deleteCustomTheme = (themeId: string) => {
    const index = customThemes.value.findIndex(t => t.id === themeId)
    if (index > -1) {
      customThemes.value.splice(index, 1)
      settings.value.customThemes.splice(index, 1)
      
      // 如果删除的是当前主题，切换到默认主题
      if (currentTheme.value.id === themeId) {
        switchTheme('pink-dream')
      }
      
      saveSettings()
    }
  }

  const addToHistory = (themeId: string) => {
    const history = themeHistory.value.filter(id => id !== themeId)
    history.unshift(themeId)
    
    // 限制历史记录数量
    if (history.length > 10) {
      history.pop()
    }
    
    themeHistory.value = history
    settings.value.themeHistory = history
  }

  const clearHistory = () => {
    themeHistory.value = []
    settings.value.themeHistory = []
    saveSettings()
  }

  const loadSettings = () => {
    const savedSettings = LocalStorage.get<ThemeSettings>('theme_settings')
    if (savedSettings) {
      settings.value = { ...settings.value, ...savedSettings }
      
      // 加载自定义主题
      customThemes.value = settings.value.customThemes || []
      
      // 应用保存的主题
      const savedTheme = allThemes.value.find(t => t.id === settings.value.currentThemeId)
      if (savedTheme) {
        currentTheme.value = savedTheme
        updateCSSVariables(savedTheme.colors)
      }
    }
  }

  const saveSettings = () => {
    LocalStorage.set('theme_settings', settings.value)
  }

  const resetToDefault = () => {
    currentTheme.value = PRESET_THEMES[0]
    settings.value.currentThemeId = 'pink-dream'
    updateCSSVariables(PRESET_THEMES[0].colors)
    saveSettings()
  }

  return {
    // 状态
    currentTheme,
    themeHistory,
    customThemes,
    settings,
    
    // 计算属性
    allThemes,
    availableThemes,
    themeCategories,
    
    // 方法
    applyTheme,
    switchTheme,
    createCustomTheme,
    updateCustomTheme,
    deleteCustomTheme,
    addToHistory,
    clearHistory,
    loadSettings,
    saveSettings,
    resetToDefault
  }
})

// CSS变量更新函数
function updateCSSVariables(colors: ThemeColor) {
  const root = document.documentElement
  
  // 主色调
  root.style.setProperty('--color-primary', colors.primary)
  root.style.setProperty('--color-primary-hover', colors.primaryHover)
  root.style.setProperty('--color-primary-pressed', colors.primaryPressed)
  root.style.setProperty('--color-secondary', colors.secondary)
  root.style.setProperty('--color-accent', colors.accent)
  
  // 背景色
  root.style.setProperty('--color-background', colors.background)
  root.style.setProperty('--color-surface', colors.surface)
  
  // 文字色
  root.style.setProperty('--color-text-primary', colors.text.primary)
  root.style.setProperty('--color-text-secondary', colors.text.secondary)
  root.style.setProperty('--color-text-tertiary', colors.text.tertiary)
  
  // 边框和阴影
  root.style.setProperty('--color-border', colors.border)
  root.style.setProperty('--color-shadow', colors.shadow)
  
  // 更新阴影变量
  updateShadowVariables(colors.shadow)
}

function updateShadowVariables(shadowColor: string) {
  const root = document.documentElement
  
  root.style.setProperty('--shadow-xs', `0 1px 2px 0 ${shadowColor}`)
  root.style.setProperty('--shadow-sm', `0 1px 3px 0 ${shadowColor}, 0 1px 2px 0 ${shadowColor}`)
  root.style.setProperty('--shadow-md', `0 4px 6px -1px ${shadowColor}, 0 2px 4px -1px ${shadowColor}`)
  root.style.setProperty('--shadow-lg', `0 10px 15px -3px ${shadowColor}, 0 4px 6px -2px ${shadowColor}`)
  root.style.setProperty('--shadow-xl', `0 20px 25px -5px ${shadowColor}, 0 10px 10px -5px ${shadowColor}`)
  root.style.setProperty('--shadow-2xl', `0 25px 50px -12px ${shadowColor}`)
}
```

## 🎨 主题选择器组件

### 主题选择器
```vue
<!-- components/ThemeSelector.vue -->
<template>
  <div class="theme-selector">
    <div class="theme-header">
      <h3 class="theme-title">选择主题</h3>
      <button @click="showCustomThemeModal = true" class="custom-theme-btn">
        <BaseIcon name="plus" />
        自定义主题
      </button>
    </div>

    <div class="theme-categories">
      <button
        v-for="category in themeCategories"
        :key="category"
        @click="selectedCategory = category"
        :class="['category-btn', { active: selectedCategory === category }]"
      >
        {{ getCategoryName(category) }}
      </button>
    </div>

    <div class="theme-grid">
      <div
        v-for="theme in filteredThemes"
        :key="theme.id"
        @click="selectTheme(theme)"
        :class="['theme-card', { active: currentTheme.id === theme.id }]"
      >
        <div class="theme-preview" :style="getThemePreviewStyle(theme)">
          <div class="preview-header"></div>
          <div class="preview-content">
            <div class="preview-button"></div>
            <div class="preview-text"></div>
          </div>
        </div>
        <div class="theme-info">
          <h4 class="theme-name">{{ theme.name }}</h4>
          <p class="theme-description">{{ theme.description }}</p>
        </div>
        <div v-if="theme.isCustom" class="theme-actions">
          <button @click.stop="editTheme(theme)" class="edit-btn">
            <BaseIcon name="edit" />
          </button>
          <button @click.stop="deleteTheme(theme)" class="delete-btn">
            <BaseIcon name="delete" />
          </button>
        </div>
      </div>
    </div>

    <!-- 自定义主题模态框 -->
    <CustomThemeModal
      v-model:visible="showCustomThemeModal"
      :theme="editingTheme"
      @save="handleSaveCustomTheme"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import type { Theme } from '@/types/theme'

const themeStore = useThemeStore()
const selectedCategory = ref<string>('all')
const showCustomThemeModal = ref(false)
const editingTheme = ref<Theme | null>(null)

const currentTheme = computed(() => themeStore.currentTheme)
const themeCategories = computed(() => themeStore.themeCategories)
const allThemes = computed(() => themeStore.allThemes)

const filteredThemes = computed(() => {
  if (selectedCategory.value === 'all') {
    return allThemes.value
  }
  return allThemes.value.filter(theme => theme.category === selectedCategory.value)
})

const getCategoryName = (category: string): string => {
  const categoryNames: Record<string, string> = {
    pink: '粉色系',
    purple: '紫色系',
    mint: '薄荷系',
    peach: '桃子系',
    lavender: '薰衣草系',
    coral: '珊瑚系',
    custom: '自定义'
  }
  return categoryNames[category] || category
}

const getThemePreviewStyle = (theme: Theme) => {
  return {
    backgroundColor: theme.colors.background,
    border: `1px solid ${theme.colors.border}`
  }
}

const selectTheme = (theme: Theme) => {
  themeStore.switchTheme(theme.id)
}

const editTheme = (theme: Theme) => {
  editingTheme.value = theme
  showCustomThemeModal.value = true
}

const deleteTheme = async (theme: Theme) => {
  const confirmed = await ElMessageBox.confirm(
    `确定要删除主题"${theme.name}"吗？`,
    '删除确认',
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
  
  if (confirmed) {
    themeStore.deleteCustomTheme(theme.id)
    ElMessage.success('主题删除成功')
  }
}

const handleSaveCustomTheme = (themeData: Partial<Theme>) => {
  if (editingTheme.value) {
    themeStore.updateCustomTheme(editingTheme.value.id, themeData)
    ElMessage.success('主题更新成功')
  } else {
    themeStore.createCustomTheme(themeData)
    ElMessage.success('主题创建成功')
  }
  
  showCustomThemeModal.value = false
  editingTheme.value = null
}
</script>

<style scoped>
.theme-selector {
  padding: var(--spacing-lg);
}

.theme-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.theme-title {
  font-size: var(--font-size-h4);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.custom-theme-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--padding-sm) var(--padding-md);
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-body);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.custom-theme-btn:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
}

.theme-categories {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  overflow-x: auto;
  padding-bottom: var(--spacing-sm);
}

.category-btn {
  padding: var(--padding-sm) var(--padding-md);
  background-color: var(--color-surface);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-body-small);
  cursor: pointer;
  transition: all var(--transition-normal);
  white-space: nowrap;
}

.category-btn.active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.theme-card {
  position: relative;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.theme-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.theme-card.active {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-light);
}

.theme-preview {
  height: 120px;
  padding: var(--spacing-sm);
}

.preview-header {
  height: 20px;
  background-color: var(--color-primary);
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-sm);
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.preview-button {
  height: 24px;
  background-color: var(--color-primary);
  border-radius: var(--radius-sm);
  width: 60%;
}

.preview-text {
  height: 16px;
  background-color: var(--color-text-tertiary);
  border-radius: var(--radius-sm);
  width: 80%;
}

.theme-info {
  padding: var(--spacing-md);
}

.theme-name {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.theme-description {
  font-size: var(--font-size-body-small);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
}

.theme-actions {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  display: flex;
  gap: var(--spacing-xs);
}

.edit-btn,
.delete-btn {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.edit-btn {
  background-color: var(--color-primary);
  color: white;
}

.delete-btn {
  background-color: var(--color-error);
  color: white;
}

.edit-btn:hover,
.delete-btn:hover {
  transform: scale(1.1);
}
</style>
```

## 🎨 自定义主题编辑器

### 自定义主题模态框
```vue
<!-- components/CustomThemeModal.vue -->
<template>
  <el-dialog
    v-model="visible"
    :title="isEditing ? '编辑主题' : '创建自定义主题'"
    width="600px"
    :before-close="handleClose"
  >
    <div class="custom-theme-form">
      <div class="form-section">
        <h4>基本信息</h4>
        <el-form :model="formData" label-width="80px">
          <el-form-item label="主题名称">
            <el-input v-model="formData.name" placeholder="请输入主题名称" />
          </el-form-item>
          <el-form-item label="主题描述">
            <el-input
              v-model="formData.description"
              type="textarea"
              placeholder="请输入主题描述"
              :rows="3"
            />
          </el-form-item>
        </el-form>
      </div>

      <div class="form-section">
        <h4>颜色配置</h4>
        <div class="color-grid">
          <div class="color-item">
            <label>主色调</label>
            <el-color-picker v-model="formData.colors.primary" />
            <el-input v-model="formData.colors.primary" size="small" />
          </div>
          <div class="color-item">
            <label>悬停色</label>
            <el-color-picker v-model="formData.colors.primaryHover" />
            <el-input v-model="formData.colors.primaryHover" size="small" />
          </div>
          <div class="color-item">
            <label>按下色</label>
            <el-color-picker v-model="formData.colors.primaryPressed" />
            <el-input v-model="formData.colors.primaryPressed" size="small" />
          </div>
          <div class="color-item">
            <label>辅助色</label>
            <el-color-picker v-model="formData.colors.secondary" />
            <el-input v-model="formData.colors.secondary" size="small" />
          </div>
          <div class="color-item">
            <label>强调色</label>
            <el-color-picker v-model="formData.colors.accent" />
            <el-input v-model="formData.colors.accent" size="small" />
          </div>
          <div class="color-item">
            <label>背景色</label>
            <el-color-picker v-model="formData.colors.background" />
            <el-input v-model="formData.colors.background" size="small" />
          </div>
        </div>
      </div>

      <div class="form-section">
        <h4>主题预览</h4>
        <div class="theme-preview" :style="previewStyle">
          <div class="preview-header">
            <div class="preview-nav"></div>
          </div>
          <div class="preview-content">
            <div class="preview-sidebar"></div>
            <div class="preview-main">
              <div class="preview-button">按钮示例</div>
              <div class="preview-card">
                <div class="preview-card-header"></div>
                <div class="preview-card-body">
                  <div class="preview-text"></div>
                  <div class="preview-text short"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Theme, ThemeColor } from '@/types/theme'
import { PRESET_THEMES } from '@/constants/themes'

interface Props {
  visible: boolean
  theme?: Theme | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'save', themeData: Partial<Theme>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isEditing = computed(() => !!props.theme)

const formData = ref({
  name: '',
  description: '',
  colors: {
    primary: '#ff6b9d',
    primaryHover: '#ff5a8c',
    primaryPressed: '#ff4a7a',
    secondary: '#ffeef4',
    accent: '#ffb3d1',
    background: '#ffffff',
    surface: '#fafafa',
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
      tertiary: '#9ca3af'
    },
    border: '#e5e7eb',
    shadow: 'rgba(255, 107, 157, 0.1)'
  } as ThemeColor
})

const previewStyle = computed(() => ({
  '--preview-primary': formData.value.colors.primary,
  '--preview-secondary': formData.value.colors.secondary,
  '--preview-background': formData.value.colors.background,
  '--preview-text': formData.value.colors.text.primary,
  '--preview-border': formData.value.colors.border
}))

// 监听主题变化，初始化表单
watch(() => props.theme, (theme) => {
  if (theme) {
    formData.value = {
      name: theme.name,
      description: theme.description,
      colors: { ...theme.colors }
    }
  } else {
    // 重置为默认值
    formData.value = {
      name: '',
      description: '',
      colors: { ...PRESET_THEMES[0].colors }
    }
  }
}, { immediate: true })

const handleClose = () => {
  emit('update:visible', false)
}

const handleSave = () => {
  if (!formData.value.name.trim()) {
    ElMessage.error('请输入主题名称')
    return
  }

  const themeData: Partial<Theme> = {
    name: formData.value.name.trim(),
    description: formData.value.description.trim(),
    colors: formData.value.colors
  }

  emit('save', themeData)
  handleClose()
}
</script>

<style scoped>
.custom-theme-form {
  max-height: 70vh;
  overflow-y: auto;
}

.form-section {
  margin-bottom: var(--spacing-xl);
}

.form-section h4 {
  font-size: var(--font-size-h5);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.color-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.color-item label {
  font-size: var(--font-size-body-small);
  color: var(--color-text-secondary);
}

.theme-preview {
  border: 1px solid var(--preview-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  height: 200px;
}

.preview-header {
  height: 40px;
  background-color: var(--preview-primary);
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-md);
}

.preview-nav {
  width: 60px;
  height: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-sm);
}

.preview-content {
  display: flex;
  height: calc(100% - 40px);
}

.preview-sidebar {
  width: 80px;
  background-color: var(--preview-secondary);
  padding: var(--spacing-sm);
}

.preview-main {
  flex: 1;
  padding: var(--spacing-md);
  background-color: var(--preview-background);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.preview-button {
  width: 80px;
  height: 32px;
  background-color: var(--preview-primary);
  color: white;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-body-small);
}

.preview-card {
  border: 1px solid var(--preview-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.preview-card-header {
  height: 20px;
  background-color: var(--preview-secondary);
}

.preview-card-body {
  padding: var(--spacing-sm);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.preview-text {
  height: 12px;
  background-color: var(--preview-text);
  border-radius: var(--radius-sm);
  opacity: 0.3;
}

.preview-text.short {
  width: 60%;
}
</style>
```

## 🔄 主题切换动画

### 主题切换动画组件
```vue
<!-- components/ThemeTransition.vue -->
<template>
  <transition
    name="theme-transition"
    mode="out-in"
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
  >
    <slot />
  </transition>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'

const beforeEnter = (el: Element) => {
  gsap.set(el, {
    opacity: 0,
    scale: 0.95,
    y: 20
  })
}

const enter = (el: Element, done: () => void) => {
  gsap.to(el, {
    duration: 0.3,
    opacity: 1,
    scale: 1,
    y: 0,
    ease: 'power2.out',
    onComplete: done
  })
}

const leave = (el: Element, done: () => void) => {
  gsap.to(el, {
    duration: 0.2,
    opacity: 0,
    scale: 0.95,
    y: -20,
    ease: 'power2.in',
    onComplete: done
  })
}
</script>

<style scoped>
.theme-transition-enter-active,
.theme-transition-leave-active {
  transition: all 0.3s ease;
}

.theme-transition-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.theme-transition-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}
</style>
```

## 🎯 主题切换Hook

### 主题切换组合式函数
```typescript
// composables/useThemeSwitch.ts
import { ref, watch, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import type { Theme } from '@/types/theme'

export function useThemeSwitch() {
  const themeStore = useThemeStore()
  const isTransitioning = ref(false)
  const transitionDuration = 300

  const switchTheme = async (themeId: string) => {
    if (isTransitioning.value) return

    isTransitioning.value = true
    
    // 添加过渡类
    document.body.classList.add('theme-transitioning')
    
    // 切换主题
    themeStore.switchTheme(themeId)
    
    // 等待过渡完成
    await new Promise(resolve => setTimeout(resolve, transitionDuration))
    
    // 移除过渡类
    document.body.classList.remove('theme-transitioning')
    isTransitioning.value = false
  }

  const createCustomTheme = (themeData: Partial<Theme>) => {
    return themeStore.createCustomTheme(themeData)
  }

  const updateCustomTheme = (themeId: string, updates: Partial<Theme>) => {
    themeStore.updateCustomTheme(themeId, updates)
  }

  const deleteCustomTheme = (themeId: string) => {
    themeStore.deleteCustomTheme(themeId)
  }

  const getThemePreview = (theme: Theme) => {
    return {
      backgroundColor: theme.colors.background,
      color: theme.colors.text.primary,
      borderColor: theme.colors.border
    }
  }

  const isCurrentTheme = (themeId: string) => {
    return themeStore.currentTheme.id === themeId
  }

  // 监听主题变化，添加过渡效果
  watch(() => themeStore.currentTheme, () => {
    if (!isTransitioning.value) {
      document.body.classList.add('theme-transitioning')
      setTimeout(() => {
        document.body.classList.remove('theme-transitioning')
      }, transitionDuration)
    }
  })

  // 初始化时加载设置
  onMounted(() => {
    themeStore.loadSettings()
  })

  return {
    currentTheme: themeStore.currentTheme,
    allThemes: themeStore.allThemes,
    customThemes: themeStore.customThemes,
    themeHistory: themeStore.themeHistory,
    isTransitioning,
    switchTheme,
    createCustomTheme,
    updateCustomTheme,
    deleteCustomTheme,
    getThemePreview,
    isCurrentTheme
  }
}
```

## 📱 响应式主题适配

### 响应式主题CSS
```css
/* styles/theme-responsive.css */
/* 移动端主题适配 */
@media (max-width: 768px) {
  .theme-selector {
    padding: var(--spacing-md);
  }

  .theme-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--spacing-sm);
  }

  .theme-preview {
    height: 100px;
  }
}

/* 平板端主题适配 */
@media (min-width: 769px) and (max-width: 1024px) {
  .theme-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}

/* 桌面端主题适配 */
@media (min-width: 1025px) {
  .theme-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

/* 主题切换过渡效果 */
.theme-transitioning * {
  transition: 
    background-color 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

/* 主题切换时的特殊效果 */
.theme-transitioning .theme-card {
  transition: 
    transform 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}

/* 主题预览动画 */
.theme-preview {
  transition: all 0.3s ease;
}

.theme-card:hover .theme-preview {
  transform: scale(1.05);
}

/* 主题选择器动画 */
.theme-selector {
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## 📝 总结

本主题切换实现文档为"出片手账"项目提供了完整的动态主题切换解决方案，包括：

1. **完整的数据结构**: 定义清晰的主题类型和配置
2. **状态管理**: 基于Pinia的主题状态管理
3. **组件系统**: 主题选择器组件
4. **动画效果**: 流畅的主题切换动画
5. **响应式设计**: 适配不同设备的主题显示
6. **用户体验**: 直观的主题预览和切换效果

通过这些技术实现，可以为用户提供个性化、美观的主题切换体验。
