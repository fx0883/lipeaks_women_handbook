import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  TodoHandbookTemplate,
  TodoHandbook,
  HandbookGenerationOptions,
  ExportSettings,
  HandbookStats
} from '@/types/handbook'
import type { TodoItem } from '@/types/todo'

// 预设的手账模板数据
const defaultTemplates: TodoHandbookTemplate[] = [
  {
    id: 'completion-minimal',
    name: '简约完成记录',
    description: '简洁优雅的任务完成记录模板',
    type: 'completion',
    category: '学习',
    layout: {
      type: 'grid',
      dimensions: { width: 800, height: 600 },
      grid: { rows: 2, columns: 2 },
      spacing: 20,
      backgroundColor: '#fefefe',
      padding: { top: 40, right: 40, bottom: 40, left: 40 }
    },
    elements: [
      {
        id: 'title',
        type: 'text',
        position: { x: 0, y: 0 },
        size: { width: 400, height: 60 },
        content: { text: '任务完成记录' },
        style: {
          fontFamily: 'PingFang SC',
          fontSize: 24,
          fontWeight: 'bold',
          color: '#333333',
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 0,
          opacity: 1,
          shadow: false,
          rotation: 0
        }
      },
      {
        id: 'todo-title',
        type: 'text',
        position: { x: 0, y: 80 },
        size: { width: 400, height: 40 },
        content: { text: '{{todo.title}}' },
        style: {
          fontFamily: 'PingFang SC',
          fontSize: 18,
          fontWeight: 'normal',
          color: '#666666',
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 0,
          opacity: 1,
          shadow: false,
          rotation: 0
        }
      },
      {
        id: 'completion-time',
        type: 'text',
        position: { x: 0, y: 140 },
        size: { width: 200, height: 30 },
        content: { text: '完成时间：{{todo.completedAt}}' },
        style: {
          fontFamily: 'PingFang SC',
          fontSize: 14,
          fontWeight: 'normal',
          color: '#999999',
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 0,
          opacity: 1,
          shadow: false,
          rotation: 0
        }
      },
      {
        id: 'mood',
        type: 'mood',
        position: { x: 400, y: 80 },
        size: { width: 100, height: 100 },
        content: { moodType: '😊' },
        style: {
          fontFamily: 'PingFang SC',
          fontSize: 48,
          fontWeight: 'normal',
          color: '#333333',
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 0,
          opacity: 1,
          shadow: false,
          rotation: 0
        }
      }
    ],
    dataMapping: [
      {
        elementId: 'todo-title',
        dataSource: 'todo',
        field: 'title'
      },
      {
        elementId: 'completion-time',
        dataSource: 'todo',
        field: 'completedAt',
        transform: 'date'
      },
      {
        elementId: 'mood',
        dataSource: 'todo',
        field: 'mood'
      }
    ],
    isActive: true,
    isPublic: true,
    authorId: 'system',
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'progress-weekly',
    name: '周进度报告',
    description: '展示一周任务完成进度的可视化模板',
    type: 'progress',
    category: '学习',
    layout: {
      type: 'grid',
      dimensions: { width: 900, height: 700 },
      grid: { rows: 3, columns: 2 },
      spacing: 25,
      backgroundColor: '#f8f9fa',
      padding: { top: 50, right: 50, bottom: 50, left: 50 }
    },
    elements: [
      {
        id: 'header',
        type: 'text',
        position: { x: 0, y: 0 },
        size: { width: 400, height: 50 },
        content: { text: '本周进度报告' },
        style: {
          fontFamily: 'PingFang SC',
          fontSize: 28,
          fontWeight: 'bold',
          color: '#2c3e50',
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 0,
          opacity: 1,
          shadow: false,
          rotation: 0
        }
      },
      {
        id: 'progress-chart',
        type: 'chart',
        position: { x: 0, y: 70 },
        size: { width: 400, height: 300 },
        content: { chartType: 'bar' },
        style: {
          fontFamily: 'PingFang SC',
          fontSize: 14,
          fontWeight: 'normal',
          color: '#333333',
          backgroundColor: '#ffffff',
          borderColor: '#e1e8ed',
          borderWidth: 1,
          borderRadius: 8,
          opacity: 1,
          shadow: true,
          rotation: 0
        }
      },
      {
        id: 'stats-summary',
        type: 'text',
        position: { x: 450, y: 70 },
        size: { width: 350, height: 200 },
        content: { text: '完成率：{{stats.completionRate}}%\n总任务：{{stats.totalCount}}\n已完成：{{stats.completedCount}}' },
        style: {
          fontFamily: 'PingFang SC',
          fontSize: 16,
          fontWeight: 'normal',
          color: '#555555',
          backgroundColor: '#ffffff',
          borderColor: '#e1e8ed',
          borderWidth: 1,
          borderRadius: 8,
          opacity: 1,
          shadow: true,
          rotation: 0
        }
      }
    ],
    dataMapping: [
      {
        elementId: 'stats-summary',
        dataSource: 'stats',
        field: 'completionRate'
      }
    ],
    isActive: true,
    isPublic: true,
    authorId: 'system',
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export const useHandbookStore = defineStore('handbook', () => {
  // 状态
  const templates = ref<TodoHandbookTemplate[]>([])
  const activeTemplate = ref<TodoHandbookTemplate | null>(null)
  const generatedHandbooks = ref<TodoHandbook[]>([])
  const isLoading = ref(false)
  const currentHandbook = ref<TodoHandbook | null>(null)

  // 计算属性
  const activeTemplates = computed(() => templates.value.filter(t => t.isActive))
  const publicTemplates = computed(() => templates.value.filter(t => t.isPublic))
  const completionTemplates = computed(() => templates.value.filter(t => t.type === 'completion'))
  const progressTemplates = computed(() => templates.value.filter(t => t.type === 'progress'))
  const achievementTemplates = computed(() => templates.value.filter(t => t.type === 'achievement'))
  const reviewTemplates = computed(() => templates.value.filter(t => t.type === 'review'))

  // 初始化
  const initializeTemplates = () => {
    const savedTemplates = localStorage.getItem('handbook-templates')
    if (savedTemplates) {
      try {
        const parsed = JSON.parse(savedTemplates)
        templates.value = parsed.map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt)
        }))
      } catch (error) {
        console.error('Failed to parse saved templates:', error)
        templates.value = [...defaultTemplates]
      }
    } else {
      templates.value = [...defaultTemplates]
    }
  }

  // 保存模板到本地存储
  const saveTemplates = () => {
    localStorage.setItem('handbook-templates', JSON.stringify(templates.value))
  }

  // 生成手账
  const generateHandbook = async (options: HandbookGenerationOptions): Promise<TodoHandbook | null> => {
    try {
      isLoading.value = true
      
      const template = templates.value.find(t => t.id === options.templateId)
      if (!template) {
        throw new Error(`Template not found: ${options.templateId}`)
      }

      const handbook: TodoHandbook = {
        id: `handbook-${Date.now()}`,
        templateId: template.id,
        name: `${template.name} - ${new Date().toLocaleDateString()}`,
        description: `基于模板"${template.name}"生成的手账`,
        todoData: [], // 这里需要从todo store获取实际数据
        generatedContent: {
          elements: template.elements.map(element => ({
            ...element,
            renderedContent: '',
            isVisible: true
          })),
          layout: template.layout,
          metadata: {
            generatedAt: new Date(),
            dataSource: 'todo-store',
            elementCount: template.elements.length,
            lastModified: new Date(),
            version: '1.0.0'
          }
        },
        exportSettings: {
          format: 'png',
          quality: 'high',
          dimensions: template.layout.dimensions,
          includeMetadata: true,
          watermark: false,
          compression: true
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }

      generatedHandbooks.value.push(handbook)
      currentHandbook.value = handbook
      
      // 保存到本地存储
      localStorage.setItem('generated-handbooks', JSON.stringify(generatedHandbooks.value))
      
      return handbook
    } catch (error) {
      console.error('Failed to generate handbook:', error)
      return null
    } finally {
      isLoading.value = false
    }
  }

  // 保存模板
  const saveTemplate = (template: TodoHandbookTemplate) => {
    const existingIndex = templates.value.findIndex(t => t.id === template.id)
    if (existingIndex >= 0) {
      templates.value[existingIndex] = {
        ...template,
        updatedAt: new Date()
      }
    } else {
      templates.value.push({
        ...template,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
    saveTemplates()
  }

  // 删除模板
  const deleteTemplate = (templateId: string) => {
    const index = templates.value.findIndex(t => t.id === templateId)
    if (index >= 0) {
      templates.value.splice(index, 1)
      saveTemplates()
    }
  }

  // 获取模板
  const getTemplate = (templateId: string) => {
    return templates.value.find(t => t.id === templateId) || null
  }

  // 获取生成的手账
  const getHandbook = (handbookId: string) => {
    return generatedHandbooks.value.find(h => h.id === handbookId) || null
  }

  // 删除手账
  const deleteHandbook = (handbookId: string) => {
    const index = generatedHandbooks.value.findIndex(h => h.id === handbookId)
    if (index >= 0) {
      generatedHandbooks.value.splice(index, 1)
      localStorage.setItem('generated-handbooks', JSON.stringify(generatedHandbooks.value))
    }
  }

  // 导出手账
  const exportHandbook = async (handbookId: string, format: string = 'png'): Promise<Blob | null> => {
    try {
      const handbook = getHandbook(handbookId)
      if (!handbook) {
        throw new Error(`Handbook not found: ${handbookId}`)
      }

      // 这里实现实际的导出逻辑
      // 暂时返回一个模拟的Blob
      const canvas = document.createElement('canvas')
      canvas.width = handbook.generatedContent.layout.dimensions.width
      canvas.height = handbook.generatedContent.layout.dimensions.height
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        // 绘制背景
        ctx.fillStyle = handbook.generatedContent.layout.backgroundColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // 绘制标题
        ctx.fillStyle = '#333333'
        ctx.font = '24px PingFang SC'
        ctx.fillText(handbook.name, 50, 50)
      }

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob)
        }, `image/${format}`, 0.9)
      })
    } catch (error) {
      console.error('Failed to export handbook:', error)
      return null
    }
  }

  // 分享手账
  const shareHandbook = async (handbookId: string, platform: string): Promise<boolean> => {
    try {
      const handbook = getHandbook(handbookId)
      if (!handbook) {
        throw new Error(`Handbook not found: ${handbookId}`)
      }

      // 这里实现实际的分享逻辑
      console.log(`Sharing handbook ${handbookId} to ${platform}`)
      
      return true
    } catch (error) {
      console.error('Failed to share handbook:', error)
      return false
    }
  }

  // 获取手账统计
  const getHandbookStats = (): HandbookStats => {
    const totalGenerated = generatedHandbooks.value.length
    const totalExported = generatedHandbooks.value.filter(h => h.exportSettings).length
    const totalShared = 0 // 暂时设为0

    return {
      totalGenerated,
      totalExported,
      totalShared,
      popularTemplates: templates.value
        .filter(t => t.isPublic)
        .slice(0, 5)
        .map(t => t.name),
      averageGenerationTime: 2000, // 模拟数据
      exportFormats: { png: 60, pdf: 30, jpg: 10 },
      sharePlatforms: { wechat: 50, weibo: 30, qq: 20 }
    }
  }

  // 初始化
  initializeTemplates()

  return {
    // 状态
    templates,
    activeTemplate,
    generatedHandbooks,
    isLoading,
    currentHandbook,
    
    // 计算属性
    activeTemplates,
    publicTemplates,
    completionTemplates,
    progressTemplates,
    achievementTemplates,
    reviewTemplates,
    
    // 方法
    generateHandbook,
    saveTemplate,
    deleteTemplate,
    getTemplate,
    getHandbook,
    deleteHandbook,
    exportHandbook,
    shareHandbook,
    getHandbookStats
  }
})
