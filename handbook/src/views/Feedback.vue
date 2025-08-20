<template>
  <div class="feedback-page">
    <div class="main-content">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <h3>反馈类型</h3>
        <nav class="sidebar-nav">
          <a 
            v-for="type in feedbackTypes" 
            :key="type.id"
            :href="`#${type.id}`" 
            :class="{ active: activeType === type.id }"
            @click="scrollToType(type.id)"
          >
            {{ type.icon }} {{ type.title }}
          </a>
        </nav>
        
        <h3>快速帮助</h3>
        <div class="quick-help">
          <router-link to="/tutorial" class="btn ghost">📖 使用教程</router-link>
          <router-link to="/faq" class="btn ghost">❓ 常见问题</router-link>
          <router-link to="/contact" class="btn ghost">📞 联系客服</router-link>
        </div>
        
        <h3>反馈历史</h3>
        <div class="feedback-history">
          <div 
            v-for="item in feedbackHistory" 
            :key="item.id"
            class="history-item"
            @click="viewHistoryItem(item)"
          >
            <div :class="['history-status', item.status]">{{ item.statusText }}</div>
            <div class="history-title">{{ item.title }}</div>
            <div class="history-date">{{ item.date }}</div>
          </div>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="content">
        <div class="page-header">
          <h1>意见反馈</h1>
          <p class="sub">你的每一个建议都是我们进步的动力</p>
        </div>

        <!-- 反馈表单 -->
        <div class="card">
          <h2>📝 提交反馈</h2>
          <form class="feedback-form" @submit.prevent="submitFeedback">
            <!-- 反馈类型 -->
            <div class="form-group">
              <label for="feedback-type">反馈类型 *</label>
              <select 
                id="feedback-type" 
                v-model="feedbackData.type" 
                class="input" 
                required
              >
                <option value="">请选择反馈类型</option>
                <option value="bug">🐛 问题反馈</option>
                <option value="feature">💡 功能建议</option>
                <option value="ui">🎨 界面优化</option>
                <option value="content">📝 内容建议</option>
                <option value="other">❓ 其他反馈</option>
              </select>
            </div>

            <!-- 反馈标题 -->
            <div class="form-group">
              <label for="feedback-title">反馈标题 *</label>
              <input 
                type="text" 
                id="feedback-title" 
                v-model="feedbackData.title" 
                class="input" 
                placeholder="请简要描述你的反馈..." 
                required 
              />
            </div>

            <!-- 反馈内容 -->
            <div class="form-group">
              <label for="feedback-content">详细描述 *</label>
              <textarea 
                id="feedback-content" 
                v-model="feedbackData.content" 
                class="input" 
                rows="6" 
                placeholder="请详细描述你的反馈内容，包括具体的使用场景、遇到的问题或建议的改进方案..." 
                required
              ></textarea>
            </div>

            <!-- 优先级 -->
            <div class="form-group">
              <label for="feedback-priority">优先级</label>
              <div class="priority-options">
                <label 
                  v-for="priority in priorities" 
                  :key="priority.value"
                  class="priority-option"
                >
                  <input 
                    type="radio" 
                    :value="priority.value" 
                    v-model="feedbackData.priority" 
                  />
                  <span :class="['priority-label', priority.value]">{{ priority.label }}</span>
                </label>
              </div>
            </div>

            <!-- 联系方式 -->
            <div class="form-group">
              <label for="feedback-contact">联系方式</label>
              <input 
                type="text" 
                id="feedback-contact" 
                v-model="feedbackData.contact" 
                class="input" 
                placeholder="邮箱或手机号（可选，用于反馈进度通知）" 
              />
            </div>

            <!-- 附件上传 -->
            <div class="form-group">
              <label for="feedback-attachment">附件上传</label>
              <div class="attachment-upload">
                <input 
                  type="file" 
                  id="feedback-attachment" 
                  @change="handleFileUpload" 
                  accept="image/*,.pdf,.doc,.docx" 
                  multiple 
                />
                <div class="upload-hint">
                  <p>支持图片、PDF、Word文档，最多5个文件，单个文件不超过10MB</p>
                  <p>可以上传截图、错误日志等帮助说明问题的文件</p>
                </div>
              </div>
            </div>

            <!-- 提交按钮 -->
            <div class="form-actions">
              <button type="button" class="btn ghost" @click="previewFeedback">预览</button>
              <button type="submit" class="btn primary">提交反馈</button>
            </div>
          </form>
        </div>

        <!-- 反馈指南 -->
        <div class="card">
          <h2>📋 反馈指南</h2>
          <div class="feedback-guide">
            <div class="guide-section">
              <h3>🐛 问题反馈</h3>
              <p>请详细描述：</p>
              <ul>
                <li>问题发生的具体步骤</li>
                <li>使用的设备和系统版本</li>
                <li>期望的正确行为</li>
                <li>是否能够重复出现</li>
              </ul>
            </div>
            
            <div class="guide-section">
              <h3>💡 功能建议</h3>
              <p>请说明：</p>
              <ul>
                <li>建议功能的使用场景</li>
                <li>如何提升用户体验</li>
                <li>是否有类似功能参考</li>
                <li>优先级和重要性</li>
              </ul>
            </div>
            
            <div class="guide-section">
              <h3>🎨 界面优化</h3>
              <p>请描述：</p>
              <ul>
                <li>当前界面的问题</li>
                <li>期望的改进效果</li>
                <li>可以参考的设计案例</li>
                <li>对用户体验的影响</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 常见反馈 -->
        <div class="card">
          <h2>💭 常见反馈</h2>
          <div class="common-feedback">
            <div 
              v-for="item in commonFeedback" 
              :key="item.id"
              class="feedback-item"
            >
              <div class="feedback-header">
                <span :class="['feedback-type', item.type]">{{ item.typeText }}</span>
                <span :class="['feedback-status', item.status]">{{ item.statusText }}</span>
              </div>
              <h4>{{ item.title }}</h4>
              <p>{{ item.description }}</p>
              <div class="feedback-meta">
                <span>提交时间：{{ item.submitTime }}</span>
                <span>{{ item.resolveTime }}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'

