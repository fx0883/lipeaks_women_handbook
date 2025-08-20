<template>
  <div class="contact-page">
    <div class="main-content">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <h3>联系方式</h3>
        <nav class="sidebar-nav">
          <a href="#customer-service" class="active">📞 客服支持</a>
          <a href="#social-media">📱 社交媒体</a>
          <a href="#email-support">📧 邮件支持</a>
          <a href="#business-cooperation">🤝 商务合作</a>
          <a href="#join-us">💼 加入我们</a>
        </nav>
        
        <h3>快速帮助</h3>
        <div class="quick-help">
          <router-link to="/tutorial" class="btn ghost">📖 使用教程</router-link>
          <router-link to="/faq" class="btn ghost">❓ 常见问题</router-link>
          <router-link to="/feedback" class="btn ghost">📝 意见反馈</router-link>
        </div>
        
        <h3>服务时间</h3>
        <div class="service-time">
          <div class="time-item">
            <div class="time-label">客服热线</div>
            <div class="time-value">9:00-18:00</div>
          </div>
          <div class="time-item">
            <div class="time-label">在线客服</div>
            <div class="time-value">24小时</div>
          </div>
          <div class="time-item">
            <div class="time-label">邮件回复</div>
            <div class="time-value">24小时内</div>
          </div>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="content">
        <div class="page-header">
          <h1>联系我们</h1>
          <p class="sub">我们随时准备为你提供帮助和支持</p>
        </div>

        <!-- 客服支持 -->
        <div class="card" id="customer-service">
          <h2>📞 客服支持</h2>
          <div class="contact-methods">
            <div class="contact-method">
              <div class="method-icon">📱</div>
              <div class="method-content">
                <h3>客服热线</h3>
                <p class="method-desc">工作日9:00-18:00，节假日10:00-17:00</p>
                <div class="method-detail">
                  <strong>400-888-8888</strong>
                  <span class="method-note">（免费客服热线）</span>
                </div>
                <button class="btn primary" @click="callService">立即拨打</button>
              </div>
            </div>
            
            <div class="contact-method">
              <div class="method-icon">💬</div>
              <div class="method-content">
                <h3>在线客服</h3>
                <p class="method-desc">24小时在线，实时解答问题</p>
                <div class="method-detail">
                  <strong>在线聊天</strong>
                  <span class="method-note">（推荐使用）</span>
                </div>
                <button class="btn primary" @click="openChat">开始聊天</button>
              </div>
            </div>
            
            <div class="contact-method">
              <div class="method-icon">📱</div>
              <div class="method-content">
                <h3>微信客服</h3>
                <p class="method-desc">添加微信好友，获得专属服务</p>
                <div class="method-detail">
                  <strong>微信号：chupian_shouzhang</strong>
                  <span class="method-note">（工作日回复）</span>
                </div>
                <button class="btn ghost" @click="copyWechat">复制微信号</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 社交媒体 -->
        <div class="card" id="social-media">
          <h2>📱 社交媒体</h2>
          <div class="social-grid">
            <div class="social-item">
              <div class="social-icon">📘</div>
              <h3>微博</h3>
              <p>关注我们获取最新动态和活动信息</p>
              <div class="social-info">
                <strong>@出片手账官方</strong>
                <span class="follower-count">粉丝：12.5万</span>
              </div>
              <button class="btn ghost" @click="followWeibo">关注微博</button>
            </div>
            
            <div class="social-item">
              <div class="social-icon">📖</div>
              <h3>小红书</h3>
              <p>分享使用技巧和创意灵感</p>
              <div class="social-info">
                <strong>出片手账官方</strong>
                <span class="follower-count">粉丝：8.9万</span>
              </div>
              <button class="btn ghost" @click="followXiaohongshu">关注小红书</button>
            </div>
            
            <div class="social-item">
              <div class="social-icon">🎵</div>
              <h3>抖音</h3>
              <p>观看教程视频和创意展示</p>
              <div class="social-info">
                <strong>@出片手账</strong>
                <span class="follower-count">粉丝：15.2万</span>
              </div>
              <button class="btn ghost" @click="followDouyin">关注抖音</button>
            </div>
            
            <div class="social-item">
              <div class="social-icon">💬</div>
              <h3>QQ群</h3>
              <p>加入用户交流群，分享经验</p>
              <div class="social-info">
                <strong>群号：123456789</strong>
                <span class="follower-count">成员：2.1万</span>
              </div>
              <button class="btn ghost" @click="copyQQGroup">复制群号</button>
            </div>
          </div>
        </div>

        <!-- 邮件支持 -->
        <div class="card" id="email-support">
          <h2>📧 邮件支持</h2>
          <div class="email-support">
            <div class="email-category">
              <h3>技术支持</h3>
              <p>技术问题、Bug反馈、功能建议</p>
              <div class="email-info">
                <strong>tech@chupianshouzhang.com</strong>
                <span class="response-time">回复时间：24小时内</span>
              </div>
              <a href="mailto:tech@chupianshouzhang.com" class="btn primary">发送邮件</a>
            </div>
            
            <div class="email-category">
              <h3>用户服务</h3>
              <p>账号问题、使用帮助、投诉建议</p>
              <div class="email-info">
                <strong>service@chupianshouzhang.com</strong>
                <span class="response-time">回复时间：12小时内</span>
              </div>
              <a href="mailto:service@chupianshouzhang.com" class="btn primary">发送邮件</a>
            </div>
            
            <div class="email-category">
              <h3>商务合作</h3>
              <p>品牌合作、广告投放、渠道合作</p>
              <div class="email-info">
                <strong>business@chupianshouzhang.com</strong>
                <span class="response-time">回复时间：48小时内</span>
              </div>
              <a href="mailto:business@chupianshouzhang.com" class="btn primary">发送邮件</a>
            </div>
          </div>
        </div>

        <!-- 商务合作 -->
        <div class="card" id="business-cooperation">
          <h2>🤝 商务合作</h2>
          <div class="cooperation-info">
            <div class="cooperation-section">
              <h3>合作领域</h3>
              <ul>
                <li>品牌联名合作</li>
                <li>内容创作者合作</li>
                <li>渠道代理合作</li>
                <li>技术合作开发</li>
                <li>投资并购机会</li>
              </ul>
            </div>
            
            <div class="cooperation-section">
              <h3>合作优势</h3>
              <ul>
                <li>年轻女性用户群体精准</li>
                <li>产品功能完善，用户体验优秀</li>
                <li>技术实力强，创新能力突出</li>
                <li>市场前景广阔，增长潜力大</li>
                <li>团队专业，服务态度良好</li>
              </ul>
            </div>
            
            <div class="cooperation-section">
              <h3>联系方式</h3>
              <div class="contact-detail">
                <p><strong>商务合作负责人：</strong>张经理</p>
                <p><strong>联系电话：</strong>138-8888-8888</p>
                <p><strong>邮箱地址：</strong>business@chupianshouzhang.com</p>
                <p><strong>工作时间：</strong>周一至周五 9:00-18:00</p>
              </div>
              <button class="btn primary" @click="contactBusiness">联系商务</button>
            </div>
          </div>
        </div>

        <!-- 加入我们 -->
        <div class="card" id="join-us">
          <h2>💼 加入我们</h2>
          <div class="join-us-content">
            <div class="company-intro">
              <h3>公司简介</h3>
              <p>出片手账是一家专注于年轻女性用户群体的移动应用公司，致力于为用户提供"可爱出片 + 温柔记录"的手账体验。我们相信每一个日常小确幸都值得被记录和分享。</p>
              
              <h3>企业文化</h3>
              <ul>
                <li><strong>用户至上：</strong>始终以用户需求为中心</li>
                <li><strong>创新驱动：</strong>持续创新，追求卓越</li>
                <li><strong>团队协作：</strong>尊重个体，重视团队</li>
                <li><strong>社会责任：</strong>关注用户心理健康</li>
              </ul>
            </div>
            
            <div class="job-opportunities">
              <h3>招聘职位</h3>
              <div class="job-list">
                <div class="job-item">
                  <h4>前端开发工程师</h4>
                  <p>负责移动端和Web端的前端开发工作</p>
                  <span class="job-tag">技术</span>
                  <span class="job-tag">Vue/React</span>
                </div>
                
                <div class="job-item">
                  <h4>UI/UX设计师</h4>
                  <p>负责产品界面设计和用户体验优化</p>
                  <span class="job-tag">设计</span>
                  <span class="job-tag">移动端</span>
                </div>
                
                <div class="job-item">
                  <h4>产品经理</h4>
                  <p>负责产品规划和功能设计</p>
                  <span class="job-tag">产品</span>
                  <span class="job-tag">用户增长</span>
                </div>
              </div>
              
              <div class="apply-info">
                <p><strong>简历投递：</strong>hr@chupianshouzhang.com</p>
                <p><strong>投递格式：</strong>姓名+职位+来源</p>
                <button class="btn primary" @click="sendResume">投递简历</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 联系表单 -->
        <div class="card">
          <h2>💬 在线留言</h2>
          <form class="contact-form" @submit.prevent="submitContact">
            <div class="form-row">
              <div class="form-group">
                <label for="contact-name">姓名 *</label>
                <input 
                  type="text" 
                  id="contact-name" 
                  v-model="contactForm.name" 
                  class="input" 
                  required 
                />
              </div>
              <div class="form-group">
                <label for="contact-email">邮箱 *</label>
                <input 
                  type="email" 
                  id="contact-email" 
                  v-model="contactForm.email" 
                  class="input" 
                  required 
                />
              </div>
            </div>
            
            <div class="form-group">
              <label for="contact-subject">主题 *</label>
              <input 
                type="text" 
                id="contact-subject" 
                v-model="contactForm.subject" 
                class="input" 
                required 
              />
            </div>
            
            <div class="form-group">
              <label for="contact-message">留言内容 *</label>
              <textarea 
                id="contact-message" 
                v-model="contactForm.message" 
                class="input" 
                rows="6" 
                required
              ></textarea>
            </div>
            
            <div class="form-actions">
              <button type="submit" class="btn primary">发送留言</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const contactForm = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const callService = () => {
  if (confirm('是否拨打客服热线 400-888-8888？')) {
    window.location.href = 'tel:400-888-8888'
  }
}

