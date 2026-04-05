<script setup>
import { reactive } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter, useRoute } from 'vue-router';
import http from '@/util/http';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute(); // 현재 라우트 정보를 담은 route 객체 생성

const loginData = reactive({
    login_id: '',
    password: ''
});

const handleLogin = async () => {
    try {
        const response = await http.post('/auth/login', loginData);
        authStore.login(response); 

        // 원래 가려던 페이지가 있으면 그리로 가고, 없으면 홈으로 이동
        const redirectPath = route.query.redirect || '/';
        router.push(redirectPath);
    } catch (error) {
        alert('로그인 실패: 아이디 또는 비밀번호를 확인하세요.');
    }
};
</script>

<template>
  <div class="login-form-wrap">
    <p class="box-kicker">LOGIN</p>
    <h2>Sign in to FitChk</h2>

    <form class="auth-form" @submit.prevent="handleLogin">
      <div class="input-group">
        <label for="loginId">아이디</label>
        <input
          id="loginId"
          v-model="loginData.login_id"
          type="text"
          placeholder="아이디를 입력하세요"
        />
      </div>

      <div class="input-group">
        <label for="loginPw">비밀번호</label>
        <input
          id="loginPw"
          v-model="loginData.password"
          type="password"
          placeholder="비밀번호를 입력하세요"
        />
      </div>

      <button type="submit" class="auth-btn">LOGIN</button>
    </form>

    <div class="auth-bottom">
      <span>아직 회원이 아니신가요?</span>
      <router-link to="/signup">회원가입</router-link>
    </div>
  </div>
</template>

<style scoped>
.login-form-wrap {
  width: 100%;
}

.box-kicker {
  margin: 0 0 12px;
  font-size: 0.8rem;
  letter-spacing: 0.22em;
  font-weight: 800;
  color: #8d8d86;
}

h2 {
  margin: 0 0 28px;
  font-size: 2rem;
  line-height: 1;
  letter-spacing: -0.06em;
  font-weight: 900;
  color: #111;
}

.auth-form {
  display: grid;
  gap: 18px;
}

.input-group {
  display: grid;
  gap: 8px;
}

.input-group label {
  font-size: 0.92rem;
  font-weight: 700;
  color: #222;
}

.input-group input {
  height: 54px;
  border: 1px solid #e4e4de;
  border-radius: 16px;
  background: #f8f8f6;
  padding: 0 16px;
  color: #111;
  outline: none;
  transition: 0.2s ease;
}

.input-group input:focus {
  border-color: rgba(17, 17, 17, 0.25);
  background: #fff;
}

.auth-btn {
  margin-top: 8px;
  height: 54px;
  border: none;
  border-radius: 999px;
  background: #111;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: 0.03em;
}

.auth-bottom {
  margin-top: 22px;
  display: flex;
  justify-content: center;
  gap: 8px;
  font-size: 0.92rem;
  color: #666;
  flex-wrap: wrap;
}

.auth-bottom a {
  color: #111;
  font-weight: 800;
  text-decoration: none;
}
</style>