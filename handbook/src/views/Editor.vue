<template>
  <div class="editor-page">
    <div class="editor-container" v-if="hasTemplateId">
      <!-- 左侧画布预览 -->
      <div class="canvas-section">
        <div class="canvas-header">
          <h2>{{ resolvedTemplateName }}</h2>
          <div class="canvas-actions">
            <button class="action-btn" @click="previewMode = !previewMode">
              {{ previewMode ? '编辑' : '预览' }}
            </button>
            <button class="action-btn primary" @click="exportProject">
              导出
            </button>
          </div>
        </div>
        
        <div class="canvas-wrapper">
          <div 
            class="canvas-stage" 
            ref="canvasContainer"
            :style="{ aspectRatio: canvasAspect, width: canvasWidth }"
          >
            <img 
              v-if="templatePreviewUrl" 
              class="canvas-preview" 
              :src="templatePreviewUrl" 
              :alt="resolvedTemplateName" 
            />
            <div v-else class="canvas-empty">空白画布</div>
            <canvas ref="fabricCanvas" style="display: none;"></canvas>
          </div>
        </div>
      </div>
      
      <!-- 右侧控制面板 -->
      <div class="control-panel">
        <div class="panel-tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            class="tab-btn"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.icon }} {{ tab.name }}
          </button>
        </div>
        
        <div class="panel-content">
          <!-- 文字编辑 -->
          <div v-if="activeTab === 'text'" class="panel-section">
            <h3>文字编辑</h3>
            <div class="text-controls">
              <textarea 
                v-model="textContent"
                placeholder="输入文字内容..."
                class="text-input"
                rows="4"
              ></textarea>
              
              <div class="text-style">
                <label>字体大小</label>
                <input 
                  type="range" 
                  min="12" 
                  max="72" 
                  v-model="fontSize"
                  class="slider"
                />
                <span>{{ fontSize }}px</span>
              </div>
              
              <div class="text-style">
                <label>字体颜色</label>
                <input 
                  type="color" 
                  v-model="textColor"
                  class="color-picker"
                />
              </div>
            </div>
          </div>
          
          <!-- 贴纸 -->
          <div v-if="activeTab === 'stickers'" class="panel-section">
            <h3>贴纸</h3>
            <div class="sticker-grid">
              <div 
                v-for="sticker in stickers" 
                :key="sticker.id"
                class="sticker-item"
                @click="addSticker(sticker)"
              >
                <img :src="sticker.url" :alt="sticker.name" />
              </div>
            </div>
          </div>
          
          <!-- 滤镜 -->
          <div v-if="activeTab === 'filters'" class="panel-section">
            <h3>滤镜</h3>
            <div class="filter-grid">
              <div 
                v-for="filter in filters" 
                :key="filter.id"
                class="filter-item"
                :class="{ active: selectedFilter === filter.id }"
                @click="applyFilter(filter)"
              >
                <div class="filter-preview" :style="{ filter: filter.css }">
                  <img src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=100&q=80" alt="预览" />
                </div>
                <span>{{ filter.name }}</span>
              </div>
            </div>
          </div>
          
          <!-- 边框 -->
          <div v-if="activeTab === 'borders'" class="panel-section">
            <h3>边框</h3>
            <div class="border-options">
              <div class="border-style">
                <label>边框宽度</label>
                <input 
                  type="range" 
                  min="0" 
                  max="20" 
                  v-model="borderWidth"
                  class="slider"
                />
                <span>{{ borderWidth }}px</span>
              </div>
              
              <div class="border-style">
                <label>边框颜色</label>
                <input 
                  type="color" 
                  v-model="borderColor"
                  class="color-picker"
                />
              </div>
              
              <div class="border-style">
                <label>圆角</label>
                <input 
                  type="range" 
                  min="0" 
                  max="50" 
                  v-model="borderRadius"
                  class="slider"
                />
                <span>{{ borderRadius }}px</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 无模板 id 的占位引导 -->
    <div class="editor-empty" v-else>
      <div class="empty-card">
        <div class="empty-icon">🎨</div>
        <h2>选择一个模板开始创作</h2>
        <p>前往模板库挑选你喜欢的风格，或快速开始使用默认画布</p>
        <div class="empty-actions">
          <router-link to="/create" class="btn primary">去选择模板</router-link>
          <button class="btn" @click="quickStart">快速开始</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 模板信息
const templateId = computed(() => (route.params.id as string) || '')
const hasTemplateId = computed(() => !!templateId.value)

