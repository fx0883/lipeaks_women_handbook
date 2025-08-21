<template>
  <!-- Konva画布组件 -->
  <div class="konva-canvas-container" :style="containerStyle">
    <!-- 画布舞台 -->
    <v-stage 
      :config="stageConfig" 
      ref="stageRef"
      @click="onStageClick"
      @tap="onStageTap"
    >
      <!-- 背景图层 -->
      <v-layer>
        <!-- 背景图片 -->
        <v-image 
          v-if="backgroundImage" 
          :config="backgroundConfig" 
          @load="onBackgroundLoad"
          @error="onBackgroundError"
        />
        
        <!-- 背景色 -->
        <v-rect 
          v-if="!backgroundImage"
          :config="backgroundRectConfig"
        />
      </v-layer>
      
      <!-- 内容图层 -->
      <v-layer>
        <!-- 标题文字 -->
        <v-text 
          v-if="titleText" 
          :config="titleConfig" 
          :draggable="!previewMode"
          :selectable="!previewMode"
          @dragstart="onTextDragStart"
          @dragend="onTextDragEnd"
          @transform="onTextTransform"
          @click="onTextClick"
        />
        
        <!-- 副标题文字 -->
        <v-text 
          v-if="subtitleText" 
          :config="subtitleConfig" 
          :draggable="!previewMode"
          :selectable="!previewMode"
          @dragstart="onTextDragStart"
          @dragend="onTextDragEnd"
          @transform="onTextTransform"
          @click="onTextClick"
        />
        
        <!-- 贴纸图层 -->
        <v-image 
          v-for="sticker in stickers" 
          :key="sticker.id" 
          :config="{ ...sticker.config, id: sticker.id }"
          :draggable="!previewMode"
          :selectable="!previewMode"
          @dragstart="onStickerDragStart"
          @dragend="onStickerDragEnd"
          @transform="onStickerTransform"
          @click="onStickerClick"
        />
      </v-layer>
      
      <!-- 选择变换器图层 -->
      <v-layer v-if="!previewMode">
        <!-- 选择变换器 -->
        <v-transformer 
          ref="transformerRef"
          :config="transformerConfig"
          @transform="onTransform"
        />
      </v-layer>
    </v-stage>
    
    <!-- 加载状态指示器 -->
    <div v-if="isLoading" class="loading-indicator">
      <div class="loading-spinner"></div>
      <span>加载中...</span>
    </div>
    
    <!-- 错误状态指示器 -->
    <div v-if="hasError" class="error-indicator">
      <span>⚠️ 加载失败，请重试</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import type { 
  KonvaStageConfig, 
  KonvaImageConfig, 
  KonvaTextConfig, 
  KonvaSticker, 
  KonvaTransformerConfig,
  KonvaCanvasState,
  KonvaCanvasEvents
} from '@/types/konva'

// vue-konva组件导入
// 注意：vue-konva v3使用默认导入方式
import VueKonva from 'vue-konva'

// Props定义
interface Props {
  /** 画布宽度 */
  width: number
  /** 画布高度 */
  height: number
  /** 背景图片URL */
  backgroundUrl?: string
  /** 标题文字 */
  titleText?: string
  /** 副标题文字 */
  subtitleText?: string
  /** 标题字号 */
  titleFontSize?: number
  /** 副标题字号 */
  subtitleFontSize?: number
  /** 文字颜色（标题/副标题共用） */
  textColor?: string
  /** 文字对齐（标题/副标题共用） */
  textAlign?: 'left' | 'center' | 'right'
  /** 字体族（标题/副标题共用） */
  fontFamily?: string
  /** 预览模式 */
  previewMode?: boolean
  /** 画布比例 */
  ratio?: string
  /** 性能配置 */
  performance?: {
    enableCache?: boolean
    batchUpdate?: boolean
  }
}

const props = withDefaults(defineProps<Props>(), {
  previewMode: false,
  ratio: '4:5',
  titleFontSize: 24,
  subtitleFontSize: 18,
  textColor: '#333333',
  textAlign: 'center' as const,
  fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial',
  performance: () => ({
    enableCache: true,
    batchUpdate: true
  })
})

// Emits定义
const emit = defineEmits<KonvaCanvasEvents>()

// 组件引用
const stageRef = ref<any>()
const transformerRef = ref<any>()

// 画布状态
const isLoading = ref(false)
const hasError = ref(false)
const backgroundImage = ref<HTMLImageElement | null>(null)
const selectedElement = ref<any>(null)

// 文字覆盖（仅对选中的文字生效）
const titleOverride = ref<Partial<KonvaTextConfig>>({})
const subtitleOverride = ref<Partial<KonvaTextConfig>>({})

// 画布配置
const stageConfig = computed<KonvaStageConfig>(() => ({
  width: props.width,
  height: props.height
}))

