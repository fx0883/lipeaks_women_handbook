<template>
  <div class="mood-page">
    <div class="mood-container">
      <div class="mood-form">
        <h1>今日心情如何？</h1>
        <p class="subtitle">记录一下今天的心情，生成专属情绪卡片</p>
        
        <!-- 情绪选择 -->
        <div class="mood-selection">
          <h3>选择情绪</h3>
          <div class="mood-buttons">
            <button 
              v-for="mood in moods" 
              :key="mood.id"
              class="mood-btn"
              :class="{ active: selectedMood === mood.id }"
              @click="selectMood(mood.id)"
            >
              <span class="mood-emoji">{{ mood.emoji }}</span>
              <span class="mood-name">{{ mood.name }}</span>
            </button>
          </div>
        </div>
        
        <!-- 情绪强度 -->
        <div class="mood-intensity">
          <h3>情绪强度</h3>
          <div class="intensity-slider">
            <input 
              type="range" 
              min="1" 
              max="10" 
              v-model="moodIntensity"
              class="slider"
            />
            <div class="intensity-labels">
              <span>轻微</span>
              <span>强烈</span>
            </div>
            <div class="intensity-value">{{ moodIntensity }}</div>
          </div>
        </div>
        
        <!-- 一句话描述 -->
        <div class="mood-description">
          <h3>一句话描述</h3>
          <textarea 
            v-model="moodDescription"
            placeholder="用一句话描述今天的心情..."
            class="description-input"
            rows="3"
          ></textarea>
        </div>
        
        <!-- 标签选择 -->
        <div class="mood-tags">
          <h3>添加标签</h3>
          <div class="tag-buttons">
            <button 
              v-for="tag in availableTags" 
              :key="tag"
              class="tag-btn"
              :class="{ active: selectedTags.includes(tag) }"
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>
        
        <!-- 提交按钮 -->
        <button 
          class="submit-btn"
          :disabled="!selectedMood"
          @click="submitMood"
        >
          生成情绪卡片
        </button>
      </div>
      
      <!-- 预览卡片 -->
      <div class="mood-preview">
        <h3>预览卡片</h3>
        <div class="mood-card" :class="`mood-${selectedMood}`">
          <div class="card-header">
            <div class="mood-emoji-large">{{ getCurrentMoodEmoji() }}</div>
            <div class="mood-info">
              <h4>{{ getCurrentMoodName() }}</h4>
              <p class="mood-date">{{ currentDate }}</p>
            </div>
          </div>
          
          <div class="card-content">
            <p class="mood-text">{{ moodDescription || '今天的心情...' }}</p>
            <div class="mood-intensity-display">
              <span class="intensity-label">强度:</span>
              <div class="intensity-bars">
                <div 
                  v-for="i in 10" 
                  :key="i"
                  class="intensity-bar"
                  :class="{ active: i <= moodIntensity }"
                ></div>
              </div>
            </div>
          </div>
          
          <div class="card-footer">
            <div class="mood-tags-display">
              <span 
                v-for="tag in selectedTags" 
                :key="tag"
                class="tag-display"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { MoodId } from '@/types/mood'

const router = useRouter()

// 情绪数据
const moods = [
  { id: 'happy', name: '开心', emoji: '😀' },
  { id: 'neutral', name: '一般', emoji: '😐' },
  { id: 'calm', name: '平静', emoji: '🙂' },
  { id: 'low', name: '低落', emoji: '🙁' },
  { id: 'sad', name: '难过', emoji: '😢' }
]

// 可用标签
const availableTags = [
  '学习', '工作', '生活', '朋友', '家人', '美食', '旅行', '运动', '音乐', '电影'
]

// 表单状态
const selectedMood = ref<MoodId>('happy')
const moodIntensity = ref(5)
const moodDescription = ref('')
const selectedTags = ref<string[]>([])

// 当前日期
const currentDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// 选择情绪
const selectMood = (moodId: MoodId): void => {
  selectedMood.value = moodId
}

// 切换标签
const toggleTag = (tag: string): void => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

// 获取当前情绪 emoji
const getCurrentMoodEmoji = (): string => {
  const mood = moods.find(m => m.id === selectedMood.value)
  return mood?.emoji || '😀'
}

// 获取当前情绪名称
const getCurrentMoodName = (): string => {
  const mood = moods.find(m => m.id === selectedMood.value)
  return mood?.name || '开心'
}

// 提交情绪
const submitMood = (): void => {
  // TODO: 保存到 store 并跳转到情绪日历
  console.log('提交情绪:', {
    mood: selectedMood.value,
    intensity: moodIntensity.value,
    description: moodDescription.value,
    tags: selectedTags.value,
    date: new Date().toISOString()
  })
  
  // 跳转到情绪日历
  router.push('/mood-calendar')
}
</script>

<style scoped>
/* 复用原型样式 */
.mood-page {
  width: 100%;
  padding: 24px 32px;
}

.mood-container {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
  align-items: start;
}

.mood-form {
  background: var(--colorNeutralBackground1);
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 20px;
  padding: 32px;
  box-shadow: var(--shadow4);
}

.mood-form h1 {
  margin: 0 0 12px;
  font-size: 32px;
  font-weight: 700;
  color: var(--colorNeutralForeground1);
  text-align: center;
}