const templateMetaMap: Record<string, { name: string; ratio: string; preview: string }> = {
  'campus-collage': {
    name: '校园日常拼贴',
    ratio: '4:5',
    preview: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=1200&q=80'
  },
  'club-poster': {
    name: '社团招新海报',
    ratio: '9:16',
    preview: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&q=80'
  },
  'citywalk': {
    name: 'Citywalk/旅行',
    ratio: '9:16',
    preview: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=1200&q=80'
  },
  'dorm-food': {
    name: '宿舍日常/美食',
    ratio: '1:1',
    preview: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=1200&q=80'
  },
  'exam-countdown': {
    name: '学习计划表',
    ratio: '4:5',
    preview: 'https://images.unsplash.com/photo-1553729784-e91953dec042?w=1200&q=80'
  }
}

const resolvedTemplateName = computed(() => templateMetaMap[templateId.value]?.name || '编辑器')
const templateRatio = computed(() => templateMetaMap[templateId.value]?.ratio || '4:5')
const templatePreviewUrl = computed(() => templateMetaMap[templateId.value]?.preview || '')

const canvasAspect = computed(() => {
  const [w, h] = templateRatio.value.split(':').map(Number)
  if (!w || !h) return '4 / 5'
  return `${w} / ${h}`
})
const canvasWidth = 'min(70vw, 80vh)'

// 画布相关
const canvasContainer = ref<HTMLDivElement>()
const fabricCanvas = ref<HTMLCanvasElement>()
const previewMode = ref(false)

// 控制面板
const activeTab = ref('text')
const tabs = [
  { id: 'text', name: '文字', icon: '📝' },
  { id: 'stickers', name: '贴纸', icon: '🎨' },
  { id: 'filters', name: '滤镜', icon: '🌈' },
  { id: 'borders', name: '边框', icon: '🖼️' }
]

// 文字控制
const textContent = ref('输入文字...')
const fontSize = ref(24)
const textColor = ref('#333333')

// 边框控制
const borderWidth = ref(0)
const borderColor = ref('#000000')
const borderRadius = ref(0)

// 滤镜
const selectedFilter = ref('')
const filters = [
  { id: 'none', name: '无滤镜', css: 'none' },
  { id: 'vintage', name: '复古', css: 'sepia(0.5) contrast(1.2)' },
  { id: 'bright', name: '明亮', css: 'brightness(1.2) contrast(1.1)' },
  { id: 'soft', name: '柔和', css: 'blur(0.5px) brightness(1.1)' },
  { id: 'cool', name: '冷色', css: 'hue-rotate(180deg) saturate(1.2)' }
]

