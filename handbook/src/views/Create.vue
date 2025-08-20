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
           <label class="filter-option">
             <input 
               type="checkbox" 
               value="甜美"
               v-model="selectedStyles"
             />
             <span>甜美</span>
           </label>
           <label class="filter-option">
             <input 
               type="checkbox" 
               value="优雅"
               v-model="selectedStyles"
             />
             <span>优雅</span>
           </label>
           <label class="filter-option">
             <input 
               type="checkbox" 
               value="梦幻"
               v-model="selectedStyles"
             />
             <span>梦幻</span>
           </label>
           <label class="filter-option">
             <input 
               type="checkbox" 
               value="文艺"
               v-model="selectedStyles"
             />
             <span>文艺</span>
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
  // 高中生活模板
  {
    id: 'campus-collage',
    name: '校园日常拼贴',
    description: '记录校园生活的美好瞬间',
    category: 'high-school',
    styleTag: ['可爱', '清新', '甜美'],
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
    id: 'study-notes',
    name: '学习笔记手账',
    description: '优雅的学习计划和时间管理',
    category: 'high-school',
    styleTag: ['温柔', '清新'],
    ratio: '1:1',
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80',
    preview: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    layers: [],
    tags: ['学习', '笔记', '计划'],
    isPopular: false,
    isNew: true,
    version: 1,
    createdAt: '2024-01-01'
  },
  {
    id: 'friendship-album',
    name: '闺蜜相册',
    description: '记录与闺蜜的美好时光',
    category: 'high-school',
    styleTag: ['可爱', '温柔', '梦幻'],
    ratio: '9:16',
    thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80',
    preview: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80',
    layers: [],
    tags: ['闺蜜', '友情', '相册'],
    isPopular: true,
    isNew: false,
    version: 1,
    createdAt: '2024-01-01'
  },
  
  // 大学生活模板
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
  },
  {
    id: 'cafe-mood',
    name: '咖啡厅小确幸',
    description: '记录咖啡厅的温馨时光',
    category: 'university',
    styleTag: ['温柔', '复古'],
    ratio: '4:5',
    thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
    preview: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    layers: [],
    tags: ['咖啡厅', '小确幸', '生活'],
    isPopular: true,
    isNew: false,
    version: 1,
    createdAt: '2024-01-01'
  },
  {
    id: 'flower-diary',
    name: '花艺日记',
    description: '记录花艺学习和花束制作',
    category: 'university',
    styleTag: ['温柔', '清新'],
    ratio: '3:4',
    thumbnail: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80',
    preview: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80',
    layers: [],
    tags: ['花艺', '花束', '艺术'],
    isPopular: false,
    isNew: true,
    version: 1,
    createdAt: '2024-01-01'
  },
  {
    id: 'study-abroad',
    name: '留学日记',
    description: '记录海外求学的精彩生活',
    category: 'university',
    styleTag: ['清新', '复古'],
    ratio: '9:16',
    thumbnail: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80',
    preview: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
    layers: [],
    tags: ['留学', '海外', '学习'],
    isPopular: false,
    isNew: false,
    version: 1,
    createdAt: '2024-01-01'
  },
  
  // 职场生活模板
  {
    id: 'office-lady',
    name: '职场丽人',
    description: '优雅的职场生活记录',
    category: 'workplace',
    styleTag: ['温柔', '复古'],
    ratio: '4:5',
    thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    preview: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
    layers: [],
    tags: ['职场', '女性', '优雅'],
    isPopular: true,
    isNew: false,
    version: 1,
    createdAt: '2024-01-01'
  },
  {
    id: 'business-travel',
    name: '商务旅行',
    description: '记录出差和商务活动的精彩瞬间',
    category: 'workplace',
    styleTag: ['清新', '复古'],
    ratio: '9:16',
    thumbnail: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80',
    preview: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
    layers: [],
    tags: ['商务', '旅行', '出差'],
    isPopular: false,
    isNew: true,
    version: 1,
    createdAt: '2024-01-01'
  },
  {
    id: 'team-building',
    name: '团建活动',
    description: '记录团队建设的欢乐时光',
    category: 'workplace',
    styleTag: ['可爱', '清新'],
    ratio: '1:1',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80',
    preview: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    layers: [],
    tags: ['团建', '团队', '活动'],
    isPopular: false,
    isNew: false,
    version: 1,
    createdAt: '2024-01-01'
  },
  
  // 生活美学模板
  {
    id: 'morning-routine',
    name: '晨间仪式',
    description: '记录美好的晨间生活仪式',
    category: 'university',
    styleTag: ['温柔', '清新'],
    ratio: '4:5',
    thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
    preview: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    layers: [],
    tags: ['晨间', '仪式', '生活'],
    isPopular: true,
    isNew: false,
    version: 1,
    createdAt: '2024-01-01'
  },
  {
    id: 'self-care',
    name: '自我关爱',
    description: '记录护肤、美妆和自我关爱时光',
    category: 'university',
    styleTag: ['可爱', '温柔', '优雅'],
    ratio: '1:1',
    thumbnail: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
    preview: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
    layers: [],
    tags: ['护肤', '美妆', '关爱'],
    isPopular: true,
    isNew: false,
    version: 1,
    createdAt: '2024-01-01'
  },
  {
    id: 'pet-companion',
    name: '萌宠陪伴',
    description: '记录与宠物相处的温馨时光',
    category: 'university',
    styleTag: ['可爱', '温柔'],
    ratio: '9:16',
    thumbnail: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&q=80',
    preview: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=80',
    layers: [],
    tags: ['宠物', '萌宠', '陪伴'],
    isPopular: false,
    isNew: true,
    version: 1,
    createdAt: '2024-01-01'
  },
  {
    id: 'seasonal-mood',
    name: '四季心情',
    description: '记录不同季节的美好心情',
    category: 'university',
    styleTag: ['清新', '复古'],
    ratio: '3:4',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    layers: [],
    tags: ['四季', '心情', '自然'],
    isPopular: false,
    isNew: false,
    version: 1,
    createdAt: '2024-01-01'
  },
  {
    id: 'art-craft',
    name: '手工艺术',
    description: '记录手工制作和艺术创作',
    category: 'university',
    styleTag: ['可爱', '温柔'],
    ratio: '1:1',
    thumbnail: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&q=80',
    preview: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80',
    layers: [],
    tags: ['手工', '艺术', '创作'],
    isPopular: false,
    isNew: true,
    version: 1,
    createdAt: '2024-01-01'
  },
  {
    id: 'book-review',
    name: '读书笔记',
    description: '记录阅读心得和书籍推荐',
    category: 'university',
    styleTag: ['温柔', '复古', '文艺'],
    ratio: '4:5',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    preview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    layers: [],
    tags: ['读书', '笔记', '心得'],
    isPopular: true,
    isNew: false,
    version: 1,
    createdAt: '2024-01-01'
  },
  {
    id: 'fitness-journey',
    name: '健身日记',
    description: '记录健身运动和健康生活',
    category: 'university',
    styleTag: ['清新', '温柔'],
    ratio: '9:16',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
    preview: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    layers: [],
    tags: ['健身', '运动', '健康'],
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
  gap: 12px;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 14px;
  color: var(--colorNeutralForeground1);
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  min-height: 44px;
}

