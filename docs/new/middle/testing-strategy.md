# 出片手账 测试策略文档

## 📖 文档信息
- **版本**: v1.0
- **项目**: 出片手账 Vue 3 Web版
- **更新时间**: 2024-01-20
- **目标**: 为AI提供完整的测试策略和实现指导

## 🎯 测试策略概述

### 测试理念
- **质量优先**: 确保代码质量和用户体验
- **全面覆盖**: 覆盖功能、性能、兼容性等各个方面
- **自动化优先**: 尽可能自动化测试流程
- **持续集成**: 与开发流程紧密结合
- **用户导向**: 以用户体验为核心进行测试

### 测试目标
- 确保核心功能正常工作
- 保证性能满足要求
- 验证跨浏览器兼容性
- 确保用户体验流畅
- 预防回归问题

## 📋 测试类型规划

### 单元测试 (Unit Testing)
**目标**: 测试独立的函数、组件和模块
**工具**: Vitest + Vue Test Utils
**覆盖率目标**: 80%+

### 集成测试 (Integration Testing)
**目标**: 测试组件间的交互和数据流
**工具**: Vitest + Vue Test Utils
**重点**: 状态管理、路由、API调用

### 端到端测试 (E2E Testing)
**目标**: 测试完整的用户流程
**工具**: Playwright
**重点**: 关键用户路径

### 性能测试 (Performance Testing)
**目标**: 确保应用性能满足要求
**工具**: Lighthouse + 自定义性能监控
**指标**: 首屏加载时间 < 3秒

### 兼容性测试 (Compatibility Testing)
**目标**: 确保跨浏览器兼容性
**工具**: BrowserStack + 自动化测试
**范围**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## 🧪 单元测试实现

### 测试配置
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
```

### 测试设置
```typescript
// tests/setup.ts
import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// 全局配置
config.global.stubs = {
  'BaseIcon': true,
  'ElMessage': true,
  'ElMessageBox': true
}

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
global.localStorage = localStorageMock

// Mock fetch
global.fetch = vi.fn()

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))
```

### 组件测试示例
```typescript
// tests/components/BaseButton.test.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import BaseButton from '@/components/ui/BaseButton.vue'

describe('BaseButton', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(BaseButton, {
      slots: { default: 'Click me' }
    })
  })

  it('renders correctly', () => {
    expect(wrapper.text()).toBe('Click me')
    expect(wrapper.classes()).toContain('btn')
  })

  it('applies variant classes', () => {
    const wrapper = mount(BaseButton, {
      props: { variant: 'secondary' }
    })
    
    expect(wrapper.classes()).toContain('btn-secondary')
  })

  it('applies size classes', () => {
    const wrapper = mount(BaseButton, {
      props: { size: 'lg' }
    })
    
    expect(wrapper.classes()).toContain('btn-lg')
  })

  it('emits click event', async () => {
    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit click when disabled', async () => {
    const disabledWrapper = mount(BaseButton, {
      props: { disabled: true }
    })
    
    await disabledWrapper.trigger('click')
    
    expect(disabledWrapper.emitted('click')).toBeFalsy()
  })

  it('shows icon when provided', () => {
    const wrapper = mount(BaseButton, {
      props: { icon: 'heart' }
    })
    
    expect(wrapper.findComponent({ name: 'BaseIcon' })).toBeTruthy()
  })

  it('applies custom classes', () => {
    const wrapper = mount(BaseButton, {
      attrs: { class: 'custom-class' }
    })
    
    expect(wrapper.classes()).toContain('custom-class')
  })
})
```

### 组合式函数测试
```typescript
// tests/composables/useThemeSwitch.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useThemeSwitch } from '@/composables/useThemeSwitch'
import { createPinia, setActivePinia } from 'pinia'