.mood-form .subtitle {
  margin: 0 0 32px;
  color: var(--colorNeutralForeground2);
  font-size: 16px;
  text-align: center;
}

.mood-form h3 {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.mood-selection {
  margin-bottom: 32px;
}

.mood-buttons {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.mood-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  border: 2px solid var(--colorNeutralStroke1);
  background: var(--colorNeutralBackground1);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mood-btn:hover {
  border-color: var(--pink-medium);
  transform: translateY(-2px);
  box-shadow: var(--shadow4);
}

.mood-btn.active {
  border-color: var(--colorBrandBackground);
  background: var(--pink-light);
}

.mood-emoji {
  font-size: 24px;
}

.mood-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--colorNeutralForeground1);
}

.mood-intensity {
  margin-bottom: 32px;
}

.intensity-slider {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--colorNeutralStroke1);
  outline: none;
  accent-color: var(--colorBrandBackground);
}

.intensity-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--colorNeutralForeground2);
}

.intensity-value {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: var(--colorBrandBackground);
}

.mood-description {
  margin-bottom: 32px;
}

.description-input {
  width: 100%;
  padding: 16px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 12px;
  background: var(--colorNeutralBackground1);
  color: var(--colorNeutralForeground1);
  font-size: 14px;
  resize: vertical;
  font-family: inherit;
}

.description-input:focus {
  outline: none;
  border-color: var(--colorBrandBackground);
}

.mood-tags {
  margin-bottom: 32px;
}

.tag-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-btn {
  padding: 8px 16px;
  border: 1px solid var(--colorNeutralStroke1);
  background: var(--colorNeutralBackground1);
  color: var(--colorNeutralForeground1);
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-btn:hover {
  border-color: var(--colorBrandBackground);
  background: var(--pink-light);
}

.tag-btn.active {
  background: var(--colorBrandBackground);
  color: var(--colorBrandForeground);
  border-color: var(--colorBrandBackground);
}

.submit-btn {
  width: 100%;
  padding: 16px;
  background: var(--colorBrandBackground);
  color: var(--colorBrandForeground);
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  background: var(--colorBrandBackgroundHover);
  transform: translateY(-1px);
  box-shadow: var(--shadow4);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 预览卡片 */
.mood-preview {
  background: var(--colorNeutralBackground1);
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 20px;
  padding: 24px;
  box-shadow: var(--shadow4);
  position: sticky;
  top: 88px;
}

.mood-preview h3 {
  margin: 0 0 20px;
  font-size: 18px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
  text-align: center;
}

.mood-card {
  background: var(--colorNeutralBackground1);
  border: 2px solid var(--colorNeutralStroke1);
  border-radius: 20px;
  padding: 24px;
  text-align: center;
  transition: all 0.2s ease;
}

.mood-card.mood-happy { border-color: var(--themePrimary); background: linear-gradient(135deg, var(--themePrimary), var(--themePrimaryHover)); color: white; }
.mood-card.mood-neutral { border-color: var(--themeAccent); background: linear-gradient(135deg, var(--themeAccent), var(--themePrimary)); color: white; }
.mood-card.mood-calm { border-color: var(--themeSecondary); background: linear-gradient(135deg, var(--themeSecondary), var(--themeAccent)); color: var(--colorNeutralForeground1); }
.mood-card.mood-low { border-color: var(--themePrimaryPressed); background: linear-gradient(135deg, var(--themePrimaryPressed), var(--themePrimary)); color: white; }
.mood-card.mood-sad { border-color: var(--themePrimaryHover); background: linear-gradient(135deg, var(--themePrimaryHover), var(--themePrimary)); color: white; }

.card-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
.mood-emoji-large { font-size: 48px; }
.mood-info h4 { margin: 0 0 4px; font-size: 20px; font-weight: 600; }
.mood-date { margin: 0; font-size: 14px; opacity: 0.8; }

.card-content { margin-bottom: 20px; }
.mood-text { margin: 0 0 16px; font-size: 16px; line-height: 1.5; min-height: 48px; }
.mood-intensity-display { display: flex; align-items: center; gap: 12px; justify-content: center; }
.intensity-label { font-size: 14px; font-weight: 500; }
.intensity-bars { display: flex; gap: 2px; }
.intensity-bar { width: 8px; height: 20px; background: rgba(255, 255, 255, 0.3); border-radius: 2px; transition: all 0.2s ease; }
.intensity-bar.active { background: rgba(255, 255, 255, 0.8); }

.card-footer { border-top: 1px solid rgba(255, 255, 255, 0.2); padding-top: 16px; }
.mood-tags-display { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.tag-display { background: rgba(255, 255, 255, 0.2); color: inherit; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; }

/* 响应式设计 */
@media (max-width: 1024px) {
  .mood-container { grid-template-columns: 1fr; }
  .mood-preview { position: static; }
}

@media (max-width: 768px) {
  .mood-page { padding: 16px; }
  .mood-buttons { grid-template-columns: repeat(3, 1fr); }
  .mood-form { padding: 24px; }
}

@media (max-width: 480px) {
  .mood-buttons { grid-template-columns: repeat(2, 1fr); }
}
</style>
