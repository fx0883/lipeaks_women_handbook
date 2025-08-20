<template>
  <div class="todo-handbook-gallery">
    <div class="gallery-header">
      <h2>📖 手账模板</h2>
      <p>选择模板，为你的任务创建精美的手账记录</p>
    </div>
    
    <!-- 模板分类筛选 -->
    <div class="template-filters">
      <div class="filter-group">
        <label class="filter-label">模板类型：</label>
        <div class="filter-options">
          <button
            v-for="type in templateTypes"
            :key="type.value"
            class="filter-btn"
            :class="{ active: selectedType === type.value }"
            @click="selectedType = type.value"
          >
            {{ type.label }}
          </button>
        </div>
      </div>
      
      <div class="filter-group">
        <label class="filter-label">分类：</label>
        <div class="filter-options">
          <button
            v-for="category in categories"
            :key="category"
            class="filter-btn"
            :class="{ active: selectedCategory === category }"
            @click="selectedCategory = category"
          >
            {{ category }}
          </button>
        </div>
      </div>
      
      <button class="clear-filters" @click="clearFilters">
        清除筛选
      </button>
    </div>
    
    <!-- 模板网格 -->
    <div class="templates-grid">
      <div
        v-for="template in filteredTemplates"
        :key="template.id"
        class="template-card"
      >
        <TodoCompletionTemplate
          :template="template"
          :todo-data="selectedTodos"
          @generated="onHandbookGenerated"
          @preview="onTemplatePreview"
          @customize="onTemplateCustomize"
        />
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-if="filteredTemplates.length === 0" class="empty-state">
      <div class="empty-icon">📚</div>
      <h3>没有找到匹配的模板</h3>
      <p>尝试调整筛选条件或创建自定义模板</p>
      <button class="btn primary" @click="createCustomTemplate">
        创建自定义模板
      </button>
    </div>
    
    <!-- 快速生成区域 -->
    <div v-if="selectedTodos.length > 0" class="quick-generate">
      <div class="quick-generate-header">
        <h3>🚀 快速生成</h3>
        <p>为选中的 {{ selectedTodos.length }} 个任务快速生成手账</p>
      </div>
      
      <div class="quick-templates">
        <button
          v-for="template in quickTemplates"
          :key="template.id"
          class="quick-template-btn"
          @click="quickGenerate(template)"
        >
          <span class="template-icon">{{ getTemplateIcon(template.type) }}</span>
          <span class="template-name">{{ template.name }}</span>
        </button>
      </div>
    </div>
    
    <!-- 生成的手账列表 -->
    <div v-if="generatedHandbooks.length > 0" class="generated-handbooks">
      <div class="section-header">
        <h3>📋 已生成的手账</h3>
        <p>共 {{ generatedHandbooks.length }} 个手账记录</p>
      </div>
      
      <div class="handbooks-list">
        <div
          v-for="handbook in generatedHandbooks"
          :key="handbook.id"
          class="handbook-item"
        >
          <div class="handbook-info">
            <h4>{{ handbook.name }}</h4>
            <p>{{ handbook.description }}</p>
            <div class="handbook-meta">
              <span class="meta-item">
                📅 {{ formatDate(handbook.createdAt) }}
              </span>
              <span class="meta-item">
                📊 {{ handbook.generatedContent.elementCount }} 个元素
              </span>
              <span class="meta-item">
                📏 {{ handbook.exportSettings.dimensions.width }} × {{ handbook.exportSettings.dimensions.height }}
              </span>
            </div>
          </div>
          
          <div class="handbook-actions">
            <button class="btn ghost" @click="previewHandbook(handbook)">
              预览
            </button>
            <button class="btn primary" @click="exportHandbook(handbook)">
              导出
            </button>
            <button class="btn ghost" @click="shareHandbook(handbook)">
              分享
            </button>
            <button class="btn danger" @click="deleteHandbook(handbook.id)">
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useHandbookStore } from '@/stores/handbook'
import { useTodoStore } from '@/stores/todo'
import TodoCompletionTemplate from './TodoCompletionTemplate.vue'
import type { TodoHandbookTemplate, TodoHandbook } from '@/types/handbook'
import type { TodoItem } from '@/types/todo'

