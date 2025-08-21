import type { Project } from '@/types/project'
export { downloadImage } from '@/utils/konva-export'
import { exportCanvas as konvaExport } from '@/utils/konva-export'

export const exportCanvas = async (
  project: Project,
  format: 'png' | 'jpg',
  size: { width: number; height: number },
  quality: number = 0.9
) => {
  return konvaExport(project, format, size, quality)
}
