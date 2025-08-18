# 出片手账 设计系统详细规范

## 📖 文档信息
- **版本**: v1.0
- **项目**: 出片手账 Vue 3 Web版
- **更新时间**: 2024-01-20
- **目标**: 为AI提供完整的设计系统规范，确保UI/UX的一致性

## 🎯 设计理念

### 核心设计原则
- **少女心温暖**: 专为12-20岁小女生设计的温暖治愈风格
- **现代化简约**: 保持现代扁平化设计，避免过度装饰
- **情感连接**: 通过色彩和交互建立情感共鸣
- **易用性优先**: 操作简单直观，降低学习成本
- **一致性**: 统一的设计语言和交互模式

### 设计价值观
- **温暖**: 使用温暖的色彩和柔和的视觉效果
- **治愈**: 通过设计元素传递正能量和治愈感
- **可爱**: 符合小女生审美的可爱元素
- **现代**: 保持技术感和时尚感
- **安全**: 营造安全可控的使用环境

## 🎨 色彩系统

### 主色调定义

#### 粉色梦境主题
```css
:root {
  /* 主色调 */
  --color-primary: #ff6b9d;
  --color-primary-hover: #ff5a8c;
  --color-primary-pressed: #ff4a7a;
  --color-primary-light: #ffb3d1;
  --color-primary-lighter: #ffeef4;
  
  /* 辅助色 */
  --color-secondary: #f8f0f5;
  --color-accent: #ff9ec4;
  --color-success: #7dd3fc;
  --color-warning: #fbbf24;
  --color-error: #f87171;
  
  /* 中性色 */
  --color-text-primary: #1f2937;
  --color-text-secondary: #6b7280;
  --color-text-tertiary: #9ca3af;
  --color-border: #e5e7eb;
  --color-background: #ffffff;
  --color-surface: #fafafa;
}
```

#### 紫色幻想主题
```css
:root {
  --color-primary: #a855f7;
  --color-primary-hover: #9333ea;
  --color-primary-pressed: #7c3aed;
  --color-primary-light: #c4b5fd;
  --color-primary-lighter: #f3f4f6;
  
  --color-secondary: #f8f7ff;
  --color-accent: #ddd6fe;
  --color-success: #7dd3fc;
  --color-warning: #fbbf24;
  --color-error: #f87171;
}
```

#### 薄荷清新主题
```css
:root {
  --color-primary: #10b981;
  --color-primary-hover: #059669;
  --color-primary-pressed: #047857;
  --color-primary-light: #6ee7b7;
  --color-primary-lighter: #ecfdf5;
  
  --color-secondary: #f0fdf4;
  --color-accent: #a7f3d0;
  --color-success: #7dd3fc;
  --color-warning: #fbbf24;
  --color-error: #f87171;
}
```

### 色彩使用规范

#### 主色调使用
- **主要操作**: 按钮、链接、重要信息
- **品牌标识**: Logo、品牌元素
- **状态指示**: 选中状态、激活状态

#### 辅助色使用
- **成功状态**: 完成操作、正面反馈
- **警告状态**: 提醒、注意信息
- **错误状态**: 错误提示、危险操作
- **信息状态**: 提示信息、说明文字

#### 中性色使用
- **文字层级**: 主标题、副标题、正文、辅助文字
- **边框线条**: 分割线、边框、轮廓
- **背景层次**: 主背景、卡片背景、遮罩层

## 📝 字体系统

### 字体族定义
```css
:root {
  /* 中文字体 */
  --font-family-cn: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', sans-serif;
  
  /* 英文字体 */
  --font-family-en: 'Inter', 'Segoe UI', 'Roboto', sans-serif;
  
  /* 数字字体 */
  --font-family-number: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
}
```

### 字体大小规范
```css
:root {
  /* 标题字体 */
  --font-size-h1: 2.5rem;    /* 40px */
  --font-size-h2: 2rem;      /* 32px */
  --font-size-h3: 1.5rem;    /* 24px */
  --font-size-h4: 1.25rem;   /* 20px */
  --font-size-h5: 1.125rem;  /* 18px */
  --font-size-h6: 1rem;      /* 16px */
  
  /* 正文字体 */
  --font-size-body-large: 1.125rem;  /* 18px */
  --font-size-body: 1rem;            /* 16px */
  --font-size-body-small: 0.875rem;  /* 14px */
  --font-size-caption: 0.75rem;      /* 12px */
}
```

