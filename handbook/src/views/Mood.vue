<template>
  <div class="mood-page">
    <div class="main-layout">
      <!-- 侧边栏（粘性） -->
      <aside class="sidebar">
        <h3>快速操作</h3>
        <nav class="sidebar-nav">
          <router-link to="/mood-calendar">📅 查看日历</router-link>
          <router-link to="/mood-card">🎨 生成卡片</router-link>
          <router-link to="/album">📸 我的相册</router-link>
        </nav>

        <h3>今日统计</h3>
        <div class="stats">
          <div style="margin-bottom: 16px;">
            <div style="font-size: 12px; color: var(--sub); margin-bottom: 4px;">连续打卡</div>
            <div style="font-size: 24px; font-weight: 600; color: var(--primary);">7天</div>
          </div>
          <div>
            <div style="font-size: 12px; color: var(--sub); margin-bottom: 4px;">本月打卡</div>
            <div style="font-size: 24px; font-weight: 600; color: var(--primary);">15天</div>
          </div>
        </div>

        <h3>情绪趋势</h3>
        <div class="trend-mini">
          <div class="bar" style="height:60%"></div>
          <div class="bar" style="height:80%"></div>
          <div class="bar" style="height:40%"></div>
          <div class="bar" style="height:90%"></div>
          <div class="bar" style="height:70%"></div>
          <div class="bar" style="height:85%"></div>
          <div class="bar" style="height:55%"></div>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="content">
        <div class="page-header">
          <h1>情绪打卡</h1>
          <p class="sub">选择表情 + 色卡 + 一句话（可选）</p>
        </div>

        <!-- 1. 今天的心情 -->
        <div class="card">
          <h2>1. 今天的心情</h2>
          <div class="mood-selector">
            <button 
              v-for="mood in moodsOrdered" 
              :key="mood.id"
              class="mood-btn"
              :class="{ selected: selectedMood === mood.id }"
              @click="selectMood(mood.id)"
            >
              {{ mood.emoji }}
            </button>
          </div>
        </div>

        <!-- 2. 选择色卡 -->
        <div class="card">
          <h2>2. 选择色卡</h2>
          <div class="color-selector">
            <div 
              v-for="c in colorOptions" 
              :key="c"
              class="color-btn"
              :class="{ selected: selectedColor === c }"
              :style="{ background: c }"
              @click="selectColor(c)"
            ></div>
          </div>
        </div>

        <!-- 3. 一句鼓励 -->
        <div class="card">
          <h2>3. 一句鼓励（可换）</h2>
          <input class="input" v-model="quote" :placeholder="defaultQuote" />
          <div class="actions" style="margin-top: 12px;">
            <button class="btn ghost" style="font-size:12px" @click="changeQuote">换一句</button>
            <button class="btn ghost" style="font-size:12px" @click="randomQuote">随机推荐</button>
          </div>
        </div>

        <!-- 预览效果 -->
        <div class="card">
          <h2>预览效果</h2>
          <div class="preview-card">
            <div class="preview-inner" :style="{ background: gradientBackground }">
              <div class="preview-emoji">{{ currentEmoji }}</div>
              <div class="preview-quote">{{ quote || defaultQuote }}</div>
              <div class="preview-date">{{ dateLabel }}</div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- 底部工具栏 -->
    <div class="toolbar">
      <div class="actions">
        <router-link to="/mood-calendar" class="btn">查看日历</router-link>
        <button class="btn ghost" @click="saveDraft">保存草稿</button>
      </div>
      <button class="btn primary" @click="saveAndGenerate">保存并生成卡片</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { MoodId } from '@/types/mood'

const router = useRouter()

// 情绪集合（顺序与原型一致：😀、🙂、😐、🙁、😢）
const moodsOrdered: Array<{ id: MoodId; name: string; emoji: string }> = [
  { id: 'happy', name: '开心', emoji: '😀' },
  { id: 'calm', name: '平静', emoji: '🙂' },
  { id: 'neutral', name: '一般', emoji: '😐' },
  { id: 'low', name: '低落', emoji: '🙁' },
  { id: 'sad', name: '难过', emoji: '😢' }
]

// 色卡（8色，与原型一致）
const colorOptions = ['#8fd3c8', '#f7c3d3', '#ffe79a', '#bcd9ff', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4']

// 状态
const selectedMood = ref<MoodId>('happy')
const selectedColor = ref<string>('#8fd3c8')
const defaultQuote = '今天也值得被温柔以待 ✿'
const quote = ref<string>('')

// 励志文案池
const quotesPool = [
  '今天也值得被温柔以待 ✿',
  '保持热爱，奔赴山海',
  '慢一点也没关系',
  '把自己照顾好',
  '给自己一个拥抱',
  '心怀浪漫，追逐星光'
]
let quoteIndex = 0

// 日期
const dateLabel = computed(() => new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }))

// 选择
function selectMood(moodId: MoodId) { selectedMood.value = moodId }
function selectColor(c: string) { selectedColor.value = c }

// 文案
function changeQuote() { quoteIndex = (quoteIndex + 1) % quotesPool.length; quote.value = quotesPool[quoteIndex] }
function randomQuote() { quote.value = quotesPool[Math.floor(Math.random() * quotesPool.length)] }

