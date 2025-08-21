# Fabric.js 到 Konva.js + vue-konva 迁移计划

## 📋 项目概述

**目标**：将"出片手账"应用从Fabric.js迁移到Konva.js + vue-konva，解决当前Fabric.js v6兼容性问题，提升应用稳定性和开发体验。

**迁移范围**：仅限画布相关功能，保持其他业务逻辑和UI组件不变。

**预期收益**：
- 解决Fabric.js v6兼容性问题
- 提升与Vue生态的集成度
- 改善TypeScript类型支持
- 增强画布性能稳定性

## 🔍 当前代码分析

### 受影响的文件清单

#### 1. 核心画布文件
- `src/views/Editor.vue` - 主要编辑器页面，包含Fabric.js画布逻辑
- `src/utils/canvas-export.ts` - 画布导出工具，依赖Fabric.js

#### 2. 间接依赖文件
- `src/views/Export.vue` - 导出页面，调用canvas-export工具
- `src/types/project.ts` - 项目类型定义（无需修改）
- `src/stores/project.ts` - 项目状态管理（无需修改）

### 当前Fabric.js使用情况分析

#### Editor.vue中的Fabric.js使用
```typescript
// 动态导入Fabric.js
let fabricNS: any = null
async function getFabric() {
  if (fabricNS) return fabricNS
  const mod: any = await import('fabric')
  // 复杂的模块结构判断逻辑
  if (mod?.fabric) {
    fabricNS = mod.fabric
  } else if (mod?.default) {
    fabricNS = mod.default
  } else if (mod?.Canvas) {
    fabricNS = mod
  }
  return fabricNS
}

// Canvas创建和管理
let canvas: any | null = null
canvas = new f.Canvas(fabricCanvasEl.value, {
  selection: !previewMode.value,
  preserveObjectStacking: true,
  backgroundColor: '#ffffff'
})

// 背景图设置
canvas.setBackgroundImage(fabricImg, () => {
  canvas.renderAll()
  resolve()
})

// 贴纸添加
const fabricImg = new f.Image(img)
canvas.add(img)
canvas.setActiveObject(img)
```

#### canvas-export.ts中的Fabric.js使用
```typescript
// 导出时重建画布
const canvas = new f.Canvas(null, {
  width: size.width,
  height: size.height,
  backgroundColor: '#ffffff'
})

// 添加元素到导出画布
canvas.setBackgroundImage(img, () => {
  canvas.renderAll()
  resolve()
})
canvas.add(titleText)
canvas.add(subtitleText)
```

### 核心功能映射分析

| 功能 | Fabric.js实现 | Konva.js实现 | 迁移复杂度 |
|------|---------------|---------------|------------|
| 画布创建 | `new fabric.Canvas()` | `<v-stage>` | 低 |
| 背景图 | `setBackgroundImage()` | `<v-image>` | 低 |
| 文字渲染 | `new fabric.Text()` | `<v-text>` | 低 |
| 图片添加 | `new fabric.Image()` | `<v-image>` | 低 |
| 画布尺寸 | `setWidth/setHeight` | `:config` | 低 |
| 渲染更新 | `renderAll()` | 自动响应式 | 低 |
| 选择交互 | `selection` | `<v-transformer>` | 中 |
| 导出功能 | `toBlob()` | `toDataURL()` | 中 |

## 🚀 迁移实施计划

### 第一阶段：环境准备和依赖安装

#### 1.1 安装新依赖
```bash
# 卸载Fabric.js
npm uninstall fabric

# 安装Konva.js和vue-konva
npm install konva vue-konva
npm install -D @types/konva
```

#### 1.2 更新package.json
```json
{
  "dependencies": {
    "konva": "^9.3.0",
    "vue-konva": "^3.0.0"
  },
  "devDependencies": {
    "@types/konva": "^9.3.0"
  }
}
```

### 第二阶段：核心画布组件重构

#### 2.1 创建Konva画布组件
**文件**：`src/components/editor/KonvaCanvas.vue`