### 字体权重规范
```css
:root {
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}
```

### 行高规范
```css
:root {
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  --line-height-loose: 2;
}
```

## 📐 间距系统

### 基础间距单位
```css
:root {
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-2xl: 3rem;     /* 48px */
  --spacing-3xl: 4rem;     /* 64px */
}
```

### 组件间距规范
```css
:root {
  /* 内边距 */
  --padding-xs: var(--spacing-xs);
  --padding-sm: var(--spacing-sm);
  --padding-md: var(--spacing-md);
  --padding-lg: var(--spacing-lg);
  --padding-xl: var(--spacing-xl);
  
  /* 外边距 */
  --margin-xs: var(--spacing-xs);
  --margin-sm: var(--spacing-sm);
  --margin-md: var(--spacing-md);
  --margin-lg: var(--spacing-lg);
  --margin-xl: var(--spacing-xl);
  
  /* 组件间距 */
  --component-gap-xs: var(--spacing-xs);
  --component-gap-sm: var(--spacing-sm);
  --component-gap-md: var(--spacing-md);
  --component-gap-lg: var(--spacing-lg);
  --component-gap-xl: var(--spacing-xl);
}
```

## 🔲 圆角系统

### 圆角规范
```css
:root {
  --radius-none: 0;
  --radius-sm: 0.25rem;    /* 4px */
  --radius-md: 0.5rem;     /* 8px */
  --radius-lg: 0.75rem;    /* 12px */
  --radius-xl: 1rem;       /* 16px */
  --radius-2xl: 1.5rem;    /* 24px */
  --radius-full: 9999px;
}
```

### 圆角使用规范
- **按钮**: `--radius-md` (8px)
- **卡片**: `--radius-lg` (12px)
- **输入框**: `--radius-md` (8px)
- **头像**: `--radius-full` (圆形)
- **标签**: `--radius-sm` (4px)
- **模态框**: `--radius-xl` (16px)

## 🌟 阴影系统

### 阴影定义
```css
:root {
  /* 温暖粉色阴影 */
  --shadow-xs: 0 1px 2px 0 rgba(255, 107, 157, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(255, 107, 157, 0.1), 0 1px 2px 0 rgba(255, 107, 157, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(255, 107, 157, 0.1), 0 2px 4px -1px rgba(255, 107, 157, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(255, 107, 157, 0.1), 0 4px 6px -2px rgba(255, 107, 157, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(255, 107, 157, 0.1), 0 10px 10px -5px rgba(255, 107, 157, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(255, 107, 157, 0.25);
}
```

### 阴影使用规范
- **卡片**: `--shadow-sm` 到 `--shadow-md`
- **按钮**: `--shadow-xs` 到 `--shadow-sm`
- **模态框**: `--shadow-lg` 到 `--shadow-xl`
- **悬浮效果**: `--shadow-md` 到 `--shadow-lg`
- **强调元素**: `--shadow-xl` 到 `--shadow-2xl`

## 🎭 组件设计规范

### 按钮组件
```css
.btn {
  /* 基础样式 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--padding-sm) var(--padding-md);
  border-radius: var(--radius-md);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  /* 主按钮 */
  background-color: var(--color-primary);
  color: white;
  box-shadow: var(--shadow-sm);
}

.btn:hover {
  background-color: var(--color-primary-hover);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.btn:active {
  background-color: var(--color-primary-pressed);
  transform: translateY(0);
}

/* 次要按钮 */
.btn-secondary {
  background-color: var(--color-secondary);
  color: var(--color-text-primary);
  border-color: var(--color-border);
}

/* 幽灵按钮 */
.btn-ghost {
  background-color: transparent;
  color: var(--color-primary);
  border-color: var(--color-primary);
}
```

### 卡片组件
```css
.card {
  background-color: var(--color-background);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  overflow: hidden;
  transition: all 0.2s ease-in-out;
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card-header {
  padding: var(--padding-md);
  border-bottom: 1px solid var(--color-border);
}

.card-body {
  padding: var(--padding-md);
}

.card-footer {
  padding: var(--padding-md);
  border-top: 1px solid var(--color-border);
  background-color: var(--color-surface);
}
```