// 预览所需
const currentEmoji = computed(() => moodsOrdered.find(m => m.id === selectedMood.value)?.emoji || '😀')
const gradientPairMap: Record<string, [string, string]> = {
  '#8fd3c8': ['#8fd3c8', '#f7c3d3'],
  '#f7c3d3': ['#f7c3d3', '#8fd3c8'],
  '#ffe79a': ['#ffe79a', '#bcd9ff'],
  '#bcd9ff': ['#bcd9ff', '#ffe79a'],
  '#ff6b6b': ['#ff6b6b', '#ffe79a'],
  '#4ecdc4': ['#4ecdc4', '#45b7d1'],
  '#45b7d1': ['#45b7d1', '#4ecdc4'],
  '#96ceb4': ['#96ceb4', '#bcd9ff']
}
const gradientBackground = computed(() => {
  const pair = gradientPairMap[selectedColor.value] || ['#8fd3c8', '#f7c3d3']
  return `linear-gradient(135deg, ${pair[0]}, ${pair[1]})`
})

// 保存草稿 & 生成卡片
function saveDraft() {
  try {
    const data = { mood: selectedMood.value, color: selectedColor.value, quote: quote.value || defaultQuote, date: dateLabel.value }
    localStorage.setItem('moodDraft', JSON.stringify(data))
    console.log('草稿已保存', data)
  } catch {}
}
function saveAndGenerate() {
  const pair = gradientPairMap[selectedColor.value] || ['#8fd3c8', '#f7c3d3']
  router.push({
    path: '/mood-card',
    query: { emoji: currentEmoji.value, c1: pair[0], c2: pair[1], quote: quote.value || defaultQuote, date: dateLabel.value }
  })
}
</script>

<style scoped>
.mood-page { width: 100%; padding: 24px 32px; }
.main-layout { display: flex; gap: 24px; }

/* 侧边栏 */
.sidebar { width: 280px; flex-shrink: 0; background: var(--colorNeutralBackground1); border: 1px solid var(--colorNeutralStroke1); border-radius: var(--borderRadiusXLarge); padding: 24px; box-shadow: var(--shadow4); position: sticky; top: 88px; height: fit-content; }
.sidebar h3 { margin: 0 0 16px; font-size: 16px; font-weight: 600; color: var(--colorNeutralForeground1); }
.sidebar-nav { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.sidebar-nav a { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 12px; color: var(--colorNeutralForeground2); text-decoration: none; border: 1px solid transparent; }
.sidebar-nav a:hover { background: var(--pink-light); color: var(--pink-dark); border-color: var(--pink-medium); }
.trend-mini { height: 120px; background: linear-gradient(135deg, #f8fafc, #eef2f7); border-radius: 12px; display: flex; align-items: end; justify-content: space-around; padding: 16px; }
.trend-mini .bar { width: 8px; background: var(--primary); border-radius: 4px; }

/* 主区 */
.content { flex: 1; min-width: 0; }
.page-header { margin-bottom: 32px; }
.page-header h1 { margin: 0 0 8px; font-size: 32px; font-weight: 700; color: var(--colorNeutralForeground1); }
.page-header .sub { margin: 0; color: var(--colorNeutralForeground2); font-size: 16px; }

.card { background: var(--colorNeutralBackground1); border: 1px solid var(--colorNeutralStroke1); border-radius: 20px; padding: 24px; box-shadow: var(--shadow4); transition: all 0.2s ease; margin-bottom: 24px; }
.card:hover { box-shadow: var(--shadow8); border-color: var(--pink-medium); transform: translateY(-2px); }
.card h2 { margin: 0 0 16px; font-size: 18px; font-weight: 600; color: var(--colorNeutralForeground1); }

.mood-selector { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
.mood-btn { aspect-ratio: 1/1; border-radius: 12px; border: 2px solid transparent; background: var(--pink-light); font-size: 24px; cursor: pointer; transition: all 0.15s ease; }
.mood-btn:hover { background: var(--pink-medium); border-color: var(--pink-dark); transform: scale(1.05); }
.mood-btn.selected { background: var(--pink-dark); border-color: var(--pink-dark); color: var(--colorBrandForeground); transform: scale(1.1); }

.color-selector { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.color-btn { aspect-ratio: 1/1; border-radius: 12px; border: 2px solid transparent; cursor: pointer; transition: all 0.15s ease; }
.color-btn:hover { transform: scale(1.05); }
.color-btn.selected { border-color: var(--colorNeutralForeground1); }

.input { width: 100%; padding: 12px; border: 1px solid var(--colorNeutralStroke1); border-radius: 12px; background: var(--colorNeutralBackground1); font-size: 14px; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 24px; border-radius: 12px; border: 1px solid var(--colorNeutralStroke1); background: var(--colorNeutralBackground1); text-decoration: none; color: var(--colorNeutralForeground1); font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; min-height: 44px; }
.btn.primary { background: var(--colorBrandBackground); color: var(--colorBrandForeground); border-color: var(--colorBrandBackground); }
.btn.ghost { background: transparent; border-color: transparent; }

.preview-card { max-width: 300px; margin: 0 auto; }
.preview-inner { border-radius: 16px; padding: 24px; text-align: center; color: white; box-shadow: var(--shadow8); }
.preview-emoji { font-size: 48px; margin-bottom: 16px; }
.preview-quote { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
.preview-date { font-size: 14px; opacity: 0.85; }

/* 工具栏 */
.toolbar { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: var(--colorNeutralBackground1); border: 1px solid var(--colorNeutralStroke1); border-radius: 20px; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; box-shadow: var(--shadow16); z-index: 1000; min-width: 400px; }
.toolbar .actions { display: flex; gap: 8px; }

/* 响应式 */
@media (max-width: 1024px) {
  .main-layout { flex-direction: column; }
  .sidebar { position: static; width: 100%; }
  .toolbar { position: static; transform: none; margin-top: 12px; min-width: 0; }
}
@media (max-width: 768px) {
  .mood-page { padding: 16px; }
  .mood-selector { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 480px) {
  .mood-selector { grid-template-columns: repeat(3, 1fr); }
}
</style>
