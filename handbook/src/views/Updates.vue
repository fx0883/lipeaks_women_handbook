<template>
  <div class="updates-page">
    <div class="main-content">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <h3>版本导航</h3>
        <nav class="sidebar-nav">
          <a 
            v-for="version in versions" 
            :key="version.id"
            :href="`#${version.id}`"
            :class="{ active: activeVersion === version.id }"
            @click="scrollToVersion(version.id)"
          >
            {{ version.icon }} {{ version.name }}
          </a>
        </nav>
        
        <h3>快速链接</h3>
        <div class="quick-links">
          <router-link to="/tutorial" class="btn ghost">📖 使用教程</router-link>
          <router-link to="/faq" class="btn ghost">❓ 常见问题</router-link>
          <router-link to="/feedback" class="btn ghost">📝 意见反馈</router-link>
        </div>
        
        <h3>更新统计</h3>
        <div class="update-stats">
          <div class="stat-item">
            <div class="stat-number">{{ totalUpdates }}</div>
            <div class="stat-label">总更新次数</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ latestVersion }}</div>
            <div class="stat-label">最新版本</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ updateFrequency }}</div>
            <div class="stat-label">更新频率</div>
          </div>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="content">
        <div class="page-header">
          <h1>版本更新</h1>
          <p class="sub">了解出片手账的最新功能和改进</p>
        </div>

        <!-- 最新版本 -->
        <div class="card" id="latest">
          <div class="version-header">
            <div class="version-info">
              <h2>🚀 最新版本 v2.5.0</h2>
              <div class="version-meta">
                <span class="release-date">发布日期：2024年1月15日</span>
                <span class="version-type major">重大更新</span>
              </div>
            </div>
            <div class="download-section">
              <button class="btn primary" @click="downloadLatest">立即更新</button>
              <div class="version-size">安装包大小：45.2MB</div>
            </div>
          </div>
          
          <div class="update-highlights">
            <h3>✨ 主要新功能</h3>
            <div class="feature-list">
              <div class="feature-item">
                <div class="feature-icon">🎨</div>
                <div class="feature-content">
                  <h4>AI智能排版</h4>
                  <p>全新的AI排版引擎，自动优化文字和图片布局，让作品更加美观</p>
                </div>
              </div>
              
              <div class="feature-item">
                <div class="feature-icon">📱</div>
                <div class="feature-content">
                  <h4>多设备同步</h4>
                  <p>支持手机、平板、电脑多设备数据同步，随时随地创作</p>
                </div>
              </div>
              
              <div class="feature-item">
                <div class="feature-icon">🎭</div>
                <div class="feature-content">
                  <h4>情绪分析</h4>
                  <p>基于AI的情绪分析功能，帮助用户更好地了解自己的情绪变化</p>
                </div>
              </div>
            </div>
            
            <h3>🔧 功能优化</h3>
            <ul class="improvement-list">
              <li>优化了模板加载速度，提升30%</li>
              <li>改进了图片编辑工具，支持更多滤镜效果</li>
              <li>增强了搜索功能，支持模糊搜索和标签筛选</li>
              <li>优化了内存使用，减少应用崩溃</li>
            </ul>
            
            <h3>🐛 问题修复</h3>
            <ul>
              <li>修复了iOS 17系统兼容性问题</li>
              <li>解决了部分设备上图片导出模糊的问题</li>
              <li>修复了情绪日历数据同步异常</li>
              <li>解决了应用锁偶尔失效的问题</li>
            </ul>
          </div>
        </div>

        <!-- 历史版本 -->
        <div class="card" id="v2-4-0">
          <div class="version-header">
            <h2>📱 v2.4.0 - 功能增强版</h2>
            <div class="version-meta">
              <span class="release-date">发布日期：2023年12月20日</span>
              <span class="version-type feature">功能更新</span>
            </div>
          </div>
          
          <div class="update-content">
            <h3>✨ 新功能</h3>
            <ul>
              <li>新增100+精美模板</li>
              <li>支持视频背景</li>
              <li>增加字体特效</li>
              <li>新增批量导出功能</li>
            </ul>
            
            <h3>🔧 优化</h3>
            <ul>
              <li>优化了应用启动速度</li>
              <li>改进了用户界面响应性</li>
              <li>增强了数据备份功能</li>
            </ul>
          </div>
        </div>

        <div class="card" id="v2-3-0">
          <div class="version-header">
            <h2>🎨 v2.3.0 - 界面优化版</h2>
            <div class="version-meta">
              <span class="release-date">发布日期：2023年11月15日</span>
              <span class="version-type ui">界面更新</span>
            </div>
          </div>
          
          <div class="update-content">
            <h3>✨ 新功能</h3>
            <ul>
              <li>全新的扁平化设计风格</li>
              <li>支持深色模式</li>
              <li>新增主题切换功能</li>
              <li>优化了移动端体验</li>
            </ul>
            
            <h3>🔧 优化</h3>
            <ul>
              <li>重新设计了图标系统</li>
              <li>优化了色彩搭配</li>
              <li>改进了动画效果</li>
            </ul>
          </div>
        </div>

        <div class="card" id="v2-2-0">
          <div class="version-header">
            <h2>📊 v2.2.0 - 数据分析版</h2>
            <div class="version-meta">
              <span class="release-date">发布日期：2023年10月10日</span>
              <span class="version-type feature">功能更新</span>
            </div>
          </div>
          
          <div class="update-content">
            <h3>✨ 新功能</h3>
            <ul>
              <li>新增情绪统计图表</li>
              <li>支持数据导出</li>
              <li>增加了使用时长统计</li>
              <li>新增成就系统</li>
            </ul>
            
            <h3>🔧 优化</h3>
            <ul>
              <li>优化了数据存储结构</li>
              <li>改进了图表显示效果</li>
              <li>增强了数据安全性</li>
            </ul>
          </div>
        </div>

        <div class="card" id="v2-1-0">
          <div class="version-header">
            <h2>🔒 v2.1.0 - 安全加强版</h2>
            <div class="version-meta">
              <span class="release-date">发布日期：2023年9月5日</span>
              <span class="version-type security">安全更新</span>
            </div>
          </div>
          
          <div class="update-content">
            <h3>✨ 新功能</h3>
            <ul>
              <li>新增应用锁功能</li>
              <li>支持指纹解锁</li>
              <li>增强了隐私保护</li>
              <li>新增数据加密</li>
            </ul>
            
            <h3>🔧 优化</h3>
            <ul>
              <li>优化了权限管理</li>
              <li>改进了安全机制</li>
              <li>增强了用户数据保护</li>
            </ul>
          </div>
        </div>

        <div class="card" id="v2-0-0">
          <div class="version-header">
            <h2>🌟 v2.0.0 - 重大升级版</h2>
            <div class="version-meta">
              <span class="release-date">发布日期：2023年8月1日</span>
              <span class="version-type major">重大更新</span>
            </div>
          </div>
          
          <div class="update-content">
            <h3>✨ 新功能</h3>
            <ul>
              <li>全新的用户界面设计</li>
              <li>支持云同步功能</li>
              <li>新增社区功能</li>
              <li>支持多语言</li>
              <li>新增离线模式</li>
            </ul>
            
            <h3>🔧 优化</h3>
            <ul>
              <li>重构了应用架构</li>
              <li>优化了性能表现</li>
              <li>改进了用户体验</li>
              <li>增强了稳定性</li>
            </ul>
          </div>
        </div>

        <!-- 更新计划 -->
        <div class="card">
          <h2>🚀 未来更新计划</h2>
          <div class="future-updates">
            <div class="update-plan">
              <h3>v2.6.0 - 社区版（预计2024年3月）</h3>
              <ul>
                <li>用户作品分享功能</li>
                <li>评论和点赞系统</li>
                <li>关注其他用户</li>
                <li>热门作品推荐</li>
              </ul>
            </div>
            
            <div class="update-plan">
              <h3>v2.7.0 - 智能版（预计2024年6月）</h3>
              <ul>
                <li>AI内容生成</li>
                <li>智能排版建议</li>
                <li>个性化推荐算法</li>
                <li>语音输入功能</li>
              </ul>
            </div>
            
            <div class="update-plan">
              <h3>v3.0.0 - 全平台版（预计2024年12月）</h3>
              <ul>
                <li>Web端应用</li>
                <li>桌面端应用</li>
                <li>跨平台数据同步</li>
                <li>团队协作功能</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 更新说明 -->
        <div class="card">
          <h2>📋 更新说明</h2>
          <div class="update-notes">
            <div class="note-section">
              <h3>🔄 自动更新</h3>
              <p>出片手账支持自动更新功能。当有新版本时，应用会在WiFi环境下自动下载并提示安装。您也可以在应用商店手动检查更新。</p>
            </div>
            
            <div class="note-section">
              <h3>📱 兼容性</h3>
              <p>v2.0及以上版本需要iOS 12.0或Android 6.0及以上系统。建议在更新前备份重要数据。</p>
            </div>
            
            <div class="note-section">
              <h3>💾 数据迁移</h3>
              <p>从v1.x升级到v2.x时，应用会自动迁移用户数据。如果遇到问题，请联系客服获取帮助。</p>
            </div>
            
            <div class="note-section">
              <h3>📞 问题反馈</h3>
              <p>如果在更新过程中遇到问题，请通过应用内反馈功能或联系客服。我们会尽快为您解决问题。</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeVersion = ref('latest')

