# 出片手账 代码规范

## 📖 文档信息
- **版本**: v1.0
- **项目**: 出片手账 Vue 3 Web版
- **更新时间**: 2024-01-20
- **技术栈**: Vue 3.4+ + TypeScript 5.0+ + Vite 5.0+

## 🎯 代码规范原则

### 基本原则
- **可读性**: 代码应该易于阅读和理解
- **一致性**: 整个项目保持统一的代码风格
- **可维护性**: 代码结构清晰，易于修改和扩展
- **性能**: 编写高效的代码，避免不必要的性能损耗
- **安全性**: 注意数据安全和输入验证

### 代码质量目标
- **零警告**: 消除所有 TypeScript 和 ESLint 警告
- **高覆盖率**: 单元测试覆盖率 > 80%
- **低复杂度**: 函数圈复杂度 < 10
- **小体积**: 控制打包体积，首屏加载 < 3秒

## 📝 命名规范

### 文件命名
```typescript
// 使用 kebab-case
components/
├── ui/
│   ├── base-button.vue
│   ├── base-input.vue
│   └── base-card.vue
├── layout/
│   ├── app-header.vue
│   ├── app-sidebar.vue
│   └── app-footer.vue
└── business/
    ├── template-card.vue
    ├── mood-selector.vue
    └── theme-selector.vue

stores/
├── template-store.ts
├── project-store.ts
└── theme-store.ts

types/
├── template.ts
├── project.ts
└── common.ts
```

### 变量命名
```typescript
// 使用 camelCase
const userName = '小美'
const isSelected = true
const templateList = []
const selectedTemplateId = 'template-001'

// 常量使用 UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com'
const MAX_FILE_SIZE = 5 * 1024 * 1024
const DEFAULT_THEME = 'pink-dream'

// 私有变量使用下划线前缀
const _internalState = ref(null)
const _privateMethod = () => {}
```

### 函数命名
```typescript
// 动词开头，描述动作
const handleClick = () => {}
const validateInput = (value: string) => boolean
const formatDate = (date: Date) => string
const calculateTotal = (items: Item[]) => number

// 布尔函数使用 is/has/can 开头
const isValid = (value: string) => boolean
const hasPermission = (permission: string) => boolean
const canEdit = (item: Item) => boolean

// 异步函数使用 async/await
const fetchTemplates = async () => {
  const response = await api.get('/templates')
  return response.data
}

const saveProject = async (project: Project) => {
  try {
    await api.post('/projects', project)
    return true
  } catch (error) {
    console.error('保存项目失败:', error)
    return false
  }
}
```

### 组件命名
```typescript
// Vue 组件使用 PascalCase
// 文件名: base-button.vue
export default defineComponent({
  name: 'BaseButton'
})

// 组合式函数使用 camelCase
// 文件名: use-template-card.ts
export function useTemplateCard(template: Template) {
  // ...
}
```

## 🔧 TypeScript 规范

### 类型定义
```typescript
// 接口命名使用 PascalCase
interface Template {
  id: string
  name: string
  description: string
  category: TemplateCategory
  styleTag: string[]
  ratio: TemplateRatio
  thumbnail: string
  preview: string
  layers: Layer[]
  tags: string[]
  isPopular: boolean
  isNew: boolean
  version: number
  createdAt: string
}

// 类型别名使用 PascalCase
type TemplateCategory = 'daily' | 'mood' | 'memory' | 'special'
type TemplateRatio = '1:1' | '4:5' | '9:16' | '3:4'
type ThemeColor = 'pink' | 'purple' | 'mint' | 'peach' | 'lavender' | 'coral'

// 枚举使用 PascalCase
enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin'
}

// 泛型使用 T, K, V 等大写字母
interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

interface StoreState<T> {
  items: T[]
  loading: boolean
  error: string | null
}
```

### 类型注解
```typescript
// 显式类型注解
const userName: string = '小美'
const age: number = 18
const isActive: boolean = true
const tags: string[] = ['日常', '心情']
const template: Template = { /* ... */ }

// 函数参数和返回值类型
function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN')
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 箭头函数类型
const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// 异步函数类型
const fetchData = async (url: string): Promise<ApiResponse<Template[]>> => {
  const response = await fetch(url)
  return response.json()
}
```

### 类型断言
```typescript
// 使用 as 进行类型断言
const element = document.getElementById('app') as HTMLElement

// 使用尖括号语法（不推荐，与 JSX 冲突）
const element = <HTMLElement>document.getElementById('app')

// 非空断言
const userName = user?.name!

// 类型守卫
function isTemplate(obj: any): obj is Template {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string'
}

// 使用类型守卫
const processData = (data: unknown) => {
  if (isTemplate(data)) {
    // data 现在是 Template 类型
    console.log(data.name)
  }
}
```