### 输入框组件
```css
.input {
  width: 100%;
  padding: var(--padding-sm) var(--padding-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-body);
  line-height: var(--line-height-normal);
  background-color: var(--color-background);
  transition: all 0.2s ease-in-out;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(255, 107, 157, 0.1);
}

.input:hover {
  border-color: var(--color-primary-light);
}
```

## 🎨 图标系统

### 图标规范
- **尺寸**: 16px, 20px, 24px, 32px
- **风格**: 线性图标，圆润边角
- **颜色**: 继承文字颜色或使用主题色
- **对齐**: 与文字基线对齐

### 图标使用规范
```css
.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: middle;
  fill: currentColor;
}

.icon-sm { font-size: 1rem; }    /* 16px */
.icon-md { font-size: 1.25rem; } /* 20px */
.icon-lg { font-size: 1.5rem; }  /* 24px */
.icon-xl { font-size: 2rem; }    /* 32px */
```

## 🎬 动画系统

### 过渡动画
```css
:root {
  --transition-fast: 0.15s ease-in-out;
  --transition-normal: 0.2s ease-in-out;
  --transition-slow: 0.3s ease-in-out;
  --transition-bounce: 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### 动画使用规范
- **按钮交互**: `--transition-fast`
- **卡片悬浮**: `--transition-normal`
- **页面切换**: `--transition-slow`
- **强调效果**: `--transition-bounce`

### 关键帧动画
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

## 📱 响应式设计

### 断点定义
```css
:root {
  --breakpoint-sm: 480px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1200px;
  --breakpoint-2xl: 1920px;
}
```

### 响应式规范
```css
/* 移动端优先 */
.container {
  width: 100%;
  padding: 0 var(--spacing-md);
  margin: 0 auto;
}

/* 平板 */
@media (min-width: 768px) {
  .container {
    max-width: 768px;
    padding: 0 var(--spacing-lg);
  }
}

/* 桌面端 */
@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
    padding: 0 var(--spacing-xl);
  }
}

/* 大屏幕 */
@media (min-width: 1200px) {
  .container {
    max-width: 1200px;
  }
}
```

## 🎯 无障碍设计

### 色彩对比度
- **正文文字**: 至少 4.5:1 对比度
- **大号文字**: 至少 3:1 对比度
- **UI元素**: 至少 3:1 对比度

### 焦点状态
```css
.focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### 键盘导航
- 所有交互元素支持键盘访问
- Tab键顺序符合逻辑
- 提供跳过导航链接

## 📋 设计令牌使用

### CSS变量使用规范
```css
/* 正确使用 */
.button {
  background-color: var(--color-primary);
  border-radius: var(--radius-md);
  padding: var(--padding-sm) var(--padding-md);
}

/* 避免硬编码 */
.button {
  background-color: #ff6b9d; /* ❌ 避免 */
  border-radius: 8px;        /* ❌ 避免 */
  padding: 8px 16px;         /* ❌ 避免 */
}
```

### 主题切换实现
```css
/* 主题切换时更新CSS变量 */
[data-theme="purple"] {
  --color-primary: #a855f7;
  --color-primary-hover: #9333ea;
  --color-primary-pressed: #7c3aed;
  /* ... 其他颜色变量 */
}
```

## 🎨 设计资源

### 推荐工具
- **设计工具**: Figma, Sketch, Adobe XD
- **图标库**: Phosphor Icons, Heroicons, Lucide
- **色彩工具**: Coolors, Adobe Color
- **字体工具**: Google Fonts, Adobe Fonts

### 设计检查清单
- [ ] 色彩对比度符合无障碍标准
- [ ] 所有交互元素有明确的状态反馈
- [ ] 响应式设计在所有断点下正常显示
- [ ] 动画效果流畅且有意义
- [ ] 字体层级清晰易读
- [ ] 间距系统一致统一
- [ ] 圆角和阴影符合设计规范
- [ ] 主题切换功能正常工作

## 📝 总结

本设计系统详细规范为"出片手账"项目提供了完整的设计指导，确保：

1. **视觉一致性**: 统一的色彩、字体、间距系统
2. **用户体验**: 符合目标用户审美的温暖治愈风格
3. **技术实现**: 基于CSS变量的可维护设计系统
4. **无障碍性**: 符合WCAG标准的无障碍设计
5. **响应式**: 适配各种设备和屏幕尺寸
6. **主题化**: 支持多主题色切换功能

通过遵循这些规范，可以确保整个应用的UI/UX保持高质量和一致性。
