<template>
  <div class="editor-page">
    <div class="editor-container" v-if="hasTemplateId">
      <!-- 左侧：预览区域（按原型） -->
      <div class="preview-area">
        <div class="preview-header">
          <h2>预览</h2>
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
              v-if="currentBackgroundUrl && !isCanvasReady"
              class="canvas-preview"
              :src="currentBackgroundUrl"
              :alt="resolvedTemplateName"
            />
            <div v-if="!currentBackgroundUrl && !isCanvasReady" class="canvas-empty">空白画布</div>
            <canvas ref="fabricCanvasEl" v-show="isCanvasReady"></canvas>

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
          <button class="btn primary" @click="exportProject">导出</button>
        </div>

        <!-- 次级操作：替换/添加/尺寸 -->
        <div class="preview-actions">
          <button class="btn ghost" @click="triggerReplace">替换图片</button>
          <button class="btn ghost" @click="triggerAddImage">添加图片</button>
          <button class="btn ghost" @click="cycleAspectRatio">调整尺寸</button>
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

let fabricNS: any = null
async function getFabric() {
  if (fabricNS) return fabricNS
  const mod: any = await import('fabric')
  fabricNS = mod?.fabric || mod
  return fabricNS
}

const route = useRoute()
const router = useRouter()

// 模板信息
const templateId = computed(() => (route.params.id as string) || '')
const hasTemplateId = computed(() => !!templateId.value)

const templateMetaMap: Record<string, { name: string; ratio: string; preview: string }> = {
  'campus-collage': { name: '校园日常拼贴', ratio: '4:5', preview: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=1200&q=80' },
  'club-poster': { name: '社团招新海报', ratio: '9:16', preview: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&q=80' },
  'citywalk': { name: 'Citywalk/旅行', ratio: '9:16', preview: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=1200&q=80' },
  'dorm-food': { name: '宿舍日常/美食', ratio: '1:1', preview: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=1200&q=80' },
  'exam-countdown': { name: '学习计划表', ratio: '4:5', preview: 'https://images.unsplash.com/photo-1553729784-e91953dec042?w=1200&q=80' }
}

const resolvedTemplateName = computed(() => templateMetaMap[templateId.value]?.name || '编辑器')
const templateRatio = ref(templateMetaMap[templateId.value]?.ratio || '4:5')
watch(templateId, (v) => { templateRatio.value = templateMetaMap[v]?.ratio || '4:5' })

const defaultPreviewUrl = computed(() => templateMetaMap[templateId.value]?.preview || '')
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
let canvas: any | null = null

// 预览覆盖文本（按原型）
const titleText = ref('我的美好时光')
const subtitleText = ref('记录生活中的小确幸')
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
    isCanvasReady.value = false
    await nextTick()
    const f = await getFabric()
    if (!fabricCanvasEl.value) return

    canvas = new f.Canvas(fabricCanvasEl.value, {
      selection: !previewMode.value,
      preserveObjectStacking: true,
      backgroundColor: '#ffffff'
    })
    resizeCanvas()

    // 背景图
    const preview = currentBackgroundUrl.value
    if (preview) {
      try {
        f.Image.fromURL(preview, (img: any) => {
          if (!canvas) return
          fitBackground(img, canvas.getWidth(), canvas.getHeight())
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas))
        }, { crossOrigin: 'anonymous' })
      } catch (err) {
        console.warn('背景图加载失败，已忽略', err)
      }
    }

    isCanvasReady.value = true
    canvas.renderAll()
  } catch (e) {
    console.error('初始化画布失败', e)
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
  if (!canvas) return
  const f = await getFabric()
  f.Image.fromURL(sticker.url, (img: any) => {
    const targetWidth = Math.min(160, canvas!.getWidth() * 0.25)
    const scale = targetWidth / img.width!
    img.set({ left: canvas!.getWidth() / 2, top: canvas!.getHeight() / 2, originX: 'center', originY: 'center', scaleX: scale, scaleY: scale })
    canvas!.add(img)
    canvas!.setActiveObject(img)
    canvas!.renderAll()
  }, { crossOrigin: 'anonymous' })
}

// 滤镜选择（CSS 视觉）
function selectFilter(id: 'origin' | 'cream' | 'film' | 'clean' | 'bw' | 'warm') {
  selectedFilter.value = id
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
function triggerReplace() { bgFileInput.value?.click() }
function triggerAddImage() { fgFileInput.value?.click() }
function onPickBackground(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = async () => {
    customBackgroundUrl.value = String(reader.result || '')
    if (canvas) {
      const f = await getFabric()
      f.Image.fromURL(customBackgroundUrl.value, (img: any) => {
        if (!canvas) return
        fitBackground(img, canvas.getWidth(), canvas.getHeight())
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas))
      })
    }
  }
  reader.readAsDataURL(file)
}
function onPickForeground(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = async () => {
    if (!canvas) return
    const f = await getFabric()
    f.Image.fromURL(String(reader.result || ''), (img: any) => {
      const targetWidth = Math.min(200, canvas!.getWidth() * 0.3)
      const scale = targetWidth / img.width!
      img.set({ left: canvas!.getWidth() / 2, top: canvas!.getHeight() / 2, originX: 'center', originY: 'center', scaleX: scale, scaleY: scale })
      canvas!.add(img)
      canvas!.renderAll()
    })
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

// 导出项目（占位）
const exportProject = (): void => { router.push('/export') }

// 快速开始（无 id）
const quickStart = (): void => { router.push('/editor/quick-start') }

onMounted(() => {
  if (hasTemplateId.value) {
    initCanvas()
    window.addEventListener('resize', resizeCanvas)
  }
})

watch([templateId], async () => {
  if (canvas) { canvas.dispose(); canvas = null }
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

/* 响应式 */
@media (max-width: 1024px) {
  .editor-container { grid-template-columns: 1fr; }
  .controls-panel { position: static; max-height: none; }
}
</style>