```vue
<template>
  <v-stage :config="stageConfig" ref="stageRef">
    <v-layer>
      <!-- 背景图层 -->
      <v-image 
        v-if="backgroundImage" 
        :config="backgroundConfig" 
        @load="onBackgroundLoad"
      />
      
      <!-- 文字图层 -->
      <v-text 
        v-if="titleText" 
        :config="titleConfig" 
        :draggable="!previewMode"
      />
      <v-text 
        v-if="subtitleText" 
        :config="subtitleConfig" 
        :draggable="!previewMode"
      />
      
      <!-- 贴纸图层 -->
      <v-image 
        v-for="sticker in stickers" 
        :key="sticker.id" 
        :config="sticker.config"
        :draggable="!previewMode"
        @dragend="onStickerDragEnd"
      />
      
      <!-- 选择变换器 -->
      <v-transformer 
        v-if="!previewMode"
        :config="transformerConfig"
        @transform="onTransform"
      />
    </v-layer>
  </v-stage>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Stage, Layer, Image, Text, Transformer } from 'vue-konva'

// Props定义
interface Props {
  width: number
  height: number
  backgroundUrl?: string
  titleText?: string
  subtitleText?: string
  previewMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  previewMode: false
})

// Emits定义
const emit = defineEmits<{
  'background-load': [success: boolean]
  'sticker-update': [stickers: any[]]
}>()

// 组件引用
const stageRef = ref<any>()
const stage = computed(() => stageRef.value?.getNode())

// 画布配置
const stageConfig = computed(() => ({
  width: props.width,
  height: props.height
}))

// 背景图配置
const backgroundConfig = computed(() => ({
  image: backgroundImage.value,
  x: 0,
  y: 0,
  width: props.width,
  height: props.height
}))

// 标题配置
const titleConfig = computed(() => ({
  text: props.titleText,
  x: props.width / 2,
  y: props.height / 2 - 30,
  fontSize: 24,
  fontFamily: 'Arial',
  fill: '#333333',
  align: 'center',
  draggable: !props.previewMode
}))

// 副标题配置
const subtitleConfig = computed(() => ({
  text: props.subtitleText,
  x: props.width / 2,
  y: props.height / 2 + 20,
  fontSize: 18,
  fontFamily: 'Arial',
  fill: '#333333',
  align: 'center',
  draggable: !props.previewMode
}))

// 选择变换器配置
const transformerConfig = computed(() => ({
  boundBoxFunc: (oldBox: any, newBox: any) => {
    // 限制变换范围
    return newBox
  }
}))

// 背景图加载
const backgroundImage = ref<HTMLImageElement | null>(null)

const onBackgroundLoad = () => {
  emit('background-load', true)
}

// 贴纸管理
const stickers = ref<any[]>([])

const onStickerDragEnd = (e: any) => {
  const sticker = e.target
  // 更新贴纸位置
  emit('sticker-update', stickers.value)
}

const onTransform = (e: any) => {
  const node = e.target
  // 处理变换事件
}

// 公共方法
const addSticker = (stickerData: any) => {
  // 添加贴纸逻辑
}

const removeSticker = (id: string) => {
  // 移除贴纸逻辑
}

const exportCanvas = () => {
  if (stage.value) {
    return stage.value.toDataURL()
  }
  return null
}

// 暴露方法给父组件
defineExpose({
  addSticker,
  removeSticker,
  exportCanvas
})
</script>
```

#### 2.2 重构Editor.vue画布部分
**修改范围**：仅限画布相关代码，保持其他UI和业务逻辑不变

```vue
<!-- 替换原有的Fabric.js Canvas -->
<KonvaCanvas
  ref="konvaCanvasRef"
  :width="canvasWidth"
  :height="canvasHeight"
  :background-url="currentBackgroundUrl"
  :title-text="titleText"
  :subtitle-text="subtitleText"
  :preview-mode="previewMode"
  @background-load="onBackgroundLoad"
  @sticker-update="onStickerUpdate"
/>
```

