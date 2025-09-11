// 相册页面交互逻辑

// ===== 全局变量 =====
let currentFilter = 'all';
let currentView = 'grid';
let isSelectMode = false;
let selectedWorks = new Set();

// ===== 作品数据 =====
const worksData = [
    {
        id: 1,
        title: '校园时光',
        category: 'campus',
        date: '2024-12-15',
        image: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=400&q=80',
        likes: 24,
        views: 156,
        shares: 8,
        ratio: '4:5'
    },
    {
        id: 2,
        title: '美食记录',
        category: 'food',
        date: '2024-12-14',
        image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&q=80',
        likes: 42,
        views: 203,
        shares: 15,
        ratio: '1:1',
        liked: true
    },
    {
        id: 3,
        title: '城市漫步',
        category: 'travel',
        date: '2024-12-13',
        image: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=400&q=80',
        likes: 18,
        views: 89,
        shares: 5,
        ratio: '9:16'
    },
    {
        id: 4,
        title: '妆容分享',
        category: 'beauty',
        date: '2024-12-12',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
        likes: 31,
        views: 178,
        shares: 12,
        ratio: '4:5'
    },
    {
        id: 5,
        title: '社团活动',
        category: 'campus',
        date: '2024-12-11',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
        likes: 15,
        views: 67,
        shares: 3,
        ratio: '9:16'
    },
    {
        id: 6,
        title: '心情日记',
        category: 'mood',
        date: '2024-12-10',
        image: 'https://images.unsplash.com/photo-1553729784-e91953dec042?w=400&q=80',
        likes: 27,
        views: 134,
        shares: 9,
        ratio: '1:1'
    }
];

// ===== 页面初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    renderWorks();
    updateStats();
    
    // 页面加载动画
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// ===== 筛选作品 =====
function filterWorks(category) {
    currentFilter = category;
    
    // 更新筛选按钮状态
    document.querySelectorAll('.filter-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.filter-item').classList.add('active');
    
    // 重新渲染作品
    renderWorks();
    
    // 显示筛选提示
    const categoryNames = {
        'all': '全部',
        'campus': '校园',
        'food': '美食',
        'travel': '旅行',
        'beauty': '美妆',
        'mood': '心情'
    };
    
    window.HarmonyUtils?.showToast(`已切换到"${categoryNames[category]}"分类`, 'info', 2000);
}

// ===== 切换视图 =====
function switchView(viewType) {
    currentView = viewType;
    
    const gridBtn = document.querySelector('.view-grid');
    const waterfallBtn = document.querySelector('.view-waterfall');
    const worksGrid = document.querySelector('.works-grid');
    
    if (viewType === 'grid') {
        gridBtn?.classList.add('active');
        waterfallBtn?.classList.remove('active');
        worksGrid?.classList.remove('waterfall');
    } else {
        waterfallBtn?.classList.add('active');
        gridBtn?.classList.remove('active');
        worksGrid?.classList.add('waterfall');
    }
    
    window.HarmonyUtils?.showToast(`已切换到${viewType === 'grid' ? '网格' : '瀑布流'}视图`, 'info', 1500);
}

// ===== 渲染作品 =====
function renderWorks() {
    const worksGrid = document.getElementById('worksGrid');
    if (!worksGrid) return;
    
    // 筛选作品
    let filteredWorks = worksData;
    if (currentFilter !== 'all') {
        filteredWorks = worksData.filter(work => work.category === currentFilter);
    }
    
    // 清空现有内容
    worksGrid.innerHTML = '';
    
    if (filteredWorks.length === 0) {
        worksGrid.innerHTML = `
            <div class="no-works" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--harmony-neutral-foreground-3);">
                <div style="font-size: 48px; margin-bottom: 16px;">📷</div>
                <h3>暂无作品</h3>
                <p>快去创作第一个作品吧！</p>
            </div>
        `;
        return;
    }
    
    // 渲染作品项目
    filteredWorks.forEach((work, index) => {
        const workElement = createWorkElement(work, index);
        worksGrid.appendChild(workElement);
    });
}

