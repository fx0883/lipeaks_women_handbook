/**
 * 待办事项状态管理
 */
import type { TodoItem, CreateTodoData, UpdateTodoData, TodoFilters, TodoStats, CategoryStats, TagStats, MoodStats } from '../types/todo'
import { TodoStatus, TodoCategory, TodoPriority, MoodType } from '../types/todo'
import { TodoRepository } from '../data/TodoRepository'

@ObservedV2
export class TodoStore {
  private static instance: TodoStore
  private todoRepository: TodoRepository

  @Trace todos: TodoItem[] = []
  @Trace loading: boolean = false
  @Trace error: string = ''
  @Trace filters: TodoFilters = {}
  @Trace searchQuery: string = ''

  private constructor() {
    this.todoRepository = TodoRepository.getInstance()
  }

  // 单例模式获取实例
  static getInstance(): TodoStore {
    if (!TodoStore.instance) {
      TodoStore.instance = new TodoStore()
    }
    return TodoStore.instance
  }

  // 初始化数据
  async initialize(): Promise<void> {
    try {
      this.loading = true
      this.error = ''
      
      await this.todoRepository.initialize()
      await this.loadTodos()
      
      console.info('TodoStore初始化成功')
    } catch (error) {
      this.error = `初始化失败: ${error}`
      console.error('TodoStore初始化失败:', error)
    } finally {
      this.loading = false
    }
  }

  // 加载所有待办事项
  async loadTodos(): Promise<void> {
    try {
      this.loading = true
      this.error = ''
      
      this.todos = await this.todoRepository.findAll()
      console.info('加载待办事项成功，数量:', this.todos.length)
    } catch (error) {
      this.error = `加载失败: ${error}`
      console.error('加载待办事项失败:', error)
    } finally {
      this.loading = false
    }
  }

  // 创建新的待办事项
  async createTodo(todoData: CreateTodoData): Promise<boolean> {
    try {
      this.loading = true
      this.error = ''
      
      const newTodo = await this.todoRepository.create(todoData)
      this.todos.push(newTodo)
      
      console.info('创建待办事项成功:', newTodo.id)
      return true
    } catch (error) {
      this.error = `创建失败: ${error}`
      console.error('创建待办事项失败:', error)
      return false
    } finally {
      this.loading = false
    }
  }

  // 更新待办事项
  async updateTodo(id: string, updateData: UpdateTodoData): Promise<boolean> {
    try {
      this.loading = true
      this.error = ''
      
      const updatedTodo = await this.todoRepository.update(id, updateData)
      if (updatedTodo) {
        const index = this.todos.findIndex(todo => todo.id === id)
        if (index !== -1) {
          this.todos[index] = updatedTodo
        }
        console.info('更新待办事项成功:', id)
        return true
      }
      return false
    } catch (error) {
      this.error = `更新失败: ${error}`
      console.error('更新待办事项失败:', error)
      return false
    } finally {
      this.loading = false
    }
  }

  // 删除待办事项
  async deleteTodo(id: string): Promise<boolean> {
    try {
      this.loading = true
      this.error = ''
      
      const success = await this.todoRepository.delete(id)
      if (success) {
        const index = this.todos.findIndex(todo => todo.id === id)
        if (index !== -1) {
          this.todos.splice(index, 1)
        }
        console.info('删除待办事项成功:', id)
        return true
      }
      return false
    } catch (error) {
      this.error = `删除失败: ${error}`
      console.error('删除待办事项失败:', error)
      return false
    } finally {
      this.loading = false
    }
  }

  // 切换待办事项状态
  async toggleTodoStatus(id: string): Promise<boolean> {
    const todo = this.todos.find(t => t.id === id)
    if (!todo) return false

    let newStatus: TodoStatus
    switch (todo.status) {
      case TodoStatus.TODO:
        newStatus = TodoStatus.IN_PROGRESS
        break
      case TodoStatus.IN_PROGRESS:
        newStatus = TodoStatus.COMPLETED
        break
      case TodoStatus.COMPLETED:
        newStatus = TodoStatus.TODO
        break
      default:
        newStatus = TodoStatus.TODO
    }

    const updateData: UpdateTodoData = {
      status: newStatus,
      completedAt: newStatus === TodoStatus.COMPLETED ? new Date() : undefined
    }

    return await this.updateTodo(id, updateData)
  }

  // 标记为完成
  async completeTodo(id: string, mood?: MoodType): Promise<boolean> {
    const updateData: UpdateTodoData = {
      status: TodoStatus.COMPLETED,
      completedAt: new Date(),
      mood: mood
    }
    return await this.updateTodo(id, updateData)
  }

  // 设置筛选条件
  setFilters(filters: TodoFilters): void {
    this.filters = {
      search: filters.search,
      category: filters.category,
      priority: filters.priority,
      status: filters.status,
      tags: filters.tags,
      dueDateRange: filters.dueDateRange
    }
  }

  // 设置搜索查询
  setSearchQuery(query: string): void {
    this.searchQuery = query
  }

  // 清除筛选条件
  clearFilters(): void {
    this.filters = {}
    this.searchQuery = ''
  }

