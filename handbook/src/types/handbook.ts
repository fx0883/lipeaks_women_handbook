import type { TodoItem, TodoCategory, MoodType, Achievement } from './todo'

// 手账模板类型
export type HandbookTemplateType = 'completion' | 'progress' | 'achievement' | 'review' | 'custom'

// 手账布局类型
export type LayoutType = 'grid' | 'freeform' | 'timeline' | 'masonry'

// 手账元素类型
export type ElementType = 'text' | 'image' | 'chart' | 'progress' | 'achievement' | 'mood' | 'todo-card'

// 手账模板接口
export interface TodoHandbookTemplate {
  id: string
  name: string
  description: string
  type: HandbookTemplateType
  category: TodoCategory
  layout: TemplateLayout
  elements: TemplateElement[]
  dataMapping: DataMappingRule[]
  isActive: boolean
  isPublic: boolean
  authorId: string
  version: number
  createdAt: Date
  updatedAt: Date
}

// 模板布局接口
export interface TemplateLayout {
  type: LayoutType
  dimensions: { width: number; height: number }
  grid: { rows: number; columns: number }
  spacing: number
  backgroundColor: string
  padding: { top: number; right: number; bottom: number; left: number }
}

// 模板元素接口
export interface TemplateElement {
  id: string
  type: ElementType
  position: { x: number; y: number }
  size: { width: number; height: number }
  content: ElementContent
  style: ElementStyle
  dataBinding?: DataBinding
}

// 元素内容接口
export interface ElementContent {
  text?: string
  imageUrl?: string
  chartType?: 'bar' | 'pie' | 'line' | 'radar'
  progressValue?: number
  achievementId?: string
  moodType?: MoodType
  todoId?: string
}

// 元素样式接口
export interface ElementStyle {
  fontFamily: string
  fontSize: number
  fontWeight: 'normal' | 'bold'
  color: string
  backgroundColor: string
  borderColor: string
  borderWidth: number
  borderRadius: number
  opacity: number
  shadow: boolean
  rotation: number
}

// 数据绑定接口
export interface DataBinding {
  source: 'todo' | 'achievement' | 'mood' | 'stats' | 'static'
  field: string
  transform?: string
  defaultValue?: any
}

// 数据映射规则接口
export interface DataMappingRule {
  elementId: string
  dataSource: 'todo' | 'achievement' | 'mood' | 'stats'
  field: string
  transform?: string
  filter?: string
}

// 生成的手账接口
export interface TodoHandbook {
  id: string
  templateId: string
  name: string
  description: string
  todoData: TodoItem[]
  generatedContent: GeneratedContent
  exportSettings: ExportSettings
  createdAt: Date
  updatedAt: Date
}

// 生成的内容接口
export interface GeneratedContent {
  elements: GeneratedElement[]
  layout: TemplateLayout
  metadata: HandbookMetadata
}

// 生成的元素接口
export interface GeneratedElement extends TemplateElement {
  renderedContent: string | Blob
  isVisible: boolean
}

// 手账元数据接口
export interface HandbookMetadata {
  generatedAt: Date
  dataSource: string
  elementCount: number
  lastModified: Date
  version: string
}

// 导出设置接口
export interface ExportSettings {
  format: 'pdf' | 'png' | 'jpg' | 'svg'
  quality: 'low' | 'medium' | 'high'
  dimensions: { width: number; height: number }
  includeMetadata: boolean
  watermark: boolean
  compression: boolean
}

// 手账生成选项接口
export interface HandbookGenerationOptions {
  templateId: string
  todoIds: string[]
  customData?: Record<string, any>
  layout?: Partial<TemplateLayout>
  style?: Partial<ElementStyle>
  exportFormat?: string
}

// 手账预览接口
export interface HandbookPreview {
  id: string
  template: TodoHandbookTemplate
  previewData: any
  thumbnail: string
  createdAt: Date
}

// 手账分享接口
export interface HandbookShare {
  id: string
  handbookId: string
  platform: 'wechat' | 'weibo' | 'qq' | 'douyin'
  shareText: string
  hashtags: string[]
  shareUrl?: string
  shareTime: Date
  viewCount: number
  likeCount: number
}

// 手账统计接口
export interface HandbookStats {
  totalGenerated: number
  totalExported: number
  totalShared: number
  popularTemplates: string[]
  averageGenerationTime: number
  exportFormats: Record<string, number>
  sharePlatforms: Record<string, number>
}