// 模板类型选项
const templateTypes = [
  { value: '', label: '全部' },
  { value: 'completion', label: '完成记录' },
  { value: 'progress', label: '进度报告' },
  { value: 'achievement', label: '成就展示' },
  { value: 'review', label: '回顾总结' },
  { value: 'custom', label: '自定义' }
]

// 分类选项
const categories = ['学习', '生活', '工作', '娱乐']

// 状态
const selectedType = ref('')
const selectedCategory = ref('')
const selectedTodos = ref<TodoItem[]>([])

// Store
const handbookStore = useHandbookStore()
const todoStore = useTodoStore()

// 计算属性
const filteredTemplates = computed(() => {
  let templates = handbookStore.templates
  
  if (selectedType.value) {
    templates = templates.filter(t => t.type === selectedType.value)
  }
  
  if (selectedCategory.value) {
    templates = templates.filter(t => t.category === selectedCategory.value)
  }
  
  return templates
})

const quickTemplates = computed(() => {
  return handbookStore.completionTemplates.slice(0, 3)
})

const generatedHandbooks = computed(() => {
  return handbookStore.generatedHandbooks
})

// 清除筛选
const clearFilters = () => {
  selectedType.value = ''
  selectedCategory.value = ''
}

// 获取模板图标
const getTemplateIcon = (type: string): string => {
  const icons: Record<string, string> = {
    'completion': '✅',
    'progress': '📈',
    'achievement': '🏆',
    'review': '📝',
    'custom': '🎨'
  }
  return icons[type] || '📄'
}

// 快速生成手账
const quickGenerate = async (template: TodoHandbookTemplate) => {
  if (selectedTodos.value.length === 0) {
    alert('请先选择要生成手账的任务')
    return
  }
  
  try {
    const options = {
      templateId: template.id,
      todoIds: selectedTodos.value.map(t => t.id),
      customData: {
        template,
        todoData: selectedTodos.value
      }
    }
    
    const handbook = await handbookStore.generateHandbook(options)
    
    if (handbook) {
      // 更新Todo项的手账生成状态
      selectedTodos.value.forEach(todo => {
        todoStore.updateTodo(todo.id, {
          handbookGenerated: true,
          handbookGeneratedAt: new Date()
        })
      })
      
      alert(`手账"${handbook.name}"生成成功！`)
    }
  } catch (error) {
    console.error('Failed to quick generate handbook:', error)
    alert('生成手账失败，请重试')
  }
}

// 手账生成完成
const onHandbookGenerated = (handbookId: string) => {
  console.log('Handbook generated:', handbookId)
  // 可以在这里添加成功提示或其他逻辑
}

// 模板预览
const onTemplatePreview = (template: TodoHandbookTemplate) => {
  console.log('Preview template:', template)
  // 这里可以实现模板预览功能
}

// 模板自定义
const onTemplateCustomize = (template: TodoHandbookTemplate) => {
  console.log('Customize template:', template)
  // 这里可以实现模板自定义功能
}

// 创建自定义模板
const createCustomTemplate = () => {
  console.log('Create custom template')
  // 这里可以实现创建自定义模板的功能
}

// 预览手账
const previewHandbook = (handbook: TodoHandbook) => {
  console.log('Preview handbook:', handbook)
  // 这里可以实现手账预览功能
}

