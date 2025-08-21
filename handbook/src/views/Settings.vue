<template>
  <div class="settings-page">
    <div class="settings-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1>设置</h1>
        <p>个性化你的手账体验</p>
      </div>

      <!-- 两栏布局 -->
      <div class="settings-layout">
        <!-- 左侧边栏 -->
        <aside class="settings-sidebar">
          <!-- 账户信息 -->
          <div class="account-section">
            <div class="account-avatar">
              <img :src="userAvatar" alt="用户头像" />
              <div class="avatar-badge">
                <span class="badge-icon">✨</span>
              </div>
            </div>
            <div class="account-info">
              <h3>{{ userName }}</h3>
              <p class="account-level">{{ userLevel }}</p>
              <p class="account-join">加入 {{ joinDays }} 天</p>
            </div>
          </div>

          <!-- 使用统计 -->
          <div class="usage-stats">
            <h4>使用统计</h4>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-number">{{ stats.totalProjects }}</div>
                <div class="stat-label">创作作品</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ stats.totalDays }}</div>
                <div class="stat-label">使用天数</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ stats.totalMoods }}</div>
                <div class="stat-label">记录心情</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ stats.totalTemplates }}</div>
                <div class="stat-label">收藏模板</div>
              </div>
            </div>
          </div>

          <!-- 导航菜单 -->
          <nav class="settings-nav">
            <div class="nav-section">
              <h4>设置分类</h4>
              <ul class="nav-list">
                <li>
                  <a 
                    href="#privacy" 
                    :class="{ active: activeSection === 'privacy' }"
                    @click="scrollToSection('privacy')"
                  >
                    <span class="nav-icon">🔒</span>
                    隐私设置
                  </a>
                </li>
                <li>
                  <a 
                    href="#notifications" 
                    :class="{ active: activeSection === 'notifications' }"
                    @click="scrollToSection('notifications')"
                  >
                    <span class="nav-icon">🔔</span>
                    通知设置
                  </a>
                </li>
                <li>
                  <a 
                    href="#appearance" 
                    :class="{ active: activeSection === 'appearance' }"
                    @click="scrollToSection('appearance')"
                  >
                    <span class="nav-icon">🎨</span>
                    外观设置
                  </a>
                </li>
                <li>
                  <a 
                    href="#data" 
                    :class="{ active: activeSection === 'data' }"
                    @click="scrollToSection('data')"
                  >
                    <span class="nav-icon">💾</span>
                    数据管理
                  </a>
                </li>
                <li>
                  <a 
                    href="#about" 
                    :class="{ active: activeSection === 'about' }"
                    @click="scrollToSection('about')"
                  >
                    <span class="nav-icon">ℹ️</span>
                    关于应用
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        <!-- 右侧主内容区 -->
        <main class="settings-main" ref="mainContent">
          <!-- 隐私设置 -->
          <section id="privacy" class="settings-card">
            <div class="card-header">
              <h2>🔒 隐私设置</h2>
              <p>保护你的个人信息和数据安全</p>
            </div>
            <div class="card-content">
              <!-- 调试信息 -->
              <div style="background: #f0f0f0; padding: 10px; margin-bottom: 20px; border-radius: 8px;">
                <p><strong>调试信息：</strong></p>
                <p>CSS变量检查：</p>
                <p>--colorNeutralBackground1: <span style="color: var(--colorNeutralBackground1);">测试文本</span></p>
                <p>--colorNeutralStroke1: <span style="border: 2px solid var(--colorNeutralStroke1); padding: 2px;">测试边框</span></p>
                <p>--colorBrandBackground: <span style="background: var(--colorBrandBackground); color: white; padding: 2px;">测试背景</span></p>
              </div>
              
              <div class="setting-group">
                <div class="setting-item">
                  <div class="setting-info">
                    <h3>数据加密</h3>
                    <p>使用端到端加密保护你的手账内容</p>
                  </div>
                  <label class="switch">
                    <input 
                      type="checkbox" 
                      v-model="privacySettings.dataEncryption"
                      @change="updatePrivacySetting('dataEncryption', ($event.target as HTMLInputElement).checked)"
                    />
                    <span class="slider"></span>
                  </label>
                </div>
                
                <div class="setting-item">
                  <div class="setting-info">
                    <h3>匿名统计</h3>
                    <p>允许收集匿名使用数据以改善应用体验</p>
                  </div>
                  <label class="switch">
                    <input 
                      type="checkbox" 
                      v-model="privacySettings.anonymousStats"
                      @change="updatePrivacySetting('anonymousStats', ($event.target as HTMLInputElement).checked)"
                    />
                    <span class="slider"></span>
                  </label>
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <h3>自动登录</h3>
                    <p>在此设备上保持登录状态</p>
                  </div>
                  <label class="switch">
                    <input 
                      type="checkbox" 
                      v-model="privacySettings.autoLogin"
                      @change="updatePrivacySetting('autoLogin', ($event.target as HTMLInputElement).checked)"
                    />
                    <span class="slider"></span>
                  </label>
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <h3>数据共享</h3>
                    <p>选择数据共享级别</p>
                  </div>
                  <select 
                    v-model="privacySettings.dataSharing"
                    @change="updatePrivacySetting('dataSharing', ($event.target as HTMLInputElement).value)"
                    class="setting-select"
                  >
                    <option value="none">不共享</option>
                    <option value="anonymous">匿名共享</option>
                    <option value="limited">有限共享</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          <!-- 通知设置 -->
          <section id="notifications" class="settings-card">
            <div class="card-header">
              <h2>🔔 通知设置</h2>
              <p>管理你的通知偏好和提醒方式</p>
            </div>
            <div class="card-content">
              <div class="setting-group">
                <div class="setting-item">
                  <div class="setting-info">
                    <h3>推送通知</h3>
                    <p>接收应用推送通知</p>
                  </div>
                  <label class="switch">
                    <input 
                      type="checkbox" 
                      v-model="notificationSettings.pushEnabled"
                      @change="updateNotificationSetting('pushEnabled', ($event.target as HTMLInputElement).checked)"
                    />
                    <span class="slider"></span>
                  </label>
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <h3>每日提醒</h3>
                    <p>每天提醒你记录心情和创作</p>
                  </div>
                  <label class="switch">
                    <input 
                      type="checkbox" 
                      v-model="notificationSettings.dailyReminder"
                      @change="updateNotificationSetting('dailyReminder', ($event.target as HTMLInputElement).checked)"
                    />
                    <span class="slider"></span>
                  </label>
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <h3>提醒时间</h3>
                    <p>设置每日提醒的时间</p>
                  </div>
                  <input 
                    type="time" 
                    v-model="notificationSettings.reminderTime"
                    @change="updateNotificationSetting('reminderTime', ($event.target as HTMLInputElement).value)"
                    class="time-input"
                  />
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <h3>声音提醒</h3>
                    <p>通知时播放提示音</p>
                  </div>
                  <label class="switch">
                    <input 
                      type="checkbox" 
                      v-model="notificationSettings.soundEnabled"
                      @change="updateNotificationSetting('soundEnabled', ($event.target as HTMLInputElement).checked)"
                    />
                    <span class="slider"></span>
                  </label>
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <h3>振动提醒</h3>
                    <p>通知时设备振动</p>
                  </div>
                  <label class="switch">
                    <input 
                      type="checkbox" 
                      v-model="notificationSettings.vibrationEnabled"
                      @change="updateNotificationSetting('vibrationEnabled', ($event.target as HTMLInputElement).checked)"
                    />
                    <span class="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          <!-- 外观设置 -->
          <section id="appearance" class="settings-card">
            <div class="card-header">
              <h2>🎨 外观设置</h2>
              <p>个性化你的界面外观和主题</p>
            </div>
            <div class="card-content">
              <div class="setting-group">
                <div class="theme-section">
                  <h3>主题选择</h3>
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
                        <h4>{{ theme.name }}</h4>
                        <p>{{ theme.description }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <h3>字体大小</h3>
                    <p>调整界面字体大小</p>
                  </div>
                  <select 
                    v-model="appearanceSettings.fontSize"
                    @change="updateAppearanceSetting('fontSize', ($event.target as HTMLInputElement).value)"
                    class="setting-select"
                  >
                    <option value="small">小</option>
                    <option value="medium">中</option>
                    <option value="large">大</option>
                  </select>
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <h3>动画效果</h3>
                    <p>启用界面动画和过渡效果</p>
                  </div>
                  <label class="switch">
                    <input 
                      type="checkbox" 
                      v-model="appearanceSettings.animations"
                      @change="updateAppearanceSetting('animations', ($event.target as HTMLInputElement).checked)"
                    />
                    <span class="slider"></span>
                  </label>
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <h3>语言设置</h3>
                    <p>选择界面语言</p>
                  </div>
                  <select 
                    v-model="preferences.language"
                    @change="updatePreference('language', ($event.target as HTMLInputElement).value)"
                    class="setting-select"
                  >
                    <option value="zh-CN">简体中文</option>
                    <option value="zh-TW">繁體中文</option>
                    <option value="en-US">English</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          <!-- 数据管理 -->
          <section id="data" class="settings-card">
            <div class="card-header">
              <h2>💾 数据管理</h2>
              <p>管理你的数据备份、导入和导出</p>
            </div>
            <div class="card-content">
              <div class="setting-group">
                <div class="setting-item">
                  <div class="setting-info">
                    <h3>自动保存</h3>
                    <p>编辑时自动保存作品</p>
                  </div>
                  <label class="switch">
                    <input 
                      type="checkbox" 
                      v-model="preferences.autoSave"
                      @change="updatePreference('autoSave', ($event.target as HTMLInputElement).checked)"
                    />
                    <span class="slider"></span>
                  </label>
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <h3>云端同步</h3>
                    <p>将数据同步到云端</p>
                  </div>
                  <label class="switch">
                    <input 
                      type="checkbox" 
                      v-model="dataSettings.cloudSync"
                      @change="updateDataSetting('cloudSync', ($event.target as HTMLInputElement).checked)"
                    />
                    <span class="slider"></span>
                  </label>
                </div>

                <div class="data-actions">
                  <button class="action-btn primary" @click="exportData">
                    <span class="btn-icon">📤</span>
                    导出数据
                  </button>
                  <button class="action-btn" @click="importData">
                    <span class="btn-icon">📥</span>
                    导入数据
                  </button>
                  <button class="action-btn" @click="backupData">
                    <span class="btn-icon">☁️</span>
                    备份到云端
                  </button>
                  <button class="action-btn danger" @click="clearData">
                    <span class="btn-icon">🗑️</span>
                    清除数据
                  </button>
                </div>

                <div class="storage-info">
                  <h4>存储使用情况</h4>
                  <div class="storage-bar">
                    <div class="storage-used" :style="{ width: storageUsedPercent + '%' }"></div>
                  </div>
                  <p class="storage-text">
                    已使用 {{ storageUsed }}MB / {{ storageTotal }}MB
                  </p>
                </div>
              </div>
              <input 
                ref="fileInput" 
                type="file" 
                accept=".json" 
                style="display: none"
                @change="handleFileImport"
              />
            </div>
          </section>

          <!-- 关于应用 -->
          <section id="about" class="settings-card">
            <div class="card-header">
              <h2>ℹ️ 关于应用</h2>
              <p>了解应用信息和获取帮助</p>
            </div>
            <div class="card-content">
              <div class="setting-group">
                <div class="app-info">
                  <div class="app-logo">
                    <img src="/favicon.ico" alt="应用图标" />
                  </div>
                  <div class="app-details">
                    <h3>出片手账</h3>
                    <p class="version">版本 1.0.0</p>
                    <p class="description">专为12-20岁女性设计的温柔手账应用</p>
                    <p class="copyright">© 2024 出片手账团队</p>
                  </div>
                </div>

                <div class="app-links">
                  <h4>帮助与支持</h4>
                  <div class="links-grid">
                    <a href="#" class="link-item" @click="openTutorial">
                      <span class="link-icon">📖</span>
                      <div class="link-content">
                        <h5>使用教程</h5>
                        <p>学习如何使用应用功能</p>
                      </div>
                    </a>
                    <a href="#" class="link-item" @click="openFeedback">
                      <span class="link-icon">💬</span>
                      <div class="link-content">
                        <h5>意见反馈</h5>
                        <p>告诉我们你的想法和建议</p>
                      </div>
                    </a>
                    <a href="#" class="link-item" @click="openPrivacy">
                      <span class="link-icon">🔒</span>
                      <div class="link-content">
                        <h5>隐私政策</h5>
                        <p>了解我们如何保护你的隐私</p>
                      </div>
                    </a>
                    <a href="#" class="link-item" @click="openTerms">
                      <span class="link-icon">📋</span>
                      <div class="link-content">
                        <h5>用户协议</h5>
                        <p>查看使用条款和协议</p>
                      </div>
                    </a>
                  </div>
                </div>

                <div class="update-info">
                  <div class="setting-item">
                    <div class="setting-info">
                      <h3>自动更新</h3>
                      <p>自动检查并安装应用更新</p>
                    </div>
                    <label class="switch">
                      <input 
                        type="checkbox" 
                        v-model="aboutSettings.autoUpdate"
                        @change="updateAboutSetting('autoUpdate', ($event.target as HTMLInputElement).checked)"
                      />
                      <span class="slider"></span>
                    </label>
                  </div>
                  <button class="action-btn" @click="checkForUpdates">
                    <span class="btn-icon">🔄</span>
                    检查更新
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import type { Theme } from '@/types/theme'
import themesData from '@/data/themes.json'

const themeStore = useThemeStore()
const userStore = useUserStore()

// 引用
const fileInput = ref<HTMLInputElement>()
const mainContent = ref<HTMLElement>()

// 用户信息
const userName = ref('小仙女')
const userLevel = ref('创作达人')
const userAvatar = ref('https://api.dicebear.com/7.x/avataaars/svg?seed=user&backgroundColor=ffeaa7,fab1a0,fd79a8,fdcb6e,e17055,74b9ff,0984e3,a29bfe,6c5ce7&clothingColor=262e33,3c4858,5a6c7d,8b9dc3,b1e5fc,ffeaa7,ffb8b8,ff7675,fd79a8,fdcb6e')
const joinDays = ref(128)

// 活跃导航区域
const activeSection = ref('privacy')

// 使用统计
const stats = ref({
  totalProjects: 42,
  totalDays: 128,
  totalMoods: 256,
  totalTemplates: 18
})

// 存储信息
const storageUsed = ref(15.6)
const storageTotal = ref(100)
const storageUsedPercent = computed(() => (storageUsed.value / storageTotal.value) * 100)

// 计算属性
const themes = computed(() => themeStore.themes)
const currentTheme = computed(() => themeStore.current)
const preferences = computed(() => userStore.preferences)

// 设置状态
const privacySettings = ref({
  dataEncryption: true,
  anonymousStats: false,
  autoLogin: true,
  dataSharing: 'none'
})

const notificationSettings = ref({
  pushEnabled: true,
  dailyReminder: true,
  reminderTime: '20:00',
  soundEnabled: true,
  vibrationEnabled: false
})

const appearanceSettings = ref({
  fontSize: 'medium',
  animations: true
})

const dataSettings = ref({
  cloudSync: false
})

const aboutSettings = ref({
  autoUpdate: true
})

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

// 导航相关方法
const scrollToSection = (sectionId: string): void => {
  activeSection.value = sectionId
  const element = document.getElementById(sectionId)
  if (element && mainContent.value) {
    const offsetTop = element.offsetTop - mainContent.value.offsetTop - 20
    mainContent.value.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    })
  }
}

