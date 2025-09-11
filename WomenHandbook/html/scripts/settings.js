// 设置页面交互逻辑

// ===== 全局变量 =====
let currentSection = 'privacy';
let confirmCallback = null;
let userSettings = {
    privacy: {
        dataEncryption: true,
        anonymousStats: false,
        autoLogin: true,
        dataSharing: 'none'
    },
    notifications: {
        pushNotifications: true,
        dailyReminder: true,
        reminderTime: '20:00',
        soundAlert: true,
        vibrationAlert: false
    },
    appearance: {
        theme: 'pink-dream',
        fontSize: 'medium',
        animations: true,
        language: 'zh-CN'
    },
    data: {
        autoSave: true,
        cloudSync: false
    },
    about: {
        autoUpdate: true
    }
};

// ===== 页面初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    loadUserSettings();
    showSettingsSection('privacy');
    
    // 页面加载动画
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// ===== 加载用户设置 =====
function loadUserSettings() {
    const savedSettings = window.HarmonyUtils?.DataCache.get('user_settings');
    if (savedSettings) {
        userSettings = { ...userSettings, ...savedSettings };
    }
    
    // 应用设置到界面
    applySettingsToUI();
}

// ===== 应用设置到界面 =====
function applySettingsToUI() {
    // 隐私设置
    const privacySection = document.getElementById('privacySection');
    if (privacySection) {
        const checkboxes = privacySection.querySelectorAll('input[type="checkbox"]');
        checkboxes[0].checked = userSettings.privacy.dataEncryption;
        checkboxes[1].checked = userSettings.privacy.anonymousStats;
        checkboxes[2].checked = userSettings.privacy.autoLogin;
        
        const dataSharing = privacySection.querySelector('select');
        if (dataSharing) dataSharing.value = userSettings.privacy.dataSharing;
    }
    
    // 通知设置
    const notificationSection = document.getElementById('notificationsSection');
    if (notificationSection) {
        const checkboxes = notificationSection.querySelectorAll('input[type="checkbox"]');
        checkboxes[0].checked = userSettings.notifications.pushNotifications;
        checkboxes[1].checked = userSettings.notifications.dailyReminder;
        checkboxes[2].checked = userSettings.notifications.soundAlert;
        checkboxes[3].checked = userSettings.notifications.vibrationAlert;
        
        const timeInput = notificationSection.querySelector('input[type="time"]');
        if (timeInput) timeInput.value = userSettings.notifications.reminderTime;
    }
    
    // 外观设置
    const appearanceSection = document.getElementById('appearanceSection');
    if (appearanceSection) {
        // 主题选择
        const themeCards = appearanceSection.querySelectorAll('.theme-card');
        themeCards.forEach(card => {
            card.classList.remove('active');
            if (card.getAttribute('onclick').includes(userSettings.appearance.theme)) {
                card.classList.add('active');
            }
        });
        
        // 字体大小
        const fontSizeSelect = appearanceSection.querySelector('select');
        if (fontSizeSelect) fontSizeSelect.value = userSettings.appearance.fontSize;
        
        // 动画效果
        const animationCheckbox = appearanceSection.querySelector('input[type="checkbox"]');
        if (animationCheckbox) animationCheckbox.checked = userSettings.appearance.animations;
        
        // 语言设置
        const languageSelect = appearanceSection.querySelectorAll('select')[1];
        if (languageSelect) languageSelect.value = userSettings.appearance.language;
    }
    
    // 数据设置
    const dataSection = document.getElementById('dataSection');
    if (dataSection) {
        const checkboxes = dataSection.querySelectorAll('input[type="checkbox"]');
        checkboxes[0].checked = userSettings.data.autoSave;
        checkboxes[1].checked = userSettings.data.cloudSync;
    }
    
    // 关于设置
    const aboutSection = document.getElementById('aboutSection');
    if (aboutSection) {
        const autoUpdateCheckbox = aboutSection.querySelector('input[type="checkbox"]');
        if (autoUpdateCheckbox) autoUpdateCheckbox.checked = userSettings.about.autoUpdate;
    }
}

