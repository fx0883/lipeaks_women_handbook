// ===== 待办功能脚本 =====

// 全局变量
let todos = [];
let achievements = [];
let moodRecords = [];
let taskSuggestions = [];
let currentTab = 'tasks';
let filters = {
    category: '',
    priority: '',
    status: '',
    search: ''
};
let selectedMood = '';
let completedTaskId = '';

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    loadMockData();
    initializeEventListeners();
    renderCurrentTab();
    updateStats();
});

// ===== 数据加载 =====
function loadMockData() {
    // 模拟任务数据
    todos = [
        {
            id: '1',
            title: '完成手账设计项目',
            description: '为春季主题设计一套完整的手账模板，包含月计划、周计划、日记录等页面',
            category: '工作',
            priority: '高',
            status: '进行中',
            dueDate: new Date('2024-03-25'),
            tags: ['设计', '手账', '春季', '模板'],
            createdAt: new Date('2024-03-15'),
            updatedAt: new Date('2024-03-20')
        },
        {
            id: '2',
            title: '学习Vue3高级特性',
            description: '深入学习Vue3的Composition API、响应式系统、性能优化等高级特性',
            category: '学习',
            priority: '中',
            status: '待办',
            dueDate: new Date('2024-04-10'),
            tags: ['Vue3', '前端', '技术', '学习'],
            createdAt: new Date('2024-03-18'),
            updatedAt: new Date('2024-03-18')
        },
        {
            id: '3',
            title: '整理房间和书桌',
            description: '彻底整理房间，清理书桌，整理书籍和文具，创造一个舒适的学习环境',
            category: '生活',
            priority: '中',
            status: '已完成',
            dueDate: new Date('2024-03-20'),
            completedAt: new Date('2024-03-19'),
            mood: '😊',
            tags: ['整理', '生活', '环境'],
            createdAt: new Date('2024-03-15'),
            updatedAt: new Date('2024-03-19')
        },
        {
            id: '4',
            title: '完成健身计划',
            description: '坚持一周的健身计划，包括有氧运动和力量训练，提升身体素质',
            category: '生活',
            priority: '高',
            status: '已完成',
            dueDate: new Date('2024-03-22'),
            completedAt: new Date('2024-03-22'),
            mood: '🤩',
            tags: ['健身', '健康', '运动'],
            createdAt: new Date('2024-03-16'),
            updatedAt: new Date('2024-03-22')
        },
        {
            id: '5',
            title: '阅读《设计心理学》',
            description: '阅读完《设计心理学》这本书，做好读书笔记，理解设计原则',
            category: '学习',
            priority: '中',
            status: '已完成',
            dueDate: new Date('2024-03-18'),
            completedAt: new Date('2024-03-17'),
            mood: '😌',
            tags: ['阅读', '设计', '心理学', '学习'],
            createdAt: new Date('2024-03-10'),
            updatedAt: new Date('2024-03-17')
        },
        {
            id: '6',
            title: '制作生日蛋糕',
            description: '为朋友制作一个精美的生日蛋糕，尝试新的装饰技巧',
            category: '娱乐',
            priority: '低',
            status: '已完成',
            dueDate: new Date('2024-03-19'),
            completedAt: new Date('2024-03-19'),
            mood: '😄',
            tags: ['烘焙', '生日', '朋友', '创意'],
            createdAt: new Date('2024-03-15'),
            updatedAt: new Date('2024-03-19')
        },
        {
            id: '7',
            title: '完成项目报告',
            description: '撰写并提交季度项目进展报告，包含数据分析和下一步计划',
            category: '工作',
            priority: '高',
            status: '已完成',
            dueDate: new Date('2024-03-21'),
            completedAt: new Date('2024-03-20'),
            mood: '😊',
            tags: ['工作', '报告', '项目', '分析'],
            createdAt: new Date('2024-03-14'),
            updatedAt: new Date('2024-03-20')
        },
        {
            id: '8',
            title: '学习摄影技巧',
            description: '学习基础摄影技巧，包括构图、光线、后期处理等',
            category: '学习',
            priority: '中',
            status: '进行中',
            dueDate: new Date('2024-04-05'),
            tags: ['摄影', '技巧', '学习', '艺术'],
            createdAt: new Date('2024-03-20'),
            updatedAt: new Date('2024-03-20')
        },
        {
            id: '9',
            title: '整理照片库',
            description: '整理手机和电脑中的照片，删除重复和无用的照片，建立分类文件夹',
            category: '生活',
            priority: '低',
            status: '待办',
            dueDate: new Date('2024-03-28'),
            tags: ['整理', '照片', '生活', '管理'],
            createdAt: new Date('2024-03-19'),
            updatedAt: new Date('2024-03-19')
        },
        {
            id: '10',
            title: '学习新菜谱',
            description: '学习制作3道新菜，提升厨艺技能，为家人准备美味餐点',
            category: '生活',
            priority: '中',
            status: '待办',
            dueDate: new Date('2024-03-30'),
            tags: ['烹饪', '菜谱', '学习', '生活'],
            createdAt: new Date('2024-03-18'),
            updatedAt: new Date('2024-03-18')
        },
        {
            id: '11',
            title: '完成在线课程',
            description: '完成UX设计在线课程，获得证书，提升专业技能',
            category: '学习',
            priority: '高',
            status: '进行中',
            dueDate: new Date('2024-04-15'),
            tags: ['UX设计', '在线课程', '学习', '证书'],
            createdAt: new Date('2024-03-16'),
            updatedAt: new Date('2024-03-16')
        },
        {
            id: '12',
            title: '规划周末旅行',
            description: '规划一次周末短途旅行，包括路线、住宿、景点等安排',
            category: '娱乐',
            priority: '中',
            status: '待办',
            dueDate: new Date('2024-03-23'),
            tags: ['旅行', '规划', '周末', '娱乐'],
            createdAt: new Date('2024-03-20'),
            updatedAt: new Date('2024-03-20')
        }
    ];

    // 模拟成就数据
    achievements = [
        {
            id: '1',
            type: 'first_task',
            title: '初次尝试',
            description: '完成第一个任务',
            icon: '🎯',
            unlockedAt: new Date('2024-03-17'),
            progress: 1,
            maxProgress: 1,
            isUnlocked: true
        },
        {
            id: '2',
            type: 'task_streak',
            title: '坚持不懈',
            description: '连续完成3天任务',
            icon: '🔥',
            unlockedAt: new Date('2024-03-22'),
            progress: 3,
            maxProgress: 3,
            isUnlocked: true
        },
        {
            id: '3',
            type: 'category_master',
            title: '生活达人',
            description: '完成5个生活类任务',
            icon: '🏠',
            unlockedAt: new Date('2024-03-22'),
            progress: 5,
            maxProgress: 5,
            isUnlocked: true
        },
        {
            id: '4',
            type: 'priority_focus',
            title: '重点突破',
            description: '完成3个高优先级任务',
            icon: '⭐',
            unlockedAt: new Date('2024-03-20'),
            progress: 3,
            maxProgress: 3,
            isUnlocked: true
        },
        {
            id: '5',
            type: 'mood_tracker',
            title: '心情记录者',
            description: '记录5次任务完成后的心情',
            icon: '😊',
            unlockedAt: new Date('2024-03-22'),
            progress: 5,
            maxProgress: 5,
            isUnlocked: true
        },
        {
            id: '6',
            type: 'perfect_week',
            title: '完美一周',
            description: '一周内完成所有计划任务',
            icon: '🌟',
            progress: 4,
            maxProgress: 7,
            isUnlocked: false
        },
        {
            id: '7',
            type: 'monthly_goal',
            title: '月度目标',
            description: '一个月内完成20个任务',
            icon: '📅',
            progress: 7,
            maxProgress: 20,
            isUnlocked: false
        },
        {
            id: '8',
            type: 'social_sharer',
            title: '分享达人',
            description: '分享3次任务完成成果',
            icon: '📤',
            progress: 0,
            maxProgress: 3,
            isUnlocked: false
        }
    ];

    // 模拟心情记录
    moodRecords = [
        {
            id: '1',
            todoId: '3',
            mood: '😊',
            note: '整理完房间感觉很清爽，心情很好！',
            timestamp: new Date('2024-03-19'),
            taskTitle: '整理房间和书桌'
        },
        {
            id: '2',
            todoId: '4',
            mood: '🤩',
            note: '完成健身计划很有成就感，感觉身体更健康了',
            timestamp: new Date('2024-03-22'),
            taskTitle: '完成健身计划'
        },
        {
            id: '3',
            todoId: '5',
            mood: '😌',
            note: '读完这本书很有收获，心情平静满足',
            timestamp: new Date('2024-03-17'),
            taskTitle: '阅读《设计心理学》'
        },
        {
            id: '4',
            todoId: '6',
            mood: '😄',
            note: '朋友很喜欢这个蛋糕，我也很开心！',
            timestamp: new Date('2024-03-19'),
            taskTitle: '制作生日蛋糕'
        },
        {
            id: '5',
            todoId: '7',
            mood: '😊',
            note: '报告完成得很顺利，领导很满意',
            timestamp: new Date('2024-03-20'),
            taskTitle: '完成项目报告'
        }
    ];

    // 模拟智能建议
    taskSuggestions = [
        {
            id: '1',
            title: '学习手绘技巧',
            description: '基于你的手账设计项目，建议学习基础手绘技巧来提升设计质量',
            category: '学习',
            priority: '中',
            reason: '与当前进行中的手账项目相关',
            confidence: 85,
            tags: ['手绘', '设计', '技能提升']
        },
        {
            id: '2',
            title: '制定每日计划模板',
            description: '创建一个个性化的每日计划模板，提高时间管理效率',
            category: '工作',
            priority: '中',
            reason: '基于你的工作习惯和已完成项目',
            confidence: 78,
            tags: ['计划', '模板', '效率']
        },
        {
            id: '3',
            title: '学习色彩搭配',
            description: '深入学习色彩理论和搭配技巧，提升手账设计的视觉效果',
            category: '学习',
            priority: '中',
            reason: '与手账设计项目高度相关',
            confidence: 92,
            tags: ['色彩', '设计', '视觉']
        }
    ];
}