describe('useThemeSwitch', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('returns current theme', () => {
    const { currentTheme } = useThemeSwitch()
    
    expect(currentTheme).toBeDefined()
    expect(currentTheme.id).toBe('pink-dream')
  })

  it('returns all themes', () => {
    const { allThemes } = useThemeSwitch()
    
    expect(allThemes).toBeInstanceOf(Array)
    expect(allThemes.length).toBeGreaterThan(0)
  })

  it('switches theme correctly', async () => {
    const { switchTheme, currentTheme } = useThemeSwitch()
    
    await switchTheme('purple-fantasy')
    
    expect(currentTheme.id).toBe('purple-fantasy')
  })

  it('creates custom theme', () => {
    const { createCustomTheme, customThemes } = useThemeSwitch()
    
    const customTheme = createCustomTheme({
      name: 'Test Theme',
      description: 'Test Description',
      colors: {
        primary: '#ff0000',
        secondary: '#00ff00',
        accent: '#0000ff'
      }
    })
    
    expect(customTheme.isCustom).toBe(true)
    expect(customTheme.name).toBe('Test Theme')
    expect(customThemes.length).toBeGreaterThan(0)
  })

  it('checks if theme is current', () => {
    const { isCurrentTheme } = useThemeSwitch()
    
    expect(isCurrentTheme('pink-dream')).toBe(true)
    expect(isCurrentTheme('purple-fantasy')).toBe(false)
  })
})
```

### 工具函数测试
```typescript
// tests/utils/imageCompression.test.ts
import { describe, it, expect, vi } from 'vitest'
import { ImageCompressor } from '@/utils/imageCompression'

describe('ImageCompressor', () => {
  it('compresses image correctly', async () => {
    // 创建模拟的File对象
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    
    // Mock canvas
    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn().mockReturnValue({
        drawImage: vi.fn()
      }),
      toBlob: vi.fn().mockImplementation((callback) => {
        callback(new Blob(['compressed']))
      })
    }
    
    vi.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any)
    
    const compressedFile = await ImageCompressor.compress(mockFile, {
      maxWidth: 800,
      maxHeight: 600,
      quality: 0.8
    })
    
    expect(compressedFile).toBeInstanceOf(File)
    expect(compressedFile.name).toBe('test.jpg')
  })

  it('calculates dimensions correctly', () => {
    const result = ImageCompressor['calculateDimensions'](1920, 1080, 800, 600)
    
    expect(result.width).toBe(800)
    expect(result.height).toBe(450)
  })

  it('handles errors gracefully', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    
    // Mock failed image loading
    vi.spyOn(document, 'createElement').mockReturnValue({
      getContext: vi.fn().mockReturnValue(null)
    } as any)
    
    await expect(ImageCompressor.compress(mockFile)).rejects.toThrow('图片压缩失败')
  })
})
```

## 🔗 集成测试实现

### 状态管理测试
```typescript
// tests/stores/theme.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useThemeStore } from '@/stores/theme'

describe('Theme Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default theme', () => {
    const store = useThemeStore()
    
    expect(store.currentTheme.id).toBe('pink-dream')
    expect(store.allThemes.length).toBeGreaterThan(0)
  })

  it('switches theme correctly', () => {
    const store = useThemeStore()
    
    store.switchTheme('purple-fantasy')
    
    expect(store.currentTheme.id).toBe('purple-fantasy')
    expect(store.settings.currentThemeId).toBe('purple-fantasy')
  })

  it('creates custom theme', () => {
    const store = useThemeStore()
    const initialCount = store.customThemes.length
    
    const customTheme = store.createCustomTheme({
      name: 'Custom Theme',
      description: 'Custom Description'
    })
    
    expect(customTheme.isCustom).toBe(true)
    expect(store.customThemes.length).toBe(initialCount + 1)
  })

  it('saves and loads settings', () => {
    const store = useThemeStore()
    
    // 修改设置
    store.settings.autoSwitch = true
    store.saveSettings()
    
    // 重新创建store
    setActivePinia(createPinia())
    const newStore = useThemeStore()
    
    // 加载设置
    newStore.loadSettings()
    
    expect(newStore.settings.autoSwitch).toBe(true)
  })

  it('filters themes by category', () => {
    const store = useThemeStore()
    
    const pinkThemes = store.allThemes.filter(theme => theme.category === 'pink')
    
    expect(pinkThemes.length).toBeGreaterThan(0)
    expect(pinkThemes.every(theme => theme.category === 'pink')).toBe(true)
  })
})
```

### 路由测试
```typescript
// tests/router/index.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'

