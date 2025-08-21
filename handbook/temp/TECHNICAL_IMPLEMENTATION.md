# 出片功能技术实现指南

## 🏗️ 整体架构

```
Editor页面 → ProjectStore → LocalStorage
     ↓
Export页面 ← ProjectStore ← URL参数
     ↓
Fabric.js画布 → Canvas导出 → 图片下载
```

---

## 🔧 关键技术点

### 1. Fabric.js画布导出

#### 核心方法
```typescript
// 导出画布为图片
const exportCanvas = (format: 'png' | 'jpg', quality: number = 0.9) => {
  if (!canvas) return
  
  const dataURL = canvas.toDataURL({
    format: format,
    quality: quality,
    multiplier: 2 // 提高导出质量
  })
  
  // 创建下载链接
  const link = document.createElement('a')
  link.download = `project-${Date.now()}.${format}`
  link.href = dataURL
  link.click()
}
```

#### 注意事项
- 使用`multiplier: 2`提高导出质量
- 大尺寸导出时注意内存使用
- 确保画布内容完全渲染后再导出

### 2. 项目数据保存

#### 数据结构
```typescript
interface Project {
  id: string
  name: string
  templateId: string
  content: {
    title: string
    subtitle: string
    images: string[]
    stickers: string[]
    filters: string[]
    ratio: string
    // ... 其他编辑内容
  }
  createdAt: string
  updatedAt: string
}
```

#### 保存逻辑
```typescript
const saveProject = async () => {
  try {
    const projectData = {
      id: projectId.value || generateId(),
      name: projectName.value,
      templateId: route.params.id as string,
      content: {
        title: titleText.value,
        subtitle: subtitleText.value,
        images: getCanvasImages(),
        stickers: getCanvasStickers(),
        filters: [selectedFilter.value],
        ratio: templateRatio.value,
        // ... 其他内容
      },
      updatedAt: new Date().toISOString()
    }
    
    if (projectId.value) {
      projectStore.updateProject(projectId.value, projectData)
    } else {
      projectStore.addProject(projectData)
      projectId.value = projectData.id
    }
    
    showSuccessMessage('项目保存成功')
  } catch (error) {
    showErrorMessage('保存失败，请重试')
  }
}
```

### 3. 数据流传递

#### URL参数传递
```typescript
// Editor页面跳转到Export
const goToExport = () => {
  router.push({
    path: '/export',
    query: { 
      project: projectId.value,
      template: route.params.id 
    }
  })
}
```

#### Export页面接收数据
```typescript
// Export页面加载项目数据
const loadProjectData = async () => {
  const projectId = route.query.project as string
  const templateId = route.query.template as string
  
  if (projectId) {
    const project = projectStore.getById(projectId)
    if (project) {
      projectData.value = project
      projectName.value = project.name
      // ... 加载其他数据
    }
  }
}
```

---

## 📁 文件结构

```
handbook/src/
├── data/
│   ├── templates.json          # 模板数据
│   ├── projects.json           # 项目数据
│   └── todoMockData.json       # 现有数据
├── stores/
│   └── project.ts              # 项目状态管理
├── types/
│   └── project.ts              # 类型定义
├── views/
│   ├── Editor.vue              # 编辑页面
│   └── Export.vue              # 导出页面
└── utils/
    └── canvas-export.ts        # 画布导出工具
```

---

## 🎯 实现步骤详解

### 步骤1: 创建数据文件

#### templates.json
```json
{
  "templates": [
    {
      "id": "campus-collage",
      "name": "校园日常拼贴",
      "category": "校园",
      "ratio": "4:5",
      "preview": "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=1200&q=80",
      "description": "记录校园生活的美好瞬间",
      "tags": ["校园", "日常", "拼贴"]
    }
    // ... 更多模板
  ]
}
```

#### projects.json
```json
{
  "projects": [
    {
      "id": "project-001",
      "name": "我的校园时光",
      "templateId": "campus-collage",
      "content": {
        "title": "我的美好时光",
        "subtitle": "记录生活中的小确幸",
        "images": [],
        "stickers": [],
        "filters": ["origin"],
        "ratio": "4:5"
      },
      "createdAt": "2024-01-20T10:00:00Z",
      "updatedAt": "2024-01-20T10:00:00Z"
    }
  ]
}
```

### 步骤2: Editor保存功能

#### 添加保存按钮
```vue
<template>
  <div class="preview-main-actions">
    <button class="btn ghost" @click="togglePreviewMode">
      {{ previewMode ? '编辑' : '预览' }}
    </button>
    <button class="btn primary" @click="saveProject">
      {{ isSaving ? '保存中...' : '保存' }}
    </button>
    <button class="btn primary" @click="goToExport">
      导出
    </button>
  </div>
</template>
```

#### 保存逻辑实现
```typescript
const isSaving = ref(false)

const saveProject = async () => {
  if (isSaving.value) return
  
  isSaving.value = true
  try {
    await saveProjectData()
    showSuccessMessage('保存成功')
  } catch (error) {
    showErrorMessage('保存失败')
  } finally {
    isSaving.value = false
  }
}
```

### 步骤3: Export导出功能

#### 画布导出实现
```typescript
const exportCanvas = async (format: string, size: any) => {
  if (!canvas) return
  
  // 临时调整画布尺寸
  const originalWidth = canvas.getWidth()
  const originalHeight = canvas.getHeight()
  
  canvas.setWidth(size.width)
  canvas.setHeight(size.height)
  canvas.renderAll()
  
  try {
    const dataURL = canvas.toDataURL({
      format: format === 'jpg' ? 'jpeg' : 'png',
      quality: format === 'jpg' ? exportQuality.value : 1,
      multiplier: 2
    })
    
    // 下载文件
    downloadImage(dataURL, format)
  } finally {
    // 恢复原始尺寸
    canvas.setWidth(originalWidth)
    canvas.setHeight(originalHeight)
    canvas.renderAll()
  }
}
```

#### 下载功能
```typescript
const downloadImage = (dataURL: string, format: string) => {
  const link = document.createElement('a')
  link.download = `handbook-${Date.now()}.${format}`
  link.href = dataURL
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // 添加到导出历史
  addToExportHistory(format, size)
}
```

---

## ⚠️ 注意事项

### 性能优化
1. **画布尺寸**: 导出大尺寸时临时调整，完成后恢复
2. **内存管理**: 及时释放不需要的图片资源
3. **防抖保存**: 避免频繁保存操作

### 错误处理
1. **网络错误**: 图片加载失败时的降级处理
2. **存储错误**: localStorage配额不足时的处理
3. **导出错误**: 画布状态异常时的错误提示

### 兼容性
1. **浏览器支持**: 检查Fabric.js和Canvas API支持
2. **移动端**: 触摸操作和响应式设计
3. **文件大小**: 导出文件大小限制

---

## 🧪 测试要点

### 功能测试
- [ ] 编辑内容保存
- [ ] 画布导出功能
- [ ] 数据流传递
- [ ] 导出历史记录

### 性能测试
- [ ] 大尺寸导出速度
- [ ] 内存使用情况
- [ ] 保存响应时间

### 兼容性测试
- [ ] 不同浏览器
- [ ] 不同设备
- [ ] 不同网络环境

---

## 📚 参考资料

- [Fabric.js官方文档](http://fabricjs.com/)
- [Canvas API文档](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Pinia状态管理](https://pinia.vuejs.org/)

---

*最后更新: 2024-01-20*
*版本: v1.0*
