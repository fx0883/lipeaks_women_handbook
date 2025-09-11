// 鸿蒙手账应用主要交互逻辑

// ===== 主题切换功能 =====
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // 更新主题按钮图标
    const themeButton = document.querySelector('.theme-toggle .icon');
    if (themeButton) {
        themeButton.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }
    
    // 添加切换动画
    body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        body.style.transition = '';
    }, 300);
}

// ===== 初始化主题 =====
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme === 'auto' ? (systemPrefersDark ? 'dark' : 'light') : savedTheme;
    
    document.body.setAttribute('data-theme', theme);
    
    const themeButton = document.querySelector('.theme-toggle .icon');
    if (themeButton) {
        themeButton.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

// ===== 底部导航交互 =====
function initTabBar() {
    const tabItems = document.querySelectorAll('.tab-item');
    
    tabItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // 移除所有活动状态
            tabItems.forEach(tab => tab.classList.remove('active'));
            // 添加活动状态到当前项
            item.classList.add('active');
            
            // 添加点击反馈动画
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
                item.style.transform = '';
            }, 150);
            
            // 这里可以添加页面切换逻辑
            handleTabNavigation(index);
        });
    });
}

// ===== 标签导航处理 =====
function handleTabNavigation(tabIndex) {
    const pages = ['index.html', 'create.html', 'mood.html', 'album.html', 'profile.html'];
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const targetPage = pages[tabIndex];
    
    if (currentPage !== targetPage) {
        // 添加页面切换动画
        document.body.classList.add('page-transition');
        setTimeout(() => {
            window.location.href = targetPage;
        }, 200);
    }
}

// ===== 卡片悬停效果 =====
function initCardEffects() {
    const cards = document.querySelectorAll('.harmony-card, .feature-item, .template-item, .work-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
        
        // 触摸设备支持
        card.addEventListener('touchstart', () => {
            card.style.transform = 'scale(0.98)';
        });
        
        card.addEventListener('touchend', () => {
            card.style.transform = '';
        });
    });
}

// ===== 功能按钮交互 =====
function initButtonEffects() {
    const buttons = document.querySelectorAll('.harmony-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            // 创建涟漪效果
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// ===== 滚动效果 =====
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    const animateElements = document.querySelectorAll('.feature-item, .template-item, .work-item');
    animateElements.forEach(el => observer.observe(el));
}

// ===== 触觉反馈模拟 =====
function initHapticFeedback() {
    const interactiveElements = document.querySelectorAll('button, .tab-item, .feature-item, .template-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('click', () => {
            // 在支持的设备上触发振动
            if ('vibrate' in navigator) {
                navigator.vibrate(10); // 轻微振动10ms
            }
        });
    });
}

// ===== 响应式导航栏 =====
function initResponsiveNavigation() {
    const navigation = document.querySelector('.harmony-navigation');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // 向下滚动，隐藏导航栏
            navigation.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动，显示导航栏
            navigation.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// ===== 加载状态管理 =====
function showLoading(element) {
    const loading = document.createElement('div');
    loading.className = 'harmony-loading';
    loading.innerHTML = `
        <div class="loading-spinner"></div>
        <span>加载中...</span>
    `;
    element.appendChild(loading);
}

function hideLoading(element) {
    const loading = element.querySelector('.harmony-loading');
    if (loading) {
        loading.remove();
    }
}

// ===== Toast 提示 =====
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `harmony-toast harmony-toast-${type}`;
    toast.textContent = message;
    
    // 添加图标
    const icon = document.createElement('span');
    icon.className = 'toast-icon';
    switch (type) {
        case 'success':
            icon.textContent = '✓';
            break;
        case 'error':
            icon.textContent = '✕';
            break;
        case 'warning':
            icon.textContent = '⚠';
            break;
        default:
            icon.textContent = 'ℹ';
    }
    
    toast.insertBefore(icon, toast.firstChild);
    
    // 添加样式
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--harmony-neutral-background-1);
        color: var(--harmony-neutral-foreground-1);
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: var(--harmony-shadow-8);
        border: 1px solid var(--harmony-neutral-stroke-1);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 8px;
        animation: harmony-slide-down 0.3s ease-out;
        max-width: 300px;
        text-align: center;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'harmony-fade-out 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, duration);
}

// ===== 数据缓存管理 =====
const DataCache = {
    set(key, data, ttl = 3600000) { // 默认1小时缓存
        const item = {
            data: data,
            timestamp: Date.now(),
            ttl: ttl
        };
        localStorage.setItem(`app_cache_${key}`, JSON.stringify(item));
    },
    
    get(key) {
        const item = localStorage.getItem(`app_cache_${key}`);
        if (!item) return null;
        
        const parsed = JSON.parse(item);
        const now = Date.now();
        
        if (now - parsed.timestamp > parsed.ttl) {
            localStorage.removeItem(`app_cache_${key}`);
            return null;
        }
        
        return parsed.data;
    },
    
    remove(key) {
        localStorage.removeItem(`app_cache_${key}`);
    },
    
    clear() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('app_cache_')) {
                localStorage.removeItem(key);
            }
        });
    }
};

// ===== 页面初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initTabBar();
    initCardEffects();
    initButtonEffects();
    initScrollEffects();
    initHapticFeedback();
    initResponsiveNavigation();
    
    // 页面加载完成动画
    document.body.classList.add('loaded');
    
});

// ===== 监听系统主题变化 =====
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem('theme') === 'auto') {
        const theme = e.matches ? 'dark' : 'light';
        document.body.setAttribute('data-theme', theme);
    }
});

// ===== 页面可见性变化处理 =====
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // 页面隐藏时的处理
        console.log('页面隐藏');
    } else {
        // 页面显示时的处理
        console.log('页面显示');
        // 刷新数据等
    }
});

// ===== 网络状态监听 =====
window.addEventListener('online', () => {
    showToast('网络已连接', 'success');
});

window.addEventListener('offline', () => {
    showToast('网络已断开', 'warning');
});

// ===== CSS 动画定义 =====
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes harmony-slide-down {
        from {
            transform: translateX(-50%) translateY(-20px);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes harmony-fade-out {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
    
    .page-transition {
        opacity: 0.8;
        transform: scale(0.98);
        transition: all 0.2s ease;
    }
    
    .animate-in {
        animation: harmony-fade-in 0.6s ease-out;
    }
    
    .loaded {
        opacity: 1;
    }
    
    body {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
    
    .harmony-navigation {
        transition: transform 0.3s ease;
    }
    
    .harmony-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        padding: 20px;
        color: var(--harmony-neutral-foreground-2);
    }
    
    .loading-spinner {
        width: 24px;
        height: 24px;
        border: 2px solid var(--harmony-neutral-stroke-1);
        border-top: 2px solid var(--harmony-brand-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ===== 导出工具函数 =====
window.HarmonyUtils = {
    toggleTheme,
    showToast,
    showLoading,
    hideLoading,
    DataCache
};
