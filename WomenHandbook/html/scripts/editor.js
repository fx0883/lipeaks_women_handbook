// 编辑器页面交互逻辑

// ===== 全局变量 =====
let currentTemplate = null;
let projectData = {
    id: '',
    name: '',
    templateId: '',
    settings: {
        aspectRatio: '4:5',
        title: '我的美好时光',
        subtitle: '记录生活中的小确幸',
        fontSize: 24,
        textColor: '#333333',
        textAlign: 'center',
        filter: 'none',
        brightness: 0,
        contrast: 0,
        saturation: 0,
        borderStyle: 'none',
        borderWidth: 0,
        borderRadius: 12
    },
    stickers: [],
    backgroundUrl: '',
    lastSaved: null
};

let selectedSticker = null;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

// ===== 模板数据 (与create.js保持一致) =====
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
    initEditor();
    initEventListeners();
    loadTemplateFromUrl();
    
    // 页面加载动画
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// ===== 初始化编辑器 =====
function initEditor() {
    // 生成项目ID
    if (!projectData.id) {
        projectData.id = `project-${Date.now()}`;
    }
    
    // 设置默认项目名称
    updateProjectName();
    
    // 初始化控件值
    initControls();
}

// ===== 初始化事件监听器 =====
function initEventListeners() {
    // 文本输入
    const titleInput = document.getElementById('titleInput');
    const subtitleInput = document.getElementById('subtitleInput');
    const projectNameInput = document.getElementById('projectName');
    
    if (titleInput) {
        titleInput.addEventListener('input', (e) => {
            projectData.settings.title = e.target.value;
            updateTextDisplay();
        });
    }
    
    if (subtitleInput) {
        subtitleInput.addEventListener('input', (e) => {
            projectData.settings.subtitle = e.target.value;
            updateTextDisplay();
        });
    }
    
    if (projectNameInput) {
        projectNameInput.addEventListener('blur', (e) => {
            projectData.name = e.target.value || generateDefaultProjectName();
        });
    }
    
    // 宽高比切换
    const aspectButtons = document.querySelectorAll('.aspect-btn');
    aspectButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const ratio = btn.dataset.ratio;
            setAspectRatio(ratio);
        });
    });
    
    // 贴纸选择
    const stickerItems = document.querySelectorAll('.sticker-item');
    stickerItems.forEach(item => {
        item.addEventListener('click', () => {
            const stickerType = item.dataset.sticker;
            const stickerEmoji = item.textContent;
            addSticker(stickerType, stickerEmoji);
        });
    });
    
    // 滤镜选择
    const filterItems = document.querySelectorAll('.filter-item');
    filterItems.forEach(item => {
        item.addEventListener('click', () => {
            const filter = item.dataset.filter;
            setFilter(filter);
        });
    });
    
    // 颜色选择
    const colorItems = document.querySelectorAll('.color-item');
    colorItems.forEach(item => {
        item.addEventListener('click', () => {
            const color = item.dataset.color;
            setTextColor(color);
        });
    });
    
    // 对齐方式
    const alignButtons = document.querySelectorAll('.align-btn');
    alignButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const align = btn.dataset.align;
            setTextAlign(align);
        });
    });
    
    // 边框样式
    const borderButtons = document.querySelectorAll('.border-btn');
    borderButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const border = btn.dataset.border;
            setBorderStyle(border);
        });
    });
    
    // 滑块控件
    initSliders();
    
    // 文件选择
    const backgroundFileInput = document.getElementById('backgroundFileInput');
    const imageFileInput = document.getElementById('imageFileInput');
    
    if (backgroundFileInput) {
        backgroundFileInput.addEventListener('change', handleBackgroundUpload);
    }
    
    if (imageFileInput) {
        imageFileInput.addEventListener('change', handleImageUpload);
    }
}