  // 获取筛选后的待办事项
  getFilteredTodos(): TodoItem[] {
    let filteredTodos = [...this.todos]

    // 搜索筛选
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase()
      filteredTodos = filteredTodos.filter(todo =>
        todo.title.toLowerCase().includes(query) ||
        (todo.description && todo.description.toLowerCase().includes(query)) ||
        todo.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // 分类筛选
    if (this.filters.category) {
      filteredTodos = filteredTodos.filter(todo => todo.category === this.filters.category)
    }

    // 优先级筛选
    if (this.filters.priority) {
      filteredTodos = filteredTodos.filter(todo => todo.priority === this.filters.priority)
    }

    // 状态筛选
    if (this.filters.status) {
      filteredTodos = filteredTodos.filter(todo => todo.status === this.filters.status)
    }

    // 标签筛选
    if (this.filters.tags && this.filters.tags.length > 0) {
      filteredTodos = filteredTodos.filter(todo =>
        this.filters.tags!.some(tag => todo.tags.includes(tag))
      )
    }

    // 日期范围筛选
    if (this.filters.dueDateRange) {
      const dateRange = this.filters.dueDateRange
      const start = dateRange.start
      const end = dateRange.end
      filteredTodos = filteredTodos.filter(todo => {
        if (!todo.dueDate) return false
        const dueDate = todo.dueDate
        if (start && dueDate < start) return false
        if (end && dueDate > end) return false
        return true
      })
    }

    return filteredTodos
  }

  // 根据状态获取待办事项
  getTodosByStatus(status: TodoStatus): TodoItem[] {
    return this.todos.filter(todo => todo.status === status)
  }

  // 根据分类获取待办事项
  getTodosByCategory(category: TodoCategory): TodoItem[] {
    return this.todos.filter(todo => todo.category === category)
  }

  // 根据优先级获取待办事项
  getTodosByPriority(priority: TodoPriority): TodoItem[] {
    return this.todos.filter(todo => todo.priority === priority)
  }

  // 获取今日到期的待办事项
  getTodayDueTodos(): TodoItem[] {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return this.todos.filter(todo => {
      if (!todo.dueDate) return false
      const dueDate = new Date(todo.dueDate)
      return dueDate >= today && dueDate < tomorrow
    })
  }

  // 获取逾期的待办事项
  getOverdueTodos(): TodoItem[] {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return this.todos.filter(todo => {
      if (!todo.dueDate || todo.status === TodoStatus.COMPLETED) return false
      return new Date(todo.dueDate) < today
    })
  }

  // 获取统计信息
  getStats(): TodoStats {
    const total = this.todos.length
    const completed = this.todos.filter(todo => todo.status === TodoStatus.COMPLETED).length
    const inProgress = this.todos.filter(todo => todo.status === TodoStatus.IN_PROGRESS).length
    const pending = this.todos.filter(todo => todo.status === TodoStatus.TODO).length

    const highPriority = this.todos.filter(todo => todo.priority === TodoPriority.HIGH).length
    const mediumPriority = this.todos.filter(todo => todo.priority === TodoPriority.MEDIUM).length
    const lowPriority = this.todos.filter(todo => todo.priority === TodoPriority.LOW).length

    const overdue = this.getOverdueTodos().length
    const dueToday = this.getTodayDueTodos().length

    // 本周到期
    const weekEnd = new Date()
    weekEnd.setDate(weekEnd.getDate() + 7)
    const dueThisWeek = this.todos.filter(todo => {
      if (!todo.dueDate) return false
      return new Date(todo.dueDate) <= weekEnd
    }).length

    // 分类统计
    const categoryStats: CategoryStats = {
      work: this.todos.filter(todo => todo.category === TodoCategory.WORK).length,
      personal: this.todos.filter(todo => todo.category === TodoCategory.PERSONAL).length,
      health: this.todos.filter(todo => todo.category === TodoCategory.HEALTH).length,
      entertainment: this.todos.filter(todo => todo.category === TodoCategory.ENTERTAINMENT).length,
      learning: this.todos.filter(todo => todo.category === TodoCategory.LEARNING).length,
      other: this.todos.filter(todo => todo.category === TodoCategory.OTHER).length
    }

    // 标签统计 - 使用最常见的标签
    const allTags = this.todos.flatMap(todo => todo.tags)
    const tagStats: TagStats = {
      urgent: allTags.filter(tag => tag === 'urgent').length,
      important: allTags.filter(tag => tag === 'important').length,
      daily: allTags.filter(tag => tag === 'daily').length,
      project: allTags.filter(tag => tag === 'project').length,
      reminder: allTags.filter(tag => tag === 'reminder').length
    }

    // 心情统计
    const moodStats: MoodStats = {
      happy: this.todos.filter(todo => todo.mood === MoodType.HAPPY).length,
      neutral: this.todos.filter(todo => todo.mood === MoodType.NEUTRAL).length,
      sad: this.todos.filter(todo => todo.mood === MoodType.SAD).length,
      excited: this.todos.filter(todo => todo.mood === MoodType.EXCITED).length,
      tired: this.todos.filter(todo => todo.mood === MoodType.TIRED).length,
      anxious: this.todos.filter(todo => todo.mood === MoodType.ANXIOUS).length
    }

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
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      moodStats
    }
  }

  // 清空错误信息
  clearError(): void {
    this.error = ''
  }

  // 获取所有标签
  getAllTags(): string[] {
    const allTags = new Set<string>()
    this.todos.forEach(todo => {
      todo.tags.forEach(tag => allTags.add(tag))
    })
    return Array.from(allTags).sort()
  }
}
