<template>
  <div class="todo-page">
    <div class="page-header">
      <h1>📝 我的待办</h1>
      <p class="page-subtitle">管理任务，记录心情，解锁成就</p>
    </div>

    <!-- Emotional Features Tabs -->
    <div class="features-tabs">
      <button
        v-for="tab in featureTabs"
        :key="tab.id"
        class="tab-btn"
        :class="{ 'active': activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- Tasks Tab -->
      <div v-if="activeTab === 'tasks'" class="tab-panel">
        <TodoStats />
        
        <div class="actions-bar">
          <div class="left-actions">
            <button class="btn primary" @click="showCreateModal = true">✨ 新建任务</button>
            <button class="btn secondary" @click="showFilters = !showFilters">
              🔍 {{ showFilters ? '隐藏筛选' : '显示筛选' }}
            </button>
            <button class="btn secondary" @click="clearAllFilters">清除筛选</button>
          </div>
          <div class="right-actions">
            <button class="btn secondary" @click="showImportExport = !showImportExport">
              📁 {{ showImportExport ? '隐藏数据管理' : '数据管理' }}
            </button>
            <button class="btn secondary" @click="selectAllVisible">
              {{ isAllSelected ? '取消全选' : '全选' }}
            </button>
            <button class="btn secondary" @click="cycleTheme">
              🎨 切换主题
            </button>
          </div>
        </div>

        <div v-if="showFilters" class="filter-section">
          <TodoFilter />
        </div>

        <div v-if="showImportExport" class="import-export-section">
          <TodoImportExport />
        </div>

        <TodoBulkActions />

        <div class="todos-section">
          <div class="section-header">
            <h3>任务列表</h3>
            <span class="task-count">{{ filteredTodos.length }} 个任务</span>
            <span v-if="hasActiveFilters" class="filter-indicator">🔍 已筛选</span>
          </div>
          
          <div v-if="filteredTodos.length === 0" class="empty-state">
            <div class="empty-icon">📝</div>
            <h3>{{ hasActiveFilters ? '没有找到匹配的任务' : '还没有任务' }}</h3>
            <p v-if="!hasActiveFilters">开始创建你的第一个任务吧！</p>
            <p v-else>尝试调整筛选条件或创建新任务</p>
            <button v-if="!hasActiveFilters" class="btn primary" @click="showCreateModal = true">
              创建第一个任务
            </button>
          </div>
          
          <div v-else class="todos-grid">
            <div 
              v-for="todo in filteredTodos" 
              :key="todo.id" 
              class="todo-card" 
              :class="getTodoCardClass(todo)"
            >
              <div class="card-header">
                <label class="checkbox-wrapper">
                  <input 
                    type="checkbox" 
                    :checked="isTodoSelected(todo.id)" 
                    @change="toggleTodoSelection(todo.id)" 
                    class="todo-checkbox"
                  />
                  <span class="checkmark"></span>
                </label>
                <div class="todo-meta">
                  <span class="category-badge" :class="getCategoryClass(todo.category)">
                    {{ todo.category }}
                  </span>
                  <span class="priority-badge" :class="getPriorityClass(todo.priority)">
                    {{ todo.priority }}
                  </span>
                  <span class="status-badge" :class="getStatusClass(todo.status)">
                    {{ todo.status }}
                  </span>
                </div>
                <div class="todo-actions">
                  <button class="btn-icon" @click="editTodo(todo)" title="编辑">✏️</button>
                  <button class="btn-icon" @click="deleteTodo(todo.id)" title="删除">🗑️</button>
                </div>
              </div>
              
              <div class="card-content">
                <h4 class="todo-title">{{ todo.title }}</h4>
                <p v-if="todo.description" class="todo-description">{{ todo.description }}</p>
              </div>
              
              <div v-if="todo.tags.length > 0" class="todo-tags">
                <span v-for="tag in todo.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
              
              <div class="card-footer">
                <div class="todo-dates">
                  <span v-if="todo.dueDate" class="due-date">
                    截止: {{ formatDate(todo.dueDate) }}
                  </span>
                  <span v-if="todo.completedAt" class="completed-date">
                    完成: {{ formatDate(todo.completedAt) }}
                  </span>
                </div>
                <div v-if="todo.mood" class="todo-mood">
                  {{ todo.mood }}
                </div>
              </div>
              
              <div v-if="todo.status !== '已完成'" class="complete-section">
                <button class="btn primary complete-btn" @click="completeTodo(todo.id)">
                  ✅ 完成任务
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Achievements Tab -->
      <div v-if="activeTab === 'achievements'" class="tab-panel">
        <TodoAchievements />
      </div>

      <!-- Mood Tracking Tab -->
      <div v-if="activeTab === 'mood'" class="tab-panel">
        <TodoMoodTracker />
      </div>

      <!-- Suggestions Tab -->
      <div v-if="activeTab === 'suggestions'" class="tab-panel">
        <TodoSuggestions />
      </div>

      <!-- Social Sharing Tab -->
                    <div v-if="activeTab === 'handbook'" class="tab-panel">
                <TodoHandbookGallery />
              </div>
              <div v-if="activeTab === 'social'" class="tab-panel">
                <TodoSocialShare />
              </div>
            </div>

    <!-- Create Task Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click="showCreateModal = false">
      <div class="modal-content" @click.stop>
        <TodoCreate @close="showCreateModal = false" @created="onTodoCreated"/>
      </div>
    </div>

    <!-- Celebration Modal -->
    <TodoCelebration />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTodoStore } from '@/stores/todo'
