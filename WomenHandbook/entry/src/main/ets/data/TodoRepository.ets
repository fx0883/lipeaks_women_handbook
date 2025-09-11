/**
 * 待办事项数据访问层
 */
import { preferences } from '@kit.ArkData'
import { common } from '@kit.AbilityKit'
import type { TodoItem, CreateTodoData, UpdateTodoData, TodoFilters } from '../types/todo'
import { TodoStatus, TodoCategory, TodoPriority } from '../types/todo'
import { STORAGE_KEYS } from '../constants/app'

// 简单统计信息接口
interface SimpleStats {
  total: number
  completed: number
  pending: number
  inProgress: number
}

export class TodoRepository {
  private static instance: TodoRepository
  private dataPreferences: preferences.Preferences | null = null

  private constructor() {}

  // 单例模式获取实例
  static getInstance(): TodoRepository {
    if (!TodoRepository.instance) {
      TodoRepository.instance = new TodoRepository()
    }
    return TodoRepository.instance
  }

  // 初始化数据存储
  async initialize(): Promise<void> {
    try {
      // 等待context可用
      let context: common.UIAbilityContext | undefined = AppStorage.get('context') as common.UIAbilityContext | undefined;
      let retryCount = 0;
      const maxRetries = 10;
      
      // 如果context不可用，等待一段时间再重试
      while (!context && retryCount < maxRetries) {
        await new Promise<void>(resolve => setTimeout(resolve, 100));
        context = AppStorage.get('context') as common.UIAbilityContext | undefined;
        retryCount++;
      }
      
      if (!context) {
        throw new Error('无法获取应用上下文，请重试');
      }
      
      this.dataPreferences = await preferences.getPreferences(context as common.UIAbilityContext, 'handbook_data')
      console.info('TodoRepository初始化成功')
    } catch (error) {
      console.error('TodoRepository初始化失败:', error)
      throw new Error(`初始化失败: ${error}`)
    }
  }

