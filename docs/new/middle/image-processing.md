# 出片手账 图片处理技术文档

## 📖 文档信息
- **版本**: v1.0
- **项目**: 出片手账 Vue 3 Web版
- **更新时间**: 2024-01-20
- **目标**: 为AI提供完整的图片处理技术实现指导

## 🎯 图片处理概述

### 技术选型
- **Canvas API**: 原生Canvas用于基础图片处理
- **Fabric.js**: 强大的Canvas库，用于复杂图片编辑
- **Konva.js**: 高性能Canvas库，用于大量图片处理
- **WebP支持**: 现代图片格式，提供更好的压缩率
- **图片压缩**: 客户端图片压缩，减少上传大小

### 核心功能
- 图片上传和预览
- 图片裁剪和缩放
- 滤镜效果应用
- 贴纸和文字叠加
- 图片导出和下载
- 批量图片处理

## 🖼️ 图片上传处理

### 文件上传组件
```vue
<!-- components/ImageUploader.vue -->
<template>
  <div class="image-uploader">
    <input
      ref="fileInput"
      type="file"
      multiple
      accept="image/*"
      @change="handleFileChange"
      class="hidden"
    />
    
    <div
      class="upload-area"
      @click="triggerFileSelect"
      @drop="handleDrop"
      @dragover.prevent
      @dragenter.prevent
    >
      <div class="upload-content">
        <BaseIcon name="upload" class="upload-icon" />
        <p class="upload-text">点击或拖拽上传图片</p>
        <p class="upload-hint">支持 JPG、PNG、WebP 格式</p>
      </div>
    </div>

    <div v-if="uploadedImages.length" class="image-preview-list">
      <div
        v-for="(image, index) in uploadedImages"
        :key="image.id"
        class="image-preview-item"
      >
        <img :src="image.preview" :alt="image.name" />
        <button @click="removeImage(index)" class="remove-btn">
          <BaseIcon name="close" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface UploadedImage {
  id: string
  name: string
  file: File
  preview: string
  size: number
  type: string
}

const fileInput = ref<HTMLInputElement>()
const uploadedImages = ref<UploadedImage[]>([])

const triggerFileSelect = () => {
  fileInput.value?.click()
}

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  
  for (const file of files) {
    await processImageFile(file)
  }
}

const handleDrop = async (event: DragEvent) => {
  event.preventDefault()
  const files = Array.from(event.dataTransfer?.files || [])
  
  for (const file of files) {
    if (file.type.startsWith('image/')) {
      await processImageFile(file)
    }
  }
}

const processImageFile = async (file: File) => {
  // 验证文件类型
  if (!isValidImageType(file.type)) {
    ElMessage.error('不支持的文件格式')
    return
  }

  // 验证文件大小 (最大10MB)
  if (file.size > 10 * 1024 * 1024) {
    ElMessage.error('文件大小不能超过10MB')
    return
  }

  // 压缩图片
  const compressedFile = await compressImage(file)
  
  // 生成预览
  const preview = await generatePreview(compressedFile)
  
  const image: UploadedImage = {
    id: generateId(),
    name: file.name,
    file: compressedFile,
    preview,
    size: compressedFile.size,
    type: compressedFile.type
  }
  
  uploadedImages.value.push(image)
}

const removeImage = (index: number) => {
  uploadedImages.value.splice(index, 1)
}

const isValidImageType = (type: string): boolean => {
  return ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(type)
}
</script>
```

### 图片压缩处理
```typescript
// utils/imageCompression.ts
export class ImageCompressor {
  static async compress(
    file: File,
    options: CompressionOptions = {}
  ): Promise<File> {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      format = 'webp'
    } = options

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // 计算新的尺寸
        const { width, height } = this.calculateDimensions(
          img.width,
          img.height,
          maxWidth,
          maxHeight
        )

        canvas.width = width
        canvas.height = height

        // 绘制图片
        ctx?.drawImage(img, 0, 0, width, height)

        // 转换为Blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: `image/${format}`,
                lastModified: Date.now()
              })
              resolve(compressedFile)
            } else {
              reject(new Error('图片压缩失败'))
            }
          },
          `image/${format}`,
          quality
        )
      }

      img.onerror = () => reject(new Error('图片加载失败'))
      img.src = URL.createObjectURL(file)
    })
  }

  private static calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    let { width, height } = { width: originalWidth, height: originalHeight }

    if (width > maxWidth) {
      height = (height * maxWidth) / width
      width = maxWidth
    }

    if (height > maxHeight) {
      width = (width * maxHeight) / height
      height = maxHeight
    }

    return { width: Math.round(width), height: Math.round(height) }
  }
}

interface CompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'jpeg' | 'png' | 'webp'
}
```

## 🎨 Canvas图片编辑

