# Fabric.js 到 Konva.js 迁移任务清单

## 📋 迁移概览

**项目名称**：出片手账应用画布库迁移  
**迁移类型**：Fabric.js → Konva.js + vue-konva  
**预计工期**：4周  
**风险等级**：中等  
**影响范围**：仅限画布功能，其他功能保持不变  

## 🚀 第一阶段：环境准备和依赖安装
（已完成，详见上文）

## 🔧 第二阶段：核心画布组件重构
（已完成，详见上文）

## 📤 第三阶段：导出功能重构（已完成）

### 3.1 重构导出实现
- [x] 新增 Konva 导出工具
  - 文件：`src/utils/konva-export.ts`
  - 能力：按项目数据重建 Konva 舞台并导出 `png/jpg`，支持质量参数
  - 保持与旧 API 完全一致：`exportCanvas(project, format, size, quality)`、`downloadImage(blob, filename)`

- [x] Export 页面切换到 Konva 导出
  - 文件：`src/views/Export.vue`
  - 变更：
    - 从 `@/utils/konva-export` 导入 `exportCanvas, downloadImage`
    - 其余逻辑和 UI 不变

- [x] 保持向后兼容
  - 文件：`src/utils/canvas-export.ts`
  - 处理：保留文件名与导出符号，内部转发到 `@/utils/konva-export`
  - 目的：避免其他模块仍引用旧路径时产生破坏性变更

### 3.2 验证与说明
- [x] 签名兼容性自检：入参/返回与旧版一致
- [x] 导出流程基本验证：本地数据驱动导出（项目缩略图、文字、贴纸、边框）
- [x] 类型检查说明：项目仍存在与主题/FAQ/Settings 等非导出相关的 TS 告警，保留到后续阶段处理；与导出改造直接相关的接口已兼容

### 3.3 后续建议（非阻塞）
- 在第四/第六阶段逐步移除 `canvas-export.ts` 与遗留 Fabric 注释，统一到 Konva 实现
- 如果需要更高质量文字渲染，可评估使用字体嵌入与像素对齐策略

## 🧩 第四阶段：类型定义和接口适配（已完成）
- [x] 梳理并收敛第三阶段产生的类型边界
- [x] 分模块修复非导出相关 TS 告警（主题、FAQ、Settings 等）

### 本阶段关键变更
- 类型补全：`UpdateTodoData` 增加 `handbookGeneratedAt?: Date`
- 组件修复：
  - `TodoImportExport.vue` 预览数据使用可选链与回退值
  - `TodoCelebration.vue` 强类型化 `newAchievements`，并将 `NodeJS.Timeout` 改为 `number`
  - `TodoHandbookGallery.vue` 统计读取改为 `generatedContent.metadata.elementCount`
  - `FAQ.vue`/`Tutorial.vue` 使用 `HTMLElement` 断言修复 `offsetTop` 报错
  - `ProjectDetail.vue` 的 `getMoodName` 兼容 `MoodId | string`
  - `Settings.vue` 的更新函数使用键名泛型与 `any` 回落，消除 `never` 赋值错误
- Store 与枚举对齐：
  - `stores/handbook.ts` 使用 `TodoCategory.STUDY`、`MoodType.HAPPY` 代替字面量

### 验证
- 已执行 `npm run type-check`，当前 0 个错误

## 🧪 第五阶段：测试和验证
- [ ] 功能测试：不同尺寸/格式导出可用
- [ ] 性能测试：大尺寸导出耗时与内存占用
- [ ] 兼容测试：移动端/主流浏览器

## 🧹 第六阶段：代码清理和优化
- [ ] 清理兼容转发与遗留注释
- [ ] 统一文档与导出实现说明

## 📈 迁移进度跟踪
- [x] 第一阶段完成
- [x] 第二阶段完成（Editor 画布替换与集成）
- [x] 第三阶段完成（导出功能重构，API 兼容）
- [x] 第四阶段完成（类型与接口收敛）
- [ ] 第五阶段进行中（功能与性能测试）
- [ ] 第六阶段未开始

### 进度备注
- 本阶段关键文件：
  - `src/utils/konva-export.ts`
  - `src/views/Export.vue`
  - `src/utils/canvas-export.ts`
- 现存告警与导出无直接关系，后续阶段统一修复，不阻塞导出使用
