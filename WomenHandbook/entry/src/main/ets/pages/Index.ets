import type { CreateTodoData, TodoItem } from '../types/todo'
import { TodoStore } from '../store/TodoStore'
import { TodoListComponent } from '../components/TodoListComponent'
import { AddTodoComponent } from '../components/AddTodoComponent'
import { THEME_COLORS } from '../constants/app'
import { promptAction } from '@kit.ArkUI'

@Entry
@Component
struct Index {
  private todoStore: TodoStore = TodoStore.getInstance()
  @State showAddDialog: boolean = false
  @State searchQuery: string = ''
  @State showSearch: boolean = false
  @State todos: TodoItem[] = []
  @State loading: boolean = false
  @State error: string = ''

  async aboutToAppear() {
    // 页面即将显示时初始化数据
    this.loading = true
    this.error = ''
    
    try {
      // 等待上下文可用后再初始化
      await new Promise<void>(resolve => setTimeout(resolve, 200))
      await this.todoStore.initialize()
      this.updateLocalState()
    } catch (error) {
      console.error('初始化失败:', error)
      this.error = `初始化失败: ${error}`
    } finally {
      this.loading = false
    }
  }

  // 更新本地状态
  private updateLocalState(): void {
    this.todos = this.todoStore.getFilteredTodos()
    this.loading = this.todoStore.loading
    this.error = this.todoStore.error
  }

  // 处理状态变更
  private handleStatusChange = async (id: string): Promise<void> => {
    await this.todoStore.toggleTodoStatus(id)
    this.updateLocalState()
  }

  // 处理编辑
  private handleEdit = (id: string): void => {
    // TODO: 实现编辑功能
    console.info('编辑待办事项:', id)
  }

  // 处理删除
  private handleDelete = async (id: string): Promise<void> => {
    await this.todoStore.deleteTodo(id)
    this.updateLocalState()
  }

  // 处理添加新待办事项
  private handleAddTodo = async (data: CreateTodoData): Promise<void> => {
    const success = await this.todoStore.createTodo(data)
    if (success) {
      this.showAddDialog = false
      this.updateLocalState()
      // 显示成功提示
      promptAction.showToast({
        message: '添加成功！',
        duration: 2000
      })
    } else {
      this.updateLocalState()
      // 显示错误提示
      promptAction.showToast({
        message: this.todoStore.error || '添加失败',
        duration: 2000
      })
    }
  }

  // 处理刷新
  private handleRefresh = async (): Promise<void> => {
    await this.todoStore.loadTodos()
    this.updateLocalState()
  }

  // 处理重试初始化
  private handleRetry = async (): Promise<void> => {
    this.loading = true
    this.error = ''
    
    try {
      // 重新初始化数据存储
      await this.todoStore.initialize()
      await this.todoStore.loadTodos()
      this.updateLocalState()
    } catch (error) {
      console.error('重试初始化失败:', error)
      this.error = `初始化失败: ${error}`
    } finally {
      this.loading = false
    }
  }

  // 处理搜索
  private handleSearch = (query: string): void => {
    this.searchQuery = query
    this.todoStore.setSearchQuery(query)
    this.updateLocalState()
  }

  build() {
    Stack() {
      // 主要内容
      Column() {
        // 头部
        Row() {
          Column() {
            Text('女性手账')
              .fontSize(24)
              .fontWeight(FontWeight.Bold)
              .fontColor('#333333')
            
            Text('管理你的美好生活 💕')
              .fontSize(14)
              .fontColor('#666666')
              .margin({ top: 4 })
          }
          .alignItems(HorizontalAlign.Start)

          Blank()

          // 搜索图标
          Button() {
            Text('🔍')
              .fontSize(20)
          }
          .width(40)
          .height(40)
          .backgroundColor('#f8f9fa')
          .borderRadius(20)
          .onClick(() => {
            this.showSearch = !this.showSearch
          })
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 16, bottom: 8 })

        // 搜索框
        if (this.showSearch) {
          Row() {
            TextInput({ placeholder: '搜索待办事项...' })
              .fontSize(14)
              .backgroundColor('#f8f9fa')
              .borderRadius(20)
              .layoutWeight(1)
              .onChange((value) => {
                this.handleSearch(value)
              })

            if (this.searchQuery) {
              Button('清除')
                .fontSize(12)
                .fontColor('#666666')
                .backgroundColor(Color.Transparent)
                .margin({ left: 8 })
                .onClick(() => {
                  this.handleSearch('')
                })
            }
          }
          .width('100%')
          .padding({ left: 16, right: 16, bottom: 8 })
        }

        // 主要内容区域
        TodoListComponent({
          todos: this.todos,
          loading: this.loading,
          error: this.error,
          onStatusChange: this.handleStatusChange,
          onEdit: this.handleEdit,
          onDelete: this.handleDelete,
          onRefresh: this.handleRetry
        })
      }
      .width('100%')
      .height('100%')
      .backgroundColor('#ffffff')

      // 浮动添加按钮
      Button() {
        Text('+')
          .fontSize(24)
          .fontColor(Color.White)
          .fontWeight(FontWeight.Bold)
      }
      .width(56)
      .height(56)
      .backgroundColor(THEME_COLORS.PINK.PRIMARY)
      .borderRadius(28)
      .position({ x: '100%', y: '100%' })
      .translate({ x: -72, y: -72 })
      .shadow({
        radius: 8,
        color: '#00000020',
        offsetX: 0,
        offsetY: 4
      })
      .onClick(() => {
        this.showAddDialog = true
      })

      // 添加待办事项对话框
      AddTodoComponent({
        visible: this.showAddDialog,
        onSave: this.handleAddTodo,
        onCancel: () => {
          this.showAddDialog = false
        }
      })
    }
    .width('100%')
    .height('100%')
  }
}