# 出片手账 Vue 3 Web版 完整需求文档

## 📋 文档信息
- **版本**: v1.0
- **创建日期**: 2024-01-20
- **项目**: 出片手账 Vue 3 Web版
- **目标平台**: Web (PC端优先，移动端适配)

## 🎯 项目概述

### 产品定位
"出片手账"是一款专为12-20岁小女生设计的Web应用，通过"可爱出片 + 温柔记录"的方式，让用户能够轻松创建可发朋友圈/小红书的图文内容，同时提供情绪价值与自我鼓励。

### 核心价值主张
- **即刻满足**: 一键套模板"变好看"，获得正向反馈与成就感
- **温柔陪伴**: 每日一句、自我肯定卡片、轻负担的情绪打卡
- **安全掌控**: 私密可控、无压力的"只给自己看也很美好"

### 目标用户
- **主要用户**: 12-20岁的小女生
- **次要用户**: 喜爱手帐风的年轻女性
- **用户特征**: 喜欢可爱、温馨、治愈的感觉，审美偏好粉色系、柔和色彩、圆润设计

## 🏗️ 技术架构

### 技术栈
- **前端框架**: Vue 3 + Composition API
- **开发语言**: TypeScript
- **构建工具**: Vite
- **UI组件库**: Element Plus (可定制主题)
- **状态管理**: Pinia
- **路由管理**: Vue Router
- **样式方案**: Tailwind CSS + 自定义CSS变量
- **图片处理**: Canvas API / Fabric.js
- **数据存储**: LocalStorage + JSON文件

### 项目结构
```
women_handbook/vue/
├── src/
│   ├── components/          # 组件
│   │   ├── ui/             # 基础UI组件
│   │   ├── layout/         # 布局组件
│   │   └── business/       # 业务组件
│   ├── views/              # 页面组件
│   ├── stores/             # Pinia状态管理
│   ├── types/              # TypeScript类型定义
│   ├── composables/        # 组合式函数
│   ├── utils/              # 工具函数
│   ├── assets/             # 静态资源
│   ├── router/             # 路由配置
│   ├── constants/          # 常量定义
│   └── styles/             # 样式文件
├── public/                 # 公共资源
├── mockup/                 # Mockup数据
│   ├── templates.json      # 模板数据
│   ├── projects.json       # 项目数据
│   ├── moods.json          # 情绪数据
│   └── themes.json         # 主题数据
└── docs/                   # 项目文档
```

## 🎨 设计系统

### 视觉风格
- **设计理念**: 少女心温暖风格，现代化治愈系
- **色彩系统**: 温暖粉色系为主，支持多主题色切换
- **字体系统**: 友好中文字体，温暖易读
- **圆角系统**: 圆润可爱，符合小女生审美
- **阴影系统**: 温暖粉色阴影，营造层次感

### 主题色系统
支持动态切换多种主题色：
- **粉色梦境**: 温柔浪漫的粉色系
- **紫色幻想**: 神秘优雅的紫色系
- **薄荷清新**: 清新自然的薄荷绿
- **桃子温暖**: 温暖治愈的桃子色
- **薰衣草温柔**: 温柔淡雅的薰衣草
- **珊瑚日落**: 活力四射的珊瑚色
- **自定义主题**: 用户可自定义主题色

### 响应式设计
- **PC端优先**: 1200px+ 大屏幕优化
- **平板适配**: 768px-1200px 中等屏幕
- **移动端适配**: <768px 小屏幕
- **触摸友好**: 支持触摸手势操作

## 📱 功能需求

### 1. 核心功能

#### 1.1 一键出片功能
**功能描述**: 用户选择模板，替换内容，生成精美图文

**详细需求**:
- **模板库**: 12款内置模板 (3套风格 x 4种比例)
  - 风格: 治愈系、元气系、温柔系、梦幻系
  - 比例: 1:1、4:5、9:16、3:4
- **内容替换**:
  - 图片替换 (最多9张)
  - 标题编辑 (≤30字)
  - 副标题编辑 (≤50字)
  - 日期显示
  - 贴纸添加 (最多20个)
- **滤镜系统**: 6种常用滤镜
  - 暖色、冷色、奶油、胶片、清透、黑白
- **花字系统**: 6种可爱字体
  - 字号调节 (12-48px)
  - 行距调节
  - 颜色选择 (8种预设色)
  - 对齐方式 (左对齐、居中、右对齐)
- **导出功能**:
  - 格式: PNG/JPG
  - 分辨率: 短边1080px
  - 保存到本地

#### 1.2 情绪打卡功能
**功能描述**: 用户记录每日情绪，生成情绪卡片

**详细需求**:
- **情绪选择**: 5档情绪表情
  - 开心、兴奋、平静、难过、生气
- **颜色选择**: 情绪色卡
- **短句记录**: 可选文字记录 (≤120字)
- **情绪日历**: 按日显示情绪色块
- **自动出片**: 打卡后生成情绪手账卡片