// ===== 初始化滑块控件 =====
function initSliders() {
    // 字体大小
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    const fontSizeValue = document.getElementById('fontSizeValue');
    
    if (fontSizeSlider) {
        fontSizeSlider.addEventListener('input', (e) => {
            const size = parseInt(e.target.value);
            projectData.settings.fontSize = size;
            if (fontSizeValue) fontSizeValue.textContent = size + 'px';
            updateTextDisplay();
        });
    }
    
    // 亮度
    const brightnessSlider = document.getElementById('brightnessSlider');
    const brightnessValue = document.getElementById('brightnessValue');
    
    if (brightnessSlider) {
        brightnessSlider.addEventListener('input', (e) => {
            const brightness = parseInt(e.target.value);
            projectData.settings.brightness = brightness;
            if (brightnessValue) brightnessValue.textContent = brightness;
            applyImageAdjustments();
        });
    }
    
    // 对比度
    const contrastSlider = document.getElementById('contrastSlider');
    const contrastValue = document.getElementById('contrastValue');
    
    if (contrastSlider) {
        contrastSlider.addEventListener('input', (e) => {
            const contrast = parseInt(e.target.value);
            projectData.settings.contrast = contrast;
            if (contrastValue) contrastValue.textContent = contrast;
            applyImageAdjustments();
        });
    }
    
    // 饱和度
    const saturationSlider = document.getElementById('saturationSlider');
    const saturationValue = document.getElementById('saturationValue');
    
    if (saturationSlider) {
        saturationSlider.addEventListener('input', (e) => {
            const saturation = parseInt(e.target.value);
            projectData.settings.saturation = saturation;
            if (saturationValue) saturationValue.textContent = saturation;
            applyImageAdjustments();
        });
    }
    
    // 边框宽度
    const borderWidthSlider = document.getElementById('borderWidthSlider');
    const borderWidthValue = document.getElementById('borderWidthValue');
    
    if (borderWidthSlider) {
        borderWidthSlider.addEventListener('input', (e) => {
            const width = parseInt(e.target.value);
            projectData.settings.borderWidth = width;
            if (borderWidthValue) borderWidthValue.textContent = width + 'px';
            applyBorderStyle();
        });
    }
    
    // 圆角大小
    const borderRadiusSlider = document.getElementById('borderRadiusSlider');
    const borderRadiusValue = document.getElementById('borderRadiusValue');
    
    if (borderRadiusSlider) {
        borderRadiusSlider.addEventListener('input', (e) => {
            const radius = parseInt(e.target.value);
            projectData.settings.borderRadius = radius;
            if (borderRadiusValue) borderRadiusValue.textContent = radius + 'px';
            applyBorderStyle();
        });
    }
}

// ===== 初始化控件值 =====
function initControls() {
    // 设置输入框的值
    const titleInput = document.getElementById('titleInput');
    const subtitleInput = document.getElementById('subtitleInput');
    
    if (titleInput) titleInput.value = projectData.settings.title;
    if (subtitleInput) subtitleInput.value = projectData.settings.subtitle;
    
    // 设置滑块的值
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    const fontSizeValue = document.getElementById('fontSizeValue');
    
    if (fontSizeSlider) fontSizeSlider.value = projectData.settings.fontSize;
    if (fontSizeValue) fontSizeValue.textContent = projectData.settings.fontSize + 'px';
    
    // 更新显示
    updateTextDisplay();
    setAspectRatio(projectData.settings.aspectRatio);
}

// ===== 从URL加载模板 =====
function loadTemplateFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const templateId = urlParams.get('template');
    
    if (templateId) {
        loadTemplate(templateId);
    }
}

// ===== 加载模板 =====
function loadTemplate(templateId) {
    const template = templatesData.find(t => t.id === templateId);
    if (!template) {
        console.warn('模板未找到:', templateId);
        return;
    }
    
    currentTemplate = template;
    projectData.templateId = templateId;
    
    // 更新页面标题
    const editorTitle = document.getElementById('editorTitle');
    if (editorTitle) {
        editorTitle.textContent = `编辑 - ${template.title}`;
    }
    
    // 加载模板背景图片
    loadBackgroundImage(template.image);
    
    // 设置默认宽高比
    setAspectRatio(template.ratio);
    
    // 更新项目名称
    updateProjectName();
    
    console.log('模板加载完成:', template);
}

// ===== 加载背景图片 =====
function loadBackgroundImage(imageUrl) {
    const backgroundImg = document.getElementById('backgroundImage');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    if (!backgroundImg || !imageUrl) return;
    
    // 显示加载状态
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
    
    backgroundImg.onload = () => {
        projectData.backgroundUrl = imageUrl;
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
        applyImageAdjustments();
        console.log('背景图片加载完成');
    };
    
    backgroundImg.onerror = () => {
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
        console.error('背景图片加载失败:', imageUrl);
        window.HarmonyUtils?.showToast('图片加载失败', 'error');
    };
    
    backgroundImg.src = imageUrl;
}

