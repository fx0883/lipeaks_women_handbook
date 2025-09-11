# 出片手账 - 鸿蒙UI原型

> 基于现有Vue项目生成的鸿蒙app UI原型，完全符合HarmonyOS设计规范

## 📱 项目概述

这是一个女性向手账应用的鸿蒙UI原型，专为12-20岁女性用户设计。应用提供模板创作、情绪打卡、相册管理、个人设置等功能，界面设计完全遵循鸿蒙设计系统规范。

## 🎨 设计特色

### 鸿蒙设计系统适配
- **容器布局**：使用Column、Row、Stack等鸿蒙容器组件概念
- **色彩规范**：采用鸿蒙色彩体系，支持深色/浅色模式自动切换
- **字体系统**：统一使用HarmonyOS Sans字体规范
- **圆角阴影**：符合鸿蒙设计语言的borderRadius和shadow规范
- **交互反馈**：包含触觉反馈、涟漪效果等鸿蒙交互规范

### 响应式适配
- **断点系统**：手机(576px)、平板(768px)、智慧屏(1200px)
- **组件适配**：按钮最小44dp触摸区域，符合无障碍规范
- **导航系统**：手机端底部TabBar，桌面端顶部Navigation

## 📁 项目结构

```
WomenHandbook/html/
├── index.html              # 主页面 - 功能导航和内容概览
├── create.html             # 创作页面 - 模板选择和分类筛选
├── mood.html               # 情绪打卡 - 心情记录和统计分析
├── album.html              # 相册管理 - 作品展示和批量操作
├── todo.html               # 待办清单 - 任务管理和成就系统
├── profile.html            # 个人中心 - 用户信息展示
├── settings.html           # 设置页面 - 隐私、通知、外观等设置
├── styles/
│   ├── harmonyos-design.css    # 鸿蒙设计系统基础样式
│   ├── main.css                # 主应用样式
│   ├── create.css              # 创作页面专用样式
│   ├── mood.css                # 情绪打卡页面样式
│   ├── album.css               # 相册页面样式
│   ├── todo.css                # 待办页面样式
│   ├── profile.css             # 个人中心样式
│   └── settings.css            # 设置页面样式
└── scripts/
    ├── main.js                 # 主应用交互逻辑
    ├── create.js               # 创作页面交互
    ├── mood.js                 # 情绪打卡功能
    ├── album.js                # 相册管理功能
    ├── todo.js                 # 待办页面交互逻辑
    ├── profile.js              # 个人中心交互
    └── settings.js             # 设置页面交互
```

## 🎯 核心功能

### 1. 主页面 (index.html)
- **欢迎横幅**：渐变背景 + 浮动动画
- **功能卡片**：Grid布局展示主要功能
- **热门模板**：横向滚动模板列表
- **最近作品**：瀑布流作品展示
- **底部导航**：TabBar导航系统

### 2. 创作页面 (create.html)
- **搜索筛选**：实时搜索 + 分类筛选
- **模板网格**：支持网格/列表视图切换
- **模板预览**：弹窗式详情预览
- **使用统计**：显示使用次数和评分

### 3. 情绪打卡 (mood.html)
- **心情选择**：6种心情状态选择
- **详情记录**：文字记录 + 标签分类
- **周统计图**：柱状图展示本周心情
- **洞察分析**：智能心情趋势分析
- **历史记录**：时间轴形式历史查看

### 4. 相册管理 (album.html)
- **统计概览**：作品数量、获赞等统计
- **分类筛选**：按类型筛选作品
- **批量操作**：支持多选删除/分享
- **瀑布流布局**：自适应网格展示

### 5. 待办清单 (todo.html) ⭐️ **新增**
- **任务管理**：创建、编辑、删除、完成任务
- **四大分类**：学习、工作、生活、娱乐分类管理
- **优先级设置**：高、中、低优先级标识
- **筛选功能**：按分类、优先级、状态快速筛选
- **统计数据**：总任务、已完成、进行中、待办统计
- **成就系统**：8种成就徽章（初次尝试、坚持不懈、生活达人等）
- **心情追踪**：任务完成后记录心情和感受
- **智能建议**：基于习惯和已有任务推荐新任务
- **完成庆祝**：任务完成时的动画效果和心情记录弹窗

### 6. 个人中心 (profile.html)
- **用户信息**：头像、昵称、简介展示
- **成就系统**：徽章展示 + 进度追踪
- **功能菜单**：分组式功能入口
- **活动记录**：最近操作时间轴

### 7. 设置页面 (settings.html)
- **用户信息**：大尺寸头像展示 + 统计数据
- **隐私设置**：数据加密、匿名统计、自动登录、数据共享
- **通知设置**：推送通知、每日提醒、提醒时间、声音/振动
- **外观设置**：主题选择、字体大小、动画效果、语言设置
- **数据管理**：自动保存、云端同步、导入导出、存储使用情况
- **关于应用**：应用信息、帮助支持、自动更新

## 🎨 鸿蒙适配要点

### 布局结构转换
```css
/* 原Web布局 */
.container {
  display: flex;
  flex-direction: column;
}

/* 鸿蒙Column概念 */
.harmony-column {
  display: flex;
  flex-direction: column;
  gap: var(--harmony-space-lg);
}
```

### 色彩系统
```css
/* 鸿蒙色彩变量 */
:root {
  --harmony-brand-primary: #FF6B9D;
  --harmony-neutral-background-1: #FFFFFF;
  --harmony-neutral-foreground-1: #1A1A1A;
}

/* 深色模式 */
[data-theme="dark"] {
  --harmony-neutral-background-1: #1A1A1A;
  --harmony-neutral-foreground-1: #FFFFFF;
}
```

