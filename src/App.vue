<template>
  <div class="app-shell">
    <Header />
    <router-view />
    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: var(--fc-bg);
}
</style>