<template>
  <div class="create-page">
    <!-- 侧边栏筛选 -->
    <aside class="sidebar">
      <h3>分类筛选</h3>
      <div class="filter-group">
        <h4>场景分类</h4>
        <div class="filter-options">
          <label class="filter-option">
            <input 
              type="radio" 
              name="category" 
              value="high-school"
              v-model="selectedCategory"
            />
            <span>高中生活</span>
          </label>
          <label class="filter-option">
            <input 
              type="radio" 
              name="category" 
              value="university"
              v-model="selectedCategory"
            />
            <span>大学生活</span>
          </label>
          <label class="filter-option">
            <input 
              type="radio" 
              name="category" 
              value="workplace"
              v-model="selectedCategory"
            />
            <span>职场生活</span>
          </label>
        </div>
      </div>
      
      <div class="filter-group">
        <h4>比例选择</h4>
        <div class="filter-options">
          <label class="filter-option">
            <input 
              type="checkbox" 
              value="1:1"
              v-model="selectedRatios"
            />
            <span>1:1 方形</span>
          </label>
          <label class="filter-option">
            <input 
              type="checkbox" 
              value="4:5"
              v-model="selectedRatios"
            />
            <span>4:5 竖版</span>
          </label>
          <label class="filter-option">
            <input 
              type="checkbox" 
              value="9:16"
              v-model="selectedRatios"
            />
            <span>9:16 长版</span>
          </label>
          <label class="filter-option">
            <input 
              type="checkbox" 
              value="3:4"
              v-model="selectedRatios"
            />
            <span>3:4 横版</span>
          </label>
        </div>
      </div>
      
      <div class="filter-group">
        <h4>风格标签</h4>
        <div class="filter-options">
          <label class="filter-option">
            <input 
              type="checkbox" 
              value="可爱"
              v-model="selectedStyles"
            />
            <span>可爱</span>
          </label>
          <label class="filter-option">
            <input 
              type="checkbox" 
              value="温柔"
              v-model="selectedStyles"
            />
            <span>温柔</span>
          </label>
          <label class="filter-option">
            <input 
              type="checkbox" 
              value="清新"
              v-model="selectedStyles"
            />
            <span>清新</span>
          </label>
          <label class="filter-option">
            <input 
              type="checkbox" 
              value="复古"
              v-model="selectedStyles"
            />
            <span>复古</span>
          </label>
        </div>
      </div>
      
      <button class="clear-filters" @click="clearFilters">
        清除筛选
      </button>
    </aside>

    <!-- 主内容区 -->
    <main class="content">
      <div class="page-header">
        <h1>选择模板</h1>
        <p>找到最适合你的手账模板，开始创作吧</p>
      </div>

      <!-- 模板网格 -->
      <div class="templates-grid">
        <div 
          v-for="template in filteredTemplates" 
          :key="template.id"
          class="template-card"
          @click="selectTemplate(template)"
        >
          <div class="template-image">
            <img :src="template.thumbnail" :alt="template.name" />
            <div class="template-overlay">
              <span class="template-ratio">{{ template.ratio }}</span>
              <button class="use-template-btn">使用模板</button>
            </div>
          </div>
          <div class="template-info">
            <h3>{{ template.name }}</h3>
            <p>{{ template.description }}</p>
            <div class="template-tags">
              <span 
                v-for="tag in template.styleTag" 
                :key="tag"
                class="tag"
              >
                {{ tag }}
              </span>
            </div>
            <div class="template-meta">
              <span class="category">{{ getCategoryName(template.category) }}</span>
              <span v-if="template.isPopular" class="popular">🔥 热门</span>
              <span v-if="template.isNew" class="new">✨ 新</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredTemplates.length === 0" class="empty-state">
        <div class="empty-icon">🎨</div>
        <h3>没有找到匹配的模板</h3>
        <p>尝试调整筛选条件，或者查看所有模板</p>
        <button class="btn primary" @click="clearFilters">
          查看所有模板
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Template } from '@/types/template'

const router = useRouter()

// 筛选状态
const selectedCategory = ref<string>('')
const selectedRatios = ref<string[]>([])
const selectedStyles = ref<string[]>([])

// 模拟模板数据（后续从 store 获取）
const templates: Template[] = [
  {
    id: 'campus-collage',
    name: '校园日常拼贴',
    description: '记录校园生活的美好瞬间',
    category: 'high-school',
    styleTag: ['可爱', '清新'],
    ratio: '4:5',
    thumbnail: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=400&q=80',
    preview: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800&q=80',
    layers: [],
    tags: ['校园', '日常', '拼贴'],
    isPopular: true,
    isNew: false,
    version: 1,
    createdAt: '2024-01-01'
  },
  {
    id: 'club-poster',
    name: '社团招新海报',
    description: '吸引新成员加入的活力海报',
    category: 'university',
    styleTag: ['可爱', '温柔'],
    ratio: '9:16',
    thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
    preview: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80',
    layers: [],
    tags: ['社团', '招新', '海报'],
    isPopular: true,
    isNew: false,
    version: 1,
    createdAt: '2024-01-01'
  },
  {
    id: 'citywalk',
    name: 'Citywalk/旅行',
    description: '记录城市漫步和旅行见闻',
    category: 'university',
    styleTag: ['清新', '复古'],
    ratio: '9:16',
    thumbnail: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=400&q=80',
    preview: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=800&q=80',
    layers: [],
    tags: ['旅行', '城市', '漫步'],
    isPopular: false,
    isNew: true,
    version: 1,
    createdAt: '2024-01-01'
  },
  {
    id: 'dorm-food',
    name: '宿舍日常/美食',
    description: '分享宿舍生活和美食记录',
    category: 'university',
    styleTag: ['可爱', '温柔'],
    ratio: '1:1',
    thumbnail: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&q=80',
    preview: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&q=80',
    layers: [],
    tags: ['宿舍', '美食', '日常'],
    isPopular: false,
    isNew: false,
    version: 1,
    createdAt: '2024-01-01'
  }
]

