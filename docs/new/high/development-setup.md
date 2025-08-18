# 出片手账 开发环境配置

## 📖 文档信息
- **版本**: v1.0
- **项目**: 出片手账 Vue 3 Web版
- **更新时间**: 2024-01-20
- **技术栈**: Vue 3.4+ + TypeScript 5.0+ + Vite 5.0+

## 🎯 环境要求

### 系统要求
- **操作系统**: Windows 10+, macOS 10.15+, Ubuntu 18.04+
- **内存**: 最低 8GB，推荐 16GB
- **存储**: 至少 10GB 可用空间
- **网络**: 稳定的互联网连接

### 开发工具要求
- **Node.js**: 18.0.0+ (LTS版本)
- **包管理器**: pnpm 8.0.0+
- **Git**: 2.30.0+
- **编辑器**: VS Code 1.80.0+ (推荐)

## 🔧 环境安装

### 1. Node.js 安装

#### Windows
```bash
# 下载并安装 Node.js LTS 版本
# 访问 https://nodejs.org/ 下载安装包

# 验证安装
node --version
npm --version
```

#### macOS
```bash
# 使用 Homebrew 安装
brew install node

# 验证安装
node --version
npm --version
```

#### Linux (Ubuntu/Debian)
```bash
# 使用 NodeSource 仓库
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node --version
npm --version
```

### 2. pnpm 安装

```bash
# 使用 npm 安装 pnpm
npm install -g pnpm

# 验证安装
pnpm --version
```

### 3. Git 安装

#### Windows
```bash
# 下载并安装 Git for Windows
# 访问 https://git-scm.com/download/win

# 验证安装
git --version
```

#### macOS
```bash
# 使用 Homebrew 安装
brew install git

# 验证安装
git --version
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt-get install git

# CentOS/RHEL
sudo yum install git

# 验证安装
git --version
```

### 4. VS Code 安装

#### 下载安装
- 访问 https://code.visualstudio.com/ 下载
- 安装完成后启动 VS Code

#### 推荐插件
```json
{
  "recommendations": [
    "Vue.volar",
    "Vue.vscode-typescript-vue-plugin",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

## 📦 项目初始化

### 1. 克隆项目
```bash
# 克隆项目仓库
git clone <repository-url>
cd women_handbook

# 创建 Vue 项目目录
mkdir vue
cd vue
```

### 2. 创建 Vue 项目
```bash
# 使用 Vite 创建 Vue 项目
pnpm create vue@latest .

# 选择配置
✓ Project name: … women-handbook-vue
✓ Add TypeScript? … Yes
✓ Add JSX Support? … No
✓ Add Vue Router for Single Page Application development? … Yes
✓ Add Pinia for state management? … Yes
✓ Add Vitest for Unit Testing? … Yes
✓ Add an End-to-End Testing Solution? … No
✓ Add ESLint for code quality? … Yes
✓ Add Prettier for code formatting? … Yes
```

### 3. 安装依赖
```bash
# 安装项目依赖
pnpm install

# 安装额外依赖
pnpm add element-plus @element-plus/icons-vue
pnpm add tailwindcss autoprefixer postcss
pnpm add dayjs lodash-es
pnpm add -D @types/lodash-es
```

## ⚙️ 配置文件

### 1. package.json
```json
{
  "name": "women-handbook-vue",
  "version": "1.0.0",
  "description": "出片手账 Vue 3 Web版",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore",
    "format": "prettier --write src/",
    "type-check": "vue-tsc --noEmit"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0",
    "element-plus": "^2.5.0",
    "@element-plus/icons-vue": "^2.3.0",
    "tailwindcss": "^3.4.0",
    "dayjs": "^1.11.0",
    "lodash-es": "^4.17.21"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "@vue/tsconfig": "^0.5.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "vue-tsc": "^1.8.0",
    "vitest": "^1.0.0",
    "@vue/test-utils": "^2.4.0",
    "eslint": "^8.57.0",
    "@vue/eslint-config-typescript": "^12.0.0",
    "@vue/eslint-config-prettier": "^8.0.0",
    "prettier": "^3.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "@types/lodash-es": "^4.17.12"
  }
}
```

### 2. vite.config.ts
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          element: ['element-plus']
        }
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true
  }
})
```

### 3. tsconfig.json
```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "include": [
    "env.d.ts",
    "src/**/*",
    "src/**/*.vue"
  ],
  "exclude": [
    "src/**/__tests__/*"
  ],
  "compilerOptions": {
    "composite": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "skipLibCheck": true
  }
}
```

### 4. tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ffeef4',
          100: '#ffd4e3',
          200: '#ffb3d1',
          300: '#ff8fb3',
          400: '#ff6b9d',
          500: '#ff4a7a',
          600: '#ff2a5a',
          700: '#ff0a3a',
          800: '#e6001a',
          900: '#cc0014'
        }
      },
      fontFamily: {
        sans: ['PingFang SC', 'Helvetica Neue', 'Arial', 'sans-serif']
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px'
      }
    },
  },
  plugins: [],
}
```

### 5. postcss.config.js
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 6. .eslintrc.cjs
```javascript
/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
    'vue/component-definition-name-casing': ['error', 'PascalCase'],
    'vue/require-default-prop': 'error',
    'vue/require-prop-types': 'error'
  }
}
```

### 7. .prettierrc
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

### 8. .gitignore
```gitignore
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage
*.lcov

# nyc test coverage
.nyc_output

