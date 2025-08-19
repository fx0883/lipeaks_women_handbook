<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h4>出片手账</h4>
        <p>把日常小确幸"可爱出片 + 温柔记录"做成手账</p>
        <div class="social-links">
          <a href="#" class="social-link">微博</a>
          <a href="#" class="social-link">小红书</a>
          <a href="#" class="social-link">抖音</a>
        </div>
      </div>
      
      <div class="footer-section">
        <h4>功能特色</h4>
        <ul class="footer-links">
          <li><router-link to="/create">一键出片</router-link></li>
          <li><router-link to="/mood">情绪打卡</router-link></li>
          <li><router-link to="/mood-calendar">情绪日历</router-link></li>
          <li><router-link to="/album">相册管理</router-link></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h4>帮助支持</h4>
        <ul class="footer-links">
          <li><router-link to="/tutorial">使用教程</router-link></li>
          <li><router-link to="/faq">常见问题</router-link></li>
          <li><router-link to="/feedback">意见反馈</router-link></li>
          <li><router-link to="/contact">联系我们</router-link></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h4>关于我们</h4>
        <ul class="footer-links">
          <li><router-link to="/about">产品介绍</router-link></li>
          <li><router-link to="/privacy">隐私政策</router-link></li>
          <li><router-link to="/terms">用户协议</router-link></li>
          <li><router-link to="/updates">版本更新</router-link></li>
        </ul>
      </div>
    </div>
    
    <div class="footer-bottom">
      <div class="footer-bottom-content">
        <p>&copy; 2024 出片手账. 保留所有权利.</p>
        <p>专为12-20岁女性设计的温柔手账应用</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// 无需额外逻辑，纯展示组件
</script>

<style scoped>
/* 复用原型样式，确保与原型完全一致 */
.footer {
  background: var(--colorNeutralBackground1);
  border-top: 1px solid var(--colorNeutralStroke1);
  margin-top: 80px;
  padding: 48px 0 24px;
  width: 100%;
}

.footer-content {
  width: 100%;
  margin: 0;
  padding: 0 32px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
}

.footer-section h4 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: var(--colorNeutralForeground1);
}

.footer-section p {
  margin: 0 0 16px;
  color: var(--colorNeutralForeground2);
  font-size: 14px;
  line-height: 1.6;
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-link {
  color: var(--colorNeutralForeground2);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.social-link:hover {
  color: var(--pink-dark);
}

.footer-links {
  list-style: none;
  margin: 0;
  padding: 0;
}

.footer-links li {
  margin-bottom: 8px;
}

.footer-links a {
  color: var(--colorNeutralForeground2);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: var(--pink-dark);
}

.footer-bottom {
  border-top: 1px solid var(--colorNeutralStroke1);
  margin-top: 32px;
  padding-top: 24px;
}

.footer-bottom-content {
  width: 100%;
  margin: 0;
  padding: 0 32px;
  text-align: center;
}

.footer-bottom p {
  margin: 0 0 8px;
  color: var(--colorNeutralForeground2);
  font-size: 12px;
}

.footer-bottom p:last-child {
  margin-bottom: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer {
    margin-top: 60px;
    padding: 32px 0 16px;
  }
  
  .footer-content {
    padding: 0 16px;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 24px;
  }
  
  .footer-bottom-content {
    padding: 0 16px;
  }
}

@media (max-width: 480px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .social-links {
    justify-content: center;
  }
}
</style>