.filter-option:hover {
  background: var(--pink-light);
}

.filter-option input[type="radio"],
.filter-option input[type="checkbox"] {
  width: 20px;
  height: 20px;
  accent-color: var(--colorBrandBackground);
  flex-shrink: 0;
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
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    position: static;
    margin-bottom: 24px;
  }
  
  .filter-options {
    gap: 16px;
  }
  
  .filter-option {
    padding: 12px 16px;
    min-height: 48px;
    font-size: 16px;
  }
  
  .filter-option input[type="radio"],
  .filter-option input[type="checkbox"] {
    width: 24px;
    height: 24px;
  }
  
  .clear-filters {
    padding: 16px;
    font-size: 16px;
    min-height: 48px;
  }
  
  .templates-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .create-page {
    padding: 12px;
  }
  
  .sidebar {
    padding: 20px;
    margin-bottom: 20px;
  }
  
  .filter-option {
    padding: 16px 20px;
    min-height: 52px;
    font-size: 16px;
  }
  
  .filter-option input[type="radio"],
  .filter-option input[type="checkbox"] {
    width: 26px;
    height: 26px;
  }
  
  .clear-filters {
    padding: 18px;
    font-size: 16px;
    min-height: 52px;
  }
  
  .sidebar h3 {
    font-size: 20px;
    margin-bottom: 24px;
  }
  
  .filter-group h4 {
    font-size: 16px;
    margin-bottom: 16px;
  }
}
</style>
