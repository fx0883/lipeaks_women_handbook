<template>
  <div class="export-page">
    <div class="export-container">
      <div class="page-header">
        <h1>导出作品</h1>
        <p>选择导出格式和尺寸，下载你的作品</p>
      </div>

      <div class="export-content">
        <!-- 预览区域 -->
        <div class="preview-section">
          <h2>预览</h2>
          <div class="preview-wrapper">
            <div class="preview-image" :style="previewStyle">
              <img 
                :src="projectThumbnail" 
                :alt="projectName"
                @load="handleImageLoad"
              />
            </div>
            <div class="preview-info">
              <h3>{{ projectName }}</h3>
              <p>{{ exportFormat.toUpperCase() }} · {{ exportSize.width }}×{{ exportSize.height }}</p>
            </div>
          </div>
        </div>

        <!-- 导出设置 -->
        <div class="settings-section">
          <h2>导出设置</h2>
          
          <!-- 格式选择 -->
          <div class="setting-group">
            <h3>文件格式</h3>
            <div class="format-options">
              <label 
                v-for="format in formats" 
                :key="format.value"
                class="format-option"
                :class="{ active: exportFormat === format.value }"
              >
                <input 
                  type="radio" 
                  :value="format.value"
                  v-model="exportFormat"
                  @change="updatePreview"
                />
                <div class="format-info">
                  <span class="format-name">{{ format.name }}</span>
                  <span class="format-desc">{{ format.description }}</span>
                </div>
              </label>
            </div>
          </div>

          <!-- 尺寸选择 -->
          <div class="setting-group">
            <h3>导出尺寸</h3>
            <div class="size-options">
              <label 
                v-for="size in sizes" 
                :key="size.name"
                class="size-option"
                :class="{ active: selectedSize === size.name }"
              >
                <input 
                  type="radio" 
                  :value="size.name"
                  v-model="selectedSize"
                  @change="updateSize"
                />
                <div class="size-info">
                  <span class="size-name">{{ size.name }}</span>
                  <span class="size-dimensions">{{ size.width }}×{{ size.height }}</span>
                </div>
              </label>
            </div>
          </div>

          <!-- 质量设置 -->
          <div class="setting-group" v-if="exportFormat === 'jpg'">
            <h3>图片质量</h3>
            <div class="quality-slider">
              <input 
                type="range" 
                min="0.1" 
                max="1" 
                step="0.1"
                v-model="exportQuality"
                class="slider"
              />
              <div class="quality-labels">
                <span>低质量</span>
                <span>{{ Math.round(exportQuality * 100) }}%</span>
                <span>高质量</span>
              </div>
            </div>
          </div>

          <!-- 导出按钮 -->
          <div class="export-actions">
            <button 
              class="export-btn primary"
              :disabled="isExporting"
              @click="exportImage"
            >
              {{ isExporting ? '导出中...' : '导出图片' }}
            </button>
            <button class="export-btn" @click="goBack">
              返回编辑
            </button>
          </div>
        </div>
      </div>

      <!-- 导出历史 -->
      <div class="history-section">
        <h2>导出历史</h2>
        <div class="history-list">
          <div 
            v-for="item in exportHistory" 
            :key="item.id"
            class="history-item"
          >
            <div class="history-info">
              <h4>{{ item.name }}</h4>
              <p>{{ item.format.toUpperCase() }} · {{ item.size }} · {{ formatDate(item.date) }}</p>
            </div>
            <button class="download-btn" @click="downloadHistoryItem(item)">
              📥 下载
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 项目信息
const projectId = route.query.project as string
const projectName = ref('我的作品')
const projectThumbnail = ref('https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=600&q=80')

// 导出设置
const exportFormat = ref('png')
const selectedSize = ref('原始尺寸')
const exportQuality = ref(0.9)
const isExporting = ref(false)

// 格式选项
const formats = [
  {
    value: 'png',
    name: 'PNG',
    description: '无损压缩，支持透明背景'
  },
  {
    value: 'jpg',
    name: 'JPG',
    description: '有损压缩，文件更小'
  }
]

// 尺寸选项
const sizes = [
  { name: '原始尺寸', width: 1080, height: 1350 },
  { name: '小红书', width: 1080, height: 1350 },
  { name: '朋友圈', width: 1080, height: 1080 },
  { name: '微博', width: 1080, height: 1260 },
  { name: '抖音', width: 1080, height: 1920 },
  { name: '自定义', width: 1080, height: 1350 }
]

// 导出历史
const exportHistory = ref([
  {
    id: '1',
    name: '校园日常拼贴',
    format: 'png',
    size: '1080×1350',
    date: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: '社团招新海报',
    format: 'jpg',
    size: '1080×1920',
    date: '2024-01-14T10:00:00Z'
  }
])

// 计算属性
const exportSize = computed(() => {
  const size = sizes.find(s => s.name === selectedSize.value)
  return size || sizes[0]
})

const previewStyle = computed(() => {
  const ratio = exportSize.value.height / exportSize.value.width
  return {
    aspectRatio: `${exportSize.value.width} / ${exportSize.value.height}`
  }
})

