# 出片手账 PC 原型复刻 · 可执行技术计划（v1）

## 1. 范围与目标
- **目标**：完全复刻 `docs/html/pc/` 原型UI（像素级一致），首版提供 AppHeader/AppFooter 组件、主题切换入口、移动端菜单开合、活跃路由高亮，并用 Mock 数据驱动页面。
- **真源**：以原型为唯一真源（UI/交互/信息密度）。若文档与原型不一致，以原型为准并修订文档/Mock。
- **首版不做**：后端/登录/上传能力；高级导出质量优化（保留 PNG/JPG 基础导出）。

## 2. 技术架构与依赖
- 框架：Vue 3 + TypeScript + Vite
- 状态：Pinia
- 路由：Vue Router
- 画布：Fabric.js（v1 用于编辑器画布/导出）
- 样式：复用原型 `styles.css` 的 CSS 变量与组件风格；运行时注入主题变量
- 存储：本地 JSON + LocalStorage（近期会话/偏好）

## 3. 路由与页面
- 路由映射（均基于原型）：
  - `/` → 主页（对应 `index.html` 概览+入口）
  - `/create` → 模板选择（`create.html`）
  - `/editor/:id` → 编辑器（`editor.html`）
  - `/mood` → 情绪打卡（`mood.html`）
  - `/mood-calendar` → 情绪日历（`mood_calendar.html`）
  - `/album` → 相册（`album.html`）
  - `/settings` → 设置（`settings.html`）
  - `/project/:id` → 作品详情（补齐 `project_detail.html` 占位视图）
  - `/export` → 导出（补齐 `export.html` 占位视图）

## 4. 目录与文件（v1 目标结构）
- `src/components/layout/AppHeader.vue`：Logo/主导航/主题切换/移动端菜单
- `src/components/layout/AppFooter.vue`：四列链接+底栏
- `src/components/layout/AppLayout.vue`：头-主体-脚架构（可选 Sidebar 插槽）
- `src/components/ui/BaseButton.vue`、`BaseCard.vue`、`BaseInput.vue`
- `src/components/business/TemplateCard.vue`
- `src/components/business/MoodSelector.vue`
- `src/components/business/ColorPicker.vue`
- `src/components/business/StickerGrid.vue`
- `src/components/business/FilterGrid.vue`
- `src/components/business/ThemeSelector.vue`
- `src/components/editor/CanvasStage.vue`（Fabric.js 渲染）
- `src/views/Home.vue`、`Create.vue`、`Editor.vue`、`Mood.vue`、`MoodCalendar.vue`、`Album.vue`、`Settings.vue`、`ProjectDetail.vue`、`Export.vue`
- `src/stores/{template,project,mood,theme,user}.ts`
- `src/types/{template,project,mood,theme}.ts`
- `src/styles/tokens.css`（桥接主题→CSS变量）
- `mockup/{templates.json,projects.json,moods.json,themes.json}`（由 `docs/new/mockup-*.json` 复制并修订）

## 5. 类型定义（以原型为准）
- Template
```ts
export type TemplateCategory = 'high-school' | 'university' | 'workplace'

export interface TemplateLayerBase { type: 'image' | 'text' | 'sticker' }

export interface Template {
  id: string;            // kebab-case 英文，URL 友好
  name: string;          // 中文展示名
  description: string;
  category: TemplateCategory;
  styleTag: string[];
  ratio: '1:1' | '4:5' | '9:16' | '3:4';
  thumbnail: string;
  preview: string;
  layers: any[];         // v1 直接透传 mock（Fabric 解析）
  tags: string[];
  isPopular: boolean;
  isNew: boolean;
  version: number;
  createdAt: string;
}
```
- Project
```ts
export interface ProjectContent {
  title: string;
  subtitle: string;
  images: string[];
  stickers: string[];
  filters: string[];
  text: string;
  mood: 'happy' | 'neutral' | 'calm' | 'low' | 'sad';
  colors: { primary: string; secondary: string; text: string };
}

export interface Project {
  id: string;
  name: string;
  description: string;
  templateId: string;    // 指向 kebab-case 模板 id
  thumbnail: string;
  content: ProjectContent;
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}
```
- MoodRecord
```ts
export type MoodId = 'happy' | 'neutral' | 'calm' | 'low' | 'sad'

export interface MoodRecord {
  id: string;
  date: string;          // YYYY-MM-DD
  mood: MoodId;
  intensity: number;     // 1-10
  description: string;
  tags: string[];
  image?: string;
  cardProjectId?: string;
  createdAt: string;
}
```
- Theme
```ts
export interface ThemeColor { id: string; name: string; primary: string; primaryHover: string; primaryPressed: string; secondary: string; accent: string; preview: string }
export interface Theme { id: string; name: string; category: 'pink' | 'purple' | 'mint' | 'peach' | 'lavender' | 'coral' | 'custom'; description: string; colors: ThemeColor; isCustom: boolean; createdAt: string }
```

