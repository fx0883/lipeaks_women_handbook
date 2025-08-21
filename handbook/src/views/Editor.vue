<template>
  <div class="editor-page">

    
    <div class="editor-container" v-if="hasTemplateId">
      <!-- 左侧：预览区域（按原型） -->
      <div class="preview-area">
        <div class="preview-header">
          <div class="header-left">
            <h2>预览</h2>
            <div class="project-name-edit">
              <input 
                v-model="projectName" 
                class="project-name-input" 
                placeholder="输入项目名称"
                @blur="onProjectNameChange"
              />
            </div>
          </div>
          <router-link to="/create" class="btn">返回模板</router-link>
        </div>

        <div class="preview-container">
          <!-- 画布舞台，应用滤镜与边框样式到容器（按原型效果） -->
          <div
            class="canvas-stage"
            ref="canvasContainer"
            :style="{
              aspectRatio: canvasAspect,
              width: canvasWidth,
              filter: canvasCssFilter,
              border: borderStyleCss,
              borderRadius: borderRadius + 'px'
            }"
          >
            <!-- 画布加载前的预览占位 -->
            <img
              v-if="currentBackgroundUrl && (!isCanvasReady || !isBackgroundImageLoaded) && !isBackgroundImageLoading"
              class="canvas-preview"
              :src="currentBackgroundUrl"
              :alt="resolvedTemplateName"
            />
            
            <!-- 背景图加载动画 -->
            <div v-if="isBackgroundImageLoading" class="background-loading">
              <div class="loading-container">
                <div class="loading-progress-ring">
                  <svg class="progress-ring" width="80" height="80">
                    <circle
                      class="progress-ring-circle-bg"
                      stroke="rgba(0, 0, 0, 0.1)"
                      stroke-width="4"
                      fill="transparent"
                      r="36"
                      cx="40"
                      cy="40"
                    />
                    <circle
                      class="progress-ring-circle"
                      stroke="var(--colorBrandBackground)"
                      stroke-width="4"
                      fill="transparent"
                      r="36"
                      cx="40"
                      cy="40"
                      :stroke-dasharray="`${2 * Math.PI * 36}`"
                      :stroke-dashoffset="`${2 * Math.PI * 36 * (1 - backgroundImageLoadProgress / 100)}`"
                    />
                  </svg>
                  <!-- 在进度环中心添加一个脉冲点作为视觉中心 -->
                  <div class="progress-center-dot"></div>
                </div>
                <div class="loading-text">背景图加载中...</div>
              </div>
            </div>
            
            <div v-if="!currentBackgroundUrl && !isCanvasReady" class="canvas-empty">
              {{ isCanvasInitializing ? '画布初始化中...' : '空白画布' }}
            </div>
            <canvas 
              ref="fabricCanvasEl" 
              :style="{ visibility: isCanvasReady ? 'visible' : 'hidden' }"
            ></canvas>

            <!-- 文字覆盖（按原型 DOM 覆盖层） -->
            <div class="preview-overlay">
              <div class="preview-text" :style="{ textAlign: textAlignCss }">
                <h3 class="preview-title" :style="titleStyle">{{ titleText }}</h3>
                <p class="preview-subtitle" :style="subtitleStyle">{{ subtitleText }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 预览与导出主操作 -->
        <div class="preview-main-actions">
          <button class="btn ghost" @click="togglePreviewMode">{{ previewMode ? '编辑' : '预览' }}</button>
          <button class="btn primary" @click="saveProject" :disabled="isSaving">
            {{ isSaving ? '保存中...' : '保存' }}
          </button>
          <button class="btn primary" @click="exportProject">导出</button>
        </div>
        
        <!-- 保存状态提示 -->
        <div v-if="lastSavedAt" class="save-status">
          <span class="save-time">上次保存: {{ formatSaveTime(lastSavedAt) }}</span>
        </div>

        <!-- 次级操作：替换/添加/尺寸 -->
        <div class="preview-actions">
          <button class="btn ghost" @click="triggerReplace" :disabled="!isCanvasReady">
            {{ isCanvasInitializing ? '初始化中...' : '替换图片' }}
          </button>
          <button class="btn ghost" @click="triggerAddImage" :disabled="!isCanvasReady">
            {{ isCanvasInitializing ? '初始化中...' : '添加图片' }}
          </button>
          <button class="btn ghost" @click="cycleAspectRatio" :disabled="!isCanvasReady">调整尺寸</button>
          <input ref="bgFileInput" type="file" accept="image/*" class="file-input" @change="onPickBackground" />
          <input ref="fgFileInput" type="file" accept="image/*" class="file-input" @change="onPickForeground" />
        </div>
      </div>

      <!-- 中间：主要编辑工具（按原型） -->
      <div class="controls-panel primary-controls">
        <h2>编辑工具</h2>

        <div class="control-group">
          <h3>标题</h3>
          <input class="input" v-model="titleText" placeholder="输入标题" />
        </div>

        <div class="control-group">
          <h3>副标题</h3>
          <input class="input" v-model="subtitleText" placeholder="输入副标题" />
        </div>

        <div class="control-group">
          <h3>贴纸</h3>
          <div class="sticker-grid">
            <img v-for="s in stickers" :key="s.id" :src="s.url" :alt="s.name" class="sticker-item" @click="addSticker(s)" />
          </div>
          <div class="actions" style="margin-top:12px;">
            <button class="btn ghost" style="font-size:12px;" @click="moreStickers">更多贴纸</button>
            <button class="btn ghost" style="font-size:12px;" @click="triggerAddImage">上传贴纸</button>
          </div>
        </div>

        <div class="control-group">
          <h3>滤镜</h3>
          <div class="filter-grid">
            <div
              v-for="f in protoFilters"
              :key="f.id"
              class="filter-item"
              :class="{ active: selectedFilter === f.id }"
              @click="selectFilter(f.id)"
            >
              <img
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=80&q=60"
                :alt="f.name"
                :style="{ filter: f.css }"
              />
              <span>{{ f.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：高级设置（按原型） -->
      <div class="controls-panel secondary-controls">
        <h2>高级设置</h2>

        <div class="control-group">
          <h3>花字</h3>
          <div class="actions">
            <button class="btn pill" :class="{ selected: fontStyle === 'rounded' }" @click="setFontStyle('rounded')">可爱圆体</button>
            <button class="btn pill" :class="{ selected: fontStyle === 'hand' }" @click="setFontStyle('hand')">手写体</button>
            <button class="btn pill" :class="{ selected: fontStyle === 'sans' }" @click="setFontStyle('sans')">无衬线</button>
            <button class="btn pill" :class="{ selected: fontStyle === 'serif' }" @click="setFontStyle('serif')">衬线体</button>
          </div>
        </div>

        <div class="control-group">
          <h3>字体大小</h3>
          <input type="range" min="12" max="48" v-model="fontSize" class="slider" />
          <div style="text-align:center;font-size:12px;color:var(--sub);">{{ fontSize }}px</div>
        </div>

        <div class="control-group">
          <h3>文字颜色</h3>
          <div class="color-selector">
            <div
              v-for="c in colorPalette"
              :key="c"
              class="color-btn"
              :style="{ background: c, borderColor: selectedColor === c ? 'var(--colorNeutralForeground1)' : 'transparent' }"
              @click="selectColor(c)"
            />
          </div>
        </div>

        <div class="control-group">
          <h3>对齐方式</h3>
          <div class="actions">
            <button class="btn pill" :class="{ selected: textAlign === 'left' }" @click="setAlign('left')">左对齐</button>
            <button class="btn pill" :class="{ selected: textAlign === 'center' }" @click="setAlign('center')">居中</button>
            <button class="btn pill" :class="{ selected: textAlign === 'right' }" @click="setAlign('right')">右对齐</button>
          </div>
        </div>

        <div class="control-group">
          <h3>图片调整</h3>
          <div class="adjustment-controls">
            <div class="control-row">
              <label>亮度</label>
              <input type="range" min="-100" max="100" v-model="adjBrightness" class="slider" />
            </div>
            <div class="control-row">
              <label>对比度</label>
              <input type="range" min="-100" max="100" v-model="adjContrast" class="slider" />
            </div>
            <div class="control-row">
              <label>饱和度</label>
              <input type="range" min="-100" max="100" v-model="adjSaturation" class="slider" />
            </div>
            <div class="control-row">
              <label>锐化</label>
              <input type="range" min="0" max="100" v-model="adjSharpen" class="slider" />
            </div>
          </div>
        </div>

        <div class="control-group">
          <h3>边框装饰</h3>
          <div class="border-controls">
            <div class="control-row">
              <label>边框样式</label>
              <div class="actions">
                <button class="btn pill" :class="{ selected: borderStyle === 'none' }" @click="borderStyle = 'none'">无边框</button>
                <button class="btn pill" :class="{ selected: borderStyle === 'solid' }" @click="borderStyle = 'solid'">实线</button>
                <button class="btn pill" :class="{ selected: borderStyle === 'dashed' }" @click="borderStyle = 'dashed'">虚线</button>
                <button class="btn pill" :class="{ selected: borderStyle === 'dotted' }" @click="borderStyle = 'dotted'">点线</button>
              </div>
            </div>
            <div class="control-row">
              <label>边框宽度</label>
              <input type="range" min="0" max="20" v-model="borderWidth" class="slider" />
            </div>
            <div class="control-row">
              <label>圆角大小</label>
              <input type="range" min="0" max="50" v-model="borderRadius" class="slider" />
            </div>
            <div class="control-row">
              <label>边框颜色</label>
              <input type="color" v-model="borderColor" class="color-picker" />
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
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/project'
import type { Project, Template } from '@/types/project'
import templatesData from '@/data/templates.json'

let fabricNS: any = null
async function getFabric() {
  if (fabricNS) return fabricNS
  
  try {
    console.log('开始导入Fabric.js...')
    const mod: any = await import('fabric')
    console.log('Fabric.js模块导入结果:', mod)
    
    // Fabric.js v6的导入方式
    if (mod?.fabric) {
      fabricNS = mod.fabric
      console.log('✅ 使用mod.fabric')
    } else if (mod?.default) {
      fabricNS = mod.default
      console.log('✅ 使用mod.default')
    } else if (mod?.Canvas) {
      fabricNS = mod
      console.log('✅ 使用mod直接导入')
    } else {
      throw new Error('无法识别Fabric.js模块结构')
    }
    
    // 验证Fabric.js对象
    if (!fabricNS?.Canvas) {
      throw new Error('Fabric.js Canvas构造函数未找到')
    }
    
    console.log('Fabric.js导入成功:', {
      hasCanvas: !!fabricNS.Canvas,
      hasImage: !!fabricNS.Image,
      version: fabricNS.version || 'unknown'
    })
    
    return fabricNS
  } catch (error) {
    console.error('Fabric.js导入失败:', error)
    throw new Error(`Fabric.js导入失败: ${error}`)
  }
}

const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()

// 项目相关状态
const projectId = ref<string>('')
const projectName = ref('')
const isSaving = ref(false)
const lastSavedAt = ref<Date | null>(null)

// 模板信息
const templateId = computed(() => (route.params.id as string) || '')
const hasTemplateId = computed(() => !!templateId.value)

// 从templates.json加载模板数据
const templates = templatesData.templates as Template[]
const templateMap = new Map(templates.map(t => [t.id, t]))

// 获取当前模板数据
const currentTemplate = computed(() => templateMap.get(templateId.value))

const resolvedTemplateName = computed(() => currentTemplate.value?.name || '编辑器')
const templateRatio = ref(currentTemplate.value?.ratio || '4:5')
watch(templateId, (v) => { 
  const template = templateMap.get(v)
  templateRatio.value = template?.ratio || '4:5'
})

const defaultPreviewUrl = computed(() => currentTemplate.value?.preview || '')
const customBackgroundUrl = ref('')
const currentBackgroundUrl = computed(() => customBackgroundUrl.value || defaultPreviewUrl.value)

const canvasAspect = computed(() => {
  const [w, h] = templateRatio.value.split(':').map(Number)
  if (!w || !h) return '4 / 5'
  return `${w} / ${h}`
})
const canvasWidth = 'min(70vw, 80vh)'

// 画布相关
const canvasContainer = ref<HTMLDivElement>()
const fabricCanvasEl = ref<HTMLCanvasElement>()
const previewMode = ref(false)
const isCanvasReady = ref(false)
const isCanvasInitializing = ref(false)
const isBackgroundImageLoaded = ref(false) // 新增：背景图加载状态
const isBackgroundImageLoading = ref(false) // 新增：背景图加载中状态
const backgroundImageLoadProgress = ref(0) // 新增：加载进度
let canvas: any | null = null

// 预览覆盖文本（使用模板默认值）
const titleText = ref('')
const subtitleText = ref('')
const fontSize = ref(24)
const selectedColor = ref('#333333')
const colorPalette = ['#333333', '#8fd3c8', '#f7c3d3', '#ffe79a', '#bcd9ff', '#ff6b6b', '#4ecdc4', '#45b7d1']
const textAlign = ref<'left' | 'center' | 'right'>('center')
const fontStyle = ref<'rounded' | 'hand' | 'sans' | 'serif'>('sans')

// 滤镜（按原型）+ 调整项
const selectedFilter = ref<'origin' | 'cream' | 'film' | 'clean' | 'bw' | 'warm'>('origin')
const protoFilters = [
  { id: 'origin', name: '原图', css: 'none' },
  { id: 'cream', name: '奶油', css: 'brightness(1.1) contrast(0.9) saturate(1.2)' },
  { id: 'film', name: '胶片', css: 'contrast(1.2) saturate(0.8) sepia(0.3)' },
  { id: 'clean', name: '清透', css: 'brightness(1.05) contrast(1.1) saturate(1.1)' },
  { id: 'bw', name: '黑白', css: 'grayscale(1)' },
  { id: 'warm', name: '暖色', css: 'sepia(0.4) saturate(1.3)' }
]
const adjBrightness = ref(0)   // -100..100 -> map to 0.0..2.0
const adjContrast = ref(0)
const adjSaturation = ref(0)
const adjSharpen = ref(0)     // 仅视觉提示，导出阶段再实现卷积

// 边框
const borderStyle = ref<'none' | 'solid' | 'dashed' | 'dotted'>('none')
const borderWidth = ref(0)
const borderColor = ref('#000000')
const borderRadius = ref(12)

// 文件选择
const bgFileInput = ref<HTMLInputElement>()
const fgFileInput = ref<HTMLInputElement>()

function getContainerSize() {
  const el = canvasContainer.value
  if (!el) return { width: 600, height: 750 }
  const rect = el.getBoundingClientRect()
  const [w, h] = templateRatio.value.split(':').map(Number)
  const width = rect.width
  const height = Math.round((rect.width * (h || 5)) / (w || 4))
  return { width, height }
}

function fitBackground(img: any, width: number, height: number) {
  const scale = Math.max(width / img.width!, height / img.height!)
  img.set({ originX: 'left', originY: 'top', left: 0, top: 0, scaleX: scale, scaleY: scale })
}

const resizeCanvas = () => {
  if (!canvas || !fabricCanvasEl.value) return
  const { width, height } = getContainerSize()
  canvas.setWidth(width)
  canvas.setHeight(height)
  const bg = canvas.backgroundImage as any
  if (bg) fitBackground(bg, width, height)
  canvas.renderAll()
}

// CSS 滤镜合成（视觉与原型一致）
const canvasCssFilter = computed(() => {
  const base = protoFilters.find(f => f.id === selectedFilter.value)?.css || 'none'
  const b = (adjBrightness.value || 0) / 100
  const c = (adjContrast.value || 0) / 100
  const s = (adjSaturation.value || 0) / 100
  const sharp = adjSharpen.value || 0
  const parts = [base]
  // 将 -1..1 映射到 brightness/contrast/saturate
  if (b !== 0) parts.push(`brightness(${(1 + b).toFixed(3)})`)
  if (c !== 0) parts.push(`contrast(${(1 + c).toFixed(3)})`)
  if (s !== 0) parts.push(`saturate(${(1 + s).toFixed(3)})`)
  // 锐化：仅作为视觉提示（shadow 模拟），导出阶段再做卷积
  if (sharp > 0) parts.push(`drop-shadow(0 0 ${Math.min(2 + sharp / 25, 6)}px rgba(0,0,0,0.15))`)
  return parts.join(' ')
})

const textAlignCss = computed(() => textAlign.value)
const fontFamilyCss = computed(() => {
  if (fontStyle.value === 'rounded') return '"Arial Rounded MT Bold", ui-rounded, system-ui, sans-serif'
  if (fontStyle.value === 'hand') return 'KaiTi, STKaiti, "DFKai-SB", cursive'
  if (fontStyle.value === 'serif') return 'ui-serif, STSong, SimSun, serif'
  return 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"'
})
const titleStyle = computed(() => ({ color: selectedColor.value, fontSize: fontSize.value + 'px', fontFamily: fontFamilyCss.value }))
const subtitleStyle = computed(() => ({ color: selectedColor.value, fontSize: Math.round(fontSize.value * 0.75) + 'px', fontFamily: fontFamilyCss.value }))

const borderStyleCss = computed(() => (borderStyle.value === 'none' || borderWidth.value === 0) ? 'none' : `${borderWidth.value}px ${borderStyle.value} ${borderColor.value}`)

// 初始化画布
const initCanvas = async (): Promise<void> => {
  try {
    console.log('开始初始化画布...')
    isCanvasReady.value = false
    isCanvasInitializing.value = true
    
    // 确保Canvas元素可见，以便Fabric.js能够正确初始化
    console.log('设置Canvas元素为可见状态...')
    
    console.log('加载Fabric.js...')
    const f = await getFabric()
    console.log('Fabric.js加载完成')
    
    console.log('检查Canvas元素...', !!fabricCanvasEl.value)
    if (!fabricCanvasEl.value) {
      console.error('Canvas元素未找到')
      isCanvasReady.value = true // 设置为ready避免按钮永远禁用
      isCanvasInitializing.value = false
      return
    }

         console.log('创建Fabric Canvas...')
     console.log('Fabric.js对象检查:', {
       fabric: !!f,
       Canvas: !!f.Canvas,
       Image: !!f.Image,
       version: f.version || 'unknown'
     })
     
     // 确保Fabric.js正确加载
     if (!f.Canvas) {
       throw new Error('Fabric.js Canvas构造函数未找到')
     }
     
           try {
        canvas = new f.Canvas(fabricCanvasEl.value, {
          selection: !previewMode.value,
          preserveObjectStacking: true,
          backgroundColor: '#ffffff'
        })
        console.log('Canvas创建成功')
        
        // 深度验证Canvas对象
        console.log('Canvas对象验证:', {
          canvas: !!canvas,
          canvasType: typeof canvas,
          constructor: canvas.constructor?.name,
          prototype: Object.getPrototypeOf(canvas)?.constructor?.name
        })
        
        // 检查关键方法
        const requiredMethods = ['setBackgroundImage', 'add', 'renderAll', 'setWidth', 'setHeight']
        const methodCheck = requiredMethods.reduce((acc, method) => {
          acc[method] = typeof canvas[method]
          return acc
        }, {} as Record<string, string>)
        
        console.log('Canvas方法检查:', methodCheck)
        
        // 验证Canvas是否真正可用 - 添加重试机制
        let validationRetryCount = 0
        const maxValidationRetries = 3
        
        const validateCanvas = async (): Promise<boolean> => {
          if (validationRetryCount >= maxValidationRetries) {
            return false
          }
          
          // 等待Canvas对象完全初始化
          await new Promise(resolve => setTimeout(resolve, 200 * (validationRetryCount + 1)))
          
          // 重新检查方法
          const hasRequiredMethods = requiredMethods.every(method => 
            typeof canvas[method] === 'function'
          )
          
          if (hasRequiredMethods) {
            console.log('✅ Canvas对象验证通过')
            return true
          }
          
          console.warn(`Canvas对象方法不完整，重试 ${validationRetryCount + 1}/${maxValidationRetries}...`)
          validationRetryCount++
          
          // 尝试重新创建Canvas
          try {
            if (canvas.dispose) {
              canvas.dispose()
            }
            canvas = new f.Canvas(fabricCanvasEl.value, {
              selection: !previewMode.value,
              preserveObjectStacking: true,
              backgroundColor: '#ffffff'
            })
            console.log('Canvas重新创建成功，重新验证...')
            return await validateCanvas()
          } catch (retryError) {
            console.error('Canvas重新创建失败:', retryError)
            return false
          }
        }
        
        // 开始验证
        const isValid = await validateCanvas()
        if (!isValid) {
          throw new Error('Canvas对象创建不完整，缺少关键方法')
        }
        
      } catch (canvasError) {
        console.error('Canvas创建失败:', canvasError)
        throw canvasError
      }
    
    console.log('调整Canvas尺寸...')
    resizeCanvas()

    // 背景图
    const preview = currentBackgroundUrl.value
    console.log('背景图URL:', preview)
    if (preview) {
      try {
        console.log('开始加载背景图...')
        isBackgroundImageLoaded.value = false // 重置背景图加载状态
        isBackgroundImageLoading.value = true // 开始加载动画
        backgroundImageLoadProgress.value = 0
        
        await new Promise<void>((resolve, reject) => {
          console.log('=== 开始Promise包装的背景图加载 ===')
          let isResolved = false // 防止重复resolve
          
          // 增加超时时间到30秒，给复杂图片更多加载时间
          const timeout = setTimeout(() => {
            if (!isResolved) {
              console.warn('背景图加载超时，跳过背景图')
              isResolved = true
              isBackgroundImageLoaded.value = false
              isBackgroundImageLoading.value = false
              backgroundImageLoadProgress.value = 0
              resolve()
            }
          }, 30000) // 30秒超时
          
          // 改进的进度模拟 - 更平滑自然
          let progress = 0
          const progressInterval = setInterval(() => {
            if (progress < 85 && !isResolved) { // 只模拟到85%，留15%给实际加载完成
              // 使用缓动函数，让进度增长越来越慢
              const remaining = 85 - progress
              const increment = Math.max(0.5, remaining * 0.1)
              progress += increment
              backgroundImageLoadProgress.value = Math.min(85, progress)
              console.log('进度模拟:', backgroundImageLoadProgress.value.toFixed(1) + '%')
            }
          }, 100) // 更频繁的更新，让动画更流畅
          
          console.log('调用 f.Image.fromURL，URL:', preview)
          
          // 使用更可靠的图片加载方案
          const loadImageWithFallback = () => {
            console.log('开始加载图片，使用fallback方案...')
            
            // 方案1: 直接使用已加载的Image对象
            const img = new Image()
            img.crossOrigin = 'anonymous'
            
            img.onload = () => {
              console.log('✅ 图片直接加载成功，尺寸:', img.width, 'x', img.height)
              
              if (!isResolved && canvas) {
                                 try {
                   console.log('创建Fabric.js Image对象...')
                   
                   // 检查Fabric.js Image构造函数
                   if (!f.Image) {
                     throw new Error('Fabric.js Image构造函数未找到')
                   }
                   
                   const fabricImg = new f.Image(img)
                   console.log('Fabric Image创建成功:', fabricImg)
                   
                   // 检查Canvas对象和方法
                   if (!canvas) {
                     throw new Error('Canvas对象未找到')
                   }
                   
                   // 深度检查Canvas对象
                   console.log('Canvas对象深度检查:', {
                     canvas: !!canvas,
                     canvasType: typeof canvas,
                     canvasConstructor: canvas.constructor?.name,
                     hasSetBackgroundImage: 'setBackgroundImage' in canvas,
                     setBackgroundImageType: typeof canvas.setBackgroundImage,
                     canvasPrototype: Object.getPrototypeOf(canvas)?.constructor?.name,
                     canvasMethods: Object.getOwnPropertyNames(Object.getPrototypeOf(canvas))
                   })
                   
                   // 尝试多种方式设置背景图
                   let backgroundSetSuccess = false
                   
                   // 方法1: 直接设置背景图
                   if (typeof canvas.setBackgroundImage === 'function') {
                     console.log('使用setBackgroundImage方法...')
                     try {
                       canvas.setBackgroundImage(fabricImg, () => {
                         console.log('背景图设置到Canvas完成')
                         if (!isResolved) {
                           console.log('✅ 背景图加载成功，resolving promise')
                           isResolved = true
                           isBackgroundImageLoaded.value = true
                           isBackgroundImageLoading.value = false
                           backgroundImageLoadProgress.value = 0
                           canvas.renderAll()
                           resolve()
                         }
                       })
                       backgroundSetSuccess = true
                     } catch (setError) {
                       console.warn('setBackgroundImage方法失败:', setError)
                     }
                   }
                   
                   // 方法2: 使用set方法
                   if (!backgroundSetSuccess && typeof canvas.set === 'function') {
                     console.log('尝试使用canvas.set方法...')
                     try {
                       canvas.set('backgroundImage', fabricImg)
                       canvas.renderAll()
                       console.log('✅ 使用set方法设置背景图成功')
                       backgroundSetSuccess = true
                       if (!isResolved) {
                         isResolved = true
                         isBackgroundImageLoaded.value = true
                         isBackgroundImageLoading.value = false
                         backgroundImageLoadProgress.value = 0
                         resolve()
                       }
                     } catch (setError) {
                       console.warn('canvas.set方法失败:', setError)
                     }
                   }
                   
                   // 方法3: 直接赋值
                   if (!backgroundSetSuccess) {
                     console.log('尝试直接赋值backgroundImage属性...')
                     try {
                       (canvas as any).backgroundImage = fabricImg
                       canvas.renderAll()
                       console.log('✅ 直接赋值backgroundImage成功')
                       backgroundSetSuccess = true
                       if (!isResolved) {
                         isResolved = true
                         isBackgroundImageLoaded.value = true
                         isBackgroundImageLoading.value = false
                         backgroundImageLoadProgress.value = 0
                         resolve()
                       }
                     } catch (assignError) {
                       console.warn('直接赋值失败:', assignError)
                     }
                   }
                   
                   // 如果所有方法都失败
                   if (!backgroundSetSuccess) {
                     throw new Error('所有设置背景图的方法都失败了')
                   }
                   
                 } catch (err: any) {
                   console.error('处理背景图时出错:', err)
                   console.error('错误详情:', {
                     error: err,
                     message: err?.message || 'Unknown error',
                     stack: err?.stack || 'No stack trace',
                     canvas: !!canvas,
                     canvasType: typeof canvas,
                     fabricImage: !!f.Image
                   })
                   
                   if (!isResolved) {
                     isResolved = true
                     isBackgroundImageLoaded.value = false
                     isBackgroundImageLoading.value = false
                     backgroundImageLoadProgress.value = 0
                     resolve() // 使用resolve而不是reject，避免卡住
                   }
                 }
              }
            }
            
            img.onerror = (e) => {
              console.error('❌ 图片加载失败:', e)
              if (!isResolved) {
                console.log('图片加载失败，跳过背景图')
                isResolved = true
                isBackgroundImageLoaded.value = false
                isBackgroundImageLoading.value = false
                backgroundImageLoadProgress.value = 0
                resolve()
              }
            }
            
            img.src = preview
          }
          
          // 启动加载
          loadImageWithFallback()
          
          // 添加额外的监控，检查是否有onerror回调
          setTimeout(() => {
            if (!isResolved) {
              console.log('⚠️ 5秒后检查：Promise仍未resolved，当前进度:', backgroundImageLoadProgress.value)
            }
          }, 5000)
        })
        console.log('背景图加载完成，状态:', isBackgroundImageLoaded.value)
      } catch (err) {
        console.warn('背景图加载失败，已忽略', err)
        isBackgroundImageLoaded.value = false
        isBackgroundImageLoading.value = false
        backgroundImageLoadProgress.value = 0
      }
    } else {
      console.log('没有背景图需要加载')
      isBackgroundImageLoaded.value = true // 没有背景图时设为true
      isBackgroundImageLoading.value = false
      backgroundImageLoadProgress.value = 0
    }

    console.log('设置画布状态为就绪')
    isCanvasReady.value = true
    isCanvasInitializing.value = false
    canvas.renderAll()
    console.log('画布初始化完成!')
  } catch (e) {
    console.error('初始化画布失败', e)
    
    // 增强错误处理
    if (e instanceof Error) {
      console.error('错误详情:', {
        message: e.message,
        stack: e.stack,
        name: e.name
      })
    }
    
    // 尝试清理Canvas对象
    if (canvas) {
      try {
        if (typeof canvas.dispose === 'function') {
          canvas.dispose()
        }
        canvas = null
      } catch (disposeError) {
        console.error('清理Canvas对象失败:', disposeError)
      }
    }
    
    // 设置状态，避免无限等待
    isCanvasReady.value = true
    isCanvasInitializing.value = false
    
    // 显示用户友好的错误信息
    console.warn('Canvas初始化失败，但已设置为就绪状态以避免阻塞')
  }
}

// 贴纸
const stickers = [
  { id: '1', name: '爱心', url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTUwIDg0TDE1IDQ4Yy0xNS0xNi03LTE5IDAtMjZjOS05IDIyLTYgMzUgNyAxMy0xMyAyNi0xNiAzNS03IDcgNyAxNSAxMCAwIDI2TDUwIDg0eiIgZmlsbD0iI2ZmNjliOSIgc3Ryb2tlPSIjZmY0YTdhIiBzdHJva2Utd2lkdGg9IjMiLz48L3N2Zz4=' },
  { id: '2', name: '星星', url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBvbHlnb24gcG9pbnRzPSI1MCAxMCA2MSA0MCA5MCA0MCA2NiA1OSA3NiA4OCA1MCA3MCAyNCA4OCAzNCA1OSA5IDQwIDM5IDQwIiBmaWxsPSIjZmRiODAwIiBzdHJva2U9IiNmY2Q1MDAiIHN0cm9rZS13aWR0aD0iMyIvPjwvc3ZnPg==' },
  { id: '3', name: '花朵', url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iMTUiIGZpbGw9IiNmZjkwY2YiLz48Y2lyY2xlIGN4PSI3MCIgY3k9IjMwIiByPSIxMCIgZmlsbD0iI2Y4N2JlZiIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEwIiBmaWxsPSIjZTQ5MWZmIi8+PGNpcmNsZSBjeD0iNzAiIGN5PSI3MCIgcj0iMTAiIGZpbGw9IiNmZTRjYWYiLz48Y2lyY2xlIGN4PSIzMCIgY3k9IjcwIiByPSIxMCIgZmlsbD0iI2ZmY2Q1ZSIvPjwvc3ZnPg==' },
  { id: '4', name: '彩虹', url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTAwIDYwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iOCI+PHBhdGggZD0iTTUgNTVhNDUgNDUgMCAwIDEgOTAgMCIgc3Ryb2tlPSIjZmY3MzkwIi8+PHBhdGggZD0iTTE1IDU1YTM1IDM1IDAgMCAxIDcwIDAiIHN0cm9rZT0iI2ZmYTc5NSIvPjxwYXRoIGQ9Ik0yNSA1NWEyNSAyNSAwIDAgMSA1MCAwIiBzdHJva2U9IiNmZmQ0ODAiLz48L2c+PC9zdmc+' }
]

const addSticker = async (sticker: any): Promise<void> => {
  if (!canvas) {
    alert('画布未初始化，请稍后再试')
    return
  }
  
  try {
    const f = await getFabric()
    await new Promise<void>((resolve, reject) => {
      f.Image.fromURL(sticker.url, (img: any) => {
        if (!canvas) {
          reject(new Error('画布未初始化'))
          return
        }
        
        const targetWidth = Math.min(160, canvas.getWidth() * 0.25)
        const scale = targetWidth / img.width!
        img.set({ 
          left: canvas.getWidth() / 2, 
          top: canvas.getHeight() / 2, 
          originX: 'center', 
          originY: 'center', 
          scaleX: scale, 
          scaleY: scale 
        })
        canvas.add(img)
        canvas.setActiveObject(img)
        canvas.renderAll()
        resolve()
      }, { crossOrigin: 'anonymous' })
    })
    
    console.log('贴纸添加成功')
  } catch (error) {
    console.error('添加贴纸失败:', error)
    alert('添加贴纸失败，请重试')
  }
}

// 滤镜选择（CSS 视觉）
function selectFilter(id: string) {
  selectedFilter.value = id as 'origin' | 'cream' | 'film' | 'clean' | 'bw' | 'warm'
}

// 颜色/对齐/字体
function selectColor(c: string) { selectedColor.value = c }
function setAlign(a: 'left' | 'center' | 'right') { textAlign.value = a }
function setFontStyle(s: 'rounded' | 'hand' | 'sans' | 'serif') { fontStyle.value = s }

// 预览模式切换
function applyPreviewMode() {
  if (!canvas) return
  const enable = !previewMode.value
  canvas.selection = enable
  canvas.forEachObject((obj: any) => { obj.selectable = enable; obj.evented = enable })
  canvas.discardActiveObject()
  canvas.renderAll()
}
function togglePreviewMode() { previewMode.value = !previewMode.value; applyPreviewMode() }

// 图片替换/添加/尺寸
function triggerReplace() { 
  console.log('=== triggerReplace 被调用 ===')
  console.log('isCanvasReady.value:', isCanvasReady.value)
  console.log('bgFileInput.value:', bgFileInput.value)
  
  if (!isCanvasReady.value) {
    console.log('❌ 画布未就绪，显示警告')
    alert('画布正在初始化，请稍后再试')
    return
  }
  
  console.log('✅ 画布已就绪，触发文件选择器')
  console.log('bgFileInput.value?.click() 执行前')
  bgFileInput.value?.click()
  console.log('bgFileInput.value?.click() 执行后')
}
function triggerAddImage() { 
  console.log('=== triggerAddImage 被调用 ===')
  console.log('isCanvasReady.value:', isCanvasReady.value)
  console.log('fgFileInput.value:', fgFileInput.value)
  console.log('fgFileInput.value?.disabled:', fgFileInput.value?.disabled)
  console.log('fgFileInput.value?.style:', fgFileInput.value?.style.cssText)
  
  if (!isCanvasReady.value) {
    console.log('❌ 画布未就绪，显示警告')
    alert('画布正在初始化，请稍后再试')
    return
  }
  
  console.log('✅ 画布已就绪，触发文件选择器')
  console.log('fgFileInput.value?.click() 执行前')
  fgFileInput.value?.click()
  console.log('fgFileInput.value?.click() 执行后')
}
function onPickBackground(e: Event) {
  console.log('=== onPickBackground 被调用 ===')
  console.log('事件对象:', e)
  console.log('目标元素:', e.target)
  
  const file = (e.target as HTMLInputElement).files?.[0]
  console.log('选择的文件:', file)
  if (!file) {
    console.log('❌ 没有选择文件')
    return
  }
  
  console.log('✅ 文件信息:', {
    name: file.name,
    size: file.size,
    type: file.type
  })
  
  // 清空input，允许重复选择同一文件
  ;(e.target as HTMLInputElement).value = ''
  
  const reader = new FileReader()
  reader.onload = async () => {
    console.log('文件读取完成，开始处理...')
    customBackgroundUrl.value = String(reader.result || '')
    if (canvas) {
      try {
        const f = await getFabric()
        await new Promise<void>((resolve, reject) => {
          f.Image.fromURL(customBackgroundUrl.value, (img: any) => {
            if (!canvas) {
              reject(new Error('画布未初始化'))
              return
            }
            fitBackground(img, canvas.getWidth(), canvas.getHeight())
            canvas.setBackgroundImage(img, () => {
              canvas.renderAll()
              resolve()
            })
          }, { crossOrigin: 'anonymous' })
        })
        console.log('背景图片替换成功')
      } catch (error) {
        console.error('替换背景图片失败:', error)
        alert('替换背景图片失败，请重试')
      }
    }
  }
  reader.readAsDataURL(file)
}
function onPickForeground(e: Event) {
  console.log('=== onPickForeground 被调用 ===')
  console.log('事件对象:', e)
  console.log('目标元素:', e.target)
  
  const file = (e.target as HTMLInputElement).files?.[0]
  console.log('选择的文件:', file)
  if (!file) {
    console.log('❌ 没有选择文件')
    return
  }
  
  console.log('✅ 文件信息:', {
    name: file.name,
    size: file.size,
    type: file.type
  })
  
  // 清空input，允许重复选择同一文件
  ;(e.target as HTMLInputElement).value = ''
  
  const reader = new FileReader()
  reader.onload = async () => {
    console.log('文件读取完成，开始处理...')
    if (!canvas) {
      console.log('❌ 画布未初始化')
      alert('画布未初始化，请稍后再试')
      return
    }
    
    try {
      const f = await getFabric()
      await new Promise<void>((resolve, reject) => {
        f.Image.fromURL(String(reader.result || ''), (img: any) => {
          if (!canvas) {
            reject(new Error('画布未初始化'))
            return
          }
          
          const targetWidth = Math.min(200, canvas.getWidth() * 0.3)
          const scale = targetWidth / img.width!
          img.set({ 
            left: canvas.getWidth() / 2, 
            top: canvas.getHeight() / 2, 
            originX: 'center', 
            originY: 'center', 
            scaleX: scale, 
            scaleY: scale 
          })
          canvas.add(img)
          canvas.setActiveObject(img)
          canvas.renderAll()
          resolve()
        }, { crossOrigin: 'anonymous' })
      })
      
      console.log('图片添加成功')
    } catch (error) {
      console.error('添加图片失败:', error)
      alert('添加图片失败，请重试')
    }
  }
  reader.readAsDataURL(file)
}
function cycleAspectRatio() {
  const list = ['4:5', '1:1', '9:16']
  const i = list.indexOf(templateRatio.value)
  templateRatio.value = list[(i + 1) % list.length]
  resizeCanvas()
}

// 更多贴纸（占位）
function moreStickers() { alert('更多贴纸即将上线') }

// 保存项目
const saveProject = async (): Promise<void> => {
  if (isSaving.value) return
  
  isSaving.value = true
  try {
    // 生成项目数据
    const projectData: Partial<Project> = {
      name: projectName.value || `我的${resolvedTemplateName.value}`,
      description: `使用${resolvedTemplateName.value}模板创建的作品`,
      templateId: templateId.value,
      thumbnail: currentBackgroundUrl.value,
      content: {
        title: titleText.value,
        subtitle: subtitleText.value,
        images: [], // TODO: 从画布获取图片数据
        stickers: [], // TODO: 从画布获取贴纸数据
        filters: [selectedFilter.value],
        text: '',
        mood: 'happy' as any, // 默认心情
        colors: {
          primary: selectedColor.value,
          secondary: selectedColor.value,
          text: selectedColor.value
        },
        ratio: templateRatio.value as any,
        fontSize: fontSize.value,
        fontStyle: fontStyle.value,
        textAlign: textAlign.value,
        borderStyle: borderStyle.value,
        borderWidth: borderWidth.value,
        borderColor: borderColor.value,
        borderRadius: borderRadius.value,
        adjustments: {
          brightness: adjBrightness.value,
          contrast: adjContrast.value,
          saturation: adjSaturation.value,
          sharpen: adjSharpen.value
        }
      },
      tags: [currentTemplate.value?.category || '其他'],
      isPublic: false,
      updatedAt: new Date().toISOString()
    }
    
    if (projectId.value) {
      // 更新现有项目
      projectStore.updateProject(projectId.value, projectData)
    } else {
      // 创建新项目
      const newProject = projectStore.addProject({
        ...projectData,
        id: `project-${Date.now()}`,
        createdAt: new Date().toISOString()
      } as Project)
      projectId.value = newProject.id
    }
    
    lastSavedAt.value = new Date()
    showSuccessMessage('项目保存成功')
  } catch (error) {
    console.error('保存项目失败:', error)
    showErrorMessage('保存失败，请重试')
  } finally {
    isSaving.value = false
  }
}

// 项目名称变更处理
const onProjectNameChange = () => {
  if (projectName.value.trim()) {
    // 可以在这里添加自动保存逻辑
  }
}

// 显示成功消息
const showSuccessMessage = (message: string) => {
  // 简单的成功提示，后续可以优化为Toast组件
  alert(message)
}

// 显示错误消息
const showErrorMessage = (message: string) => {
  // 简单的错误提示，后续可以优化为Toast组件
  alert(message)
}

// 格式化保存时间
const formatSaveTime = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`
  
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}天前`
  
  return date.toLocaleDateString()
}

// 导出项目（跳转到Export页面）
const exportProject = (): void => { 
  if (!projectId.value) {
    alert('请先保存项目再导出')
    return
  }
  router.push({
    path: '/export',
    query: { 
      project: projectId.value,
      template: templateId.value 
    }
  })
}

// 快速开始（无 id）
const quickStart = (): void => { router.push('/editor/quick-start') }

onMounted(() => {
  console.log('=== Editor.vue onMounted 开始 ===')
  console.log('hasTemplateId:', hasTemplateId.value)
  console.log('templateId:', templateId.value)
  console.log('currentTemplate:', currentTemplate.value)
  
  if (hasTemplateId.value) {
    console.log('✅ 有模板ID，开始初始化流程')
    
    // 应用模板默认值
    console.log('📝 应用模板默认值...')
    applyTemplateDefaults()
    
    // 立即开始初始化，Canvas元素现在始终存在于DOM中
    console.log('📝 开始Canvas初始化流程...')
    
    // 检查关键元素是否存在
    console.log('检查DOM元素:')
    console.log('- fabricCanvasEl.value:', !!fabricCanvasEl.value)
    console.log('- canvasContainer.value:', !!canvasContainer.value)
    console.log('- 编辑器容器:', !!document.querySelector('.editor-container'))
    console.log('- canvas元素:', !!document.querySelector('canvas'))
    
    // 如果Canvas元素存在，立即开始初始化
    if (fabricCanvasEl.value) {
      console.log('✅ Canvas元素已就绪，开始初始化画布...')
      initCanvas().then(() => {
        console.log('✅ Canvas初始化成功')
      }).catch((error) => {
        console.error('❌ Canvas初始化失败:', error)
      })
    } else {
      console.error('❌ Canvas元素未找到，等待DOM更新...')
      // 等待DOM更新
      nextTick(() => {
        if (fabricCanvasEl.value) {
          console.log('✅ Canvas元素在DOM更新后找到，开始初始化...')
          initCanvas().then(() => {
            console.log('✅ Canvas初始化成功')
          }).catch((error) => {
            console.error('❌ Canvas初始化失败:', error)
          })
        } else {
          console.error('❌ Canvas元素仍未找到，设置为就绪状态避免阻塞')
          isCanvasReady.value = true
        }
      })
    }
    
    window.addEventListener('resize', resizeCanvas)
    
    // 尝试加载现有项目
    console.log('📝 加载现有项目...')
    loadExistingProject()
  } else {
    console.log('❌ 没有模板ID，跳过初始化')
  }
  
  console.log('=== Editor.vue onMounted 结束 ===')
})

// 应用模板默认值
const applyTemplateDefaults = () => {
  if (currentTemplate.value) {
    titleText.value = currentTemplate.value.defaultTitle || '我的美好时光'
    subtitleText.value = currentTemplate.value.defaultSubtitle || '记录生活中的小确幸'
    selectedColor.value = currentTemplate.value.defaultColors?.text || '#333333'
  }
}

// 加载现有项目
const loadExistingProject = () => {
  // 从localStorage恢复项目数据
  projectStore.restoreFromLocal()
  
  // 查找是否有使用当前模板的现有项目
  const existingProjects = projectStore.projectsByTemplate(templateId.value)
  if (existingProjects.length > 0) {
    // 加载最新的项目
    const latestProject = existingProjects[0]
    projectId.value = latestProject.id
    projectName.value = latestProject.name
    
    // 恢复编辑内容
    if (latestProject.content) {
      titleText.value = latestProject.content.title || titleText.value
      subtitleText.value = latestProject.content.subtitle || subtitleText.value
      selectedColor.value = latestProject.content.colors?.text || selectedColor.value
      fontSize.value = latestProject.content.fontSize || fontSize.value
      fontStyle.value = latestProject.content.fontStyle || fontStyle.value
      textAlign.value = latestProject.content.textAlign || textAlign.value
      borderStyle.value = latestProject.content.borderStyle || borderStyle.value
      borderWidth.value = latestProject.content.borderWidth || borderWidth.value
      borderColor.value = latestProject.content.borderColor || borderColor.value
      borderRadius.value = latestProject.content.borderRadius || borderRadius.value
      
      if (latestProject.content.adjustments) {
        adjBrightness.value = latestProject.content.adjustments.brightness || 0
        adjContrast.value = latestProject.content.adjustments.contrast || 0
        adjSaturation.value = latestProject.content.adjustments.saturation || 0
        adjSharpen.value = latestProject.content.adjustments.sharpen || 0
      }
      
      if (latestProject.content.filters && latestProject.content.filters.length > 0) {
        selectedFilter.value = latestProject.content.filters[0] as any || 'origin'
      }
    }
  } else {
    // 设置默认项目名称
    projectName.value = `我的${resolvedTemplateName.value}`
    // 如果没有现有项目，应用模板默认值
    applyTemplateDefaults()
  }
}

watch([templateId], async () => {
  if (canvas) { canvas.dispose(); canvas = null }
  // 应用新模板的默认值
  applyTemplateDefaults()
  await initCanvas()
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
  if (canvas) { canvas.dispose(); canvas = null }
})
</script>

<style scoped>
.editor-page { 
  display: flex; 
  flex-direction: column; 
  min-height: 100vh;
  padding-top: 80px;
  box-sizing: border-box;
}
.editor-container { flex: 1; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 24px; padding: 24px; }

/* 预览区域 */
.preview-area { background: var(--colorNeutralBackground1); border-radius: var(--borderRadiusXLarge); padding: 24px; box-shadow: var(--shadow4); border: 1px solid var(--colorNeutralStroke1); display: flex; flex-direction: column; }
.preview-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.preview-container { flex: 1; display: flex; align-items: center; justify-content: center; min-height: 400px; position: relative; }
.canvas-stage { background: white; border-radius: 12px; box-shadow: var(--shadow8); max-width: 100%; max-height: 100%; position: relative; overflow: hidden; }
.canvas-preview { width: 100%; height: 100%; object-fit: cover; display: block; }
.canvas-empty { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--colorNeutralForeground3); font-size: 14px; }
.preview-overlay { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; pointer-events: none; }
.preview-text { background: var(--colorNeutralBackground1); padding: 12px 24px; border-radius: 12px; border: 1px solid var(--colorNeutralStroke1); box-shadow: var(--shadow4); }
.preview-title { margin: 0 0 6px; font-weight: 600; }
.preview-subtitle { margin: 0; color: var(--colorNeutralForeground2); }
.preview-main-actions { display: flex; gap: 12px; justify-content: center; margin: 24px 0; padding: 12px; background: var(--pink-light); border-radius: 12px; border: 1px solid var(--pink-medium); }

/* 项目名称编辑 */
.header-left { display: flex; flex-direction: column; gap: 8px; }
.project-name-edit { margin-top: 4px; }
.project-name-input { 
  width: 200px; 
  padding: 8px 12px; 
  border: 1px solid var(--colorNeutralStroke1); 
  border-radius: 8px; 
  background: var(--colorNeutralBackground1); 
  font-size: 14px; 
  color: var(--colorNeutralForeground1);
}
.project-name-input:focus { 
  outline: none; 
  border-color: var(--colorBrandBackground); 
  box-shadow: 0 0 0 2px var(--colorBrandBackgroundAlpha10);
}

/* 保存状态 */
.save-status { 
  text-align: center; 
  margin: 8px 0; 
  padding: 8px; 
  background: var(--colorNeutralBackground2); 
  border-radius: 8px; 
  border: 1px solid var(--colorNeutralStroke2);
}
.save-time { 
  font-size: 12px; 
  color: var(--colorNeutralForeground3); 
}
.preview-actions { margin-top: 16px; display: flex; gap: 12px; justify-content: center; }
.file-input { display: none; }

/* 控制面板（与原型一致的粘性滚动） */
.controls-panel { background: var(--colorNeutralBackground1); border-radius: var(--borderRadiusXLarge); padding: 24px; box-shadow: var(--shadow4); position: sticky; top: 88px; max-height: calc(100vh - 120px); overflow-y: auto; border: 1px solid var(--colorNeutralStroke1); }
.primary-controls { border-right: 1px solid var(--colorNeutralStroke1); }
.secondary-controls { border-left: 1px solid var(--colorNeutralStroke1); }
.control-group { margin-bottom: 24px; }
.control-group h3 { margin: 0 0 12px; font-size: 14px; font-weight: 600; color: var(--colorNeutralForeground1); border-bottom: 1px solid var(--colorNeutralStroke1); padding-bottom: 8px; }
.actions { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
.input { width: 100%; padding: 12px; border: 1px solid var(--colorNeutralStroke1); border-radius: 12px; background: var(--colorNeutralBackground1); font-size: 14px; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 24px; border-radius: 12px; border: 1px solid var(--colorNeutralStroke1); background: var(--colorNeutralBackground1); text-decoration: none; color: var(--colorNeutralForeground1); font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; min-height: 44px; }
.btn:hover { border-color: var(--colorBrandBackground); background: var(--pink-light); box-shadow: var(--shadow4); transform: translateY(-1px); }
.btn.primary { background: var(--colorBrandBackground); color: var(--colorBrandForeground); border-color: var(--colorBrandBackground); }
.btn.primary:hover { background: var(--colorBrandBackgroundHover); }
.btn.ghost { background: transparent; border-color: transparent; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn:disabled:hover { transform: none; box-shadow: none; }
.btn.pill { padding: 8px 16px; border-radius: 999px; font-size: 12px; }
.btn.pill.selected { background: var(--pink-light); color: var(--pink-dark); border-color: var(--pink-medium); }
.slider { width: 100%; height: 6px; border-radius: 3px; background: var(--colorNeutralStroke1); outline: none; accent-color: var(--colorBrandBackground); }
.color-selector { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.color-btn { aspect-ratio: 1/1; border-radius: 12px; border: 2px solid transparent; cursor: pointer; transition: all 0.2s ease; }
.color-btn:hover { transform: scale(1.05); }
.sticker-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.sticker-item { width: 100%; aspect-ratio: 1/1; border-radius: 8px; cursor: pointer; border: 2px solid transparent; transition: all 0.2s ease; object-fit: cover; }
.sticker-item:hover { border-color: var(--colorBrandBackground); }
.filter-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.filter-item { text-align: center; cursor: pointer; transition: all 0.2s ease; padding: 8px; border: 1px solid var(--colorNeutralStroke1); border-radius: 8px; }
.filter-item.active { border-color: var(--colorBrandBackground); background: var(--pink-light); }
.filter-item img { width: 100%; aspect-ratio: 1/1; border-radius: 8px; border: 2px solid transparent; }
.filter-item:hover img { border-color: var(--colorBrandBackground); }

/* 空状态 */
.editor-empty { width: 100%; padding: 48px 32px; display: flex; align-items: center; justify-content: center; }
.empty-card { width: 100%; max-width: 720px; background: var(--colorNeutralBackground1); border: 1px solid var(--colorNeutralStroke1); border-radius: 20px; box-shadow: var(--shadow8); padding: 32px; text-align: center; }
.empty-icon { font-size: 56px; margin-bottom: 12px; }
.empty-card h2 { margin: 0 0 8px; font-size: 24px; font-weight: 700; color: var(--colorNeutralForeground1); }
.empty-card p { margin: 0 0 20px; color: var(--colorNeutralForeground2); }
.empty-actions { display: flex; gap: 12px; justify-content: center; }

/* 画布占位层 */
.canvas-stage canvas { position: absolute; inset: 0; width: 100%; height: 100%; }

/* 背景图加载动画 */
.background-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 12px;
  backdrop-filter: blur(4px);
}

.loading-container { 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  gap: 16px;
}

.loading-progress-ring {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 8px 0;
}

.progress-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}

.progress-ring-circle-bg {
  fill: none;
  stroke: rgba(0, 0, 0, 0.1);
  stroke-width: 4;
  opacity: 0.6;
}

.progress-ring-circle {
  fill: none;
  stroke: var(--colorBrandBackground);
  stroke-width: 4;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.2s ease-out;
  filter: drop-shadow(0 0 4px rgba(var(--colorBrandBackground), 0.3));
}

.progress-center-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: var(--colorBrandBackground);
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { 
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1);
  }
  50% { 
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

.loading-text {
  font-size: 14px;
  color: var(--colorNeutralForeground1);
  font-weight: 500;
  opacity: 0.8;
  text-align: center;
}



/* 响应式 */
@media (max-width: 1024px) {
  .editor-container { grid-template-columns: 1fr; }
  .controls-panel { position: static; max-height: none; }
}
</style>

