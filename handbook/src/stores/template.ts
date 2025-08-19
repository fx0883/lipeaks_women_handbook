import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Template, TemplateCategory } from '@/types/template'

export const useTemplateStore = defineStore('template', () => {
  // 状态
  const templates = ref<Template[]>([])
  const byId = ref<Record<string, Template>>({})

  // 计算属性
  const popularTemplates = computed(() => {
    return templates.value.filter(template => template.isPopular)
  })

  const newTemplates = computed(() => {
    return templates.value.filter(template => template.isNew)
  })

  const templatesByCategory = computed(() => {
    const grouped: Record<TemplateCategory, Template[]> = {
      'high-school': [],
      'university': [],
      'workplace': []
    }
    
    templates.value.forEach(template => {
      grouped[template.category].push(template)
    })
    
    return grouped
  })

  // 动作
  const loadTemplates = (templateList: Template[]): void => {
    templates.value = templateList
    
    // 构建 byId 索引
    byId.value = {}
    templateList.forEach(template => {
      byId.value[template.id] = template
    })
  }

  const getById = (id: string): Template | undefined => {
    return byId.value[id]
  }

  const getByCategory = (category: TemplateCategory): Template[] => {
    return templates.value.filter(template => template.category === category)
  }

  const searchTemplates = (query: string): Template[] => {
    const lowerQuery = query.toLowerCase()
    return templates.value.filter(template => 
      template.name.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      template.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      template.styleTag.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }

  const filterTemplates = (filters: {
    category?: TemplateCategory
    ratio?: string
    styles?: string[]
  }): Template[] => {
    return templates.value.filter(template => {
      // 分类筛选
      if (filters.category && template.category !== filters.category) {
        return false
      }
      
      // 比例筛选
      if (filters.ratio && template.ratio !== filters.ratio) {
        return false
      }
      
      // 风格筛选
      if (filters.styles && filters.styles.length > 0) {
        const hasMatchingStyle = filters.styles.some(style => 
          template.styleTag.includes(style)
        )
        if (!hasMatchingStyle) {
          return false
        }
      }
      
      return true
    })
  }

  return {
    templates,
    byId,
    popularTemplates,
    newTemplates,
    templatesByCategory,
    loadTemplates,
    getById,
    getByCategory,
    searchTemplates,
    filterTemplates
  }
})