// ===== 事件监听器 =====
function initializeEventListeners() {
    // 标签页切换
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    // 筛选器
    document.getElementById('category-filter').addEventListener('change', applyFilters);
    document.getElementById('priority-filter').addEventListener('change', applyFilters);
    document.getElementById('status-filter').addEventListener('change', applyFilters);

    // 表单提交
    document.getElementById('create-form').addEventListener('submit', function(e) {
        e.preventDefault();
        createTask();
    });
}

// ===== 标签页管理 =====
function switchTab(tabName) {
    currentTab = tabName;
    
    // 更新标签按钮状态
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // 更新标签内容显示
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // 渲染对应内容
    renderCurrentTab();
}

function renderCurrentTab() {
    switch(currentTab) {
        case 'tasks':
            renderTasks();
            break;
        case 'achievements':
            renderAchievements();
            break;
        case 'mood':
            renderMoodRecords();
            break;
        case 'suggestions':
            renderSuggestions();
            break;
    }
}

// ===== 任务管理 =====
function renderTasks() {
    const tasksList = document.getElementById('tasks-list');
    const filteredTasks = getFilteredTasks();
    
    if (filteredTasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📝</div>
                <h3>没有找到任务</h3>
                <p>尝试调整筛选条件或创建新任务</p>
                <button class="harmony-button primary" onclick="showCreateModal()">创建第一个任务</button>
            </div>
        `;
        return;
    }
    
    tasksList.innerHTML = filteredTasks.map(task => createTaskHTML(task)).join('');
    updateTaskCount(filteredTasks.length);
}

function createTaskHTML(task) {
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== '已完成';
    const taskClasses = ['task-item'];
    
    if (task.status === '已完成') taskClasses.push('completed');
    if (task.priority === '高') taskClasses.push('high-priority');
    if (isOverdue) taskClasses.push('overdue');
    
    return `
        <div class="${taskClasses.join(' ')}" onclick="showTaskDetail('${task.id}')">
            <div class="task-header">
                <div class="task-checkbox ${task.status === '已完成' ? 'checked' : ''}" 
                     onclick="event.stopPropagation(); toggleTaskStatus('${task.id}')">
                </div>
                <div class="task-meta">
                    <span class="task-badge category-${getCategoryClass(task.category)}">${task.category}</span>
                    <span class="task-badge priority-${getPriorityClass(task.priority)}">${task.priority}</span>
                    <span class="task-badge status-${getStatusClass(task.status)}">${task.status}</span>
                </div>
            </div>
            
            <div class="task-content">
                <h4 class="task-title">${task.title}</h4>
                <p class="task-description">${task.description || ''}</p>
            </div>
            
            ${task.tags && task.tags.length > 0 ? `
                <div class="task-tags">
                    ${task.tags.map(tag => `<span class="task-tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
            
            <div class="task-footer">
                <div class="task-dates">
                    ${task.dueDate ? `<div class="due-date">截止: ${formatDate(task.dueDate)}</div>` : ''}
                    ${task.completedAt ? `<div class="completed-date">完成: ${formatDate(task.completedAt)}</div>` : ''}
                </div>
                ${task.mood ? `<div class="task-mood">${task.mood}</div>` : ''}
            </div>
            
            ${task.status !== '已完成' ? `
                <div class="task-actions">
                    <button class="harmony-button primary" onclick="event.stopPropagation(); completeTask('${task.id}')">
                        ✅ 完成
                    </button>
                    <button class="harmony-button secondary" onclick="event.stopPropagation(); editTask('${task.id}')">
                        ✏️ 编辑
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}

function getFilteredTasks() {
    return todos.filter(task => {
        if (filters.category && task.category !== filters.category) return false;
        if (filters.priority && task.priority !== filters.priority) return false;
        if (filters.status && task.status !== filters.status) return false;
        if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
        return true;
    });
}

function getCategoryClass(category) {
    const categoryMap = {
        '学习': 'study',
        '工作': 'work',
        '生活': 'life',
        '娱乐': 'entertainment'
    };
    return categoryMap[category] || 'default';
}

function getPriorityClass(priority) {
    const priorityMap = {
        '高': 'high',
        '中': 'medium',
        '低': 'low'
    };
    return priorityMap[priority] || 'default';
}

function getStatusClass(status) {
    const statusMap = {
        '待办': 'todo',
        '进行中': 'progress',
        '已完成': 'completed'
    };
    return statusMap[status] || 'default';
}

function formatDate(date) {
    return new Intl.DateTimeFormat('zh-CN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

function updateTaskCount(count) {
    const taskCountElements = document.querySelectorAll('.task-count');
    taskCountElements.forEach(element => {
        element.textContent = `${count} 个任务`;
    });
}

// ===== 任务操作 =====
function toggleTaskStatus(taskId) {
    const task = todos.find(t => t.id === taskId);
    if (!task) return;
    
    if (task.status === '已完成') {
        task.status = '待办';
        task.completedAt = null;
        task.mood = null;
    } else {
        completeTask(taskId);
        return;
    }
    
    task.updatedAt = new Date();
    updateStats();
    renderTasks();
    showToast('任务状态已更新');
}

function completeTask(taskId) {
    const task = todos.find(t => t.id === taskId);
    if (!task) return;
    
    task.status = '已完成';
    task.completedAt = new Date();
    task.updatedAt = new Date();
    
    completedTaskId = taskId;
    showCelebrationModal();
    
    updateStats();
    renderTasks();
}

function editTask(taskId) {
    // TODO: 实现编辑任务功能
    showToast('编辑功能开发中...');
}

function deleteTask(taskId) {
    if (!confirm('确定要删除这个任务吗？')) return;
    
    todos = todos.filter(t => t.id !== taskId);
    updateStats();
    renderTasks();
    showToast('任务已删除');
}

// ===== 筛选功能 =====
function toggleFilters() {
    const filtersSection = document.getElementById('filters-section');
    filtersSection.style.display = filtersSection.style.display === 'none' ? 'block' : 'none';
}

function applyFilters() {
    filters.category = document.getElementById('category-filter').value;
    filters.priority = document.getElementById('priority-filter').value;
    filters.status = document.getElementById('status-filter').value;
    
    renderTasks();
}

function clearFilters() {
    filters = { category: '', priority: '', status: '', search: '' };
    
    document.getElementById('category-filter').value = '';
    document.getElementById('priority-filter').value = '';
    document.getElementById('status-filter').value = '';
    
    renderTasks();
    showToast('筛选条件已清除');
}

// ===== 统计数据 =====
function updateStats() {
    const totalTasks = todos.length;
    const completedTasks = todos.filter(t => t.status === '已完成').length;
    const progressTasks = todos.filter(t => t.status === '进行中').length;
    const pendingTasks = todos.filter(t => t.status === '待办').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    document.getElementById('total-tasks').textContent = totalTasks;
    document.getElementById('completed-tasks').textContent = completedTasks;
    document.getElementById('progress-tasks').textContent = progressTasks;
    document.getElementById('pending-tasks').textContent = pendingTasks;
    
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = `${completionRate}%`;
    }
    
    const completionText = document.querySelector('.completion-text');
    if (completionText) {
        completionText.textContent = `完成率: ${completionRate}%`;
    }
}

// ===== 成就系统 =====
function renderAchievements() {
    const achievementsList = document.getElementById('achievements-list');
    achievementsList.innerHTML = achievements.map(achievement => createAchievementHTML(achievement)).join('');
}

function createAchievementHTML(achievement) {
    return `
        <div class="achievement-item ${achievement.isUnlocked ? 'unlocked' : ''}">
            <div class="achievement-icon">${achievement.icon}</div>
            <h4 class="achievement-title">${achievement.title}</h4>
            <p class="achievement-description">${achievement.description}</p>
            <div class="achievement-progress">
                ${achievement.isUnlocked 
                    ? `✅ 已解锁 (${formatDate(achievement.unlockedAt)})`
                    : `进度: ${achievement.progress}/${achievement.maxProgress}`
                }
            </div>
        </div>
    `;
}

// ===== 心情追踪 =====
function renderMoodRecords() {
    const moodRecordsContainer = document.getElementById('mood-records');
    moodRecordsContainer.innerHTML = moodRecords.map(record => createMoodRecordHTML(record)).join('');
}

function createMoodRecordHTML(record) {
    return `
        <div class="mood-record">
            <div class="mood-record-header">
                <div class="mood-record-emoji">${record.mood}</div>
                <div class="mood-record-info">
                    <h4 class="mood-record-task">${record.taskTitle}</h4>
                    <p class="mood-record-time">${formatDate(record.timestamp)}</p>
                </div>
            </div>
            <p class="mood-record-note">${record.note}</p>
        </div>
    `;
}

// ===== 智能建议 =====
function renderSuggestions() {
    const suggestionsList = document.getElementById('suggestions-list');
    suggestionsList.innerHTML = taskSuggestions.map(suggestion => createSuggestionHTML(suggestion)).join('');
}

function createSuggestionHTML(suggestion) {
    return `
        <div class="suggestion-item" onclick="adoptSuggestion('${suggestion.id}')">
            <div class="suggestion-header">
                <div class="suggestion-info">
                    <h4 class="suggestion-title">${suggestion.title}</h4>
                    <p class="suggestion-description">${suggestion.description}</p>
                </div>
                <div class="suggestion-confidence">匹配度: ${suggestion.confidence}%</div>
            </div>
            <div class="suggestion-meta">
                <span class="task-badge category-${getCategoryClass(suggestion.category)}">${suggestion.category}</span>
                <span class="task-badge priority-${getPriorityClass(suggestion.priority)}">${suggestion.priority}</span>
                <p class="suggestion-reason">${suggestion.reason}</p>
            </div>
            <div class="suggestion-actions">
                <button class="harmony-button secondary" onclick="event.stopPropagation(); dismissSuggestion('${suggestion.id}')">
                    忽略
                </button>
                <button class="harmony-button primary" onclick="event.stopPropagation(); adoptSuggestion('${suggestion.id}')">
                    采纳建议
                </button>
            </div>
        </div>
    `;
}

function adoptSuggestion(suggestionId) {
    const suggestion = taskSuggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;
    
    // 预填表单
    document.getElementById('task-title').value = suggestion.title;
    document.getElementById('task-description').value = suggestion.description;
    document.getElementById('task-category').value = suggestion.category;
    document.getElementById('task-priority').value = suggestion.priority;
    document.getElementById('task-tags').value = suggestion.tags.join(', ');
    
    showCreateModal();
    showToast('建议已采纳，请完善任务信息');
}

function dismissSuggestion(suggestionId) {
    taskSuggestions = taskSuggestions.filter(s => s.id !== suggestionId);
    renderSuggestions();
    showToast('建议已忽略');
}

// ===== 弹窗管理 =====
function showCreateModal() {
    document.getElementById('create-modal').style.display = 'flex';
}

function hideCreateModal() {
    document.getElementById('create-modal').style.display = 'none';
    document.getElementById('create-form').reset();
}

function showTaskDetail(taskId) {
    const task = todos.find(t => t.id === taskId);
    if (!task) return;
    
    const modal = document.getElementById('task-detail-modal');
    const content = document.getElementById('task-detail-content');
    
    content.innerHTML = `
        <div class="task-detail">
            <h3>${task.title}</h3>
            <p>${task.description || '无描述'}</p>
            <div class="detail-meta">
                <p><strong>分类:</strong> ${task.category}</p>
                <p><strong>优先级:</strong> ${task.priority}</p>
                <p><strong>状态:</strong> ${task.status}</p>
                ${task.dueDate ? `<p><strong>截止日期:</strong> ${formatDate(task.dueDate)}</p>` : ''}
                ${task.completedAt ? `<p><strong>完成时间:</strong> ${formatDate(task.completedAt)}</p>` : ''}
                ${task.tags && task.tags.length > 0 ? `<p><strong>标签:</strong> ${task.tags.join(', ')}</p>` : ''}
                ${task.mood ? `<p><strong>完成心情:</strong> ${task.mood}</p>` : ''}
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function hideTaskDetailModal() {
    document.getElementById('task-detail-modal').style.display = 'none';
}

function showCelebrationModal() {
    const task = todos.find(t => t.id === completedTaskId);
    document.getElementById('celebration-text').textContent = `恭喜你完成了"${task?.title}"！`;
    document.getElementById('celebration-modal').style.display = 'flex';
}

function hideCelebrationModal() {
    document.getElementById('celebration-modal').style.display = 'none';
    completedTaskId = '';
    selectedMood = '';
    document.getElementById('mood-note').value = '';
    document.querySelectorAll('.mood-button').forEach(btn => btn.classList.remove('selected'));
}

// ===== 任务创建 =====
function createTask() {
    const title = document.getElementById('task-title').value.trim();
    const description = document.getElementById('task-description').value.trim();
    const category = document.getElementById('task-category').value;
    const priority = document.getElementById('task-priority').value;
    const dueDate = document.getElementById('task-due-date').value;
    const tags = document.getElementById('task-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    if (!title || !category || !priority) {
        showToast('请填写必填字段');
        return;
    }
    
    const newTask = {
        id: Date.now().toString(),
        title,
        description,
        category,
        priority,
        status: '待办',
        dueDate: dueDate ? new Date(dueDate) : null,
        tags,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    
    todos.unshift(newTask);
    updateStats();
    renderTasks();
    hideCreateModal();
    showToast('任务创建成功！');
}

// ===== 心情记录 =====
function selectMood(mood) {
    selectedMood = mood;
    document.querySelectorAll('.mood-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    document.querySelector(`[data-mood="${mood}"]`).classList.add('selected');
}

function saveMoodRecord() {
    if (!selectedMood) {
        showToast('请选择心情');
        return;
    }
    
    const task = todos.find(t => t.id === completedTaskId);
    const note = document.getElementById('mood-note').value.trim();
    
    // 更新任务心情
    task.mood = selectedMood;
    
    // 添加心情记录
    const moodRecord = {
        id: Date.now().toString(),
        todoId: completedTaskId,
        mood: selectedMood,
        note: note || '',
        timestamp: new Date(),
        taskTitle: task.title
    };
    
    moodRecords.unshift(moodRecord);
    
    hideCelebrationModal();
    renderTasks();
    showToast('心情记录已保存！');
}

// ===== 其他功能 =====
function toggleView() {
    // TODO: 实现视图切换功能
    showToast('视图切换功能开发中...');
}

function toggleSelectMode() {
    // TODO: 实现批量选择模式
    showToast('批量操作功能开发中...');
}

function editCurrentTask() {
    // TODO: 实现编辑当前任务功能
    showToast('编辑功能开发中...');
}

function goBack() {
    window.history.back();
}

// 全局变量导出供其他脚本使用
window.todoApp = {
    todos,
    achievements,
    moodRecords,
    taskSuggestions,
    renderCurrentTab,
    updateStats
};
