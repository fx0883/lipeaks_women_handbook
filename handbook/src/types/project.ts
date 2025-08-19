import type { MoodId } from './mood'

export interface ProjectContent {
  title: string
  subtitle: string
  images: string[]
  stickers: string[]
  filters: string[]
  text: string
  mood: MoodId
  colors: {
    primary: string
    secondary: string
    text: string
  }
  ratio?: '1:1' | '4:5' | '9:16' | '3:4'
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