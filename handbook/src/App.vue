<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import { useThemeStore } from './stores/theme'
import { useUserStore } from './stores/user'
import './styles/tokens.css'

const themeStore = useThemeStore()
const userStore = useUserStore()

onMounted(() => {
  // 恢复用户偏好设置
  userStore.restoreFromLocal()
  
  // 初始化主题
  themeStore.restoreFromLocal()
})
</script>

<template>
  <div id="app">
    <AppHeader />
    <main class="main-content">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

<style>
/* 全局样式重置 */
* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.5;
  color: var(--colorNeutralForeground1);
  background: var(--colorNeutralBackground2);
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 80px; /* 为固定头部留出空间 */
}

/* CSS 变量定义 */
:root {
  /* 中性色 */
  --colorNeutralForeground1: #242424;
  --colorNeutralForeground2: #616161;
  --colorNeutralForeground3: #8a8a8a;
  --colorNeutralBackground1: #ffffff;
  --colorNeutralBackground2: #fafafa;
  --colorNeutralStroke1: #e0e0e0;
  --colorNeutralStroke2: #d1d1d1;
  
  /* 品牌色 */
  --colorBrandBackground: #ff6b9d;
  --colorBrandBackgroundHover: #ff5a8c;
  --colorBrandBackgroundPressed: #ff4a7a;
  --colorBrandForeground: #ffffff;
  
  /* 阴影 */
  --shadow4: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow8: 0 4px 8px rgba(0, 0, 0, 0.12);
  --shadow16: 0 8px 16px rgba(0, 0, 0, 0.15);
  
  /* 粉色系 */
  --pink-light: #ffeef4;
  --pink-medium: #ffb3d1;
  --pink-dark: #ff6b9d;
}

/* 响应式断点 */
@media (max-width: 768px) {
  .main-content {
    padding-top: 70px;
  }
}
</style>