## 6. Mock 数据修订（以原型为准）
- 模板分类：统一使用 `'high-school' | 'university' | 'workplace'`
- 模板 id：全部改为 kebab-case 英文，保留中文名称（示例映射）
```text
campus_collage   → campus-collage
club_poster      → club-poster
exam_countdown   → exam-countdown
homework_board   → homework-board
library_log      → library-log
citywalk         → citywalk            (已符合)
dorm_food        → dorm-food
anniversary      → anniversary         (已符合)
commute_desk     → commute-desk
ootd             → ootd                (已符合)
weekly_review    → weekly-review
soft吐槽          → soft-complain
```
- 情绪集合：只保留 5 档并统一 id/名称/emoji
```json
[
  { "id": "happy",   "name": "开心", "emoji": "😀" },
  { "id": "neutral", "name": "一般", "emoji": "😐" },
  { "id": "calm",    "name": "平静", "emoji": "🙂" },
  { "id": "low",     "name": "低落", "emoji": "🙁" },
  { "id": "sad",     "name": "难过", "emoji": "😢" }
]
```
- 相册项目：扩充 `mockup-projects.json` 至 ≥ 12 条，覆盖三大分类与四种比例，字段与原型展示一致（标题/日期/缩略图）。
- 文档修订：`docs/new/requirements.md` 中 Template.category 的旧枚举彻底替换；情绪集合/主题真源/新增路由（`/project/:id`、`/export`）一并更新。

## 7. 主题系统与 CSS 变量映射
- 主题真源：`mockup-themes.json` 的 `colors` 字段
- 注入策略：应用启动或主题切换时，将主题色写入 :root CSS 变量，覆盖原型 `styles.css` 的核心令牌。
- 建议映射（单向）：
```text
Theme.colors.primary         → --colorBrandBackground
Theme.colors.primaryHover    → --colorBrandBackgroundHover
Theme.colors.primaryPressed  → --colorBrandBackgroundPressed
Theme.colors.secondary       → --pink-light（或新增 --themeSecondary 并用于背景）
Theme.colors.accent          → --pink-medium（或新增 --themeAccent）
Theme.colors.preview         → 仅展示，不注入
```
- 如需避免影响现有粉色命名，可新增主题前缀变量：`--themePrimary/--themePrimaryHover/--themePrimaryPressed/--themeSecondary/--themeAccent`，并在 `tokens.css` 中桥接到原有变量，确保原型风格不被破坏。

## 8. 情绪 → 主题色 映射（随主题变色）
- v1 默认表（可配置）：
```text
happy  → theme.primary（--colorBrandBackground 或 --themePrimary）
neutral→ theme.accent  （--themeAccent）
calm   → theme.secondary（--themeSecondary）
low    → theme.primaryPressed（--colorBrandBackgroundPressed 或 --themePrimaryPressed）
sad    → theme.primaryHover（--colorBrandBackgroundHover 或 --themePrimaryHover）
```
- 应用场景：`mood.html` 表单色卡、`mood_calendar.html` 日历色块、`mood_card.html` 卡片主色。

## 9. Store 设计（Pinia）
- `TemplateStore`
```ts
state: { templates: Template[], byId: Record<string, Template> }
actions: { loadTemplates(list: Template[]), getById(id: string): Template | undefined }
```
- `ProjectStore`
```ts
state: { projects: Project[], byId: Record<string, Project> }
actions: { loadProjects(list: Project[]), list(params?), getById(id), add(p), update(p), remove(id) }
```
- `MoodStore`
```ts
state: { moods: { id: MoodId; name: string; emoji: string; color?: string }[], records: MoodRecord[] }
actions: { loadMoods(list), loadRecords(list), addRecord(r), filterByMonth(yyyyMM) }
```
- `ThemeStore`
```ts
state: { themes: Theme[], current: Theme }
actions: { loadThemes(list), switchTheme(themeId | Theme) → 注入 CSS 变量 }
```
- `UserStore`
```ts
state: { preferences: { themeId?: string } }
actions: { setTheme(id), restoreFromLocal() }
```

## 10. 关键页面复刻要点
- `AppHeader`：
  - 主导航路由高亮（基于 `route.path` 前缀匹配）
  - 移动端菜单开合（原型行为/断点一致）
  - 主题切换入口（按钮+下拉，显示主题预览色与名称）
- `AppFooter`：
  - 四列链接与底栏文字与原型一致；跨页复用
