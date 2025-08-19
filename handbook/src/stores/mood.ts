import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Mood, MoodRecord, MoodId } from '@/types/mood'

export const useMoodStore = defineStore('mood', () => {
  // 状态
  const moods = ref<Mood[]>([])
  const records = ref<MoodRecord[]>([])

  // 计算属性
  const moodsByMonth = computed(() => {
    return (year: number, month: number) => {
      return records.value.filter(record => {
        const recordDate = new Date(record.date)
        return recordDate.getFullYear() === year && recordDate.getMonth() === month
      })
    }
  })

  const moodStats = computed(() => {
    const stats: Record<MoodId, number> = {
      happy: 0,
      neutral: 0,
      calm: 0,
      low: 0,
      sad: 0
    }
    
    records.value.forEach(record => {
      stats[record.mood]++
    })
    
    return stats
  })

  const recentRecords = computed(() => {
    return records.value
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
  })

  // 动作
  const loadMoods = (moodList: Mood[]): void => {
    moods.value = moodList
  }

  const loadRecords = (recordList: MoodRecord[]): void => {
    records.value = recordList
  }

  const addRecord = (record: MoodRecord): void => {
    records.value.push(record)
    // 保存到本地存储
    localStorage.setItem('handbook-mood-records', JSON.stringify(records.value))
  }

  const updateRecord = (id: string, updates: Partial<MoodRecord>): void => {
    const index = records.value.findIndex(record => record.id === id)
    if (index !== -1) {
      records.value[index] = { ...records.value[index], ...updates }
      // 保存到本地存储
      localStorage.setItem('handbook-mood-records', JSON.stringify(records.value))
    }
  }

  const deleteRecord = (id: string): void => {
    const index = records.value.findIndex(record => record.id === id)
    if (index !== -1) {
      records.value.splice(index, 1)
      // 保存到本地存储
      localStorage.setItem('handbook-mood-records', JSON.stringify(records.value))
    }
  }

  const getRecordByDate = (date: string): MoodRecord | undefined => {
    return records.value.find(record => record.date === date)
  }

  const getMoodById = (id: MoodId): Mood | undefined => {
    return moods.value.find(mood => mood.id === id)
  }

  const restoreFromLocal = (): void => {
    const savedRecords = localStorage.getItem('handbook-mood-records')
    if (savedRecords) {
      try {
        const parsed = JSON.parse(savedRecords)
        if (Array.isArray(parsed)) {
          records.value = parsed
        }
      } catch (error) {
        console.warn('Failed to restore mood records from localStorage:', error)
      }
    }
  }

  return {
    moods,
    records,
    moodsByMonth,
    moodStats,
    recentRecords,
    loadMoods,
    loadRecords,
    addRecord,
    updateRecord,
    deleteRecord,
    getRecordByDate,
    getMoodById,
    restoreFromLocal
  }
})
