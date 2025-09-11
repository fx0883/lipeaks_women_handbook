/**
 * 待办事项相关类型定义
 */

// 待办事项分类枚举
export enum TodoCategory {
  WORK = '工作',
  PERSONAL = '个人',
  HEALTH = '健康',
  ENTERTAINMENT = '娱乐',
  LEARNING = '学习',
  OTHER = '其他'
}

// 待办事项优先级枚举
export enum TodoPriority {
  LOW = '低',
  MEDIUM = '中',
  HIGH = '高'
}

// 待办事项状态枚举
export enum TodoStatus {
  TODO = '待办',
  IN_PROGRESS = '进行中',
  COMPLETED = '已完成'
}

// 心情类型枚举
export enum MoodType {
  VERY_HAPPY = '😄',
  HAPPY = '😊',
  EXCITED = '🤩',
  CALM = '😌',
  NEUTRAL = '😐',
  TIRED = '😴',
  STRESSED = '😰',
  ANXIOUS = '😰',
  SAD = '😢',
  ANGRY = '😠'
}

// 待办事项接口
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
}

// 创建待办事项数据接口
export interface CreateTodoData {
  title: string
  description?: string
  category: TodoCategory
  priority: TodoPriority
  status?: TodoStatus
  dueDate?: Date
  tags?: string[]
}

// 更新待办事项数据接口
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
}

// 日期范围接口
export interface DateRange {
  start?: Date
  end?: Date
}

// 待办事项筛选条件接口
export interface TodoFilters {
  search?: string
  category?: TodoCategory
  priority?: TodoPriority
  status?: TodoStatus
  tags?: string[]
  dueDateRange?: DateRange
}

// 分类统计接口 - 使用具体属性而非索引签名
export interface CategoryStats {
  work?: number
  personal?: number
  health?: number
  entertainment?: number
  learning?: number
  other?: number
}

// 标签统计接口 - 使用具体属性而非索引签名
export interface TagStats {
  urgent?: number
  important?: number
  daily?: number
  project?: number
  reminder?: number
}

// 心情统计接口 - 使用具体属性而非索引签名
export interface MoodStats {
  happy?: number
  neutral?: number
  sad?: number
  excited?: number
  tired?: number
  anxious?: number
}

// 待办事项统计接口
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
  categoryStats: CategoryStats
  tagStats: TagStats
  completionRate: number
  moodStats: MoodStats
}

// 心情记录接口
export interface MoodRecord {
  id: string
  todoId: string
  mood: MoodType
  note?: string
  timestamp: Date
}
