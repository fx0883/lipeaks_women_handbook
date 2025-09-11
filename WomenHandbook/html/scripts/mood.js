// 情绪打卡页面交互逻辑

// ===== 全局变量 =====
let selectedMood = null;
let selectedTags = [];
let currentMoodData = {
    mood: null,
    note: '',
    tags: [],
    date: new Date().toISOString().split('T')[0]
};

// ===== 心情映射 =====
const moodMapping = {
    excited: { name: '超开心', emoji: '🤩', color: '#FFD700', score: 5 },
    happy: { name: '开心', emoji: '😊', color: '#FF69B4', score: 4 },
    calm: { name: '平静', emoji: '😌', color: '#87CEEB', score: 3 },
    tired: { name: '疲惫', emoji: '😴', color: '#DDA0DD', score: 2 },
    sad: { name: '难过', emoji: '😢', color: '#87CEFA', score: 1 },
    angry: { name: '生气', emoji: '😡', color: '#FF6347', score: 1 }
};

// ===== 页面初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    initCurrentDate();
    initWeeklyChart();
    loadTodayMood();
    
    // 页面加载动画
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// ===== 初始化当前日期 =====
function initCurrentDate() {
    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement) {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        currentDateElement.textContent = now.toLocaleDateString('zh-CN', options);
    }
}

// ===== 初始化周统计图表 =====
function initWeeklyChart() {
    const dayBars = document.querySelectorAll('.day-bar');
    
    dayBars.forEach((bar, index) => {
        setTimeout(() => {
            const height = bar.getAttribute('data-height');
            if (height && height !== '0%') {
                bar.style.setProperty('--bar-height', height);
            }
        }, index * 100);
    });
}

// ===== 加载今日心情 =====
function loadTodayMood() {
    const today = new Date().toISOString().split('T')[0];
    const savedMood = window.HarmonyUtils?.DataCache.get(`mood_${today}`);
    
    if (savedMood) {
        selectMood(savedMood.mood, false);
        document.getElementById('moodNote').value = savedMood.note || '';
        
        // 恢复选中的标签
        savedMood.tags?.forEach(tag => {
            const tagElement = Array.from(document.querySelectorAll('.tag-option'))
                .find(el => el.textContent === tag);
            if (tagElement) {
                tagElement.classList.add('selected');
                selectedTags.push(tag);
            }
        });
        
        // 显示已保存提示
        window.HarmonyUtils?.showToast('已加载今日心情记录', 'info', 2000);
    }
}

