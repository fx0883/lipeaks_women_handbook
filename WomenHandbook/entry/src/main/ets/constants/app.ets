/**
 * 应用常量定义
 */

// 应用基础信息接口
export interface AppInfo {
  NAME: string
  VERSION: string
  DESCRIPTION: string
}

// 存储键值接口
export interface StorageKeys {
  TODOS: string
  USER_PREFERENCES: string
  THEME: string
  LAST_BACKUP: string
}

// 分页配置接口
export interface PaginationConfig {
  DEFAULT_PAGE_SIZE: number
  MAX_PAGE_SIZE: number
}

// 时间常量接口
export interface TimeConstants {
  DEBOUNCE_DELAY: number
  ANIMATION_DURATION: number
  TOAST_DURATION: number
}

// 验证规则接口
export interface ValidationRules {
  TODO_TITLE_MAX_LENGTH: number
  TODO_DESCRIPTION_MAX_LENGTH: number
  TAG_MAX_COUNT: number
  TAG_MAX_LENGTH: number
}

// 应用基础信息
export const APP_INFO: AppInfo = {
  NAME: '女性手账',
  VERSION: '1.0.0',
  DESCRIPTION: '专为女性设计的智能手账应用'
}

// 存储相关常量
export const STORAGE_KEYS: StorageKeys = {
  TODOS: 'handbook_todos',
  USER_PREFERENCES: 'handbook_user_preferences',
  THEME: 'handbook_theme',
  LAST_BACKUP: 'handbook_last_backup'
}

// 分页相关常量
export const PAGINATION: PaginationConfig = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100
}

// 时间相关常量
export const TIME_CONSTANTS: TimeConstants = {
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  TOAST_DURATION: 2000
}

// 验证规则常量
export const VALIDATION: ValidationRules = {
  TODO_TITLE_MAX_LENGTH: 100,
  TODO_DESCRIPTION_MAX_LENGTH: 500,
  TAG_MAX_COUNT: 10,
  TAG_MAX_LENGTH: 20
}

// 主题色彩接口
export interface ThemeColorScheme {
  PRIMARY: string
  SECONDARY: string
  ACCENT: string
  BACKGROUND: string
  SURFACE: string
  TEXT_PRIMARY: string
  TEXT_SECONDARY: string
}

export interface ThemeColors {
  PINK: ThemeColorScheme
  MINT: ThemeColorScheme
  DARK: ThemeColorScheme
}

// 响应式断点接口
export interface Breakpoints {
  XS: number
  SM: number
  MD: number
  LG: number
  XL: number
}

// 动画时长接口
export interface AnimationDuration {
  FAST: number
  NORMAL: number
  SLOW: number
}

// 动画曲线接口
export interface AnimationCurve {
  EASE: string
  EASE_IN: string
  EASE_OUT: string
  EASE_IN_OUT: string
}

// 动画配置接口
export interface AnimationConfig {
  DURATION: AnimationDuration
  CURVE: AnimationCurve
}

// 主题色彩常量
export const THEME_COLORS: ThemeColors = {
  // 粉色主题
  PINK: {
    PRIMARY: '#ff6b9d',
    SECONDARY: '#ffb3d1',
    ACCENT: '#ff8fab',
    BACKGROUND: '#fff5f9',
    SURFACE: '#ffffff',
    TEXT_PRIMARY: '#333333',
    TEXT_SECONDARY: '#666666'
  },
  
  // 薄荷主题
  MINT: {
    PRIMARY: '#4ecdc4',
    SECONDARY: '#95e1d3',
    ACCENT: '#6bccc4',
    BACKGROUND: '#f0fffe',
    SURFACE: '#ffffff',
    TEXT_PRIMARY: '#333333',
    TEXT_SECONDARY: '#666666'
  },
  
  // 深色主题
  DARK: {
    PRIMARY: '#bb86fc',
    SECONDARY: '#d1c4e9',
    ACCENT: '#cf6679',
    BACKGROUND: '#121212',
    SURFACE: '#1e1e1e',
    TEXT_PRIMARY: '#ffffff',
    TEXT_SECONDARY: '#b3b3b3'
  }
}

// 响应式断点
export const BREAKPOINTS: Breakpoints = {
  XS: 360,  // 超小屏
  SM: 600,  // 小屏
  MD: 840,  // 中屏
  LG: 1024, // 大屏
  XL: 1440  // 超大屏
}

// 动画配置
export const ANIMATION_CONFIG: AnimationConfig = {
  DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500
  },
  CURVE: {
    EASE: 'ease',
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out'
  }
}