### 组件规范
```css
/* 按钮最小触摸区域 */
.harmony-button {
  min-height: 44px;
  padding: 12px 20px;
  border-radius: 12px;
}

/* 卡片阴影规范 */
.harmony-card {
  box-shadow: var(--harmony-shadow-2);
  border-radius: var(--harmony-radius-xl);
}

/* 鸿蒙开关组件 */
.harmony-switch {
  width: 48px;
  height: 28px;
  border-radius: 14px;
}
```

## 📱 响应式断点

| 设备类型 | 断点 | 特殊适配 |
|---------|------|---------|
| 手机 | < 576px | 底部TabBar、单列布局 |
| 平板 | 768px - 1199px | 2列布局、侧边导航 |
| 智慧屏 | ≥ 1200px | 多列布局、顶部导航 |

## 🚀 交互特性

### 鸿蒙动画
- **页面转场**：滑动、淡入淡出效果
- **组件动画**：缩放、位移、旋转
- **加载动画**：符合鸿蒙视觉风格

### 触觉反馈
```javascript
// 按钮点击反馈
if ('vibrate' in navigator) {
    navigator.vibrate(10); // 轻微振动
}
```

### 手势支持
- **滑动导航**：左右滑动切换页面
- **长按选择**：长按进入多选模式
- **双击点赞**：双击图片快速点赞

## 🔧 设置页面特色功能

### 主题系统
- **4种预设主题**：粉色梦境、紫色幻想、薄荷清新、桃子温暖
- **实时预览**：点击主题卡片即可预览效果
- **自动切换**：支持深色/浅色模式自动跟随系统

### 鸿蒙开关组件
```css
.harmony-switch {
  position: relative;
  width: 48px;
  height: 28px;
  border-radius: 14px;
  transition: all 0.3s ease;
}

.harmony-switch input:checked + .switch-slider {
  background: var(--harmony-brand-primary);
}
```

### 数据管理
- **导入导出**：JSON格式数据备份
- **云端同步**：模拟云端备份功能
- **存储监控**：可视化存储使用情况
- **一键清除**：带确认对话框的数据清理

## 🎯 使用方法

1. **直接打开**：用浏览器打开`index.html`即可预览
2. **本地服务器**：推荐使用Live Server等工具运行
3. **移动端测试**：使用浏览器开发者工具模拟移动设备

### 页面导航路径
```
index.html -> 主页（功能概览）
create.html -> 创作页面（模板选择）
mood.html -> 情绪打卡（心情记录）
album.html -> 相册管理（作品展示）
profile.html -> 个人中心（用户信息）
settings.html -> 设置页面（个性化配置）
```

## 📝 开发说明

### 主题切换
```javascript
// 切换深色/浅色模式
function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
}
```

### 数据缓存
```javascript
// 本地数据管理
const DataCache = {
    set(key, data, ttl = 3600000) { /* 缓存数据 */ },
    get(key) { /* 获取数据 */ },
    remove(key) { /* 删除数据 */ }
};
```

### Toast提示
```javascript
// 显示提示信息
showToast('操作成功！', 'success', 3000);
```

### 设置管理
```javascript
// 设置项切换
function toggleSetting(settingKey, value) {
    userSettings[category][key] = value;
    saveUserSettings();
    showToast(`${settingName} ${value ? '已开启' : '已关闭'}`, 'success');
}
```

## 🔧 技术栈

- **HTML5**：语义化结构
- **CSS3**：Flexbox、Grid、动画
- **JavaScript ES6+**：模块化、异步处理
- **鸿蒙设计系统**：色彩、字体、组件规范

## 📋 适配清单

### ✅ 已完成
- [x] 布局结构转换（div → Column/Row/Stack）
- [x] 色彩系统适配（鸿蒙色彩规范）
- [x] 字体系统（HarmonyOS Sans）
- [x] 按钮组件（44dp最小触摸区域）
- [x] 导航系统（TabBar + Navigation）
- [x] 响应式断点（手机/平板/智慧屏）
- [x] 深色模式支持
- [x] 触觉反馈模拟
- [x] 动画效果（页面转场、组件动画）
- [x] 设置页面（隐私、通知、外观、数据、关于）
- [x] 鸿蒙开关组件（Switch）
- [x] 主题系统（4种预设主题）
- [x] 数据管理（导入导出、云端同步）

### 🚀 进阶功能
- [ ] 真实鸿蒙开发环境集成
- [ ] ArkTS代码转换
- [ ] 原生组件替换
- [ ] 性能优化
- [ ] 无障碍适配增强

## 🎨 设计亮点

### 设置页面创新
1. **分区导航**：横向滑动的设置分类导航
2. **可视化主题**：带预览的主题选择卡片
3. **鸿蒙开关**：完全符合HarmonyOS规范的开关组件
4. **数据可视化**：存储使用情况的进度条展示
5. **确认对话框**：重要操作的二次确认机制

### 交互细节
- **触觉反馈**：开关切换、按钮点击的震动反馈
- **状态提示**：每个设置项的实时状态Toast提示
- **平滑动画**：设置区域切换的淡入淡出效果
- **响应式布局**：不同设备尺寸的自适应布局

## 📞 技术支持

如需了解更多鸿蒙开发相关内容，请参考：
- [HarmonyOS开发者文档](https://developer.harmonyos.com/)
- [ArkUI框架指南](https://developer.harmonyos.com/cn/docs/documentation/doc-guides/arkui-overview-0000001532739125)
- [设计规范指南](https://developer.harmonyos.com/cn/design/)

---

**注：此项目为UI原型演示，实际鸿蒙应用开发需要使用DevEco Studio和ArkTS语言进行开发。所有设置功能均为模拟实现，展示鸿蒙设计规范的完整应用。**