### Fabric.js编辑器组件
```vue
<!-- components/ImageEditor.vue -->
<template>
  <div class="image-editor">
    <div class="editor-toolbar">
      <button @click="addText" class="tool-btn">
        <BaseIcon name="text" />
        添加文字
      </button>
      <button @click="addSticker" class="tool-btn">
        <BaseIcon name="sticker" />
        添加贴纸
      </button>
      <button @click="applyFilter" class="tool-btn">
        <BaseIcon name="filter" />
        滤镜效果
      </button>
      <button @click="exportImage" class="tool-btn primary">
        <BaseIcon name="download" />
        导出图片
      </button>
    </div>

    <div class="editor-canvas-container">
      <canvas
        ref="canvasRef"
        id="editor-canvas"
        class="editor-canvas"
      ></canvas>
    </div>

    <div class="editor-sidebar">
      <div class="sidebar-section">
        <h3>图层</h3>
        <div class="layer-list">
          <div
            v-for="object in canvasObjects"
            :key="object.id"
            class="layer-item"
            @click="selectObject(object)"
          >
            <span class="layer-name">{{ object.name }}</span>
            <button @click="removeObject(object)" class="layer-remove">
              <BaseIcon name="delete" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="selectedObject" class="sidebar-section">
        <h3>属性</h3>
        <ObjectProperties
          :object="selectedObject"
          @update="updateObject"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fabric } from 'fabric'

interface CanvasObject {
  id: string
  name: string
  type: 'image' | 'text' | 'sticker'
  fabricObject: fabric.Object
}

const canvasRef = ref<HTMLCanvasElement>()
const canvas = ref<fabric.Canvas | null>(null)
const canvasObjects = ref<CanvasObject[]>([])
const selectedObject = ref<CanvasObject | null>(null)

onMounted(() => {
  initCanvas()
})

const initCanvas = () => {
  if (!canvasRef.value) return

  canvas.value = new fabric.Canvas('editor-canvas', {
    width: 600,
    height: 800,
    backgroundColor: '#ffffff'
  })

  // 监听选择事件
  canvas.value.on('selection:created', handleSelection)
  canvas.value.on('selection:updated', handleSelection)
  canvas.value.on('selection:cleared', () => {
    selectedObject.value = null
  })
}

const addImage = async (imageUrl: string) => {
  if (!canvas.value) return

  fabric.Image.fromURL(imageUrl, (img) => {
    // 调整图片大小以适应画布
    const scale = Math.min(
      500 / img.width!,
      700 / img.height!,
      1
    )
    
    img.scale(scale)
    img.set({
      left: (canvas.value!.width! - img.width! * scale) / 2,
      top: (canvas.value!.height! - img.height! * scale) / 2
    })

    canvas.value!.add(img)
    canvas.value!.setActiveObject(img)
    canvas.value!.renderAll()

    // 添加到图层列表
    const object: CanvasObject = {
      id: generateId(),
      name: '图片',
      type: 'image',
      fabricObject: img
    }
    canvasObjects.value.push(object)
  })
}

const addText = () => {
  if (!canvas.value) return

  const textbox = new fabric.Textbox('点击编辑文字', {
    left: 100,
    top: 100,
    fontSize: 24,
    fill: '#333333',
    fontFamily: 'PingFang SC, Microsoft YaHei, sans-serif'
  })

  canvas.value.add(textbox)
  canvas.value.setActiveObject(textbox)
  canvas.value.renderAll()

  const object: CanvasObject = {
    id: generateId(),
    name: '文字',
    type: 'text',
    fabricObject: textbox
  }
  canvasObjects.value.push(object)
}

const addSticker = (stickerUrl: string) => {
  if (!canvas.value) return

  fabric.Image.fromURL(stickerUrl, (img) => {
    img.scale(0.5)
    img.set({
      left: 200,
      top: 200
    })

    canvas.value!.add(img)
    canvas.value!.setActiveObject(img)
    canvas.value!.renderAll()

    const object: CanvasObject = {
      id: generateId(),
      name: '贴纸',
      type: 'sticker',
      fabricObject: img
    }
    canvasObjects.value.push(object)
  })
}

const applyFilter = (filterType: string) => {
  if (!canvas.value || !selectedObject.value) return

  const obj = selectedObject.value.fabricObject
  if (obj instanceof fabric.Image) {
    switch (filterType) {
      case 'grayscale':
        obj.filters?.push(new fabric.Image.filters.Grayscale())
        break
      case 'sepia':
        obj.filters?.push(new fabric.Image.filters.Sepia())
        break
      case 'brightness':
        obj.filters?.push(new fabric.Image.filters.Brightness({ brightness: 0.1 }))
        break
      case 'contrast':
        obj.filters?.push(new fabric.Image.filters.Contrast({ contrast: 0.1 }))
        break
    }
    obj.applyFilters()
    canvas.value.renderAll()
  }
}

const selectObject = (object: CanvasObject) => {
  canvas.value?.setActiveObject(object.fabricObject)
  selectedObject.value = object
  canvas.value?.renderAll()
}

const removeObject = (object: CanvasObject) => {
  canvas.value?.remove(object.fabricObject)
  const index = canvasObjects.value.findIndex(o => o.id === object.id)
  if (index > -1) {
    canvasObjects.value.splice(index, 1)
  }
  canvas.value?.renderAll()
}

const updateObject = (updates: Partial<fabric.Object>) => {
  if (!selectedObject.value || !canvas.value) return

  selectedObject.value.fabricObject.set(updates)
  canvas.value.renderAll()
}

const handleSelection = () => {
  const activeObject = canvas.value?.getActiveObject()
  if (activeObject) {
    selectedObject.value = canvasObjects.value.find(
      o => o.fabricObject === activeObject
    ) || null
  }
}

const exportImage = () => {
  if (!canvas.value) return

  const dataURL = canvas.value.toDataURL({
    format: 'png',
    quality: 1
  })

  // 创建下载链接
  const link = document.createElement('a')
  link.download = `women_handbook_${Date.now()}.png`
  link.href = dataURL
  link.click()
}
</script>
```