const openChat = () => {
  alert('正在连接在线客服，请稍候...')
}

const copyWechat = () => {
  navigator.clipboard.writeText('chupian_shouzhang').then(() => {
    alert('微信号已复制到剪贴板')
  }).catch(() => {
    alert('微信号：chupian_shouzhang')
  })
}

const followWeibo = () => {
  alert('正在跳转到微博...')
}

const followXiaohongshu = () => {
  alert('正在跳转到小红书...')
}

const followDouyin = () => {
  alert('正在跳转到抖音...')
}

const copyQQGroup = () => {
  navigator.clipboard.writeText('123456789').then(() => {
    alert('QQ群号已复制到剪贴板')
  }).catch(() => {
    alert('QQ群号：123456789')
  })
}

const contactBusiness = () => {
  alert('正在为您转接商务合作负责人...')
}

const sendResume = () => {
  window.location.href = 'mailto:hr@chupianshouzhang.com?subject=简历投递-出片手账'
}

const submitContact = () => {
  if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
    alert('请填写所有必填字段')
    return
  }
  
  alert('留言发送成功！我们会尽快回复你。')
  
  // 重置表单
  contactForm.name = ''
  contactForm.email = ''
  contactForm.subject = ''
  contactForm.message = ''
}
</script>

<style scoped>
.contact-page {
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

.quick-help {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 32px;
}

.quick-help .btn {
  width: 100%;
  margin-bottom: 8px;
  text-align: center;
  text-decoration: none;
}

.service-time {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.time-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--colorNeutralStroke1);
}

