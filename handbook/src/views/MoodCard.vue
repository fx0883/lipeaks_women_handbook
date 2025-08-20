<template>
  <div class="moodcard-page">
    <div class="card-wrapper">
      <div class="mood-card" :style="{ background: gradientBackground }">
        <div class="emoji">{{ emoji }}</div>
        <div class="quote">{{ quote || '今天也值得被温柔以待 ✿' }}</div>
        <div class="date">{{ dateLabel }}</div>
      </div>

      <div class="actions">
        <router-link to="/mood" class="btn">返回打卡</router-link>
        <router-link to="/album" class="btn ghost">去相册</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const emoji = (route.query.emoji as string) || '😀'
const colorA = (route.query.c1 as string) || '#8fd3c8'
const colorB = (route.query.c2 as string) || '#f7c3d3'
const quote = (route.query.quote as string) || ''
const dateLabel = (route.query.date as string) || new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })

const gradientBackground = computed(() => `linear-gradient(135deg, ${colorA}, ${colorB})`)
</script>

<style scoped>
.moodcard-page { 
  width: 100%; 
  min-height: 100vh;
  padding-top: 104px;
  padding-left: 32px;
  padding-right: 32px;
  padding-bottom: 24px;
  display: flex; 
  justify-content: center;
  box-sizing: border-box;
}
.card-wrapper { width: 100%; max-width: 360px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
.mood-card { width: 100%; border-radius: 16px; padding: 24px; text-align: center; color: white; box-shadow: var(--shadow8); }
.emoji { font-size: 48px; margin-bottom: 16px; }
.quote { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
.date { font-size: 14px; opacity: 0.85; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 24px; border-radius: 12px; border: 1px solid var(--colorNeutralStroke1); background: var(--colorNeutralBackground1); text-decoration: none; color: var(--colorNeutralForeground1); font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; min-height: 44px; }
.btn.ghost { background: transparent; border-color: transparent; }
.actions { display: flex; gap: 12px; }
</style>


