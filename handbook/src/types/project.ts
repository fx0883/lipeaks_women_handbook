import type { MoodId } from './mood'

export interface ProjectContent {
  title: string
  subtitle: string
  images: string[]
  stickers: string[]
  filters: string[]
  text: string
  mood: MoodId | string
  colors: {
    primary: string
    secondary: string
    text: string
  }
  ratio?: '1:1' | '4:5' | '9:16' | '3:4' | string
  // 新增Editor相关的字段
  fontSize?: number
  fontStyle?: 'rounded' | 'hand' | 'sans' | 'serif'
  textAlign?: 'left' | 'center' | 'right'
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted'
  borderWidth?: number
  borderColor?: string
  borderRadius?: number
  adjustments?: {
    brightness: number
    contrast: number
    saturation: number
    sharpen: number
  }
  // 是否已将画布内容合成到缩略图中（用于导出时跳过再次叠加文字/边框）
  composited?: boolean
}

export interface Project {
  id: string
  name: string
  description: string
  templateId: string    // 指向 kebab-case 模板 id
  thumbnail: string
  content: ProjectContent
  tags: string[]
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

// 新增模板类型定义
export interface Template {
  id: string
  name: string
  category: string
  ratio: string
  preview: string
  description: string
  tags: string[]
  defaultTitle: string
  defaultSubtitle: string
  defaultColors: {
    primary: string
    secondary: string
    text: string
  }
}