<template>
  <div class="todo-stats">
    <div class="stats-header">
      <h3>📊 任务统计</h3>
      <div class="stats-summary">
        <span class="total-count">{{ stats.total }}</span>
        <span class="total-label">总任务</span>
      </div>
    </div>

    <div class="stats-grid">
      <!-- 完成率 -->
      <div class="stat-card completion-rate">
        <div class="stat-icon">🎯</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.completionRate }}%</div>
          <div class="stat-label">完成率</div>
        </div>
        <div class="stat-progress">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${stats.completionRate}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- 状态分布 -->
      <div class="stat-card status-distribution">
        <div class="stat-icon">📋</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.pending }}</div>
          <div class="stat-label">待办</div>
        </div>
        <div class="stat-secondary">
          <span class="secondary-item">
            <span class="dot in-progress"></span>
            {{ stats.inProgress }} 进行中
          </span>
          <span class="secondary-item">
            <span class="dot completed"></span>
            {{ stats.completed }} 已完成
          </span>
        </div>
      </div>

      <!-- 优先级分布 -->
      <div class="stat-card priority-distribution">
        <div class="stat-icon">⚡</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.highPriority }}</div>
          <div class="stat-label">高优先级</div>
        </div>
        <div class="stat-secondary">
          <span class="secondary-item">
            <span class="dot medium"></span>
            {{ stats.mediumPriority }} 中
          </span>
          <span class="secondary-item">
            <span class="dot low"></span>
            {{ stats.lowPriority }} 低
          </span>
        </div>
      </div>

      <!-- 时间相关 -->
      <div class="stat-card time-related">
        <div class="stat-icon">⏰</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.overdue }}</div>
          <div class="stat-label">已逾期</div>
        </div>
        <div class="stat-secondary">
          <span class="secondary-item">
            <span class="dot today"></span>
            {{ stats.dueToday }} 今天到期
          </span>
          <span class="secondary-item">
            <span class="dot week"></span>
            {{ stats.dueThisWeek }} 本周到期
          </span>
        </div>
      </div>
    </div>

    <!-- 分类统计 -->
    <div class="category-stats">
      <h4>📂 分类统计</h4>
      <div class="category-grid">
        <div
          v-for="(count, category) in stats.categoryStats"
          :key="category"
          class="category-item"
        >
          <div class="category-name">{{ category }}</div>
          <div class="category-count">{{ count }}</div>
          <div class="category-bar">
            <div 
              class="category-fill" 
              :style="{ width: `${(count / stats.total) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 标签统计 -->
    <div class="tag-stats">
      <h4>🏷️ 热门标签</h4>
      <div class="tag-cloud">
        <span
          v-for="(count, tag) in topTags"
          :key="tag"
          class="tag-item"
          :style="{ fontSize: `${Math.max(12, Math.min(20, 12 + count * 2))}px` }"
        >
          {{ tag }} ({{ count }})
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTodoStore } from '@/stores/todo'
import type { TodoStats } from '@/types/todo'

const todoStore = useTodoStore()
const stats = computed(() => todoStore.stats)

// 获取前10个热门标签
const topTags = computed(() => {
  const tagEntries = Object.entries(stats.value.tagStats)
  return tagEntries
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .reduce((acc, [tag, count]) => {
      acc[tag] = count
      return acc
    }, {} as Record<string, number>)
})
</script>

<style scoped>
.todo-stats {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.stats-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.stats-summary {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.total-count {
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
}

.total-label {
  font-size: 12px;
  color: #666;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 8px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}

.stat-secondary {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 11px;
  color: #666;
}

.secondary-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dot.in-progress {
  background: #ffa726;
}

.dot.completed {
  background: #66bb6a;
}

.dot.medium {
  background: #ffb74d;
}

.dot.low {
  background: #aed581;
}

.dot.today {
  background: #42a5f5;
}

.dot.week {
  background: #ab47bc;
}

.stat-progress {
  width: 60px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.category-stats,
.tag-stats {
  margin-top: 24px;
}

.category-stats h4,
.tag-stats h4 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.category-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
}

.category-name {
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.category-count {
  font-size: 18px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 8px;
}

.category-bar {
  width: 100%;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  overflow: hidden;
}

.category-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tag-item {
  padding: 6px 12px;
  background: #f0f2f5;
  border-radius: 16px;
  color: #555;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
}

.tag-item:hover {
  background: #667eea;
  color: white;
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .todo-stats {
    padding: 16px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .stat-card {
    padding: 12px;
  }
  
  .category-grid {
    grid-template-columns: 1fr;
  }
  
  .tag-cloud {
    gap: 8px;
  }
  
  .tag-item {
    padding: 4px 10px;
    font-size: 12px !important;
  }
}
</style>