// 筛选后的模板
const filteredTemplates = computed(() => {
  return templates.filter(template => {
    // 分类筛选
    if (selectedCategory.value && template.category !== selectedCategory.value) {
      return false
    }
    
    // 比例筛选
    if (selectedRatios.value.length > 0 && !selectedRatios.value.includes(template.ratio)) {
      return false
    }
    
    // 风格筛选
    if (selectedStyles.value.length > 0 && !selectedStyles.value.some(style => template.styleTag.includes(style))) {
      return false
    }
    
    return true
  })
})

// 获取分类名称
const getCategoryName = (category: string): string => {
  const categoryMap: Record<string, string> = {
    'high-school': '高中生活',
    'university': '大学生活',
    'workplace': '职场生活'
  }
  return categoryMap[category] || category
}

// 选择模板
const selectTemplate = (template: Template): void => {
  router.push(`/editor/${template.id}`)
}

// 清除筛选
const clearFilters = (): void => {
  selectedCategory.value = ''
  selectedRatios.value = []
  selectedStyles.value = []
}
</script>

<style scoped>
/* 复用原型样式 */
.create-page {
  display: flex;
  width: 100%;
  padding-top: 104px;
  padding-left: 32px;
  padding-right: 32px;
  padding-bottom: 24px;
  gap: 24px;
  box-sizing: border-box;
}

.sidebar {
  width: 280px;
  flex-shrink: 0;
  background: var(--colorNeutralBackground1);
  border-radius: 20px;
  padding: 24px;
  box-shadow: var(--shadow4);
  height: fit-content;
  position: sticky;
  top: 88px;
  border: 1px solid var(--colorNeutralStroke1);
}

.sidebar h3 {
  margin: 0 0 20px;
  font-size: 18px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.filter-group {
  margin-bottom: 24px;
}

.filter-group h4 {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--colorNeutralForeground2);
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--colorNeutralForeground1);
}

.filter-option input[type="radio"],
.filter-option input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--colorBrandBackground);
}

.clear-filters {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--colorNeutralStroke1);
  background: var(--colorNeutralBackground1);
  color: var(--colorNeutralForeground2);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-filters:hover {
  border-color: var(--colorBrandBackground);
  color: var(--colorBrandBackground);
}

.content {
  flex: 1;
  min-width: 0;
}

.page-header {
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

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.template-card {
  background: var(--colorNeutralBackground1);
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}

.template-card:hover {
  border-color: var(--pink-medium);
  box-shadow: var(--shadow8);
  transform: translateY(-3px);
}

.template-image {
  position: relative;
  aspect-ratio: 4/5;
  overflow: hidden;
}

.template-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.template-card:hover .template-image img {
  transform: scale(1.05);
}

.template-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.template-card:hover .template-overlay {
  opacity: 1;
}

.template-ratio {
  background: var(--colorBrandBackground);
  color: var(--colorBrandForeground);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.use-template-btn {
  background: var(--colorBrandBackground);
  color: var(--colorBrandForeground);
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.use-template-btn:hover {
  background: var(--colorBrandBackgroundHover);
  transform: translateY(-1px);
}

.template-info {
  padding: 20px;
}

.template-info h3 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.template-info p {
  margin: 0 0 16px;
  color: var(--colorNeutralForeground2);
  font-size: 14px;
  line-height: 1.5;
}

.template-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.tag {
  background: var(--pink-light);
  color: var(--pink-dark);
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
}

.template-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
}

.category {
  color: var(--colorNeutralForeground2);
}

.popular,
.new {
  color: var(--colorBrandBackground);
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 80px 24px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 24px;
}

.empty-state h3 {
  margin: 0 0 12px;
  font-size: 24px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.empty-state p {
  margin: 0 0 24px;
  color: var(--colorNeutralForeground2);
  font-size: 16px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  border: 1px solid var(--colorNeutralStroke1);
  background: var(--colorNeutralBackground1);
  text-decoration: none;
  color: var(--colorNeutralForeground1);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
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

/* 响应式设计 */
@media (max-width: 1200px) {
  .create-page {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    position: static;
  }
}

@media (max-width: 768px) {
  .create-page {
    padding: 16px;
  }
  
  .templates-grid {
    grid-template-columns: 1fr;
  }
}
</style>
