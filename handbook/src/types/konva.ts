// Konva画布相关类型定义
// 保持与现有代码风格一致，使用中文注释和详细说明

/**
 * Konva画布舞台配置类型
 */
export interface KonvaStageConfig {
  /** 画布宽度 */
  width: number
  /** 画布高度 */
  height: number
  /** 画布X坐标偏移 */
  x?: number
  /** 画布Y坐标偏移 */
  y?: number
}

/**
 * Konva图片配置类型
 */
export interface KonvaImageConfig {
  /** 节点ID（用于事件与查找） */
  id?: string
  /** 图片对象 */
  image: HTMLImageElement | null
  /** X坐标位置 */
  x: number
  /** Y坐标位置 */
  y: number
  /** 图片宽度 */
  width: number
  /** 图片高度 */
  height: number
  /** 是否可拖拽 */
  draggable?: boolean
  /** 是否可选择 */
  selectable?: boolean
  /** 图片缩放X */
  scaleX?: number
  /** 图片缩放Y */
  scaleY?: number
  /** 旋转角度 */
  rotation?: number
  /** 透明度 */
  opacity?: number
}

/**
 * Konva文字配置类型
 */
export interface KonvaTextConfig {
  /** 文字内容 */
  text: string
  /** X坐标位置 */
  x: number
  /** Y坐标位置 */
  y: number
  /** 字体大小 */
  fontSize: number
  /** 字体族 */
  fontFamily: string
  /** 文字颜色 */
  fill: string
  /** 文字对齐方式 */
  align: 'left' | 'center' | 'right'
  /** 是否可拖拽 */
  draggable?: boolean
  /** 是否可选择 */
  selectable?: boolean
  /** 文字粗细 */
  fontWeight?: string | number
  /** 文字样式 */
  fontStyle?: string
  /** 行高 */
  lineHeight?: number
  /** 文字装饰 */
  textDecoration?: string
}

/**
 * Konva贴纸类型
 */
export interface KonvaSticker {
  /** 贴纸唯一标识 */
  id: string
  /** 贴纸名称 */
  name: string
  /** 贴纸配置 */
  config: KonvaImageConfig
  /** 贴纸类型 */
  type?: 'emoji' | 'icon' | 'image'
  /** 贴纸分类 */
  category?: string
}

/**
 * Konva画布状态类型
 */
export interface KonvaCanvasState {
  /** 背景图片配置 */
  backgroundImage: KonvaImageConfig | null
  /** 标题文字配置 */
  titleText: KonvaTextConfig | null
  /** 副标题文字配置 */
  subtitleText: KonvaTextConfig | null
  /** 贴纸列表 */
  stickers: KonvaSticker[]
  /** 画布尺寸 */
  dimensions: {
    width: number
    height: number
  }
  /** 画布缩放 */
  scale: {
    x: number
    y: number
  }
  /** 画布位置 */
  position: {
    x: number
    y: number
  }
}

/**
 * Konva选择变换器配置类型
 */
export interface KonvaTransformerConfig {
  /** 是否启用 */
  enabled?: boolean
  /** 边界限制函数 */
  boundBoxFunc?: (oldBox: any, newBox: any) => any
  /** 是否保持比例 */
  keepRatio?: boolean
  /** 是否旋转 */
  rotateEnabled?: boolean
  /** 是否缩放 */
  resizeEnabled?: boolean
  /** 锚点大小 */
  anchorSize?: number
  /** 锚点颜色 */
  anchorFill?: string
  /** 锚点描边 */
  anchorStroke?: string
  /** 锚点描边宽度 */
  anchorStrokeWidth?: number
  /** 边框颜色 */
  borderStroke?: string
  /** 边框宽度 */
  borderStrokeWidth?: number
}

/**
 * Konva画布事件类型
 */
export interface KonvaCanvasEvents {
  /** 背景图加载完成 */
  'background-load': [success: boolean]
  /** 贴纸更新 */
  'sticker-update': [stickers: KonvaSticker[]]
  /** 画布尺寸变化 */
  'canvas-resize': [dimensions: { width: number; height: number }]
  /** 画布内容变化 */
  'canvas-change': [state: KonvaCanvasState]
  /** 元素选择 */
  'element-select': [element: any]
  /** 元素拖拽 */
  'element-drag': [element: any, position: { x: number; y: number }]
  /** 元素变换 */
  'element-transform': [element: any, transform: any]
}

/**
 * Konva画布操作类型
 */
export interface KonvaCanvasOperations {
  /** 添加贴纸 */
  addSticker: (sticker: KonvaSticker) => void
  /** 移除贴纸 */
  removeSticker: (id: string) => void
  /** 更新贴纸 */
  updateSticker: (id: string, config: Partial<KonvaImageConfig>) => void
  /** 设置背景图 */
  setBackgroundImage: (image: HTMLImageElement | string) => void
  /** 更新文字 */
  updateText: (type: 'title' | 'subtitle', config: Partial<KonvaTextConfig>) => void
  /** 导出画布 */
  exportCanvas: (format?: 'png' | 'jpg', quality?: number) => string | null
  /** 清空画布 */
  clearCanvas: () => void
  /** 重置画布 */
  resetCanvas: () => void
}

/**
 * Konva画布性能配置类型
 */
export interface KonvaPerformanceConfig {
  /** 是否启用缓存 */
  enableCache?: boolean
  /** 缓存策略 */
  cacheStrategy?: 'auto' | 'manual' | 'none'
  /** 批量更新阈值 */
  batchUpdateThreshold?: number
  /** 渲染优化 */
  renderOptimization?: boolean
  /** 内存管理 */
  memoryManagement?: boolean
}
