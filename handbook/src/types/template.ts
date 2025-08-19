export type TemplateCategory = 'high-school' | 'university' | 'workplace'

export interface TemplateLayerBase {
  type: 'image' | 'text' | 'sticker'
  key: string
  frame: {
    x: number
    y: number
    w: number
    h: number
  }
}

export interface ImageLayer extends TemplateLayerBase {
  type: 'image'
  mask?: 'rounded' | 'circle'
}

export interface TextLayer extends TemplateLayerBase {
  type: 'text'
  font: string
  size: number
  color: string
  align: 'left' | 'center' | 'right'
}

export interface StickerLayer extends TemplateLayerBase {
  type: 'sticker'
  asset: string
}

export type TemplateLayer = ImageLayer | TextLayer | StickerLayer

export interface Template {
  id: string            // kebab-case 英文，URL 友好
  name: string          // 中文展示名
  description: string
  category: TemplateCategory
  styleTag: string[]
  ratio: '1:1' | '4:5' | '9:16' | '3:4'
  thumbnail: string
  preview: string
  layers: TemplateLayer[]
  tags: string[]
  isPopular: boolean
  isNew: boolean
  version: number
  createdAt: string
}