#### 1.3 主题色切换功能
**功能描述**: 用户可自由切换应用主题色

**详细需求**:
- **预设主题**: 6种预设主题色
- **自定义主题**: 用户可自定义主色调
- **主题预览**: 实时预览主题效果
- **主题收藏**: 收藏喜欢的主题
- **主题历史**: 记录使用过的主题

### 2. 辅助功能

#### 2.1 每日一句功能
**功能描述**: 提供每日自我肯定语句

**详细需求**:
- **内容库**: 120条内置肯定句
- **智能推荐**: 根据情绪推荐相关语句
- **随机显示**: 每日随机显示一条
- **收藏功能**: 收藏喜欢的语句

#### 2.2 私密安全功能
**功能描述**: 保护用户隐私和数据安全

**详细需求**:
- **应用锁定**: 支持密码锁定
- **本地存储**: 数据仅存储在本地
- **快速删除**: 长按删除，回收站7天恢复
- **数据导出**: 支持数据导出备份

#### 2.3 相册管理功能
**功能描述**: 管理用户创建的作品

**详细需求**:
- **作品展示**: 网格展示所有作品
- **分类筛选**: 按模板、日期、标签筛选
- **搜索功能**: 按标题、标签搜索
- **批量操作**: 批量删除、导出

## 📊 数据模型

### 核心实体

#### Template (模板)
```typescript
interface Template {
  id: string
  name: string
  description: string
  category: 'daily' | 'mood' | 'memory' | 'special'
  styleTag: string[]
  ratio: '1:1' | '4:5' | '9:16' | '3:4'
  thumbnail: string
  preview: string
  layers: Layer[]
  tags: string[]
  isPopular: boolean
  isNew: boolean
  version: number
  createdAt: string
}
```

#### Project (手账作品)
```typescript
interface Project {
  id: string
  name: string
  description: string
  templateId: string
  thumbnail: string
  content: ProjectContent
  tags: string[]
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

interface ProjectContent {
  title: string
  subtitle: string
  images: string[]
  stickers: string[]
  filters: string[]
  text: string
  mood: string
  colors: {
    primary: string
    secondary: string
    text: string
  }
}
```

#### MoodRecord (情绪记录)
```typescript
interface MoodRecord {
  id: string
  date: string
  mood: string
  intensity: number // 1-10
  description: string
  tags: string[]
  image?: string
  cardProjectId?: string
  createdAt: string
}
```

#### Theme (主题)
```typescript
interface Theme {
  id: string
  name: string
  category: 'pink' | 'purple' | 'mint' | 'peach' | 'lavender' | 'coral' | 'custom'
  description: string
  colors: ThemeColor
  isCustom: boolean
  createdAt: string
}

interface ThemeColor {
  id: string
  name: string
  primary: string
  primaryHover: string
  primaryPressed: string
  secondary: string
  accent: string
  preview: string
}
```

### Mockup数据文件

#### templates.json
```json
{
  "templates": [
    {
      "id": "daily-001",
      "name": "今日心情",
      "description": "记录每一天的美好心情",
      "category": "daily",
      "styleTag": ["日常", "心情", "简约"],
      "ratio": "4:5",
      "thumbnail": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&q=80",
      "preview": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",
      "tags": ["日常", "心情", "简约"],
      "isPopular": true,
      "isNew": false,
      "version": 1,
      "createdAt": "2024-01-01"
    }
  ]
}
```

#### themes.json
```json
{
  "themes": [
    {
      "id": "pink-dream",
      "name": "粉色梦境",
      "category": "pink",
      "description": "温柔浪漫的粉色系",
      "colors": {
        "id": "pink-dream",
        "name": "粉色梦境",
        "primary": "#ff6b9d",
        "primaryHover": "#ff5a8c",
        "primaryPressed": "#ff4a7a",
        "secondary": "#ffeef4",
        "accent": "#ffb3d1",
        "preview": "#ff6b9d"
      },
      "isCustom": false,
      "createdAt": "2024-01-01"
    }
  ]
}
```

## 🎯 用户界面需求

### 页面结构

#### 主要页面
1. **首页/模板选择页** (`/`)
   - 模板分类展示
   - 热门模板推荐
   - 搜索和筛选功能

2. **编辑器页面** (`/editor/:id`)
   - 模板预览
   - 内容编辑面板
   - 实时预览
   - 导出功能

3. **情绪打卡页面** (`/mood`)
   - 情绪选择器
   - 颜色选择器
   - 文字记录
   - 情绪卡片生成

4. **情绪日历页面** (`/mood-calendar`)
   - 月度情绪日历
   - 情绪统计
   - 历史记录查看

5. **相册页面** (`/album`)
   - 作品网格展示
   - 分类筛选
   - 搜索功能
   - 批量操作

6. **设置页面** (`/settings`)
   - 主题色设置
   - 隐私安全设置
   - 数据管理
   - 关于应用

