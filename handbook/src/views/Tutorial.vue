<template>
  <div class="tutorial-page">
    <div class="main-content">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <h3>教程目录</h3>
        <nav class="sidebar-nav">
          <a 
            v-for="section in sections" 
            :key="section.id"
            :href="`#${section.id}`" 
            :class="{ active: activeSection === section.id }"
            @click="scrollToSection(section.id)"
          >
            {{ section.icon }} {{ section.title }}
          </a>
        </nav>
        
        <h3>快速帮助</h3>
        <div class="quick-help">
          <router-link to="/faq" class="btn ghost">❓ 常见问题</router-link>
          <router-link to="/contact" class="btn ghost">📞 联系客服</router-link>
          <router-link to="/feedback" class="btn ghost">📝 意见反馈</router-link>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="content">
        <div class="page-header">
          <h1>使用教程</h1>
          <p class="sub">轻松上手，快速掌握出片手账的所有功能</p>
        </div>

        <!-- 快速开始 -->
        <div class="card" id="getting-started">
          <h2>🚀 快速开始</h2>
          <div class="tutorial-section">
            <h3>第一步：下载安装</h3>
            <p>从应用商店下载"出片手账"应用，支持iOS和Android系统。</p>
            
            <h3>第二步：注册登录</h3>
            <p>使用手机号或邮箱注册账号，设置你的专属昵称和头像。</p>
            
            <h3>第三步：完善资料</h3>
            <p>选择你喜欢的主题色彩，设置隐私偏好，开始你的手账之旅。</p>
            
            <div class="tutorial-tip">
              <strong>💡 小贴士：</strong>首次使用建议先浏览一下模板库，找到你喜欢的风格。
            </div>
          </div>
        </div>

        <!-- 一键出片 -->
        <div class="card" id="photo-creation">
          <h2>📸 一键出片</h2>
          <div class="tutorial-section">
            <h3>选择模板</h3>
            <p>在"出片"页面浏览各种精美模板，按分类、比例、风格筛选。</p>
            
            <h3>编辑内容</h3>
            <p>点击模板进入编辑器，添加文字、贴纸、滤镜，调整布局和颜色。</p>
            
            <h3>导出分享</h3>
            <p>完成编辑后，选择导出格式和尺寸，一键保存到相册或分享给朋友。</p>
            
            <div class="tutorial-steps">
              <div class="step">
                <span class="step-number">1</span>
                <span class="step-text">选择模板</span>
              </div>
              <div class="step-arrow">→</div>
              <div class="step">
                <span class="step-number">2</span>
                <span class="step-text">编辑内容</span>
              </div>
              <div class="step-arrow">→</div>
              <div class="step">
                <span class="step-number">3</span>
                <span class="step-text">导出分享</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 情绪打卡 -->
        <div class="card" id="mood-checkin">
          <h2>😊 情绪打卡</h2>
          <div class="tutorial-section">
            <h3>选择情绪</h3>
            <p>从5种基础情绪中选择当前的心情状态，支持自定义情绪标签。</p>
            
            <h3>记录感受</h3>
            <p>用文字记录今天的感受，可以选择预设文案或自由发挥。</p>
            
            <h3>选择颜色</h3>
            <p>为情绪选择对应的颜色，建立你的情绪色彩体系。</p>
            
            <div class="tutorial-tip">
              <strong>💡 小贴士：</strong>坚持打卡21天，你会发现情绪变化的规律。
            </div>
          </div>
        </div>

        <!-- 情绪日历 -->
        <div class="card" id="mood-calendar">
          <h2>📅 情绪日历</h2>
          <div class="tutorial-section">
            <h3>月历视图</h3>
            <p>以日历形式展示每日情绪记录，颜色代表不同情绪状态。</p>
            
            <h3>情绪统计</h3>
            <p>查看月度情绪分布，了解情绪变化趋势和规律。</p>
            
            <h3>详情查看</h3>
            <p>点击任意日期查看当天的详细记录和感受。</p>
            
            <div class="tutorial-tip">
              <strong>💡 小贴士：</strong>情绪日历帮助你更好地了解自己的情绪模式。
            </div>
          </div>
        </div>

        <!-- 生成卡片 -->
        <div class="card" id="mood-cards">
          <h2>🎨 生成卡片</h2>
          <div class="tutorial-section">
            <h3>选择模板</h3>
            <p>从多种卡片模板中选择，支持渐变、纯色、双色等风格。</p>
            
            <h3>自定义内容</h3>
            <p>选择情绪、颜色、文字、字体，打造专属的情绪卡片。</p>
            
            <h3>实时预览</h3>
            <p>所有修改都会实时显示在预览区域，确保效果满意。</p>
            
            <div class="tutorial-tip">
              <strong>💡 小贴士：</strong>可以保存喜欢的卡片模板，下次直接使用。
            </div>
          </div>
        </div>

        <!-- 相册管理 -->
        <div class="card" id="album-management">
          <h2>📁 相册管理</h2>
          <div class="tutorial-section">
            <h3>作品分类</h3>
            <p>按类型、时间、标签等条件筛选和查找作品。</p>
            
            <h3>批量操作</h3>
            <p>支持批量删除、移动、分享等操作，提高管理效率。</p>
            
            <h3>隐私保护</h3>
            <p>设置作品可见性，保护个人隐私。</p>
            
            <div class="tutorial-tip">
              <strong>💡 小贴士：</strong>定期整理相册，删除不需要的作品，保持整洁。
            </div>
          </div>
        </div>

        <!-- 设置管理 -->
        <div class="card" id="settings">
          <h2>⚙️ 设置管理</h2>
          <div class="tutorial-section">
            <h3>隐私设置</h3>
            <p>控制数据同步、分享权限、位置信息等隐私选项。</p>
            
            <h3>通知设置</h3>
            <p>自定义打卡提醒、更新通知等推送设置。</p>
            
            <h3>外观设置</h3>
            <p>选择主题色彩、字体大小、界面布局等显示选项。</p>
            
            <div class="tutorial-tip">
              <strong>💡 小贴士：</strong>根据个人喜好调整设置，让应用更符合你的使用习惯。
            </div>
          </div>
        </div>

        <!-- 使用技巧 -->
        <div class="card" id="tips">
          <h2>💡 使用技巧</h2>
          <div class="tutorial-section">
            <h3>提高效率</h3>
            <ul class="tips-list">
              <li>使用快捷键快速操作</li>
              <li>创建常用模板收藏</li>
              <li>设置自动备份和同步</li>
            </ul>
            
            <h3>创意灵感</h3>
            <ul class="tips-list">
              <li>关注官方模板更新</li>
              <li>参与社区分享交流</li>
              <li>尝试不同的配色组合</li>
            </ul>
            
            <h3>数据安全</h3>
            <ul class="tips-list">
              <li>定期备份重要作品</li>
              <li>设置应用锁保护隐私</li>
              <li>谨慎分享个人信息</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const activeSection = ref('getting-started')

