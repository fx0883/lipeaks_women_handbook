<template>
  <div class="settings-page">
    <div class="settings-container">
      <div class="page-header">
        <h1>设置</h1>
        <p>个性化你的手账体验</p>
      </div>

      <div class="settings-content">
        <!-- 主题设置 -->
        <div class="settings-section">
          <h2>🎨 主题设置</h2>
          <div class="theme-grid">
            <div 
              v-for="theme in themes" 
              :key="theme.id"
              class="theme-card"
              :class="{ active: currentTheme?.id === theme.id }"
              @click="switchTheme(theme)"
            >
              <div class="theme-preview">
                <div 
                  class="theme-color primary" 
                  :style="{ backgroundColor: theme.colors.primary }"
                ></div>
                <div 
                  class="theme-color secondary" 
                  :style="{ backgroundColor: theme.colors.secondary }"
                ></div>
                <div 
                  class="theme-color accent" 
                  :style="{ backgroundColor: theme.colors.accent }"
                ></div>
              </div>
              <div class="theme-info">
                <h3>{{ theme.name }}</h3>
                <p>{{ theme.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 偏好设置 -->
        <div class="settings-section">
          <h2>⚙️ 偏好设置</h2>
          <div class="preference-list">
            <div class="preference-item">
              <div class="preference-info">
                <h3>自动保存</h3>
                <p>编辑时自动保存作品</p>
              </div>
              <label class="switch">
                <input 
                  type="checkbox" 
                  v-model="preferences.autoSave"
                  @change="updatePreference('autoSave', $event.target.checked)"
                />
                <span class="slider"></span>
              </label>
            </div>

            <div class="preference-item">
              <div class="preference-info">
                <h3>显示教程</h3>
                <p>首次使用时显示操作指引</p>
              </div>
              <label class="switch">
                <input 
                  type="checkbox" 
                  v-model="preferences.showTutorial"
                  @change="updatePreference('showTutorial', $event.target.checked)"
                />
                <span class="slider"></span>
              </label>
            </div>

            <div class="preference-item">
              <div class="preference-info">
                <h3>语言设置</h3>
                <p>选择界面语言</p>
              </div>
              <select 
                v-model="preferences.language"
                @change="updatePreference('language', $event.target.value)"
                class="language-select"
              >
                <option value="zh-CN">简体中文</option>
                <option value="zh-TW">繁體中文</option>
                <option value="en-US">English</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 数据管理 -->
        <div class="settings-section">
          <h2>💾 数据管理</h2>
          <div class="data-actions">
            <button class="action-btn" @click="exportData">
              📤 导出数据
            </button>
            <button class="action-btn" @click="importData">
              📥 导入数据
            </button>
            <button class="action-btn danger" @click="clearData">
              🗑️ 清除数据
            </button>
          </div>
          <input 
            ref="fileInput" 
            type="file" 
            accept=".json" 
            style="display: none"
            @change="handleFileImport"
          />
        </div>

        <!-- 关于信息 -->
        <div class="settings-section">
          <h2>ℹ️ 关于</h2>
          <div class="about-info">
            <div class="app-info">
              <h3>出片手账</h3>
              <p>版本 1.0.0</p>
              <p>专为12-20岁女性设计的温柔手账应用</p>
            </div>
            <div class="links">
              <a href="#" class="link">使用教程</a>
              <a href="#" class="link">意见反馈</a>
              <a href="#" class="link">隐私政策</a>
              <a href="#" class="link">用户协议</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import type { Theme } from '@/types/theme'

const themeStore = useThemeStore()
const userStore = useUserStore()

// 文件输入引用
const fileInput = ref<HTMLInputElement>()

// 计算属性
const themes = computed(() => themeStore.themes)
const currentTheme = computed(() => themeStore.current)
const preferences = computed(() => userStore.preferences)

// 模拟主题数据
const mockThemes: Theme[] = [
  {
    id: 'pink-dream',
    name: '粉色梦境',
    category: 'pink',
    description: '温柔浪漫的粉色系',
    colors: {
      id: 'pink-dream',
      name: '粉色梦境',
      primary: '#ff6b9d',
      primaryHover: '#ff5a8c',
      primaryPressed: '#ff4a7a',
      secondary: '#ffeef4',
      accent: '#ffb3d1',
      preview: '#ff6b9d'
    },
    isCustom: false,
    createdAt: '2024-01-01'
  },
  {
    id: 'purple-magic',
    name: '紫色魔法',
    category: 'purple',
    description: '神秘优雅的紫色系',
    colors: {
      id: 'purple-magic',
      name: '紫色魔法',
      primary: '#9c88ff',
      primaryHover: '#8b7aff',
      primaryPressed: '#7a6bff',
      secondary: '#f0edff',
      accent: '#c4b5fd',
      preview: '#9c88ff'
    },
    isCustom: false,
    createdAt: '2024-01-01'
  },
  {
    id: 'mint-fresh',
    name: '薄荷清新',
    category: 'mint',
    description: '清新自然的薄荷绿',
    colors: {
      id: 'mint-fresh',
      name: '薄荷清新',
      primary: '#10b981',
      primaryHover: '#059669',
      primaryPressed: '#047857',
      secondary: '#ecfdf5',
      accent: '#6ee7b7',
      preview: '#10b981'
    },
    isCustom: false,
    createdAt: '2024-01-01'
  },
  {
    id: 'peach-sunset',
    name: '蜜桃夕阳',
    category: 'peach',
    description: '温暖甜美的蜜桃色',
    colors: {
      id: 'peach-sunset',
      name: '蜜桃夕阳',
      primary: '#fb7185',
      primaryHover: '#f43f5e',
      primaryPressed: '#e11d48',
      secondary: '#fef2f2',
      accent: '#fda4af',
      preview: '#fb7185'
    },
    isCustom: false,
    createdAt: '2024-01-01'
  }
]

// 切换主题
const switchTheme = (theme: Theme): void => {
  themeStore.switchTheme(theme)
  userStore.setTheme(theme.id)
}

// 更新偏好设置
const updatePreference = (key: string, value: any): void => {
  userStore.updatePreferences({ [key]: value })
}

// 导出数据
const exportData = (): void => {
  const data = {
    preferences: preferences.value,
    timestamp: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `handbook-data-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 导入数据
const importData = (): void => {
  fileInput.value?.click()
}

// 处理文件导入
const handleFileImport = (event: Event): void => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string)
      if (data.preferences) {
        userStore.updatePreferences(data.preferences)
        alert('数据导入成功！')
      }
    } catch (error) {
      alert('数据格式错误，导入失败！')
    }
  }
  reader.readAsText(file)
}

// 清除数据
const clearData = (): void => {
  if (confirm('确定要清除所有数据吗？此操作不可恢复。')) {
    userStore.resetPreferences()
    localStorage.clear()
    alert('数据已清除！')
  }
}

onMounted(() => {
  // 加载主题数据
  themeStore.loadThemes(mockThemes)
  
  // 恢复用户偏好
  userStore.restoreFromLocal()
  themeStore.restoreFromLocal()
})
</script>

<style scoped>
.settings-page {
  width: 100%;
  padding: 24px 32px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  margin: 0 0 12px;
  font-size: 32px;
  font-weight: 700;
  color: var(--colorNeutralForeground1);
}

.page-header p {
  margin: 0;
  color: var(--colorNeutralForeground2);
  font-size: 16px;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.settings-section {
  background: var(--colorNeutralBackground1);
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 20px;
  padding: 24px;
  box-shadow: var(--shadow4);
}

.settings-section h2 {
  margin: 0 0 24px;
  font-size: 20px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.theme-card {
  border: 2px solid var(--colorNeutralStroke1);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-card:hover {
  border-color: var(--colorBrandBackground);
  transform: translateY(-2px);
  box-shadow: var(--shadow8);
}

.theme-card.active {
  border-color: var(--colorBrandBackground);
  background: var(--pink-light);
}

.theme-preview {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.theme-color {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 1px solid var(--colorNeutralStroke1);
}

.theme-info h3 {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.theme-info p {
  margin: 0;
  font-size: 14px;
  color: var(--colorNeutralForeground2);
}

.preference-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preference-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid var(--colorNeutralStroke1);
}

.preference-item:last-child {
  border-bottom: none;
}

.preference-info h3 {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 500;
  color: var(--colorNeutralForeground1);
}

.preference-info p {
  margin: 0;
  font-size: 14px;
  color: var(--colorNeutralForeground2);
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch .slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--colorNeutralStroke1);
  transition: 0.2s;
  border-radius: 24px;
}

.switch .slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.2s;
  border-radius: 50%;
}

.switch input:checked + .slider {
  background-color: var(--colorBrandBackground);
}

.switch input:checked + .slider:before {
  transform: translateX(26px);
}

.language-select {
  padding: 8px 12px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 8px;
  background: var(--colorNeutralBackground1);
  color: var(--colorNeutralForeground1);
  font-size: 14px;
  cursor: pointer;
}

.language-select:focus {
  outline: none;
  border-color: var(--colorBrandBackground);
}

.data-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 12px 20px;
  border: 1px solid var(--colorNeutralStroke1);
  background: var(--colorNeutralBackground1);
  color: var(--colorNeutralForeground1);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  border-color: var(--colorBrandBackground);
  background: var(--pink-light);
}

.action-btn.danger {
  border-color: #dc2626;
  color: #dc2626;
}

.action-btn.danger:hover {
  background: #fef2f2;
  border-color: #dc2626;
}

.about-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.app-info h3 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.app-info p {
  margin: 0 0 4px;
  font-size: 14px;
  color: var(--colorNeutralForeground2);
}

.links {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.link {
  color: var(--colorBrandBackground);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s ease;
}

.link:hover {
  color: var(--colorBrandBackgroundHover);
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .settings-page {
    padding: 16px;
  }
  
  .theme-grid {
    grid-template-columns: 1fr;
  }
  
  .preference-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .data-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
}
</style>
