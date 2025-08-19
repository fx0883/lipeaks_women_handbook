<template>
  <div class="mood-calendar-page">
    <div class="page-header">
      <h1>情绪日历</h1>
      <p>记录每一天的心情变化，发现情绪规律</p>
    </div>

    <div class="calendar-container">
      <!-- 日历主体 -->
      <div class="calendar-main">
        <div class="calendar-header">
          <button class="nav-btn" @click="previousMonth">
            ‹
          </button>
          <h2>{{ currentMonthYear }}</h2>
          <button class="nav-btn" @click="nextMonth">
            ›
          </button>
        </div>

        <div class="calendar-grid">
          <!-- 星期标题 -->
          <div class="weekday-header">
            <div v-for="day in weekdays" :key="day" class="weekday">
              {{ day }}
            </div>
          </div>

          <!-- 日期网格 -->
          <div class="date-grid">
            <div 
              v-for="date in calendarDates" 
              :key="date.key"
              class="date-cell"
              :class="{
                'other-month': !date.isCurrentMonth,
                'has-mood': date.moodRecord,
                'today': date.isToday
              }"
            >
              <span class="date-number">{{ date.day }}</span>
              <div v-if="date.moodRecord" class="mood-indicator" :class="`mood-${date.moodRecord.mood}`">
                {{ getMoodEmoji(date.moodRecord.mood) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 侧边栏统计 -->
      <div class="calendar-sidebar">
        <!-- 本月情绪统计 -->
        <div class="stats-card">
          <h3>本月情绪统计</h3>
          <div class="mood-stats">
            <div 
              v-for="mood in moodStats" 
              :key="mood.id"
              class="mood-stat"
            >
              <div class="mood-stat-header">
                <span class="mood-emoji">{{ mood.emoji }}</span>
                <span class="mood-name">{{ mood.name }}</span>
                <span class="mood-count">{{ mood.count }}天</span>
              </div>
              <div class="mood-bar">
                <div 
                  class="mood-bar-fill" 
                  :class="`mood-${mood.id}`"
                  :style="{ width: `${mood.percentage}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 本周趋势 -->
        <div class="stats-card">
          <h3>本周趋势</h3>
          <div class="weekly-trend">
            <div 
              v-for="(day, index) in weeklyTrend" 
              :key="index"
              class="trend-day"
            >
              <span class="trend-date">{{ day.date }}</span>
              <div v-if="day.mood" class="trend-mood" :class="`mood-${day.mood}`">
                {{ getMoodEmoji(day.mood) }}
              </div>
              <div v-else class="trend-empty">-</div>
            </div>
          </div>
        </div>

        <!-- 快速操作 -->
        <div class="stats-card">
          <h3>快速操作</h3>
          <div class="quick-actions">
            <router-link to="/mood" class="action-btn primary">
              📝 记录今日心情
            </router-link>
            <button class="action-btn" @click="exportMoodData">
              📊 导出数据
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { MoodId, MoodRecord } from '@/types/mood'

const router = useRouter()

// 星期标题
const weekdays = ['日', '一', '二', '三', '四', '五', '六']

// 情绪数据
const moods = [
  { id: 'happy', name: '开心', emoji: '😀' },
  { id: 'neutral', name: '一般', emoji: '😐' },
  { id: 'calm', name: '平静', emoji: '🙂' },
  { id: 'low', name: '低落', emoji: '🙁' },
  { id: 'sad', name: '难过', emoji: '😢' }
]

// 当前日期
const currentDate = ref(new Date())
const currentMonth = ref(currentDate.value.getMonth())
const currentYear = ref(currentDate.value.getFullYear())

// 模拟情绪记录数据（后续从 store 获取）
const moodRecords: MoodRecord[] = [
  {
    id: '1',
    date: '2024-01-15',
    mood: 'happy',
    intensity: 8,
    description: '今天很开心！',
    tags: ['学习', '朋友'],
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    date: '2024-01-16',
    mood: 'calm',
    intensity: 6,
    description: '平静的一天',
    tags: ['生活'],
    createdAt: '2024-01-16T10:00:00Z'
  },
  {
    id: '3',
    date: '2024-01-17',
    mood: 'neutral',
    intensity: 5,
    description: '一般般',
    tags: ['工作'],
    createdAt: '2024-01-17T10:00:00Z'
  }
]

// 当前月份年份显示
const currentMonthYear = computed(() => {
  return `${currentYear.value}年${currentMonth.value + 1}月`
})

// 生成日历日期
const calendarDates = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  
  // 获取当月第一天和最后一天
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  // 获取当月第一天是星期几
  const firstDayWeekday = firstDay.getDay()
  
  // 获取上个月最后几天
  const prevMonthLastDay = new Date(year, month, 0)
  const prevMonthDays = []
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    const day = prevMonthLastDay.getDate() - i
    prevMonthDays.push({
      day,
      isCurrentMonth: false,
      isToday: false,
      moodRecord: null,
      key: `prev-${day}`
    })
  }
  
  // 获取当月所有日期
  const currentMonthDays = []
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const isToday = dateStr === new Date().toISOString().split('T')[0]
    const moodRecord = moodRecords.find(record => record.date === dateStr)
    
    currentMonthDays.push({
      day,
      isCurrentMonth: true,
      isToday,
      moodRecord,
      key: `current-${day}`
    })
  }
  
  // 获取下个月前几天
  const nextMonthDays = []
  const totalCells = 42 // 6行7列
  const remainingCells = totalCells - prevMonthDays.length - currentMonthDays.length
  
  for (let day = 1; day <= remainingCells; day++) {
    nextMonthDays.push({
      day,
      isCurrentMonth: false,
      isToday: false,
      moodRecord: null,
      key: `next-${day}`
    })
  }
  
  return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]
})