// 监听滚动更新活跃区域
const handleScroll = (): void => {
  if (!mainContent.value) return
  
  const sections = ['privacy', 'notifications', 'appearance', 'data', 'about']
  const scrollTop = mainContent.value.scrollTop + 100
  
  for (const sectionId of sections) {
    const element = document.getElementById(sectionId)
    if (element) {
      const offsetTop = element.offsetTop - mainContent.value.offsetTop
      const offsetBottom = offsetTop + element.offsetHeight
      
      if (scrollTop >= offsetTop && scrollTop < offsetBottom) {
        activeSection.value = sectionId
        break
      }
    }
  }
}

// 设置更新方法
const updatePrivacySetting = (
  key: keyof typeof privacySettings.value,
  value: (typeof privacySettings.value)[typeof key]
): void => {
  ;(privacySettings.value as any)[key] = value as any
  // 这里可以添加保存到本地存储或发送到服务器的逻辑
}

const updateNotificationSetting = (
  key: keyof typeof notificationSettings.value,
  value: (typeof notificationSettings.value)[typeof key]
): void => {
  ;(notificationSettings.value as any)[key] = value as any
}

const updateAppearanceSetting = (
  key: keyof typeof appearanceSettings.value,
  value: (typeof appearanceSettings.value)[typeof key]
): void => {
  ;(appearanceSettings.value as any)[key] = value as any
  
  // 应用字体大小设置
  if (key === 'fontSize') {
    document.documentElement.style.setProperty('--font-scale', 
      value === 'small' ? '0.9' : value === 'large' ? '1.1' : '1.0')
  }
  
  // 应用动画设置
  if (key === 'animations') {
    document.documentElement.style.setProperty('--animation-duration', 
      value ? '0.2s' : '0s')
  }
}

