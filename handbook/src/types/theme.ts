export interface ThemeColor {
  id: string
  name: string
  primary: string
  primaryHover: string
  primaryPressed: string
  secondary: string
  accent: string
  preview: string
}

export interface Theme {
  id: string
  name: string
  category: 'pink' | 'purple' | 'mint' | 'peach' | 'lavender' | 'coral' | 'custom'
  description: string
  colors: ThemeColor
  isCustom: boolean
  createdAt: string
}