#### 辅助页面
- **主题选择器** (`/themes`)
- **每日一句** (`/daily-quote`)
- **帮助支持** (`/help`)
- **关于我们** (`/about`)

### 组件设计

#### 基础组件
- **BaseButton**: 按钮组件，支持多种样式
- **BaseInput**: 输入框组件
- **BaseCard**: 卡片组件
- **BaseModal**: 模态框组件
- **BaseLoading**: 加载组件

#### 业务组件
- **TemplateCard**: 模板卡片
- **MoodSelector**: 情绪选择器
- **ColorPicker**: 颜色选择器
- **ImageEditor**: 图片编辑器
- **StickerGrid**: 贴纸网格
- **FilterGrid**: 滤镜网格
- **ThemeSelector**: 主题选择器

#### 布局组件
- **AppHeader**: 应用头部
- **AppSidebar**: 侧边栏
- **AppFooter**: 应用底部
- **AppLayout**: 主布局

## 🔧 技术实现要点

### 状态管理
使用Pinia进行状态管理，主要Store：
- **TemplateStore**: 模板管理
- **ProjectStore**: 作品管理
- **MoodStore**: 情绪记录
- **ThemeStore**: 主题管理
- **UserStore**: 用户设置

### 路由设计
```typescript
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/create',
    name: 'Create',
    component: () => import('@/views/Create.vue')
  },
  {
    path: '/editor/:id',
    name: 'Editor',
    component: () => import('@/views/Editor.vue')
  },
  {
    path: '/mood',
    name: 'Mood',
    component: () => import('@/views/Mood.vue')
  },
  {
    path: '/mood-calendar',
    name: 'MoodCalendar',
    component: () => import('@/views/MoodCalendar.vue')
  },
  {
    path: '/album',
    name: 'Album',
    component: () => import('@/views/Album.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings.vue')
  }
]
```

### 性能优化
- **图片懒加载**: 使用Intersection Observer
- **组件懒加载**: 路由级别的代码分割
- **虚拟滚动**: 大量数据列表优化
- **图片压缩**: 上传前自动压缩
- **缓存策略**: 合理使用浏览器缓存

### 兼容性要求
- **浏览器支持**: Chrome 90+, Firefox 88+, Safari 14+
- **移动端支持**: iOS Safari 14+, Chrome Mobile 90+
- **响应式设计**: 支持320px-1920px屏幕
- **触摸支持**: 支持触摸手势操作

## 📋 开发计划

### 第一阶段: 项目基础 (3-4天)
- [ ] 项目初始化和配置
- [ ] 基础类型定义
- [ ] 路由配置
- [ ] 基础组件开发

### 第二阶段: 核心功能 (7-10天)
- [ ] 模板系统实现
- [ ] 编辑器功能
- [ ] 情绪打卡功能
- [ ] 主题切换功能

### 第三阶段: 数据管理 (3-4天)
- [ ] Mockup数据文件
- [ ] 状态管理实现
- [ ] 本地存储功能

### 第四阶段: 用户体验 (5-7天)
- [ ] 响应式设计
- [ ] 动画效果
- [ ] 错误处理
- [ ] 加载状态

### 第五阶段: 测试优化 (3-5天)
- [ ] 功能测试
- [ ] 性能优化
- [ ] 兼容性测试
- [ ] 用户体验测试

## 🎯 验收标准

### 功能验收
- [ ] 所有核心功能正常工作
- [ ] 主题切换功能正常
- [ ] 数据持久化正常
- [ ] 导出功能正常

### 性能验收
- [ ] 页面加载时间 < 3秒
- [ ] 图片处理流畅
- [ ] 内存使用合理
- [ ] 响应式设计正常

### 用户体验验收
- [ ] 界面美观，符合目标用户审美
- [ ] 操作流程简单直观
- [ ] 错误提示友好
- [ ] 移动端体验良好

## 🚀 后续规划

### 短期目标 (1-2个月)
- 完成MVP版本开发
- 基础功能测试和优化
- 用户体验改进

### 中期目标 (3-6个月)
- 添加更多模板和贴纸
- 实现云端同步功能
- 添加社交分享功能

### 长期目标 (6个月以上)
- 开发移动端原生应用
- 添加AI智能推荐
- 建立用户社区

## 📝 总结

本需求文档基于原有的产品定位和用户需求，结合Vue 3技术栈的特点，为"出片手账"Web版提供了完整的功能规划和技术实现方案。重点关注：

1. **用户导向**: 专门针对12-20岁小女生的审美和需求
2. **技术现代化**: 使用Vue 3 + TypeScript + Vite等现代技术栈
3. **设计温暖化**: 少女心温暖风格，支持多主题色切换
4. **功能完整性**: 覆盖出片、打卡、主题切换等核心功能
5. **数据本地化**: 使用JSON文件存储Mockup数据，支持本地存储

通过这个方案，我们可以快速开发出一个既符合目标用户审美，又具备现代化技术架构的Web应用。
