<template>
  <div class="about-page">
    <div class="main-content">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <h3>页面导航</h3>
        <nav class="sidebar-nav">
          <a href="#company-intro" class="active">🏢 公司介绍</a>
          <a href="#our-mission">🎯 使命愿景</a>
          <a href="#team-story">👥 团队故事</a>
          <a href="#product-features">✨ 产品特色</a>
          <a href="#development-history">📈 发展历程</a>
          <a href="#awards-recognition">🏆 荣誉认可</a>
          <a href="#future-plans">🚀 未来规划</a>
        </nav>
        
        <h3>快速链接</h3>
        <div class="quick-links">
          <router-link to="/tutorial" class="btn ghost">📖 使用教程</router-link>
          <router-link to="/faq" class="btn ghost">❓ 常见问题</router-link>
          <router-link to="/contact" class="btn ghost">📞 联系我们</router-link>
        </div>
        
        <h3>数据统计</h3>
        <div class="stats">
          <div class="stat-item">
            <div class="stat-number">500万+</div>
            <div class="stat-label">注册用户</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">1000万+</div>
            <div class="stat-label">作品数量</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">50+</div>
            <div class="stat-label">团队成员</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">4.8</div>
            <div class="stat-label">应用评分</div>
          </div>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="content">
        <div class="page-header">
          <h1>关于我们</h1>
          <p class="sub">用心打造每一款产品，让科技更有温度</p>
        </div>

        <!-- 公司介绍 -->
        <div class="card" id="company-intro">
          <h2>🏢 公司介绍</h2>
          <div class="company-intro">
            <div class="intro-content">
              <p>出片手账（ChuPian ShouZhang）成立于2022年，是一家专注于年轻女性用户群体的移动应用公司。我们致力于为用户提供"可爱出片 + 温柔记录"的手账体验，让每一个日常小确幸都值得被记录和分享。</p>
              
              <p>公司总部位于北京，在上海、深圳设有研发中心，拥有一支充满激情和创造力的年轻团队。我们相信，科技不应该冰冷，而应该温暖人心，帮助用户更好地记录生活、表达情感、分享快乐。</p>
              
              <div class="company-highlights">
                <div class="highlight-item">
                  <div class="highlight-icon">💝</div>
                  <div class="highlight-content">
                    <h4>用户至上</h4>
                    <p>始终以用户需求为中心，倾听用户声音</p>
                  </div>
                </div>
                
                <div class="highlight-item">
                  <div class="highlight-icon">🚀</div>
                  <div class="highlight-content">
                    <h4>创新驱动</h4>
                    <p>持续创新，追求卓越的产品体验</p>
                  </div>
                </div>
                
                <div class="highlight-item">
                  <div class="highlight-icon">🤝</div>
                  <div class="highlight-content">
                    <h4>开放合作</h4>
                    <p>与合作伙伴共同成长，互利共赢</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 使命愿景 -->
        <div class="card" id="our-mission">
          <h2>🎯 使命愿景</h2>
          <div class="mission-vision">
            <div class="mission-section">
              <h3>我们的使命</h3>
              <p>让每一个女性都能轻松记录生活中的美好瞬间，用创意和色彩表达内心的情感世界，在数字时代保持手账的温度和仪式感。</p>
              
              <div class="mission-points">
                <div class="mission-point">
                  <span class="point-icon">📱</span>
                  <span>提供简单易用的创作工具</span>
                </div>
                <div class="mission-point">
                  <span class="point-icon">🎨</span>
                  <span>激发用户的创意灵感</span>
                </div>
                <div class="mission-point">
                  <span class="point-icon">💕</span>
                  <span>营造温暖的社区氛围</span>
                </div>
                <div class="mission-point">
                  <span class="point-icon">🌟</span>
                  <span>帮助用户发现生活之美</span>
                </div>
              </div>
            </div>
            
            <div class="vision-section">
              <h3>我们的愿景</h3>
              <p>成为全球领先的女性生活方式应用平台，让"出片手账"成为记录美好、分享快乐、连接心灵的代名词。</p>
              
              <div class="vision-goals">
                <div class="vision-goal">
                  <h4>短期目标（1-2年）</h4>
                  <ul>
                    <li>用户规模突破1000万</li>
                    <li>产品功能更加完善</li>
                    <li>社区生态初步形成</li>
                  </ul>
                </div>
                
                <div class="vision-goal">
                  <h4>中期目标（3-5年）</h4>
                  <ul>
                    <li>成为行业标杆产品</li>
                    <li>拓展国际市场</li>
                    <li>建立完整的生态体系</li>
                  </ul>
                </div>
                
                <div class="vision-goal">
                  <h4>长期目标（5-10年）</h4>
                  <ul>
                    <li>全球用户突破1亿</li>
                    <li>引领行业发展趋势</li>
                    <li>成为文化符号和生活方式</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 团队故事 -->
        <div class="card" id="team-story">
          <h2>👥 团队故事</h2>
          <div class="team-story">
            <div class="story-intro">
              <p>我们的团队由一群充满梦想和激情的年轻人组成，他们来自不同的背景，但都怀揣着同一个目标：用科技让生活更美好。</p>
            </div>
            
            <div class="team-members">
              <div class="member-card">
                <div class="member-avatar">👨‍💻</div>
                <h4>张明 - 创始人&CEO</h4>
                <p>前某知名互联网公司产品总监，10年产品经验，对用户体验有深刻理解。热爱手账文化，希望用科技让更多人享受创作的乐趣。</p>
              </div>
              
              <div class="member-card">
                <div class="member-avatar">👩‍🎨</div>
                <h4>李雅 - 设计总监</h4>
                <p>资深UI/UX设计师，曾参与多个知名应用的设计工作。擅长将复杂的功能转化为简单优雅的界面，让用户爱不释手。</p>
              </div>
              
              <div class="member-card">
                <div class="member-avatar">👨‍💼</div>
                <h4>王强 - 技术总监</h4>
                <p>全栈工程师，技术功底扎实，对移动端开发有丰富经验。致力于用最先进的技术为用户提供最流畅的体验。</p>
              </div>
              
              <div class="member-card">
                <div class="member-avatar">👩‍💼</div>
                <h4>陈美 - 运营总监</h4>
                <p>资深运营专家，深谙用户心理和社区运营之道。善于策划活动，营造温馨有爱的社区氛围。</p>
              </div>
            </div>
            
            <div class="team-culture">
              <h3>团队文化</h3>
              <div class="culture-values">
                <div class="culture-value">
                  <h4>🎯 专注</h4>
                  <p>专注于做好一件事，精益求精</p>
                </div>
                <div class="culture-value">
                  <h4>🚀 创新</h4>
                  <p>鼓励创新思维，拥抱变化</p>
                </div>
                <div class="culture-value">
                  <h4>🤝 协作</h4>
                  <p>团队合作，共同成长</p>
                </div>
                <div class="culture-value">
                  <h4>💝 用户</h4>
                  <p>以用户为中心，用心服务</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 产品特色 -->
        <div class="card" id="product-features">
          <h2>✨ 产品特色</h2>
          <div class="product-features">
            <div class="feature-grid">
              <div class="feature-item">
                <div class="feature-icon">🎨</div>
                <h4>一键出片</h4>
                <p>精选模板，一键生成精美作品，让创作变得简单有趣</p>
              </div>
              
              <div class="feature-item">
                <div class="feature-icon">😊</div>
                <h4>情绪打卡</h4>
                <p>记录每日心情，建立情绪档案，关注心理健康</p>
              </div>
              
              <div class="feature-item">
                <div class="feature-icon">📅</div>
                <h4>情绪日历</h4>
                <p>可视化情绪变化，发现情绪规律，更好地了解自己</p>
              </div>
              
              <div class="feature-item">
                <div class="feature-icon">🎭</div>
                <h4>生成卡片</h4>
                <p>个性化情绪卡片，表达内心感受，分享给朋友</p>
              </div>
              
              <div class="feature-item">
                <div class="feature-icon">📁</div>
                <h4>相册管理</h4>
                <p>智能分类整理，快速查找作品，管理创作成果</p>
              </div>
              
              <div class="feature-item">
                <div class="feature-icon">🔒</div>
                <h4>隐私保护</h4>
                <p>多重安全防护，保护用户隐私，安心使用</p>
              </div>
            </div>
            
            <div class="feature-highlights">
              <h3>核心优势</h3>
              <div class="advantages">
                <div class="advantage">
                  <h4>🎯 精准定位</h4>
                  <p>专注于年轻女性用户群体，深度理解用户需求</p>
                </div>
                <div class="advantage">
                  <h4>🚀 技术创新</h4>
                  <p>采用最新技术架构，确保产品性能和稳定性</p>
                </div>
                <div class="advantage">
                  <h4>💝 用户体验</h4>
                  <p>简洁优雅的界面设计，流畅自然的交互体验</p>
                </div>
                <div class="advantage">
                  <h4>🌟 内容质量</h4>
                  <p>精选优质模板和素材，提升创作质量</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 发展历程 -->
        <div class="card" id="development-history">
          <h2>📈 发展历程</h2>
          <div class="timeline">
            <div class="timeline-item">
              <div class="timeline-date">2022年3月</div>
              <div class="timeline-content">
                <h4>公司成立</h4>
                <p>出片手账公司正式成立，团队开始产品研发</p>
              </div>
            </div>
            
            <div class="timeline-item">
              <div class="timeline-date">2022年8月</div>
              <div class="timeline-content">
                <h4>产品上线</h4>
                <p>出片手账1.0版本正式上线，获得用户好评</p>
              </div>
            </div>
            
            <div class="timeline-item">
              <div class="timeline-date">2023年1月</div>
              <div class="timeline-content">
                <h4>用户突破</h4>
                <p>注册用户突破100万，产品功能不断完善</p>
              </div>
            </div>
            
            <div class="timeline-item">
              <div class="timeline-date">2023年6月</div>
              <div class="timeline-content">
                <h4>功能升级</h4>
                <p>推出情绪打卡、情绪日历等核心功能</p>
              </div>
            </div>
            
            <div class="timeline-item">
              <div class="timeline-date">2023年12月</div>
              <div class="timeline-content">
                <h4>用户增长</h4>
                <p>用户规模突破300万，获得多轮投资</p>
              </div>
            </div>
            
            <div class="timeline-item">
              <div class="timeline-date">2024年6月</div>
              <div class="timeline-content">
                <h4>产品完善</h4>
                <p>产品功能全面完善，用户体验大幅提升</p>
              </div>
            </div>
            
            <div class="timeline-item">
              <div class="timeline-date">2024年12月</div>
              <div class="timeline-content">
                <h4>未来展望</h4>
                <p>用户突破500万，开始规划国际化发展</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 荣誉认可 -->
        <div class="card" id="awards-recognition">
          <h2>🏆 荣誉认可</h2>
          <div class="awards">
            <div class="award-category">
              <h3>行业奖项</h3>
              <div class="award-list">
                <div class="award-item">
                  <div class="award-icon">🥇</div>
                  <div class="award-content">
                    <h4>2024年度最佳生活方式应用</h4>
                    <p>由中国互联网协会颁发的行业权威奖项</p>
                  </div>
                </div>
                
                <div class="award-item">
                  <div class="award-icon">🥈</div>
                  <div class="award-content">
                    <h4>2024年度创新产品奖</h4>
                    <p>由移动互联网大会颁发的创新奖项</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="award-category">
              <h3>用户认可</h3>
              <div class="recognition-list">
                <div class="recognition-item">
                  <div class="recognition-icon">⭐</div>
                  <div class="recognition-content">
                    <h4>应用商店评分</h4>
                    <p>iOS App Store 4.8分，Google Play 4.7分</p>
                  </div>
                </div>
                
                <div class="recognition-item">
                  <div class="recognition-icon">💬</div>
                  <div class="recognition-content">
                    <h4>用户好评</h4>
                    <p>超过95%的用户给出4星以上评价</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="award-category">
              <h3>媒体报道</h3>
              <div class="media-list">
                <div class="media-item">
                  <div class="media-icon">📰</div>
                  <div class="media-content">
                    <h4>科技日报</h4>
                    <p>《出片手账：用科技温暖女性心灵》专题报道</p>
                  </div>
                </div>
                
                <div class="media-item">
                  <div class="media-icon">📺</div>
                  <div class="media-content">
                    <h4>央视财经</h4>
                    <p>《新消费时代：手账应用的崛起》节目报道</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 未来规划 -->
        <div class="card" id="future-plans">
          <h2>🚀 未来规划</h2>
          <div class="future-plans">
            <div class="plan-section">
              <h3>产品规划</h3>
              <div class="plan-items">
                <div class="plan-item">
                  <h4>🎨 功能升级</h4>
                  <ul>
                    <li>AI智能推荐系统</li>
                    <li>更多创意模板</li>
                    <li>社区互动功能</li>
                    <li>个性化定制</li>
                  </ul>
                </div>
                
                <div class="plan-item">
                  <h4>📱 平台扩展</h4>
                  <ul>
                    <li>Web端应用</li>
                    <li>平板端优化</li>
                    <li>小程序版本</li>
                    <li>桌面端应用</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div class="plan-section">
              <h3>市场拓展</h3>
              <div class="market-plans">
                <div class="market-plan">
                  <h4>🌍 国际化</h4>
                  <p>计划在2025年进入东南亚市场，2026年拓展欧美市场</p>
                </div>
                
                <div class="market-plan">
                  <h4>🤝 生态合作</h4>
                  <p>与更多品牌、设计师、内容创作者建立合作关系</p>
                </div>
                
                <div class="market-plan">
                  <h4>💼 商业模式</h4>
                  <p>探索更多商业化路径，包括广告、会员、电商等</p>
                </div>
              </div>
            </div>
            
            <div class="plan-section">
              <h3>技术发展</h3>
              <div class="tech-plans">
                <div class="tech-plan">
                  <h4>🤖 AI技术</h4>
                  <p>集成更多AI功能，如智能排版、内容生成、个性化推荐</p>
                </div>
                
                <div class="tech-plan">
                  <h4>☁️ 云服务</h4>
                  <p>建设强大的云基础设施，提供更好的数据同步和存储服务</p>
                </div>
                
                <div class="tech-plan">
                  <h4>🔒 安全防护</h4>
                  <p>加强数据安全和隐私保护，采用最新的安全技术</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