const updateDataSetting = (key: string, value: any): void => {
  dataSettings.value[key as keyof typeof dataSettings.value] = value
}

const updateAboutSetting = (key: string, value: any): void => {
  aboutSettings.value[key as keyof typeof aboutSettings.value] = value
}

// 切换主题
const switchTheme = (theme: Theme): void => {
  themeStore.switchTheme(theme)
  userStore.setTheme(theme.id)
}

// 更新偏好设置
const updatePreference = (key: string, value: any): void => {
  userStore.updatePreferences({ [key]: value })
}

// 数据管理方法
const exportData = (): void => {
  const data = {
    preferences: preferences.value,
    privacySettings: privacySettings.value,
    notificationSettings: notificationSettings.value,
    appearanceSettings: appearanceSettings.value,
    dataSettings: dataSettings.value,
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

const importData = (): void => {
  fileInput.value?.click()
}

const handleFileImport = (event: Event): void => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string)
      if (data.preferences) {
        userStore.updatePreferences(data.preferences)
      }
      if (data.privacySettings) {
        privacySettings.value = { ...privacySettings.value, ...data.privacySettings }
      }
      if (data.notificationSettings) {
        notificationSettings.value = { ...notificationSettings.value, ...data.notificationSettings }
      }
      if (data.appearanceSettings) {
        appearanceSettings.value = { ...appearanceSettings.value, ...data.appearanceSettings }
      }
      if (data.dataSettings) {
        dataSettings.value = { ...dataSettings.value, ...data.dataSettings }
      }
      alert('数据导入成功！')
    } catch (error) {
      alert('数据格式错误，导入失败！')
    }
  }
  reader.readAsText(file)
}

