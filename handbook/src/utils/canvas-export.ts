import type { Project } from '@/types/project'

let fabricNS: any = null
async function getFabric() {
  if (fabricNS) return fabricNS
  const mod: any = await import('fabric')
  fabricNS = mod?.fabric || mod
  return fabricNS
}

// 导出画布为图片
export const exportCanvas = async (
  project: Project,
  format: 'png' | 'jpg',
  size: { width: number; height: number },
  quality: number = 0.9
): Promise<Blob> => {
  const f = await getFabric()
  
  // 创建临时画布
  const canvas = new f.Canvas(null, {
    width: size.width,
    height: size.height,
    backgroundColor: '#ffffff'
  })
  
  try {
    // 重建画布内容
    await rebuildCanvas(canvas, project, size)
    
    // 导出为Blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob: Blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('导出失败'))
          }
        },
        format === 'jpg' ? 'image/jpeg' : 'image/png',
        format === 'jpg' ? quality : undefined
      )
    })
  } finally {
    // 清理画布
    canvas.dispose()
  }
}

// 重建画布内容
const rebuildCanvas = async (
  canvas: any,
  project: Project,
  size: { width: number; height: number }
): Promise<void> => {
  const f = await getFabric()
  
  // 1. 设置背景图片
  if (project.thumbnail) {
    try {
      await new Promise<void>((resolve, reject) => {
        f.Image.fromURL(
          project.thumbnail,
          (img: any) => {
            // 调整图片尺寸以适应画布
            const scale = Math.max(
              size.width / img.width!,
              size.height / img.height!
            )
            img.set({
              originX: 'left',
              originY: 'top',
              left: 0,
              top: 0,
              scaleX: scale,
              scaleY: scale
            })
            canvas.setBackgroundImage(img, () => {
              canvas.renderAll()
              resolve()
            })
          },
          { crossOrigin: 'anonymous' }
        )
      })
    } catch (error) {
      console.warn('背景图片加载失败:', error)
    }
  }
  
  // 2. 应用滤镜效果
  if (project.content.filters && project.content.filters.length > 0) {
    const filter = project.content.filters[0]
    applyFilter(canvas, filter)
  }
  
  // 3. 添加文字
  if (project.content.title || project.content.subtitle) {
    await addTextToCanvas(canvas, project.content, size)
  }
  
  // 4. 添加贴纸（如果有）
  if (project.content.stickers && project.content.stickers.length > 0) {
    await addStickersToCanvas(canvas, project.content.stickers, size)
  }
  
  // 5. 应用边框
  if (project.content.borderStyle && project.content.borderStyle !== 'none') {
    await applyBorder(canvas, project.content, size)
  }
  
  canvas.renderAll()
}

// 应用滤镜效果
const applyFilter = (canvas: any, filter: string): void => {
  // 这里可以根据不同的滤镜类型应用相应的效果
  // 由于Fabric.js的滤镜功能比较复杂，这里先简化处理
  console.log('应用滤镜:', filter)
}

// 添加文字到画布
const addTextToCanvas = async (
  canvas: any,
  content: Project['content'],
  size: { width: number; height: number }
): Promise<void> => {
  const f = await getFabric()
  
  // 标题
  if (content.title) {
    const titleText = new f.Text(content.title, {
      left: size.width / 2,
      top: size.height / 2 - 30,
      originX: 'center',
      originY: 'center',
      fontSize: content.fontSize || 24,
      fontFamily: getFontFamily(content.fontStyle),
      fill: content.colors?.text || '#333333',
      textAlign: content.textAlign || 'center'
    })
    canvas.add(titleText)
  }
  
  // 副标题
  if (content.subtitle) {
    const subtitleText = new f.Text(content.subtitle, {
      left: size.width / 2,
      top: size.height / 2 + 20,
      originX: 'center',
      originY: 'center',
      fontSize: Math.round((content.fontSize || 24) * 0.75),
      fontFamily: getFontFamily(content.fontStyle),
      fill: content.colors?.text || '#333333',
      textAlign: content.textAlign || 'center'
    })
    canvas.add(subtitleText)
  }
}

// 获取字体族
const getFontFamily = (fontStyle?: string): string => {
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

// 添加贴纸到画布
const addStickersToCanvas = async (
  canvas: any,
  stickers: string[],
  size: { width: number; height: number }
): Promise<void> => {
  const f = await getFabric()
  
  for (const stickerUrl of stickers) {
    try {
      await new Promise<void>((resolve, reject) => {
        f.Image.fromURL(
          stickerUrl,
          (img: any) => {
            const targetWidth = Math.min(160, size.width * 0.25)
            const scale = targetWidth / img.width!
            img.set({
              left: size.width / 2,
              top: size.height / 2,
              originX: 'center',
              originY: 'center',
              scaleX: scale,
              scaleY: scale
            })
            canvas.add(img)
            resolve()
          },
          { crossOrigin: 'anonymous' }
        )
      })
    } catch (error) {
      console.warn('贴纸加载失败:', error)
    }
  }
}

// 应用边框
const applyBorder = async (
  canvas: any,
  content: Project['content'],
  size: { width: number; height: number }
): Promise<void> => {
  const f = await getFabric()
  
  if (content.borderStyle && content.borderStyle !== 'none' && content.borderWidth && content.borderWidth > 0) {
    const borderRect = new f.Rect({
      left: content.borderWidth! / 2,
      top: content.borderWidth! / 2,
      width: size.width - content.borderWidth!,
      height: size.height - content.borderWidth!,
      fill: 'transparent',
      stroke: content.borderColor || '#000000',
      strokeWidth: content.borderWidth,
      strokeDashArray: getBorderDashArray(content.borderStyle),
      rx: content.borderRadius || 0,
      ry: content.borderRadius || 0
    })
    canvas.add(borderRect)
  }
}

// 获取边框虚线样式
const getBorderDashArray = (borderStyle: string): number[] | undefined => {
  switch (borderStyle) {
    case 'dashed':
      return [10, 5]
    case 'dotted':
      return [2, 2]
    default:
      return undefined
  }
}

// 下载图片
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
