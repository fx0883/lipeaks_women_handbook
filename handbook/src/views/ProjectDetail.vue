<template>
  <div class="project-detail-page">
    <div class="project-container">
      <!-- 项目信息 -->
      <div class="project-info">
        <div class="project-header">
          <button class="back-btn" @click="goBack">
            ← 返回
          </button>
          <div class="project-actions">
            <button class="action-btn" @click="editProject">
              ✏️ 编辑
            </button>
            <button class="action-btn primary" @click="exportProject">
              📤 导出
            </button>
          </div>
        </div>
        
        <div class="project-meta">
          <h1>{{ project?.name || '项目详情' }}</h1>
          <p class="project-description">{{ project?.description }}</p>
          
          <div class="project-details">
            <div class="detail-item">
              <span class="label">创建时间:</span>
              <span class="value">{{ formatDate(project?.createdAt) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">更新时间:</span>
              <span class="value">{{ formatDate(project?.updatedAt) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">模板:</span>
              <span class="value">{{ getTemplateName(project?.templateId) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">比例:</span>
              <span class="value">{{ project?.content.ratio || '4:5' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">状态:</span>
              <span class="value">
                {{ project?.isPublic ? '公开' : '私有' }}
              </span>
            </div>
          </div>
          
          <div class="project-tags">
            <span 
              v-for="tag in project?.tags" 
              :key="tag"
              class="tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
      
      <!-- 项目预览 -->
      <div class="project-preview">
        <div class="preview-image">
          <img 
            :src="project?.thumbnail" 
            :alt="project?.name"
            @error="handleImageError"
          />
        </div>
        
        <div class="preview-info">
          <h3>内容信息</h3>
          <div class="content-details">
            <div class="content-item">
              <span class="label">标题:</span>
              <span class="value">{{ project?.content.title }}</span>
            </div>
            <div class="content-item">
              <span class="label">副标题:</span>
              <span class="value">{{ project?.content.subtitle }}</span>
            </div>
            <div class="content-item">
              <span class="label">文字内容:</span>
              <span class="value">{{ project?.content.text }}</span>
            </div>
            <div class="content-item">
              <span class="label">情绪:</span>
              <span class="value mood" :class="`mood-${project?.content.mood}`">
                {{ getMoodName(project?.content.mood) }}
              </span>
            </div>
          </div>
          
          <div class="color-palette">
            <h4>配色方案</h4>
            <div class="colors">
              <div 
                class="color-item"
                :style="{ backgroundColor: project?.content.colors.primary }"
                :title="`主色: ${project?.content.colors.primary}`"
              ></div>
              <div 
                class="color-item"
                :style="{ backgroundColor: project?.content.colors.secondary }"
                :title="`辅色: ${project?.content.colors.secondary}`"
              ></div>
              <div 
                class="color-item"
                :style="{ backgroundColor: project?.content.colors.text }"
                :title="`文字色: ${project?.content.colors.text}`"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Project } from '@/types/project'
import type { MoodId } from '@/types/mood'

const route = useRoute()
const router = useRouter()

const projectId = route.params.id as string
const project = ref<Project | null>(null)

// 模拟项目数据（后续从 store 获取）
const mockProject: Project = {
  id: '1',
  name: '校园日常拼贴',
  description: '记录校园生活的美好瞬间，包含课堂、食堂、图书馆等场景的温馨回忆',
  templateId: 'campus-collage',
  thumbnail: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=600&q=80',
  content: {
    title: '我的校园生活',
    subtitle: '青春记忆',
    images: ['campus1.jpg', 'campus2.jpg'],
    stickers: ['heart.png', 'star.png'],
    filters: ['vintage'],
    text: '在这个美丽的校园里，每一天都充满了新的发现和快乐。从早晨的第一缕阳光到夜晚的星空，都是我青春记忆中最珍贵的片段。',
    mood: 'happy',
    colors: {
      primary: '#ff6b9d',
      secondary: '#ffeef4',
      text: '#333333'
    },
    ratio: '4:5'
  },
  tags: ['校园', '日常', '拼贴', '青春', '回忆'],
  isPublic: true,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z'
}

// 情绪映射
const moodMap: Record<MoodId, string> = {
  happy: '开心',
  neutral: '一般',
  calm: '平静',
  low: '低落',
  sad: '难过'
}

// 模板名称映射
const templateMap: Record<string, string> = {
  'campus-collage': '校园日常拼贴',
  'club-poster': '社团招新海报',
  'citywalk': 'Citywalk/旅行',
  'dorm-food': '宿舍日常/美食',
  'exam-countdown': '考试倒计时',
  'homework-board': '作业清单',
  'library-log': '图书馆打卡',
  'anniversary': '纪念日',
  'commute-desk': '通勤桌面',
  'ootd': 'OOTD穿搭',
  'weekly-review': '周总结',
  'soft-complain': '温柔吐槽'
}

// 格式化日期
const formatDate = (dateString?: string): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取情绪名称（兼容字符串）
const getMoodName = (moodId?: MoodId | string): string => {
  if (!moodId) return '-'
  return moodMap[moodId as MoodId] || String(moodId)
}

// 获取模板名称
const getTemplateName = (templateId?: string): string => {
  if (!templateId) return '-'
  return templateMap[templateId] || templateId
}

// 返回上一页
const goBack = (): void => {
  router.back()
}

// 编辑项目
const editProject = (): void => {
  if (project.value) {
    router.push(`/editor/${project.value.templateId}`)
  }
}

// 导出项目
const exportProject = (): void => {
  router.push(`/export?project=${projectId}`)
}

// 处理图片加载错误
const handleImageError = (event: Event): void => {
  const img = event.target as HTMLImageElement
  img.src = 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=600&q=80'
}

onMounted(() => {
  // 模拟加载项目数据
  project.value = mockProject
})
</script>

<style scoped>
.project-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  min-height: 100vh;
  padding-top: 104px;
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: 24px;
  box-sizing: border-box;
}

.project-container {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
  align-items: start;
}

.project-info {
  background: var(--colorNeutralBackground1);
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 20px;
  padding: 24px;
  box-shadow: var(--shadow4);
}

.project-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.back-btn {
  padding: 8px 16px;
  border: 1px solid var(--colorNeutralStroke1);
  background: var(--colorNeutralBackground1);
  color: var(--colorNeutralForeground1);
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  border-color: var(--colorBrandBackground);
  background: var(--pink-light);
}

.project-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  padding: 8px 16px;
  border: 1px solid var(--colorNeutralStroke1);
  background: var(--colorNeutralBackground1);
  color: var(--colorNeutralForeground1);
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  border-color: var(--colorBrandBackground);
  background: var(--pink-light);
}

.action-btn.primary {
  background: var(--colorBrandBackground);
  color: var(--colorBrandForeground);
  border-color: var(--colorBrandBackground);
}

.action-btn.primary:hover {
  background: var(--colorBrandBackgroundHover);
}

.project-meta h1 {
  margin: 0 0 12px;
  font-size: 28px;
  font-weight: 700;
  color: var(--colorNeutralForeground1);
}

.project-description {
  margin: 0 0 24px;
  color: var(--colorNeutralForeground2);
  font-size: 16px;
  line-height: 1.6;
}

.project-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.detail-item,
.content-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.label {
  font-weight: 500;
  color: var(--colorNeutralForeground2);
  min-width: 80px;
}

.value {
  color: var(--colorNeutralForeground1);
}

.value.mood {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.value.mood.mood-happy {
  background: var(--themePrimary);
  color: white;
}

.value.mood.mood-neutral {
  background: var(--themeAccent);
  color: white;
}

.value.mood.mood-calm {
  background: var(--themeSecondary);
  color: var(--colorNeutralForeground1);
}

.value.mood.mood-low {
  background: var(--themePrimaryPressed);
  color: white;
}

.value.mood.mood-sad {
  background: var(--themePrimaryHover);
  color: white;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: var(--pink-light);
  color: var(--pink-dark);
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
}

.project-preview {
  background: var(--colorNeutralBackground1);
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 20px;
  padding: 24px;
  box-shadow: var(--shadow4);
  position: sticky;
  top: 88px;
}

.preview-image {
  margin-bottom: 24px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow8);
}

.preview-image img {
  width: 100%;
  height: auto;
  display: block;
}

.preview-info h3 {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.content-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.color-palette h4 {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 500;
  color: var(--colorNeutralForeground1);
}

.colors {
  display: flex;
  gap: 8px;
}

.color-item {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--colorNeutralStroke1);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.color-item:hover {
  transform: scale(1.1);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .project-container {
    grid-template-columns: 1fr;
  }
  
  .project-preview {
    position: static;
  }
}

@media (max-width: 768px) {
  .project-detail-page {
    padding: 16px;
  }
  
  .project-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .project-actions {
    justify-content: center;
  }
  
  .detail-item,
  .content-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .label {
    min-width: auto;
  }
}
</style>
