<template>
  <div class="todo-create">
    <div class="create-header">
      <h3>✨ 新建任务</h3>
      <button class="close-btn" @click="$emit('close')">×</button>
    </div>
    
    <form @submit.prevent="createTodo" class="create-form">
      <div class="form-group">
        <label>任务标题 *</label>
        <input 
          v-model="form.title" 
          type="text" 
          placeholder="输入任务标题..."
          required
        />
      </div>
      
      <div class="form-group">
        <label>任务描述</label>
        <textarea 
          v-model="form.description" 
          placeholder="描述任务详情..."
          rows="3"
        ></textarea>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>分类 *</label>
          <select v-model="form.category" required>
            <option value="学习">📚 学习</option>
            <option value="生活">🏠 生活</option>
            <option value="工作">💼 工作</option>
            <option value="娱乐">🎉 娱乐</option>
          </select>
        </div>
        <div class="form-group">
          <label>优先级 *</label>
          <select v-model="form.priority" required>
            <option value="低">🟢 低</option>
            <option value="中">🟡 中</option>
            <option value="高">🔴 高</option>
          </select>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>截止日期</label>
          <input 
            v-model="form.dueDate" 
            type="date"
          />
        </div>
        <div class="form-group">
          <label>标签</label>
          <input 
            v-model="form.tagsInput" 
            type="text" 
            placeholder="用逗号分隔多个标签..."
          />
        </div>
      </div>
      
      <div class="form-actions">
        <button type="button" class="btn secondary" @click="$emit('close')">
          取消
        </button>
        <button type="submit" class="btn primary">
          创建任务
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useTodoStore } from '@/stores/todo'
import type { CreateTodoData } from '@/types/todo'

const emit = defineEmits<{
  close: []
  created: [todo: any]
}>()

const todoStore = useTodoStore()

const form = reactive({
  title: '',
  description: '',
  category: '学习',
  priority: '中',
  dueDate: '',
  tagsInput: ''
})

const createTodo = () => {
  const tags = form.tagsInput
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)

  const todoData: CreateTodoData = {
    title: form.title,
    description: form.description || undefined,
    category: form.category as any,
    priority: form.priority as any,
    dueDate: form.dueDate ? new Date(form.dueDate) : undefined,
    tags
  }

  const newTodo = todoStore.addTodo(todoData)
  
  // 重置表单
  Object.assign(form, {
    title: '',
    description: '',
    category: '学习',
    priority: '中',
    dueDate: '',
    tagsInput: ''
  })
  
  emit('created', newTodo)
  emit('close')
}
</script>

<style scoped>
.todo-create {
  background: var(--colorNeutralBackground1);
  border-radius: 20px;
  box-shadow: var(--shadow16);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.create-header {
  padding: 24px 24px 16px;
  border-bottom: 1px solid var(--colorNeutralStroke1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.create-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--colorNeutralForeground3);
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.close-btn:hover {
  background: var(--colorNeutralBackground3);
}

.create-form {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--colorNeutralForeground1);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 8px;
  background: var(--colorNeutralBackground1);
  color: var(--colorNeutralForeground1);
  font-size: 14px;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--colorBrandBackground);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 12px;
  border: 1px solid var(--colorNeutralStroke1);
  background: var(--colorNeutralBackground1);
  color: var(--colorNeutralForeground1);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  min-height: 44px;
}

.btn.primary {
  background: var(--colorBrandBackground);
  color: var(--colorBrandForeground);
  border-color: var(--colorBrandBackground);
}

.btn.primary:hover {
  background: var(--colorBrandBackgroundHover);
}

.btn.secondary:hover {
  background: var(--colorNeutralBackground3);
  border-color: var(--colorBrandBackground);
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