// 更新预览
const updatePreview = (): void => {
  console.log('更新预览:', exportFormat.value)
}

// 更新尺寸
const updateSize = (): void => {
  console.log('更新尺寸:', selectedSize.value, exportSize.value)
}

// 处理图片加载
const handleImageLoad = (): void => {
  console.log('图片加载完成')
}

// 导出图片
const exportImage = async (): Promise<void> => {
  isExporting.value = true
  
  try {
    // 模拟导出过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 创建下载链接
    const canvas = document.createElement('canvas')
    canvas.width = exportSize.value.width
    canvas.height = exportSize.value.height
    
    const ctx = canvas.getContext('2d')
    if (ctx) {
      // 绘制背景
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // 绘制图片（这里简化处理）
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        // 导出文件
        const mimeType = exportFormat.value === 'png' ? 'image/png' : 'image/jpeg'
        const quality = exportFormat.value === 'jpg' ? exportQuality.value : undefined
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${projectName.value}.${exportFormat.value}`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
            
            // 添加到导出历史
            exportHistory.value.unshift({
              id: Date.now().toString(),
              name: projectName.value,
              format: exportFormat.value,
              size: `${exportSize.value.width}×${exportSize.value.height}`,
              date: new Date().toISOString()
            })
          }
        }, mimeType, quality)
      }
      img.src = projectThumbnail.value
    }
  } catch (error) {
    console.error('导出失败:', error)
    alert('导出失败，请重试')
  } finally {
    isExporting.value = false
  }
}

// 下载历史项目
const downloadHistoryItem = (item: any): void => {
  console.log('下载历史项目:', item)
  // 这里应该从服务器或本地存储获取文件
}

// 返回编辑
const goBack = (): void => {
  router.back()
}

// 格式化日期
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  // 根据项目ID加载项目信息
  if (projectId) {
    console.log('加载项目:', projectId)
  }
})
</script>

<style scoped>
.export-page {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  min-height: 100vh;
  padding-top: 104px;
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: 24px;
  box-sizing: border-box;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
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

.export-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
  margin-bottom: 40px;
}

.preview-section,
.settings-section {
  background: var(--colorNeutralBackground1);
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 20px;
  padding: 24px;
  box-shadow: var(--shadow4);
}

.preview-section h2,
.settings-section h2 {
  margin: 0 0 20px;
  font-size: 20px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.preview-wrapper {
  text-align: center;
}

.preview-image {
  margin-bottom: 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow8);
  max-width: 100%;
}

.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.preview-info h3 {
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.preview-info p {
  margin: 0;
  color: var(--colorNeutralForeground2);
  font-size: 14px;
}

.setting-group {
  margin-bottom: 24px;
}

.setting-group h3 {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 500;
  color: var(--colorNeutralForeground1);
}

.format-options,
.size-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.format-option,
.size-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.format-option:hover,
.size-option:hover {
  border-color: var(--colorBrandBackground);
  background: var(--pink-light);
}

.format-option.active,
.size-option.active {
  border-color: var(--colorBrandBackground);
  background: var(--pink-light);
}

.format-option input,
.size-option input {
  margin: 0;
}

.format-info,
.size-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.format-name,
.size-name {
  font-weight: 500;
  color: var(--colorNeutralForeground1);
}

.format-desc,
.size-dimensions {
  font-size: 12px;
  color: var(--colorNeutralForeground2);
}

.quality-slider {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--colorNeutralStroke1);
  outline: none;
  accent-color: var(--colorBrandBackground);
}

.quality-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--colorNeutralForeground2);
}

.export-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.export-btn {
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

.export-btn:hover:not(:disabled) {
  border-color: var(--colorBrandBackground);
  background: var(--pink-light);
}

.export-btn.primary {
  background: var(--colorBrandBackground);
  color: var(--colorBrandForeground);
  border-color: var(--colorBrandBackground);
}

.export-btn.primary:hover:not(:disabled) {
  background: var(--colorBrandBackgroundHover);
}

.export-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.history-section {
  background: var(--colorNeutralBackground1);
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 20px;
  padding: 24px;
  box-shadow: var(--shadow4);
}

.history-section h2 {
  margin: 0 0 20px;
  font-size: 20px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.history-item:hover {
  border-color: var(--colorBrandBackground);
  background: var(--pink-light);
}

.history-info h4 {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 500;
  color: var(--colorNeutralForeground1);
}

.history-info p {
  margin: 0;
  font-size: 12px;
  color: var(--colorNeutralForeground2);
}

.download-btn {
  padding: 8px 16px;
  border: 1px solid var(--colorNeutralStroke1);
  background: var(--colorNeutralBackground1);
  color: var(--colorNeutralForeground1);
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.download-btn:hover {
  border-color: var(--colorBrandBackground);
  background: var(--pink-light);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .export-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .export-page {
    padding: 16px;
  }
  
  .history-item {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .download-btn {
    align-self: center;
  }
}
</style>