# Grunt intermediate storage (https://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# Bower dependency directory (https://bower.io/)
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons (https://nodejs.org/api/addons.html)
build/Release

# Dependency directories
node_modules/
jspm_packages/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional stylelint cache
.stylelintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next
out

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
# Comment in the public line in if your project uses Gatsby and not Next.js
# https://nextjs.org/blog/next-9-1#public-directory-support
# public

# vuepress build output
.vuepress/dist

# vuepress v2.x temp and cache directory
.temp
.cache

# Docusaurus cache and generated files
.docusaurus

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# yarn v2
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.*

# Vite
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS generated files
Thumbs.db
```

## 🚀 开发命令

### 基础命令
```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview

# 运行测试
pnpm test

# 运行测试 UI
pnpm test:ui

# 代码检查
pnpm lint

# 代码格式化
pnpm format

# 类型检查
pnpm type-check
```

### 开发工作流
```bash
# 1. 启动开发服务器
pnpm dev

# 2. 在另一个终端运行类型检查
pnpm type-check

# 3. 在另一个终端运行测试
pnpm test

# 4. 提交前运行代码检查
pnpm lint
pnpm format
pnpm type-check
pnpm test
```

## 🔧 开发工具配置

### VS Code 设置
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "vue.codeActions.enabled": false,
  "files.associations": {
    "*.vue": "vue"
  },
  "emmet.includeLanguages": {
    "vue": "html"
  }
}
```

### VS Code 工作区设置
```json
{
  "folders": [
    {
      "name": "出片手账",
      "path": "."
    }
  ],
  "settings": {
    "editor.tabSize": 2,
    "editor.insertSpaces": true,
    "files.eol": "\n",
    "files.trimTrailingWhitespace": true,
    "files.insertFinalNewline": true
  },
  "extensions": {
    "recommendations": [
      "Vue.volar",
      "Vue.vscode-typescript-vue-plugin",
      "bradlc.vscode-tailwindcss",
      "esbenp.prettier-vscode",
      "dbaeumer.vscode-eslint"
    ]
  }
}
```

## 📁 项目结构

### 创建项目结构
```bash
# 创建目录结构
mkdir -p src/{components/{ui,layout,business},views,stores,types,composables,utils,assets/{images,icons,fonts},router,constants,styles}
mkdir -p mockup
mkdir -p docs

# 创建基础文件
touch src/main.ts
touch src/App.vue
touch src/env.d.ts
touch src/styles/{variables.css,base.css,components.css,themes.css}
touch src/router/index.ts
touch src/stores/index.ts
touch src/types/{template.ts,project.ts,mood.ts,theme.ts,common.ts}
touch src/composables/{use-image-processing.ts,use-theme-switching.ts,use-data-export.ts,use-local-storage.ts}
touch src/utils/{image-utils.ts,theme-utils.ts,export-utils.ts,storage-utils.ts}
touch src/constants/{theme-colors.ts,filter-presets.ts,app-config.ts}
touch mockup/{templates.json,projects.json,moods.json,themes.json}
```

### 基础文件内容

#### src/main.ts
```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'

import './styles/base.css'

const app = createApp(App)

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')
```

#### src/App.vue
```vue
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// App 组件逻辑
</script>

<style>
#app {
  font-family: var(--font-family-base);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
```

#### src/env.d.ts
```typescript
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

## 🔍 调试配置

### VS Code 调试配置
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Current Test File",
      "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
      "args": ["run", "${relativeFile}"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### 浏览器调试
```typescript
// 开发环境调试工具
const debug = {
  log: (message: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.log(`[DEBUG] ${message}`, data)
    }
  },
  
  error: (message: string, error?: any) => {
    if (import.meta.env.DEV) {
      console.error(`[ERROR] ${message}`, error)
    }
  },
  
  warn: (message: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.warn(`[WARN] ${message}`, data)
    }
  }
}

export default debug
```

## 🧪 测试配置

### Vitest 配置
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
    setupFiles: ['./src/test/setup.ts']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
```

### 测试设置文件
```typescript
// src/test/setup.ts
import { config } from '@vue/test-utils'

// 全局测试配置
config.global.stubs = {
  'el-icon': true,
  'el-button': true,
  'el-input': true
}
```

## 📊 性能监控

### 开发环境性能监控
```typescript
// src/utils/performance.ts
export const performanceMonitor = {
  measure: (name: string, fn: () => void) => {
    const start = performance.now()
    fn()
    const end = performance.now()
    console.log(`${name} took ${end - start}ms`)
  },
  
  measureAsync: async (name: string, fn: () => Promise<void>) => {
    const start = performance.now()
    await fn()
    const end = performance.now()
    console.log(`${name} took ${end - start}ms`)
  }
}
```

## 🔧 环境变量

### .env 文件
```bash
# .env
VITE_APP_TITLE=出片手账
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_VERSION=1.0.0
```

### .env.development
```bash
# .env.development
VITE_APP_TITLE=出片手账 (开发版)
VITE_API_BASE_URL=http://localhost:3000/api
VITE_DEBUG=true
```

### .env.production
```bash
# .env.production
VITE_APP_TITLE=出片手账
VITE_API_BASE_URL=https://api.example.com
VITE_DEBUG=false
```

## 🚀 部署配置

### 构建优化
```typescript
// vite.config.ts 中的构建配置
build: {
  target: 'es2015',
  outDir: 'dist',
  assetsDir: 'assets',
  sourcemap: false,
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true,
      drop_debugger: true
    }
  },
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['vue', 'vue-router', 'pinia'],
        element: ['element-plus'],
        utils: ['dayjs', 'lodash-es']
      }
    }
  }
}
```

---

*本文档提供了完整的开发环境配置指南，确保开发团队能够快速搭建和运行项目。*
