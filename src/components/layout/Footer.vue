<template>
  <footer class="app-footer">
    <div class="container-xl footer-inner">
      <div class="footer-left">
        <strong>FitChk</strong>
        <p>Check your daily fit.</p>
      </div>

      <div class="footer-center">
        <RouterLink to="/">피드</RouterLink>
        <RouterLink to="/style">스타일</RouterLink>
        <RouterLink to="/my">마이</RouterLink>
        <a href="#">문의하기</a>
      </div>

      <div class="footer-right">
        <span>© 2026 FitChk. All rights reserved.</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.app-footer {
  background: #0d0d0d;
  color: rgba(255, 255, 255, 0.78);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 60px; /* 하단 바 높이만큼 여백 */
}

.footer-inner {
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-top: 36px;
  padding-bottom: 36px;
}

.footer-left strong {
  display: block;
  color: #fff;
  font-size: 1.15rem;
  font-weight: 900;
  letter-spacing: -0.04em;
}

.footer-left p {
  margin: 6px 0 0;
  font-size: 0.92rem;
  color: rgba(255, 255, 255, 0.58);
}

.footer-center {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
}

.footer-center a {
  color: rgba(255, 255, 255, 0.74);
  text-decoration: none;
  font-size: 0.92rem;
}

.footer-center a:hover {
  color: #fff;
}

.footer-right {
  font-size: 0.86rem;
  color: rgba(255, 255, 255, 0.5);
}

@media (max-width: 991px) {
  .footer-inner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>