// 导出手账
const exportHandbook = async (handbook: TodoHandbook) => {
  try {
    const blob = await handbookStore.exportHandbook(handbook.id, handbook.exportSettings.format)
    
    if (blob) {
      // 创建下载链接
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${handbook.name}.${handbook.exportSettings.format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      alert('手账导出成功！')
    }
  } catch (error) {
    console.error('Failed to export handbook:', error)
    alert('导出手账失败，请重试')
  }
}

// 分享手账
const shareHandbook = async (handbook: TodoHandbook) => {
  try {
    const success = await handbookStore.shareHandbook(handbook.id, 'wechat')
    
    if (success) {
      alert('手账分享成功！')
    } else {
      alert('手账分享失败，请重试')
    }
  } catch (error) {
    console.error('Failed to share handbook:', error)
    alert('分享手账失败，请重试')
  }
}

// 删除手账
const deleteHandbook = (handbookId: string) => {
  if (confirm('确定要删除这个手账吗？此操作不可恢复。')) {
    handbookStore.deleteHandbook(handbookId)
  }
}

// 格式化日期
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// 监听选中的任务变化
const updateSelectedTodos = (todos: TodoItem[]) => {
  selectedTodos.value = todos
}

// 暴露方法给父组件
defineExpose({
  updateSelectedTodos
})

onMounted(() => {
  // 初始化时可以选择一些已完成的任务作为示例
  const completedTodos = todoStore.todos.filter(t => t.status === '已完成').slice(0, 3)
  selectedTodos.value = completedTodos
})
</script>

<style scoped>
.todo-handbook-gallery {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.gallery-header {
  text-align: center;
  margin-bottom: 32px;
}

.gallery-header h2 {
  margin: 0 0 12px 0;
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
}

.gallery-header p {
  margin: 0;
  color: #7f8c8d;
  font-size: 16px;
}

.template-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 32px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
}

.filter-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 6px 12px;
  border: 1px solid #e1e8ed;
  border-radius: 6px;
  background: white;
  color: #7f8c8d;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.filter-btn.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.clear-filters {
  padding: 8px 16px;
  border: 1px solid #e74c3c;
  border-radius: 6px;
  background: white;
  color: #e74c3c;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: end;
}

.clear-filters:hover {
  background: #e74c3c;
  color: white;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.template-card {
  transition: transform 0.2s ease;
}

.template-card:hover {
  transform: translateY(-4px);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #7f8c8d;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #2c3e50;
}

.empty-state p {
  margin: 0 0 24px 0;
}

.quick-generate {
  margin-bottom: 40px;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.quick-generate-header {
  text-align: center;
  margin-bottom: 24px;
}

.quick-generate-header h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
}

.quick-generate-header p {
  margin: 0;
  opacity: 0.9;
}

.quick-templates {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.quick-template-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
}

.quick-template-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.template-icon {
  font-size: 24px;
}

.template-name {
  font-size: 12px;
  text-align: center;
}

.generated-handbooks {
  margin-top: 40px;
}

.section-header {
  text-align: center;
  margin-bottom: 24px;
}

.section-header h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #2c3e50;
}

.section-header p {
  margin: 0;
  color: #7f8c8d;
}

.handbooks-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.handbook-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.handbook-item:hover {
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
}

.handbook-info h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #2c3e50;
}

.handbook-info p {
  margin: 0 0 12px 0;
  color: #7f8c8d;
  font-size: 14px;
}

.handbook-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 12px;
  color: #95a5a6;
}

.handbook-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn.primary {
  background: #667eea;
  color: white;
}

.btn.primary:hover {
  background: #5a6fd8;
}

.btn.ghost {
  background: transparent;
  color: #667eea;
  border: 1px solid #667eea;
}

.btn.ghost:hover {
  background: #667eea;
  color: white;
}

.btn.danger {
  background: #e74c3c;
  color: white;
}

.btn.danger:hover {
  background: #c0392b;
}

@media (max-width: 768px) {
  .todo-handbook-gallery {
    padding: 16px;
  }
  
  .template-filters {
    flex-direction: column;
    gap: 16px;
  }
  
  .filter-options {
    justify-content: center;
  }
  
  .templates-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .quick-templates {
    flex-direction: column;
    align-items: center;
  }
  
  .handbook-item {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .handbook-actions {
    justify-content: center;
  }
  
  .handbook-meta {
    justify-content: center;
  }
}
</style>