// ===== 选择心情 =====
function selectMood(moodType, showDetails = true) {
    // 移除之前选中状态
    document.querySelectorAll('.mood-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // 添加选中状态
    const selectedOption = document.querySelector(`[data-mood="${moodType}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
        selectedMood = moodType;
        currentMoodData.mood = moodType;
        
        // 添加触觉反馈
        if ('vibrate' in navigator) {
            navigator.vibrate(15);
        }
        
        // 显示详情区域
        if (showDetails) {
            showMoodDetails();
        }
        
        // 显示心情选择反馈
        const moodInfo = moodMapping[moodType];
        if (moodInfo && showDetails) {
            window.HarmonyUtils?.showToast(`你选择了"${moodInfo.name}" ${moodInfo.emoji}`, 'info', 2000);
        }
    }
}

// ===== 显示心情详情 =====
function showMoodDetails() {
    const detailsElement = document.getElementById('moodDetails');
    if (detailsElement) {
        detailsElement.style.display = 'block';
        
        // 滚动到详情区域
        setTimeout(() => {
            detailsElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 100);
    }
}

// ===== 隐藏心情详情 =====
function hideMoodDetails() {
    const detailsElement = document.getElementById('moodDetails');
    if (detailsElement) {
        detailsElement.style.display = 'none';
    }
}

// ===== 切换标签 =====
function toggleTag(tagElement) {
    const tagText = tagElement.textContent;
    
    if (tagElement.classList.contains('selected')) {
        tagElement.classList.remove('selected');
        selectedTags = selectedTags.filter(tag => tag !== tagText);
    } else {
        tagElement.classList.add('selected');
        selectedTags.push(tagText);
    }
    
    currentMoodData.tags = selectedTags;
    
    // 添加触觉反馈
    if ('vibrate' in navigator) {
        navigator.vibrate(5);
    }
}

// ===== 取消心情记录 =====
function cancelMoodEntry() {
    // 重置选择状态
    document.querySelectorAll('.mood-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    document.querySelectorAll('.tag-option').forEach(tag => {
        tag.classList.remove('selected');
    });
    
    document.getElementById('moodNote').value = '';
    
    selectedMood = null;
    selectedTags = [];
    currentMoodData = {
        mood: null,
        note: '',
        tags: [],
        date: new Date().toISOString().split('T')[0]
    };
    
    hideMoodDetails();
    
    window.HarmonyUtils?.showToast('已取消心情记录', 'info', 2000);
}

// ===== 保存心情记录 =====
function saveMoodEntry() {
    if (!selectedMood) {
        window.HarmonyUtils?.showToast('请先选择心情', 'warning', 2000);
        return;
    }
    
    const moodNote = document.getElementById('moodNote').value;
    const today = new Date().toISOString().split('T')[0];
    
    const moodEntry = {
        mood: selectedMood,
        note: moodNote,
        tags: selectedTags,
        date: today,
        timestamp: new Date().toISOString()
    };
    
    // 保存到本地存储
    window.HarmonyUtils?.DataCache.set(`mood_${today}`, moodEntry);
    
    // 更新今日统计
    updateTodayChart();
    
    // 隐藏详情区域
    hideMoodDetails();
    
    // 显示成功提示
    const moodInfo = moodMapping[selectedMood];
    window.HarmonyUtils?.showToast(`心情打卡成功！今天你很${moodInfo.name} ${moodInfo.emoji}`, 'success', 3000);
    
    // 添加庆祝动画
    triggerCelebration();
}

// ===== 更新今日图表 =====
function updateTodayChart() {
    const todayBar = document.querySelector('.day-bar.active');
    if (todayBar && selectedMood) {
        const moodInfo = moodMapping[selectedMood];
        const height = `${moodInfo.score * 20}%`;
        
        todayBar.setAttribute('data-height', height);
        todayBar.style.setProperty('--bar-height', height);
        
        const dayEmoji = todayBar.querySelector('.day-emoji');
        if (dayEmoji) {
            dayEmoji.textContent = moodInfo.emoji;
        }
        
        todayBar.classList.remove('active');
        todayBar.style.borderStyle = 'solid';
        todayBar.style.backgroundColor = 'var(--harmony-neutral-background-3)';
    }
}

// ===== 触发庆祝动画 =====
function triggerCelebration() {
    const celebration = document.createElement('div');
    celebration.className = 'celebration-overlay';
    celebration.innerHTML = `
        <div class="celebration-content">
            <div class="celebration-emoji">🎉</div>
            <div class="celebration-text">打卡成功！</div>
        </div>
    `;
    
    celebration.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 107, 157, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: celebration-fade 2s ease-out forwards;
        pointer-events: none;
    `;
    
    document.body.appendChild(celebration);
    
    setTimeout(() => {
        celebration.remove();
    }, 2000);
}

// ===== 显示心情日历 =====
function showMoodCalendar() {
    window.HarmonyUtils?.showToast('心情日历功能开发中...', 'info', 2000);
    // 这里可以跳转到心情日历页面
    // window.location.href = 'mood-calendar.html';
}

// ===== 显示详细统计 =====
function showDetailedStats() {
    window.HarmonyUtils?.showToast('详细统计功能开发中...', 'info', 2000);
    // 这里可以跳转到详细统计页面
}

// ===== 显示完整历史 =====
function showFullHistory() {
    window.HarmonyUtils?.showToast('完整历史功能开发中...', 'info', 2000);
    // 这里可以跳转到历史记录页面
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

// ===== 生成心情统计报告 =====
function generateMoodReport() {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const moodData = window.HarmonyUtils?.DataCache.get(`mood_${dateStr}`);
        last7Days.push({
            date: dateStr,
            mood: moodData?.mood || null,
            score: moodData?.mood ? moodMapping[moodData.mood].score : 0
        });
    }
    
    return last7Days;
}

// ===== 获取心情趋势 =====
function getMoodTrend() {
    const report = generateMoodReport();
    const scores = report.map(day => day.score).filter(score => score > 0);
    
    if (scores.length < 2) return 'insufficient_data';
    
    const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
    const secondHalf = scores.slice(Math.floor(scores.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length;
    
    if (secondAvg > firstAvg + 0.5) return 'improving';
    if (secondAvg < firstAvg - 0.5) return 'declining';
    return 'stable';
}

// ===== 添加庆祝动画CSS =====
const celebrationStyle = document.createElement('style');
celebrationStyle.textContent = `
    @keyframes celebration-fade {
        0% {
            opacity: 0;
            transform: scale(0.8);
        }
        20% {
            opacity: 1;
            transform: scale(1.1);
        }
        80% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0.9);
        }
    }
    
    .celebration-content {
        text-align: center;
        color: var(--harmony-brand-primary);
    }
    
    .celebration-emoji {
        font-size: 4rem;
        margin-bottom: 1rem;
        animation: bounce-in 0.8s ease-out;
    }
    
    .celebration-text {
        font-size: 1.5rem;
        font-weight: 600;
        animation: slide-up 0.6s ease-out 0.2s both;
    }
    
    @keyframes slide-up {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(celebrationStyle);
