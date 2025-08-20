<template>
  <div class="suggestions-section">
    <div class="section-header">
      <h3>💡 个性化建议</h3>
      <span class="suggestions-count">{{ personalizedSuggestions.length }} 条建议</span>
    </div>

    <div class="suggestions-grid">
      <div 
        v-for="suggestion in personalizedSuggestions" 
        :key="suggestion.id"
        class="suggestion-card"
      >
        <div class="suggestion-header">
          <div class="suggestion-icon">💡</div>
          <div class="suggestion-meta">
            <div class="suggestion-category">{{ suggestion.category }}</div>
            <div class="suggestion-priority">{{ suggestion.priority }}</div>
          </div>
          <div class="confidence-badge" :class="getConfidenceClass(suggestion.confidence)">
            {{ Math.round(suggestion.confidence * 100) }}%
          </div>
        </div>

        <div class="suggestion-content">
          <h4 class="suggestion-title">{{ suggestion.title }}</h4>
          <p class="suggestion-description">{{ suggestion.description }}</p>
          
          <div class="suggestion-reason">
            <span class="reason-label">推荐理由：</span>
            <span class="reason-text">{{ suggestion.reason }}</span>
          </div>

          <div v-if="suggestion.tags.length > 0" class="suggestion-tags">
            <span 
              v-for="tag in suggestion.tags" 
              :key="tag"
              class="tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <div class="suggestion-actions">
          <button 
            class="btn primary"
            @click="createFromSuggestion(suggestion)"
          >
            ✨ 创建任务
          </button>
          <button 
            class="btn secondary"
            @click="dismissSuggestion(suggestion.id)"
          >
            🙈 忽略
          </button>
        </div>
      </div>
    </div>

    <div v-if="personalizedSuggestions.length === 0" class="no-suggestions">
      <div class="no-suggestions-icon">🎯</div>
      <h4>暂无个性化建议</h4>
      <p>继续完成任务，系统会为你生成更多个性化建议！</p>
    </div>

    <!-- AI Insights -->
    <div class="ai-insights">
      <h4>🤖 AI 洞察</h4>
      <div class="insights-content">
        <div class="insight-item">
          <div class="insight-icon">📊</div>
          <div class="insight-text">
            <strong>完成模式分析：</strong>
            你通常在上午完成高优先级任务，建议将重要任务安排在9-11点。
          </div>
        </div>
        <div class="insight-item">
          <div class="insight-icon">🎯</div>
          <div class="insight-text">
            <strong>目标一致性：</strong>
            你的学习类任务完成率很高，可以尝试增加更多学习目标。
          </div>
        </div>
        <div class="insight-item">
          <div class="insight-icon">⚡</div>
          <div class="insight-text">
            <strong>效率提升建议：</strong>
            尝试将相似任务批量处理，可以提高整体效率。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTodoStore } from '@/stores/todo'
import type { TaskSuggestion } from '@/types/todo'

const todoStore = useTodoStore()

const personalizedSuggestions = computed(() => todoStore.personalizedSuggestions)

const getConfidenceClass = (confidence: number) => {
  if (confidence >= 0.8) return 'high'
  if (confidence >= 0.6) return 'medium'
  return 'low'
}

const createFromSuggestion = (suggestion: TaskSuggestion) => {
  // Create a new todo from the suggestion
  const newTodo = todoStore.addTodo({
    title: suggestion.title,
    description: suggestion.description,
    category: suggestion.category,
    priority: suggestion.priority,
    tags: suggestion.tags
  })
  
  console.log('从建议创建任务:', newTodo)
  // You could emit an event here to notify the parent component
}

const dismissSuggestion = (suggestionId: string) => {
  console.log('忽略建议:', suggestionId)
  // You could implement logic to hide or remove dismissed suggestions
}
</script>

<style scoped>
.suggestions-section {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
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

.suggestions-count {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.suggestions-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

.suggestion-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border-left: 4px solid #22c55e;
}

.suggestion-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.suggestion-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.suggestion-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border-radius: 50%;
}

.suggestion-meta {
  flex: 1;
  display: flex;
  gap: 12px;
}

.suggestion-category,
.suggestion-priority {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
}

.suggestion-category {
  background: #dbeafe;
  color: #1d4ed8;
}

.suggestion-priority {
  background: #fef3c7;
  color: #d97706;
}

.confidence-badge {
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
}

.confidence-badge.high {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
}

.confidence-badge.medium {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.confidence-badge.low {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.suggestion-content {
  margin-bottom: 20px;
}

.suggestion-title {
  margin: 0 0 8px 0;
  color: #1f2937;
  font-size: 1.1rem;
  font-weight: 600;
}

.suggestion-description {
  margin: 0 0 16px 0;
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.5;
}

.suggestion-reason {
  margin-bottom: 16px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 3px solid #22c55e;
}

.reason-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.reason-text {
  color: #6b7280;
  font-size: 0.9rem;
  margin-left: 8px;
}

.suggestion-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.tag {
  padding: 4px 8px;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
}

.suggestion-actions {
  display: flex;
  gap: 12px;
}

.suggestion-actions .btn {
  flex: 1;
  padding: 10px 16px;
  font-size: 0.9rem;
}

.no-suggestions {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
}

.no-suggestions-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.no-suggestions h4 {
  margin: 0 0 8px 0;
  color: #6b7280;
  font-size: 1.1rem;
}

.no-suggestions p {
  margin: 0;
  color: #9ca3af;
  font-size: 0.9rem;
}

.ai-insights {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.ai-insights h4 {
  margin: 0 0 16px 0;
  color: #374151;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.insights-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.insight-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 3px solid #22c55e;
}

.insight-icon {
  font-size: 1.2rem;
  min-width: 24px;
}

.insight-text {
  color: #374151;
  font-size: 0.9rem;
  line-height: 1.5;
}

.insight-text strong {
  color: #1f2937;
}

@media (max-width: 768px) {
  .suggestions-section {
    padding: 16px;
    margin: 16px 0;
  }

  .suggestion-card {
    padding: 16px;
  }

  .suggestion-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .suggestion-meta {
    width: 100%;
    justify-content: space-between;
  }

  .suggestion-actions {
    flex-direction: column;
  }

  .ai-insights {
    padding: 16px;
  }

  .insight-item {
    padding: 12px;
  }
}
</style>
