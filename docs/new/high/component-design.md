# 出片手账 组件设计规范

## 📖 文档信息
- **版本**: v1.0
- **项目**: 出片手账 Vue 3 Web版
- **更新时间**: 2024-01-20
- **框架**: Vue 3.4+ + TypeScript 5.0+

## 🎯 组件设计原则

### 设计理念
- **单一职责**: 每个组件只负责一个功能
- **可复用性**: 组件应该易于复用和组合
- **可维护性**: 组件结构清晰，易于理解和维护
- **一致性**: 组件接口和样式保持一致
- **可扩展性**: 组件应该易于扩展和定制

### 组件分类
1. **基础组件 (UI Components)**: 最基础的UI元素
2. **布局组件 (Layout Components)**: 页面布局相关
3. **业务组件 (Business Components)**: 特定业务功能
4. **页面组件 (Page Components)**: 完整的页面

## 📝 组件命名规范

### 文件命名
- 使用 `kebab-case` 命名
- 组件文件以 `.vue` 结尾
- 示例: `base-button.vue`, `template-card.vue`

### 组件命名
- 使用 `PascalCase` 命名
- 基础组件以 `Base` 开头
- 布局组件以 `App` 开头
- 业务组件使用功能名称
- 示例: `BaseButton`, `AppHeader`, `TemplateCard`

## 🔧 组件接口设计

### Props 设计规范
```typescript
// 基础组件 Props 示例
interface BaseButtonProps {
  // 必需属性
  type: 'primary' | 'secondary' | 'text' | 'danger'
  size: 'small' | 'medium' | 'large'
  
  // 可选属性
  disabled?: boolean
  loading?: boolean
  icon?: string
  round?: boolean
  
  // 事件相关
  onClick?: (event: MouseEvent) => void
}

// 业务组件 Props 示例
interface TemplateCardProps {
  // 数据属性
  template: Template
  selected?: boolean
  
  // 交互属性
  clickable?: boolean
  showActions?: boolean
  
  // 事件
  onSelect?: (template: Template) => void
  onPreview?: (template: Template) => void
}
```

### Emits 设计规范
```typescript
// 组件事件定义
interface BaseButtonEmits {
  click: [event: MouseEvent]
  'update:loading': [loading: boolean]
}

interface TemplateCardEmits {
  select: [template: Template]
  preview: [template: Template]
  edit: [template: Template]
  delete: [template: Template]
}
```

### Slots 设计规范
```typescript
// 组件插槽定义
interface BaseCardSlots {
  // 默认插槽
  default: () => VNode[]
  
  // 具名插槽
  header: (props: { title: string }) => VNode[]
  footer: () => VNode[]
  actions: () => VNode[]
}
```

## 🎨 组件样式规范

### CSS 类命名规范
```css
/* 使用 BEM 命名规范 */
.base-button {
  /* 基础样式 */
}

.base-button--primary {
  /* 修饰符样式 */
}

.base-button--large {
  /* 尺寸修饰符 */
}

.base-button__icon {
  /* 子元素样式 */
}

.base-button__text {
  /* 子元素样式 */
}
```

### 样式变量使用
```css
/* 使用 CSS 变量 */
.base-button {
  background-color: var(--color-primary);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  font-family: var(--font-family-base);
  box-shadow: var(--shadow-sm);
}

.base-button:hover {
  background-color: var(--color-primary-hover);
  box-shadow: var(--shadow-md);
}
```

## 📦 组件结构模板

### 基础组件模板
```vue
<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <el-icon v-if="loading" class="base-button__icon">
      <Loading />
    </el-icon>
    <el-icon v-else-if="icon" class="base-button__icon">
      <component :is="icon" />
    </el-icon>
    <span v-if="$slots.default" class="base-button__text">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BaseButtonProps, BaseButtonEmits } from '@/types/component'

// Props 定义
const props = withDefaults(defineProps<BaseButtonProps>(), {
  type: 'primary',
  size: 'medium',
  disabled: false,
  loading: false,
  round: false
})

// Emits 定义
const emit = defineEmits<BaseButtonEmits>()

// 计算属性
const buttonClasses = computed(() => [
  'base-button',
  `base-button--${props.type}`,
  `base-button--${props.size}`,
  {
    'base-button--disabled': props.disabled,
    'base-button--loading': props.loading,
    'base-button--round': props.round
  }
])

// 事件处理
const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-family-base);
  font-weight: 500;
}

.base-button--primary {
  background-color: var(--color-primary);
  color: white;
}

.base-button--primary:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.base-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.base-button__icon {
  font-size: 1em;
}

.base-button__text {
  line-height: 1;
}
</style>
```

