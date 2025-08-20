<template>
  <div v-if="selectedCount > 0" class="todo-bulk-actions">
    <div class="bulk-header">
      <span class="selected-info">
        🎯 已选择 <strong>{{ selectedCount }}</strong> 个任务
      </span>
      <button class="clear-selection" @click="clearSelection">清除选择</button>
    </div>

    <div class="bulk-actions">
      <!-- 批量状态更改 -->
      <div class="action-group">
        <label>批量更改状态:</label>
        <div class="action-buttons">
          <button
            v-for="status in Object.values(TodoStatus)"
            :key="status"
            class="action-btn status-btn"
            :class="getStatusClass(status)"
            @click="bulkChangeStatus(status)"
          >
            {{ status }}
          </button>
        </div>
      </div>

      <!-- 批量优先级更改 -->
      <div class="action-group">
        <label>批量更改优先级:</label>
        <div class="action-buttons">
          <button
            v-for="priority in Object.values(TodoPriority)"
            :key="priority"
            class="action-btn priority-btn"
            :class="getPriorityClass(priority)"
            @click="bulkChangePriority(priority)"
          >
            {{ priority }}
          </button>
        </div>
      </div>

      <!-- 批量添加标签 -->
      <div class="action-group">
        <label>批量添加标签:</label>
        <div class="tag-input-group">
          <input
            v-model="newTag"
            type="text"
            placeholder="输入标签名称"
            class="tag-input"
            @keyup.enter="bulkAddTag"
          />
          <button class="add-tag-btn" @click="bulkAddTag">添加</button>
        </div>
        <div class="quick-tags">
          <button
            v-for="tag in availableTags"
            :key="tag"
            class="quick-tag"
            @click="addQuickTag(tag)"
          >
            {{ tag }}
          </button>
        </div>
      </div>

      <!-- 批量删除 -->
      <div class="action-group danger">
        <label>危险操作:</label>
        <button class="action-btn delete-btn" @click="confirmBulkDelete">
          🗑️ 批量删除
        </button>
      </div>
    </div>

    <!-- 确认删除对话框 -->
    <div v-if="showDeleteConfirm" class="delete-confirm-overlay">
      <div class="delete-confirm-modal">
        <div class="confirm-header">
          <h4>⚠️ 确认删除</h4>
        </div>
        <div class="confirm-content">
          <p>确定要删除选中的 <strong>{{ selectedCount }}</strong> 个任务吗？</p>
          <p class="warning-text">此操作无法撤销！</p>
        </div>
        <div class="confirm-actions">
          <button class="btn secondary" @click="showDeleteConfirm = false">
            取消
          </button>
          <button class="btn danger" @click="executeBulkDelete">
            确认删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTodoStore } from '@/stores/todo'
import { TodoStatus, TodoPriority } from '@/types/todo'

const todoStore = useTodoStore()
const newTag = ref('')
const showDeleteConfirm = ref(false)

const selectedCount = computed(() => todoStore.selectedTodos.length)
const availableTags = computed(() => todoStore.allTags)

// 清除选择
const clearSelection = () => {
  todoStore.clearSelection()
}

// 批量更改状态
const bulkChangeStatus = (status: TodoStatus) => {
  if (selectedCount.value > 0) {
    todoStore.bulkChangeStatus(todoStore.selectedTodos, status)
    todoStore.clearSelection()
  }
}

// 批量更改优先级
const bulkChangePriority = (priority: TodoPriority) => {
  if (selectedCount.value > 0) {
    todoStore.bulkChangePriority(todoStore.selectedTodos, priority)
    todoStore.clearSelection()
  }
}

// 批量添加标签
const bulkAddTag = () => {
  if (newTag.value.trim() && selectedCount.value > 0) {
    todoStore.bulkAddTags(todoStore.selectedTodos, [newTag.value.trim()])
    newTag.value = ''
    todoStore.clearSelection()
  }
}

// 快速添加标签
const addQuickTag = (tag: string) => {
  if (selectedCount.value > 0) {
    todoStore.bulkAddTags(todoStore.selectedTodos, [tag])
    todoStore.clearSelection()
  }
}