// 容器样式
const containerStyle = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
  position: 'relative' as const,
  overflow: 'hidden',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
}))

// 背景矩形配置
const backgroundRectConfig = computed(() => ({
  x: 0,
  y: 0,
  width: props.width,
  height: props.height,
  fill: '#ffffff'
}))

// 背景图配置
const backgroundConfig = computed<KonvaImageConfig>(() => ({
  image: backgroundImage.value,
  x: 0,
  y: 0,
  width: props.width,
  height: props.height,
  draggable: false,
  selectable: false
}))

// 标题配置
const titleConfig = computed<KonvaTextConfig>(() => ({
  text: props.titleText || '',
  x: 0,
  y: props.height / 2 - 30,
  width: props.width,
  fontSize: props.titleFontSize,
  fontFamily: props.fontFamily,
  fill: props.textColor,
  align: props.textAlign,
  draggable: !props.previewMode,
  selectable: !props.previewMode,
  fontWeight: 'bold'
  ,
  ...titleOverride.value
}))

// 副标题配置
const subtitleConfig = computed<KonvaTextConfig>(() => ({
  text: props.subtitleText || '',
  x: 0,
  y: props.height / 2 + 20,
  width: props.width,
  fontSize: props.subtitleFontSize,
  fontFamily: props.fontFamily,
  fill: props.textColor,
  align: props.textAlign,
  draggable: !props.previewMode,
  selectable: !props.previewMode
  ,
  ...subtitleOverride.value
}))

// 选择变换器配置
const transformerConfig = computed<KonvaTransformerConfig>(() => ({
  enabled: !props.previewMode,
  boundBoxFunc: (oldBox: any, newBox: any) => {
    // 限制变换范围，防止元素超出画布
    const maxWidth = props.width
    const maxHeight = props.height
    
    if (newBox.width > maxWidth) {
      newBox.width = maxWidth
    }
    if (newBox.height > maxHeight) {
      newBox.height = maxHeight
    }
    
    return newBox
  },
  keepRatio: false,
  rotateEnabled: true,
  resizeEnabled: true,
  anchorSize: 8,
  anchorFill: '#ffffff',
  anchorStroke: '#007bff',
  anchorStrokeWidth: 2,
  borderStroke: '#007bff',
  borderStrokeWidth: 2
}))

// 贴纸管理
const stickers = ref<KonvaSticker[]>([])

// 背景图加载
const loadBackgroundImage = async (url: string): Promise<void> => {
  if (!url) {
    backgroundImage.value = null
    return
  }
  
  try {
    isLoading.value = true
    hasError.value = false
    
    const image = new Image()
    image.crossOrigin = 'anonymous'
    
    await new Promise<void>((resolve, reject) => {
      image.onload = () => {
        backgroundImage.value = image
        // 明确通知父组件背景加载完成，避免依赖 v-image @load
        emit('background-load', true)
        resolve()
      }
      image.onerror = () => {
        emit('background-load', false)
        reject(new Error('背景图片加载失败'))
      }
      image.src = url
    })
    
    console.log('✅ 背景图片加载成功:', url)
  } catch (error) {
    console.error('❌ 背景图片加载失败:', error)
    hasError.value = true
    backgroundImage.value = null
  } finally {
    isLoading.value = false
  }
}

// 背景图加载完成事件
const onBackgroundLoad = () => {
  console.log('背景图片加载完成')
  // 二次确认图片对象尺寸，避免占位层干扰
  if (backgroundImage.value) {
    const img = backgroundImage.value as HTMLImageElement
    const w = img.naturalWidth || img.width
    const h = img.naturalHeight || img.height
    console.log('背景尺寸:', w, h)
  }
  emit('background-load', true)
}

// 背景图加载错误事件
const onBackgroundError = () => {
  console.error('背景图片加载错误')
  hasError.value = true
  emit('background-load', false)
}

// 舞台点击事件
const onStageClick = (e: any) => {
  // 点击空白区域时取消选择
  if (e.target === e.target.getStage()) {
    selectedElement.value = null
    const transformer = transformerRef.value?.getNode?.()
    if (transformer && typeof transformer.nodes === 'function') {
      transformer.nodes([])
    }
  }
}

// 舞台触摸事件
const onStageTap = (e: any) => {
  onStageClick(e)
}

// 文字拖拽开始
const onTextDragStart = (e: any) => {
  console.log('文字拖拽开始:', e.target.text())
}

// 文字拖拽结束
const onTextDragEnd = (e: any) => {
  const text = e.target
  console.log('文字拖拽结束:', {
    text: text.text(),
    position: { x: text.x(), y: text.y() }
  })
  
  // 更新文字位置
  if (text.text() === props.titleText) {
    emit('canvas-change', getCanvasState())
  } else if (text.text() === props.subtitleText) {
    emit('canvas-change', getCanvasState())
  }
}

