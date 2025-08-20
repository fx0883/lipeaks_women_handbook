import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  TodoItem,
  TodoFilters,
  TodoStats,
  CreateTodoData,
  UpdateTodoData
} from '@/types/todo'
import {
  TodoCategory,
  TodoPriority,
  TodoStatus,
  MoodType
} from '@/types/todo'
import type {
  Achievement,
  MoodRecord,
  TaskSuggestion,
  SocialShare
} from '@/types/todo'
import mockData from '@/data/todoMockData.json'

const mockTodos: TodoItem[] = mockData.todos.map(todo => ({
  ...todo,
  category: todo.category as TodoCategory,
  priority: todo.priority as TodoPriority,
  status: todo.status as TodoStatus,
  mood: todo.mood ? (todo.mood as MoodType) : undefined,
  dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
  completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
  createdAt: new Date(todo.createdAt),
  updatedAt: new Date(todo.updatedAt)
}))

const mockAchievements: Achievement[] = mockData.achievements.map(achievement => ({
  ...achievement,
  type: achievement.type as any, // Type casting for AchievementType
  unlockedAt: achievement.unlockedAt ? new Date(achievement.unlockedAt) : undefined
}))

const mockMoodRecords: MoodRecord[] = mockData.moodRecords.map(record => ({
  ...record,
  mood: record.mood as MoodType, // Type casting for MoodType
  timestamp: new Date(record.timestamp)
}))