### 业务组件模板
```vue
<template>
  <div :class="cardClasses" @click="handleCardClick">
    <div class="template-card__image">
      <img :src="template.thumbnail" :alt="template.name" />
      <div v-if="showActions" class="template-card__actions">
        <base-button size="small" @click.stop="handlePreview">
          预览
        </base-button>
        <base-button size="small" type="primary" @click.stop="handleSelect">
          使用
        </base-button>
      </div>
    </div>
    
    <div class="template-card__content">
      <h3 class="template-card__title">{{ template.name }}</h3>
      <p class="template-card__description">{{ template.description }}</p>
      
      <div class="template-card__tags">
        <span
          v-for="tag in template.tags"
          :key="tag"
          class="template-card__tag"
        >
          {{ tag }}
        </span>
      </div>
    </div>
    
    <div v-if="template.isNew" class="template-card__badge">
      新
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Template } from '@/types/template'
import type { TemplateCardProps, TemplateCardEmits } from '@/types/component'
import BaseButton from '@/components/ui/base-button.vue'

// Props 定义
const props = withDefaults(defineProps<TemplateCardProps>(), {
  selected: false,
  clickable: true,
  showActions: false
})

// Emits 定义
const emit = defineEmits<TemplateCardEmits>()

// 计算属性
const cardClasses = computed(() => [
  'template-card',
  {
    'template-card--selected': props.selected,
    'template-card--clickable': props.clickable
  }
])

// 事件处理
const handleCardClick = () => {
  if (props.clickable) {
    emit('select', props.template)
  }
}

const handlePreview = () => {
  emit('preview', props.template)
}

const handleSelect = () => {
  emit('select', props.template)
}
</script>

<style scoped>
.template-card {
  position: relative;
  border-radius: var(--radius-lg);
  background: white;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  overflow: hidden;
}

.template-card--clickable {
  cursor: pointer;
}

.template-card--clickable:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.template-card--selected {
  border: 2px solid var(--color-primary);
}

.template-card__image {
  position: relative;
  aspect-ratio: 4/5;
  overflow: hidden;
}

.template-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.template-card:hover .template-card__image img {
  transform: scale(1.05);
}

.template-card__actions {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.template-card:hover .template-card__actions {
  opacity: 1;
}

.template-card__content {
  padding: var(--spacing-md);
}

.template-card__title {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: 1.1em;
  font-weight: 600;
  color: var(--color-neutral-800);
}

.template-card__description {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: 0.9em;
  color: var(--color-neutral-600);
  line-height: 1.4;
}

.template-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.template-card__tag {
  padding: 2px var(--spacing-xs);
  background: var(--color-secondary);
  color: var(--color-primary);
  border-radius: var(--radius-sm);
  font-size: 0.8em;
}

.template-card__badge {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  padding: 2px var(--spacing-xs);
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-sm);
  font-size: 0.8em;
  font-weight: 600;
}
</style>
```

## 🔄 组件通信规范

### 父子组件通信
```typescript
// 父组件
<template>
  <template-card
    :template="template"
    :selected="selectedTemplate?.id === template.id"
    @select="handleTemplateSelect"
    @preview="handleTemplatePreview"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Template } from '@/types/template'
import TemplateCard from '@/components/business/template-card.vue'

const selectedTemplate = ref<Template | null>(null)

const handleTemplateSelect = (template: Template) => {
  selectedTemplate.value = template
}

const handleTemplatePreview = (template: Template) => {
  // 处理预览逻辑
}
</script>
```