// 贴纸
const stickers = [
  { id: '1', name: '爱心', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&q=80' },
  { id: '2', name: '星星', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&q=80' },
  { id: '3', name: '花朵', url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=100&q=80' },
  { id: '4', name: '彩虹', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&q=80' }
]

// 初始化画布（预留 Fabric 接入）
const initCanvas = (): void => {
  console.log('初始化画布:', templateId.value || '(quick-start)')
}

// 快速开始（无 id）
const quickStart = (): void => {
  router.push('/editor/quick-start')
}

// 添加贴纸
const addSticker = (sticker: any): void => {
  console.log('添加贴纸:', sticker)
}

// 应用滤镜
const applyFilter = (filter: any): void => {
  selectedFilter.value = filter.id
  console.log('应用滤镜:', filter)
}

// 导出项目
const exportProject = (): void => {
  router.push('/export')
}

onMounted(() => {
  if (hasTemplateId.value) {
    initCanvas()
  }
})

onUnmounted(() => {
  // 清理画布资源
})
</script>

<style scoped>
.editor-page { display: flex; flex-direction: column; min-height: calc(100vh - 80px); }
.editor-container { flex: 1; display: flex; height: calc(100vh - 80px); }

.canvas-section { flex: 1; display: flex; flex-direction: column; background: var(--colorNeutralBackground2); border-right: 1px solid var(--colorNeutralStroke1); }
.canvas-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; background: var(--colorNeutralBackground1); border-bottom: 1px solid var(--colorNeutralStroke1); }
.canvas-header h2 { margin: 0; font-size: 18px; font-weight: 600; color: var(--colorNeutralForeground1); }
.canvas-actions { display: flex; gap: 12px; }
.action-btn { padding: 8px 16px; border: 1px solid var(--colorNeutralStroke1); background: var(--colorNeutralBackground1); color: var(--colorNeutralForeground1); border-radius: 8px; font-size: 14px; cursor: pointer; transition: all 0.2s ease; }
.action-btn:hover { border-color: var(--colorBrandBackground); background: var(--pink-light); }
.action-btn.primary { background: var(--colorBrandBackground); color: var(--colorBrandForeground); border-color: var(--colorBrandBackground); }
.action-btn.primary:hover { background: var(--colorBrandBackgroundHover); }

.canvas-wrapper { flex: 1; display: flex; align-items: center; justify-content: center; padding: 24px; }
.canvas-stage { background: white; border-radius: 12px; box-shadow: var(--shadow8); max-width: 100%; max-height: 100%; position: relative; overflow: hidden; }
.canvas-preview { width: 100%; height: 100%; object-fit: cover; display: block; }
.canvas-empty { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--colorNeutralForeground3); font-size: 14px; }

.control-panel { width: 320px; background: var(--colorNeutralBackground1); border-left: 1px solid var(--colorNeutralStroke1); display: flex; flex-direction: column; }
.panel-tabs { display: flex; border-bottom: 1px solid var(--colorNeutralStroke1); }
.tab-btn { flex: 1; padding: 12px 8px; border: none; background: var(--colorNeutralBackground1); color: var(--colorNeutralForeground2); font-size: 12px; cursor: pointer; transition: all 0.2s ease; border-bottom: 2px solid transparent; }
.tab-btn:hover { background: var(--pink-light); color: var(--colorNeutralForeground1); }
.tab-btn.active { color: var(--colorBrandBackground); border-bottom-color: var(--colorBrandBackground); background: var(--pink-light); }
.panel-content { flex: 1; overflow-y: auto; padding: 24px; }

.panel-section h3 { margin: 0 0 20px; font-size: 16px; font-weight: 600; color: var(--colorNeutralForeground1); }
.text-controls { display: flex; flex-direction: column; gap: 16px; }
.text-input { width: 100%; padding: 12px; border: 1px solid var(--colorNeutralStroke1); border-radius: 8px; background: var(--colorNeutralBackground1); color: var(--colorNeutralForeground1); font-size: 14px; resize: vertical; font-family: inherit; }
.text-input:focus { outline: none; border-color: var(--colorBrandBackground); }
.text-style { display: flex; flex-direction: column; gap: 8px; }
.text-style label { font-size: 14px; font-weight: 500; color: var(--colorNeutralForeground1); }
.slider { width: 100%; height: 6px; border-radius: 3px; background: var(--colorNeutralStroke1); outline: none; accent-color: var(--colorBrandBackground); }
.color-picker { width: 100%; height: 40px; border: 1px solid var(--colorNeutralStroke1); border-radius: 8px; cursor: pointer; }

.sticker-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.sticker-item { aspect-ratio: 1; border: 1px solid var(--colorNeutralStroke1); border-radius: 8px; overflow: hidden; cursor: pointer; transition: all 0.2s ease; }
.sticker-item:hover { border-color: var(--colorBrandBackground); transform: scale(1.05); }
.sticker-item img { width: 100%; height: 100%; object-fit: cover; }

.filter-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.filter-item { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 12px; border: 1px solid var(--colorNeutralStroke1); border-radius: 8px; cursor: pointer; transition: all 0.2s ease; }
.filter-item:hover { border-color: var(--colorBrandBackground); }
.filter-item.active { border-color: var(--colorBrandBackground); background: var(--pink-light); }
.filter-preview { width: 60px; height: 60px; border-radius: 8px; overflow: hidden; }
.filter-preview img { width: 100%; height: 100%; object-fit: cover; }
.filter-item span { font-size: 12px; color: var(--colorNeutralForeground1); }

.border-options { display: flex; flex-direction: column; gap: 16px; }
.border-style { display: flex; flex-direction: column; gap: 8px; }
.border-style label { font-size: 14px; font-weight: 500; color: var(--colorNeutralForeground1); }

/* 空状态 */
.editor-empty { width: 100%; padding: 48px 32px; display: flex; align-items: center; justify-content: center; }
.empty-card { width: 100%; max-width: 720px; background: var(--colorNeutralBackground1); border: 1px solid var(--colorNeutralStroke1); border-radius: 20px; box-shadow: var(--shadow8); padding: 32px; text-align: center; }
.empty-icon { font-size: 56px; margin-bottom: 12px; }
.empty-card h2 { margin: 0 0 8px; font-size: 24px; font-weight: 700; color: var(--colorNeutralForeground1); }
.empty-card p { margin: 0 0 20px; color: var(--colorNeutralForeground2); }
.empty-actions { display: flex; gap: 12px; justify-content: center; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 24px; border-radius: 12px; border: 1px solid var(--colorNeutralStroke1); background: var(--colorNeutralBackground1); text-decoration: none; color: var(--colorNeutralForeground1); font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; min-height: 44px; }
.btn.primary { background: var(--colorBrandBackground); color: var(--colorBrandForeground); border-color: var(--colorBrandBackground); }
.btn.primary:hover { background: var(--colorBrandBackgroundHover); }

/* 响应式设计 */
@media (max-width: 1024px) {
  .editor-container { flex-direction: column; height: auto; min-height: 60vh; }
  .control-panel { width: 100%; height: 320px; }
  .panel-tabs { flex-wrap: wrap; }
  .tab-btn { flex: 1; min-width: 80px; }
}
</style>