  // 获取所有待办事项
  async findAll(): Promise<TodoItem[]> {
    try {
      if (!this.dataPreferences) {
        await this.initialize()
      }
      
      const todosJson = await this.dataPreferences!.get(STORAGE_KEYS.TODOS, '[]') as string
      const todos = JSON.parse(todosJson) as TodoItem[]
      
      // 转换日期字段
      return todos.map(todo => {
        const convertedTodo: TodoItem = {
          id: todo.id,
          title: todo.title,
          description: todo.description,
          category: todo.category,
          priority: todo.priority,
          status: todo.status,
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
          completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
          mood: todo.mood,
          tags: todo.tags,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt)
        }
        return convertedTodo
      })
    } catch (error) {
      console.error('获取待办事项失败:', error)
      return []
    }
  }

  // 根据ID查找待办事项
  async findById(id: string): Promise<TodoItem | null> {
    try {
      const todos = await this.findAll()
      return todos.find(todo => todo.id === id) || null
    } catch (error) {
      console.error('根据ID查找待办事项失败:', error)
      return null
    }
  }

  // 根据状态查找待办事项
  async findByStatus(status: TodoStatus): Promise<TodoItem[]> {
    try {
      const todos = await this.findAll()
      return todos.filter(todo => todo.status === status)
    } catch (error) {
      console.error('根据状态查找待办事项失败:', error)
      return []
    }
  }

  // 根据分类查找待办事项
  async findByCategory(category: TodoCategory): Promise<TodoItem[]> {
    try {
      const todos = await this.findAll()
      return todos.filter(todo => todo.category === category)
    } catch (error) {
      console.error('根据分类查找待办事项失败:', error)
      return []
    }
  }

  // 搜索待办事项
  async search(query: string): Promise<TodoItem[]> {
    try {
      const todos = await this.findAll()
      const lowerQuery = query.toLowerCase()
      
      return todos.filter(todo =>
        todo.title.toLowerCase().includes(lowerQuery) ||
        (todo.description && todo.description.toLowerCase().includes(lowerQuery)) ||
        todo.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
    } catch (error) {
      console.error('搜索待办事项失败:', error)
      return []
    }
  }

  // 创建待办事项
  async create(todoData: CreateTodoData): Promise<TodoItem> {
    try {
      const todos = await this.findAll()
      const now = new Date()
      
      const newTodo: TodoItem = {
        id: this.generateId(),
        title: todoData.title,
        description: todoData.description || '',
        category: todoData.category,
        priority: todoData.priority,
        status: todoData.status || TodoStatus.TODO,
        dueDate: todoData.dueDate,
        completedAt: undefined,
        mood: undefined,
        tags: todoData.tags || [],
        createdAt: now,
        updatedAt: now
      }

      todos.push(newTodo)
      await this.saveAll(todos)
      
      console.info('创建待办事项成功:', newTodo.id)
      return newTodo
    } catch (error) {
      console.error('创建待办事项失败:', error)
      throw new Error(`创建失败: ${error}`)
    }
  }

  // 更新待办事项
  async update(id: string, updateData: UpdateTodoData): Promise<TodoItem | null> {
    try {
      const todos = await this.findAll()
      const todoIndex = todos.findIndex(todo => todo.id === id)
      
      if (todoIndex === -1) {
        console.warn('待办事项不存在:', id)
        return null
      }

      const existingTodo = todos[todoIndex]
      const updatedTodo: TodoItem = {
        id: existingTodo.id,
        title: updateData.title !== undefined ? updateData.title : existingTodo.title,
        description: updateData.description !== undefined ? updateData.description : existingTodo.description,
        category: updateData.category !== undefined ? updateData.category : existingTodo.category,
        priority: updateData.priority !== undefined ? updateData.priority : existingTodo.priority,
        status: updateData.status !== undefined ? updateData.status : existingTodo.status,
        dueDate: updateData.dueDate !== undefined ? updateData.dueDate : existingTodo.dueDate,
        completedAt: updateData.completedAt !== undefined ? updateData.completedAt : existingTodo.completedAt,
        mood: updateData.mood !== undefined ? updateData.mood : existingTodo.mood,
        tags: updateData.tags !== undefined ? updateData.tags : existingTodo.tags,
        createdAt: existingTodo.createdAt,
        updatedAt: new Date()
      }

      todos[todoIndex] = updatedTodo
      await this.saveAll(todos)
      
      console.info('更新待办事项成功:', id)
      return updatedTodo
    } catch (error) {
      console.error('更新待办事项失败:', error)
      throw new Error(`更新失败: ${error}`)
    }
  }

  // 删除待办事项
  async delete(id: string): Promise<boolean> {
    try {
      const todos = await this.findAll()
      const todoIndex = todos.findIndex(todo => todo.id === id)
      
      if (todoIndex === -1) {
        console.warn('待办事项不存在:', id)
        return false
      }

      todos.splice(todoIndex, 1)
      await this.saveAll(todos)
      
      console.info('删除待办事项成功:', id)
      return true
    } catch (error) {
      console.error('删除待办事项失败:', error)
      return false
    }
  }

  // 批量删除待办事项
  async batchDelete(ids: string[]): Promise<number> {
    try {
      const todos = await this.findAll()
      const initialCount = todos.length
      
      const filteredTodos = todos.filter(todo => !ids.includes(todo.id))
      await this.saveAll(filteredTodos)
      
      const deletedCount = initialCount - filteredTodos.length
      console.info('批量删除待办事项成功:', deletedCount)
      return deletedCount
    } catch (error) {
      console.error('批量删除待办事项失败:', error)
      return 0
    }
  }

  // 保存所有待办事项
  private async saveAll(todos: TodoItem[]): Promise<void> {
    try {
      if (!this.dataPreferences) {
        await this.initialize()
      }
      
      const todosJson = JSON.stringify(todos)
      await this.dataPreferences!.put(STORAGE_KEYS.TODOS, todosJson)
      await this.dataPreferences!.flush()
    } catch (error) {
      console.error('保存待办事项失败:', error)
      throw new Error(`保存失败: ${error}`)
    }
  }

  // 生成唯一ID
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  // 获取统计信息
  async getStats(): Promise<SimpleStats> {
    try {
      const todos = await this.findAll()
      
      const stats: SimpleStats = {
        total: todos.length,
        completed: todos.filter(todo => todo.status === TodoStatus.COMPLETED).length,
        pending: todos.filter(todo => todo.status === TodoStatus.TODO).length,
        inProgress: todos.filter(todo => todo.status === TodoStatus.IN_PROGRESS).length
      }
      
      return stats
    } catch (error) {
      console.error('获取统计信息失败:', error)
      const defaultStats: SimpleStats = { total: 0, completed: 0, pending: 0, inProgress: 0 }
      return defaultStats
    }
  }

  // 清空所有数据
  async clear(): Promise<void> {
    try {
      await this.saveAll([])
      console.info('清空所有待办事项成功')
    } catch (error) {
      console.error('清空所有待办事项失败:', error)
      throw new Error(`清空失败: ${error}`)
    }
  }
}
