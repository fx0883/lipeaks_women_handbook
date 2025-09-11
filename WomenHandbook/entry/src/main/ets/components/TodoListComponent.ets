/**
 * 待办事项列表组件
 */
import type { TodoItem, TodoFilters } from '../types/todo'
import { TodoStatus, TodoCategory, TodoPriority } from '../types/todo'
import { TodoItemComponent } from './TodoItemComponent'
import { THEME_COLORS } from '../constants/app'

@Component
export struct TodoListComponent {
  @Prop todos: TodoItem[]
  @Prop loading: boolean = false
  @Prop error: string = ''
  onStatusChange?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onRefresh?: () => void
  @State filters: TodoFilters = {}
  @State showFilters: boolean = false

  // 获取筛选后的待办事项
  private getFilteredTodos(): TodoItem[] {
    let filteredTodos = [...this.todos]

    // 分类筛选
    if (this.filters.category) {
      filteredTodos = filteredTodos.filter(todo => todo.category === this.filters.category)
    }

    // 状态筛选
    if (this.filters.status) {
      filteredTodos = filteredTodos.filter(todo => todo.status === this.filters.status)
    }

    // 优先级筛选
    if (this.filters.priority) {
      filteredTodos = filteredTodos.filter(todo => todo.priority === this.filters.priority)
    }

    // 按创建时间排序，最新的在前
    return filteredTodos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // 获取状态数量
  private getStatusCount(status: TodoStatus): number {
    return this.todos.filter(todo => todo.status === status).length
  }

  build() {
    Column() {
      // 状态统计卡片
      Row() {
        // 待办
        Column() {
          Text(this.getStatusCount(TodoStatus.TODO).toString())
            .fontSize(24)
            .fontWeight(FontWeight.Bold)
            .fontColor(THEME_COLORS.PINK.PRIMARY)
          Text('待办')
            .fontSize(12)
            .fontColor('#666666')
            .margin({ top: 4 })
        }
        .layoutWeight(1)
        .backgroundColor('#fff5f9')
        .padding(16)
        .borderRadius(12)
        .onClick(() => {
          this.filters = { status: TodoStatus.TODO }
        })

        // 进行中
        Column() {
          Text(this.getStatusCount(TodoStatus.IN_PROGRESS).toString())
            .fontSize(24)
            .fontWeight(FontWeight.Bold)
            .fontColor('#ffaa00')
          Text('进行中')
            .fontSize(12)
            .fontColor('#666666')
            .margin({ top: 4 })
        }
        .layoutWeight(1)
        .backgroundColor('#fff8e7')
        .padding(16)
        .borderRadius(12)
        .margin({ left: 8 })
        .onClick(() => {
          this.filters = { status: TodoStatus.IN_PROGRESS }
        })

        // 已完成
        Column() {
          Text(this.getStatusCount(TodoStatus.COMPLETED).toString())
            .fontSize(24)
            .fontWeight(FontWeight.Bold)
            .fontColor('#00aa00')
          Text('已完成')
            .fontSize(12)
            .fontColor('#666666')
            .margin({ top: 4 })
        }
        .layoutWeight(1)
        .backgroundColor('#f0fff4')
        .padding(16)
        .borderRadius(12)
        .margin({ left: 8 })
        .onClick(() => {
          this.filters = { status: TodoStatus.COMPLETED }
        })
      }
      .width('100%')
      .margin({ bottom: 16 })

      // 筛选器行
      Row() {
        // 筛选按钮
        Button() {
          Row() {
            Text('筛选')
              .fontSize(14)
              .fontColor(this.showFilters ? THEME_COLORS.PINK.PRIMARY : '#666666')
            Text('⌄')
              .fontSize(12)
              .fontColor(this.showFilters ? THEME_COLORS.PINK.PRIMARY : '#666666')
              .margin({ left: 4 })
              .rotate({ angle: this.showFilters ? 180 : 0 })
          }
        }
        .backgroundColor(Color.Transparent)
        .border({
          width: 1,
          color: this.showFilters ? THEME_COLORS.PINK.PRIMARY : '#ddd',
          radius: 16
        })
        .padding({ left: 12, right: 12, top: 6, bottom: 6 })
        .onClick(() => {
          this.showFilters = !this.showFilters
        })

        Blank()

        // 清除筛选
        if (Object.keys(this.filters).length > 0) {
          Button('清除筛选')
            .fontSize(12)
            .fontColor(THEME_COLORS.PINK.PRIMARY)
            .backgroundColor(Color.Transparent)
            .onClick(() => {
              this.filters = {}
            })
        }
      }
      .width('100%')
      .margin({ bottom: 8 })

      // 筛选器面板
      if (this.showFilters) {
        Column() {
          // 分类筛选
          Text('分类')
            .fontSize(14)
            .fontWeight(FontWeight.Medium)
            .margin({ bottom: 8 })

          Flex({ wrap: FlexWrap.Wrap }) {
            ForEach(Object.values(TodoCategory), (category: TodoCategory) => {
              Button(category)
                .fontSize(12)
                .fontColor(this.filters.category === category ? Color.White : THEME_COLORS.PINK.PRIMARY)
                .backgroundColor(this.filters.category === category ? THEME_COLORS.PINK.PRIMARY : Color.Transparent)
                .border({
                  width: 1,
                  color: THEME_COLORS.PINK.PRIMARY,
                  radius: 12
                })
                .padding({ left: 12, right: 12, top: 4, bottom: 4 })
                .margin({ right: 8, bottom: 8 })
                .onClick(() => {
                  this.filters = {
                    search: this.filters.search,
                    priority: this.filters.priority,
                    status: this.filters.status,
                    tags: this.filters.tags,
                    dueDateRange: this.filters.dueDateRange,
                    category: this.filters.category === category ? undefined : category
                  }
                })
            })
          }

          // 优先级筛选
          Text('优先级')
            .fontSize(14)
            .fontWeight(FontWeight.Medium)
            .margin({ top: 16, bottom: 8 })

          Flex({ wrap: FlexWrap.Wrap }) {
            ForEach(Object.values(TodoPriority), (priority: TodoPriority) => {
              Button(priority)
                .fontSize(12)
                .fontColor(this.filters.priority === priority ? Color.White : THEME_COLORS.PINK.PRIMARY)
                .backgroundColor(this.filters.priority === priority ? THEME_COLORS.PINK.PRIMARY : Color.Transparent)
                .border({
                  width: 1,
                  color: THEME_COLORS.PINK.PRIMARY,
                  radius: 12
                })
                .padding({ left: 12, right: 12, top: 4, bottom: 4 })
                .margin({ right: 8, bottom: 8 })
                .onClick(() => {
                  this.filters = {
                    search: this.filters.search,
                    category: this.filters.category,
                    status: this.filters.status,
                    tags: this.filters.tags,
                    dueDateRange: this.filters.dueDateRange,
                    priority: this.filters.priority === priority ? undefined : priority
                  }
                })
            })
          }
        }
        .width('100%')
        .backgroundColor('#f8f9fa')
        .padding(16)
        .borderRadius(8)
        .margin({ bottom: 16 })
      }

      // 列表内容
      if (this.loading) {
        // 加载状态
        Column() {
          LoadingProgress()
            .width(40)
            .height(40)
            .color(THEME_COLORS.PINK.PRIMARY)
          Text('加载中...')
            .fontSize(14)
            .fontColor('#666666')
            .margin({ top: 16 })
        }
        .width('100%')
        .height(200)
        .justifyContent(FlexAlign.Center)
        .alignItems(HorizontalAlign.Center)
      } else if (this.error) {
        // 错误状态
        Column() {
          Text('😞')
            .fontSize(48)
          Text(this.error)
            .fontSize(14)
            .fontColor('#ff4444')
            .margin({ top: 16 })
            .textAlign(TextAlign.Center)
          Button('重试')
            .fontSize(14)
            .fontColor(THEME_COLORS.PINK.PRIMARY)
            .backgroundColor(Color.Transparent)
            .border({
              width: 1,
              color: THEME_COLORS.PINK.PRIMARY,
              radius: 16
            })
            .margin({ top: 16 })
            .onClick(() => {
              this.onRefresh?.()
            })
        }
        .width('100%')
        .height(200)
        .justifyContent(FlexAlign.Center)
        .alignItems(HorizontalAlign.Center)
      } else if (this.getFilteredTodos().length === 0) {
        // 空状态
        Column() {
          Text('📝')
            .fontSize(48)
          Text('暂无待办事项')
            .fontSize(16)
            .fontColor('#666666')
            .margin({ top: 16 })
          Text('点击下方按钮添加第一个待办事项')
            .fontSize(12)
            .fontColor('#999999')
            .margin({ top: 8 })
        }
        .width('100%')
        .height(200)
        .justifyContent(FlexAlign.Center)
        .alignItems(HorizontalAlign.Center)
      } else {
        // 待办事项列表
        List() {
          ForEach(this.getFilteredTodos(), (todo: TodoItem) => {
            ListItem() {
              TodoItemComponent({
                todo: todo,
                onStatusChange: this.onStatusChange,
                onEdit: this.onEdit,
                onDelete: this.onDelete
              })
            }
          }, (todo: TodoItem) => todo.id)
        }
        .width('100%')
        .layoutWeight(1)
        .divider({
          strokeWidth: 0
        })
      }
    }
    .width('100%')
    .height('100%')
    .padding(16)
    .backgroundColor('#f8f9fa')
  }
}