**需要修改的方法**：
```typescript
// 替换initCanvas方法
const initCanvas = async (): Promise<void> => {
  try {
    console.log('开始初始化Konva画布...')
    isCanvasReady.value = false
    isCanvasInitializing.value = true
    
    // Konva画布通过组件自动初始化，无需手动创建
    await nextTick()
    
    console.log('Konva画布初始化完成')
    isCanvasReady.value = true
    isCanvasInitializing.value = false
    
  } catch (e) {
    console.error('初始化画布失败', e)
    isCanvasReady.value = true
    isCanvasInitializing.value = false
  }
}

// 替换resizeCanvas方法
const resizeCanvas = () => {
  // Konva画布会自动响应尺寸变化，无需手动处理
  console.log('画布尺寸已更新')
}

// 替换addSticker方法
const addSticker = async (sticker: any): Promise<void> => {
  if (!konvaCanvasRef.value) {
    alert('画布未初始化，请稍后再试')
    return
  }
  
  try {
    konvaCanvasRef.value.addSticker(sticker)
    console.log('贴纸添加成功')
  } catch (error) {
    console.error('添加贴纸失败:', error)
    alert('添加贴纸失败，请重试')
  }
}
```

### 第三阶段：导出功能重构

#### 3.1 重构canvas-export.ts
**文件**：`src/utils/konva-export.ts`

```typescript
import type { Project } from '@/types/project'

// 导出画布为图片
export const exportCanvas = async (
  project: Project,
  format: 'png' | 'jpg',
  size: { width: number; height: number },
  quality: number = 0.9
): Promise<Blob> => {
  // 创建临时Konva画布
  const stage = new Konva.Stage({
    container: 'temp-container',
    width: size.width,
    height: size.height
  })
  
  const layer = new Konva.Layer()
  stage.add(layer)
  
  try {
    // 重建画布内容
    await rebuildKonvaCanvas(stage, project, size)
    
    // 导出为Blob
    return new Promise((resolve, reject) => {
      stage.toBlob({
        callback: (blob: Blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('导出失败'))
          }
        },
        mimeType: format === 'jpg' ? 'image/jpeg' : 'image/png',
        quality: format === 'jpg' ? quality : undefined
      })
    })
  } finally {
    // 清理画布
    stage.destroy()
  }
}

// 重建Konva画布内容
const rebuildKonvaCanvas = async (
  stage: Konva.Stage,
  project: Project,
  size: { width: number; height: number }
): Promise<void> => {
  const layer = stage.findOne('Layer')
  
  // 1. 设置背景图片
  if (project.thumbnail) {
    try {
      const image = new Image()
      await new Promise<void>((resolve, reject) => {
        image.onload = () => {
          const konvaImage = new Konva.Image({
            image: image,
            x: 0,
            y: 0,
            width: size.width,
            height: size.height
          })
          layer.add(konvaImage)
          resolve()
        }
        image.onerror = reject
        image.src = project.thumbnail
      })
    } catch (error) {
      console.warn('背景图片加载失败:', error)
    }
  }
  
  // 2. 添加文字
  if (project.content.title || project.content.subtitle) {
    addTextToKonvaCanvas(layer, project.content, size)
  }
  
  // 3. 添加贴纸
  if (project.content.stickers && project.content.stickers.length > 0) {
    addStickersToKonvaCanvas(layer, project.content.stickers, size)
  }
  
  // 4. 应用边框
  if (project.content.borderStyle && project.content.borderStyle !== 'none') {
    applyBorderToKonvaCanvas(layer, project.content, size)
  }
  
  layer.draw()
}

// 添加文字到Konva画布
const addTextToKonvaCanvas = (
  layer: Konva.Layer,
  content: Project['content'],
  size: { width: number; height: number }
): void => {
  // 标题
  if (content.title) {
    const titleText = new Konva.Text({
      text: content.title,
      x: size.width / 2,
      y: size.height / 2 - 30,
      fontSize: content.fontSize || 24,
      fontFamily: getFontFamily(content.fontStyle),
      fill: content.colors?.text || '#333333',
      align: content.textAlign || 'center'
    })
    titleText.offsetX(titleText.width() / 2)
    titleText.offsetY(titleText.height() / 2)
    layer.add(titleText)
  }
  
  // 副标题
  if (content.subtitle) {
    const subtitleText = new Konva.Text({
      text: content.subtitle,
      x: size.width / 2,
      y: size.height / 2 + 20,
      fontSize: Math.round((content.fontSize || 24) * 0.75),
      fontFamily: getFontFamily(content.fontStyle),
      fill: content.colors?.text || '#333333',
      align: content.textAlign || 'center'
    })
    subtitleText.offsetX(subtitleText.width() / 2)
    subtitleText.offsetY(subtitleText.height() / 2)
    layer.add(subtitleText)
  }
}

// 获取字体族（保持原有逻辑）
const getFontFamily = (fontStyle?: string): string => {
  switch (fontStyle) {
    case 'rounded':
      return '"Arial Rounded MT Bold", ui-rounded, system-ui, sans-serif'
    case 'hand':
      return 'KaiTi, STKaiti, "DFKai-SB", cursive'
    case 'serif':
      return 'ui-serif, STSong, SimSun, serif'
    default:
      return 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial'
  }
}

// 添加贴纸到Konva画布
const addStickersToKonvaCanvas = async (
  layer: Konva.Layer,
  stickers: string[],
  size: { width: number; height: number }
): Promise<void> => {
  for (const stickerUrl of stickers) {
    try {
      const image = new Image()
      await new Promise<void>((resolve, reject) => {
        image.onload = () => {
          const targetWidth = Math.min(160, size.width * 0.25)
          const scale = targetWidth / image.width
          
          const konvaImage = new Konva.Image({
            image: image,
            x: size.width / 2,
            y: size.height / 2,
            width: image.width * scale,
            height: image.height * scale
          })
          konvaImage.offsetX(konvaImage.width() / 2)
          konvaImage.offsetY(konvaImage.height() / 2)
          layer.add(konvaImage)
          resolve()
        }
        image.onerror = reject
        image.src = stickerUrl
      })
    } catch (error) {
      console.warn('贴纸加载失败:', error)
    }
  }
}

// 应用边框到Konva画布
const applyBorderToKonvaCanvas = (
  layer: Konva.Layer,
  content: Project['content'],
  size: { width: number; height: number }
): void => {
  if (content.borderStyle && content.borderStyle !== 'none' && content.borderWidth && content.borderWidth > 0) {
    const borderRect = new Konva.Rect({
      x: content.borderWidth! / 2,
      y: content.borderWidth! / 2,
      width: size.width - content.borderWidth!,
      height: size.height - content.borderWidth!,
      fill: 'transparent',
      stroke: content.borderColor || '#000000',
      strokeWidth: content.borderWidth,
      dash: getBorderDashArray(content.borderStyle),
      cornerRadius: content.borderRadius || 0
    })
    layer.add(borderRect)
  }
}

// 获取边框虚线样式
const getBorderDashArray = (borderStyle: string): number[] | undefined => {
  switch (borderStyle) {
    case 'dashed':
      return [10, 5]
    case 'dotted':
      return [2, 2]
    default:
      return undefined
  }
}

// 下载图片（保持原有逻辑）
export const downloadImage = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
```

