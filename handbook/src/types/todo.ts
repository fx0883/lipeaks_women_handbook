export enum TodoCategory {
  STUDY = '学习',
  LIFE = '生活',
  WORK = '工作',
  ENTERTAINMENT = '娱乐'
}

export enum TodoPriority {
  LOW = '低',
  MEDIUM = '中',
  HIGH = '高'
}

export enum TodoStatus {
  TODO = '待办',
  IN_PROGRESS = '进行中',
  COMPLETED = '已完成'
}

export enum MoodType {
  VERY_HAPPY = '😄',
  HAPPY = '😊',
  EXCITED = '🤩',
  CALM = '😌',
  NEUTRAL = '😐',
  TIRED = '😴',
  STRESSED = '😰',
  SAD = '😢',
  ANGRY = '😠'
}

export enum AchievementType {
  FIRST_TASK = 'first_task',
  TASK_STREAK = 'task_streak',
  CATEGORY_MASTER = 'category_master',
  PRIORITY_FOCUS = 'priority_focus',
  MOOD_TRACKER = 'mood_tracker',
  SOCIAL_SHARER = 'social_sharer',
  PERFECT_WEEK = 'perfect_week',
  MONTHLY_GOAL = 'monthly_goal'
}

export interface Achievement {
  id: string
  type: AchievementType
  title: string
  description: string
  icon: string
  unlockedAt?: Date
  progress: number
  maxProgress: number
  isUnlocked: boolean
}

export interface MoodRecord {
  id: string
  todoId: string
  mood: MoodType
  note?: string
  timestamp: Date
}

export interface TaskSuggestion {
  id: string
  title: string
  description: string
  category: TodoCategory
  priority: TodoPriority
  reason: string
  confidence: number
  tags: string[]
}

export interface SocialShare {
  id: string
  todoId: string
  platform: 'wechat' | 'weibo' | 'qq' | 'douyin'
  sharedAt: Date
  shareText: string
  shareImage?: string
}

export interface TodoItem {
  id: string
  title: string
  description?: string
  category: TodoCategory
  priority: TodoPriority
  status: TodoStatus
  dueDate?: Date
  completedAt?: Date
  mood?: MoodType
  tags: string[]
  createdAt: Date
  updatedAt: Date
  // 手账集成相关字段
  handbookTemplates?: string[] // 关联的手账模板ID
  completionStory?: string // 完成故事
  visualElements?: {
    images: string[]
    stickers: string[]
    colors: string[]
    fonts: string[]
  }
  handbookGenerated?: boolean // 是否已生成手账
  handbookGeneratedAt?: Date // 手账生成时间
}

export interface TodoFilters {
  search?: string
  category?: TodoCategory
  priority?: TodoPriority
  status?: TodoStatus
  tags?: string[]
  dueDateRange?: {
    start?: Date
    end?: Date
  }
}

export interface TodoStats {
  total: number
  completed: number
  inProgress: number
  pending: number
  highPriority: number
  mediumPriority: number
  lowPriority: number
  overdue: number
  dueToday: number
  dueThisWeek: number
  categoryStats: Record<string, number>
  tagStats: Record<string, number>
  completionRate: number
  // New emotional stats
  moodStats: Record<MoodType, number>
  achievementCount: number
  currentStreak: number
  longestStreak: number
  weeklyProgress: number
  monthlyProgress: number
}

export interface CreateTodoData {
  title: string
  description?: string
  category: TodoCategory
  priority: TodoPriority
  status: TodoStatus
  dueDate?: Date
  tags: string[]
}

export interface UpdateTodoData {
  title?: string
  description?: string
  category?: TodoCategory
  priority?: TodoPriority
  status?: TodoStatus
  dueDate?: Date
  completedAt?: Date
  mood?: MoodType
  tags?: string[]
  // New emotional fields
  achievementIds?: string[]
  moodNote?: string
}