## 🎭 滤镜效果系统

### 滤镜处理器
```typescript
// utils/imageFilters.ts
export class ImageFilterProcessor {
  static applyFilter(
    canvas: HTMLCanvasElement,
    filterType: FilterType,
    options: FilterOptions = {}
  ): void {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    switch (filterType) {
      case 'grayscale':
        this.applyGrayscale(data)
        break
      case 'sepia':
        this.applySepia(data)
        break
      case 'brightness':
        this.applyBrightness(data, options.brightness || 0)
        break
      case 'contrast':
        this.applyContrast(data, options.contrast || 0)
        break
      case 'saturation':
        this.applySaturation(data, options.saturation || 0)
        break
    }

    ctx.putImageData(imageData, 0, 0)
  }

  private static applyGrayscale(data: Uint8ClampedArray): void {
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
      data[i] = gray
      data[i + 1] = gray
      data[i + 2] = gray
    }
  }

  private static applySepia(data: Uint8ClampedArray): void {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189))
      data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168))
      data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131))
    }
  }

  private static applyBrightness(data: Uint8ClampedArray, value: number): void {
    const factor = 1 + value
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, data[i] * factor))
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * factor))
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * factor))
    }
  }

  private static applyContrast(data: Uint8ClampedArray, value: number): void {
    const factor = (259 * (value + 255)) / (255 * (259 - value))
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128))
      data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128))
      data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128))
    }
  }

  private static applySaturation(data: Uint8ClampedArray, value: number): void {
    const factor = 1 + value
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
      data[i] = Math.min(255, Math.max(0, gray + factor * (data[i] - gray)))
      data[i + 1] = Math.min(255, Math.max(0, gray + factor * (data[i + 1] - gray)))
      data[i + 2] = Math.min(255, Math.max(0, gray + factor * (data[i + 2] - gray)))
    }
  }
}

type FilterType = 'grayscale' | 'sepia' | 'brightness' | 'contrast' | 'saturation'

interface FilterOptions {
  brightness?: number
  contrast?: number
  saturation?: number
}
```

## 📤 图片导出系统

### 导出处理器
```typescript
// utils/imageExporter.ts
export class ImageExporter {
  static async exportCanvas(
    canvas: fabric.Canvas,
    options: ExportOptions = {}
  ): Promise<Blob> {
    const {
      format = 'png',
      quality = 1,
      width,
      height,
      backgroundColor = '#ffffff'
    } = options

    // 创建临时画布用于导出
    const tempCanvas = document.createElement('canvas')
    const tempCtx = tempCanvas.getContext('2d')
    
    if (!tempCtx) {
      throw new Error('无法创建导出画布')
    }

    // 设置导出尺寸
    tempCanvas.width = width || canvas.width!
    tempCanvas.height = height || canvas.height!

    // 设置背景色
    tempCtx.fillStyle = backgroundColor
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)

    // 获取画布数据
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1
    })

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        // 绘制到临时画布
        tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height)
        
        // 转换为Blob
        tempCanvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('导出失败'))
            }
          },
          `image/${format}`,
          quality
        )
      }
      img.onerror = () => reject(new Error('图片加载失败'))
      img.src = dataURL
    })
  }

  static downloadImage(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

interface ExportOptions {
  format?: 'png' | 'jpeg' | 'webp'
  quality?: number
  width?: number
  height?: number
  backgroundColor?: string
}
```

## 🔧 性能优化

### 图片缓存系统
```typescript
// utils/imageCache.ts
export class ImageCache {
  private static cache = new Map<string, HTMLImageElement>()
  private static maxSize = 50

  static async getImage(url: string): Promise<HTMLImageElement> {
    if (this.cache.has(url)) {
      return this.cache.get(url)!
    }

    const img = await this.loadImage(url)
    
    // 缓存管理
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    
    this.cache.set(url, img)
    return img
  }

  private static loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error(`图片加载失败: ${url}`))
      img.src = url
    })
  }

  static clearCache(): void {
    this.cache.clear()
  }

  static getCacheSize(): number {
    return this.cache.size
  }
}
```

## 📝 总结

本图片处理技术文档为"出片手账"项目提供了完整的图片处理解决方案，包括：

1. **完整的图片处理流程**: 从上传到编辑到导出的全流程
2. **多种技术方案**: Canvas API、Fabric.js、滤镜效果等
3. **性能优化**: 图片缓存、压缩等
4. **用户体验**: 实时预览、多种导出格式

通过这些技术实现，可以为用户提供流畅、高效的图片编辑体验。