## 🎨 Vue 3 规范

### 组件结构
```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup lang="ts">
// 导入语句
import { ref, computed, onMounted } from 'vue'
import type { Template } from '@/types/template'
import { useTemplateStore } from '@/stores/template-store'

// 类型定义
interface Props {
  template: Template
  selected?: boolean
}

interface Emits {
  select: [template: Template]
  preview: [template: Template]
}

// Props 和 Emits
const props = withDefaults(defineProps<Props>(), {
  selected: false
})

const emit = defineEmits<Emits>()

// 响应式数据
const isHovered = ref(false)
const loading = ref(false)

// 计算属性
const cardClasses = computed(() => [
  'template-card',
  {
    'template-card--selected': props.selected,
    'template-card--hovered': isHovered.value
  }
])

// 方法
const handleClick = () => {
  emit('select', props.template)
}

const handlePreview = () => {
  emit('preview', props.template)
}

// 生命周期
onMounted(() => {
  // 初始化逻辑
})
</script>

<style scoped>
/* 样式内容 */
</style>
```

### 组合式 API 使用
```typescript
// 使用 ref 而不是 reactive（推荐）
const user = ref<User>({
  id: '1',
  name: '小美',
  email: 'xiaomei@example.com'
})

// 使用 computed 进行派生状态
const fullName = computed(() => {
  return `${user.value.firstName} ${user.value.lastName}`
})

// 使用 watch 监听变化
watch(
  () => user.value.name,
  (newName, oldName) => {
    console.log(`用户名从 ${oldName} 改为 ${newName}`)
  }
)

// 使用 watchEffect 自动追踪依赖
watchEffect(() => {
  console.log(`当前用户: ${user.value.name}`)
})

// 使用 provide/inject 进行跨组件通信
const theme = ref<Theme>('pink-dream')
provide('theme', theme)

// 在子组件中使用
const theme = inject<Ref<Theme>>('theme')
```

### 事件处理
```typescript
// 事件处理函数命名
const handleClick = (event: MouseEvent) => {
  // 处理点击事件
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  // 处理输入事件
}

const handleSubmit = async (event: Event) => {
  event.preventDefault()
  // 处理提交事件
}

// 使用修饰符
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    // 处理回车键
  }
}
```

## 🔧 错误处理规范

### 异常处理
```typescript
// 使用 try-catch 处理异步操作
const fetchData = async () => {
  try {
    const response = await api.get('/templates')
    return response.data
  } catch (error) {
    console.error('获取模板失败:', error)
    throw new Error('获取模板失败')
  }
}

// 使用 Result 模式
interface Result<T> {
  success: boolean
  data?: T
  error?: string
}

const fetchTemplates = async (): Promise<Result<Template[]>> => {
  try {
    const response = await api.get('/templates')
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}

// 使用错误边界
const useErrorHandler = () => {
  const error = ref<Error | null>(null)
  
  const handleError = (err: Error) => {
    error.value = err
    console.error('发生错误:', err)
  }
  
  const clearError = () => {
    error.value = null
  }
  
  return {
    error: readonly(error),
    handleError,
    clearError
  }
}
```

### 输入验证
```typescript
// 验证工具函数
const validators = {
  required: (value: any): boolean => {
    return value !== null && value !== undefined && value !== ''
  },
  
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  },
  
  minLength: (value: string, min: number): boolean => {
    return value.length >= min
  },
  
  maxLength: (value: string, max: number): boolean => {
    return value.length <= max
  },
  
  fileSize: (file: File, maxSize: number): boolean => {
    return file.size <= maxSize
  },
  
  fileType: (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.includes(file.type)
  }
}

// 使用验证函数
const validateTemplate = (template: Partial<Template>): string[] => {
  const errors: string[] = []
  
  if (!validators.required(template.name)) {
    errors.push('模板名称不能为空')
  }
  
  if (template.name && !validators.minLength(template.name, 2)) {
    errors.push('模板名称至少2个字符')
  }
  
  if (template.name && !validators.maxLength(template.name, 30)) {
    errors.push('模板名称不能超过30个字符')
  }
  
  return errors
}
```

## 📊 性能优化规范

