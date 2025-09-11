// 创作页面交互逻辑

// ===== 全局变量 =====
let currentCategory = '全部';
let currentView = 'grid';
let selectedTemplate = null;

// ===== 模板数据 =====
const templatesData = [
    {
        id: 'campus-daily',
        title: '校园日常拼贴',
        description: '记录美好的校园时光',
        category: '校园生活',
        ratio: '4:5',
        image: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=400&q=80',
        usageCount: 1200,
        rating: 4.8,
        badges: ['hot'],
        features: ['支持多尺寸', '可自定义色彩', '可编辑文字']
    },
    {
        id: 'club-poster',
        title: '社团招新海报',
        description: '制作吸引人的招新海报',
        category: '校园生活',
        ratio: '9:16',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
        usageCount: 856,
        rating: 4.9,
        badges: ['new'],
        features: ['支持多尺寸', '可自定义色彩', '可编辑文字', '预设排版']
    },
    {
        id: 'citywalk',
        title: '城市漫步记录',
        description: '分享你的城市探索之旅',
        category: '城市探索',
        ratio: '9:16',
        image: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=400&q=80',
        usageCount: 2100,
        rating: 4.7,
        badges: [],
        features: ['支持多尺寸', '可自定义色彩', '可编辑文字', '地图标记']
    },
    {
        id: 'food-diary',
        title: '美食日记',
        description: '记录每一次味觉的享受',
        category: '美食记录',
        ratio: '1:1',
        image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&q=80',
        usageCount: 3200,
        rating: 4.9,
        badges: [],
        features: ['支持多尺寸', '可自定义色彩', '可编辑文字', '评分系统']
    },
    {
        id: 'makeup-look',
        title: '妆容分享',
        description: '展示你的美妆技巧',
        category: '美妆时尚',
        ratio: '4:5',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
        usageCount: 987,
        rating: 4.6,
        badges: ['trending'],
        features: ['支持多尺寸', '可自定义色彩', '可编辑文字', '滤镜效果']
    },
    {
        id: 'study-notes',
        title: '学习笔记',
        description: '整理你的学习心得',
        category: '学习记录',
        ratio: '4:5',
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80',
        usageCount: 1800,
        rating: 4.8,
        badges: [],
        features: ['支持多尺寸', '可自定义色彩', '可编辑文字', '思维导图']
    }
];

// ===== 页面初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    initCategoryFilter();
    initViewToggle();
    initSearchInput();
    renderTemplates();
    
    // 页面加载动画
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// ===== 分类筛选 =====
function initCategoryFilter() {
    const categoryItems = document.querySelectorAll('.category-item');
    
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            // 移除所有活动状态
            categoryItems.forEach(cat => cat.classList.remove('active'));
            // 添加活动状态到当前项
            item.classList.add('active');
            
            // 获取分类名称
            currentCategory = item.querySelector('.category-name').textContent;
            
            // 重新渲染模板
            renderTemplates();
            
            // 添加触觉反馈
            if ('vibrate' in navigator) {
                navigator.vibrate(5);
            }
            
            // 显示筛选提示
            window.HarmonyUtils?.showToast(`已切换到"${currentCategory}"分类`, 'info', 2000);
        });
    });
}

// ===== 视图切换 =====
function initViewToggle() {
    const gridBtn = document.querySelector('.view-grid');
    const listBtn = document.querySelector('.view-list');
    const templatesGrid = document.querySelector('.templates-grid');
    
    gridBtn?.addEventListener('click', () => {
        currentView = 'grid';
        gridBtn.classList.add('active');
        listBtn?.classList.remove('active');
        templatesGrid?.classList.remove('list-view');
        
        window.HarmonyUtils?.showToast('已切换到网格视图', 'info', 1500);
    });
    
    listBtn?.addEventListener('click', () => {
        currentView = 'list';
        listBtn.classList.add('active');
        gridBtn?.classList.remove('active');
        templatesGrid?.classList.add('list-view');
        
        window.HarmonyUtils?.showToast('已切换到列表视图', 'info', 1500);
    });
}

// ===== 搜索功能 =====
function initSearchInput() {
    const searchInput = document.querySelector('.search-input');
    let searchTimeout;
    
    searchInput?.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = e.target.value.trim().toLowerCase();
            renderTemplates(query);
        }, 300);
    });
    
    searchInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = e.target.value.trim().toLowerCase();
            renderTemplates(query);
            
            if (query) {
                window.HarmonyUtils?.showToast(`搜索"${query}"`, 'info', 2000);
            }
        }
    });
}

