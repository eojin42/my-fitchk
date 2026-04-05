<script setup>
import { useRouter } from 'vue-router'
import '@/assets/css/error.css'

const router = useRouter()

const goToMain = () => {
  router.push('/')
}
</script>

<template>
  <section class="error-page">
    <div class="container-xl">
      <div class="error-wrap" data-aos="fade-up" data-aos-delay="120">
        <p class="error-code">404</p>
        <h1 class="error-title">페이지를 찾을 수 없습니다.</h1>
        <p class="error-desc">
          죄송합니다.<br />
          요청하신 페이지가 존재하지 않거나 이동되었어요.
        </p>

        <button type="button" class="btn-pill-dark" @click="goToMain">
          메인으로 이동
          <i class="bi bi-arrow-right-short"></i>
        </button>
      </div>
    </div>
  </section>
</template>