// ===== 创建作品元素 =====
function createWorkElement(work, index) {
    const workDiv = document.createElement('div');
    workDiv.className = 'work-item';
    workDiv.setAttribute('data-category', work.category);
    workDiv.style.animationDelay = `${index * 0.1}s`;
    workDiv.onclick = () => openWork(work.id);
    
    const likedClass = work.liked ? 'liked' : '';
    
    workDiv.innerHTML = `
        <div class="work-image">
            <img src="${work.image}" alt="${work.title}" loading="lazy">
            <div class="work-overlay">
                <div class="work-actions">
                    <button class="action-btn like ${likedClass}" onclick="event.stopPropagation(); toggleLike(${work.id})">
                        <span class="icon">❤️</span>
                        <span class="count">${work.likes}</span>
                    </button>
                    <button class="action-btn share" onclick="event.stopPropagation(); shareWork(${work.id})">
                        <span class="icon">↗️</span>
                    </button>
                </div>
            </div>
            <div class="work-badges">
                <span class="work-badge">${work.ratio}</span>
            </div>
        </div>
        <div class="work-info">
            <h4 class="work-title">${work.title}</h4>
            <p class="work-date">${formatDate(work.date)}</p>
        </div>
        <div class="work-checkbox">
            <input type="checkbox" class="harmony-checkbox" onchange="toggleWorkSelection(${work.id}, this.checked)">
        </div>
    `;
    
    return workDiv;
}

// ===== 格式化日期 =====
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    
    return date.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// ===== 更新统计信息 =====
function updateStats() {
    const totalWorks = worksData.length;
    const totalLikes = worksData.reduce((sum, work) => sum + work.likes, 0);
    const totalShares = worksData.reduce((sum, work) => sum + work.shares, 0);
    
    // 计算本月创作数量
    const currentMonth = new Date().getMonth();
    const thisMonthWorks = worksData.filter(work => {
        const workMonth = new Date(work.date).getMonth();
        return workMonth === currentMonth;
    }).length;
    
    // 更新统计显示
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 4) {
        statNumbers[0].textContent = totalWorks;
        statNumbers[1].textContent = formatNumber(totalLikes);
        statNumbers[2].textContent = thisMonthWorks;
        statNumbers[3].textContent = totalShares;
    }
}

// ===== 格式化数字 =====
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

