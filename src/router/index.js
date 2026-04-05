import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

import HomeView from '@/views/HomeView.vue'

const routes = [

  // ── 공개 페이지 ──────────────────────────────
  { path: '/',       name: 'Home',   component: HomeView },
  { path: '/login',  name: 'Login',  component: () => import('@/views/member/LoginView.vue') },
  { path: '/signup', name: 'Signup', component: () => import('@/views/member/SignupView.vue') },

  // ── 피드 ──────────────────────────────────────
  { path: '/post/write', name: 'PostWrite',  component: () => import('@/views/style/WriteView.vue'), meta: { requiresAuth: true } },
 { path: '/post/:id',   name: 'PostDetail', component: () => import('@/views/style/DetailView.vue') },

  // ── 스타일 ────────────────────────────────────
  { path: '/style', name: 'Style', component: () => import('@/views/StyleView.vue') },

  // ── AI ────────────────────────────────────
  { path: '/ai', name: 'AI', component: () => import('@/views/AIView.vue') },


  // ── 마이 (로그인 필요) ────────────────────────
  { path: '/my',      name: 'My',      component: () => import('@/views/mypage/MyView.vue'),      meta: { requiresAuth: true } },
 // { path: '/liked',   name: 'Liked',   component: () => import('@/views/mypage/LikedView.vue'),   meta: { requiresAuth: true } },
 // { path: '/archive', name: 'Archive', component: () => import('@/views/mypage/ArchiveView.vue'), meta: { requiresAuth: true } },

  // ── 기타 ──────────────────────────────────────
  { path: '/about', name: 'About', component: () => import('@/views/AboutView.vue') },

  // ── 404 ──────────────────────────────────────
  { path: '/:catchAll(.*)', name: 'NotFound', component: () => import('@/views/error/NotFound.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
})

// 네비게이션 가드
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth) {
    if (!authStore.auth?.token) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router