// ===== 设置宽高比 =====
function setAspectRatio(ratio) {
    projectData.settings.aspectRatio = ratio;
    
    const canvasStage = document.getElementById('canvasStage');
    if (!canvasStage) return;
    
    // 移除所有比例类
    canvasStage.classList.remove('ratio-4-5', 'ratio-1-1', 'ratio-9-16');
    
    // 添加对应的比例类
    switch (ratio) {
        case '1:1':
            canvasStage.classList.add('ratio-1-1');
            break;
        case '9:16':
            canvasStage.classList.add('ratio-9-16');
            break;
        case '4:5':
        default:
            canvasStage.classList.add('ratio-4-5');
            break;
    }
    
    // 更新按钮状态
    const aspectButtons = document.querySelectorAll('.aspect-btn');
    aspectButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.ratio === ratio);
    });
}

// ===== 更新文本显示 =====
function updateTextDisplay() {
    const titleDisplay = document.getElementById('titleDisplay');
    const subtitleDisplay = document.getElementById('subtitleDisplay');
    
    if (titleDisplay) {
        titleDisplay.textContent = projectData.settings.title;
        titleDisplay.style.fontSize = projectData.settings.fontSize + 'px';
        titleDisplay.style.color = projectData.settings.textColor;
        titleDisplay.style.textAlign = projectData.settings.textAlign;
    }
    
    if (subtitleDisplay) {
        subtitleDisplay.textContent = projectData.settings.subtitle;
        subtitleDisplay.style.fontSize = Math.round(projectData.settings.fontSize * 0.7) + 'px';
        subtitleDisplay.style.color = projectData.settings.textColor;
        subtitleDisplay.style.textAlign = projectData.settings.textAlign;
    }
}

// ===== 设置文字颜色 =====
function setTextColor(color) {
    projectData.settings.textColor = color;
    updateTextDisplay();
    
    // 更新颜色选择器状态
    const colorItems = document.querySelectorAll('.color-item');
    colorItems.forEach(item => {
        item.classList.toggle('active', item.dataset.color === color);
    });
}

// ===== 设置文字对齐 =====
function setTextAlign(align) {
    projectData.settings.textAlign = align;
    updateTextDisplay();
    
    // 更新按钮状态
    const alignButtons = document.querySelectorAll('.align-btn');
    alignButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.align === align);
    });
}

// ===== 设置滤镜 =====
function setFilter(filter) {
    projectData.settings.filter = filter;
    applyImageAdjustments();
    
    // 更新滤镜选择器状态
    const filterItems = document.querySelectorAll('.filter-item');
    filterItems.forEach(item => {
        item.classList.toggle('active', item.dataset.filter === filter);
    });
}

// ===== 应用图片调整 =====
function applyImageAdjustments() {
    const backgroundImg = document.getElementById('backgroundImage');
    if (!backgroundImg) return;
    
    const settings = projectData.settings;
    let filterCSS = '';
    
    // 基础滤镜
    switch (settings.filter) {
        case 'warm':
            filterCSS += 'sepia(0.3) saturate(1.2) hue-rotate(10deg) ';
            break;
        case 'cool':
            filterCSS += 'hue-rotate(180deg) saturate(1.1) ';
            break;
        case 'vintage':
            filterCSS += 'sepia(0.5) contrast(1.2) saturate(0.8) ';
            break;
        case 'bw':
            filterCSS += 'grayscale(1) ';
            break;
        case 'bright':
            filterCSS += 'brightness(1.2) contrast(1.1) ';
            break;
    }
    
    // 添加调整滤镜
    if (settings.brightness !== 0) {
        const brightness = 1 + (settings.brightness / 100);
        filterCSS += `brightness(${brightness}) `;
    }
    
    if (settings.contrast !== 0) {
        const contrast = 1 + (settings.contrast / 100);
        filterCSS += `contrast(${contrast}) `;
    }
    
    if (settings.saturation !== 0) {
        const saturation = 1 + (settings.saturation / 100);
        filterCSS += `saturate(${saturation}) `;
    }
    
    backgroundImg.style.filter = filterCSS.trim() || 'none';
}

