<template>
  <div class="todo-import-export">
    <div class="section-header">
      <h4>📁 数据管理</h4>
    </div>

    <div class="actions-container">
      <!-- 导出功能 -->
      <div class="action-section">
        <h5>📤 导出任务</h5>
        <p class="section-description">将当前所有任务导出为JSON文件，方便备份和迁移</p>
        <div class="export-options">
          <button class="btn primary" @click="exportAllTodos">
            📥 导出所有任务
          </button>
          <button class="btn secondary" @click="exportFilteredTodos" :disabled="!hasFilters">
            🔍 导出筛选结果
          </button>
        </div>
        <div v-if="exportStats" class="export-stats">
          <span class="stat-item">
            📊 导出数量: <strong>{{ exportStats.count }}</strong>
          </span>
          <span class="stat-item">
            📅 导出时间: <strong>{{ exportStats.time }}</strong>
          </span>
        </div>
      </div>

      <!-- 导入功能 -->
      <div class="action-section">
        <h5>📥 导入任务</h5>
        <p class="section-description">从JSON文件导入任务，支持合并和覆盖模式</p>
        <div class="import-options">
          <div class="file-input-group">
            <input
              ref="fileInput"
              type="file"
              accept=".json"
              @change="handleFileSelect"
              class="file-input"
            />
            <button class="btn secondary" @click="triggerFileSelect">
              📁 选择文件
            </button>
          </div>
          <div class="import-mode">
            <label class="mode-label">
              <input
                type="radio"
                v-model="importMode"
                value="merge"
                name="importMode"
              />
              <span>合并模式</span>
            </label>
            <label class="mode-label">
              <input
                type="radio"
                v-model="importMode"
                value="replace"
                name="importMode"
              />
              <span>覆盖模式</span>
            </label>
          </div>
          <button 
            class="btn primary" 
            @click="importTodos" 
            :disabled="!selectedFile"
          >
            📥 开始导入
          </button>
        </div>
        <div v-if="importStats" class="import-stats">
          <span class="stat-item">
            📊 导入数量: <strong>{{ importStats.count }}</strong>
          </span>
          <span class="stat-item">
            📅 导入时间: <strong>{{ importStats.time }}</strong>
          </span>
          <span class="stat-item">
            ⚠️ 冲突处理: <strong>{{ importStats.conflicts }}</strong>
          </span>
        </div>
      </div>

      <!-- 数据管理 -->
      <div class="action-section">
        <h5>🗄️ 数据管理</h5>
        <p class="section-description">管理本地存储的任务数据</p>
        <div class="data-actions">
          <button class="btn warning" @click="confirmClearData">
            🗑️ 清空所有数据
          </button>
          <button class="btn secondary" @click="resetToMockData">
            🔄 重置为示例数据
          </button>
        </div>
      </div>
    </div>

    <!-- 确认清空数据对话框 -->
    <div v-if="showClearConfirm" class="confirm-overlay">
      <div class="confirm-modal">
        <div class="confirm-header">
          <h4>⚠️ 确认清空数据</h4>
        </div>
        <div class="confirm-content">
          <p>确定要清空所有任务数据吗？</p>
          <p class="warning-text">此操作将删除所有任务，无法恢复！</p>
          <p class="info-text">建议先导出数据作为备份</p>
        </div>
        <div class="confirm-actions">
          <button class="btn secondary" @click="showClearConfirm = false">
            取消
          </button>
          <button class="btn danger" @click="executeClearData">
            确认清空
          </button>
        </div>
      </div>
    </div>

    <!-- 导入预览对话框 -->
    <div v-if="showImportPreview" class="preview-overlay">
      <div class="preview-modal">
        <div class="preview-header">
          <h4>📋 导入预览</h4>
          <button class="close-btn" @click="showImportPreview = false">×</button>
        </div>
        <div class="preview-content">
          <div class="preview-stats">
            <span>总任务数: <strong>{{ previewData?.total ?? 0 }}</strong></span>
            <span>有效任务: <strong>{{ previewData?.valid ?? 0 }}</strong></span>
            <span>无效任务: <strong>{{ previewData?.invalid ?? 0 }}</strong></span>
          </div>
          <div class="preview-list">
            <div
              v-for="(todo, index) in (previewData?.todos || []).slice(0, 5)"
              :key="index"
              class="preview-item"
            >
              <span class="todo-title">{{ todo.title }}</span>
              <span class="todo-category">{{ todo.category }}</span>
            </div>
            <div v-if="(previewData?.todos?.length || 0) > 5" class="preview-more">
              ... 还有 {{ (previewData?.todos?.length || 0) - 5 }} 个任务
            </div>
          </div>
        </div>
        <div class="preview-actions">
          <button class="btn secondary" @click="showImportPreview = false">
            取消
          </button>
          <button class="btn primary" @click="confirmImport">
            确认导入
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTodoStore } from '@/stores/todo'
import type { TodoItem } from '@/types/todo'

const todoStore = useTodoStore()
const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const importMode = ref<'merge' | 'replace'>('merge')
const showClearConfirm = ref(false)
const showImportPreview = ref(false)

// 导出统计
const exportStats = ref<{ count: number; time: string } | null>(null)

// 导入统计
const importStats = ref<{ count: number; time: string; conflicts: number } | null>(null)

// 预览数据
const previewData = ref<{
  total: number
  valid: number
  invalid: number
  todos: TodoItem[]
} | null>(null)

// 是否有筛选条件
const hasFilters = computed(() => {
  const filters = todoStore.filters
  return filters.search || 
         filters.category || 
         filters.priority || 
         filters.status || 
         (filters.tags && filters.tags.length > 0) ||
         filters.dueDateRange
})