// 本月情绪统计
const moodStats = computed(() => {
  const stats = moods.map(mood => {
    const count = moodRecords.filter(record => 
      record.mood === mood.id && 
      new Date(record.date).getMonth() === currentMonth.value &&
      new Date(record.date).getFullYear() === currentYear.value
    ).length
    
    const totalDays = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
    const percentage = totalDays > 0 ? (count / totalDays) * 100 : 0
    
    return {
      ...mood,
      count,
      percentage: Math.round(percentage)
    }
  })
  
  return stats.filter(stat => stat.count > 0)
})

// 本周趋势
const weeklyTrend = computed(() => {
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())
  
  const weekDays = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + i)
    
    const dateStr = date.toISOString().split('T')[0]
    const moodRecord = moodRecords.find(record => record.date === dateStr)
    
    weekDays.push({
      date: ['日', '一', '二', '三', '四', '五', '六'][i],
      mood: moodRecord?.mood || null
    })
  }
  
  return weekDays
})

// 获取情绪 emoji
const getMoodEmoji = (moodId: MoodId): string => {
  const mood = moods.find(m => m.id === moodId)
  return mood?.emoji || '😀'
}

// 上个月
const previousMonth = (): void => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

// 下个月
const nextMonth = (): void => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

// 导出情绪数据
const exportMoodData = (): void => {
  // TODO: 实现数据导出功能
  console.log('导出情绪数据')
}

onMounted(() => {
  // 初始化当前月份
  currentMonth.value = currentDate.value.getMonth()
  currentYear.value = currentDate.value.getFullYear()
})
</script>

