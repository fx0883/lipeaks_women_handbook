import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Project } from '@/types/project'

const STORAGE_KEY = 'handbook-projects'

function trySaveProjectsToLocalStorage(projects: Project[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
    return
  } catch (err) {
    // 可能为配额超限，进行瘦身后重试
    try {
      const slimProjects = projects.map(p => ({
        ...p,
        // dataURL 往往体积巨大，改为空字符串以降低占用（远程 URL 保留）
        thumbnail: (typeof p.thumbnail === 'string' && p.thumbnail.startsWith('data:')) ? '' : p.thumbnail,
        content: {
          ...p.content,
          // 这些字段可能存放大量 base64 或资源引用，本地存储中不保留
          images: [],
          stickers: []
        }
      }))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slimProjects))
      console.warn('Storage quota exceeded. Saved slimmed projects instead of full payload.')
      return
    } catch (err2) {
      console.error('Failed to save projects to localStorage due to quota limits.', err2)
      alert('本地存储空间不足，无法保存项目。请导出或清理部分项目后重试。')
    }
  }
}

export const useProjectStore = defineStore('project', () => {
  // 状态
  const projects = ref<Project[]>([])
  const byId = ref<Record<string, Project>>({})

  // 计算属性
  const publicProjects = computed(() => {
    return projects.value.filter(project => project.isPublic)
  })

  const recentProjects = computed(() => {
    return projects.value
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 6)
  })

  const projectsByTemplate = computed(() => {
    return (templateId: string) => {
      return projects.value.filter(project => project.templateId === templateId)
    }
  })

  // 动作
  const loadProjects = (projectList: Project[]): void => {
    projects.value = projectList
    
    // 构建 byId 索引
    byId.value = {}
    projectList.forEach(project => {
      byId.value[project.id] = project
    })
  }

  const getById = (id: string): Project | undefined => {
    return byId.value[id]
  }

  const addProject = (project: Project): Project => {
    projects.value.push(project)
    byId.value[project.id] = project
    // 保存到本地存储
    trySaveProjectsToLocalStorage(projects.value)
    return project
  }

  const updateProject = (id: string, updates: Partial<Project>): void => {
    const index = projects.value.findIndex(project => project.id === id)
    if (index !== -1) {
      const updatedProject = { 
        ...projects.value[index], 
        ...updates,
        updatedAt: new Date().toISOString()
      }
      projects.value[index] = updatedProject
      byId.value[id] = updatedProject
      // 保存到本地存储
      trySaveProjectsToLocalStorage(projects.value)
    }
  }

  const deleteProject = (id: string): void => {
    const index = projects.value.findIndex(project => project.id === id)
    if (index !== -1) {
      projects.value.splice(index, 1)
      delete byId.value[id]
      // 保存到本地存储
      trySaveProjectsToLocalStorage(projects.value)
    }
  }

  const searchProjects = (query: string): Project[] => {
    const lowerQuery = query.toLowerCase()
    return projects.value.filter(project => 
      project.name.toLowerCase().includes(lowerQuery) ||
      project.description.toLowerCase().includes(lowerQuery) ||
      project.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }

  const filterProjects = (filters: {
    category?: string
    ratio?: string
    isPublic?: boolean
  }): Project[] => {
    return projects.value.filter(project => {
      // 分类筛选（通过模板 ID 推断）
      if (filters.category && !project.templateId.includes(filters.category)) {
        return false
      }
      
      // 比例筛选
      if (filters.ratio && project.content.ratio !== filters.ratio) {
        return false
      }
      
      // 公开状态筛选
      if (filters.isPublic !== undefined && project.isPublic !== filters.isPublic) {
        return false
      }
      
      return true
    })
  }

  const restoreFromLocal = (): void => {
    const savedProjects = localStorage.getItem(STORAGE_KEY)
    if (savedProjects) {
      try {
        const parsed = JSON.parse(savedProjects)
        if (Array.isArray(parsed)) {
          loadProjects(parsed)
        }
      } catch (error) {
        console.warn('Failed to restore projects from localStorage:', error)
      }
    }
  }

  return {
    projects,
    byId,
    publicProjects,
    recentProjects,
    projectsByTemplate,
    loadProjects,
    getById,
    addProject,
    updateProject,
    deleteProject,
    searchProjects,
    filterProjects,
    restoreFromLocal
  }
})