const backupData = (): void => {
  // 模拟云端备份
  alert('数据已备份到云端！')
}

const clearData = (): void => {
  if (confirm('确定要清除所有数据吗？此操作不可恢复。')) {
    userStore.resetPreferences()
    privacySettings.value = {
      dataEncryption: true,
      anonymousStats: false,
      autoLogin: true,
      dataSharing: 'none'
    }
    notificationSettings.value = {
      pushEnabled: true,
      dailyReminder: true,
      reminderTime: '20:00',
      soundEnabled: true,
      vibrationEnabled: false
    }
    appearanceSettings.value = {
      fontSize: 'medium',
      animations: true
    }
    dataSettings.value = {
      cloudSync: false
    }
    localStorage.clear()
    alert('数据已清除！')
  }
}

// 关于页面方法
const openTutorial = (): void => {
  // 这里可以路由到教程页面或打开教程模态框
  alert('即将打开使用教程')
}

const openFeedback = (): void => {
  // 这里可以路由到反馈页面或打开反馈表单
  alert('即将打开意见反馈')
}

const openPrivacy = (): void => {
  // 这里可以路由到隐私政策页面
  alert('即将打开隐私政策')
}

const openTerms = (): void => {
  // 这里可以路由到用户协议页面
  alert('即将打开用户协议')
}