// ===== 设置边框样式 =====
function setBorderStyle(style) {
    projectData.settings.borderStyle = style;
    applyBorderStyle();
    
    // 更新按钮状态
    const borderButtons = document.querySelectorAll('.border-btn');
    borderButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.border === style);
    });
}

// ===== 应用边框样式 =====
function applyBorderStyle() {
    const canvasStage = document.getElementById('canvasStage');
    if (!canvasStage) return;
    
    const settings = projectData.settings;
    
    if (settings.borderStyle === 'none' || settings.borderWidth === 0) {
        canvasStage.style.border = 'none';
    } else {
        canvasStage.style.border = `${settings.borderWidth}px ${settings.borderStyle} #cccccc`;
    }
    
    canvasStage.style.borderRadius = settings.borderRadius + 'px';
}

// ===== 添加贴纸 =====
function addSticker(type, emoji) {
    const sticker = {
        id: `sticker-${Date.now()}`,
        type: type,
        emoji: emoji,
        x: Math.random() * 200 + 60,  // 随机位置
        y: Math.random() * 200 + 60,
        size: 32,
        rotation: 0
    };
    
    projectData.stickers.push(sticker);
    renderSticker(sticker);
    
    console.log('添加贴纸:', sticker);
}

// ===== 渲染贴纸 =====
function renderSticker(sticker) {
    const stickersLayer = document.getElementById('stickersLayer');
    if (!stickersLayer) return;
    
    const stickerElement = document.createElement('div');
    stickerElement.className = 'sticker-element';
    stickerElement.dataset.stickerId = sticker.id;
    stickerElement.textContent = sticker.emoji;
    stickerElement.style.left = sticker.x + 'px';
    stickerElement.style.top = sticker.y + 'px';
    stickerElement.style.fontSize = sticker.size + 'px';
    stickerElement.style.transform = `rotate(${sticker.rotation}deg)`;
    
    // 添加拖拽功能
    stickerElement.addEventListener('mousedown', (e) => startDragging(e, sticker));
    stickerElement.addEventListener('click', (e) => {
        e.stopPropagation();
        selectSticker(sticker);
    });
    
    stickersLayer.appendChild(stickerElement);
}

// ===== 开始拖拽贴纸 =====
function startDragging(e, sticker) {
    e.preventDefault();
    selectedSticker = sticker;
    isDragging = true;
    
    const stickerElement = e.currentTarget;
    const rect = stickerElement.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    
    // 添加全局事件监听
    document.addEventListener('mousemove', handleDragging);
    document.addEventListener('mouseup', stopDragging);
    
    stickerElement.classList.add('selected');
}

// ===== 处理拖拽 =====
function handleDragging(e) {
    if (!isDragging || !selectedSticker) return;
    
    const canvasStage = document.getElementById('canvasStage');
    const canvasRect = canvasStage.getBoundingClientRect();
    
    const x = e.clientX - canvasRect.left - dragOffset.x;
    const y = e.clientY - canvasRect.top - dragOffset.y;
    
    // 限制在画布范围内
    const minX = 0;
    const minY = 0;
    const maxX = canvasRect.width - 32;
    const maxY = canvasRect.height - 32;
    
    selectedSticker.x = Math.max(minX, Math.min(maxX, x));
    selectedSticker.y = Math.max(minY, Math.min(maxY, y));
    
    // 更新贴纸位置
    const stickerElement = document.querySelector(`[data-sticker-id="${selectedSticker.id}"]`);
    if (stickerElement) {
        stickerElement.style.left = selectedSticker.x + 'px';
        stickerElement.style.top = selectedSticker.y + 'px';
    }
}

// ===== 停止拖拽 =====
function stopDragging() {
    isDragging = false;
    document.removeEventListener('mousemove', handleDragging);
    document.removeEventListener('mouseup', stopDragging);
}

// ===== 选择贴纸 =====
function selectSticker(sticker) {
    // 清除之前的选中状态
    document.querySelectorAll('.sticker-element.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    if (sticker) {
        selectedSticker = sticker;
        const stickerElement = document.querySelector(`[data-sticker-id="${sticker.id}"]`);
        if (stickerElement) {
            stickerElement.classList.add('selected');
        }
    } else {
        selectedSticker = null;
    }
}