// 文字变换事件
const onTextTransform = (e: any) => {
  const text = e.target
  console.log('文字变换:', {
    text: text.text(),
    scale: { x: text.scaleX(), y: text.scaleY() },
    rotation: text.rotation()
  })
  
  emit('element-transform', text, {
    scale: { x: text.scaleX(), y: text.scaleY() },
    rotation: text.rotation()
  })
}

// 文字点击：选中并挂载变换器
const onTextClick = (e: any) => {
  const node = e.target
  selectedElement.value = node
  if (!props.previewMode) {
    const transformer = transformerRef.value?.getNode?.()
    if (transformer && typeof transformer.nodes === 'function') {
      transformer.nodes([node])
    }
  }
  emit('element-select', node)
}

// 贴纸拖拽开始
const onStickerDragStart = (e: any) => {
  console.log('贴纸拖拽开始:', e.target)
}

// 贴纸拖拽结束
const onStickerDragEnd = (e: any) => {
  const sticker = e.target
  console.log('贴纸拖拽结束:', {
    id: sticker.id(),
    position: { x: sticker.x(), y: sticker.y() }
  })
  
  // 更新贴纸位置
  updateStickerPosition(sticker.id(), { x: sticker.x(), y: sticker.y() })
  emit('sticker-update', stickers.value)
}

// 贴纸变换事件
const onStickerTransform = (e: any) => {
  const sticker = e.target
  console.log('贴纸变换:', {
    id: sticker.id(),
    scale: { x: sticker.scaleX(), y: sticker.scaleY() },
    rotation: sticker.rotation()
  })
  
  // 更新贴纸变换
  updateStickerTransform(sticker.id(), {
    scale: { x: sticker.scaleX(), y: sticker.scaleY() },
    rotation: sticker.rotation()
  })
  
  emit('element-transform', sticker, {
    scale: { x: sticker.scaleX(), y: sticker.scaleY() },
    rotation: sticker.rotation()
  })
}

// 贴纸点击事件
const onStickerClick = (e: any) => {
  const sticker = e.target
  selectedElement.value = sticker
  
  // 设置选择变换器
  if (!props.previewMode) {
    const transformer = transformerRef.value?.getNode?.()
    if (transformer && typeof transformer.nodes === 'function') {
      transformer.nodes([sticker])
    }
  }
  
  emit('element-select', sticker)
}

// 变换事件
const onTransform = (e: any) => {
  const node = e.target
  console.log('元素变换:', {
    id: node.id(),
    scale: { x: node.scaleX(), y: node.scaleY() },
    rotation: node.rotation()
  })
  
  emit('element-transform', node, {
    scale: { x: node.scaleX(), y: node.scaleY() },
    rotation: node.rotation()
  })
}

// 更新贴纸位置
const updateStickerPosition = (id: string, position: { x: number; y: number }) => {
  const sticker = stickers.value.find(s => s.id === id)
  if (sticker) {
    sticker.config.x = position.x
    sticker.config.y = position.y
  }
}

// 更新贴纸变换
const updateStickerTransform = (id: string, transform: { scale: { x: number; y: number }; rotation: number }) => {
  const sticker = stickers.value.find(s => s.id === id)
  if (sticker) {
    sticker.config.scaleX = transform.scale.x
    sticker.config.scaleY = transform.scale.y
    sticker.config.rotation = transform.rotation
  }
}

// 获取画布状态
const getCanvasState = (): KonvaCanvasState => {
  return {
    backgroundImage: backgroundImage.value ? {
      image: backgroundImage.value,
      x: 0,
      y: 0,
      width: props.width,
      height: props.height
    } : null,
    titleText: props.titleText ? {
      text: props.titleText,
      x: props.width / 2,
      y: props.height / 2 - 30,
      fontSize: 24,
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial',
      fill: '#333333',
      align: 'center'
    } : null,
    subtitleText: props.subtitleText ? {
      text: props.subtitleText,
      x: props.width / 2,
      y: props.height / 2 + 20,
      fontSize: 18,
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial',
      fill: '#666666',
      align: 'center'
    } : null,
    stickers: stickers.value,
    dimensions: {
      width: props.width,
      height: props.height
    },
    scale: { x: 1, y: 1 },
    position: { x: 0, y: 0 }
  }
}

// 公共方法
const addSticker = (stickerData: KonvaSticker): void => {
  try {
    console.log('添加贴纸:', stickerData)
    stickers.value.push(stickerData)
    emit('sticker-update', stickers.value)
    emit('canvas-change', getCanvasState())
  } catch (error) {
    console.error('添加贴纸失败:', error)
  }
}