const checkForUpdates = (): void => {
  // 模拟检查更新
  alert('当前已是最新版本！')
}

onMounted(() => {
  // 加载主题数据
  themeStore.loadThemes(themesData.themes)
  
  // 恢复用户偏好
  userStore.restoreFromLocal()
  themeStore.restoreFromLocal()
  
  // 添加滚动监听
  nextTick(() => {
    if (mainContent.value) {
      mainContent.value.addEventListener('scroll', handleScroll)
    }
  })
})
</script>

<style scoped>
/* 基础布局 */
.settings-page {
  width: 100%;
  min-height: 100vh;
  background: var(--colorNeutralBackground2);
  padding-top: 104px;
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: 24px;
  box-sizing: border-box;
}

.settings-container {
  width: 100%;
  box-sizing: border-box;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-header h1 {
  margin: 0 0 8px;
  font-size: 32px;
  font-weight: 700;
  color: var(--colorNeutralForeground1);
}

.page-header p {
  margin: 0;
  color: var(--colorNeutralForeground2);
  font-size: 16px;
}

/* 两栏布局 */
.settings-layout {
  display: flex;
  gap: 32px;
  align-items: start;
}

/* 左侧边栏 */
.settings-sidebar {
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 账户信息 */
.account-section {
  background: var(--colorNeutralBackground1);
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 20px;
  padding: 24px;
  text-align: center;
  box-shadow: var(--shadow4);
}

.account-avatar {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
}

.account-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid var(--colorBrandBackground);
}

.avatar-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 28px;
  height: 28px;
  background: var(--colorBrandBackground);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--colorNeutralBackground1);
}