import type { TodoItem } from '@/types/todo'
import { TodoStatus } from '@/types/todo'
import TodoCreate from '@/components/todo/TodoCreate.vue'
import TodoFilter from '@/components/todo/TodoFilter.vue'
import TodoStats from '@/components/todo/TodoStats.vue'
import TodoBulkActions from '@/components/todo/TodoBulkActions.vue'
import TodoImportExport from '@/components/todo/TodoImportExport.vue'
import TodoAchievements from '@/components/todo/TodoAchievements.vue'
import TodoMoodTracker from '@/components/todo/TodoMoodTracker.vue'
import TodoSuggestions from '@/components/todo/TodoSuggestions.vue'
import TodoSocialShare from '@/components/todo/TodoSocialShare.vue'
import TodoCelebration from '@/components/todo/TodoCelebration.vue'
import TodoHandbookGallery from '@/components/todo/handbook/TodoHandbookGallery.vue'
import { useThemeStore } from '@/stores/theme'
import themesData from '@/data/themes.json'

const todoStore = useTodoStore()
const themeStore = useThemeStore()
const showCreateModal = ref(false)
const showFilters = ref(false)
const showImportExport = ref(false)
const activeTab = ref('tasks')

const featureTabs = [
  { id: 'tasks', label: '任务管理', icon: '📝' },
  { id: 'handbook', label: '手账创作', icon: '📖' },
  { id: 'achievements', label: '成就系统', icon: '🏆' },
  { id: 'mood', label: '心情追踪', icon: '😊' },
  { id: 'suggestions', label: '智能建议', icon: '💡' },
  { id: 'social', label: '社交分享', icon: '📤' }
]

const stats = computed(() => todoStore.stats)
const filteredTodos = computed(() => todoStore.filteredTodos)
const selectedTodos = computed(() => todoStore.selectedTodos)

const hasActiveFilters = computed(() => {
  const filters = todoStore.filters
  return filters.search || 
         filters.category || 
         filters.priority || 
         filters.status || 
         (filters.tags && filters.tags.length > 0) ||
         filters.dueDateRange
})

const isAllSelected = computed(() => {
  return selectedTodos.value.length > 0 && 
         selectedTodos.value.length === filteredTodos.value.length
})

const clearAllFilters = () => todoStore.clearFilters()

const selectAllVisible = () => {
  if (isAllSelected.value) {
    todoStore.clearSelection()
  } else {
    todoStore.selectAllTodos()
  }
}

const toggleTodoSelection = (id: string) => {
  todoStore.toggleTodoSelection(id)
}

const isTodoSelected = (id: string) => {
  return selectedTodos.value.includes(id)
}

const editTodo = (todo: TodoItem) => console.log('编辑任务:', todo) // TODO: Implement edit
const deleteTodo = (id: string) => {
  if (confirm('确定要删除这个任务吗？')) {
    todoStore.deleteTodo(id)
  }
}

const completeTodo = (id: string) => {
  // This will trigger the celebration modal
  todoStore.changeStatus(id, TodoStatus.COMPLETED)
}

const onTodoCreated = (todo: TodoItem) => {
  showCreateModal.value = false
  console.log('任务创建成功:', todo)
}

const getTodoCardClass = (todo: TodoItem) => {
  const classes = ['todo-card']
  if (todo.status === '已完成') classes.push('completed')
  if (todo.priority === '高') classes.push('high-priority')
  if (todo.dueDate && new Date(todo.dueDate) < new Date() && todo.status !== '已完成') {
    classes.push('overdue')
  }
  return classes.join(' ')
}

const getCategoryClass = (category: string) => {
  const categoryClasses: Record<string, string> = {
    '学习': 'category-study',
    '工作': 'category-work',
    '生活': 'category-life',
    '娱乐': 'category-entertainment'
  }
  return categoryClasses[category] || 'category-default'
}

const getPriorityClass = (priority: string) => {
  const priorityClasses: Record<string, string> = {
    '高': 'priority-high',
    '中': 'priority-medium',
    '低': 'priority-low'
  }
  return priorityClasses[priority] || 'priority-default'
}

