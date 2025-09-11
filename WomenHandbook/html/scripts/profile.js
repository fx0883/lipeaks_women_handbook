// 个人中心页面交互逻辑

// ===== 全局变量 =====
let userProfile = {
    name: '小美同学',
    bio: '记录生活中的每一个美好瞬间 ✨',
    tags: ['校园生活', '美食探索', '旅行达人'],
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&q=80',
    stats: {
        works: 24,
        likes: 1200,
        collections: 156,
        checkInDays: 45
    }
};

let achievements = [
    {
        id: 'creator',
        name: '创作达人',
        description: '创作超过20个作品',
        icon: '🏆',
        earned: true,
        progress: 24,
        target: 20
    },
    {
        id: 'popular',
        name: '人气之星',
        description: '获得超过1000个赞',
        icon: '💖',
        earned: true,
        progress: 1200,
        target: 1000
    },
    {
        id: 'checkin',
        name: '坚持打卡',
        description: '连续打卡30天',
        icon: '📅',
        earned: true,
        progress: 45,
        target: 30
    },
    {
        id: 'super',
        name: '超级达人',
        description: '创作超过50个作品',
        icon: '🌟',
        earned: false,
        progress: 24,
        target: 50
    }
];

// ===== 页面初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    renderAchievements();
    
    // 页面加载动画
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// ===== 加载用户资料 =====
function loadUserProfile() {
    // 从本地存储加载用户资料
    const savedProfile = window.HarmonyUtils?.DataCache.get('user_profile');
    if (savedProfile) {
        userProfile = { ...userProfile, ...savedProfile };
    }
    
    // 更新页面显示
    updateProfileDisplay();
}

// ===== 更新资料显示 =====
function updateProfileDisplay() {
    // 更新用户信息
    const userName = document.querySelector('.user-name');
    const userBio = document.querySelector('.user-bio');
    const userAvatar = document.querySelector('.user-avatar img');
    const userTags = document.querySelector('.user-tags');
    
    if (userName) userName.textContent = userProfile.name;
    if (userBio) userBio.textContent = userProfile.bio;
    if (userAvatar) userAvatar.src = userProfile.avatar;
    
    if (userTags) {
        userTags.innerHTML = userProfile.tags.map(tag => 
            `<span class="user-tag">${tag}</span>`
        ).join('');
    }
    
    // 更新统计数据
    const statNumbers = document.querySelectorAll('.profile-stats .stat-number');
    if (statNumbers.length >= 4) {
        statNumbers[0].textContent = userProfile.stats.works;
        statNumbers[1].textContent = formatNumber(userProfile.stats.likes);
        statNumbers[2].textContent = userProfile.stats.collections;
        statNumbers[3].textContent = userProfile.stats.checkInDays;
    }
}

// ===== 格式化数字 =====
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

// ===== 渲染成就徽章 =====
function renderAchievements() {
    const achievementsGrid = document.querySelector('.achievements-grid');
    if (!achievementsGrid) return;
    
    achievementsGrid.innerHTML = '';
    
    achievements.forEach((achievement, index) => {
        const achievementElement = createAchievementElement(achievement, index);
        achievementsGrid.appendChild(achievementElement);
    });
}

// ===== 创建成就元素 =====
function createAchievementElement(achievement, index) {
    const achievementDiv = document.createElement('div');
    achievementDiv.className = `achievement-item ${achievement.earned ? 'earned' : ''}`;
    achievementDiv.style.animationDelay = `${index * 0.1}s`;
    
    let progressHtml = '';
    if (!achievement.earned) {
        const progressPercent = Math.min(100, (achievement.progress / achievement.target) * 100);
        progressHtml = `
            <div class="achievement-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                </div>
                <span class="progress-text">${achievement.progress}/${achievement.target}</span>
            </div>
        `;
    }
    
    achievementDiv.innerHTML = `
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-info">
            <h4 class="achievement-name">${achievement.name}</h4>
            <p class="achievement-desc">${achievement.description}</p>
            ${progressHtml}
        </div>
    `;
    
    return achievementDiv;
}

// ===== 更换头像 =====
function changeAvatar() {
    // 模拟头像选择
    const avatars = [
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&q=80',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80'
    ];
    
    const currentIndex = avatars.indexOf(userProfile.avatar);
    const nextIndex = (currentIndex + 1) % avatars.length;
    
    userProfile.avatar = avatars[nextIndex];
    updateProfileDisplay();
    saveUserProfile();
    
    window.HarmonyUtils?.showToast('头像已更换', 'success', 2000);
}