const activeType = ref('bug-report')

const feedbackTypes = [
  { id: 'bug-report', title: '问题反馈', icon: '🐛' },
  { id: 'feature-request', title: '功能建议', icon: '💡' },
  { id: 'ui-improvement', title: '界面优化', icon: '🎨' },
  { id: 'content-suggestion', title: '内容建议', icon: '📝' },
  { id: 'other-feedback', title: '其他反馈', icon: '❓' }
]

const priorities = [
  { value: 'low', label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' }
]

const feedbackData = reactive({
  type: '',
  title: '',
  content: '',
  priority: 'medium',
  contact: '',
  attachments: [] as File[]
})

const feedbackHistory = ref([
  {
    id: 1,
    status: 'success',
    statusText: '已处理',
    title: '界面优化建议',
    date: '2024-01-15'
  },
  {
    id: 2,
    status: 'pending',
    statusText: '处理中',
    title: '新增滤镜功能',
    date: '2024-01-14'
  },
  {
    id: 3,
    status: 'success',
    statusText: '已采纳',
    title: '情绪标签优化',
    date: '2024-01-13'
  }
])

const commonFeedback = ref([
  {
    id: 1,
    type: 'bug',
    typeText: '问题反馈',
    status: 'resolved',
    statusText: '已解决',
    title: '应用偶尔闪退',
    description: '在编辑图片时偶尔会出现应用闪退的情况，特别是在添加多个贴纸后。',
    submitTime: '2024-01-10',
    resolveTime: '解决时间：2024-01-12'
  },
  {
    id: 2,
    type: 'feature',
    typeText: '功能建议',
    status: 'adopted',
    statusText: '已采纳',
    title: '增加批量导出功能',
    description: '希望能够支持批量选择多个作品进行导出，提高工作效率。',
    submitTime: '2024-01-08',
    resolveTime: '预计实现：2024-02'
  },
  {
    id: 3,
    type: 'ui',
    typeText: '界面优化',
    status: 'resolved',
    statusText: '已解决',
    title: '优化情绪选择器',
    description: '情绪选择器的颜色区分度不够，希望能够增加更多颜色选项。',
    submitTime: '2024-01-05',
    resolveTime: '解决时间：2024-01-08'
  }
])

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (!files) return
  
  if (files.length > 5) {
    alert('最多只能上传5个文件')
    target.value = ''
    return
  }
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (file.size > 10 * 1024 * 1024) {
      alert(`文件 ${file.name} 超过10MB限制`)
      target.value = ''
      return
    }
  }
  
  feedbackData.attachments = Array.from(files)
}

const previewFeedback = () => {
  if (!feedbackData.type || !feedbackData.title || !feedbackData.content) {
    alert('请先填写必填字段')
    return
  }
  
  const preview = `
反馈类型：${feedbackData.type}
优先级：${feedbackData.priority}
标题：${feedbackData.title}
内容：${feedbackData.content}
  `
  
  alert('预览内容：\n' + preview)
}