const sections = [
  { id: 'getting-started', title: '快速开始', icon: '🚀' },
  { id: 'photo-creation', title: '一键出片', icon: '📸' },
  { id: 'mood-checkin', title: '情绪打卡', icon: '😊' },
  { id: 'mood-calendar', title: '情绪日历', icon: '📅' },
  { id: 'mood-cards', title: '生成卡片', icon: '🎨' },
  { id: 'album-management', title: '相册管理', icon: '📁' },
  { id: 'settings', title: '设置管理', icon: '⚙️' },
  { id: 'tips', title: '使用技巧', icon: '💡' }
]

const scrollToSection = (sectionId: string) => {
  const target = document.getElementById(sectionId)
  if (target) {
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
    activeSection.value = sectionId
  }
}

const handleScroll = () => {
  const sections = document.querySelectorAll('.card[id]')
  let current = ''
  
  sections.forEach(section => {
    const sectionTop = (section as HTMLElement).offsetTop
    if (window.pageYOffset >= sectionTop - 100) {
      current = section.getAttribute('id') || ''
    }
  })
  
  if (current && current !== activeSection.value) {
    activeSection.value = current
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.tutorial-page {
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

.quick-help {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-help .btn {
  width: 100%;
  margin-bottom: 8px;
  text-align: center;
  text-decoration: none;
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

.tutorial-section {
  margin-bottom: 32px;
}

.tutorial-section:last-child {
  margin-bottom: 0;
}

.tutorial-section h3 {
  margin: 24px 0 16px;
  font-size: 18px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.tutorial-section h3:first-child {
  margin-top: 0;
}

.tutorial-section p {
  margin: 0 0 16px;
  line-height: 1.6;
  color: var(--colorNeutralForeground1);
}

.tutorial-tip {
  background: rgba(143, 211, 200, 0.1);
  border: 1px solid rgba(143, 211, 200, 0.3);
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
}

.tutorial-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin: 24px 0;
  flex-wrap: wrap;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.step-number {
  width: 32px;
  height: 32px;
  background: var(--pink-dark);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.step-text {
  font-size: 14px;
  color: var(--colorNeutralForeground1);
  text-align: center;
}

.step-arrow {
  color: var(--colorNeutralForeground3);
  font-size: 20px;
  font-weight: bold;
}

.tips-list {
  margin: 0 0 16px;
  padding-left: 20px;
}

.tips-list li {
  margin-bottom: 8px;
  line-height: 1.6;
  color: var(--colorNeutralForeground1);
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
  
  .tutorial-steps {
    flex-direction: column;
    gap: 12px;
  }
  
  .step-arrow {
    transform: rotate(90deg);
  }
}
</style>