// ===== 编辑资料 =====
function editProfile() {
    const dialog = document.getElementById('editDialog');
    if (!dialog) return;
    
    // 填充当前资料
    const nameInput = dialog.querySelector('input[type="text"]');
    const bioTextarea = dialog.querySelector('textarea');
    
    if (nameInput) nameInput.value = userProfile.name;
    if (bioTextarea) bioTextarea.value = userProfile.bio;
    
    // 更新标签显示
    updateSelectedTags();
    
    // 显示对话框
    dialog.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// ===== 关闭编辑对话框 =====
function closeEditDialog() {
    const dialog = document.getElementById('editDialog');
    if (!dialog) return;
    
    dialog.classList.remove('show');
    document.body.style.overflow = '';
}

// ===== 保存资料 =====
function saveProfile() {
    const dialog = document.getElementById('editDialog');
    if (!dialog) return;
    
    const nameInput = dialog.querySelector('input[type="text"]');
    const bioTextarea = dialog.querySelector('textarea');
    
    if (nameInput) userProfile.name = nameInput.value.trim();
    if (bioTextarea) userProfile.bio = bioTextarea.value.trim();
    
    // 获取选中的标签
    const selectedTags = Array.from(dialog.querySelectorAll('.tag-item'))
        .map(tag => tag.textContent.replace('×', '').trim());
    userProfile.tags = selectedTags;
    
    // 更新显示
    updateProfileDisplay();
    saveUserProfile();
    closeEditDialog();
    
    window.HarmonyUtils?.showToast('资料已保存', 'success', 2000);
}

// ===== 保存用户资料到本地 =====
function saveUserProfile() {
    window.HarmonyUtils?.DataCache.set('user_profile', userProfile);
}

// ===== 更新选中标签显示 =====
function updateSelectedTags() {
    const selectedTagsContainer = document.querySelector('.selected-tags');
    if (!selectedTagsContainer) return;
    
    selectedTagsContainer.innerHTML = userProfile.tags.map(tag => `
        <span class="tag-item">
            ${tag} 
            <button class="tag-remove" onclick="removeTag('${tag}')">×</button>
        </span>
    `).join('');
}

// ===== 移除标签 =====
function removeTag(tagText) {
    const index = userProfile.tags.indexOf(tagText);
    if (index > -1) {
        userProfile.tags.splice(index, 1);
        updateSelectedTags();
    }
}

// ===== 添加建议标签 =====
function addSuggestedTag(tagText) {
    if (!userProfile.tags.includes(tagText) && userProfile.tags.length < 5) {
        userProfile.tags.push(tagText);
        updateSelectedTags();
    }
}

// ===== 菜单项功能 =====
function showDrafts() {
    window.HarmonyUtils?.showToast('草稿箱功能开发中...', 'info', 2000);
}

function showFavorites() {
    window.HarmonyUtils?.showToast('收藏功能开发中...', 'info', 2000);
}

function showDataAnalysis() {
    window.HarmonyUtils?.showToast('数据分析功能开发中...', 'info', 2000);
}

function exportData() {
    // 模拟数据导出
    const data = {
        profile: userProfile,
        achievements: achievements,
        exportTime: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'profile-data.json';
    a.click();
    URL.revokeObjectURL(url);
    
    window.HarmonyUtils?.showToast('数据导出成功', 'success', 2000);
}

function showThemeSettings() {
    window.HarmonyUtils?.showToast('主题设置功能开发中...', 'info', 2000);
}

function showPrivacySettings() {
    window.HarmonyUtils?.showToast('隐私设置功能开发中...', 'info', 2000);
}

function showHelp() {
    window.HarmonyUtils?.showToast('帮助功能开发中...', 'info', 2000);
}

function showAbout() {
    const aboutInfo = `
出片手账 v1.0.0
构建时间：2024年12月16日
技术栈：HTML5 + CSS3 + JavaScript
设计规范：HarmonyOS Design System

© 2024 出片手账团队
    `.trim();
    
    alert(aboutInfo);
}

function showSettings() {
    window.HarmonyUtils?.showToast('设置功能开发中...', 'info', 2000);
}

function showAllAchievements() {
    window.HarmonyUtils?.showToast('成就详情功能开发中...', 'info', 2000);
}

function showAllActivity() {
    window.HarmonyUtils?.showToast('活动历史功能开发中...', 'info', 2000);
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

// ===== 初始化标签输入功能 =====
document.addEventListener('DOMContentLoaded', () => {
    // 标签输入框功能
    const tagInput = document.querySelector('.tag-input');
    if (tagInput) {
        tagInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const tagText = tagInput.value.trim();
                if (tagText && !userProfile.tags.includes(tagText) && userProfile.tags.length < 5) {
                    userProfile.tags.push(tagText);
                    updateSelectedTags();
                    tagInput.value = '';
                } else if (userProfile.tags.length >= 5) {
                    window.HarmonyUtils?.showToast('最多只能添加5个标签', 'warning', 2000);
                }
            }
        });
    }
    
    // 建议标签点击功能
    document.querySelectorAll('.suggested-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const tagText = tag.textContent;
            if (!userProfile.tags.includes(tagText) && userProfile.tags.length < 5) {
                userProfile.tags.push(tagText);
                updateSelectedTags();
            } else if (userProfile.tags.length >= 5) {
                window.HarmonyUtils?.showToast('最多只能添加5个标签', 'warning', 2000);
            }
        });
    });
});

// ===== 对话框外部点击关闭 =====
document.addEventListener('click', (e) => {
    const dialog = document.getElementById('editDialog');
    if (e.target === dialog) {
        closeEditDialog();
    }
});

// ===== ESC键关闭对话框 =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeEditDialog();
    }
});

// ===== 模拟成就解锁 =====
function checkAchievements() {
    let hasNewAchievement = false;
    
    achievements.forEach(achievement => {
        if (!achievement.earned && achievement.progress >= achievement.target) {
            achievement.earned = true;
            hasNewAchievement = true;
            
            // 显示成就解锁动画
            setTimeout(() => {
                window.HarmonyUtils?.showToast(
                    `🎉 恭喜解锁成就：${achievement.name}！`, 
                    'success', 
                    3000
                );
            }, 1000);
        }
    });
    
    if (hasNewAchievement) {
        renderAchievements();
    }
}

// ===== 模拟数据更新 =====
setInterval(() => {
    // 模拟统计数据的微小变化
    if (Math.random() < 0.1) { // 10%概率
        userProfile.stats.likes += Math.floor(Math.random() * 3);
        userProfile.stats.collections += Math.floor(Math.random() * 2);
        updateProfileDisplay();
        checkAchievements();
    }
}, 30000); // 每30秒检查一次
