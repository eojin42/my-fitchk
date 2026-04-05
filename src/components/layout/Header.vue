<template>
  <header class="app-header">
    <div class="container-xl header-inner">
      <router-link to="/" class="brand">
        <span class="brand-main">FitChk</span>
        <span class="brand-dot"></span>
      </router-link>

      <nav class="header-nav d-none d-md-flex">
        <RouterLink to="/style">스타일</RouterLink>
        <RouterLink to="/ai">AI</RouterLink>
        <RouterLink to="/my">마이</RouterLink>
      </nav>

      <div class="header-actions">
        <template v-if="isLogin">
          <span class="user-name">{{ userName }}</span>
          <router-link to="/my" class="login-btn">마이페이지</router-link>
          <button type="button" class="login-btn logout-btn" @click="handleLogout">로그아웃</button>
        </template>

        <template v-else>
          <router-link to="/login" class="login-btn">로그인</router-link>
          <router-link to="/signup" class="signup-btn">회원가입</router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import '@/assets/css/header.css'


const router = useRouter()
const authStore = useAuthStore()

const isLogin = computed(() => !!authStore.auth.token)
const userName = computed(() => authStore.auth.username || 'USER')

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
/* header.css에서 통합 관리 */
</style>