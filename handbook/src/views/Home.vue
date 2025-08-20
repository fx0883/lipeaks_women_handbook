<template>
  <div class="main-content">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <h3>快速导航</h3>
      <nav class="sidebar-nav">
        <router-link to="/create" class="active">🎨 模板选择</router-link>
        <router-link to="/editor">✏️ 编辑器</router-link>
        <router-link to="/mood">😊 情绪打卡</router-link>
        <router-link to="/mood-calendar">📅 情绪日历</router-link>
        <router-link to="/album">📸 我的相册</router-link>
        <router-link to="/settings">⚙️ 设置</router-link>
      </nav>
      
      <h3>最近使用</h3>
      <div class="recent-templates">
        <div class="template-info">
          <img src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=200&q=80" alt="校园日常" />
          <div>校园日常拼贴</div>
        </div>
        <div class="template-info">
          <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80" alt="社团招新" />
          <div>社团招新海报</div>
        </div>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="content">
      <div class="page-header">
        <h1>出片手账</h1>
        <p class="sub">把日常小确幸"可爱出片 + 温柔记录"做成手账，三步生成可发朋友圈/小红书的图文</p>
      </div>

      <!-- 功能卡片 -->
      <div class="grid cols-3">
        <div class="card">
          <h2>🎨 一键出片</h2>
          <p>选择模板，替换内容，快速生成精美手账</p>
          <router-link to="/create" class="btn primary">开始创作</router-link>
        </div>
        
        <div class="card">
          <h2>😊 情绪打卡</h2>
          <p>记录每日心情，生成专属情绪卡片</p>
          <router-link to="/mood" class="btn primary">记录心情</router-link>
        </div>
        
        <div class="card">
          <h2>📸 我的相册</h2>
          <p>查看和管理所有创作的作品</p>
          <router-link to="/album" class="btn primary">查看相册</router-link>
        </div>
      </div>

      <!-- 模板预览 -->
      <div class="card">
        <h2>热门模板</h2>
        <div class="grid cols-4">
          <router-link to="/editor/campus-collage" class="template">
            <img src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=400&q=80" alt="校园日常" />
            <div class="template-info">
              <h3>校园日常拼贴</h3>
              <span class="badge">4:5</span>
            </div>
          </router-link>
          
          <router-link to="/editor/club-poster" class="template">
            <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80" alt="社团招新" />
            <div class="template-info">
              <h3>社团招新海报</h3>
              <span class="badge">9:16</span>
            </div>
          </router-link>
          
          <router-link to="/editor/citywalk" class="template">
            <img src="https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=400&q=80" alt="Citywalk" />
            <div class="template-info">
              <h3>Citywalk/旅行</h3>
              <span class="badge">9:16</span>
            </div>
          </router-link>
          
          <router-link to="/editor/dorm-food" class="template">
            <img src="https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&q=80" alt="宿舍美食" />
            <div class="template-info">
              <h3>宿舍日常/美食</h3>
              <span class="badge">1:1</span>
            </div>
          </router-link>
        </div>
      </div>

      <!-- 最近作品 -->
      <div class="card">
        <h2>最近作品</h2>
        <div class="album-grid">
          <router-link to="/project/1" class="album-item">
            <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&q=80" alt="作品1" />
          </router-link>
          <router-link to="/project/2" class="album-item">
            <img src="https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=300&q=80" alt="作品2" />
          </router-link>
          <router-link to="/project/3" class="album-item">
            <img src="https://images.unsplash.com/photo-1553729784-e91953dec042?w=300&q=80" alt="作品3" />
          </router-link>
          <router-link to="/project/4" class="album-item">
            <img src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&q=80" alt="作品4" />
          </router-link>
          <router-link to="/project/5" class="album-item">
            <img src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=300&q=80" alt="作品5" />
          </router-link>
          <router-link to="/project/6" class="album-item">
            <img src="https://images.unsplash.com/photo-1513258496099-48168024aec0?w=300&q=80" alt="作品6" />
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// 主页逻辑
</script>