### 响应式优化
```typescript
// 使用 shallowRef 减少响应式开销
const largeData = shallowRef<LargeData[]>([])

// 使用 markRaw 标记不需要响应式的对象
const config = markRaw({
  apiUrl: 'https://api.example.com',
  timeout: 5000
})

// 使用 toRef 避免不必要的响应式
const user = reactive({
  name: '小美',
  age: 18
})

const userName = toRef(user, 'name')

// 使用 computed 缓存计算结果
const expensiveCalculation = computed(() => {
  return items.value.reduce((sum, item) => {
    return sum + complexCalculation(item)
  }, 0)
})
```

### 组件优化
```typescript
// 使用 defineAsyncComponent 懒加载组件
const AsyncComponent = defineAsyncComponent(() => 
  import('@/components/heavy-component.vue')
)

// 使用 v-memo 缓存模板
<template>
  <div v-for="item in items" :key="item.id" v-memo="[item.id, item.name]">
    {{ item.name }}
  </div>
</template>

// 使用 onMounted 延迟初始化
onMounted(() => {
  // 延迟加载非关键数据
  nextTick(() => {
    loadNonCriticalData()
  })
})
```

### 内存管理
```typescript
// 及时清理事件监听器
onMounted(() => {
  const handleResize = () => {
    // 处理窗口大小变化
  }
  
  window.addEventListener('resize', handleResize)
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
})

// 清理定时器
const timer = ref<number | null>(null)

onMounted(() => {
  timer.value = setInterval(() => {
    // 定时任务
  }, 1000)
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
```

## 🧪 测试规范

### 单元测试
```typescript
// 测试文件命名: component.test.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import BaseButton from '@/components/ui/base-button.vue'

describe('BaseButton', () => {
  let wrapper: ReturnType<typeof mount>
  
  beforeEach(() => {
    wrapper = mount(BaseButton, {
      props: {
        type: 'primary',
        size: 'medium'
      },
      slots: {
        default: 'Click me'
      }
    })
  })
  
  it('renders correctly', () => {
    expect(wrapper.text()).toContain('Click me')
    expect(wrapper.classes()).toContain('base-button--primary')
  })
  
  it('emits click event', async () => {
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
  
  it('does not emit click when disabled', async () => {
    await wrapper.setProps({ disabled: true })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })
})
```

### 工具函数测试
```typescript
// utils/validation.test.ts
import { describe, it, expect } from 'vitest'
import { validators } from '@/utils/validation'

describe('validators', () => {
  describe('required', () => {
    it('returns true for non-empty string', () => {
      expect(validators.required('hello')).toBe(true)
    })
    
    it('returns false for empty string', () => {
      expect(validators.required('')).toBe(false)
    })
    
    it('returns false for null', () => {
      expect(validators.required(null)).toBe(false)
    })
  })
  
  describe('email', () => {
    it('returns true for valid email', () => {
      expect(validators.email('test@example.com')).toBe(true)
    })
    
    it('returns false for invalid email', () => {
      expect(validators.email('invalid-email')).toBe(false)
    })
  })
})
```

## 📋 注释规范

### 代码注释
```typescript
// 单行注释使用 //
const maxRetries = 3 // 最大重试次数

// 多行注释使用 /* */
/*
 * 这是一个复杂的算法
 * 用于计算用户推荐分数
 * 基于用户行为和偏好
 */

// 函数注释使用 JSDoc
/**
 * 验证用户输入的数据
 * @param data 用户输入的数据
 * @returns 验证结果，包含错误信息
 */
function validateUserData(data: UserInput): ValidationResult {
  // 实现逻辑
}

// 类型注释
interface Template {
  /** 模板唯一标识符 */
  id: string
  /** 模板名称，最大30个字符 */
  name: string
  /** 模板描述，最大120个字符 */
  description: string
  /** 模板分类 */
  category: TemplateCategory
}
```

### 组件注释
```vue
<!--
组件名称: TemplateCard
组件描述: 模板卡片组件，用于展示模板信息
组件作者: 开发团队
创建时间: 2024-01-20
最后更新: 2024-01-20

Props:
- template: 模板数据对象
- selected: 是否被选中
- clickable: 是否可点击

Events:
- select: 选择模板时触发
- preview: 预览模板时触发

使用示例:
<template-card
  :template="template"
  :selected="isSelected"
  @select="handleSelect"
  @preview="handlePreview"
/>
-->
```

## 🔧 工具配置

### ESLint 配置
```json
{
  "extends": [
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "vue/component-name-in-template-casing": ["error", "kebab-case"],
    "vue/component-definition-name-casing": ["error", "PascalCase"],
    "vue/require-default-prop": "error",
    "vue/require-prop-types": "error"
  }
}
```

### Prettier 配置
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

### TypeScript 配置
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

---

*本文档定义了出片手账项目的代码规范，确保代码质量和团队协作效率。*
