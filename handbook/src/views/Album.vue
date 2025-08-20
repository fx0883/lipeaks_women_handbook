<template>
  <div class="album-page">
    <div class="page-header">
      <h1>我的相册</h1>
      <p>查看和管理所有创作的作品</p>
    </div>

    <!-- 搜索和筛选 -->
    <div class="album-controls">
      <div class="search-section">
        <div class="search-input-wrapper">
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="搜索作品名称或描述..."
            class="search-input"
          />
          <button class="search-btn">🔍</button>
        </div>
      </div>
      
      <div class="filter-section">
        <select v-model="selectedCategory" class="filter-select">
          <option value="">全部分类</option>
          <option value="high-school">高中生活</option>
          <option value="university">大学生活</option>
          <option value="workplace">职场生活</option>
        </select>
        
        <select v-model="selectedRatio" class="filter-select">
          <option value="">全部比例</option>
          <option value="1:1">1:1 方形</option>
          <option value="4:5">4:5 竖版</option>
          <option value="9:16">9:16 长版</option>
          <option value="3:4">3:4 横版</option>
        </select>
        
        <select v-model="sortBy" class="filter-select">
          <option value="createdAt">创建时间</option>
          <option value="updatedAt">更新时间</option>
          <option value="name">名称</option>
        </select>
      </div>
    </div>

    <!-- 作品网格 -->
    <div class="album-grid">
      <div 
        v-for="project in filteredProjects" 
        :key="project.id"
        class="project-card"
        @click="viewProject(project)"
      >
        <div class="project-image">
          <img :src="project.thumbnail" :alt="project.name" />
          <div class="project-overlay">
            <div class="project-actions">
              <button class="action-btn edit" @click.stop="editProject(project)">
                ✏️ 编辑
              </button>
              <button class="action-btn export" @click.stop="exportProject(project)">
                📤 导出
              </button>
            </div>
          </div>
        </div>
        
        <div class="project-info">
          <h3>{{ project.name }}</h3>
          <p>{{ project.description }}</p>
          
          <div class="project-meta">
            <span class="project-date">{{ formatDate(project.createdAt) }}</span>
            <span class="project-ratio">{{ project.content.ratio || '4:5' }}</span>
            <span v-if="project.isPublic" class="project-public">公开</span>
          </div>
          
          <div class="project-tags">
            <span 
              v-for="tag in project.tags.slice(0, 3)" 
              :key="tag"
              class="tag"
            >
              {{ tag }}
            </span>
            <span v-if="project.tags.length > 3" class="tag more">
              +{{ project.tags.length - 3 }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredProjects.length === 0" class="empty-state">
      <div class="empty-icon">📸</div>
      <h3>还没有作品</h3>
      <p>开始创作你的第一个手账作品吧</p>
      <router-link to="/create" class="btn primary">
        开始创作
      </router-link>
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="pagination">
      <button 
        class="page-btn"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        上一页
      </button>
      
      <div class="page-numbers">
        <button 
          v-for="page in visiblePages" 
          :key="page"
          class="page-btn"
          :class="{ active: page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </div>
      
      <button 
        class="page-btn"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Project } from '@/types/project'

const router = useRouter()

// 筛选状态
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedRatio = ref('')
const sortBy = ref('createdAt')

// 分页状态
const currentPage = ref(1)
const itemsPerPage = 12