// ===== 删除选中贴纸 =====
function removeSelectedSticker() {
    if (!selectedSticker) {
        window.HarmonyUtils?.showToast('请先选择一个贴纸', 'info');
        return;
    }
    
    // 从数据中移除
    projectData.stickers = projectData.stickers.filter(s => s.id !== selectedSticker.id);
    
    // 从DOM中移除
    const stickerElement = document.querySelector(`[data-sticker-id="${selectedSticker.id}"]`);
    if (stickerElement) {
        stickerElement.remove();
    }
    
    selectedSticker = null;
    window.HarmonyUtils?.showToast('贴纸已删除', 'success');
}

// ===== 更多贴纸 =====
function moreStickers() {
    window.HarmonyUtils?.showToast('更多贴纸功能即将上线', 'info');
}

// ===== 替换背景 =====
function replaceBackground() {
    const backgroundFileInput = document.getElementById('backgroundFileInput');
    if (backgroundFileInput) {
        backgroundFileInput.click();
    }
}

// ===== 添加图片 =====
function addImage() {
    const imageFileInput = document.getElementById('imageFileInput');
    if (imageFileInput) {
        imageFileInput.click();
    }
}

// ===== 处理背景上传 =====
function handleBackgroundUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        window.HarmonyUtils?.showToast('请选择图片文件', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
        const imageUrl = event.target.result;
        loadBackgroundImage(imageUrl);
        window.HarmonyUtils?.showToast('背景替换成功', 'success');
    };
    reader.readAsDataURL(file);
    
    // 清空input
    e.target.value = '';
}

// ===== 处理图片上传 =====
function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        window.HarmonyUtils?.showToast('请选择图片文件', 'error');
        return;
    }
    
    // 这里可以将图片作为贴纸添加
    const reader = new FileReader();
    reader.onload = (event) => {
        const imageUrl = event.target.result;
        // 创建图片贴纸
        addImageSticker(imageUrl);
        window.HarmonyUtils?.showToast('图片添加成功', 'success');
    };
    reader.readAsDataURL(file);
    
    // 清空input
    e.target.value = '';
}

// ===== 添加图片贴纸 =====
function addImageSticker(imageUrl) {
    const sticker = {
        id: `image-sticker-${Date.now()}`,
        type: 'image',
        imageUrl: imageUrl,
        x: Math.random() * 200 + 60,
        y: Math.random() * 200 + 60,
        width: 80,
        height: 80,
        rotation: 0
    };
    
    projectData.stickers.push(sticker);
    renderImageSticker(sticker);
}

// ===== 渲染图片贴纸 =====
function renderImageSticker(sticker) {
    const stickersLayer = document.getElementById('stickersLayer');
    if (!stickersLayer) return;
    
    const stickerElement = document.createElement('div');
    stickerElement.className = 'sticker-element';
    stickerElement.dataset.stickerId = sticker.id;
    stickerElement.style.left = sticker.x + 'px';
    stickerElement.style.top = sticker.y + 'px';
    stickerElement.style.width = sticker.width + 'px';
    stickerElement.style.height = sticker.height + 'px';
    stickerElement.style.transform = `rotate(${sticker.rotation}deg)`;
    stickerElement.style.backgroundImage = `url(${sticker.imageUrl})`;
    stickerElement.style.backgroundSize = 'cover';
    stickerElement.style.backgroundPosition = 'center';
    stickerElement.style.borderRadius = '8px';
    
    // 添加拖拽功能
    stickerElement.addEventListener('mousedown', (e) => startDragging(e, sticker));
    stickerElement.addEventListener('click', (e) => {
        e.stopPropagation();
        selectSticker(sticker);
    });
    
    stickersLayer.appendChild(stickerElement);
}