- `Create`：
  - 三分组（高中/大学/职场）+ 比例/风格筛选（v1 仅样式与状态）
  - `TemplateCard` 使用 Mock 的 `thumbnail/name/ratio`，点击跳转 `/editor/:id`
- `Editor`：
  - 左侧预览（`CanvasStage`）+ 右侧控制面板（文字/贴纸/滤镜/边框）
  - 预览/导出/替换图片操作区（行为先占位）
- `Mood`：
  - 情绪按钮 + 色卡 + 一句话输入；预览卡片随选择（按映射变色）
- `MoodCalendar`：
  - 月历网格 + 情绪分布 + 本周趋势（静态渲染，数据喂给即可）
- `Album`：
  - 搜索/排序 + 栅格（≥ 12 张）+ 分页；项目卡片指向 `/project/:id`
- `ProjectDetail`：
  - 展示项目标题/时间/缩略图/模板信息；提供“打开编辑器/导出”
- `Export`：
  - 导出选项（PNG/JPG、尺寸），调用 `CanvasStage.export()` 返回 Blob 下载

## 11. 运行时主题注入（伪代码）
```ts
function applyTheme(theme: Theme) {
  const r = document.documentElement.style
  r.setProperty('--themePrimary', theme.colors.primary)
  r.setProperty('--themePrimaryHover', theme.colors.primaryHover)
  r.setProperty('--themePrimaryPressed', theme.colors.primaryPressed)
  r.setProperty('--themeSecondary', theme.colors.secondary)
  r.setProperty('--themeAccent', theme.colors.accent)
  // 桥接到原型变量（若采用桥接方案）
  r.setProperty('--colorBrandBackground', theme.colors.primary)
  r.setProperty('--colorBrandBackgroundHover', theme.colors.primaryHover)
  r.setProperty('--colorBrandBackgroundPressed', theme.colors.primaryPressed)
}
```

## 12. 错误处理与边界
- Mock 数据缺字段：以默认值回退，控制台警告，不阻断渲染
- 模板 id 未匹配：走“别名映射”回退（兼容历史 id），失败时跳转 `/create`
- 主题/情绪映射缺失：回退到内置粉色主题与 `happy`
- 画布导出失败：提示重试并提供“下载预览图”退路

## 13. 性能与可访问性
- 图片惰性加载（IntersectionObserver）
- 路由/组件懒加载
- 焦点样式与键盘导航（按钮/链接/输入）
- 响应式断点与 sticky/fixed 行为与原型一致

## 14. 测试方法
- 视觉回归：对照 `docs/html/pc/*.html` 手动核对关键布局与状态（hover/active/focus）
- 单元测试：Store 的加载/筛选/映射函数
- 冒烟测试：主题切换/情绪切换/路由跳转闭环/导出基本可用

## 15. 依赖与管理
- 依赖：`vue@3`、`vue-router@4`、`pinia`、`fabric`
- TypeScript/ESLint/Prettier 基线配置（按团队规范）

## 16. 验收标准（v1）
- UI 与交互与原型一致（Header/Footer/Sidebar/卡片/网格/按钮/输入/工具栏/断点）
- 主题切换立即生效，`Mood`/`MoodCalendar` 色块随主题映射变化
- 模板选择→编辑器→导出/相册→项目详情 路由闭环打通
- Mock 数据按新口径（分类/情绪/模板 id 规范）

## 17. 实施清单（可逐项提交）
1. 新建 Vue 3 + TS + Vite 项目骨架与基础依赖（Vue Router/Pinia/Fabric）
2. 建立 `src/styles/tokens.css` 与主题注入函数（不改动原型样式命名，先桥接）
3. 组件化 `AppHeader`（路由高亮/移动端菜单/主题切换入口）
4. 组件化 `AppFooter` 并全站复用
5. 配置路由并创建 8 个视图占位（含 `/project/:id`、`/export`）
6. 定义 `types` 与 4 个 Store（Template/Project/Mood/Theme）
7. 修订并导入 Mock 数据（模板 id 规范/分类/情绪集合/项目≥12 条），实现“别名映射”
8. 完成 `Create` 页（分组/筛选 UI，列表渲染 + 跳转）
9. 完成 `Editor` 基础：`CanvasStage` + 控制面板布局 + 预览/导出占位
10. 完成 `Mood` 与 `MoodCalendar`（色彩按映射表联动主题）
11. 完成 `Album`（搜索/排序占位、分页、卡片跳转）与 `ProjectDetail`（最小展示）
12. 完成 `Export` 视图（PNG/JPG 导出流程）
13. 可访问性与交互抛光（hover/active/focus/响应式/粘性/固定）
14. 视觉对拍原型与修正差异
15. 文档更新：`docs/new/requirements.md` 的枚举/路由/情绪规范同步

— 完 —
