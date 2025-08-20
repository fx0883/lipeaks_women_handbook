<template>
  <nav class="top-nav">
    <router-link to="/" class="logo">出片手账</router-link>
    
    <button 
      class="menu-btn" 
      aria-label="打开菜单" 
      title="菜单"
      @click="toggleMobileMenu"
    >
      ☰
    </button>
    
    <div class="nav-links" :class="{ open: isMobileMenuOpen }">
      <router-link 
        to="/create" 
        :class="{ active: isActive('/create') }"
        @click="closeMobileMenu"
      >
        出片
      </router-link>
      <router-link 
        to="/mood" 
        :class="{ active: isActive('/mood') }"
        @click="closeMobileMenu"
      >
        打卡
      </router-link>
      <router-link 
        to="/album" 
        :class="{ active: isActive('/album') }"
        @click="closeMobileMenu"
      >
        相册
      </router-link>
      <router-link 
        to="/tutorial" 
        :class="{ active: isActive('/tutorial') }"
        @click="closeMobileMenu"
      >
        教程
      </router-link>
      <router-link 
        to="/faq" 
        :class="{ active: isActive('/faq') }"
        @click="closeMobileMenu"
      >
        帮助
      </router-link>
      <router-link 
        to="/settings" 
        :class="{ active: isActive('/settings') }"
        @click="closeMobileMenu"
      >
        我的
      </router-link>
      
      <!-- 主题切换入口 -->
      <div class="theme-switcher">
        <button 
          class="theme-btn"
          @click="toggleThemeDropdown"
          :style="{ backgroundColor: currentThemeColor }"
        >
          🎨
        </button>
        <div class="theme-dropdown" :class="{ open: isThemeDropdownOpen }">
          <div 
            v-for="theme in themes" 
            :key="theme.id"
            class="theme-option"
            @click="switchTheme(theme)"
          >
            <div 
              class="theme-preview" 
              :style="{ backgroundColor: theme.colors.preview }"
            ></div>
            <span>{{ theme.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import type { Theme } from '@/types/theme'

const route = useRoute()
const themeStore = useThemeStore()

// 移动端菜单状态
const isMobileMenuOpen = ref(false)

// 主题下拉状态
const isThemeDropdownOpen = ref(false)

// 获取当前主题色
const currentThemeColor = computed(() => {
  return themeStore.current?.colors.primary || '#ff6b9d'
})

// 模拟主题数据
const mockThemes = [
  {
    id: 'pink-dream',
    name: '粉色梦境',
    category: 'pink',
    description: '温柔浪漫的粉色系',
    colors: {
      id: 'pink-dream',
      name: '粉色梦境',
      primary: '#ff6b9d',
      primaryHover: '#ff5a8c',
      primaryPressed: '#ff4a7a',
      secondary: '#ffeef4',
      accent: '#ffb3d1',
      preview: '#ff6b9d'
    },
    isCustom: false,
    createdAt: '2024-01-01'
  },
  {
    id: 'purple-magic',
    name: '紫色魔法',
    category: 'purple',
    description: '神秘优雅的紫色系',
    colors: {
      id: 'purple-magic',
      name: '紫色魔法',
      primary: '#9c88ff',
      primaryHover: '#8b7aff',
      primaryPressed: '#7a6bff',
      secondary: '#f0edff',
      accent: '#c4b5fd',
      preview: '#9c88ff'
    },
    isCustom: false,
    createdAt: '2024-01-01'
  }
]

// 获取所有主题
const themes = computed(() => {
  return themeStore.themes.length > 0 ? themeStore.themes : mockThemes
})

// 路由高亮判断
const isActive = (path: string): boolean => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

// 切换移动端菜单
const toggleMobileMenu = (): void => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// 关闭移动端菜单
const closeMobileMenu = (): void => {
  isMobileMenuOpen.value = false
}

// 切换主题下拉
const toggleThemeDropdown = (): void => {
  isThemeDropdownOpen.value = !isThemeDropdownOpen.value
}

// 切换主题
const switchTheme = (theme: Theme): void => {
  themeStore.switchTheme(theme)
  isThemeDropdownOpen.value = false
}

// 点击外部关闭下拉
const handleClickOutside = (event: Event): void => {
  const target = event.target as HTMLElement
  if (!target.closest('.theme-switcher')) {
    isThemeDropdownOpen.value = false
  }
}

// 监听点击外部
// onMounted(() => {
//   document.addEventListener('click', handleClickOutside)
// })

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  // 初始化主题数据
  if (themeStore.themes.length === 0) {
    themeStore.loadThemes(mockThemes)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* 复用原型样式 - 完整的顶部导航样式 */
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--colorNeutralBackground1);
  border-bottom: 1px solid var(--colorNeutralStroke1);
  box-shadow: var(--shadow4);
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: var(--colorBrandBackground);
  text-decoration: none;
  transition: color 0.2s ease;
}

.logo:hover {
  color: var(--colorBrandBackgroundHover);
}

.menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  color: var(--colorNeutralForeground1);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.menu-btn:hover {
  background: var(--colorNeutralBackground3);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-links a {
  color: var(--colorNeutralForeground2);
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;
}

.nav-links a:hover {
  color: var(--colorBrandBackground);
  background: var(--colorNeutralBackground3);
}

.nav-links a.active {
  color: var(--colorBrandBackground);
  background: var(--colorBrandBackground);
  color: var(--colorBrandForeground);
}

.nav-links a.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: var(--colorBrandBackground);
  border-radius: 1px;
}

/* 主题切换器 */
.theme-switcher {
  position: relative;
  margin-left: 16px;
}

.theme-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid var(--colorNeutralStroke1);
  background: var(--colorNeutralBackground1);
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.theme-btn:hover {
  border-color: var(--colorBrandBackground);
  transform: translateY(-1px);
  box-shadow: var(--shadow4);
}

.theme-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: var(--colorNeutralBackground1);
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 12px;
  box-shadow: var(--shadow16);
  padding: 8px;
  min-width: 160px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition: all 0.2s ease;
  z-index: 1000;
}

.theme-dropdown.open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.theme-option:hover {
  background: var(--colorNeutralBackground3);
}

.theme-preview {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid var(--colorNeutralStroke1);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .top-nav {
    height: 70px;
    padding: 0 16px;
  }
  
  .menu-btn {
    display: block;
  }
  
  .nav-links {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: var(--colorNeutralBackground1);
    border-bottom: 1px solid var(--colorNeutralStroke1);
    box-shadow: var(--shadow8);
    flex-direction: column;
    gap: 0;
    padding: 16px 0;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }
  
  .nav-links.open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  
  .nav-links a {
    width: 100%;
    padding: 16px 24px;
    border-radius: 0;
    border-bottom: 1px solid var(--colorNeutralStroke1);
  }
  
  .nav-links a:last-of-type {
    border-bottom: none;
  }
  
  .theme-switcher {
    margin-left: 0;
    margin-top: 16px;
    align-self: center;
  }
  
  .theme-dropdown {
    right: -8px;
    min-width: 140px;
  }
}
</style>