.time-item:last-child {
  border-bottom: none;
}

.time-label {
  color: var(--colorNeutralForeground1);
  font-size: 14px;
}

.time-value {
  color: var(--pink-dark);
  font-weight: 600;
  font-size: 14px;
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

.contact-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.contact-method {
  display: flex;
  gap: 16px;
  padding: 24px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 12px;
  background: white;
  transition: all 0.2s ease;
}

.contact-method:hover {
  border-color: var(--pink-dark);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.method-icon {
  font-size: 48px;
  flex-shrink: 0;
}

.method-content {
  flex: 1;
}

.method-content h3 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.method-desc {
  margin: 0 0 16px;
  color: var(--colorNeutralForeground3);
  font-size: 14px;
}

.method-detail {
  margin-bottom: 16px;
}

.method-detail strong {
  color: var(--colorNeutralForeground1);
  font-size: 16px;
}

.method-note {
  color: var(--colorNeutralForeground3);
  font-size: 12px;
  margin-left: 8px;
}

.social-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.social-item {
  text-align: center;
  padding: 24px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 12px;
  background: white;
  transition: all 0.2s ease;
}

.social-item:hover {
  border-color: var(--pink-dark);
  transform: translateY(-2px);
}

.social-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.social-item h3 {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.social-item p {
  margin: 0 0 16px;
  color: var(--colorNeutralForeground3);
  line-height: 1.6;
}

.social-info {
  margin-bottom: 16px;
}

.social-info strong {
  display: block;
  color: var(--colorNeutralForeground1);
  margin-bottom: 4px;
}

.follower-count {
  color: var(--colorNeutralForeground3);
  font-size: 12px;
}

.email-support {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.email-category {
  padding: 24px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 12px;
  background: white;
  text-align: center;
}

.email-category h3 {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.email-category p {
  margin: 0 0 16px;
  color: var(--colorNeutralForeground3);
  line-height: 1.6;
}

.email-info {
  margin-bottom: 16px;
}

.email-info strong {
  display: block;
  color: var(--pink-dark);
  font-size: 16px;
  margin-bottom: 4px;
}

.response-time {
  color: var(--colorNeutralForeground3);
  font-size: 12px;
}

.cooperation-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.cooperation-section h3 {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.cooperation-section ul {
  margin: 0 0 16px;
  padding-left: 20px;
  color: var(--colorNeutralForeground1);
}

.cooperation-section li {
  margin-bottom: 8px;
  line-height: 1.6;
}

.contact-detail p {
  margin: 0 0 8px;
  color: var(--colorNeutralForeground1);
  line-height: 1.6;
}

.join-us-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.company-intro h3 {
  margin: 24px 0 16px;
  font-size: 18px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.company-intro h3:first-child {
  margin-top: 0;
}

.company-intro p {
  margin: 0 0 16px;
  line-height: 1.6;
  color: var(--colorNeutralForeground1);
}

.company-intro ul {
  margin: 0 0 16px;
  padding-left: 20px;
  color: var(--colorNeutralForeground1);
}

.company-intro li {
  margin-bottom: 8px;
  line-height: 1.6;
}

.job-opportunities h3 {
  margin: 0 0 20px;
  font-size: 18px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.job-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.job-item {
  padding: 16px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 8px;
  background: white;
}

.job-item h4 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.job-item p {
  margin: 0 0 12px;
  color: var(--colorNeutralForeground3);
  line-height: 1.6;
}

.job-tag {
  display: inline-block;
  padding: 4px 8px;
  background: rgba(143, 211, 200, 0.2);
  color: var(--pink-dark);
  border-radius: 12px;
  font-size: 11px;
  margin-right: 8px;
}

.apply-info {
  text-align: center;
}

.apply-info p {
  margin: 0 0 8px;
  color: var(--colorNeutralForeground1);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: var(--colorNeutralForeground1);
  font-size: 14px;
}

.input {
  padding: 12px;
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--pink-dark);
}

textarea.input {
  resize: vertical;
  min-height: 120px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
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
  
  .join-us-content {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
