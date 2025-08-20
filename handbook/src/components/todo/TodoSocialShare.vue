<template>
  <div class="social-share-section">
    <div class="section-header">
      <h3>📤 社交分享</h3>
      <span class="share-count">{{ socialShares.length }} 次分享</span>
    </div>

    <!-- Share Current Task -->
    <div v-if="selectedTodo" class="share-current-task">
      <h4>分享当前任务</h4>
      <div class="task-preview">
        <div class="task-info">
          <h5>{{ selectedTodo.title }}</h5>
          <p>{{ selectedTodo.description }}</p>
          <div class="task-meta">
            <span class="category">{{ selectedTodo.category }}</span>
            <span class="priority">{{ selectedTodo.priority }}</span>
            <span class="status">{{ selectedTodo.status }}</span>
          </div>
        </div>
      </div>

      <div class="share-options">
        <div class="share-text">
          <textarea
            v-model="shareText"
            placeholder="写点什么来分享这个任务..."
            rows="3"
            class="share-textarea"
          ></textarea>
        </div>

        <div class="platform-buttons">
          <button
            v-for="platform in platforms"
            :key="platform.value"
            class="platform-btn"
            :class="platform.value"
            @click="shareToPlatform(platform.value)"
          >
            <span class="platform-icon">{{ platform.icon }}</span>
            <span class="platform-name">{{ platform.name }}</span>
          </button>
        </div>

        <div class="share-actions">
          <button 
            class="btn primary"
            @click="shareTask"
            :disabled="!shareText.trim()"
          >
            🚀 立即分享
          </button>
          <button 
            class="btn secondary"
            @click="clearShare"
          >
            🗑️ 清空
          </button>
        </div>
      </div>
    </div>

    <!-- Share History -->
    <div class="share-history">
      <h4>分享历史</h4>
      <div v-if="socialShares.length > 0" class="shares-list">
        <div 
          v-for="share in socialShares" 
          :key="share.id"
          class="share-item"
        >
          <div class="share-platform">
            <span class="platform-icon-small">{{ getPlatformIcon(share.platform) }}</span>
            <span class="platform-name-small">{{ getPlatformName(share.platform) }}</span>
          </div>
          <div class="share-content">
            <div class="share-text-preview">{{ share.shareText }}</div>
            <div class="share-task">{{ getTaskTitle(share.todoId) }}</div>
            <div class="share-time">{{ formatDate(share.sharedAt) }}</div>
          </div>
          <div class="share-actions-small">
            <button 
              class="btn-icon"
              @click="reshare(share)"
              title="重新分享"
            >
              🔄
            </button>
            <button 
              class="btn-icon"
              @click="deleteShare(share.id)"
              title="删除分享"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
      <div v-else class="no-shares">
        <div class="no-shares-icon">📤</div>
        <p>还没有分享过任务，开始分享你的成就吧！</p>
      </div>
    </div>

    <!-- Share Statistics -->
    <div class="share-stats">
      <h4>分享统计</h4>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">{{ socialShares.length }}</div>
          <div class="stat-label">总分享数</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ getMostSharedPlatform() }}</div>
          <div class="stat-label">最爱平台</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ getMostSharedCategory() }}</div>
          <div class="stat-label">最爱分享类型</div>
        </div>
      </div>
    </div>

    <!-- Share Tips -->
    <div class="share-tips">
      <h4>💡 分享小贴士</h4>
      <div class="tips-content">
        <div class="tip-item">
          <span class="tip-icon">🌟</span>
          <span class="tip-text">分享完成的任务可以激励他人，也能记录自己的成长轨迹</span>
        </div>
        <div class="tip-item">
          <span class="tip-icon">🎯</span>
          <span class="tip-text">为分享内容添加个人感悟，让分享更有意义</span>
        </div>
        <div class="tip-item">
          <span class="tip-icon">🤝</span>
          <span class="tip-text">通过分享与朋友互动，获得更多支持和鼓励</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTodoStore } from '@/stores/todo'
import type { TodoItem, SocialShare } from '@/types/todo'

const todoStore = useTodoStore()

const selectedTodo = ref<TodoItem | null>(null)
const shareText = ref('')

const socialShares = computed(() => todoStore.socialShares)

const platforms = [
  { value: 'wechat', name: '微信', icon: '💬' },
  { value: 'weibo', name: '微博', icon: '📱' },
  { value: 'qq', name: 'QQ', icon: '🐧' },
  { value: 'douyin', name: '抖音', icon: '🎵' }
]

const getPlatformIcon = (platform: string) => {
  const platformData = platforms.find(p => p.value === platform)
  return platformData ? platformData.icon : '📱'
}

const getPlatformName = (platform: string) => {
  const platformData = platforms.find(p => p.value === platform)
  return platformData ? platformData.name : '未知'
}

