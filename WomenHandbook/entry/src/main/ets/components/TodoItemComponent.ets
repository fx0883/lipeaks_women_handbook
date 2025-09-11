/**
 * 待办事项条目组件
 */
import type { TodoItem } from '../types/todo'
import { TodoStatus, TodoPriority, TodoCategory, MoodType } from '../types/todo'
import { THEME_COLORS } from '../constants/app'

@Component
export struct TodoItemComponent {
  @Prop todo: TodoItem
  onStatusChange?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  @State isExpanded: boolean = false

  // 获取优先级颜色
  private getPriorityColor(priority: TodoPriority): string {
    switch (priority) {
      case TodoPriority.HIGH:
        return '#ff4444'
      case TodoPriority.MEDIUM:
        return '#ffaa00'
      case TodoPriority.LOW:
        return '#00aa00'
      default:
        return '#666666'
    }
  }

  // 获取状态图标
  private getStatusIcon(status: TodoStatus): string {
    switch (status) {
      case TodoStatus.COMPLETED:
        return '✓'
      case TodoStatus.IN_PROGRESS:
        return '⋯'
      case TodoStatus.TODO:
        return '○'
      default:
        return '○'
    }
  }

  // 获取分类图标
  private getCategoryIcon(category: TodoCategory): string {
    switch (category) {
      case TodoCategory.WORK:
        return '💼'
      case TodoCategory.PERSONAL:
        return '🏠'
      case TodoCategory.HEALTH:
        return '💪'
      case TodoCategory.ENTERTAINMENT:
        return '🎮'
      case TodoCategory.LEARNING:
        return '📚'
      case TodoCategory.OTHER:
        return '📝'
      default:
        return '📝'
    }
  }

  // 格式化日期
  private formatDate(date: Date): string {
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return '今天'
    } else if (days === 1) {
      return '明天'
    } else if (days === -1) {
      return '昨天'
    } else if (days > 0) {
      return `${days}天后`
    } else {
      return `${Math.abs(days)}天前`
    }
  }

  // 判断是否逾期
  private isOverdue(): boolean {
    if (!this.todo.dueDate || this.todo.status === TodoStatus.COMPLETED) {
      return false
    }
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    return new Date(this.todo.dueDate) < now
  }

  build() {
    Column() {
      // 主要内容区域
      Row() {
        // 状态按钮
        Button() {
          Text(this.getStatusIcon(this.todo.status))
            .fontSize(18)
            .fontColor(this.todo.status === TodoStatus.COMPLETED ? THEME_COLORS.PINK.PRIMARY : '#666666')
        }
        .width(40)
        .height(40)
        .backgroundColor(Color.Transparent)
        .border({
          width: 1,
          color: this.todo.status === TodoStatus.COMPLETED ? THEME_COLORS.PINK.PRIMARY : '#cccccc',
          radius: 20
        })
        .onClick(() => {
          if (this.onStatusChange) {
            this.onStatusChange(this.todo.id)
          }
        })

        // 主体内容
        Column() {
          // 标题和优先级
          Row() {
            Text(this.todo.title)
              .fontSize(16)
              .fontWeight(FontWeight.Medium)
              .fontColor(this.todo.status === TodoStatus.COMPLETED ? '#999999' : '#333333')
              .decoration({
                type: this.todo.status === TodoStatus.COMPLETED ? TextDecorationType.LineThrough : TextDecorationType.None
              })
              .layoutWeight(1)

            // 优先级指示器
            Circle({ width: 8, height: 8 })
              .fill(this.getPriorityColor(this.todo.priority))
              .margin({ left: 8 })
          }
          .width('100%')
          .alignItems(VerticalAlign.Center)

          // 分类和心情
          Row() {
            Text(`${this.getCategoryIcon(this.todo.category)} ${this.todo.category}`)
              .fontSize(12)
              .fontColor('#666666')

            if (this.todo.mood) {
              Text(this.todo.mood)
                .fontSize(14)
                .margin({ left: 8 })
            }

            Blank()

            // 到期日期
            if (this.todo.dueDate) {
              Text(this.formatDate(this.todo.dueDate))
                .fontSize(12)
                .fontColor(this.isOverdue() ? '#ff4444' : '#666666')
                .backgroundColor(this.isOverdue() ? '#ffebee' : Color.Transparent)
                .padding({ left: 6, right: 6, top: 2, bottom: 2 })
                .borderRadius(8)
            }
          }
          .width('100%')
          .margin({ top: 4 })

          // 标签
          if (this.todo.tags.length > 0) {
            Flex({ wrap: FlexWrap.Wrap, justifyContent: FlexAlign.Start }) {
              ForEach(this.todo.tags, (tag: string) => {
                Text(`#${tag}`)
                  .fontSize(10)
                  .fontColor(THEME_COLORS.PINK.PRIMARY)
                  .backgroundColor(THEME_COLORS.PINK.BACKGROUND)
                  .padding({ left: 6, right: 6, top: 2, bottom: 2 })
                  .borderRadius(6)
                  .margin({ right: 4, top: 4 })
              })
            }
            .width('100%')
          }

          // 描述（可展开）
          if (this.todo.description && this.todo.description.length > 0) {
            Text(this.todo.description)
              .fontSize(12)
              .fontColor('#666666')
              .maxLines(this.isExpanded ? 10 : 2)
              .textOverflow({ overflow: TextOverflow.Ellipsis })
              .margin({ top: 6 })
              .onClick(() => {
                this.isExpanded = !this.isExpanded
              })
          }
        }
        .layoutWeight(1)
        .margin({ left: 12, right: 12 })
        .alignItems(HorizontalAlign.Start)

        // 操作按钮
        Column() {
          Button() {
            Text('⋯')
              .fontSize(16)
              .fontColor('#666666')
          }
          .width(32)
          .height(32)
          .backgroundColor(Color.Transparent)
          .onClick(() => {
            // 显示操作菜单
            this.showActionMenu()
          })
        }
      }
      .width('100%')
      .padding(16)
      .alignItems(VerticalAlign.Top)

      // 分隔线
      Divider()
        .color('#f0f0f0')
        .margin({ left: 68, right: 16 })
    }
    .width('100%')
    .backgroundColor(Color.White)
    .borderRadius(8)
    .margin({ bottom: 8 })
    .shadow({
      radius: 4,
      color: '#00000010',
      offsetX: 0,
      offsetY: 2
    })
  }

  // 显示操作菜单
  private showActionMenu() {
    // 这里应该显示一个ActionSheet或ContextMenu
    // 包含编辑、删除等操作
    AlertDialog.show({
      title: '操作',
      message: '选择要执行的操作',
      primaryButton: {
        value: '编辑',
        action: () => {
          if (this.onEdit) {
            this.onEdit(this.todo.id)
          }
        }
      },
      secondaryButton: {
        value: '删除',
        fontColor: '#ff4444',
        action: () => {
          this.confirmDelete()
        }
      }
    })
  }

  // 确认删除
  private confirmDelete() {
    AlertDialog.show({
      title: '确认删除',
      message: '确定要删除这个待办事项吗？此操作无法撤销。',
      primaryButton: {
        value: '取消',
        action: () => {}
      },
      secondaryButton: {
        value: '删除',
        fontColor: '#ff4444',
        action: () => {
          if (this.onDelete) {
            this.onDelete(this.todo.id)
          }
        }
      }
    })
  }
}
