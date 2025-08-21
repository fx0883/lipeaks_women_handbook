<template>
  <div class="faq-page">
    <div class="main-content">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <h3>问题分类</h3>
        <nav class="sidebar-nav">
          <a 
            v-for="category in categories" 
            :key="category.id"
            :href="`#${category.id}`" 
            :class="{ active: activeCategory === category.id }"
            @click="scrollToCategory(category.id)"
          >
            {{ category.icon }} {{ category.title }}
          </a>
        </nav>
        
        <h3>快速帮助</h3>
        <div class="quick-help">
          <router-link to="/tutorial" class="btn ghost">📖 使用教程</router-link>
          <router-link to="/contact" class="btn ghost">📞 联系客服</router-link>
          <router-link to="/feedback" class="btn ghost">📝 意见反馈</router-link>
        </div>
        
        <h3>搜索问题</h3>
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchTerm" 
            placeholder="输入关键词搜索..." 
            class="input" 
            @input="handleSearch"
          />
          <button class="btn" @click="handleSearch">搜索</button>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="content">
        <div class="page-header">
          <h1>常见问题</h1>
          <p class="sub">找到你需要的答案，快速解决问题</p>
        </div>

        <!-- 账号问题 -->
        <div class="card" id="account">
          <h2>👤 账号问题</h2>
          
          <div class="faq-item" v-for="item in accountFaqs" :key="item.id">
            <div class="faq-question" @click="toggleFaq(item.id)">
              <h3>{{ item.question }}</h3>
              <span class="faq-icon">{{ item.isOpen ? '−' : '+' }}</span>
            </div>
            <div class="faq-answer" :class="{ active: item.isOpen }">
              <p v-if="item.answer">{{ item.answer }}</p>
              <ol v-if="(item as any).steps">
                <li v-for="step in (item as any).steps" :key="step">{{ step }}</li>
              </ol>
              <ul v-if="item.points">
                <li v-for="point in item.points" :key="point">{{ point }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 功能使用 -->
        <div class="card" id="function">
          <h2>⚡ 功能使用</h2>
          
          <div class="faq-item" v-for="item in functionFaqs" :key="item.id">
            <div class="faq-question" @click="toggleFaq(item.id)">
              <h3>{{ item.question }}</h3>
              <span class="faq-icon">{{ item.isOpen ? '−' : '+' }}</span>
            </div>
            <div class="faq-answer" :class="{ active: item.isOpen }">
              <p v-if="item.answer">{{ item.answer }}</p>
              <ol v-if="(item as any).steps">
                <li v-for="step in (item as any).steps" :key="step">{{ step }}</li>
              </ol>
              <ul v-if="item.points">
                <li v-for="point in item.points" :key="point">{{ point }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 技术问题 -->
        <div class="card" id="technical">
          <h2>🔧 技术问题</h2>
          
          <div class="faq-item" v-for="item in technicalFaqs" :key="item.id">
            <div class="faq-question" @click="toggleFaq(item.id)">
              <h3>{{ item.question }}</h3>
              <span class="faq-icon">{{ item.isOpen ? '−' : '+' }}</span>
            </div>
            <div class="faq-answer" :class="{ active: item.isOpen }">
              <p v-if="item.answer">{{ item.answer }}</p>
              <ol v-if="(item as any).steps">
                <li v-for="step in (item as any).steps" :key="step">{{ step }}</li>
              </ol>
              <ul v-if="item.points">
                <li v-for="point in item.points" :key="point">{{ point }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 隐私安全 -->
        <div class="card" id="privacy">
          <h2>🔒 隐私安全</h2>
          
          <div class="faq-item" v-for="item in privacyFaqs" :key="item.id">
            <div class="faq-question" @click="toggleFaq(item.id)">
              <h3>{{ item.question }}</h3>
              <span class="faq-icon">{{ item.isOpen ? '−' : '+' }}</span>
            </div>
            <div class="faq-answer" :class="{ active: item.isOpen }">
              <p v-if="item.answer">{{ item.answer }}</p>
              <ol v-if="(item as any).steps">
                <li v-for="step in (item as any).steps" :key="step">{{ step }}</li>
              </ol>
              <ul v-if="item.points">
                <li v-for="point in item.points" :key="point">{{ point }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 付费问题 -->
        <div class="card" id="billing">
          <h2>💰 付费问题</h2>
          
          <div class="faq-item" v-for="item in billingFaqs" :key="item.id">
            <div class="faq-question" @click="toggleFaq(item.id)">
              <h3>{{ item.question }}</h3>
              <span class="faq-icon">{{ item.isOpen ? '−' : '+' }}</span>
            </div>
            <div class="faq-answer" :class="{ active: item.isOpen }">
              <p v-if="item.answer">{{ item.answer }}</p>
              <ol v-if="(item as any).steps">
                <li v-for="step in (item as any).steps" :key="step">{{ step }}</li>
              </ol>
              <ul v-if="item.points">
                <li v-for="point in item.points" :key="point">{{ point }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 其他问题 -->
        <div class="card" id="other">
          <h2>❓ 其他问题</h2>
          
          <div class="faq-item" v-for="item in otherFaqs" :key="item.id">
            <div class="faq-question" @click="toggleFaq(item.id)">
              <h3>{{ item.question }}</h3>
              <span class="faq-icon">{{ item.isOpen ? '−' : '+' }}</span>
            </div>
            <div class="faq-answer" :class="{ active: item.isOpen }">
              <p v-if="item.answer">{{ item.answer }}</p>
              <ol v-if="(item as any).steps">
                <li v-for="step in (item as any).steps" :key="step">{{ step }}</li>
              </ol>
              <ul v-if="item.points">
                <li v-for="point in item.points" :key="point">{{ point }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 没有找到答案 -->
        <div class="card">
          <h2>💬 没有找到答案？</h2>
          <p>如果上面的问题没有解决你的疑惑，可以通过以下方式联系我们：</p>
          <div class="contact-options">
            <router-link to="/contact" class="btn">📞 联系客服</router-link>
            <router-link to="/feedback" class="btn ghost">📝 提交反馈</router-link>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const activeCategory = ref('account')
const searchTerm = ref('')

const categories = [
  { id: 'account', title: '账号问题', icon: '👤' },
  { id: 'function', title: '功能使用', icon: '⚡' },
  { id: 'technical', title: '技术问题', icon: '🔧' },
  { id: 'privacy', title: '隐私安全', icon: '🔒' },
  { id: 'billing', title: '付费问题', icon: '💰' },
  { id: 'other', title: '其他问题', icon: '❓' }
]

// FAQ数据
const accountFaqs = ref([
  {
    id: 'account-1',
    question: '如何注册出片手账账号？',
    answer: '注册出片手账账号非常简单：',
    steps: [
      '下载并打开出片手账应用',
      '点击"注册"按钮',
      '输入手机号或邮箱地址',
      '设置密码和昵称',
      '完成验证即可开始使用'
    ],
    isOpen: false
  },
  {
    id: 'account-2',
    question: '忘记密码怎么办？',
    answer: '如果忘记密码，可以通过以下方式重置：',
    points: [
      '在登录页面点击"忘记密码"',
      '输入注册时的手机号或邮箱',
      '获取验证码并输入',
      '设置新密码'
    ],
    isOpen: false
  },
  {
    id: 'account-3',
    question: '如何修改个人资料？',
    answer: '修改个人资料的步骤：',
    steps: [
      '进入"我的"页面',
      '点击"个人资料"',
      '修改头像、昵称、个性签名等',
      '点击"保存"完成修改'
    ],
    isOpen: false
  }
])

const functionFaqs = ref([
  {
    id: 'function-1',
    question: '如何使用一键出片功能？',
    answer: '一键出片功能使用步骤：',
    steps: [
      '在"出片"页面浏览模板',
      '选择喜欢的模板点击进入',
      '编辑文字、添加贴纸、调整滤镜',
      '预览效果满意后点击"导出"',
      '选择保存到相册或分享给朋友'
    ],
    isOpen: false
  },
  {
    id: 'function-2',
    question: '情绪打卡有什么作用？',
    answer: '情绪打卡功能的作用：',
    points: [
      '记录每日情绪变化，了解自己的情绪模式',
      '通过情绪日历查看长期情绪趋势',
      '帮助识别情绪触发因素',
      '培养情绪觉察能力',
      '为心理健康提供数据支持'
    ],
    isOpen: false
  },
  {
    id: 'function-3',
    question: '如何生成情绪卡片？',
    answer: '生成情绪卡片的步骤：',
    steps: [
      '进入"打卡"页面，选择"生成卡片"',
      '选择卡片模板和风格',
      '选择情绪表情和颜色',
      '输入或选择文字内容',
      '调整字体、大小、装饰等',
      '预览效果后下载或分享'
    ],
    isOpen: false
  }
])

const technicalFaqs = ref([
  {
    id: 'technical-1',
    question: '应用闪退怎么办？',
    answer: '如果应用出现闪退，可以尝试以下解决方法：',
    points: [
      '重启应用',
      '检查设备存储空间是否充足',
      '更新应用到最新版本',
      '重启设备',
      '如果问题持续，请联系客服'
    ],
    isOpen: false
  },
  {
    id: 'technical-2',
    question: '图片上传失败怎么办？',
    answer: '图片上传失败的常见原因和解决方法：',
    points: [
      '检查网络连接是否稳定',
      '确认图片格式是否支持（JPG、PNG等）',
      '检查图片大小是否超过限制',
      '尝试重新上传',
      '如果问题持续，请检查应用权限设置'
    ],
    isOpen: false
  },
  {
    id: 'technical-3',
    question: '数据同步失败怎么办？',
    answer: '数据同步失败的解决方法：',
    steps: [
      '检查网络连接',
      '确认账号登录状态',
      '尝试手动同步',
      '检查存储空间',
      '重启应用'
    ],
    isOpen: false
  }
])

const privacyFaqs = ref([
  {
    id: 'privacy-1',
    question: '我的数据安全吗？',
    answer: '我们非常重视用户数据安全：',
    points: [
      '所有数据都经过加密存储',
      '支持本地存储，数据不上传服务器',
      '提供应用锁功能保护隐私',
      '支持数据导出和删除',
      '严格遵守隐私政策和数据保护法规'
    ],
    isOpen: false
  },
  {
    id: 'privacy-2',
    question: '如何设置应用锁？',
    answer: '设置应用锁的步骤：',
    steps: [
      '进入"我的"页面',
      '选择"隐私设置"',
      '开启"应用锁"功能',
      '设置锁屏密码或指纹',
      '每次打开应用都需要验证'
    ],
    isOpen: false
  },
  {
    id: 'privacy-3',
    question: '可以删除我的数据吗？',
    answer: '当然可以，我们支持完整的数据删除：',
    points: [
      '在设置中选择"数据管理"',
      '选择"删除所有数据"',
      '确认删除操作',
      '数据将被永久删除，无法恢复',
      '也可以选择删除特定类型的数据'
    ],
    isOpen: false
  }
])

const billingFaqs = ref([
  {
    id: 'billing-1',
    question: '出片手账是免费的吗？',
    answer: '出片手账采用免费+增值服务模式：',
    points: [
      '基础功能完全免费使用',
      '提供丰富的免费模板和素材',
      '高级功能和素材需要订阅',
      '支持按月、按年订阅',
      '新用户有免费试用期'
    ],
    isOpen: false
  },
  {
    id: 'billing-2',
    question: '如何取消订阅？',
    answer: '取消订阅的方法：',
    steps: [
      'iOS用户：在设置中管理订阅',
      'Android用户：在Google Play中管理订阅',
      '也可以在应用内"订阅管理"中操作',
      '取消后当前订阅期仍可使用',
      '到期后自动停止续费'
    ],
    isOpen: false
  }
])

const otherFaqs = ref([
  {
    id: 'other-1',
    question: '如何联系客服？',
    answer: '联系客服的方式：',
    points: [
      '在应用内"帮助与反馈"中留言',
      '发送邮件到客服邮箱',
      '通过社交媒体联系我们',
      '客服工作时间：9:00-18:00',
      '紧急问题会优先处理'
    ],
    isOpen: false
  },
  {
    id: 'other-2',
    question: '可以提建议吗？',
    answer: '我们非常欢迎用户的建议：',
    points: [
      '在"意见反馈"中提交建议',
      '参与用户调研和投票',
      '加入用户交流群讨论',
      '优秀建议会被采纳并实现',
      '提供建议的用户会获得奖励'
    ],
    isOpen: false
  }
])

const toggleFaq = (faqId: string) => {
  // 关闭其他所有FAQ
  const allFaqs = [...accountFaqs.value, ...functionFaqs.value, ...technicalFaqs.value, ...privacyFaqs.value, ...billingFaqs.value, ...otherFaqs.value]
  
  allFaqs.forEach(faq => {
    if (faq.id === faqId) {
      faq.isOpen = !faq.isOpen
    } else {
      faq.isOpen = false
    }
  })
}

const handleSearch = () => {
  if (!searchTerm.value.trim()) {
    // 如果搜索词为空，显示所有FAQ
    const allFaqs = [...accountFaqs.value, ...functionFaqs.value, ...technicalFaqs.value, ...privacyFaqs.value, ...billingFaqs.value, ...otherFaqs.value]
    allFaqs.forEach(faq => {
      faq.isOpen = false
    })
    return
  }
  
  const searchLower = searchTerm.value.toLowerCase()
  const allFaqs = [...accountFaqs.value, ...functionFaqs.value, ...technicalFaqs.value, ...privacyFaqs.value, ...billingFaqs.value, ...otherFaqs.value]
  
  allFaqs.forEach(faq => {
    const question = faq.question.toLowerCase()
    const answer = faq.answer.toLowerCase()
    const steps = (faq as any).steps?.join(' ').toLowerCase() || ''
    const points = faq.points?.join(' ').toLowerCase() || ''
    
    if (question.includes(searchLower) || answer.includes(searchLower) || steps.includes(searchLower) || points.includes(searchLower)) {
      faq.isOpen = true
    } else {
      faq.isOpen = false
    }
  })
}

const scrollToCategory = (categoryId: string) => {
  const target = document.getElementById(categoryId)
  if (target) {
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
    activeCategory.value = categoryId
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
  
  if (current && current !== activeCategory.value) {
    activeCategory.value = current
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
.faq-page {
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
  margin-bottom: 32px;
}

.quick-help .btn {
  width: 100%;
  margin-bottom: 8px;
  text-align: center;
  text-decoration: none;
}

.search-box {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.search-box .input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 6px;
  font-size: 14px;
}

.search-box .input:focus {
  outline: none;
  border-color: var(--pink-dark);
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

.faq-item {
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 12px;
  margin-bottom: 16px;
  overflow: hidden;
}

.faq-question {
  padding: 20px;
  background: white;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s ease;
}

.faq-question:hover {
  background: rgba(143, 211, 200, 0.05);
}

.faq-question h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.faq-icon {
  font-size: 20px;
  color: var(--pink-dark);
  font-weight: bold;
  transition: transform 0.2s ease;
}

.faq-answer {
  padding: 0 20px;
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease;
  background: rgba(143, 211, 200, 0.05);
}

.faq-answer.active {
  padding: 20px;
  max-height: 500px;
}

.faq-answer p {
  margin: 0 0 16px;
  line-height: 1.6;
  color: var(--colorNeutralForeground1);
}

.faq-answer ol,
.faq-answer ul {
  margin: 0 0 16px;
  padding-left: 20px;
}

.faq-answer li {
  margin-bottom: 8px;
  line-height: 1.6;
  color: var(--colorNeutralForeground1);
}

.contact-options {
  display: flex;
  gap: 16px;
  margin-top: 24px;
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
  
  .contact-options {
    flex-direction: column;
  }
}
</style>