const getTaskTitle = (todoId: string) => {
  const todo = todoStore.getTodoById(todoId)
  return todo ? todo.title : '未知任务'
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const shareToPlatform = (platform: string) => {
  console.log('选择分享平台:', platform)
  // This would typically open the platform's share dialog
}

const shareTask = () => {
  if (selectedTodo.value && shareText.value.trim()) {
    // This would typically share to the selected platform
    console.log('分享任务:', selectedTodo.value.title, shareText.value)
    
    // For demo purposes, we'll just log the share
    // In a real app, this would integrate with social media APIs
  }
}

const clearShare = () => {
  shareText.value = ''
}

const reshare = (share: SocialShare) => {
  const todo = todoStore.getTodoById(share.todoId)
  if (todo) {
    selectedTodo.value = todo
    shareText.value = share.shareText
  }
}

const deleteShare = (shareId: string) => {
  console.log('删除分享:', shareId)
  // This would typically remove the share from the list
}

const getMostSharedPlatform = () => {
  if (socialShares.value.length === 0) return '无'
  
  const platformCounts: Record<string, number> = {}
  socialShares.value.forEach(share => {
    platformCounts[share.platform] = (platformCounts[share.platform] || 0) + 1
  })
  
  let mostShared = 'wechat'
  let maxCount = 0
  
  Object.entries(platformCounts).forEach(([platform, count]) => {
    if (count > maxCount) {
      maxCount = count
      mostShared = platform
    }
  })
  
  return getPlatformName(mostShared)
}

const getMostSharedCategory = () => {
  if (socialShares.value.length === 0) return '无'
  
  const categoryCounts: Record<string, number> = {}
  socialShares.value.forEach(share => {
    const todo = todoStore.getTodoById(share.todoId)
    if (todo) {
      categoryCounts[todo.category] = (categoryCounts[todo.category] || 0) + 1
    }
  })
  
  let mostShared = '学习'
  let maxCount = 0
  
  Object.entries(categoryCounts).forEach(([category, count]) => {
    if (count > maxCount) {
      maxCount = count
      mostShared = category
    }
  })
  
  return mostShared
}
</script>

<style scoped>
.social-share-section {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 16px;
  padding: 24px;
  margin: 20px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.4rem;
  font-weight: 600;
}

.share-count {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.share-current-task {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.share-current-task h4 {
  margin: 0 0 16px 0;
  color: #374151;
  font-size: 1.1rem;
}

.task-preview {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.task-info h5 {
  margin: 0 0 8px 0;
  color: #1f2937;
  font-size: 1rem;
}

.task-info p {
  margin: 0 0 12px 0;
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.4;
}

.task-meta {
  display: flex;
  gap: 8px;
}

.task-meta span {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
}

.category {
  background: #dbeafe;
  color: #1d4ed8;
}

.priority {
  background: #fef3c7;
  color: #d97706;
}

.status {
  background: #dcfce7;
  color: #16a34a;
}

.share-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.share-textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.9rem;
  resize: vertical;
  transition: border-color 0.2s ease;
}

.share-textarea:focus {
  outline: none;
  border-color: #f59e0b;
}

.platform-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.platform-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.platform-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.platform-btn.wechat {
  border-color: #10b981;
}

.platform-btn.weibo {
  border-color: #f59e0b;
}

.platform-btn.qq {
  border-color: #3b82f6;
}

.platform-btn.douyin {
  border-color: #8b5cf6;
}

.platform-icon {
  font-size: 1.5rem;
}

.platform-name {
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 500;
}

.share-actions {
  display: flex;
  gap: 12px;
}

.share-actions .btn {
  flex: 1;
  padding: 12px;
  font-size: 1rem;
}

.share-history {
  margin-bottom: 24px;
}

.share-history h4 {
  margin: 0 0 16px 0;
  color: #374151;
  font-size: 1.1rem;
}

.shares-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.share-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.share-platform {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 60px;
}

.platform-icon-small {
  font-size: 1.2rem;
}

.platform-name-small {
  font-size: 0.7rem;
  color: #6b7280;
  text-align: center;
}

.share-content {
  flex: 1;
  min-width: 0;
}

.share-text-preview {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 8px;
  line-height: 1.4;
}

.share-task {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.share-time {
  font-size: 0.8rem;
  color: #9ca3af;
}

.share-actions-small {
  display: flex;
  gap: 8px;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: #f3f4f6;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.btn-icon:hover {
  background: #e5e7eb;
  transform: scale(1.1);
}

.no-shares {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
}

.no-shares-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.no-shares p {
  margin: 0;
  color: #9ca3af;
  font-size: 0.9rem;
}

.share-stats {
  margin-bottom: 24px;
}

.share-stats h4 {
  margin: 0 0 16px 0;
  color: #374151;
  font-size: 1.1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #f59e0b;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.9rem;
  color: #6b7280;
}

.share-tips {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.share-tips h4 {
  margin: 0 0 16px 0;
  color: #374151;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tips-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.tip-icon {
  font-size: 1.1rem;
  min-width: 24px;
}

.tip-text {
  color: #374151;
  font-size: 0.9rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .social-share-section {
    padding: 16px;
    margin: 16px 0;
  }

  .platform-buttons {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .platform-btn {
    padding: 12px 8px;
  }

  .share-actions {
    flex-direction: column;
  }

  .share-item {
    flex-direction: column;
    gap: 12px;
  }

  .share-platform {
    flex-direction: row;
    min-width: auto;
  }

  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .stat-item {
    padding: 16px;
  }

  .stat-value {
    font-size: 1.5rem;
  }
}
</style>
