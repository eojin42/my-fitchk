<template>
  <div class="login-page">

    <div class="login-wrap">

      <!-- 타이틀 -->
      <h1 class="login-title">LOGIN</h1>
      <div class="title-line"></div>

      <!-- 폼 영역 -->
      <div class="login-body">

        <!-- 좌측: 입력폼 -->
        <div class="login-fields">
          <div class="lf-row">
            <label class="lf-label">아이디</label>
            <input
              class="lf-input"
              type="text"
              v-model="form.loginId"
              placeholder="아이디를 입력하세요"
              @keyup.enter="handleLogin"
            >
          </div>
          <div class="lf-row">
            <label class="lf-label">비밀번호</label>
            <input
              class="lf-input"
              type="password"
              v-model="form.password"
              placeholder="비밀번호를 입력하세요"
              @keyup.enter="handleLogin"
            >
          </div>
          <div class="lf-util">
            <RouterLink to="/member/pwdFind" class="util-link">아이디 찾기</RouterLink>
            <span class="util-sep">|</span>
            <RouterLink to="/member/pwdFind" class="util-link">비밀번호 찾기</RouterLink>
          </div>
        </div>

        <!-- 우측: 로그인 버튼 -->
        <button class="btn-login" @click="handleLogin" :disabled="loading">
          {{ loading ? '...' : '로그인' }}
        </button>

      </div>

      <p v-if="errorMsg" class="login-error">{{ errorMsg }}</p>

      <div class="section-line"></div>

      <!-- 회원가입 유도 -->
      <div class="signup-section">
        <div class="signup-copy">
          <p>지금 가입하고</p>
          <p><strong>FitChk</strong>의 스타일을 발견하세요.</p>
        </div>
        <RouterLink to="/signup" class="btn-signup">이메일로 가입하기</RouterLink>
      </div>

      <div class="section-line"></div>

      <!-- 카카오 -->
      <div class="sns-section">
        <p class="sns-copy">SNS 계정으로 FitChk을 이용해 보세요.</p>
        <button class="btn-kakao" @click="handleKakaoLogin">
          <span class="kico">K</span>
          카카오로 시작하기
        </button>
      </div>

      <div class="section-line"></div>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import http from '@/util/http'

const router    = useRouter()
const authStore = useAuthStore()
const form      = ref({ loginId: '', password: '' })
const errorMsg  = ref('')
const loading   = ref(false)

async function handleLogin() {
  if (!form.value.loginId || !form.value.password) {
    errorMsg.value = '아이디와 비밀번호를 입력해주세요.'
    return
  }
  loading.value = true; errorMsg.value = ''
  try {
    const res = await http.post('/auth/login', {
    login_id: form.value.loginId,
    password: form.value.password
    })
    authStore.login(res, form.value.loginId) 
    router.push(router.currentRoute.value.query.redirect || '/')
  } catch {
    errorMsg.value = '아이디 또는 비밀번호가 올바르지 않습니다.'
  } finally { loading.value = false }
}

function handleKakaoLogin() {
  // window.location.href = '/oauth2/authorization/kakao'
  alert('카카오 로그인 준비 중입니다.')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  animation: fadeIn 0.4s ease both;
}

.login-wrap {
  width: 100%;
  max-width: 900px;
}

/* 타이틀 */
.login-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: 0.25em;
  color: #111;
  margin-bottom: 28px;
  animation: slideDown 0.5s cubic-bezier(0.22,1,0.36,1) both;
}

.title-line,
.section-line {
  width: 100%;
  height: 1px;
  background: #e5e5e5;
}

.section-line { margin: 0; }

/* 폼 바디 */
.login-body {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 32px 0;
  animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s both;
}

.login-fields {
  flex: 1;
  padding-right: 40px;
  border-right: 1px solid #e5e5e5;
}

.lf-row {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 14px;
}

.lf-label {
  width: 110px;
  flex-shrink: 0;
  font-size: 0.88rem;
  font-weight: 400;
  color: #333;
  letter-spacing: 0.02em;
}

.lf-input {
  flex: 1 !important;
  min-width: 0 !important;
  height: 46px !important;
  background: #f8f8f8 !important;
  border: 1px solid #e0e0e0 !important;
  border-radius: 0 !important;
  color: #111 !important;
  padding: 0 14px !important;
  font-size: 0.9rem !important;
  font-weight: 400 !important;
  outline: none !important;
  transition: border-color 0.2s, background 0.2s !important;
  box-shadow: none !important;
  width: auto !important;
  display: block !important;
}
.lf-input:focus {
  border-color: #111 !important;
  background: #fff !important;
}
.lf-input::placeholder { color: #aaa !important; font-size: 0.85rem; }

.lf-util {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}

.util-link {
  font-size: 0.8rem;
  color: #666;
  text-decoration: none;
  transition: color 0.2s;
}
.util-link:hover { color: #111; }

.util-sep { color: #ccc; font-size: 0.75rem; }

/* 로그인 버튼 */
.btn-login {
  width: 200px;
  flex-shrink: 0;
  height: 80px;
  background: #111;
  color: #fff;
  border: none;
  border-radius: 0;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  cursor: pointer;
  margin-left: 40px;
  transition: background 0.2s, transform 0.15s cubic-bezier(0.34,1.56,0.64,1);
  animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.15s both;
}
.btn-login:hover  { background: #333; transform: scale(1.03); }
.btn-login:active { transform: scale(0.97); }
.btn-login:disabled { opacity: 0.5; cursor: default; transform: none; }

/* 에러 */
.login-error {
  font-size: 0.82rem;
  color: #e53e3e;
  text-align: center;
  padding: 10px 0;
  animation: shake 0.4s cubic-bezier(0.36,0.07,0.19,0.97);
}

@keyframes shake {
  0%,100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

/* 회원가입 */
.signup-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px 0;
  animation: fadeIn 0.5s ease 0.25s both;
}

.signup-copy p {
  font-size: 0.92rem;
  color: #333;
  line-height: 1.6;
}

.signup-copy strong { color: #111; font-weight: 700; }

.btn-signup {
  height: 52px;
  padding: 0 32px;
  background: #fff;
  color: #111;
  border: 1.5px solid #111;
  border-radius: 0;
  font-size: 0.88rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s, transform 0.15s cubic-bezier(0.34,1.56,0.64,1);
  flex-shrink: 0;
}
.btn-signup:hover  { background: #111; color: #fff; transform: scale(1.03); }
.btn-signup:active { transform: scale(0.97); }

/* SNS */
.sns-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px 0;
  animation: fadeIn 0.5s ease 0.35s both;
}

.sns-copy {
  font-size: 0.88rem;
  color: #666;
}

.btn-kakao {
  height: 52px;
  padding: 0 28px;
  background: #FEE500;
  border: none;
  border-radius: 0;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 0.92rem;
  font-weight: 700;
  color: #191919;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s cubic-bezier(0.34,1.56,0.64,1);
}
.btn-kakao:hover  { background: #f5d900; transform: scale(1.03); }
.btn-kakao:active { transform: scale(0.97); }

.kico {
  width: 24px; height: 24px;
  background: #191919;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 900; color: #FEE500;
  flex-shrink: 0;
}

/* 애니메이션 */
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-16px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* 반응형 */
@media (max-width: 640px) {
  .login-body     { flex-direction: column; gap: 24px; }
  .login-fields   { width: 100%; padding-right: 0; border-right: none; }
  .btn-login      { width: 100%; margin-left: 0; height: 52px; }
  .signup-section,
  .sns-section    { flex-direction: column; gap: 16px; text-align: center; }
}
</style>