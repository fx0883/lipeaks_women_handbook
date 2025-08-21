<template>
  <div v-if="showCelebration" class="celebration-overlay">
    <div class="celebration-container">
      <!-- Main Celebration Content -->
      <div class="celebration-content">
        <div class="celebration-icon">🎉</div>
        <h2 class="celebration-title">任务完成！</h2>
        <p class="celebration-subtitle">{{ lastCompletedTodo?.title }}</p>
        
        <!-- Achievement Unlocked -->
        <div v-if="newAchievements.length > 0" class="achievement-unlocked">
          <div class="achievement-icon">🏆</div>
          <div class="achievement-text">
            <h3>解锁新成就！</h3>
            <p>{{ newAchievements[0].title }}</p>
          </div>
        </div>

        <!-- Mood Selection -->
        <div class="mood-selection">
          <h4>记录一下完成这个任务的心情</h4>
          <div class="mood-options">
            <button
              v-for="mood in availableMoods"
              :key="mood"
              class="mood-option"
              :class="{ 'selected': selectedMood === mood }"
              @click="selectedMood = mood"
            >
              <span class="mood-emoji">{{ mood }}</span>
              <span class="mood-label">{{ getMoodLabel(mood) }}</span>
            </button>
          </div>
          
          <div class="mood-note">
            <textarea
              v-model="moodNote"
              placeholder="记录一下完成这个任务的心情感受..."
              rows="3"
              class="note-input"
            ></textarea>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="celebration-actions">
          <button 
            class="btn primary"
            @click="saveMoodAndClose"
            :disabled="!selectedMood"
          >
            💾 保存心情
          </button>
          <button 
            class="btn secondary"
            @click="closeCelebration"
          >
            跳过
          </button>
        </div>
      </div>

      <!-- Floating Particles -->
      <div class="particles">
        <div 
          v-for="i in 20" 
          :key="i"
          class="particle"
          :style="getParticleStyle(i)"
        >
          {{ getParticleEmoji(i) }}
        </div>
      </div>

      <!-- Confetti -->
      <div class="confetti">
        <div 
          v-for="i in 50" 
          :key="i"
          class="confetti-piece"
          :style="getConfettiStyle(i)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTodoStore } from '@/stores/todo'
import type { TodoItem, Achievement, MoodType } from '@/types/todo'
import { MoodType as MoodTypeEnum } from '@/types/todo'

const todoStore = useTodoStore()

const selectedMood = ref<MoodType | null>(null)
const moodNote = ref('')

const showCelebration = computed(() => todoStore.showCelebration)
const lastCompletedTodo = computed(() => todoStore.lastCompletedTodo)
const newAchievements = computed<Achievement[]>(() => {
  // This would typically check for newly unlocked achievements
  return []
})

const availableMoods = [
  MoodTypeEnum.VERY_HAPPY,
  MoodTypeEnum.HAPPY,
  MoodTypeEnum.EXCITED,
  MoodTypeEnum.CALM,
  MoodTypeEnum.NEUTRAL,
  MoodTypeEnum.TIRED,
  MoodTypeEnum.STRESSED,
  MoodTypeEnum.SAD,
  MoodTypeEnum.ANGRY
]

const getMoodLabel = (mood: MoodType) => {
  const labels: Record<MoodType, string> = {
    [MoodTypeEnum.VERY_HAPPY]: '非常开心',
    [MoodTypeEnum.HAPPY]: '开心',
    [MoodTypeEnum.EXCITED]: '兴奋',
    [MoodTypeEnum.CALM]: '平静',
    [MoodTypeEnum.NEUTRAL]: '一般',
    [MoodTypeEnum.TIRED]: '疲惫',
    [MoodTypeEnum.STRESSED]: '压力大',
    [MoodTypeEnum.SAD]: '难过',
    [MoodTypeEnum.ANGRY]: '生气'
  }
  return labels[mood]
}

const getParticleStyle = (index: number) => {
  const angle = (index / 20) * 2 * Math.PI
  const radius = 200 + Math.random() * 100
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius
  
  return {
    '--x': `${x}px`,
    '--y': `${y}px`,
    '--delay': `${index * 0.1}s`,
    '--duration': `${2 + Math.random() * 2}s`
  }
}

const getParticleEmoji = (index: number) => {
  const emojis = ['✨', '🌟', '💫', '⭐', '🎊', '🎈', '🎉', '🎊', '💎', '🔥']
  return emojis[index % emojis.length]
}