// 模拟项目数据（后续从 store 获取）
const projects: Project[] = [
  {
    id: '1',
    name: '校园日常拼贴',
    description: '记录校园生活的美好瞬间',
    templateId: 'campus-collage',
    thumbnail: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=400&q=80',
    content: {
      title: '校园日常拼贴',
      subtitle: '美好时光',
      images: ['image1.jpg'],
      stickers: ['sticker1.png'],
      filters: ['filter1'],
      text: '校园生活真美好',
      mood: 'happy',
      colors: { primary: '#ff6b9d', secondary: '#ffeef4', text: '#333' }
    },
    tags: ['校园', '日常', '拼贴'],
    isPublic: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: '社团招新海报',
    description: '吸引新成员加入的活力海报',
    templateId: 'club-poster',
    thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
    content: {
      title: '社团招新海报',
      subtitle: '加入我们',
      images: ['image2.jpg'],
      stickers: ['sticker2.png'],
      filters: ['filter2'],
      text: '欢迎加入我们的社团',
      mood: 'excited',
      colors: { primary: '#ff6b9d', secondary: '#ffeef4', text: '#333' }
    },
    tags: ['社团', '招新', '海报'],
    isPublic: true,
    createdAt: '2024-01-14T10:00:00Z',
    updatedAt: '2024-01-14T10:00:00Z'
  },
  {
    id: '3',
    name: 'Citywalk记录',
    description: '记录城市漫步的见闻',
    templateId: 'citywalk',
    thumbnail: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=400&q=80',
    content: {
      title: 'Citywalk记录',
      subtitle: '城市漫步',
      images: ['image3.jpg'],
      stickers: ['sticker3.png'],
      filters: ['filter3'],
      text: '今天在城市里漫步',
      mood: 'calm',
      colors: { primary: '#ff6b9d', secondary: '#ffeef4', text: '#333' }
    },
    tags: ['旅行', '城市', '漫步'],
    isPublic: false,
    createdAt: '2024-01-13T10:00:00Z',
    updatedAt: '2024-01-13T10:00:00Z'
  },
  {
    id: '4',
    name: '宿舍美食日记',
    description: '分享宿舍里的美食记录',
    templateId: 'dorm-food',
    thumbnail: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&q=80',
    content: {
      title: '宿舍美食日记',
      subtitle: '美食记录',
      images: ['image4.jpg'],
      stickers: ['sticker4.png'],
      filters: ['filter4'],
      text: '今天的美食真不错',
      mood: 'happy',
      colors: { primary: '#ff6b9d', secondary: '#ffeef4', text: '#333' }
    },
    tags: ['宿舍', '美食', '日记'],
    isPublic: true,
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z'
  },
  {
    id: '5',
    name: '学习计划表',
    description: '制定本周的学习计划',
    templateId: 'exam-countdown',
    thumbnail: 'https://images.unsplash.com/photo-1553729784-e91953dec042?w=400&q=80',
    content: {
      title: '学习计划表',
      subtitle: '本周计划',
      images: ['image5.jpg'],
      stickers: ['sticker5.png'],
      filters: ['filter5'],
      text: '制定学习计划',
      mood: 'calm',
      colors: { primary: '#ff6b9d', secondary: '#ffeef4', text: '#333' }
    },
    tags: ['学习', '计划', '表格'],
    isPublic: false,
    createdAt: '2024-01-11T10:00:00Z',
    updatedAt: '2024-01-11T10:00:00Z'
  },
  {
    id: '6',
    name: '周末旅行记录',
    description: '记录周末旅行的美好时光',
    templateId: 'citywalk',
    thumbnail: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80',
    content: {
      title: '周末旅行记录',
      subtitle: '美好时光',
      images: ['image6.jpg'],
      stickers: ['sticker6.png'],
      filters: ['filter6'],
      text: '周末旅行真开心',
      mood: 'happy',
      colors: { primary: '#ff6b9d', secondary: '#ffeef4', text: '#333' }
    },
    tags: ['旅行', '周末', '记录'],
    isPublic: true,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z'
  }
]

// 筛选后的项目
const filteredProjects = computed(() => {
  let filtered = projects.filter(project => {
    // 搜索筛选
    if (searchQuery.value && !project.name.toLowerCase().includes(searchQuery.value.toLowerCase()) && 
        !project.description.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return false
    }
    
    // 分类筛选
    if (selectedCategory.value && project.templateId !== selectedCategory.value) {
      return false
    }
    
    // 比例筛选
    if (selectedRatio.value && project.content.ratio !== selectedRatio.value) {
      return false
    }
    
    return true
  })
  
  // 排序
  filtered.sort((a, b) => {
    if (sortBy.value === 'createdAt') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else if (sortBy.value === 'updatedAt') {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    } else if (sortBy.value === 'name') {
      return a.name.localeCompare(b.name)
    }
    return 0
  })
  
  return filtered
})

