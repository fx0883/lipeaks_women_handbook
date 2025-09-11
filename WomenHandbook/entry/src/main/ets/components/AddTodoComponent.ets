/**
 * 添加待办事项组件
 */
import type { CreateTodoData } from '../types/todo'
import { TodoCategory, TodoPriority, TodoStatus } from '../types/todo'
import { THEME_COLORS, VALIDATION } from '../constants/app'

@Component
export struct AddTodoComponent {
  @Prop visible: boolean = false
  onSave?: (data: CreateTodoData) => void
  onCancel?: () => void
  @State title: string = ''
  @State description: string = ''
  @State category: TodoCategory = TodoCategory.PERSONAL
  @State priority: TodoPriority = TodoPriority.MEDIUM
  @State dueDate: Date | undefined = undefined
  @State tags: string[] = []
  @State tagInput: string = ''
  @State showDatePicker: boolean = false

  // 重置表单
  private resetForm(): void {
    this.title = ''
    this.description = ''
    this.category = TodoCategory.PERSONAL
    this.priority = TodoPriority.MEDIUM
    this.dueDate = undefined
    this.tags = []
    this.tagInput = ''
  }

  // 添加标签
  private addTag(): void {
    const tag = this.tagInput.trim()
    if (tag && 
        tag.length <= VALIDATION.TAG_MAX_LENGTH && 
        this.tags.length < VALIDATION.TAG_MAX_COUNT && 
        !this.tags.includes(tag)) {
      this.tags.push(tag)
      this.tagInput = ''
    }
  }

  // 删除标签
  private removeTag(index: number): void {
    this.tags.splice(index, 1)
  }

  // 保存待办事项
  private save(): void {
    if (!this.title.trim()) {
      AlertDialog.show({
        title: '提示',
        message: '请输入待办事项标题'
      })
      return
    }

    if (this.title.length > VALIDATION.TODO_TITLE_MAX_LENGTH) {
      AlertDialog.show({
        title: '提示',
        message: `标题长度不能超过${VALIDATION.TODO_TITLE_MAX_LENGTH}个字符`
      })
      return
    }

    if (this.description.length > VALIDATION.TODO_DESCRIPTION_MAX_LENGTH) {
      AlertDialog.show({
        title: '提示',
        message: `描述长度不能超过${VALIDATION.TODO_DESCRIPTION_MAX_LENGTH}个字符`
      })
      return
    }

    const todoData: CreateTodoData = {
      title: this.title.trim(),
      description: this.description.trim() || undefined,
      category: this.category,
      priority: this.priority,
      dueDate: this.dueDate,
      tags: [...this.tags]
    }

    if (this.onSave) {
      this.onSave(todoData)
    }

    this.resetForm()
  }

  // 取消
  private cancel(): void {
    this.resetForm()
    if (this.onCancel) {
      this.onCancel()
    }
  }

