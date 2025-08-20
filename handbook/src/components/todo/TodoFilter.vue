<template>
  <div class="todo-filter">
    <div class="filter-header">
      <h4>🔍 筛选任务</h4>
      <button class="clear-btn" @click="clearAllFilters">清除所有</button>
    </div>

    <!-- 搜索框 -->
    <div class="filter-group">
      <label>搜索</label>
      <input
        v-model="localFilters.search"
        type="text"
        placeholder="搜索任务标题、描述或标签..."
        class="search-input"
        @input="updateFilters"
      />
    </div>

    <!-- 分类筛选 -->
    <div class="filter-group">
      <label>分类</label>
      <div class="filter-options">
        <label class="filter-option">
          <input
            type="radio"
            :value="undefined"
            :checked="!localFilters.category"
            @change="updateCategory(undefined)"
          />
          <span>全部</span>
        </label>
        <label
          v-for="category in Object.values(TodoCategory)"
          :key="category"
          class="filter-option"
        >
          <input
            type="radio"
            :value="category"
            :checked="localFilters.category === category"
            @change="updateCategory(category)"
          />
          <span>{{ category }}</span>
        </label>
      </div>
    </div>

    <!-- 优先级筛选 -->
    <div class="filter-group">
      <label>优先级</label>
      <div class="filter-options">
        <label class="filter-option">
          <input
            type="radio"
            :value="undefined"
            :checked="!localFilters.priority"
            @change="updatePriority(undefined)"
          />
          <span>全部</span>
        </label>
        <label
          v-for="priority in Object.values(TodoPriority)"
          :key="priority"
          class="filter-option"
        >
          <input
            type="radio"
            :value="priority"
            :checked="localFilters.priority === priority"
            @change="updatePriority(priority)"
          />
          <span>{{ priority }}</span>
        </label>
      </div>
    </div>

    <!-- 状态筛选 -->
    <div class="filter-group">
      <label>状态</label>
      <div class="filter-options">
        <label class="filter-option">
          <input
            type="radio"
            :value="undefined"
            :checked="!localFilters.status"
            @change="updateStatus(undefined)"
          />
          <span>全部</span>
        </label>
        <label
          v-for="status in Object.values(TodoStatus)"
          :key="status"
          class="filter-option"
        >
          <input
            type="radio"
            :value="status"
            :checked="localFilters.status === status"
            @change="updateStatus(status)"
          />
          <span>{{ status }}</span>
        </label>
      </div>
    </div>

    <!-- 标签筛选 -->
    <div class="filter-group">
      <label>标签</label>
      <div class="tag-filter">
        <div class="selected-tags">
          <span
            v-for="tag in localFilters.tags"
            :key="tag"
            class="selected-tag"
          >
            {{ tag }}
            <button @click="removeTag(tag)" class="remove-tag">×</button>
          </span>
        </div>
        <div class="tag-options">
          <button
            v-for="tag in availableTags"
            :key="tag"
            :class="['tag-option', { active: localFilters.tags?.includes(tag) }]"
            @click="toggleTag(tag)"
          >
            {{ tag }}
          </button>
        </div>
      </div>
    </div>

    <!-- 日期范围筛选 -->
    <div class="filter-group">
      <label>截止日期</label>
      <div class="date-filter">
        <div class="date-inputs">
          <input
            v-model="dateRange.start"
            type="date"
            placeholder="开始日期"
            class="date-input"
            @change="updateDateRange"
          />
          <span class="date-separator">至</span>
          <input
            v-model="dateRange.end"
            type="date"
            placeholder="结束日期"
            class="date-input"
            @change="updateDateRange"
          />
        </div>
        <div class="quick-dates">
          <button @click="setQuickDate('today')" class="quick-btn">今天</button>
          <button @click="setQuickDate('week')" class="quick-btn">本周</button>
          <button @click="setQuickDate('month')" class="quick-btn">本月</button>
          <button @click="clearDateRange" class="quick-btn">清除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useTodoStore } from '@/stores/todo'
import type { TodoFilters } from '@/types/todo'
import { TodoCategory, TodoPriority, TodoStatus } from '@/types/todo'

const todoStore = useTodoStore()

const localFilters = ref<TodoFilters>({
  search: '',
  category: undefined,
  priority: undefined,
  status: undefined,
  tags: [],
  dueDateRange: undefined
})