const versions = [
  { id: 'latest', name: 'v2.5.0 最新版', icon: '🚀' },
  { id: 'v2-4-0', name: 'v2.4.0', icon: '📱' },
  { id: 'v2-3-0', name: 'v2.3.0', icon: '🎨' },
  { id: 'v2-2-0', name: 'v2.2.0', icon: '📊' },
  { id: 'v2-1-0', name: 'v2.1.0', icon: '🔒' },
  { id: 'v2-0-0', name: 'v2.0.0', icon: '🌟' }
]

const totalUpdates = 15
const latestVersion = 'v2.5.0'
const updateFrequency = '每月'

const scrollToVersion = (versionId: string) => {
  const target = document.getElementById(versionId)
  if (target) {
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
    activeVersion.value = versionId
  }
}

const downloadLatest = () => {
  alert('正在跳转到应用商店...')
}
</script>

<style scoped>
.updates-page {
  min-height: 100vh;
  background: var(--colorNeutralBackground1);
  padding-top: 80px; /* 为顶部导航留出空间 */
  width: 100%;
  box-sizing: border-box;
}

.main-content {
  display: flex;
  gap: 32px;
  padding: 24px;
  width: 100%;
  box-sizing: border-box;
}

.sidebar {
  width: 280px;
  flex-shrink: 0;
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
  margin-bottom: 32px;
}