const removeSticker = (id: string): void => {
  try {
    console.log('移除贴纸:', id)
    const index = stickers.value.findIndex(s => s.id === id)
    if (index > -1) {
      stickers.value.splice(index, 1)
      // 如果当前选中的是被删除的贴纸，清空选择与变换器
      if (selectedElement.value && selectedElement.value.id && selectedElement.value.id() === id) {
        selectedElement.value = null
        const transformer = transformerRef.value?.getNode?.()
        if (transformer && typeof transformer.nodes === 'function') {
          transformer.nodes([])
        }
      }
      emit('sticker-update', stickers.value)
      emit('canvas-change', getCanvasState())
    }
  } catch (error) {
    console.error('移除贴纸失败:', error)
  }
}

const updateSticker = (id: string, config: Partial<KonvaImageConfig>): void => {
  try {
    console.log('更新贴纸:', id, config)
    const sticker = stickers.value.find(s => s.id === id)
    if (sticker) {
      Object.assign(sticker.config, config)
      emit('sticker-update', stickers.value)
      emit('canvas-change', getCanvasState())
    }
  } catch (error) {
    console.error('更新贴纸失败:', error)
  }
}

const setBackgroundImage = (image: HTMLImageElement | string): void => {
  if (typeof image === 'string') {
    loadBackgroundImage(image)
  } else {
    backgroundImage.value = image
  }
}

const updateText = (type: 'title' | 'subtitle', config: Partial<KonvaTextConfig>): void => {
  try {
    console.log('更新文字:', type, config)
    if (type === 'title') {
      titleOverride.value = { ...titleOverride.value, ...config }
    } else if (type === 'subtitle') {
      subtitleOverride.value = { ...subtitleOverride.value, ...config }
    }
    emit('canvas-change', getCanvasState())
  } catch (error) {
    console.error('更新文字失败:', error)
  }
}

// 仅更新当前选中的文字
const updateSelectedText = (config: Partial<KonvaTextConfig>): void => {
  try {
    const node = selectedElement.value
    if (!node || typeof node.text !== 'function') return
    const txt = node.text()
    if (txt === (props.titleText || '')) {
      titleOverride.value = { ...titleOverride.value, ...config }
    } else if (txt === (props.subtitleText || '')) {
      subtitleOverride.value = { ...subtitleOverride.value, ...config }
    }
    emit('canvas-change', getCanvasState())
  } catch (error) {
    console.error('更新选中文本失败:', error)
  }
}

const exportCanvas = (format: 'png' | 'jpg' = 'png', quality: number = 0.9): string | null => {
  try {
    if (stageRef.value) {
      const stage = stageRef.value.getNode()
      if (format === 'jpg') {
        return stage.toDataURL({
          mimeType: 'image/jpeg',
          quality: quality
        })
      } else {
        return stage.toDataURL({
          mimeType: 'image/png'
        })
      }
    }
    return null
  } catch (error) {
    console.error('导出画布失败:', error)
    return null
  }
}

const clearCanvas = (): void => {
  try {
    console.log('清空画布')
    stickers.value = []
    emit('sticker-update', stickers.value)
    emit('canvas-change', getCanvasState())
  } catch (error) {
    console.error('清空画布失败:', error)
  }
}

const resetCanvas = (): void => {
  try {
    console.log('重置画布')
    clearCanvas()
    backgroundImage.value = null
    hasError.value = false
    emit('canvas-change', getCanvasState())
  } catch (error) {
    console.error('重置画布失败:', error)
  }
}

// 监听背景URL变化
watch(() => props.backgroundUrl, (newUrl) => {
  if (newUrl) {
    loadBackgroundImage(newUrl)
  }
}, { immediate: true })

// 监听画布尺寸变化
watch([() => props.width, () => props.height], () => {
  console.log('画布尺寸变化:', { width: props.width, height: props.height })
  emit('canvas-resize', { width: props.width, height: props.height })
})

// 组件挂载
onMounted(async () => {
  console.log('KonvaCanvas组件挂载完成')
  await nextTick()
  
  // 初始化选择变换器
  if (!props.previewMode) {
    const transformer = transformerRef.value?.getNode?.()
    if (transformer && typeof transformer.nodes === 'function') {
      transformer.nodes([])
    }
  }
})

// 组件卸载
onUnmounted(() => {
  console.log('KonvaCanvas组件卸载')
  // 清理资源
  backgroundImage.value = null
  stickers.value = []
})

// 暴露方法给父组件
defineExpose({
  addSticker,
  removeSticker,
  updateSticker,
  setBackgroundImage,
  updateText,
  updateSelectedText,
  exportCanvas,
  clearCanvas,
  resetCanvas,
  getCanvasState
})
</script>

<style scoped>
.konva-canvas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #e0e0e0;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #dc3545;
  font-size: 14px;
  text-align: center;
  padding: 16px;
  background: rgba(220, 53, 69, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(220, 53, 69, 0.2);
}
</style>