const getStatusClass = (status: string) => {
  const statusClasses: Record<string, string> = {
    '待办': 'status-todo',
    '进行中': 'status-in-progress',
    '已完成': 'status-completed'
  }
  return statusClasses[status] || 'status-default'
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// 主题切换功能
const currentThemeIndex = ref(0)
const cycleTheme = () => {
  const themes = themesData.themes
  currentThemeIndex.value = (currentThemeIndex.value + 1) % themes.length
  const nextTheme = themes[currentThemeIndex.value]
  themeStore.switchTheme(nextTheme.id)
}
</script>

<style scoped>
.todo-page {
  padding: 20px;
  width: 100%;
  min-height: 100vh;
  padding-top: 104px;
  box-sizing: border-box;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-header h1 {
  margin: 0 0 8px 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
}

.page-subtitle {
  margin: 0;
  font-size: 1.1rem;
  color: #6b7280;
}

.features-tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  font-weight: 500;
}

.tab-btn:hover {
  border-color: #d1d5db;
  transform: translateY(-1px);
}

.tab-btn.active {
  border-color: var(--themePrimary);
  background: var(--themeSecondary);
  color: var(--themePrimary);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.tab-icon {
  font-size: 1.2rem;
}

.tab-content {
  min-height: 600px;
}

.tab-panel {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.left-actions,
.right-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.filter-section,
.import-export-section {
  margin-bottom: 24px;
}

.todos-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.section-header h3 {
  margin: 0;
  font-size: 1.4rem;
  color: #1f2937;
}

.task-count {
  background: #f3f4f6;
  color: #6b7280;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.filter-indicator {
  background: var(--themeSecondary);
  color: var(--themePrimary);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #6b7280;
  font-size: 1.3rem;
}

.empty-state p {
  margin: 0 0 20px 0;
  color: #9ca3af;
  font-size: 1rem;
}

.todos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.todo-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
}

.todo-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.todo-card.completed {
  border-color: #10b981;
  background: #f0fdf4;
}

.todo-card.high-priority {
  border-left: 4px solid #ef4444;
}

.todo-card.overdue {
  border-color: #f59e0b;
  background: #fffbeb;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.checkbox-wrapper {
  position: relative;
  cursor: pointer;
}

.todo-checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.todo-checkbox:checked + .checkmark {
  background: var(--themePrimary);
  border-color: var(--themePrimary);
}

.todo-checkbox:checked + .checkmark::after {
  content: '✓';
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.todo-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.category-badge,
.priority-badge,
.status-badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
}

.category-study { background: var(--themeSecondary); color: var(--themePrimary); }
.category-work { background: #fef3c7; color: #d97706; }
.category-life { background: #dcfce7; color: #16a34a; }
.category-entertainment { background: #f3e8ff; color: #7c3aed; }
.category-default { background: #f3f4f6; color: #6b7280; }

.priority-high { background: #fee2e2; color: #dc2626; }
.priority-medium { background: var(--themeSecondary); color: var(--themePrimary); }
.priority-low { background: #dcfce7; color: #16a34a; }
.priority-default { background: #f3f4f6; color: #6b7280; }

.status-todo { background: #f3f4f6; color: #6b7280; }
.status-in-progress { background: var(--themeSecondary); color: var(--themePrimary); }
.status-completed { background: #dcfce7; color: #16a34a; }
.status-default { background: #f3f4f6; color: #6b7280; }

.todo-actions {
  margin-left: auto;
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

.card-content {
  margin-bottom: 16px;
}

.todo-title {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  color: #1f2937;
  font-weight: 600;
}

.todo-description {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.4;
}

.todo-tags {
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

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 0.8rem;
}

.todo-dates {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.due-date {
  color: #6b7280;
}

.completed-date {
  color: #10b981;
}

.todo-mood {
  font-size: 1.2rem;
}

.complete-section {
  text-align: center;
}

.complete-btn {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  font-weight: 600;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  font-weight: 500;
}

.btn.primary {
  background: linear-gradient(135deg, var(--themePrimary) 0%, var(--themePrimaryPressed) 100%);
  color: white;
}

.btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, var(--themePrimaryHover) 0%, var(--themePrimary) 100%);
}

.btn.secondary {
  background: #f3f4f6;
  color: #374151;
  border: 2px solid #e5e7eb;
}

.btn.secondary:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .todo-page {
    padding: 16px;
    padding-top: 88px;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .features-tabs {
    gap: 4px;
  }

  .tab-btn {
    padding: 8px 12px;
    font-size: 0.8rem;
  }

  .tab-icon {
    font-size: 1rem;
  }

  .actions-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .left-actions,
  .right-actions {
    justify-content: center;
  }

  .todos-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .todo-card {
    padding: 16px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .todo-actions {
    margin-left: 0;
    align-self: flex-end;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
