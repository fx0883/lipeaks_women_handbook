import Konva from 'konva'
import type { Project } from '@/types/project'

// 加载图片（支持跨域）
async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('图片加载失败'))
    img.src = url
  })
}

// dataURL 转 Blob
async function dataURLToBlob(dataURL: string): Promise<Blob> {
  // 更兼容的方式：使用 fetch 转换
  const res = await fetch(dataURL)
  return await res.blob()
}

// 获取字体族
function getFontFamily(fontStyle?: string): string {
  switch (fontStyle) {
    case 'rounded':
      return '"Arial Rounded MT Bold", ui-rounded, system-ui, sans-serif'
    case 'hand':
      return 'KaiTi, STKaiti, "DFKai-SB", cursive'
    case 'serif':
      return 'ui-serif, STSong, SimSun, serif'
    default:
      return 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial'
  }
}

// 适配边框虚线样式
function getBorderDashArray(borderStyle?: string): number[] | undefined {
  switch (borderStyle) {
    case 'dashed':
      return [10, 5]
    case 'dotted':
      return [2, 2]
    default:
      return undefined
  }
}

// 重建画布内容到 Konva 舞台
async function rebuildStage(
  stage: Konva.Stage,
  project: Project,
  size: { width: number; height: number }
): Promise<void> {
  const layer = new Konva.Layer()
  stage.add(layer)

  // 背景色（白色）
  const backgroundRect = new Konva.Rect({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    fill: '#ffffff'
  })
  layer.add(backgroundRect)

  // 1. 背景图片
  if (project.thumbnail) {
    try {
      const img = await loadImage(project.thumbnail)
      const scale = Math.max(size.width / (img.width || 1), size.height / (img.height || 1))
      const imageNode = new Konva.Image({
        image: img,
        x: 0,
        y: 0,
        width: (img.width || 0) * scale,
        height: (img.height || 0) * scale
      })
      // 覆盖裁切：左上对齐已覆盖整个画布
      // 若图片宽高不等，可能会超过画布边界，这是符合“cover”的期望
      layer.add(imageNode)
    } catch (e) {
      console.warn('背景图片加载失败:', e)
    }
  }

  const content = project.content || ({} as Project['content'])

  // 若 content.composited 为真，说明缩略图已包含叠加内容，避免二次叠加
  const skipOverlay = !!(content as any).composited

  // 2. 文字：标题
  if (!skipOverlay && content.title) {
    const title = new Konva.Text({
      text: content.title,
      x: 0,
      y: Math.max(10, size.height / 2 - 30),
      width: size.width,
      align: (content.textAlign as any) || 'center',
      fontSize: content.fontSize || 24,
      fontFamily: getFontFamily(content.fontStyle),
      fill: content.colors?.text || '#333333'
    })
    layer.add(title)
  }

  // 3. 文字：副标题
  if (!skipOverlay && content.subtitle) {
    const subtitle = new Konva.Text({
      text: content.subtitle,
      x: 0,
      y: Math.min(size.height - 30, size.height / 2 + 20),
      width: size.width,
      align: (content.textAlign as any) || 'center',
      fontSize: Math.round((content.fontSize || 24) * 0.75),
      fontFamily: getFontFamily(content.fontStyle),
      fill: content.colors?.text || '#666666'
    })
    layer.add(subtitle)
  }

  // 4. 贴纸（如果保存了 URL 列表）
  if (Array.isArray(content.stickers) && content.stickers.length > 0) {
    for (const stickerUrl of content.stickers as unknown as string[]) {
      try {
        const img = await loadImage(stickerUrl)
        const targetWidth = Math.min(160, size.width * 0.25)
        const ratio = img.width ? targetWidth / img.width : 1
        const sticker = new Konva.Image({
          image: img,
          x: size.width / 2,
          y: size.height / 2,
          width: Math.round((img.width || 0) * ratio),
          height: Math.round((img.height || 0) * ratio),
          offsetX: Math.round(((img.width || 0) * ratio) / 2),
          offsetY: Math.round(((img.height || 0) * ratio) / 2)
        })
        layer.add(sticker)
      } catch (e) {
        console.warn('贴纸加载失败:', e)
      }
    }
  }

  // 5. 边框
  if (!skipOverlay && content.borderStyle && content.borderStyle !== 'none' && (content.borderWidth || 0) > 0) {
    const bw = content.borderWidth || 1
    const rect = new Konva.Rect({
      x: bw / 2,
      y: bw / 2,
      width: size.width - bw,
      height: size.height - bw,
      stroke: content.borderColor || '#000000',
      strokeWidth: bw,
      dash: getBorderDashArray(content.borderStyle),
      cornerRadius: content.borderRadius || 0
    })
    layer.add(rect)
  }

  layer.draw()
}

// 导出画布为图片（API 兼容）
export const exportCanvas = async (
  project: Project,
  format: 'png' | 'jpg',
  size: { width: number; height: number },
  quality: number = 0.9
): Promise<Blob> => {
  // 创建离屏容器
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.left = '-99999px'
  container.style.top = '-99999px'
  container.style.width = `${size.width}px`
  container.style.height = `${size.height}px`
  document.body.appendChild(container)

  try {
    // 创建Stage
    const stage = new Konva.Stage({
      container,
      width: size.width,
      height: size.height
    })

    await rebuildStage(stage, project, size)

    // 导出
    const dataURL = stage.toDataURL({
      mimeType: format === 'jpg' ? 'image/jpeg' : 'image/png',
      quality: format === 'jpg' ? quality : 1
    })

    return await dataURLToBlob(dataURL)
  } finally {
    // 清理
    document.body.removeChild(container)
  }
}

// 下载图片（API 兼容）
export const downloadImage = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