.sidebar-nav a {
  display: block;
  padding: 12px 16px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 8px;
  color: var(--colorNeutralForeground1);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s ease;
}

.sidebar-nav a:hover {
  border-color: var(--pink-dark);
  background: rgba(143, 211, 200, 0.05);
}

.sidebar-nav a.active {
  background: rgba(143, 211, 200, 0.2);
  border-color: var(--pink-dark);
}

.quick-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 32px;
}

.quick-links .btn {
  width: 100%;
  margin-bottom: 8px;
  text-align: center;
  text-decoration: none;
}

.update-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 8px;
  background: white;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: var(--pink-dark);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--colorNeutralForeground3);
}

.content {
  flex: 1;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  margin: 0 0 8px;
  font-size: 32px;
  font-weight: 700;
  color: var(--colorNeutralForeground1);
}

.page-header .sub {
  margin: 0;
  font-size: 16px;
  color: var(--colorNeutralForeground2);
}

.card {
  background: white;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 24px;
}

.card h2 {
  margin: 0 0 24px;
  font-size: 24px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.version-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--colorNeutralStroke1);
}

.version-info h2 {
  margin: 0 0 12px;
  font-size: 24px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.version-meta {
  display: flex;
  gap: 16px;
  align-items: center;
}

.release-date {
  color: var(--colorNeutralForeground3);
  font-size: 14px;
}

.version-type {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.version-type.major {
  background: #ff6b6b;
}

.version-type.feature {
  background: #4ecdc4;
}

.version-type.ui {
  background: #45b7d1;
}

.version-type.security {
  background: #96ceb4;
}

.download-section {
  text-align: right;
}

.download-section .btn {
  margin-bottom: 8px;
}

.version-size {
  font-size: 12px;
  color: var(--colorNeutralForeground3);
}

.update-highlights h3 {
  margin: 24px 0 16px;
  font-size: 18px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.update-highlights h3:first-child {
  margin-top: 0;
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.feature-item {
  display: flex;
  gap: 16px;
  padding: 20px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 12px;
  background: rgba(143, 211, 200, 0.05);
}

.feature-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.feature-content h4 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.feature-content p {
  margin: 0;
  color: var(--colorNeutralForeground3);
  line-height: 1.6;
}

.improvement-list,
.update-content ul {
  margin: 0 0 16px;
  padding-left: 20px;
  color: var(--colorNeutralForeground1);
}

.improvement-list li,
.update-content li {
  margin-bottom: 8px;
  line-height: 1.6;
}

.update-content h3 {
  margin: 24px 0 16px;
  font-size: 18px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.update-content h3:first-child {
  margin-top: 0;
}

.future-updates {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.update-plan {
  padding: 20px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 12px;
  background: rgba(143, 211, 200, 0.05);
}

.update-plan h3 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.update-plan ul {
  margin: 0;
  padding-left: 20px;
  color: var(--colorNeutralForeground1);
}

.update-plan li {
  margin-bottom: 6px;
  line-height: 1.6;
}

.update-notes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.note-section h3 {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.note-section p {
  margin: 0;
  color: var(--colorNeutralForeground3);
  line-height: 1.6;
}

.btn {
  display: inline-block;
  padding: 8px 16px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 6px;
  background: white;
  color: var(--colorNeutralForeground1);
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover {
  border-color: var(--pink-dark);
  background: rgba(143, 211, 200, 0.05);
}

.btn.ghost {
  background: transparent;
}

.btn.primary {
  background: var(--pink-dark);
  color: white;
  border-color: var(--pink-dark);
}

.btn.primary:hover {
  background: var(--pink-darker);
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
    padding: 16px;
  }
  
  .sidebar {
    width: 100%;
    order: 2;
  }
  
  .content {
    order: 1;
  }
  
  .card {
    padding: 20px;
  }
  
  .version-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .download-section {
    text-align: left;
  }
  
  .feature-list {
    grid-template-columns: 1fr;
  }
  
  .future-updates {
    grid-template-columns: 1fr;
  }
  
  .update-notes {
    grid-template-columns: 1fr;
  }
}
</style>