// 确认批量删除
const confirmBulkDelete = () => {
  showDeleteConfirm.value = true
}

// 执行批量删除
const executeBulkDelete = () => {
  if (selectedCount.value > 0) {
    todoStore.bulkDelete(todoStore.selectedTodos)
    todoStore.clearSelection()
    showDeleteConfirm.value = false
  }
}

// 获取状态样式类
const getStatusClass = (status: TodoStatus) => {
  switch (status) {
    case TodoStatus.TODO:
      return 'status-todo'
    case TodoStatus.IN_PROGRESS:
      return 'status-progress'
    case TodoStatus.COMPLETED:
      return 'status-completed'
    default:
      return ''
  }
}

// 获取优先级样式类
const getPriorityClass = (priority: TodoPriority) => {
  switch (priority) {
    case TodoPriority.LOW:
      return 'priority-low'
    case TodoPriority.MEDIUM:
      return 'priority-medium'
    case TodoPriority.HIGH:
      return 'priority-high'
    default:
      return ''
  }
}
</script>

<style scoped>
.todo-bulk-actions {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  border: 2px solid #667eea;
}

.bulk-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.selected-info {
  font-size: 16px;
  color: #333;
}

.selected-info strong {
  color: #667eea;
}

.clear-selection {
  background: #6c757d;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.clear-selection:hover {
  background: #5a6268;
}

.bulk-actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.action-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-group label {
  font-weight: 500;
  color: #555;
  font-size: 14px;
}

.action-group.danger label {
  color: #dc3545;
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
  font-weight: 500;
}

.status-btn {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #dee2e6;
}

.status-btn:hover {
  background: #e9ecef;
}

.status-btn.status-todo {
  background: #fff3cd;
  color: #856404;
  border-color: #ffeaa7;
}

.status-btn.status-progress {
  background: #d1ecf1;
  color: #0c5460;
  border-color: #bee5eb;
}

.status-btn.status-completed {
  background: #d4edda;
  color: #155724;
  border-color: #c3e6cb;
}

.priority-btn {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #dee2e6;
}

.priority-btn:hover {
  background: #e9ecef;
}

.priority-btn.priority-low {
  background: #d4edda;
  color: #155724;
  border-color: #c3e6cb;
}

.priority-btn.priority-medium {
  background: #fff3cd;
  color: #856404;
  border-color: #ffeaa7;
}

.priority-btn.priority-high {
  background: #f8d7da;
  color: #721c24;
  border-color: #f5c6cb;
}

.tag-input-group {
  display: flex;
  gap: 8px;
}

.tag-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.tag-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.add-tag-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s;
}

.add-tag-btn:hover {
  background: #5a6fd8;
}

.quick-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.quick-tag {
  padding: 6px 12px;
  background: #f0f2f5;
  border: 1px solid #e9ecef;
  border-radius: 16px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.quick-tag:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.delete-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.delete-btn:hover {
  background: #c82333;
}

.delete-confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.delete-confirm-modal {
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.confirm-header h4 {
  margin: 0 0 16px 0;
  color: #dc3545;
  font-size: 18px;
}

.confirm-content {
  margin-bottom: 20px;
}

.confirm-content p {
  margin: 8px 0;
  color: #333;
}

.warning-text {
  color: #dc3545;
  font-weight: 500;
}

.confirm-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.btn.secondary {
  background: #6c757d;
  color: white;
}

.btn.secondary:hover {
  background: #5a6268;
}

.btn.danger {
  background: #dc3545;
  color: white;
}

.btn.danger:hover {
  background: #c82333;
}

@media (max-width: 768px) {
  .todo-bulk-actions {
    padding: 16px;
  }
  
  .bulk-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .action-buttons {
    gap: 6px;
  }
  
  .action-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .tag-input-group {
    flex-direction: column;
  }
  
  .quick-tags {
    gap: 6px;
  }
  
  .quick-tag {
    padding: 4px 10px;
    font-size: 11px;
  }
}
</style>