describe('Router', () => {
  let router: any

  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes
    })
  })

  it('has correct routes', () => {
    expect(routes).toHaveLength(7) // 主要路由数量
    
    const routeNames = routes.map(route => route.name)
    expect(routeNames).toContain('Home')
    expect(routeNames).toContain('Create')
    expect(routeNames).toContain('Editor')
    expect(routeNames).toContain('Mood')
    expect(routeNames).toContain('Album')
    expect(routeNames).toContain('Settings')
  })

  it('navigates to home page', async () => {
    await router.push('/')
    
    expect(router.currentRoute.value.name).toBe('Home')
  })

  it('navigates to editor with params', async () => {
    await router.push('/editor/123')
    
    expect(router.currentRoute.value.name).toBe('Editor')
    expect(router.currentRoute.value.params.id).toBe('123')
  })

  it('handles 404 correctly', async () => {
    await router.push('/non-existent')
    
    expect(router.currentRoute.value.name).toBe('NotFound')
  })
})
```

## 🌐 端到端测试实现

### Playwright配置
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    }
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI
  }
})
```

### E2E测试示例
```typescript
// tests/e2e/theme-switching.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Theme Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should switch theme correctly', async ({ page }) => {
    // 打开主题选择器
    await page.click('[data-testid="theme-selector"]')
    
    // 选择紫色主题
    await page.click('[data-testid="theme-purple-fantasy"]')
    
    // 验证主题已切换
    await expect(page.locator('body')).toHaveCSS('--color-primary', '#a855f7')
    
    // 验证主题设置已保存
    const themeId = await page.evaluate(() => {
      return localStorage.getItem('women_handbook_theme_settings')
    })
    expect(themeId).toContain('purple-fantasy')
  })

  test('should create custom theme', async ({ page }) => {
    // 打开主题选择器
    await page.click('[data-testid="theme-selector"]')
    
    // 点击创建自定义主题
    await page.click('[data-testid="create-custom-theme"]')
    
    // 填写主题信息
    await page.fill('[data-testid="theme-name"]', 'My Custom Theme')
    await page.fill('[data-testid="theme-description"]', 'My custom theme description')
    
    // 选择颜色
    await page.click('[data-testid="primary-color-picker"]')
    await page.fill('[data-testid="primary-color-input"]', '#ff0000')
    
    // 保存主题
    await page.click('[data-testid="save-theme"]')
    
    // 验证主题已创建
    await expect(page.locator('[data-testid="theme-My Custom Theme"]')).toBeVisible()
  })

  test('should apply theme to all components', async ({ page }) => {
    // 切换到紫色主题
    await page.click('[data-testid="theme-selector"]')
    await page.click('[data-testid="theme-purple-fantasy"]')
    
    // 验证按钮颜色
    const button = page.locator('.btn-primary')
    await expect(button).toHaveCSS('background-color', 'rgb(168, 85, 247)')
    
    // 验证卡片样式
    const card = page.locator('.card')
    await expect(card).toHaveCSS('border-color', 'rgb(229, 231, 235)')
    
    // 验证文字颜色
    const text = page.locator('h1')
    await expect(text).toHaveCSS('color', 'rgb(31, 41, 55)')
  })
})
```