const submitFeedback = () => {
  if (!feedbackData.type || !feedbackData.title || !feedbackData.content) {
    alert('请填写必填字段')
    return
  }
  
  // 模拟提交
  alert('反馈提交成功！我们会认真处理你的建议。')
  
  // 重置表单
  feedbackData.type = ''
  feedbackData.title = ''
  feedbackData.content = ''
  feedbackData.priority = 'medium'
  feedbackData.contact = ''
  feedbackData.attachments = []
  
  // 重置文件输入
  const fileInput = document.getElementById('feedback-attachment') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

const viewHistoryItem = (item: any) => {
  alert(`查看反馈历史：${item.title}\n状态：${item.statusText}\n提交时间：${item.date}`)
}

const scrollToType = (typeId: string) => {
  const target = document.getElementById(typeId)
  if (target) {
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
    activeType.value = typeId
  }
}

const handleScroll = () => {
  const sections = document.querySelectorAll('.card[id]')
  let current = ''
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop
    if (window.pageYOffset >= sectionTop - 100) {
      current = section.getAttribute('id') || ''
    }
  })
  
  if (current && current !== activeType.value) {
    activeType.value = current
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
.feedback-page {
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

.feedback-history {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  padding: 12px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.history-item:hover {
  border-color: var(--pink-dark);
  background: rgba(143, 211, 200, 0.05);
}

.history-status {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 500;
  margin-bottom: 6px;
}

.history-status.success {
  background: rgba(76, 175, 80, 0.1);
  color: #388e3c;
}

.history-status.pending {
  background: rgba(255, 193, 7, 0.1);
  color: #f57c00;
}

.history-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--colorNeutralForeground1);
  margin-bottom: 4px;
}

.history-date {
  font-size: 10px;
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

.feedback-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: var(--colorNeutralForeground1);
  font-size: 14px;
}

.input {
  padding: 12px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--pink-dark);
}

select.input {
  background: white;
}

textarea.input {
  resize: vertical;
  min-height: 120px;
}

.priority-options {
  display: flex;
  gap: 16px;
}

.priority-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.priority-option input[type="radio"] {
  display: none;
}

.priority-label {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.priority-label.low {
  background: rgba(143, 211, 200, 0.2);
  color: var(--pink-dark);
  border: 1px solid rgba(143, 211, 200, 0.3);
}

.priority-label.medium {
  background: rgba(255, 193, 7, 0.2);
  color: #f57c00;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.priority-label.high {
  background: rgba(244, 67, 54, 0.2);
  color: #d32f2f;
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.priority-option input[type="radio"]:checked + .priority-label {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.attachment-upload {
  border: 2px dashed var(--colorNeutralStroke1);
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  transition: border-color 0.2s ease;
}

.attachment-upload:hover {
  border-color: var(--pink-dark);
}

.upload-hint {
  margin-top: 16px;
  color: var(--colorNeutralForeground3);
  font-size: 12px;
}

.upload-hint p {
  margin: 4px 0;
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
}

.feedback-guide {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.guide-section h3 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.guide-section p {
  margin: 0 0 12px;
  color: var(--colorNeutralForeground3);
}

.guide-section ul {
  margin: 0;
  padding-left: 20px;
  color: var(--colorNeutralForeground1);
}

.guide-section li {
  margin-bottom: 6px;
  line-height: 1.5;
}

.common-feedback {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feedback-item {
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 12px;
  padding: 20px;
  background: white;
}

.feedback-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.feedback-type {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.feedback-type.bug {
  background: rgba(244, 67, 54, 0.1);
  color: #d32f2f;
}

.feedback-type.feature {
  background: rgba(76, 175, 80, 0.1);
  color: #388e3c;
}

.feedback-type.ui {
  background: rgba(33, 150, 243, 0.1);
  color: #1976d2;
}

.feedback-status {
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 500;
}

.feedback-status.resolved {
  background: rgba(76, 175, 80, 0.1);
  color: #388e3c;
}

.feedback-status.adopted {
  background: rgba(255, 193, 7, 0.1);
  color: #f57c00;
}

.feedback-item h4 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.feedback-item p {
  margin: 0 0 16px;
  color: var(--colorNeutralForeground1);
  line-height: 1.6;
}

.feedback-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--colorNeutralForeground3);
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
  
  .priority-options {
    flex-direction: column;
    gap: 12px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .feedback-guide {
    grid-template-columns: 1fr;
  }
}
</style>