<style scoped>
/* 复用原型样式 */
.main-content {
  flex: 1;
  display: flex;
  width: 100%;
  padding-top: 104px;
  padding-left: 32px;
  padding-right: 32px;
  padding-bottom: 24px;
  gap: 24px;
  box-sizing: border-box;
}

.sidebar {
  width: 280px;
  flex-shrink: 0;
  background: var(--colorNeutralBackground1);
  border-radius: 20px;
  padding: 24px;
  box-shadow: var(--shadow4);
  height: fit-content;
  position: sticky;
  top: 88px;
  border: 1px solid var(--colorNeutralStroke1);
}

.sidebar h3 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.sidebar-nav a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  color: var(--colorNeutralForeground2);
  text-decoration: none;
  transition: all 0.2s ease;
  font-weight: 500;
}

.sidebar-nav a:hover,
.sidebar-nav a.active {
  background: var(--pink-light);
  color: var(--pink-dark);
}

.recent-templates {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.template-info img {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 8px;
}

.template-info div {
  font-size: 12px;
  color: var(--sub);
}

.content {
  flex: 1;
  min-width: 0;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  margin: 0 0 12px;
  font-size: 32px;
  font-weight: 700;
  color: var(--colorNeutralForeground1);
}

.page-header .sub {
  margin: 0;
  color: var(--colorNeutralForeground2);
  font-size: 16px;
}

.card {
  background: var(--colorNeutralBackground1);
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 20px;
  padding: 24px;
  box-shadow: var(--shadow4);
  transition: all 0.2s ease;
  margin-bottom: 24px;
}

.card:hover {
  box-shadow: var(--shadow8);
  border-color: var(--pink-medium);
  transform: translateY(-2px);
}

.card h2 {
  margin: 0 0 20px;
  font-size: 20px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.grid {
  display: grid;
  gap: 20px;
}

.grid.cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid.cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

.template {
  display: block;
  text-decoration: none;
  color: inherit;
  border-radius: 20px;
  overflow: hidden;
  background: var(--colorNeutralBackground1);
  border: 1px solid var(--colorNeutralStroke1);
  transition: all 0.2s ease;
}

.template:hover {
  border-color: var(--pink-medium);
  box-shadow: var(--shadow8);
  transform: translateY(-3px);
}

.template img {
  width: 100%;
  aspect-ratio: 4/5;
  object-fit: cover;
  display: block;
}

.template-info {
  padding: 16px;
}

.template-info h3 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 500;
  color: var(--colorNeutralForeground1);
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  background: var(--colorBrandBackground);
  color: var(--colorBrandForeground);
  font-size: 12px;
  font-weight: 500;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 12px;
  border: 1px solid var(--colorNeutralStroke1);
  background: var(--colorNeutralBackground1);
  text-decoration: none;
  color: var(--colorNeutralForeground1);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;
}

.btn:hover {
  border-color: var(--colorBrandBackground);
  background: var(--pink-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow4);
}

.btn.primary {
  background: var(--colorBrandBackground);
  color: var(--colorBrandForeground);
  border-color: var(--colorBrandBackground);
}

.btn.primary:hover {
  background: var(--colorBrandBackgroundHover);
}

.album-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.album-item {
  border-radius: 12px;
  overflow: hidden;
  background: var(--colorNeutralBackground1);
  border: 1px solid var(--colorNeutralStroke1);
  transition: all 0.2s ease;
  text-decoration: none;
  color: var(--colorNeutralForeground1);
}

.album-item:hover {
  box-shadow: var(--shadow8);
  border-color: var(--colorNeutralStroke2);
}

.album-item img {
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-content {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    position: static;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }
  
  .grid.cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .grid.cols-3 {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .grid.cols-4 {
    grid-template-columns: 1fr;
  }
}
</style>