// 页面逻辑可以在这里添加
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  background: var(--colorNeutralBackground1);
  padding-top: 80px; /* 为顶部导航留出空间 */
  width: 100%;
  box-sizing: border-box;
}

.main-content {
  display: flex;
  gap: 32px;
  padding: 24px;
  width: 100%;
  box-sizing: border-box;
}

.sidebar {
  width: 280px;
  flex-shrink: 0;
}

.sidebar h3 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 32px;
}

.sidebar-nav a {
  display: block;
  padding: 12px 16px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 8px;
  color: var(--colorNeutralForeground1);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s ease;
}

.sidebar-nav a:hover {
  border-color: var(--pink-dark);
  background: rgba(143, 211, 200, 0.05);
}

.sidebar-nav a.active {
  background: rgba(143, 211, 200, 0.2);
  border-color: var(--pink-dark);
}

.quick-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 32px;
}

.quick-links .btn {
  width: 100%;
  margin-bottom: 8px;
  text-align: center;
  text-decoration: none;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 8px;
  background: white;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: var(--pink-dark);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--colorNeutralForeground3);
}

.content {
  flex: 1;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  margin: 0 0 8px;
  font-size: 32px;
  font-weight: 700;
  color: var(--colorNeutralForeground1);
}

.page-header .sub {
  margin: 0;
  font-size: 16px;
  color: var(--colorNeutralForeground2);
}