<style scoped>
/* 复用原型样式 */
.mood-calendar-page {
  width: 100%;
  padding: 24px 32px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-header h1 {
  margin: 0 0 12px;
  font-size: 32px;
  font-weight: 700;
  color: var(--colorNeutralForeground1);
}

.page-header p {
  margin: 0;
  color: var(--colorNeutralForeground2);
  font-size: 16px;
}

.calendar-container {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 32px;
  align-items: start;
}

.calendar-main {
  background: var(--colorNeutralBackground1);
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 20px;
  padding: 24px;
  box-shadow: var(--shadow4);
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.calendar-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.nav-btn {
  width: 40px;
  height: 40px;
  border: 1px solid var(--colorNeutralStroke1);
  background: var(--colorNeutralBackground1);
  color: var(--colorNeutralForeground1);
  border-radius: 8px;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  border-color: var(--colorBrandBackground);
  color: var(--colorBrandBackground);
}

.calendar-grid {
  display: flex;
  flex-direction: column;
}

.weekday-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 16px;
}

.weekday {
  text-align: center;
  font-weight: 600;
  color: var(--colorNeutralForeground2);
  font-size: 14px;
  padding: 8px;
}

.date-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.date-cell {
  aspect-ratio: 1;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--colorNeutralBackground1);
}

.date-cell:hover {
  border-color: var(--colorBrandBackground);
  background: var(--pink-light);
}

.date-cell.other-month {
  opacity: 0.3;
  background: var(--colorNeutralBackground2);
}

.date-cell.today {
  border-color: var(--colorBrandBackground);
  background: var(--pink-light);
}

.date-cell.has-mood {
  border-color: var(--colorBrandBackground);
}

.date-number {
  font-size: 14px;
  font-weight: 500;
  color: var(--colorNeutralForeground1);
}

.mood-indicator {
  position: absolute;
  bottom: 4px;
  font-size: 12px;
}

.mood-indicator.mood-happy {
  color: var(--themePrimary);
}

.mood-indicator.mood-neutral {
  color: var(--themeAccent);
}

.mood-indicator.mood-calm {
  color: var(--themeSecondary);
}

.mood-indicator.mood-low {
  color: var(--themePrimaryPressed);
}

.mood-indicator.mood-sad {
  color: var(--themePrimaryHover);
}

/* 侧边栏 */
.calendar-sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stats-card {
  background: var(--colorNeutralBackground1);
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 20px;
  padding: 24px;
  box-shadow: var(--shadow4);
}

.stats-card h3 {
  margin: 0 0 20px;
  font-size: 18px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.mood-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mood-stat {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mood-stat-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mood-emoji {
  font-size: 16px;
}

.mood-name {
  flex: 1;
  font-size: 14px;
  color: var(--colorNeutralForeground1);
}

.mood-count {
  font-size: 12px;
  color: var(--colorNeutralForeground2);
  font-weight: 500;
}

.mood-bar {
  height: 8px;
  background: var(--colorNeutralStroke1);
  border-radius: 4px;
  overflow: hidden;
}

.mood-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.mood-bar-fill.mood-happy {
  background: var(--themePrimary);
}

.mood-bar-fill.mood-neutral {
  background: var(--themeAccent);
}

.mood-bar-fill.mood-calm {
  background: var(--themeSecondary);
}

.mood-bar-fill.mood-low {
  background: var(--themePrimaryPressed);
}

.mood-bar-fill.mood-sad {
  background: var(--themePrimaryHover);
}

.weekly-trend {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trend-day {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid var(--colorNeutralStroke1);
}

.trend-day:last-child {
  border-bottom: none;
}

.trend-date {
  width: 20px;
  font-size: 14px;
  color: var(--colorNeutralForeground2);
  font-weight: 500;
}

.trend-mood {
  font-size: 16px;
}

.trend-empty {
  color: var(--colorNeutralForeground3);
  font-size: 14px;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  padding: 12px 16px;
  border: 1px solid var(--colorNeutralStroke1);
  background: var(--colorNeutralBackground1);
  color: var(--colorNeutralForeground1);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
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

/* 响应式设计 */
@media (max-width: 1024px) {
  .calendar-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .mood-calendar-page {
    padding: 16px;
  }
  
  .calendar-main {
    padding: 16px;
  }
  
  .date-grid {
    gap: 2px;
  }
  
  .date-cell {
    border-radius: 4px;
  }
  
  .date-number {
    font-size: 12px;
  }
  
  .mood-indicator {
    font-size: 10px;
  }
}
</style>
