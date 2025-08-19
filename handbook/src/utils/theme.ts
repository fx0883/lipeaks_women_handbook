import type { Theme } from '@/types/theme'

/**
 * 应用主题到 CSS 变量
 * @param theme 主题对象
 */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement.style
  
  // 注入主题色变量
  root.setProperty('--themePrimary', theme.colors.primary)
  root.setProperty('--themePrimaryHover', theme.colors.primaryHover)
  root.setProperty('--themePrimaryPressed', theme.colors.primaryPressed)
  root.setProperty('--themeSecondary', theme.colors.secondary)
  root.setProperty('--themeAccent', theme.colors.accent)
  
  // 桥接到原型变量 - 确保原型风格不被破坏
  root.setProperty('--colorBrandBackground', theme.colors.primary)
  root.setProperty('--colorBrandBackgroundHover', theme.colors.primaryHover)
  root.setProperty('--colorBrandBackgroundPressed', theme.colors.primaryPressed)
  
  // 粉色系桥接 - 保持原型命名兼容性
  root.setProperty('--pink-light', theme.colors.secondary)
  root.setProperty('--pink-medium', theme.colors.accent)
  root.setProperty('--pink-dark', theme.colors.primary)
}

/**
 * 重置为默认粉色主题
 */
export function resetToDefaultTheme(): void {
  const defaultTheme: Theme = {
    id: 'pink-dream',
    name: '粉色梦境',
    category: 'pink',
    description: '温柔浪漫的粉色系',
    colors: {
      id: 'pink-dream',
      name: '粉色梦境',
      primary: '#ff6b9d',
      primaryHover: '#ff5a8c',
      primaryPressed: '#ff4a7a',
      secondary: '#ffeef4',
      accent: '#ffb3d1',
      preview: '#ff6b9d'
    },
    isCustom: false,
    createdAt: '2024-01-01'
  }
  
  applyTheme(defaultTheme)
}

/**
 * 获取当前主题色值
 */
export function getCurrentThemeColors(): Record<string, string> {
  const root = document.documentElement.style
  return {
    primary: root.getPropertyValue('--themePrimary') || '#ff6b9d',
    primaryHover: root.getPropertyValue('--themePrimaryHover') || '#ff5a8c',
    primaryPressed: root.getPropertyValue('--themePrimaryPressed') || '#ff4a7a',
    secondary: root.getPropertyValue('--themeSecondary') || '#ffeef4',
    accent: root.getPropertyValue('--themeAccent') || '#ffb3d1'
  }
}