// ===== 重置画布 =====
function resetCanvas() {
    if (confirm('确定要重置画布吗？这将清除所有贴纸和自定义设置。')) {
        // 清除所有贴纸
        projectData.stickers = [];
        const stickersLayer = document.getElementById('stickersLayer');
        if (stickersLayer) {
            stickersLayer.innerHTML = '';
        }
        
        // 重置设置
        projectData.settings = {
            aspectRatio: '4:5',
            title: '我的美好时光',
            subtitle: '记录生活中的小确幸',
            fontSize: 24,
            textColor: '#333333',
            textAlign: 'center',
            filter: 'none',
            brightness: 0,
            contrast: 0,
            saturation: 0,
            borderStyle: 'none',
            borderWidth: 0,
            borderRadius: 12
        };
        
        // 重新加载模板
        if (currentTemplate) {
            loadBackgroundImage(currentTemplate.image);
        }
        
        // 重新初始化控件
        initControls();
        
        selectedSticker = null;
        window.HarmonyUtils?.showToast('画布已重置', 'success');
    }
}

// ===== 切换预览模式 =====
function togglePreview() {
    const previewBtn = document.getElementById('previewBtn');
    const toolsPanels = document.querySelectorAll('.tools-panel, .settings-panel');
    
    const isPreviewMode = previewBtn.textContent.includes('编辑');
    
    if (isPreviewMode) {
        // 切换到编辑模式
        previewBtn.innerHTML = '<span class="icon">👁</span><span>预览</span>';
        toolsPanels.forEach(panel => panel.style.display = 'block');
    } else {
        // 切换到预览模式
        previewBtn.innerHTML = '<span class="icon">✏️</span><span>编辑</span>';
        toolsPanels.forEach(panel => panel.style.display = 'none');
    }
}

// ===== 保存项目 =====
function saveProject() {
    const saveBtn = document.getElementById('saveBtn');
    if (!saveBtn) return;
    
    // 显示保存状态
    const originalHTML = saveBtn.innerHTML;
    saveBtn.innerHTML = '<span class="icon">⏳</span><span>保存中...</span>';
    saveBtn.disabled = true;
    
    // 模拟保存延迟
    setTimeout(() => {
        // 保存到localStorage
        projectData.lastSaved = new Date().toISOString();
        const projectKey = `editor-project-${projectData.id}`;
        localStorage.setItem(projectKey, JSON.stringify(projectData));
        
        // 恢复按钮状态
        saveBtn.innerHTML = originalHTML;
        saveBtn.disabled = false;
        
        // 显示成功提示
        showSaveToast();
        
        console.log('项目保存成功:', projectData);
    }, 1000);
}

// ===== 显示保存提示 =====
function showSaveToast() {
    const saveToast = document.getElementById('saveToast');
    if (!saveToast) return;
    
    saveToast.style.display = 'block';
    
    setTimeout(() => {
        saveToast.style.display = 'none';
    }, 3000);
}

// ===== 导出项目 =====
function exportProject() {
    if (!projectData.backgroundUrl) {
        window.HarmonyUtils?.showToast('请先加载模板', 'error');
        return;
    }
    
    window.HarmonyUtils?.showToast('导出功能开发中...', 'info');
    console.log('导出项目:', projectData);
}

// ===== 更新项目名称 =====
function updateProjectName() {
    if (!projectData.name) {
        projectData.name = generateDefaultProjectName();
    }
    
    const projectNameInput = document.getElementById('projectName');
    if (projectNameInput) {
        projectNameInput.value = projectData.name;
    }
}

// ===== 生成默认项目名称 =====
function generateDefaultProjectName() {
    const templateName = currentTemplate?.title || '作品';
    const timestamp = new Date().toLocaleDateString();
    return `我的${templateName} - ${timestamp}`;
}

// ===== 返回上一页 =====
function goBack() {
    if (confirm('确定要离开编辑器吗？未保存的更改将会丢失。')) {
        window.history.back();
    }
}

// ===== 页面卸载时的提醒 =====
window.addEventListener('beforeunload', (e) => {
    if (projectData.stickers.length > 0 || projectData.backgroundUrl !== (currentTemplate?.image || '')) {
        e.preventDefault();
        e.returnValue = '您有未保存的更改，确定要离开吗？';
        return '您有未保存的更改，确定要离开吗？';
    }
});

// ===== 全局点击事件（取消贴纸选中） =====
document.addEventListener('click', (e) => {
    if (!e.target.closest('.sticker-element')) {
        selectSticker(null);
    }
});

console.log('编辑器脚本加载完成');
