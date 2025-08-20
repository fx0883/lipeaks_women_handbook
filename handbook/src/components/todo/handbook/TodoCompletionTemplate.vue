<template>
  <div class="todo-completion-template">
    <div class="template-header">
      <h3>{{ template.name }}</h3>
      <p>{{ template.description }}</p>
    </div>
    
    <div class="template-preview">
      <div 
        class="preview-canvas"
        :style="{
          width: `${template.layout.dimensions.width / 4}px`,
          height: `${template.layout.dimensions.height / 4}px`,
          backgroundColor: template.layout.backgroundColor,
          padding: `${template.layout.padding.top / 4}px ${template.layout.padding.right / 4}px ${template.layout.padding.bottom / 4}px ${template.layout.padding.left / 4}px`
        }"
      >
        <div 
          v-for="element in template.elements"
          :key="element.id"
          class="template-element"
          :style="{
            position: 'absolute',
            left: `${element.position.x / 4}px`,
            top: `${element.position.y / 4}px`,
            width: `${element.size.width / 4}px`,
            height: `${element.size.height / 4}px`,
            fontFamily: element.style.fontFamily,
            fontSize: `${element.style.fontSize / 4}px`,
            fontWeight: element.style.fontWeight,
            color: element.style.color,
            backgroundColor: element.style.backgroundColor,
            border: element.style.borderWidth > 0 ? `${element.style.borderWidth / 4}px solid ${element.style.borderColor}` : 'none',
            borderRadius: `${element.style.borderRadius / 4}px`,
            opacity: element.style.opacity,
            transform: `rotate(${element.style.rotation}deg)`,
            boxShadow: element.style.shadow ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
          }"
        >
          <!-- 文本元素 -->
          <div v-if="element.type === 'text'" class="text-element">
            {{ getElementText(element) }}
          </div>
          
          <!-- 心情元素 -->
          <div v-else-if="element.type === 'mood'" class="mood-element">
            {{ getMoodIcon(element) }}
          </div>
          
          <!-- 图表元素 -->
          <div v-else-if="element.type === 'chart'" class="chart-element">
            📊
          </div>
          
          <!-- 进度元素 -->
          <div v-else-if="element.type === 'progress'" class="progress-element">
            <div class="progress-bar">
              <div 
                class="progress-fill"
                :style="{ width: `${getProgressValue(element)}%` }"
              ></div>
            </div>
          </div>
          
          <!-- 成就元素 -->
          <div v-else-if="element.type === 'achievement'" class="achievement-element">
            🏆
          </div>
          
          <!-- Todo卡片元素 -->
          <div v-else-if="element.type === 'todo-card'" class="todo-card-element">
            📝
          </div>
        </div>
      </div>
    </div>
    
    <div class="template-actions">
      <button 
        class="btn primary"
        @click="generateHandbook"
        :disabled="isGenerating"
      >
        {{ isGenerating ? '生成中...' : '生成手账' }}
      </button>
      
      <button 
        class="btn ghost"
        @click="previewTemplate"
      >
        预览模板
      </button>
      
      <button 
        class="btn ghost"
        @click="customizeTemplate"
      >
        自定义
      </button>
    </div>
    
    <div class="template-info">
      <div class="info-item">
        <span class="label">类型：</span>
        <span class="value">{{ getTypeLabel(template.type) }}</span>
      </div>
      <div class="info-item">
        <span class="label">分类：</span>
        <span class="value">{{ template.category }}</span>
      </div>
      <div class="info-item">
        <span class="label">元素数量：</span>
        <span class="value">{{ template.elements.length }}</span>
      </div>
      <div class="info-item">
        <span class="label">尺寸：</span>
        <span class="value">{{ template.layout.dimensions.width }} × {{ template.layout.dimensions.height }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHandbookStore } from '@/stores/handbook'
import { useTodoStore } from '@/stores/todo'
import type { TodoHandbookTemplate } from '@/types/handbook'
import type { TodoItem } from '@/types/todo'

interface Props {
  template: TodoHandbookTemplate
  todoData?: TodoItem[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  generated: [handbookId: string]
  preview: [template: TodoHandbookTemplate]
  customize: [template: TodoHandbookTemplate]
}>()

const handbookStore = useHandbookStore()
const todoStore = useTodoStore()

const isGenerating = ref(false)

// 获取元素文本内容
const getElementText = (element: any): string => {
  if (element.content.text) {
    return element.content.text
  }
  return '示例文本'
}

// 获取心情图标
const getMoodIcon = (element: any): string => {
  if (element.content.moodType) {
    return element.content.moodType
  }
  return '😊'
}

// 获取进度值
const getProgressValue = (element: any): number => {
  if (element.content.progressValue !== undefined) {
    return element.content.progressValue
  }
  return 75 // 默认值
}

// 获取类型标签
const getTypeLabel = (type: string): string => {
  const typeLabels: Record<string, string> = {
    'completion': '完成记录',
    'progress': '进度报告',
    'achievement': '成就展示',
    'review': '回顾总结',
    'custom': '自定义'
  }
  return typeLabels[type] || type
}

// 生成手账
const generateHandbook = async () => {
  try {
    isGenerating.value = true
    
    const options = {
      templateId: props.template.id,
      todoIds: props.todoData?.map(t => t.id) || [],
      customData: {
        template: props.template,
        todoData: props.todoData
      }
    }
    
    const handbook = await handbookStore.generateHandbook(options)
    
    if (handbook) {
      emit('generated', handbook.id)
      
      // 更新Todo项的手账生成状态
      if (props.todoData) {
        props.todoData.forEach(todo => {
          todoStore.updateTodo(todo.id, {
            handbookGenerated: true,
            handbookGeneratedAt: new Date()
          })
        })
      }
    }
  } catch (error) {
    console.error('Failed to generate handbook:', error)
  } finally {
    isGenerating.value = false
  }
}

// 预览模板
const previewTemplate = () => {
  emit('preview', props.template)
}

// 自定义模板
const customizeTemplate = () => {
  emit('customize', props.template)
}
</script>

<style scoped>
.todo-completion-template {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.todo-completion-template:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.template-header {
  margin-bottom: 20px;
  text-align: center;
}

.template-header h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
}

.template-header p {
  margin: 0;
  color: #7f8c8d;
  font-size: 14px;
}

.template-preview {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.preview-canvas {
  position: relative;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  overflow: hidden;
  background: #ffffff;
}

.template-element {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.text-element {
  text-align: center;
  word-break: break-word;
  line-height: 1.2;
}

.mood-element {
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-element {
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-element {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e1e8ed;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3498db, #2ecc71);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.achievement-element {
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.todo-card-element {
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.template-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn.primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.template-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item .label {
  font-size: 12px;
  color: #7f8c8d;
  font-weight: 500;
}

.info-item .value {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 600;
}

@media (max-width: 768px) {
  .todo-completion-template {
    padding: 16px;
  }
  
  .template-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .btn {
    width: 100%;
  }
  
  .template-info {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