.badge-icon {
  font-size: 14px;
}

.account-info h3 {
  margin: 0 0 4px;
  font-size: 20px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.account-level {
  margin: 0 0 8px;
  font-size: 14px;
  color: var(--colorBrandBackground);
  font-weight: 500;
}

.account-join {
  margin: 0;
  font-size: 12px;
  color: var(--colorNeutralForeground2);
}

/* 使用统计 */
.usage-stats {
  background: var(--colorNeutralBackground1);
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 20px;
  padding: 20px;
  box-shadow: var(--shadow4);
}

.usage-stats h4 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 12px;
  background: var(--pink-light);
  border-radius: 12px;
  border: 1px solid var(--colorNeutralStroke1);
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: var(--colorBrandBackground);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--colorNeutralForeground2);
}

/* 导航菜单 */
.settings-nav {
  background: var(--colorNeutralBackground1);
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 20px;
  padding: 20px;
  box-shadow: var(--shadow4);
}

.nav-section h4 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-list li {
  margin-bottom: 8px;
}

.nav-list a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  text-decoration: none;
  color: var(--colorNeutralForeground2);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-list a:hover {
  background: var(--pink-light);
  color: var(--colorNeutralForeground1);
}

.nav-list a.active {
  background: var(--colorBrandBackground);
  color: white;
}

.nav-icon {
  font-size: 16px;
}

/* 右侧主内容区 */
.settings-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 仅当需要内部滚动时再开启滚动条样式（当前PC不启用） */

/* 设置卡片 */
.settings-card {
  background: var(--colorNeutralBackground1);
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 20px;
  box-shadow: var(--shadow4);
  overflow: hidden;
}

.card-header {
  padding: 24px 24px 0;
  border-bottom: 1px solid var(--colorNeutralStroke1);
  margin-bottom: 24px;
}