// 分页计算
const totalPages = computed(() => Math.ceil(filteredProjects.value.length / itemsPerPage))
const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProjects.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// 格式化日期
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric'
  })
}

// 查看项目
const viewProject = (project: Project): void => {
  router.push(`/project/${project.id}`)
}

// 编辑项目
const editProject = (project: Project): void => {
  router.push(`/editor/${project.templateId}`)
}

// 导出项目
const exportProject = (project: Project): void => {
  router.push(`/export?project=${project.id}`)
}

// 分页导航
const goToPage = (page: number): void => {
  currentPage.value = page
}
</script>

<style scoped>
/* 复用原型样式 */
.album-page {
  width: 100%;
  min-height: 100vh;
  padding-top: 104px;
  padding-left: 32px;
  padding-right: 32px;
  padding-bottom: 24px;
  box-sizing: border-box;
}

.page-header {
  text-align: center;
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

.album-controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
}

.search-section {
  display: flex;
  justify-content: center;
}

.search-input-wrapper {
  position: relative;
  max-width: 500px;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 16px 48px 16px 20px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 12px;
  background: var(--colorNeutralBackground1);
  color: var(--colorNeutralForeground1);
  font-size: 16px;
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: var(--colorBrandBackground);
  box-shadow: 0 0 0 3px rgba(255, 107, 157, 0.1);
}

.search-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: var(--colorNeutralForeground2);
}

.filter-section {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.filter-select {
  padding: 12px 16px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 8px;
  background: var(--colorNeutralBackground1);
  color: var(--colorNeutralForeground1);
  font-size: 14px;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
}

.filter-select:focus {
  border-color: var(--colorBrandBackground);
}

.album-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.project-card {
  background: var(--colorNeutralBackground1);
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}

.project-card:hover {
  border-color: var(--pink-medium);
  box-shadow: var(--shadow8);
  transform: translateY(-3px);
}

.project-image {
  position: relative;
  aspect-ratio: 4/5;
  overflow: hidden;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.project-card:hover .project-image img {
  transform: scale(1.05);
}

.project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.project-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.edit {
  background: var(--colorBrandBackground);
  color: var(--colorBrandForeground);
}

.action-btn.edit:hover {
  background: var(--colorBrandBackgroundHover);
  transform: translateY(-1px);
}

.action-btn.export {
  background: var(--colorNeutralBackground1);
  color: var(--colorNeutralForeground1);
  border: 1px solid var(--colorNeutralStroke1);
}

.action-btn.export:hover {
  background: var(--pink-light);
  border-color: var(--colorBrandBackground);
  transform: translateY(-1px);
}

.project-info {
  padding: 20px;
}

.project-info h3 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.project-info p {
  margin: 0 0 16px;
  color: var(--colorNeutralForeground2);
  font-size: 14px;
  line-height: 1.5;
}

.project-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 12px;
}

.project-date {
  color: var(--colorNeutralForeground2);
}

.project-ratio {
  background: var(--pink-light);
  color: var(--pink-dark);
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.project-public {
  background: var(--colorBrandBackground);
  color: var(--colorBrandForeground);
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  background: var(--pink-light);
  color: var(--pink-dark);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.tag.more {
  background: var(--colorNeutralStroke1);
  color: var(--colorNeutralForeground2);
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

/* 分页 */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
}

.page-numbers {
  display: flex;
  gap: 8px;
}

.page-btn {
  padding: 8px 12px;
  border: 1px solid var(--colorNeutralStroke1);
  background: var(--colorNeutralBackground1);
  color: var(--colorNeutralForeground1);
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 40px;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--colorBrandBackground);
  background: var(--pink-light);
}

.page-btn.active {
  background: var(--colorBrandBackground);
  color: var(--colorBrandForeground);
  border-color: var(--colorBrandBackground);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .album-page {
    padding: 16px;
  }
  
  .album-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-section {
    flex-direction: column;
    align-items: center;
  }
  
  .filter-select {
    width: 200px;
  }
}
</style>