// ===== 保存用户设置 =====
function saveUserSettings() {
    window.HarmonyUtils?.DataCache.set('user_settings', userSettings);
}

// ===== 显示设置分区 =====
function showSettingsSection(sectionName) {
    currentSection = sectionName;
    
    // 更新导航状态
    document.querySelectorAll('.nav-category').forEach(nav => {
        nav.classList.remove('active');
    });
    
    // 找到并激活对应的导航按钮
    const targetButton = document.querySelector(`[onclick*="showSettingsSection('${sectionName}')"]`);
    if (targetButton) {
        targetButton.classList.add('active');
    }
    
    // 隐藏所有设置区域
    document.querySelectorAll('.settings-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // 显示选中的设置区域
    const targetSection = document.getElementById(`${sectionName}Section`);
    if (targetSection) {
        targetSection.style.display = 'block';
        
        // 滚动到设置区域
        setTimeout(() => {
            targetSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 100);
    }
    
    // 显示切换提示
    const sectionNames = {
        'privacy': '隐私设置',
        'notifications': '通知设置',
        'appearance': '外观设置',
        'data': '数据管理',
        'about': '关于应用'
    };
    
    window.HarmonyUtils?.showToast(`已切换到${sectionNames[sectionName]}`, 'info', 2000);
}

// ===== 切换设置项 =====
function toggleSetting(settingKey, value) {
    const [category, key] = getSettingPath(settingKey);
    
    if (userSettings[category]) {
        userSettings[category][key] = value;
        saveUserSettings();
        
        // 添加触觉反馈
        if ('vibrate' in navigator) {
            navigator.vibrate(value ? 15 : 5);
        }
        
        // 显示状态提示
        const settingNames = {
            'dataEncryption': '数据加密',
            'anonymousStats': '匿名统计',
            'autoLogin': '自动登录',
            'pushNotifications': '推送通知',
            'dailyReminder': '每日提醒',
            'soundAlert': '声音提醒',
            'vibrationAlert': '振动提醒',
            'animations': '动画效果',
            'autoSave': '自动保存',
            'cloudSync': '云端同步',
            'autoUpdate': '自动更新'
        };
        
        const settingName = settingNames[key] || key;
        const status = value ? '已开启' : '已关闭';
        window.HarmonyUtils?.showToast(`${settingName} ${status}`, value ? 'success' : 'info', 2000);
        
        // 特殊处理
        if (key === 'animations') {
            applyAnimationSetting(value);
        }
    }
}

// ===== 更改设置项 =====
function changeSetting(settingKey, value) {
    const [category, key] = getSettingPath(settingKey);
    
    if (userSettings[category]) {
        userSettings[category][key] = value;
        saveUserSettings();
        
        // 显示更改提示
        const settingNames = {
            'dataSharing': '数据共享',
            'fontSize': '字体大小',
            'language': '语言设置',
            'reminderTime': '提醒时间'
        };
        
        const settingName = settingNames[key] || key;
        window.HarmonyUtils?.showToast(`${settingName}已更改`, 'success', 2000);
        
        // 特殊处理
        if (key === 'fontSize') {
            applyFontSizeSetting(value);
        } else if (key === 'language') {
            applyLanguageSetting(value);
        }
    }
}

// ===== 获取设置路径 =====
function getSettingPath(settingKey) {
    const settingMap = {
        'dataEncryption': ['privacy', 'dataEncryption'],
        'anonymousStats': ['privacy', 'anonymousStats'],
        'autoLogin': ['privacy', 'autoLogin'],
        'dataSharing': ['privacy', 'dataSharing'],
        'pushNotifications': ['notifications', 'pushNotifications'],
        'dailyReminder': ['notifications', 'dailyReminder'],
        'reminderTime': ['notifications', 'reminderTime'],
        'soundAlert': ['notifications', 'soundAlert'],
        'vibrationAlert': ['notifications', 'vibrationAlert'],
        'fontSize': ['appearance', 'fontSize'],
        'animations': ['appearance', 'animations'],
        'language': ['appearance', 'language'],
        'autoSave': ['data', 'autoSave'],
        'cloudSync': ['data', 'cloudSync'],
        'autoUpdate': ['about', 'autoUpdate']
    };
    
    return settingMap[settingKey] || ['general', settingKey];
}

// ===== 选择主题 =====
function selectTheme(themeName) {
    // 更新主题卡片状态
    document.querySelectorAll('.theme-card').forEach(card => {
        card.classList.remove('active');
    });
    event.target.closest('.theme-card').classList.add('active');
    
    // 保存主题设置
    userSettings.appearance.theme = themeName;
    saveUserSettings();
    
    // 应用主题
    applyTheme(themeName);
    
    // 显示切换提示
    const themeNames = {
        'pink-dream': '粉色梦境',
        'purple-fantasy': '紫色幻想',
        'mint-fresh': '薄荷清新',
        'peach-warm': '桃子温暖'
    };
    
    window.HarmonyUtils?.showToast(`已切换到"${themeNames[themeName]}"主题`, 'success', 2000);
}

// ===== 应用主题 =====
function applyTheme(themeName) {
    // 这里可以根据主题名称更新CSS变量
    const themes = {
        'pink-dream': {
            primary: '#FF6B9D',
            secondary: '#FFE8F0'
        },
        'purple-fantasy': {
            primary: '#9C88FF',
            secondary: '#F0EDFF'
        },
        'mint-fresh': {
            primary: '#4ECDC4',
            secondary: '#E8F9F8'
        },
        'peach-warm': {
            primary: '#FFB88C',
            secondary: '#FFF3ED'
        }
    };
    
    const theme = themes[themeName];
    if (theme) {
        document.documentElement.style.setProperty('--harmony-brand-primary', theme.primary);
        document.documentElement.style.setProperty('--harmony-brand-secondary', theme.secondary);
    }
}

// ===== 应用动画设置 =====
function applyAnimationSetting(enabled) {
    if (!enabled) {
        document.body.style.setProperty('--animation-duration', '0s');
    } else {
        document.body.style.removeProperty('--animation-duration');
    }
}

// ===== 应用字体大小设置 =====
function applyFontSizeSetting(size) {
    const sizeMap = {
        'small': '14px',
        'medium': '16px',
        'large': '18px'
    };
    
    if (sizeMap[size]) {
        document.documentElement.style.setProperty('--harmony-font-size-md', sizeMap[size]);
    }
}

// ===== 应用语言设置 =====
function applyLanguageSetting(language) {
    // 这里可以实现语言切换逻辑
    document.documentElement.lang = language;
}

// ===== 更换头像 =====
function changeAvatar() {
    const avatars = [
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&q=80',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80'
    ];
    
    const currentAvatar = document.querySelector('.user-avatar-large img').src;
    const currentIndex = avatars.findIndex(avatar => currentAvatar.includes(avatar.split('?')[0].split('/').pop()));
    const nextIndex = (currentIndex + 1) % avatars.length;
    
    document.querySelector('.user-avatar-large img').src = avatars[nextIndex];
    
    window.HarmonyUtils?.showToast('头像已更换', 'success', 2000);
}

// ===== 编辑用户信息 =====
function editUserInfo() {
    window.HarmonyUtils?.showToast('编辑功能开发中...', 'info', 2000);
}

// ===== 数据操作函数 =====
function exportData() {
    const data = {
        settings: userSettings,
        userData: {
            works: 42,
            moods: 256,
            collections: 18
        },
        exportTime: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'settings-data-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    
    window.HarmonyUtils?.showToast('数据导出成功', 'success', 2000);
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.settings) {
                        userSettings = { ...userSettings, ...data.settings };
                        saveUserSettings();
                        applySettingsToUI();
                        window.HarmonyUtils?.showToast('数据导入成功', 'success', 2000);
                    } else {
                        throw new Error('Invalid data format');
                    }
                } catch (error) {
                    window.HarmonyUtils?.showToast('数据格式无效', 'error', 2000);
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

function backupToCloud() {
    if (!userSettings.data.cloudSync) {
        window.HarmonyUtils?.showToast('请先开启云端同步', 'warning', 2000);
        return;
    }
    
    // 模拟云端备份
    window.HarmonyUtils?.showLoading(document.body);
    
    setTimeout(() => {
        window.HarmonyUtils?.hideLoading(document.body);
        window.HarmonyUtils?.showToast('云端备份成功', 'success', 2000);
    }, 2000);
}

function clearData() {
    showConfirmDialog(
        '清除数据',
        '确定要清除所有本地数据吗？此操作不可撤销，建议先导出数据进行备份。',
        () => {
            // 清除数据
            window.HarmonyUtils?.DataCache.clear();
            userSettings = {
                privacy: { dataEncryption: true, anonymousStats: false, autoLogin: true, dataSharing: 'none' },
                notifications: { pushNotifications: true, dailyReminder: true, reminderTime: '20:00', soundAlert: true, vibrationAlert: false },
                appearance: { theme: 'pink-dream', fontSize: 'medium', animations: true, language: 'zh-CN' },
                data: { autoSave: true, cloudSync: false },
                about: { autoUpdate: true }
            };
            applySettingsToUI();
            window.HarmonyUtils?.showToast('数据已清除', 'success', 2000);
        }
    );
}

// ===== 帮助函数 =====
function showTutorial() {
    window.HarmonyUtils?.showToast('使用教程功能开发中...', 'info', 2000);
}

function showFeedback() {
    window.HarmonyUtils?.showToast('意见反馈功能开发中...', 'info', 2000);
}

function showPrivacyPolicy() {
    window.HarmonyUtils?.showToast('隐私政策功能开发中...', 'info', 2000);
}

function showUserAgreement() {
    window.HarmonyUtils?.showToast('用户协议功能开发中...', 'info', 2000);
}

function checkUpdate() {
    const updateBtn = event.target.closest('.harmony-button');
    const originalText = updateBtn.innerHTML;
    
    updateBtn.innerHTML = `
        <div class="loading-spinner"></div>
        <span>检查中...</span>
    `;
    updateBtn.disabled = true;
    
    setTimeout(() => {
        updateBtn.innerHTML = originalText;
        updateBtn.disabled = false;
        window.HarmonyUtils?.showToast('当前已是最新版本', 'success', 2000);
    }, 3000);
}

function showHelp() {
    window.HarmonyUtils?.showToast('帮助功能开发中...', 'info', 2000);
}

// ===== 确认对话框 =====
function showConfirmDialog(title, message, callback) {
    const dialog = document.getElementById('confirmDialog');
    const titleElement = document.getElementById('confirmTitle');
    const messageElement = document.getElementById('confirmMessage');
    
    if (dialog && titleElement && messageElement) {
        titleElement.textContent = title;
        messageElement.textContent = message;
        confirmCallback = callback;
        
        dialog.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeConfirmDialog() {
    const dialog = document.getElementById('confirmDialog');
    if (dialog) {
        dialog.classList.remove('show');
        document.body.style.overflow = '';
        confirmCallback = null;
    }
}

function confirmAction() {
    if (confirmCallback) {
        confirmCallback();
        confirmCallback = null;
    }
    closeConfirmDialog();
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
    const dialog = document.getElementById('confirmDialog');
    if (e.target === dialog) {
        closeConfirmDialog();
    }
});

// ===== ESC键关闭对话框 =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeConfirmDialog();
    }
});

// ===== 自动导航激活 =====
document.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.slice(1);
    if (hash && ['privacy', 'notifications', 'appearance', 'data', 'about'].includes(hash)) {
        showSettingsSection(hash);
    }
});

// ===== 设置变化监听 =====
window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith('app_cache_user_settings')) {
        loadUserSettings();
    }
});
