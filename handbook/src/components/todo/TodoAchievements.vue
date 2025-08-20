<template>
  <div class="achievements-section">
    <div class="section-header">
      <h3>🏆 成就系统</h3>
      <span class="achievement-count">{{ unlockedAchievements.length }}/{{ achievements.length }}</span>
    </div>

    <div class="achievements-grid">
      <div 
        v-for="achievement in achievements" 
        :key="achievement.id" 
        class="achievement-card"
        :class="{ 'unlocked': achievement.isUnlocked, 'locked': !achievement.isUnlocked }"
      >
        <div class="achievement-icon">
          {{ achievement.icon }}
        </div>
        <div class="achievement-content">
          <h4 class="achievement-title">{{ achievement.title }}</h4>
          <p class="achievement-description">{{ achievement.description }}</p>
          <div class="achievement-progress">
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }"
              ></div>
            </div>
            <span class="progress-text">{{ achievement.progress }}/{{ achievement.maxProgress }}</span>
          </div>
          <div v-if="achievement.isUnlocked" class="unlock-info">
            <span class="unlock-date">解锁于 {{ formatDate(achievement.unlockedAt!) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="lockedAchievements.length > 0" class="locked-achievements">
      <h4>🔒 待解锁成就</h4>
      <p class="hint-text">继续完成任务来解锁更多成就！</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTodoStore } from '@/stores/todo'
import type { Achievement } from '@/types/todo'

const todoStore = useTodoStore()

const achievements = computed(() => todoStore.achievements)
const unlockedAchievements = computed(() => todoStore.unlockedAchievements)
const lockedAchievements = computed(() => todoStore.lockedAchievements)

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>

<style scoped>
.achievements-section {
  background: linear-gradient(135deg, #f8f9ff 0%, #e8f4fd 100%);
  border-radius: 16px;
  padding: 24px;
  margin: 20px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.4rem;
  font-weight: 600;
}

.achievement-count {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.achievement-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.achievement-card.unlocked {
  border-color: #4ade80;
  box-shadow: 0 8px 25px rgba(74, 222, 128, 0.15);
  transform: translateY(-2px);
}

.achievement-card.locked {
  border-color: #e5e7eb;
  opacity: 0.7;
  filter: grayscale(0.3);
}

.achievement-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.achievement-icon {
  font-size: 2.5rem;
  min-width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 50%;
  border: 3px solid #e0f2fe;
}

.achievement-card.unlocked .achievement-icon {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border-color: #4ade80;
  animation: achievementUnlock 0.6s ease-out;
}

@keyframes achievementUnlock {
  0% {
    transform: scale(0.8) rotate(-10deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.1) rotate(5deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.achievement-content {
  flex: 1;
  min-width: 0;
}

.achievement-title {
  margin: 0 0 8px 0;
  color: #1f2937;
  font-size: 1.1rem;
  font-weight: 600;
}

.achievement-description {
  margin: 0 0 16px 0;
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.4;
}

.achievement-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4ade80 0%, #22c55e 100%);
  border-radius: 4px;
  transition: width 0.6s ease;
}

.achievement-card.locked .progress-fill {
  background: linear-gradient(90deg, #d1d5db 0%, #9ca3af 100%);
}

.progress-text {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
  min-width: 40px;
  text-align: right;
}

.unlock-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.unlock-date {
  font-size: 0.8rem;
  color: #059669;
  font-weight: 500;
}

.locked-achievements {
  text-align: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  border: 2px dashed #d1d5db;
}

.locked-achievements h4 {
  margin: 0 0 8px 0;
  color: #6b7280;
  font-size: 1rem;
}

.hint-text {
  margin: 0;
  color: #9ca3af;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .achievements-section {
    padding: 16px;
    margin: 16px 0;
  }

  .achievements-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .achievement-card {
    padding: 16px;
    gap: 12px;
  }

  .achievement-icon {
    font-size: 2rem;
    min-width: 50px;
    height: 50px;
  }

  .section-header h3 {
    font-size: 1.2rem;
  }
}
</style>