  // 格式化日期显示
  private formatDateDisplay(date: Date): string {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  build() {
    if (this.visible) {
      Column() {
        // 遮罩层
        Column()
          .width('100%')
          .height('100%')
          .backgroundColor('rgba(0, 0, 0, 0.5)')
          .onClick(() => {
            this.cancel()
          })

        // 表单容器
        Column() {
          // 标题栏
          Row() {
            Text('添加待办事项')
              .fontSize(18)
              .fontWeight(FontWeight.Bold)
              .fontColor('#333333')
            
            Blank()

            Button('取消')
              .fontSize(14)
              .fontColor('#666666')
              .backgroundColor(Color.Transparent)
              .onClick(() => {
                this.cancel()
              })
          }
          .width('100%')
          .padding({ left: 20, right: 20, top: 20, bottom: 16 })

          Divider().color('#f0f0f0')

          // 表单内容
          Scroll() {
            Column() {
              // 标题输入
              Column() {
                Text('标题 *')
                  .fontSize(14)
                  .fontColor('#333333')
                  .alignSelf(ItemAlign.Start)
                  .margin({ bottom: 8 })

                TextInput({ placeholder: '请输入待办事项标题' })
                  .fontSize(16)
                  .backgroundColor('#f8f9fa')
                  .border({ radius: 8 })
                  .maxLength(VALIDATION.TODO_TITLE_MAX_LENGTH)
                  .onChange((value) => {
                    this.title = value
                  })

                Text(`${this.title.length}/${VALIDATION.TODO_TITLE_MAX_LENGTH}`)
                  .fontSize(10)
                  .fontColor('#999999')
                  .alignSelf(ItemAlign.End)
                  .margin({ top: 4 })
              }
              .width('100%')
              .alignItems(HorizontalAlign.Start)
              .margin({ bottom: 20 })

              // 描述输入
              Column() {
                Text('描述')
                  .fontSize(14)
                  .fontColor('#333333')
                  .alignSelf(ItemAlign.Start)
                  .margin({ bottom: 8 })

                TextArea({ placeholder: '请输入详细描述（可选）' })
                  .fontSize(14)
                  .backgroundColor('#f8f9fa')
                  .border({ radius: 8 })
                  .height(80)
                  .maxLength(VALIDATION.TODO_DESCRIPTION_MAX_LENGTH)
                  .onChange((value) => {
                    this.description = value
                  })

                Text(`${this.description.length}/${VALIDATION.TODO_DESCRIPTION_MAX_LENGTH}`)
                  .fontSize(10)
                  .fontColor('#999999')
                  .alignSelf(ItemAlign.End)
                  .margin({ top: 4 })
              }
              .width('100%')
              .alignItems(HorizontalAlign.Start)
              .margin({ bottom: 20 })

              // 分类选择
              Column() {
                Text('分类')
                  .fontSize(14)
                  .fontColor('#333333')
                  .alignSelf(ItemAlign.Start)
                  .margin({ bottom: 8 })

                Flex({ wrap: FlexWrap.Wrap }) {
                  ForEach(Object.values(TodoCategory), (cat: TodoCategory) => {
                    Button(cat)
                      .fontSize(14)
                      .fontColor(this.category === cat ? Color.White : THEME_COLORS.PINK.PRIMARY)
                      .backgroundColor(this.category === cat ? THEME_COLORS.PINK.PRIMARY : Color.Transparent)
                      .border({
                        width: 1,
                        color: THEME_COLORS.PINK.PRIMARY,
                        radius: 16
                      })
                      .padding({ left: 16, right: 16, top: 8, bottom: 8 })
                      .margin({ right: 8, bottom: 8 })
                      .onClick(() => {
                        this.category = cat
                      })
                  })
                }
              }
              .width('100%')
              .alignItems(HorizontalAlign.Start)
              .margin({ bottom: 20 })

              // 优先级选择
              Column() {
                Text('优先级')
                  .fontSize(14)
                  .fontColor('#333333')
                  .alignSelf(ItemAlign.Start)
                  .margin({ bottom: 8 })

                Flex({ wrap: FlexWrap.Wrap }) {
                  ForEach(Object.values(TodoPriority), (pri: TodoPriority) => {
                    Button(pri)
                      .fontSize(14)
                      .fontColor(this.priority === pri ? Color.White : THEME_COLORS.PINK.PRIMARY)
                      .backgroundColor(this.priority === pri ? THEME_COLORS.PINK.PRIMARY : Color.Transparent)
                      .border({
                        width: 1,
                        color: THEME_COLORS.PINK.PRIMARY,
                        radius: 16
                      })
                      .padding({ left: 16, right: 16, top: 8, bottom: 8 })
                      .margin({ right: 8, bottom: 8 })
                      .onClick(() => {
                        this.priority = pri
                      })
                  })
                }
              }
              .width('100%')
              .alignItems(HorizontalAlign.Start)
              .margin({ bottom: 20 })

              // 截止日期
              Column() {
                Text('截止日期')
                  .fontSize(14)
                  .fontColor('#333333')
                  .alignSelf(ItemAlign.Start)
                  .margin({ bottom: 8 })

                Button() {
                  Text(this.dueDate ? this.formatDateDisplay(this.dueDate) : '选择截止日期（可选）')
                    .fontSize(14)
                    .fontColor(this.dueDate ? '#333333' : '#999999')
                }
                .width('100%')
                .backgroundColor('#f8f9fa')
                .border({ radius: 8 })
                .padding(12)
                .onClick(() => {
                  DatePickerDialog.show({
                    start: new Date(),
                    end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 一年后
                    selected: this.dueDate || new Date(),
                    onDateAccept: (value: Date) => {
                      this.dueDate = value
                    }
                  })
                })

                if (this.dueDate) {
                  Button('清除日期')
                    .fontSize(12)
                    .fontColor('#666666')
                    .backgroundColor(Color.Transparent)
                    .alignSelf(ItemAlign.End)
                    .margin({ top: 4 })
                    .onClick(() => {
                      this.dueDate = undefined
                    })
                }
              }
              .width('100%')
              .alignItems(HorizontalAlign.Start)
              .margin({ bottom: 20 })

              // 标签
              Column() {
                Row() {
                  Text('标签')
                    .fontSize(14)
                    .fontColor('#333333')
                  Text(`(${this.tags.length}/${VALIDATION.TAG_MAX_COUNT})`)
                    .fontSize(12)
                    .fontColor('#999999')
                    .margin({ left: 4 })
                }
                .margin({ bottom: 8 })

                // 标签输入
                Row() {
                  TextInput({ placeholder: '输入标签后按回车添加' })
                    .fontSize(14)
                    .backgroundColor('#f8f9fa')
                    .border({ radius: 8 })
                    .layoutWeight(1)
                    .maxLength(VALIDATION.TAG_MAX_LENGTH)
                    .onChange((value) => {
                      this.tagInput = value
                    })
                    .onSubmit(() => {
                      this.addTag()
                    })

                  Button('添加')
                    .fontSize(14)
                    .fontColor(THEME_COLORS.PINK.PRIMARY)
                    .backgroundColor(Color.Transparent)
                    .border({
                      width: 1,
                      color: THEME_COLORS.PINK.PRIMARY,
                      radius: 8
                    })
                    .margin({ left: 8 })
                    .enabled(this.tagInput.trim().length > 0 && this.tags.length < VALIDATION.TAG_MAX_COUNT)
                    .onClick(() => {
                      this.addTag()
                    })
                }
                .margin({ bottom: 8 })

                // 已添加的标签
                if (this.tags.length > 0) {
                  Flex({ wrap: FlexWrap.Wrap }) {
                    ForEach(this.tags, (tag: string, index: number) => {
                      Row() {
                        Text(`#${tag}`)
                          .fontSize(12)
                          .fontColor(THEME_COLORS.PINK.PRIMARY)

                        Text('×')
                          .fontSize(14)
                          .fontColor('#999999')
                          .margin({ left: 4 })
                          .onClick(() => {
                            this.removeTag(index)
                          })
                      }
                      .backgroundColor(THEME_COLORS.PINK.BACKGROUND)
                      .padding({ left: 8, right: 6, top: 4, bottom: 4 })
                      .borderRadius(12)
                      .margin({ right: 6, bottom: 6 })
                    }, (tag: string, index: number) => `${tag}_${index}`)
                  }
                }
              }
              .width('100%')
              .alignItems(HorizontalAlign.Start)
              .margin({ bottom: 20 })
            }
            .padding({ left: 20, right: 20, top: 16, bottom: 20 })
          }
          .layoutWeight(1)

          // 底部按钮
          Row() {
            Button('取消')
              .fontSize(16)
              .fontColor('#666666')
              .backgroundColor(Color.Transparent)
              .border({
                width: 1,
                color: '#ddd',
                radius: 8
              })
              .width('45%')
              .onClick(() => {
                this.cancel()
              })

            Button('保存')
              .fontSize(16)
              .fontColor(Color.White)
              .backgroundColor(THEME_COLORS.PINK.PRIMARY)
              .borderRadius(8)
              .width('45%')
              .enabled(this.title.trim().length > 0)
              .onClick(() => {
                this.save()
              })
          }
          .width('100%')
          .justifyContent(FlexAlign.SpaceBetween)
          .padding(20)
        }
        .width('100%')
        .height('90%')
        .backgroundColor(Color.White)
        .borderRadius({ topLeft: 16, topRight: 16 })
        .position({ x: 0, y: '10%' })
      }
      .width('100%')
      .height('100%')
      .position({ x: 0, y: 0 })
      .zIndex(1000)
    }
  }
}