// ===== 切换选择模式 =====
function toggleSelectMode() {
    isSelectMode = !isSelectMode;
    const worksGrid = document.querySelector('.works-grid');
    const batchActions = document.getElementById('batchActions');
    
    if (isSelectMode) {
        worksGrid?.classList.add('selecting');
        batchActions?.classList.add('show');
    } else {
        worksGrid?.classList.remove('selecting');
        batchActions?.classList.remove('show');
        // 清空选择
        selectedWorks.clear();
        document.querySelectorAll('.harmony-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });
        updateSelectedCount();
    }
    
    window.HarmonyUtils?.showToast(
        isSelectMode ? '已进入选择模式' : '已退出选择模式', 
        'info', 
        2000
    );
}

// ===== 切换作品选择 =====
function toggleWorkSelection(workId, isSelected) {
    if (isSelected) {
        selectedWorks.add(workId);
    } else {
        selectedWorks.delete(workId);
    }
    updateSelectedCount();
}

// ===== 更新选择计数 =====
function updateSelectedCount() {
    const selectedCountElement = document.getElementById('selectedCount');
    if (selectedCountElement) {
        selectedCountElement.textContent = `已选择 ${selectedWorks.size} 项`;
    }
}

// ===== 全选 =====
function selectAll() {
    const checkboxes = document.querySelectorAll('.works-grid .harmony-checkbox');
    const isAllSelected = selectedWorks.size === checkboxes.length;
    
    if (isAllSelected) {
        // 取消全选
        selectedWorks.clear();
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        window.HarmonyUtils?.showToast('已取消全选', 'info', 2000);
    } else {
        // 全选
        checkboxes.forEach((checkbox, index) => {
            checkbox.checked = true;
            const workItems = document.querySelectorAll('.work-item');
            if (workItems[index]) {
                const workId = parseInt(workItems[index].getAttribute('data-work-id') || (index + 1));
                selectedWorks.add(workId);
            }
        });
        window.HarmonyUtils?.showToast('已全选', 'info', 2000);
    }
    
    updateSelectedCount();
}

// ===== 分享选中作品 =====
function shareSelected() {
    if (selectedWorks.size === 0) {
        window.HarmonyUtils?.showToast('请先选择要分享的作品', 'warning', 2000);
        return;
    }
    
    window.HarmonyUtils?.showToast(`已分享 ${selectedWorks.size} 个作品`, 'success', 2000);
    // 这里可以实现实际的分享功能
}

// ===== 删除选中作品 =====
function deleteSelected() {
    if (selectedWorks.size === 0) {
        window.HarmonyUtils?.showToast('请先选择要删除的作品', 'warning', 2000);
        return;
    }
    
    // 确认删除
    if (confirm(`确定要删除选中的 ${selectedWorks.size} 个作品吗？此操作无法撤销。`)) {
        window.HarmonyUtils?.showToast(`已删除 ${selectedWorks.size} 个作品`, 'success', 2000);
        // 这里可以实现实际的删除功能
        toggleSelectMode(); // 退出选择模式
    }
}

// ===== 切换点赞 =====
function toggleLike(workId) {
    const work = worksData.find(w => w.id === workId);
    if (!work) return;
    
    work.liked = !work.liked;
    work.likes += work.liked ? 1 : -1;
    
    // 更新UI
    renderWorks();
    updateStats();
    
    // 添加触觉反馈
    if ('vibrate' in navigator) {
        navigator.vibrate(work.liked ? 15 : 5);
    }
    
    window.HarmonyUtils?.showToast(
        work.liked ? '已点赞 ❤️' : '已取消点赞', 
        work.liked ? 'success' : 'info', 
        1500
    );
}

// ===== 分享作品 =====
function shareWork(workId) {
    const work = worksData.find(w => w.id === workId);
    if (!work) return;
    
    // 模拟分享功能
    if (navigator.share) {
        navigator.share({
            title: work.title,
            text: `查看我的作品：${work.title}`,
            url: window.location.href
        });
    } else {
        // 复制到剪贴板
        navigator.clipboard?.writeText(window.location.href);
        window.HarmonyUtils?.showToast('链接已复制到剪贴板', 'success', 2000);
    }
}

// ===== 打开作品详情 =====
function openWork(workId) {
    const work = worksData.find(w => w.id === workId);
    if (!work) return;
    
    showWorkDialog(work);
}

// ===== 显示作品预览对话框 =====
function showWorkDialog(work) {
    const dialog = document.getElementById('workDialog');
    const previewImage = document.getElementById('previewWorkImage');
    const previewTitle = document.getElementById('previewWorkTitle');
    const previewDate = document.getElementById('previewWorkDate');
    
    if (!dialog) return;
    
    // 设置内容
    previewImage.src = work.image;
    previewImage.alt = work.title;
    previewTitle.textContent = work.title;
    previewDate.textContent = formatDate(work.date);
    
    // 更新统计数据
    const statValues = dialog.querySelectorAll('.stat-value');
    if (statValues.length >= 3) {
        statValues[0].textContent = work.likes;
        statValues[1].textContent = work.views;
        statValues[2].textContent = work.shares;
    }
    
    // 显示对话框
    dialog.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // 记录查看
    work.views += 1;
}

// ===== 关闭作品预览对话框 =====
function closeWorkDialog() {
    const dialog = document.getElementById('workDialog');
    if (!dialog) return;
    
    dialog.classList.remove('show');
    document.body.style.overflow = '';
}

// ===== 编辑作品 =====
function editWork() {
    window.HarmonyUtils?.showToast('编辑功能开发中...', 'info', 2000);
    closeWorkDialog();
}

// ===== 显示排序选项 =====
function showSortOptions() {
    window.HarmonyUtils?.showToast('排序功能开发中...', 'info', 2000);
}

// ===== 加载更多作品 =====
function loadMoreWorks() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (!loadMoreBtn) return;
    
    // 显示加载状态
    loadMoreBtn.innerHTML = `
        <div class="loading-spinner"></div>
        <span>加载中...</span>
    `;
    loadMoreBtn.disabled = true;
    
    // 模拟加载延迟
    setTimeout(() => {
        loadMoreBtn.innerHTML = `
            <span class="icon">↻</span>
            <span>加载更多</span>
        `;
        loadMoreBtn.disabled = false;
        
        window.HarmonyUtils?.showToast('已加载所有作品', 'info', 2000);
    }, 2000);
}

// ===== 返回上一页 =====
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'index.html';
    }
}

// ===== 页面导航 =====
function navigateTo(page) {
    // 添加页面切换动画
    document.body.classList.add('page-transition');
    setTimeout(() => {
        window.location.href = page;
    }, 200);
}

// ===== 对话框外部点击关闭 =====
document.addEventListener('click', (e) => {
    const dialog = document.getElementById('workDialog');
    if (e.target === dialog) {
        closeWorkDialog();
    }
});

// ===== ESC键关闭对话框 =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeWorkDialog();
    }
});