### 跨组件通信
```typescript
// 使用 Pinia Store 进行跨组件通信
import { useTemplateStore } from '@/stores/template-store'

const templateStore = useTemplateStore()

// 在组件中使用
const handleTemplateSelect = (template: Template) => {
  templateStore.setSelectedTemplate(template)
}
```

## 🎯 组件复用策略

### 组合式函数 (Composables)
```typescript
// composables/use-template-card.ts
import { ref, computed } from 'vue'
import type { Template } from '@/types/template'

export function useTemplateCard(template: Template) {
  const isSelected = ref(false)
  const isHovered = ref(false)
  
  const cardClasses = computed(() => [
    'template-card',
    {
      'template-card--selected': isSelected.value,
      'template-card--hovered': isHovered.value
    }
  ])
  
  const handleSelect = () => {
    isSelected.value = !isSelected.value
  }
  
  const handleMouseEnter = () => {
    isHovered.value = true
  }
  
  const handleMouseLeave = () => {
    isHovered.value = false
  }
  
  return {
    isSelected,
    isHovered,
    cardClasses,
    handleSelect,
    handleMouseEnter,
    handleMouseLeave
  }
}
```

### 高阶组件 (HOC)
```typescript
// 创建高阶组件
function withLoading<T extends object>(
  WrappedComponent: Component<T>
) {
  return defineComponent({
    name: `WithLoading(${WrappedComponent.name})`,
    props: ['loading', 'error'],
    setup(props, { slots }) {
      return () => {
        if (props.loading) {
          return h('div', { class: 'loading-container' }, [
            h(BaseLoading)
          ])
        }
        
        if (props.error) {
          return h('div', { class: 'error-container' }, [
            h('p', { class: 'error-message' }, props.error)
          ])
        }
        
        return h(WrappedComponent, props, slots)
      }
    }
  })
}
```

## 🧪 组件测试规范

### 单元测试模板
```typescript
// __tests__/components/base-button.test.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import BaseButton from '@/components/ui/base-button.vue'

describe('BaseButton', () => {
  it('renders correctly', () => {
    const wrapper = mount(BaseButton, {
      props: {
        type: 'primary',
        size: 'medium'
      },
      slots: {
        default: 'Click me'
      }
    })
    
    expect(wrapper.text()).toContain('Click me')
    expect(wrapper.classes()).toContain('base-button--primary')
    expect(wrapper.classes()).toContain('base-button--medium')
  })
  
  it('emits click event', async () => {
    const wrapper = mount(BaseButton)
    
    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toBeTruthy()
  })
  
  it('does not emit click when disabled', async () => {
    const wrapper = mount(BaseButton, {
      props: {
        disabled: true
      }
    })
    
    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toBeFalsy()
  })
})
```

## 📋 组件文档规范

### 组件文档模板
```vue
<!--
组件名称: BaseButton
组件描述: 基础按钮组件，支持多种样式和状态
组件作者: 开发团队
创建时间: 2024-01-20
最后更新: 2024-01-20

Props:
- type: 按钮类型 (primary | secondary | text | danger)
- size: 按钮尺寸 (small | medium | large)
- disabled: 是否禁用
- loading: 是否显示加载状态
- icon: 图标名称
- round: 是否圆角

Events:
- click: 点击事件

Slots:
- default: 按钮文本内容

使用示例:
<base-button type="primary" size="medium" @click="handleClick">
  点击我
</base-button>
-->
```

## 🔧 组件开发工具

### 开发环境配置
```typescript
// vite.config.ts 中添加组件自动导入
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [ElementPlusResolver()],
      dts: true,
      dirs: ['src/components']
    })
  ]
})
```

### 类型声明
```typescript
// types/component.ts
export interface BaseComponentProps {
  class?: string | string[]
  style?: string | Record<string, any>
}

export interface BaseComponentEmits {
  [key: string]: any[]
}

export interface BaseComponentSlots {
  [key: string]: (...args: any[]) => VNode[]
}
```

---

*本文档定义了出片手账项目的组件设计规范，确保组件的一致性和可维护性。*