const dateRange = ref({
  start: '',
  end: ''
})

// 可用的标签
const availableTags = computed(() => todoStore.allTags)

// 监听本地筛选器变化，同步到store
watch(localFilters, (newFilters) => {
  todoStore.setFilters(newFilters)
}, { deep: true })

// 更新分类
const updateCategory = (category: TodoCategory | undefined) => {
  localFilters.value.category = category
}

// 更新优先级
const updatePriority = (priority: TodoPriority | undefined) => {
  localFilters.value.priority = priority
}

// 更新状态
const updateStatus = (status: TodoStatus | undefined) => {
  localFilters.value.status = status
}

// 切换标签
const toggleTag = (tag: string) => {
  if (!localFilters.value.tags) {
    localFilters.value.tags = []
  }
  
  const index = localFilters.value.tags.indexOf(tag)
  if (index === -1) {
    localFilters.value.tags.push(tag)
  } else {
    localFilters.value.tags.splice(index, 1)
  }
}

// 移除标签
const removeTag = (tag: string) => {
  if (localFilters.value.tags) {
    const index = localFilters.value.tags.indexOf(tag)
    if (index !== -1) {
      localFilters.value.tags.splice(index, 1)
    }
  }
}

// 更新日期范围
const updateDateRange = () => {
  localFilters.value.dueDateRange = {
    start: dateRange.value.start ? new Date(dateRange.value.start) : undefined,
    end: dateRange.value.end ? new Date(dateRange.value.end) : undefined
  }
}

// 快速设置日期
const setQuickDate = (type: 'today' | 'week' | 'month') => {
  const today = new Date()
  
  switch (type) {
    case 'today':
      dateRange.value.start = today.toISOString().split('T')[0]
      dateRange.value.end = today.toISOString().split('T')[0]
      break
    case 'week':
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - today.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      
      dateRange.value.start = weekStart.toISOString().split('T')[0]
      dateRange.value.end = weekEnd.toISOString().split('T')[0]
      break
    case 'month':
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      
      dateRange.value.start = monthStart.toISOString().split('T')[0]
      dateRange.value.end = monthEnd.toISOString().split('T')[0]
      break
  }
  
  updateDateRange()
}

// 清除日期范围
const clearDateRange = () => {
  dateRange.value.start = ''
  dateRange.value.end = ''
  localFilters.value.dueDateRange = undefined
}

// 清除所有筛选器
const clearAllFilters = () => {
  localFilters.value = {
    search: '',
    category: undefined,
    priority: undefined,
    status: undefined,
    tags: [],
    dueDateRange: undefined
  }
  dateRange.value = { start: '', end: '' }
  todoStore.clearFilters()
}

// 更新筛选器
const updateFilters = () => {
  // 通过watch自动同步到store
}
</script>

<style scoped>
.todo-filter {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.filter-header h4 {
  margin: 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.clear-btn {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.clear-btn:hover {
  background: #ff5252;
}

.filter-group {
  margin-bottom: 20px;
}

.filter-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
  font-size: 14px;
}

.search-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.filter-option:hover {
  background: #e9ecef;
}

.filter-option input[type="radio"] {
  margin: 0;
  cursor: pointer;
}

.tag-filter {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.selected-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: #667eea;
  color: white;
  border-radius: 20px;
  font-size: 12px;
}

.remove-tag {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.remove-tag:hover {
  background: rgba(255, 255, 255, 0.2);
}

.tag-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-option {
  padding: 6px 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.tag-option:hover {
  background: #e9ecef;
}

.tag-option.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.date-filter {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.date-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-input {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.date-separator {
  color: #666;
  font-size: 14px;
}

.quick-dates {
  display: flex;
  gap: 8px;
}

.quick-btn {
  padding: 6px 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.quick-btn:hover {
  background: #e9ecef;
}

@media (max-width: 768px) {
  .todo-filter {
    padding: 16px;
  }
  
  .filter-options {
    gap: 6px;
  }
  
  .filter-option {
    padding: 6px 10px;
    font-size: 13px;
  }
  
  .date-inputs {
    flex-direction: column;
    gap: 8px;
  }
  
  .quick-dates {
    flex-wrap: wrap;
  }
}
</style>
