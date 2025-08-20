<template>
  <div class="mood-tracker-section">
    <div class="section-header">
      <h3>😊 心情追踪</h3>
      <span class="mood-count">{{ recentMoodRecords.length }} 次记录</span>
    </div>

    <!-- Mood Input for Current Task -->
    <div v-if="currentTask" class="mood-input-section">
      <h4>为当前任务记录心情</h4>
      <div class="mood-input">
        <div class="mood-options">
          <button
            v-for="mood in availableMoods"
            :key="mood"
            class="mood-option"
            :class="{ 'selected': selectedMood === mood }"
            @click="selectedMood = mood"
          >
            <span class="mood-emoji">{{ mood }}</span>
            <span class="mood-label">{{ getMoodLabel(mood) }}</span>
          </button>
        </div>
        <div class="mood-note">
          <textarea
            v-model="moodNote"
            placeholder="记录一下完成这个任务的心情感受..."
            rows="3"
            class="note-input"
          ></textarea>
        </div>
        <button 
          class="btn primary save-mood-btn"
          @click="saveMood"
          :disabled="!selectedMood"
        >
          💾 保存心情
        </button>
      </div>
    </div>

    <!-- Recent Mood Records -->
    <div class="recent-moods">
      <h4>最近的心情记录</h4>
      <div class="mood-records">
        <div 
          v-for="record in recentMoodRecords" 
          :key="record.id"
          class="mood-record"
        >
          <div class="mood-emoji-large">{{ record.mood }}</div>
          <div class="mood-details">
            <div class="mood-task">
              {{ getTaskTitle(record.todoId) }}
            </div>
            <div v-if="record.note" class="mood-note-text">
              {{ record.note }}
            </div>
            <div class="mood-time">
              {{ formatDate(record.timestamp) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mood Statistics -->
    <div class="mood-stats">
      <h4>心情统计</h4>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">{{ getMostFrequentMood() }}</div>
          <div class="stat-label">最常见心情</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ moodRecords.length }}</div>
          <div class="stat-label">总记录数</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ getAverageMoodScore() }}</div>
          <div class="stat-label">平均心情分</div>
        </div>
      </div>
    </div>

    <!-- Mood Trend Chart -->
    <div class="mood-trend">
      <h4>心情变化趋势</h4>
      <div class="trend-chart">
        <div class="chart-placeholder">
          <div class="chart-icon">📊</div>
          <p>心情变化趋势图表</p>
          <small>这里可以集成 Chart.js 或 ECharts 来显示心情变化趋势</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTodoStore } from '@/stores/todo'
import type { MoodType, MoodRecord } from '@/types/todo'
import { MoodType as MoodTypeEnum } from '@/types/todo'

const todoStore = useTodoStore()

const selectedMood = ref<MoodType | null>(null)
const moodNote = ref('')

const currentTask = computed(() => {
  // This would typically come from a selected task or current context
  return null
})

const recentMoodRecords = computed(() => todoStore.recentMoodRecords)
const moodRecords = computed(() => todoStore.moodRecords)

const availableMoods = [
  MoodTypeEnum.VERY_HAPPY,
  MoodTypeEnum.HAPPY,
  MoodTypeEnum.EXCITED,
  MoodTypeEnum.CALM,
  MoodTypeEnum.NEUTRAL,
  MoodTypeEnum.TIRED,
  MoodTypeEnum.STRESSED,
  MoodTypeEnum.SAD,
  MoodTypeEnum.ANGRY
]