// ===== 渲染模板 =====
function renderTemplates(searchQuery = '') {
    const templatesGrid = document.querySelector('.templates-grid');
    if (!templatesGrid) return;
    
    // 筛选模板
    let filteredTemplates = templatesData.filter(template => {
        const matchesCategory = currentCategory === '全部' || template.category === currentCategory;
        const matchesSearch = searchQuery === '' || 
            template.title.toLowerCase().includes(searchQuery) ||
            template.description.toLowerCase().includes(searchQuery) ||
            template.category.toLowerCase().includes(searchQuery);
        
        return matchesCategory && matchesSearch;
    });
    
    // 清空现有内容
    const existingCards = templatesGrid.querySelectorAll('.template-card');
    existingCards.forEach(card => card.remove());
    
    if (filteredTemplates.length === 0) {
        templatesGrid.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">😔</div>
                <h3 class="harmony-text-body-strong">没有找到相关模板</h3>
                <p class="harmony-text-caption">试试其他关键词或分类吧</p>
            </div>
        `;
        return;
    }
    
    // 渲染模板卡片
    filteredTemplates.forEach((template, index) => {
        const templateCard = createTemplateCard(template, index);
        templatesGrid.appendChild(templateCard);
    });
    
    // 重新添加加载更多按钮
    if (!templatesGrid.querySelector('.load-more-section')) {
        const loadMoreSection = document.createElement('div');
        loadMoreSection.className = 'load-more-section';
        loadMoreSection.innerHTML = `
            <button class="harmony-button secondary load-more-btn" onclick="loadMoreTemplates()">
                <span class="icon">↻</span>
                <span>加载更多</span>
            </button>
        `;
        templatesGrid.parentElement.appendChild(loadMoreSection);
    }
}

// ===== 创建模板卡片 =====
function createTemplateCard(template, index) {
    const card = document.createElement('div');
    card.className = 'template-card';
    card.style.animationDelay = `${index * 0.1}s`;
    card.onclick = () => selectTemplate(template.id);
    
    // 创建标签HTML
    const badgesHtml = template.badges.map(badge => {
        const badgeText = {
            'hot': '🔥 热门',
            'new': '✨ 新品',
            'trending': '📈 趋势'
        }[badge] || badge;
        
        return `<span class="template-badge ${badge}">${badgeText}</span>`;
    }).join('');
    
    card.innerHTML = `
        <div class="template-preview">
            <img src="${template.image}" alt="${template.title}" loading="lazy">
            <div class="template-overlay">
                <button class="harmony-button primary">使用模板</button>
            </div>
            <div class="template-badges">
                <span class="template-badge ratio">${template.ratio}</span>
                ${badgesHtml}
            </div>
        </div>
        <div class="template-info">
            <h3 class="harmony-text-body-strong">${template.title}</h3>
            <p class="harmony-text-caption">${template.description}</p>
            <div class="template-meta">
                <span class="usage-count">已使用 ${formatUsageCount(template.usageCount)} 次</span>
                <span class="rating">⭐ ${template.rating}</span>
            </div>
        </div>
    `;
    
    return card;
}

// ===== 格式化使用次数 =====
function formatUsageCount(count) {
    if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
}

// ===== 选择模板 =====
function selectTemplate(templateId) {
    const template = templatesData.find(t => t.id === templateId);
    if (!template) return;
    
    selectedTemplate = template;
    showTemplateDialog(template);
    
    // 添加触觉反馈
    if ('vibrate' in navigator) {
        navigator.vibrate(10);
    }
}

// ===== 显示模板预览对话框 =====
function showTemplateDialog(template) {
    const dialog = document.getElementById('templateDialog');
    const previewImage = document.getElementById('previewImage');
    const templateTitle = document.getElementById('templateTitle');
    const templateDescription = document.getElementById('templateDescription');
    
    if (!dialog) return;
    
    // 设置内容
    previewImage.src = template.image;
    previewImage.alt = template.title;
    templateTitle.textContent = template.title;
    templateDescription.textContent = template.description;
    
    // 更新特性标签
    const featuresContainer = dialog.querySelector('.template-features');
    if (featuresContainer) {
        featuresContainer.innerHTML = template.features.map(feature => 
            `<div class="feature-tag">📱 ${feature}</div>`
        ).join('');
    }
    
    // 显示对话框
    dialog.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // 添加动画
    setTimeout(() => {
        dialog.querySelector('.dialog-content').style.transform = 'scale(1)';
    }, 10);
}

// ===== 关闭模板预览对话框 =====
function closeTemplateDialog() {
    const dialog = document.getElementById('templateDialog');
    if (!dialog) return;
    
    dialog.classList.remove('show');
    document.body.style.overflow = '';
    selectedTemplate = null;
}

// ===== 使用模板 =====
function useTemplate() {
    if (!selectedTemplate) return;
    
    // 显示加载状态
    window.HarmonyUtils?.showToast('正在加载编辑器...', 'info', 2000);
    
    // 模拟跳转到编辑器
    setTimeout(() => {
        window.HarmonyUtils?.showToast('编辑器加载完成！', 'success');
        // 这里可以跳转到编辑器页面
        // window.location.href = `editor.html?template=${selectedTemplate.id}`;
    }, 2000);
    
    closeTemplateDialog();
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

// ===== 加载更多模板 =====
function loadMoreTemplates() {
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
        
        window.HarmonyUtils?.showToast('已加载所有模板', 'info');
    }, 2000);
}

// ===== 对话框外部点击关闭 =====
document.addEventListener('click', (e) => {
    const dialog = document.getElementById('templateDialog');
    if (e.target === dialog) {
        closeTemplateDialog();
    }
});

// ===== ESC键关闭对话框 =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeTemplateDialog();
    }
});

// ===== 无结果样式 =====
const noResultsStyle = document.createElement('style');
noResultsStyle.textContent = `
    .no-results {
        grid-column: 1 / -1;
        text-align: center;
        padding: var(--harmony-space-4xl);
        color: var(--harmony-neutral-foreground-3);
    }
    
    .no-results-icon {
        font-size: 48px;
        margin-bottom: var(--harmony-space-lg);
    }
    
    .no-results h3 {
        margin-bottom: var(--harmony-space-sm);
        color: var(--harmony-neutral-foreground-2);
    }
`;
document.head.appendChild(noResultsStyle);