#### 3.2 更新Export.vue导入
```typescript
// 替换导入
import { exportCanvas, downloadImage } from '@/utils/konva-export'
```

### 第四阶段：类型定义和接口适配

#### 4.1 创建Konva相关类型
**文件**：`src/types/konva.ts`

```typescript
// Konva画布配置类型
export interface KonvaStageConfig {
  width: number
  height: number
  x?: number
  y?: number
}

// Konva图片配置类型
export interface KonvaImageConfig {
  image: HTMLImageElement | null
  x: number
  y: number
  width: number
  height: number
  draggable?: boolean
  selectable?: boolean
}

// Konva文字配置类型
export interface KonvaTextConfig {
  text: string
  x: number
  y: number
  fontSize: number
  fontFamily: string
  fill: string
  align: 'left' | 'center' | 'right'
  draggable?: boolean
  selectable?: boolean
}

// Konva贴纸类型
export interface KonvaSticker {
  id: string
  config: KonvaImageConfig
}

// Konva画布状态类型
export interface KonvaCanvasState {
  backgroundImage: KonvaImageConfig | null
  titleText: KonvaTextConfig | null
  subtitleText: KonvaTextConfig | null
  stickers: KonvaSticker[]
}
```

#### 4.2 更新项目类型定义
**文件**：`src/types/project.ts` - 无需修改，保持兼容性

