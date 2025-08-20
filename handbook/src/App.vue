<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import { useThemeStore } from './stores/theme'
import { useUserStore } from './stores/user'
import './styles/tokens.css'
import themesData from './data/themes.json'

const themeStore = useThemeStore()
const userStore = useUserStore()

onMounted(() => {
  // 恢复用户偏好设置
  userStore.restoreFromLocal()
  
  // 加载主题数据
  themeStore.loadThemes(themesData.themes)
  
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

/* 全局样式 - CSS变量定义在 tokens.css 中 */

/* 响应式断点 */
@media (max-width: 768px) {
  .main-content {
    padding-top: 70px;
  }
}
</style>
