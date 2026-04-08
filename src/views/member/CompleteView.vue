<template>
  <div class="complete-page">
    <div class="complete-wrap">

      <!-- 체크 아이콘 -->
      <div class="complete-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </div>

      <h1 class="complete-title">{{ pageInfo.title }}</h1>
      <p class="complete-desc">{{ pageInfo.desc }}</p>

      <div class="complete-btns">
        <RouterLink :to="pageInfo.primaryTo" class="btn-primary">
          {{ pageInfo.primaryLabel }}
        </RouterLink>
        <RouterLink to="/" class="btn-secondary">홈으로</RouterLink>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const type  = route.query.type

const pageInfo = computed(() => {
  if (type === 'update') {
    return {
      title:        '정보가 수정됐어요!',
      desc:         '회원 정보가 성공적으로 변경되었습니다.',
      primaryTo:    '/my',
      primaryLabel: '마이페이지로',
    }
  }
  // 기본값: 회원가입 완료
  return {
    title:        '가입을 환영해요!',
    desc:         'FitChk 회원이 되셨습니다.\n로그인하고 오늘의 코디를 공유해보세요.',
    primaryTo:    '/login',
    primaryLabel: '로그인하기',
  }
})
</script>

<style scoped>
.complete-page {
  min-height: 100vh;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  animation: fadeIn 0.4s ease both;
}

.complete-wrap {
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.complete-icon {
  width: 88px; height: 88px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 24px;
  color: #111;
  animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both;
}

.complete-title {
  font-size: 1.6rem;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: #111;
  margin-bottom: 12px;
  animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.3s both;
}

.complete-desc {
  font-size: 0.92rem;
  color: #666;
  line-height: 1.8;
  white-space: pre-line;
  margin-bottom: 32px;
  animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.4s both;
}

.complete-btns {
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.5s both;
}

.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  background: #111;
  color: #fff;
  border-radius: 0;
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s;
}
.btn-primary:hover { background: #333; }

.btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  background: #fff;
  color: #111;
  border: 1.5px solid #e0e0e0;
  border-radius: 0;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  transition: border-color 0.2s;
}
.btn-secondary:hover { border-color: #111; }

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.6); }
  to   { opacity: 1; transform: scale(1); }
}
</style>