.card-header h2 {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.card-header p {
  margin: 0 0 24px;
  color: var(--colorNeutralForeground2);
  font-size: 14px;
}

.card-content {
  padding: 0 24px 24px;
}

/* 设置组 */
.setting-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid var(--colorNeutralStroke1);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info h3 {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 500;
  color: var(--colorNeutralForeground1);
}

.setting-info p {
  margin: 0;
  font-size: 14px;
  color: var(--colorNeutralForeground2);
}

/* 开关控件 */
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

/* 选择框和输入框 */
.setting-select,
.time-input {
  padding: 8px 12px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 8px;
  background: var(--colorNeutralBackground1);
  color: var(--colorNeutralForeground1);
  font-size: 14px;
  cursor: pointer;
  min-width: 120px;
}

.setting-select:focus,
.time-input:focus {
  outline: none;
  border-color: var(--colorBrandBackground);
}

/* 主题选择 */
.theme-section {
  padding: 20px 0;
}

.theme-section h3 {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.theme-card {
  border: 2px solid var(--colorNeutralStroke1);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--colorNeutralBackground1);
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
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 1px solid var(--colorNeutralStroke1);
}

.theme-info h4 {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.theme-info p {
  margin: 0;
  font-size: 12px;
  color: var(--colorNeutralForeground2);
}

/* 数据操作按钮 */
.data-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin: 20px 0;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: 1px solid var(--colorNeutralStroke1);
  background: var(--colorNeutralBackground1);
  color: var(--colorNeutralForeground1);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.action-btn:hover {
  border-color: var(--colorBrandBackground);
  background: var(--pink-light);
}

.action-btn.primary {
  background: var(--colorBrandBackground);
  color: white;
  border-color: var(--colorBrandBackground);
}

.action-btn.primary:hover {
  background: var(--colorBrandBackgroundHover);
  border-color: var(--colorBrandBackgroundHover);
}

.action-btn.danger {
  border-color: #dc2626;
  color: #dc2626;
}

.action-btn.danger:hover {
  background: #fef2f2;
  border-color: #dc2626;
}

.btn-icon {
  font-size: 16px;
}

/* 存储信息 */
.storage-info {
  margin-top: 20px;
  padding: 16px;
  background: var(--pink-light);
  border-radius: 12px;
  border: 1px solid var(--colorNeutralStroke1);
}

.storage-info h4 {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.storage-bar {
  width: 100%;
  height: 8px;
  background: var(--colorNeutralStroke1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.storage-used {
  height: 100%;
  background: var(--colorBrandBackground);
  transition: width 0.3s ease;
}

.storage-text {
  margin: 0;
  font-size: 12px;
  color: var(--colorNeutralForeground2);
}

/* 关于页面 */
.app-info {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid var(--colorNeutralStroke1);
  margin-bottom: 20px;
}

.app-logo img {
  width: 64px;
  height: 64px;
  border-radius: 12px;
}

.app-details h3 {
  margin: 0 0 4px;
  font-size: 20px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.version {
  margin: 0 0 8px;
  font-size: 14px;
  color: var(--colorBrandBackground);
  font-weight: 500;
}

.description {
  margin: 0 0 4px;
  font-size: 14px;
  color: var(--colorNeutralForeground2);
}

.copyright {
  margin: 0;
  font-size: 12px;
  color: var(--colorNeutralForeground2);
}

.app-links h4 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.link-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--pink-light);
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 12px;
  text-decoration: none;
  color: var(--colorNeutralForeground1);
  transition: all 0.2s ease;
}

.link-item:hover {
  border-color: var(--colorBrandBackground);
  transform: translateY(-2px);
  box-shadow: var(--shadow4);
}

.link-icon {
  font-size: 20px;
}

.link-content h5 {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.link-content p {
  margin: 0;
  font-size: 12px;
  color: var(--colorNeutralForeground2);
}

.update-info {
  padding-top: 20px;
  border-top: 1px solid var(--colorNeutralStroke1);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .settings-layout {
    gap: 24px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .theme-grid {
    grid-template-columns: 1fr;
  }
}

/* 大屏优化 */
@media (min-width: 1200px) {
  .settings-page {
    padding-left: 32px;
    padding-right: 32px;
  }
  
  .settings-layout {
    gap: 40px;
  }
  
  .settings-sidebar {
    width: 300px;
  }
}

@media (min-width: 1440px) {
  .settings-page {
    padding-left: 40px;
    padding-right: 40px;
  }
  
  .settings-layout {
    gap: 48px;
  }
  
  .settings-sidebar {
    width: 320px;
  }
}

@media (max-width: 768px) {
  .settings-page {
    padding: 16px;
  }
  
  .settings-layout {
    flex-direction: column;
    gap: 20px;
  }
  
  .settings-sidebar {
    width: 100%;
    position: static;
    order: 2;
  }
  
  /* 移动端使用内部滚动更友好 */
  .settings-main {
    order: 1;
    max-height: none;
    overflow-y: auto;
    padding-right: 8px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .data-actions {
    grid-template-columns: 1fr;
  }
  
  .links-grid {
    grid-template-columns: 1fr;
  }
  
  .app-info {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 24px;
  }
  
  .account-avatar img {
    width: 60px;
    height: 60px;
  }
  
  .avatar-badge {
    width: 24px;
    height: 24px;
  }
  
  .badge-icon {
    font-size: 12px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