### 第五阶段：测试和验证

#### 5.1 功能测试清单
- [ ] 画布初始化
- [ ] 背景图加载和显示
- [ ] 文字渲染和编辑
- [ ] 贴纸添加和拖拽
- [ ] 画布尺寸调整
- [ ] 预览模式切换
- [ ] 导出功能
- [ ] 响应式布局

#### 5.2 性能测试
- [ ] 画布渲染性能
- [ ] 内存使用情况
- [ ] 大图片加载性能
- [ ] 多元素操作性能

#### 5.3 兼容性测试
- [ ] 不同浏览器兼容性
- [ ] 移动端触摸操作
- [ ] 高分辨率屏幕支持

## 🎯 迁移风险控制

### 高风险点
1. **画布交互逻辑变化**
   - 风险：Fabric.js和Konva.js的事件处理机制不同
   - 缓解：创建适配层，保持API接口一致

2. **导出功能重构**
   - 风险：导出质量可能发生变化
   - 缓解：详细测试，确保输出质量不低于原版

3. **性能影响**
   - 风险：新库可能影响渲染性能
   - 缓解：性能基准测试，优化渲染策略

### 回滚策略
1. **保留原有代码分支**
2. **渐进式迁移**：先迁移核心功能，再迁移高级特性
3. **A/B测试**：新旧版本并行运行，对比效果

## 📅 迁移时间计划

### 第一周：环境准备
- 安装新依赖
- 创建基础Konva组件
- 搭建测试环境

### 第二周：核心功能迁移
- 重构Editor.vue画布部分
- 实现基础画布功能
- 单元测试

### 第三周：导出功能迁移
- 重构canvas-export.ts
- 更新Export.vue
- 集成测试

### 第四周：测试和优化
- 全面功能测试
- 性能优化
- 文档更新

## 🔧 技术细节和注意事项

### Konva.js最佳实践
1. **使用v-layer分层**：背景、内容、UI分别使用不同图层
2. **响应式更新**：利用Vue的响应式系统自动更新画布
3. **事件处理**：使用Konva的事件系统，避免DOM事件冲突
4. **性能优化**：合理使用缓存和批量更新

### 保持兼容性
1. **API接口一致**：保持原有的方法名和参数结构
2. **数据格式兼容**：确保项目数据格式不变
3. **UI行为一致**：保持原有的交互体验

### 错误处理
1. **优雅降级**：画布初始化失败时提供友好的错误提示
2. **状态管理**：完善画布状态管理，避免状态不一致
3. **日志记录**：详细的错误日志，便于问题排查

## 📚 参考资料

- [Konva.js官方文档](https://konvajs.org/)
- [vue-konva官方文档](https://github.com/konvajs/vue-konva)
- [Canvas 2D API文档](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Vue 3 Composition API最佳实践](https://vuejs.org/guide/extras/composition-api-faq.html)

## ✅ 迁移完成检查清单

### 代码层面
- [ ] 移除所有Fabric.js相关代码
- [ ] 完成Konva.js组件重构
- [ ] 更新所有相关导入
- [ ] 通过TypeScript类型检查
- [ ] 通过ESLint检查

### 功能层面
- [ ] 画布基础功能正常
- [ ] 图片处理功能正常
- [ ] 文字编辑功能正常
- [ ] 导出功能正常
- [ ] 性能指标达标

### 测试层面
- [ ] 单元测试通过
- [ ] 集成测试通过
- [ ] 用户验收测试通过
- [ ] 性能测试通过
- [ ] 兼容性测试通过

### 文档层面
- [ ] 更新技术文档
- [ ] 更新用户手册
- [ ] 更新API文档
- [ ] 更新部署说明

---

**注意事项**：本迁移计划仅涉及画布相关功能，其他业务逻辑、UI组件、状态管理等保持不变。迁移过程中需要特别注意保持用户体验的一致性和功能的完整性。