```typescript
// tests/e2e/image-editor.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Image Editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/create')
  })

  test('should upload and edit image', async ({ page }) => {
    // 选择模板
    await page.click('[data-testid="template-daily-001"]')
    
    // 上传图片
    const fileChooserPromise = page.waitForEvent('filechooser')
    await page.click('[data-testid="upload-image"]')
    const fileChooser = await fileChooserPromise
    await fileChooser.setFiles('tests/fixtures/test-image.jpg')
    
    // 验证图片已上传
    await expect(page.locator('[data-testid="uploaded-image"]')).toBeVisible()
    
    // 添加文字
    await page.click('[data-testid="add-text"]')
    await page.fill('[data-testid="text-input"]', 'Hello World')
    
    // 验证文字已添加
    await expect(page.locator('[data-testid="canvas-text"]')).toContainText('Hello World')
    
    // 导出图片
    await page.click('[data-testid="export-image"]')
    
    // 验证下载开始
    const downloadPromise = page.waitForEvent('download')
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/women_handbook_.*\.png/)
  })

  test('should apply filters', async ({ page }) => {
    // 选择模板并上传图片
    await page.click('[data-testid="template-daily-001"]')
    const fileChooserPromise = page.waitForEvent('filechooser')
    await page.click('[data-testid="upload-image"]')
    const fileChooser = await fileChooserPromise
    await fileChooser.setFiles('tests/fixtures/test-image.jpg')
    
    // 应用滤镜
    await page.click('[data-testid="filter-grayscale"]')
    
    // 验证滤镜已应用
    await expect(page.locator('[data-testid="canvas-image"]')).toHaveCSS('filter', 'grayscale(100%)')
  })
})
```

## 📊 性能测试实现

### Lighthouse测试
```typescript
// tests/performance/lighthouse.test.ts
import { test, expect } from '@playwright/test'
import lighthouse from 'lighthouse'
import { launch } from 'chrome-launcher'

test.describe('Performance Tests', () => {
  test('should meet performance requirements', async () => {
    const chrome = await launch({ chromeFlags: ['--headless'] })
    const options = {
      logLevel: 'info',
      output: 'json',
      onlyCategories: ['performance'],
      port: chrome.port
    }

    const runnerResult = await lighthouse('http://localhost:5173', options)
    const report = runnerResult.lhr

    // 性能指标检查
    expect(report.categories.performance.score).toBeGreaterThan(0.8)
    expect(report.audits['first-contentful-paint'].numericValue).toBeLessThan(2000)
    expect(report.audits['largest-contentful-paint'].numericValue).toBeLessThan(3000)
    expect(report.audits['cumulative-layout-shift'].numericValue).toBeLessThan(0.1)

    await chrome.kill()
  })
})
```

### 自定义性能监控
```typescript
// tests/performance/custom-metrics.test.ts
import { test, expect } from '@playwright/test'

test.describe('Custom Performance Metrics', () => {
  test('should load page within 3 seconds', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/')
    
    const loadTime = Date.now() - startTime
    expect(loadTime).toBeLessThan(3000)
  })

  test('should render components efficiently', async ({ page }) => {
    await page.goto('/')
    
    // 测量组件渲染时间
    const renderTime = await page.evaluate(() => {
      const start = performance.now()
      
      // 触发组件渲染
      document.dispatchEvent(new Event('DOMContentLoaded'))
      
      return performance.now() - start
    })
    
    expect(renderTime).toBeLessThan(100)
  })

  test('should handle large image uploads', async ({ page }) => {
    await page.goto('/create')
    
    // 上传大图片
    const fileChooserPromise = page.waitForEvent('filechooser')
    await page.click('[data-testid="upload-image"]')
    const fileChooser = await fileChooserPromise
    await fileChooser.setFiles('tests/fixtures/large-image.jpg')
    
    // 测量压缩时间
    const compressionTime = await page.evaluate(() => {
      return new Promise(resolve => {
        const start = performance.now()
        
        // 监听压缩完成事件
        document.addEventListener('imageCompressed', () => {
          resolve(performance.now() - start)
        })
      })
    })
    
    expect(compressionTime).toBeLessThan(5000)
  })
})
```

## 🌍 兼容性测试实现

### 跨浏览器测试
```typescript
// tests/compatibility/browser-compatibility.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Browser Compatibility', () => {
  test('should work in Chrome', async ({ page }) => {
    await page.goto('/')
    
    // 测试基本功能
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('.btn')).toBeVisible()
    
    // 测试主题切换
    await page.click('[data-testid="theme-selector"]')
    await page.click('[data-testid="theme-purple-fantasy"]')
    
    // 验证CSS变量更新
    const primaryColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--color-primary')
    })
    expect(primaryColor.trim()).toBe('#a855f7')
  })

  test('should work in Firefox', async ({ page }) => {
    await page.goto('/')
    
    // Firefox特定测试
    await expect(page.locator('h1')).toBeVisible()
    
    // 测试Canvas功能
    await page.goto('/create')
    await page.click('[data-testid="template-daily-001"]')
    
    const canvas = page.locator('canvas')
    await expect(canvas).toBeVisible()
  })

  test('should work in Safari', async ({ page }) => {
    await page.goto('/')
    
    // Safari特定测试
    await expect(page.locator('h1')).toBeVisible()
    
    // 测试WebP支持
    const webpSupport = await page.evaluate(() => {
      const canvas = document.createElement('canvas')
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
    })
    
    expect(webpSupport).toBe(true)
  })
})
```