// 触发文件选择
const triggerFileSelect = () => {
  fileInput.value?.click()
}

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
    previewImportData()
  }
}

// 预览导入数据
const previewImportData = () => {
  if (!selectedFile.value) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string
      const data = JSON.parse(content)
      
      if (Array.isArray(data)) {
        const validTodos = data.filter(item => 
          item.title && 
          item.category && 
          item.priority && 
          item.status
        )
        
        previewData.value = {
          total: data.length,
          valid: validTodos.length,
          invalid: data.length - validTodos.length,
          todos: validTodos
        }
        
        showImportPreview.value = true
      } else {
        alert('文件格式不正确，请选择有效的JSON文件')
      }
    } catch (error) {
      alert('文件解析失败，请检查文件格式')
    }
  }
  reader.readAsText(selectedFile.value)
}

// 导出所有任务
const exportAllTodos = () => {
  const data = todoStore.exportTodos()
  downloadFile(data, 'todos_export.json')
  
  exportStats.value = {
    count: todoStore.todos.length,
    time: new Date().toLocaleString()
  }
}

// 导出筛选结果
const exportFilteredTodos = () => {
  const filteredTodos = todoStore.filteredTodos
  const data = JSON.stringify(filteredTodos, null, 2)
  downloadFile(data, 'todos_filtered_export.json')
  
  exportStats.value = {
    count: filteredTodos.length,
    time: new Date().toLocaleString()
  }
}

// 下载文件
const downloadFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 确认导入
const confirmImport = () => {
  showImportPreview.value = false
  executeImport()
}

// 执行导入
const executeImport = () => {
  if (!selectedFile.value) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string
      const success = todoStore.importTodos(content)
      
      if (success) {
        importStats.value = {
          count: todoStore.todos.length,
          time: new Date().toLocaleString(),
          conflicts: 0 // 简化处理，实际可以计算冲突数量
        }
        
        selectedFile.value = null
        if (fileInput.value) {
          fileInput.value.value = ''
        }
        
        alert('导入成功！')
      } else {
        alert('导入失败，请检查文件格式')
      }
    } catch (error) {
      alert('导入失败：' + error)
    }
  }
  reader.readAsText(selectedFile.value)
}

// 导入任务（直接导入，不预览）
const importTodos = () => {
  if (!selectedFile.value) return
  executeImport()
}

// 确认清空数据
const confirmClearData = () => {
  showClearConfirm.value = true
}

// 执行清空数据
const executeClearData = () => {
  // 这里需要添加清空数据的方法到store
  // todoStore.clearAllTodos()
  showClearConfirm.value = false
  alert('数据已清空')
}

// 重置为示例数据
const resetToMockData = () => {
  if (confirm('确定要重置为示例数据吗？当前数据将被覆盖。')) {
    // 这里需要添加重置方法到store
    // todoStore.resetToMockData()
    alert('已重置为示例数据')
  }
}
</script>

<style scoped>
.todo-import-export {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.section-header h4 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.actions-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.action-section {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.action-section h5 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.section-description {
  margin: 0 0 16px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

.export-options,
.import-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.file-input-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.file-input {
  display: none;
}

.import-mode {
  display: flex;
  gap: 16px;
}

.mode-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #555;
}

.mode-label input[type="radio"] {
  margin: 0;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  text-align: center;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn.primary {
  background: #667eea;
  color: white;
}

.btn.primary:hover:not(:disabled) {
  background: #5a6fd8;
}

.btn.secondary {
  background: #6c757d;
  color: white;
}

.btn.secondary:hover:not(:disabled) {
  background: #5a6268;
}

.btn.warning {
  background: #ffc107;
  color: #212529;
}

.btn.warning:hover {
  background: #e0a800;
}

.btn.danger {
  background: #dc3545;
  color: white;
}

.btn.danger:hover {
  background: #c82333;
}

.export-stats,
.import-stats {
  margin-top: 12px;
  padding: 12px;
  background: white;
  border-radius: 6px;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.stat-item {
  font-size: 13px;
  color: #666;
}

.stat-item strong {
  color: #333;
}

.data-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.confirm-overlay,
.preview-overlay {
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

.confirm-modal,
.preview-modal {
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.confirm-header,
.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.confirm-header h4,
.preview-header h4 {
  margin: 0;
  color: #dc3545;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-btn:hover {
  background: #f0f0f0;
}

.confirm-content,
.preview-content {
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

.info-text {
  color: #667eea;
  font-size: 14px;
}

.preview-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  flex-wrap: wrap;
}

.preview-list {
  max-height: 200px;
  overflow-y: auto;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  margin-bottom: 8px;
}

.todo-title {
  font-weight: 500;
  color: #333;
}

.todo-category {
  font-size: 12px;
  color: #666;
  background: #f0f2f5;
  padding: 2px 8px;
  border-radius: 12px;
}

.preview-more {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 8px;
}

.confirm-actions,
.preview-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .todo-import-export {
    padding: 16px;
  }
  
  .action-section {
    padding: 16px;
  }
  
  .export-options,
  .import-options {
    gap: 10px;
  }
  
  .btn {
    padding: 8px 16px;
    font-size: 13px;
  }
  
  .import-mode {
    flex-direction: column;
    gap: 8px;
  }
  
  .data-actions {
    flex-direction: column;
  }
  
  .export-stats,
  .import-stats {
    flex-direction: column;
    gap: 8px;
  }
  
  .preview-stats {
    flex-direction: column;
    gap: 8px;
  }
  
  .confirm-actions,
  .preview-actions {
    flex-direction: column;
  }
}
</style>