.card {
  background: white;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 24px;
}

.card h2 {
  margin: 0 0 24px;
  font-size: 24px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.company-intro p {
  margin: 0 0 20px;
  line-height: 1.8;
  color: var(--colorNeutralForeground1);
  font-size: 16px;
}

.company-highlights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 32px;
}

.highlight-item {
  display: flex;
  gap: 16px;
  padding: 20px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 12px;
  background: rgba(143, 211, 200, 0.05);
}

.highlight-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.highlight-content h4 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.highlight-content p {
  margin: 0;
  color: var(--colorNeutralForeground3);
  line-height: 1.6;
}

.mission-vision {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.mission-section h3,
.vision-section h3 {
  margin: 0 0 16px;
  font-size: 20px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.mission-section p,
.vision-section p {
  margin: 0 0 20px;
  line-height: 1.8;
  color: var(--colorNeutralForeground1);
}

.mission-points {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mission-point {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--colorNeutralForeground1);
}

.point-icon {
  font-size: 20px;
}

.vision-goals {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.vision-goal h4 {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.vision-goal ul {
  margin: 0;
  padding-left: 20px;
  color: var(--colorNeutralForeground1);
}

.vision-goal li {
  margin-bottom: 6px;
  line-height: 1.6;
}

.team-story .story-intro p {
  margin: 0 0 24px;
  line-height: 1.8;
  color: var(--colorNeutralForeground1);
  font-size: 16px;
}

.team-members {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.member-card {
  padding: 20px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 12px;
  background: white;
  text-align: center;
}

.member-avatar {
  font-size: 48px;
  margin-bottom: 16px;
}

.member-card h4 {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.member-card p {
  margin: 0;
  color: var(--colorNeutralForeground3);
  line-height: 1.6;
}

.team-culture h3 {
  margin: 0 0 20px;
  font-size: 20px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.culture-values {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.culture-value {
  text-align: center;
  padding: 20px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 12px;
  background: rgba(143, 211, 200, 0.05);
}

.culture-value h4 {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.culture-value p {
  margin: 0;
  color: var(--colorNeutralForeground3);
  line-height: 1.6;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.feature-item {
  text-align: center;
  padding: 24px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 12px;
  background: white;
  transition: all 0.2s ease;
}

.feature-item:hover {
  border-color: var(--pink-dark);
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.feature-item h4 {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.feature-item p {
  margin: 0;
  color: var(--colorNeutralForeground3);
  line-height: 1.6;
}

.feature-highlights h3 {
  margin: 0 0 20px;
  font-size: 20px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.advantages {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.advantage {
  padding: 20px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 12px;
  background: rgba(143, 211, 200, 0.05);
}

.advantage h4 {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.advantage p {
  margin: 0;
  color: var(--colorNeutralForeground3);
  line-height: 1.6;
}

.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--pink-dark);
}

.timeline-item {
  position: relative;
  margin-bottom: 32px;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -22px;
  top: 8px;
  width: 12px;
  height: 12px;
  background: var(--pink-dark);
  border-radius: 50%;
  border: 3px solid white;
}

.timeline-date {
  font-weight: 600;
  color: var(--pink-dark);
  margin-bottom: 8px;
  font-size: 14px;
}

.timeline-content h4 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.timeline-content p {
  margin: 0;
  color: var(--colorNeutralForeground3);
  line-height: 1.6;
}

.awards {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.award-category h3 {
  margin: 0 0 20px;
  font-size: 20px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.award-list,
.recognition-list,
.media-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.award-item,
.recognition-item,
.media-item {
  display: flex;
  gap: 16px;
  padding: 20px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 12px;
  background: white;
}

.award-icon,
.recognition-icon,
.media-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.award-content h4,
.recognition-content h4,
.media-content h4 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.award-content p,
.recognition-content p,
.media-content p {
  margin: 0;
  color: var(--colorNeutralForeground3);
  line-height: 1.6;
}

.future-plans {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.plan-section h3 {
  margin: 0 0 20px;
  font-size: 20px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.plan-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.plan-item {
  padding: 20px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 12px;
  background: rgba(143, 211, 200, 0.05);
}

.plan-item h4 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.plan-item ul {
  margin: 0;
  padding-left: 20px;
  color: var(--colorNeutralForeground1);
}

.plan-item li {
  margin-bottom: 8px;
  line-height: 1.6;
}

.market-plans,
.tech-plans {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.market-plan,
.tech-plan {
  padding: 20px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 12px;
  background: rgba(143, 211, 200, 0.05);
}

.market-plan h4,
.tech-plan h4 {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.market-plan p,
.tech-plan p {
  margin: 0;
  color: var(--colorNeutralForeground3);
  line-height: 1.6;
}

.btn {
  display: inline-block;
  padding: 8px 16px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 6px;
  background: white;
  color: var(--colorNeutralForeground1);
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover {
  border-color: var(--pink-dark);
  background: rgba(143, 211, 200, 0.05);
}

.btn.ghost {
  background: transparent;
}

.btn.primary {
  background: var(--pink-dark);
  color: white;
  border-color: var(--pink-dark);
}

.btn.primary:hover {
  background: var(--pink-darker);
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
    padding: 16px;
  }
  
  .sidebar {
    width: 100%;
    order: 2;
  }
  
  .content {
    order: 1;
  }
  
  .card {
    padding: 20px;
  }
  
  .mission-vision {
    grid-template-columns: 1fr;
  }
  
  .join-us-content {
    grid-template-columns: 1fr;
  }
  
  .plan-items {
    grid-template-columns: 1fr;
  }
}
</style>