const getMoodLabel = (mood: MoodType) => {
  const labels: Record<MoodType, string> = {
    [MoodTypeEnum.VERY_HAPPY]: '非常开心',
    [MoodTypeEnum.HAPPY]: '开心',
    [MoodTypeEnum.EXCITED]: '兴奋',
    [MoodTypeEnum.CALM]: '平静',
    [MoodTypeEnum.NEUTRAL]: '一般',
    [MoodTypeEnum.TIRED]: '疲惫',
    [MoodTypeEnum.STRESSED]: '压力大',
    [MoodTypeEnum.SAD]: '难过',
    [MoodTypeEnum.ANGRY]: '生气'
  }
  return labels[mood]
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

const saveMood = () => {
  if (selectedMood.value && currentTask.value) {
    // This would typically save the mood for the current task
    console.log('保存心情:', selectedMood.value, moodNote.value)
    selectedMood.value = null
    moodNote.value = ''
  }
}

const getMostFrequentMood = () => {
  if (moodRecords.value.length === 0) return '😐'
  
  const moodCounts: Record<MoodType, number> = {} as Record<MoodType, number>
  moodRecords.value.forEach(record => {
    moodCounts[record.mood] = (moodCounts[record.mood] || 0) + 1
  })
  
  let mostFrequent: MoodType = MoodTypeEnum.NEUTRAL
  let maxCount = 0
  
  Object.entries(moodCounts).forEach(([mood, count]) => {
    if (count > maxCount) {
      maxCount = count
      mostFrequent = mood as MoodType
    }
  })
  
  return mostFrequent
}

const getAverageMoodScore = () => {
  if (moodRecords.value.length === 0) return '0'
  
  const moodScores: Record<MoodType, number> = {
    [MoodTypeEnum.VERY_HAPPY]: 5,
    [MoodTypeEnum.HAPPY]: 4,
    [MoodTypeEnum.EXCITED]: 4,
    [MoodTypeEnum.CALM]: 3,
    [MoodTypeEnum.NEUTRAL]: 3,
    [MoodTypeEnum.TIRED]: 2,
    [MoodTypeEnum.STRESSED]: 2,
    [MoodTypeEnum.SAD]: 1,
    [MoodTypeEnum.ANGRY]: 1
  }
  
  const totalScore = moodRecords.value.reduce((sum, record) => {
    return sum + moodScores[record.mood]
  }, 0)
  
  return (totalScore / moodRecords.value.length).toFixed(1)
}
</script>

<style scoped>
.mood-tracker-section {
  background: linear-gradient(135deg, #fef7ff 0%, #f3e8ff 100%);
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

.mood-count {
  background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.mood-input-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.mood-input-section h4 {
  margin: 0 0 16px 0;
  color: #374151;
  font-size: 1.1rem;
}

.mood-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.mood-option {
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

.mood-option:hover {
  border-color: #a855f7;
  transform: translateY(-2px);
}

.mood-option.selected {
  border-color: #a855f7;
  background: #f3e8ff;
  box-shadow: 0 4px 15px rgba(168, 85, 247, 0.2);
}

.mood-emoji {
  font-size: 1.5rem;
}

.mood-label {
  font-size: 0.8rem;
  color: #6b7280;
  text-align: center;
  line-height: 1.2;
}

.mood-note {
  margin-bottom: 20px;
}

.note-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.9rem;
  resize: vertical;
  transition: border-color 0.2s ease;
}

.note-input:focus {
  outline: none;
  border-color: #a855f7;
}

.save-mood-btn {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
}

.recent-moods {
  margin-bottom: 24px;
}

.recent-moods h4 {
  margin: 0 0 16px 0;
  color: #374151;
  font-size: 1.1rem;
}

.mood-records {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mood-record {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.mood-emoji-large {
  font-size: 2rem;
  min-width: 48px;
}

.mood-details {
  flex: 1;
}

.mood-task {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.mood-note-text {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 8px;
  line-height: 1.4;
}

.mood-time {
  font-size: 0.8rem;
  color: #9ca3af;
}

.mood-stats {
  margin-bottom: 24px;
}

.mood-stats h4 {
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
  color: #a855f7;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.9rem;
  color: #6b7280;
}

.mood-trend h4 {
  margin: 0 0 16px 0;
  color: #374151;
  font-size: 1.1rem;
}

.trend-chart {
  background: white;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.chart-placeholder {
  color: #9ca3af;
}

.chart-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.chart-placeholder p {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  color: #6b7280;
}

.chart-placeholder small {
  font-size: 0.9rem;
  color: #9ca3af;
}

@media (max-width: 768px) {
  .mood-tracker-section {
    padding: 16px;
    margin: 16px 0;
  }

  .mood-options {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .mood-option {
    padding: 12px 8px;
  }

  .mood-emoji {
    font-size: 1.2rem;
  }

  .mood-label {
    font-size: 0.7rem;
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

  .trend-chart {
    padding: 24px;
  }
}
</style>