const getConfettiStyle = (index: number) => {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3']
  const color = colors[index % colors.length]
  
  return {
    '--x': `${Math.random() * 100}vw`,
    '--y': `${Math.random() * 100}vh`,
    '--color': color,
    '--delay': `${Math.random() * 2}s`,
    '--duration': `${3 + Math.random() * 2}s`
  }
}

const saveMoodAndClose = () => {
  if (selectedMood.value && lastCompletedTodo.value) {
    // Save the mood for the completed todo
    todoStore.completeTodo(lastCompletedTodo.value.id, selectedMood.value, moodNote.value)
    
    // Reset form
    selectedMood.value = null
    moodNote.value = ''
    
    // Close celebration
    closeCelebration()
  }
}

const closeCelebration = () => {
  // This would typically close the celebration modal
  console.log('关闭庆祝界面')
}

// Auto-close after 10 seconds
let autoCloseTimer: number | null = null

onMounted(() => {
  if (showCelebration.value) {
    autoCloseTimer = setTimeout(() => {
      closeCelebration()
    }, 10000)
  }
})

onUnmounted(() => {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
  }
})
</script>

<style scoped>
.celebration-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.5s ease-out;
}

.celebration-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.celebration-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  padding: 40px;
  text-align: center;
  color: white;
  max-width: 500px;
  width: 90%;
  position: relative;
  z-index: 10;
  animation: slideUp 0.6s ease-out;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.celebration-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  animation: bounce 1s ease-in-out infinite;
}

.celebration-title {
  margin: 0 0 12px 0;
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.celebration-subtitle {
  margin: 0 0 32px 0;
  font-size: 1.2rem;
  opacity: 0.9;
  line-height: 1.4;
}

.achievement-unlocked {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 16px;
  backdrop-filter: blur(10px);
  animation: achievementUnlock 0.8s ease-out;
}

.achievement-icon {
  font-size: 2.5rem;
  animation: achievementGlow 2s ease-in-out infinite;
}

.achievement-text h3 {
  margin: 0 0 8px 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.achievement-text p {
  margin: 0;
  font-size: 1rem;
  opacity: 0.9;
}

.mood-selection {
  margin-bottom: 32px;
}

.mood-selection h4 {
  margin: 0 0 20px 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.mood-options {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.mood-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.mood-option:hover {
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.mood-option.selected {
  border-color: #ffd700;
  background: rgba(255, 215, 0, 0.2);
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.3);
}

.mood-emoji {
  font-size: 1.5rem;
}

.mood-label {
  font-size: 0.7rem;
  text-align: center;
  line-height: 1.2;
}

.mood-note {
  margin-bottom: 24px;
}

.note-input {
  width: 100%;
  padding: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-family: inherit;
  font-size: 0.9rem;
  resize: vertical;
  transition: border-color 0.2s ease;
  backdrop-filter: blur(10px);
}

.note-input:focus {
  outline: none;
  border-color: #ffd700;
}

.note-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.celebration-actions {
  display: flex;
  gap: 16px;
}

.celebration-actions .btn {
  flex: 1;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn.primary {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #1f2937;
}

.btn.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
}

.btn.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn.secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn.secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

/* Particles */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  animation: particleFloat var(--duration) ease-out var(--delay) infinite;
}

@keyframes particleFloat {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(1);
    opacity: 0;
  }
}

/* Confetti */
.confetti {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.confetti-piece {
  position: absolute;
  width: 8px;
  height: 16px;
  background: var(--color);
  animation: confettiFall var(--duration) ease-in var(--delay) infinite;
}

@keyframes confettiFall {
  0% {
    transform: translate(var(--x), calc(var(--y) - 100vh)) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translate(var(--x), var(--y)) rotate(720deg);
    opacity: 0;
  }
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes achievementUnlock {
  0% {
    opacity: 0;
    transform: scale(0.8) rotate(-10deg);
  }
  50% {
    transform: scale(1.1) rotate(5deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

@keyframes achievementGlow {
  0%, 100% {
    filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5));
  }
  50% {
    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .celebration-content {
    padding: 24px;
    margin: 20px;
  }

  .celebration-icon {
    font-size: 3rem;
  }

  .celebration-title {
    font-size: 2rem;
  }

  .celebration-subtitle {
    font-size: 1rem;
  }

  .mood-options {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .mood-option {
    padding: 12px 6px;
  }

  .mood-emoji {
    font-size: 1.2rem;
  }

  .mood-label {
    font-size: 0.6rem;
  }

  .celebration-actions {
    flex-direction: column;
  }

  .achievement-unlocked {
    flex-direction: column;
    text-align: center;
  }
}
</style>