const mockTaskSuggestions: TaskSuggestion[] = mockData.taskSuggestions.map(suggestion => ({
  ...suggestion,
  category: suggestion.category as TodoCategory, // Type casting for TodoCategory
  priority: suggestion.priority as TodoPriority // Type casting for TodoPriority
}))

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<TodoItem[]>([])
  const filters = ref<TodoFilters>({
    search: '',
    category: undefined,
    priority: undefined,
    status: undefined,
    tags: [],
    dueDateRange: undefined
  })
  const isLoading = ref(false)
  const selectedTodos = ref<string[]>([])

  // New emotional features state
  const achievements = ref<Achievement[]>([])
  const moodRecords = ref<MoodRecord[]>([])
  const taskSuggestions = ref<TaskSuggestion[]>([])
  const socialShares = ref<SocialShare[]>([])
  const showCelebration = ref(false)
  const lastCompletedTodo = ref<TodoItem | null>(null)

  const filteredTodos = computed(() => {
    let filtered = todos.value

    if (filters.value.search) {
      const searchLower = filters.value.search.toLowerCase()
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(searchLower) ||
        todo.description?.toLowerCase().includes(searchLower) ||
        todo.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    if (filters.value.category) {
      filtered = filtered.filter(todo => todo.category === filters.value.category)
    }

    if (filters.value.priority) {
      filtered = filtered.filter(todo => todo.priority === filters.value.priority)
    }

    if (filters.value.status) {
      filtered = filtered.filter(todo => todo.status === filters.value.status)
    }

    if (filters.value.tags && filters.value.tags.length > 0) {
      filtered = filtered.filter(todo =>
        filters.value.tags!.some(tag => todo.tags.includes(tag))
      )
    }

    if (filters.value.dueDateRange) {
      const { start, end } = filters.value.dueDateRange
      if (start) {
        filtered = filtered.filter(todo => 
          todo.dueDate && todo.dueDate >= start
        )
      }
      if (end) {
        filtered = filtered.filter(todo => 
          todo.dueDate && todo.dueDate <= end
        )
      }
    }

    return filtered
  })

  const stats = computed((): TodoStats => {
    const total = todos.value.length
    const completed = todos.value.filter(todo => todo.status === TodoStatus.COMPLETED).length
    const inProgress = todos.value.filter(todo => todo.status === TodoStatus.IN_PROGRESS).length
    const pending = todos.value.filter(todo => todo.status === TodoStatus.TODO).length
    const highPriority = todos.value.filter(todo => todo.priority === TodoPriority.HIGH).length
    const mediumPriority = todos.value.filter(todo => todo.priority === TodoPriority.MEDIUM).length
    const lowPriority = todos.value.filter(todo => todo.priority === TodoPriority.LOW).length
    const overdue = todos.value.filter(todo => 
      todo.dueDate && todo.dueDate < new Date() && todo.status !== TodoStatus.COMPLETED
    ).length
    const dueToday = todos.value.filter(todo => 
      todo.dueDate && isSameDay(todo.dueDate, new Date())
    ).length
    const dueThisWeek = todos.value.filter(todo => 
      todo.dueDate && isThisWeek(todo.dueDate)
    ).length

    const categoryStats: Record<string, number> = {}
    const tagStats: Record<string, number> = {}
    const moodStats: Record<MoodType, number> = {
      [MoodType.VERY_HAPPY]: 0,
      [MoodType.HAPPY]: 0,
      [MoodType.EXCITED]: 0,
      [MoodType.CALM]: 0,
      [MoodType.NEUTRAL]: 0,
      [MoodType.TIRED]: 0,
      [MoodType.STRESSED]: 0,
      [MoodType.SAD]: 0,
      [MoodType.ANGRY]: 0
    }

    todos.value.forEach(todo => {
      categoryStats[todo.category] = (categoryStats[todo.category] || 0) + 1
      todo.tags.forEach(tag => {
        tagStats[tag] = (tagStats[tag] || 0) + 1
      })
      if (todo.mood) {
        moodStats[todo.mood]++
      }
    })

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    // Calculate streaks
    const currentStreak = calculateCurrentStreak()
    const longestStreak = calculateLongestStreak()

    // Calculate weekly and monthly progress
    const weeklyProgress = calculateWeeklyProgress()
    const monthlyProgress = calculateMonthlyProgress()

    return {
      total,
      completed,
      inProgress,
      pending,
      highPriority,
      mediumPriority,
      lowPriority,
      overdue,
      dueToday,
      dueThisWeek,
      categoryStats,
      tagStats,
      completionRate,
      moodStats,
      achievementCount: achievements.value.filter(a => a.isUnlocked).length,
      currentStreak,
      longestStreak,
      weeklyProgress,
      monthlyProgress
    }
  })

  const allTags = computed(() => {
    const tagSet = new Set<string>()
    todos.value.forEach(todo => {
      todo.tags.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  })

  const unlockedAchievements = computed(() => 
    achievements.value.filter(a => a.isUnlocked)
  )

  const lockedAchievements = computed(() => 
    achievements.value.filter(a => !a.isUnlocked)
  )

  const recentMoodRecords = computed(() => 
    moodRecords.value
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10)
  )

  const personalizedSuggestions = computed(() => 
    taskSuggestions.value
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5)
  )

  const initializeTodos = () => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      try {
        todos.value = JSON.parse(savedTodos).map((todo: any) => ({
          ...todo,
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
          completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt)
        }))
      } catch (error) {
        console.error('Failed to parse saved todos:', error)
        todos.value = [...mockTodos]
      }
    } else {
      todos.value = [...mockTodos]
    }

    // Initialize achievements
    const savedAchievements = localStorage.getItem('achievements')
    if (savedAchievements) {
      try {
        achievements.value = JSON.parse(savedAchievements).map((achievement: any) => ({
          ...achievement,
          unlockedAt: achievement.unlockedAt ? new Date(achievement.unlockedAt) : undefined
        }))
      } catch (error) {
        console.error('Failed to parse saved achievements:', error)
        achievements.value = [...mockAchievements]
      }
    } else {
      achievements.value = [...mockAchievements]
    }

    // Initialize mood records
    const savedMoodRecords = localStorage.getItem('moodRecords')
    if (savedMoodRecords) {
      try {
        moodRecords.value = JSON.parse(savedMoodRecords).map((record: any) => ({
          ...record,
          timestamp: new Date(record.timestamp)
        }))
      } catch (error) {
        console.error('Failed to parse saved mood records:', error)
        moodRecords.value = [...mockMoodRecords]
      }
    } else {
      moodRecords.value = [...mockMoodRecords]
    }

    // Initialize task suggestions
    taskSuggestions.value = [...mockTaskSuggestions]

    // Initialize social shares
    const savedSocialShares = localStorage.getItem('socialShares')
    if (savedSocialShares) {
      try {
        socialShares.value = JSON.parse(savedSocialShares).map((share: any) => ({
          ...share,
          sharedAt: new Date(share.sharedAt)
        }))
      } catch (error) {
        console.error('Failed to parse saved social shares:', error)
        socialShares.value = []
      }
    }
  }

  const saveTodos = () => {
    localStorage.setItem('todos', JSON.stringify(todos.value))
    localStorage.setItem('achievements', JSON.stringify(achievements.value))
    localStorage.setItem('moodRecords', JSON.stringify(moodRecords.value))
    localStorage.setItem('socialShares', JSON.stringify(socialShares.value))
  }

  const addTodo = (todoData: CreateTodoData) => {
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      title: todoData.title,
      description: todoData.description || '',
      category: todoData.category,
      priority: todoData.priority,
      status: todoData.status || TodoStatus.TODO,
      dueDate: todoData.dueDate,
      completedAt: undefined,
      mood: undefined,
      tags: todoData.tags || [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    todos.value.push(newTodo)
    saveTodos()
    checkAchievements()
    return newTodo
  }

  const updateTodo = (id: string, updates: UpdateTodoData) => {
    const index = todos.value.findIndex(todo => todo.id === id)
    if (index !== -1) {
      const updatedTodo = { ...todos.value[index], ...updates, updatedAt: new Date() }
      todos.value[index] = updatedTodo
      saveTodos()
      checkAchievements()
      return updatedTodo
    }
    return null
  }

  const deleteTodo = (id: string) => {
    const index = todos.value.findIndex(todo => todo.id === id)
    if (index !== -1) {
      todos.value.splice(index, 1)
      saveTodos()
      return true
    }
    return false
  }

  const completeTodo = (id: string, mood: MoodType, note?: string) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      const completedAt = new Date()
      
      // Update todo
      updateTodo(id, {
        status: TodoStatus.COMPLETED,
        completedAt,
        mood
      })

      // Add mood record
      const moodRecord: MoodRecord = {
        id: Date.now().toString(),
        todoId: id,
        mood,
        note,
        timestamp: completedAt
      }
      moodRecords.value.push(moodRecord)

      // Set celebration state
      lastCompletedTodo.value = todo
      showCelebration.value = true
      setTimeout(() => {
        showCelebration.value = false
      }, 3000)

      // Check achievements
      checkAchievements()
      
      saveTodos()
      return true
    }
    return false
  }

  const changeStatus = (id: string, status: TodoStatus) => {
    const updates: UpdateTodoData = { status }
    
    if (status === TodoStatus.COMPLETED) {
      updates.completedAt = new Date()
    } else {
      updates.completedAt = undefined
      updates.mood = undefined
    }

    return updateTodo(id, updates)
  }

  const setFilters = (newFilters: Partial<TodoFilters>) => {
    Object.assign(filters.value, newFilters)
  }

  const clearFilters = () => {
    filters.value = {
      search: '',
      category: undefined,
      priority: undefined,
      status: undefined,
      tags: [],
      dueDateRange: undefined
    }
  }

  // Bulk selection methods
  const toggleTodoSelection = (id: string) => {
    const index = selectedTodos.value.indexOf(id)
    if (index > -1) {
      selectedTodos.value.splice(index, 1)
    } else {
      selectedTodos.value.push(id)
    }
  }

  const selectAllTodos = () => {
    selectedTodos.value = filteredTodos.value.map(todo => todo.id)
  }

  const clearSelection = () => {
    selectedTodos.value = []
  }

  // Bulk operation methods
  const bulkDelete = (ids: string[]) => {
    ids.forEach(id => deleteTodo(id))
    selectedTodos.value = []
  }

  const bulkChangeStatus = (ids: string[], status: TodoStatus) => {
    ids.forEach(id => changeStatus(id, status))
    selectedTodos.value = []
  }

  const bulkChangePriority = (ids: string[], priority: TodoPriority) => {
    ids.forEach(id => updateTodo(id, { priority }))
    selectedTodos.value = []
  }

  const bulkAddTags = (ids: string[], tags: string[]) => {
    ids.forEach(id => {
      const todo = todos.value.find(t => t.id === id)
      if (todo) {
        const newTags = [...new Set([...todo.tags, ...tags])]
        updateTodo(id, { tags: newTags })
      }
    })
    selectedTodos.value = []
  }

  // Query methods
  const getTodoById = (id: string) => {
    return todos.value.find(todo => todo.id === id)
  }

  const getTodosByCategory = (category: TodoCategory) => {
    return todos.value.filter(todo => todo.category === category)
  }

  const getTodosByStatus = (status: TodoStatus) => {
    return todos.value.filter(todo => todo.status === status)
  }

  const getOverdueTodos = () => {
    return todos.value.filter(todo => 
      todo.dueDate && todo.dueDate < new Date() && todo.status !== TodoStatus.COMPLETED
    )
  }

  const getTodayTodos = () => {
    return todos.value.filter(todo => 
      todo.dueDate && isSameDay(todo.dueDate, new Date())
    )
  }

  const getUpcomingTodos = (days: number = 7) => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)
    return todos.value.filter(todo => 
      todo.dueDate && todo.dueDate <= futureDate && todo.status !== TodoStatus.COMPLETED
    )
  }

  // Import/Export methods
  const exportTodos = (): string => {
    return JSON.stringify({
      todos: todos.value,
      achievements: achievements.value,
      moodRecords: moodRecords.value,
      socialShares: socialShares.value
    })
  }

  const importTodos = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData)
      if (data.todos) {
        todos.value = data.todos.map((todo: any) => ({
          ...todo,
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
          completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt)
        }))
      }
      if (data.achievements) {
        achievements.value = data.achievements.map((achievement: any) => ({
          ...achievement,
          unlockedAt: achievement.unlockedAt ? new Date(achievement.unlockedAt) : undefined
        }))
      }
      if (data.moodRecords) {
        moodRecords.value = data.moodRecords.map((record: any) => ({
          ...record,
          timestamp: new Date(record.timestamp)
        }))
      }
      if (data.socialShares) {
        socialShares.value = data.socialShares.map((share: any) => ({
          ...share,
          sharedAt: new Date(share.sharedAt)
        }))
      }
      saveTodos()
      return true
    } catch (error) {
      console.error('Failed to import todos:', error)
      return false
    }
  }

  // Achievement system
  const checkAchievements = () => {
    const stats = calculateStats()
    
    // Check first task achievement
    if (stats.total >= 1) {
      unlockAchievement('first_task')
    }

    // Check task streak achievement
    if (stats.currentStreak >= 3) {
      unlockAchievement('task_streak')
    }

    // Check category master achievements
    Object.entries(stats.categoryStats).forEach(([category, count]) => {
      if (count >= 5) {
        unlockAchievement('category_master')
      }
    })

    // Check priority focus achievement
    if (stats.highPriority >= 3) {
      unlockAchievement('priority_focus')
    }

    // Check mood tracker achievement
    if (stats.moodStats && Object.values(stats.moodStats).reduce((sum, count) => sum + count, 0) >= 5) {
      unlockAchievement('mood_tracker')
    }

    // Check perfect week achievement
    if (stats.weeklyProgress >= 7) {
      unlockAchievement('perfect_week')
    }

    // Check monthly goal achievement
    if (stats.monthlyProgress >= 20) {
      unlockAchievement('monthly_goal')
    }
  }

  const unlockAchievement = (type: string) => {
    const achievement = achievements.value.find(a => a.type === type && !a.isUnlocked)
    if (achievement) {
      achievement.isUnlocked = true
      achievement.unlockedAt = new Date()
      saveTodos()
    }
  }

  // Social sharing
  const shareTodo = (todoId: string, platform: 'wechat' | 'weibo' | 'qq' | 'douyin', shareText: string) => {
    const todo = getTodoById(todoId)
    if (todo) {
      const share: SocialShare = {
        id: Date.now().toString(),
        todoId,
        platform,
        sharedAt: new Date(),
        shareText,
        shareImage: undefined
      }
      socialShares.value.push(share)
      
      // Check social sharer achievement
      if (socialShares.value.length >= 3) {
        unlockAchievement('social_sharer')
      }
      
      saveTodos()
      return share
    }
    return null
  }

  // Utility functions
  const isSameDay = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString()
  }

  const isThisWeek = (date: Date) => {
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    return date >= startOfWeek && date <= endOfWeek
  }

  const calculateCurrentStreak = () => {
    let streak = 0
    const today = new Date()
    let currentDate = new Date(today)
    
    while (true) {
      const dayTodos = todos.value.filter(todo => 
        todo.completedAt && isSameDay(todo.completedAt, currentDate)
      )
      if (dayTodos.length > 0) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }
    return streak
  }

  const calculateLongestStreak = () => {
    let longestStreak = 0
    let currentStreak = 0
    const sortedTodos = todos.value
      .filter(todo => todo.completedAt)
      .sort((a, b) => a.completedAt!.getTime() - b.completedAt!.getTime())
    
    for (let i = 0; i < sortedTodos.length; i++) {
      if (i === 0 || isSameDay(sortedTodos[i].completedAt!, sortedTodos[i-1].completedAt!)) {
        currentStreak++
      } else {
        longestStreak = Math.max(longestStreak, currentStreak)
        currentStreak = 1
      }
    }
    longestStreak = Math.max(longestStreak, currentStreak)
    return longestStreak
  }

  const calculateWeeklyProgress = () => {
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    
    const weekTodos = todos.value.filter(todo => 
      todo.dueDate && todo.dueDate >= startOfWeek && todo.dueDate <= endOfWeek
    )
    const completedWeekTodos = weekTodos.filter(todo => todo.status === TodoStatus.COMPLETED)
    
    return weekTodos.length > 0 ? Math.round((completedWeekTodos.length / weekTodos.length) * 7) : 0
  }

  const calculateMonthlyProgress = () => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    const monthTodos = todos.value.filter(todo => 
      todo.dueDate && todo.dueDate >= startOfMonth && todo.dueDate <= endOfMonth
    )
    const completedMonthTodos = monthTodos.filter(todo => todo.status === TodoStatus.COMPLETED)
    
    return monthTodos.length > 0 ? Math.round((completedMonthTodos.length / monthTodos.length) * 30) : 0
  }

  const calculateStats = () => {
    const total = todos.value.length
    const completed = todos.value.filter(todo => todo.status === TodoStatus.COMPLETED).length
    const inProgress = todos.value.filter(todo => todo.status === TodoStatus.IN_PROGRESS).length
    const pending = todos.value.filter(todo => todo.status === TodoStatus.TODO).length
    const highPriority = todos.value.filter(todo => todo.priority === TodoPriority.HIGH).length
    const mediumPriority = todos.value.filter(todo => todo.priority === TodoPriority.MEDIUM).length
    const lowPriority = todos.value.filter(todo => todo.priority === TodoPriority.LOW).length
    const overdue = todos.value.filter(todo => 
      todo.dueDate && todo.dueDate < new Date() && todo.status !== TodoStatus.COMPLETED
    ).length
    const dueToday = todos.value.filter(todo => 
      todo.dueDate && isSameDay(todo.dueDate, new Date())
    ).length
    const dueThisWeek = todos.value.filter(todo => 
      todo.dueDate && isThisWeek(todo.dueDate)
    ).length

    const categoryStats: Record<string, number> = {}
    const tagStats: Record<string, number> = {}
    const moodStats: Record<MoodType, number> = {
      [MoodType.VERY_HAPPY]: 0,
      [MoodType.HAPPY]: 0,
      [MoodType.EXCITED]: 0,
      [MoodType.CALM]: 0,
      [MoodType.NEUTRAL]: 0,
      [MoodType.TIRED]: 0,
      [MoodType.STRESSED]: 0,
      [MoodType.SAD]: 0,
      [MoodType.ANGRY]: 0
    }

    todos.value.forEach(todo => {
      categoryStats[todo.category] = (categoryStats[todo.category] || 0) + 1
      todo.tags.forEach(tag => {
        tagStats[tag] = (tagStats[tag] || 0) + 1
      })
      if (todo.mood) {
        moodStats[todo.mood]++
      }
    })

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
    const currentStreak = calculateCurrentStreak()
    const longestStreak = calculateLongestStreak()
    const weeklyProgress = calculateWeeklyProgress()
    const monthlyProgress = calculateMonthlyProgress()

    return {
      total,
      completed,
      inProgress,
      pending,
      highPriority,
      mediumPriority,
      lowPriority,
      overdue,
      dueToday,
      dueThisWeek,
      categoryStats,
      tagStats,
      completionRate,
      moodStats,
      currentStreak,
      longestStreak,
      weeklyProgress,
      monthlyProgress
    }
  }

  // Initialize
  initializeTodos()

  return {
    // State
    todos,
    filters,
    isLoading,
    selectedTodos,
    achievements,
    moodRecords,
    taskSuggestions,
    socialShares,
    showCelebration,
    lastCompletedTodo,

    // Computed
    filteredTodos,
    stats,
    allTags,
    unlockedAchievements,
    lockedAchievements,
    recentMoodRecords,
    personalizedSuggestions,

    // Methods
    addTodo,
    updateTodo,
    deleteTodo,
    completeTodo,
    changeStatus,
    setFilters,
    clearFilters,
    toggleTodoSelection,
    selectAllTodos,
    clearSelection,
    bulkDelete,
    bulkChangeStatus,
    bulkChangePriority,
    bulkAddTags,
    getTodoById,
    getTodosByCategory,
    getTodosByStatus,
    getOverdueTodos,
    getTodayTodos,
    getUpcomingTodos,
    exportTodos,
    importTodos,
    shareTodo,
    checkAchievements,
    unlockAchievement
  }
})