### 响应式测试
```typescript
// tests/compatibility/responsive.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Responsive Design', () => {
  test('should work on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // 验证移动端布局
    await expect(page.locator('.mobile-nav')).toBeVisible()
    await expect(page.locator('.desktop-nav')).not.toBeVisible()
    
    // 测试触摸交互
    await page.touchscreen.tap(200, 300)
  })

  test('should work on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')
    
    // 验证平板端布局
    await expect(page.locator('.tablet-layout')).toBeVisible()
  })

  test('should work on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')
    
    // 验证桌面端布局
    await expect(page.locator('.desktop-nav')).toBeVisible()
    await expect(page.locator('.sidebar')).toBeVisible()
  })
})
```

## 📈 测试报告和监控

### 测试覆盖率报告
```typescript
// tests/coverage.config.ts
export default {
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html', 'lcov'],
    exclude: [
      'node_modules/',
      'tests/',
      '**/*.d.ts',
      '**/*.config.*',
      'dist/',
      'coverage/'
    ],
    thresholds: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
      }
    }
  }
}
```

### 持续集成配置
```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: pnpm install
    
    - name: Run unit tests
      run: pnpm test:unit
    
    - name: Run integration tests
      run: pnpm test:integration
    
    - name: Run E2E tests
      run: pnpm test:e2e
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
```

## 📝 测试最佳实践

### 测试编写原则
1. **AAA模式**: Arrange, Act, Assert
2. **单一职责**: 每个测试只测试一个功能
3. **可读性**: 测试名称清晰描述测试内容
4. **独立性**: 测试之间不相互依赖
5. **可维护性**: 测试代码易于维护和更新

### 测试数据管理
```typescript
// tests/fixtures/test-data.ts
export const mockTemplates = [
  {
    id: 'test-template-1',
    name: 'Test Template 1',
    description: 'Test template for testing',
    category: 'daily',
    styleTag: ['test'],
    ratio: '4:5',
    thumbnail: 'https://example.com/thumb1.jpg',
    preview: 'https://example.com/preview1.jpg',
    tags: ['test'],
    isPopular: false,
    isNew: false,
    version: 1,
    createdAt: '2024-01-01'
  }
]

export const mockThemes = [
  {
    id: 'test-theme-1',
    name: 'Test Theme',
    category: 'custom',
    description: 'Test theme for testing',
    colors: {
      primary: '#ff0000',
      secondary: '#00ff00',
      accent: '#0000ff'
    },
    isCustom: true,
    createdAt: '2024-01-01'
  }
]
```

### 测试工具函数
```typescript
// tests/utils/test-helpers.ts
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

export function createTestWrapper(component: any, options = {}) {
  return mount(component, {
    global: {
      plugins: [createPinia()],
      stubs: {
        'BaseIcon': true,
        'ElMessage': true,
        'ElMessageBox': true
      }
    },
    ...options
  })
}

export function setupTestPinia() {
  setActivePinia(createPinia())
}

export function mockLocalStorage() {
  const store: Record<string, string> = {}
  
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    })
  }
}
```

## 📝 总结

本测试策略文档为"出片手账"项目提供了完整的测试解决方案，包括：

1. **全面的测试类型**: 单元测试、集成测试、E2E测试、性能测试
2. **自动化测试**: 使用Vitest、Playwright等现代测试工具
3. **持续集成**: 与CI/CD流程紧密结合
4. **质量保证**: 确保代码质量和用户体验
5. **最佳实践**: 提供测试编写和维护的最佳实践

通过这些测试策略，可以确保项目的稳定性和可靠性。
