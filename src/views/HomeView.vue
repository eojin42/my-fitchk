<template>
  <div class="home-page">
    <main>

      <!-- ── 히어로 ── -->
      <section class="hero-section">
        <div class="container-xl">
          <div class="hero-radius">
            <div class="hero-banner" :style="{ backgroundImage: `url(${currentSlide.image})` }">
              <div class="hero-overlay"></div>
              <div class="hero-content">
                <span class="hero-kicker">{{ currentSlide.kicker }}</span>
                <h1 v-html="currentSlide.title"></h1>
                <div class="hero-buttons">
                  <RouterLink to="/" class="btn-hero-main">
                    스타일 둘러보기
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </RouterLink>
                </div>
              </div>
              <div class="hero-dots">
                <button
                  v-for="(_, i) in heroSlides"
                  :key="i"
                  class="hero-dot"
                  :class="{ active: currentSlideIdx === i }"
                  @click="currentSlideIdx = i"
                ></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── #hot fits + 필터 ── -->
      <section class="category-section">
        <div class="container-xl">
          <div class="section-head">
            <h2>#오늘의 핏</h2>
            <div class="view-icons">
              <button type="button" :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="7" height="7" rx="1.5"/>
                  <rect x="14" y="3" width="7" height="7" rx="1.5"/>
                  <rect x="3" y="14" width="7" height="7" rx="1.5"/>
                  <rect x="14" y="14" width="7" height="7" rx="1.5"/>
                </svg>
              </button>
              <button type="button" :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="18" height="4.5" rx="1.5"/>
                  <rect x="3" y="9.75" width="18" height="4.5" rx="1.5"/>
                  <rect x="3" y="16.5" width="18" height="4.5" rx="1.5"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="category-tabs">
            <button
              v-for="cat in categories"
              :key="cat"
              type="button"
              class="category-chip"
              :class="{ active: selectedCategory === cat }"
              @click="selectedCategory = cat"
            >{{ cat }}</button>
          </div>
        </div>
      </section>

      <!-- ── 피드 ── -->
      <section class="feed-section">
        <div class="container-xl">
          <div class="feed-grid" :class="viewMode">
            <article
              v-for="post in posts"
              :key="post.postId"
              class="fit-card"
              @click="goToPost(post.postId)"
            >
              <div class="fit-thumb-wrap">
                <img :src="post.imageUrl ? `http://localhost:9090/uploads/post/${post.imageUrl}` : ''"
                  :alt="post.nickname" class="fit-thumb">
                <div class="fit-overlay">
                  <div class="fit-overlay-inner">
                    <div class="overlay-user">
                      <img :src="post.profileImage ? `http://localhost:9090/uploads/member/${post.profileImage}` : ''"
                           class="overlay-avatar">
                      <span class="overlay-name">{{ post.nickname }}</span>
                    </div>
                    <button
                      class="overlay-like"
                      type="button"
                      @click.stop="toggleLike(post)"
                      :class="{ liked: post.liked }"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24"
                        :fill="post.liked ? 'currentColor' : 'none'"
                        stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                      {{ post.likeCount }}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <!-- 페이지네이션 -->
          <div class="page-navigation" v-if="totalPage > 1">
            <div class="paginate">
              <a v-if="currentPage > 1" href="#" @click.prevent="goPage(1)">‹‹</a>
              <a v-if="currentPage > 1" href="#" @click.prevent="goPage(currentPage - 1)">‹</a>
              <template v-for="p in pageList" :key="p">
                <span v-if="p === currentPage" class="active">{{ p }}</span>
                <a v-else href="#" @click.prevent="goPage(p)">{{ p }}</a>
              </template>
              <a v-if="currentPage < totalPage" href="#" @click.prevent="goPage(currentPage + 1)">›</a>
              <a v-if="currentPage < totalPage" href="#" @click.prevent="goPage(totalPage)">››</a>
            </div>
          </div>

        </div>
      </section>

    </main>

    <!-- ── 하단 플로팅 바 ── -->
    <div class="bottom-bar">
      <RouterLink to="/post/write" class="bottom-btn">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
        올리기
      </RouterLink>
      <RouterLink to="/liked" class="bottom-btn">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        좋아요
      </RouterLink>
      <RouterLink to="/archive" class="bottom-btn">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        아카이브
      </RouterLink>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import '@/assets/css/home.css'

const router = useRouter()

const heroSlides = [
  { kicker: '오늘의 코디를 기록하세요', title: '나만의 핏을<br>공유하세요.', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80' },
  { kicker: '트렌드 무드 아카이브',     title: '스타일을<br>발견하세요.',    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1600&q=80' },
  { kicker: '스트릿 스타일 데일리',     title: '나만의 스타일,<br>나만의 룰.', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80' },
]

const currentSlideIdx = ref(0)
const currentSlide    = computed(() => heroSlides[currentSlideIdx.value])

let slideTimer = null
onMounted(() => {
  slideTimer = setInterval(() => {
    currentSlideIdx.value = (currentSlideIdx.value + 1) % heroSlides.length
  }, 4200)
  fetchPosts()
})
onUnmounted(() => clearInterval(slideTimer))

const PAGE_SIZE        = 12
const categories       = ['전체', '스트릿', '캐주얼', '미니멀', '빈티지', '스포티']
const selectedCategory = ref('전체')
const viewMode         = ref('grid')
const posts            = ref([])
const totalCount       = ref(0)
const currentPage      = ref(1)
const loading          = ref(false)

// 총 페이지 수
const totalPage = computed(() => Math.ceil(totalCount.value / PAGE_SIZE))

// 페이지 번호 목록 (최대 10개)
const pageList = computed(() => {
  const block     = Math.floor((currentPage.value - 1) / 10)
  const start     = block * 10 + 1
  const end       = Math.min(start + 9, totalPage.value)
  const pages     = []
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

async function fetchPosts() {
  loading.value = true
  try {
    const params = { page: currentPage.value, size: PAGE_SIZE }
    if (selectedCategory.value !== '전체') params.styleTag = selectedCategory.value
    const res = await axios.get('http://localhost:9090/api/posts', { params })
    posts.value      = res.data.list        // ✅ { list, totalCount }
    totalCount.value = res.data.totalCount
  } catch (e) {
    console.error('피드 로딩 실패:', e)
  } finally {
    loading.value = false
  }
}

function goPage(page) {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 카테고리 바뀌면 1페이지로
watch(selectedCategory, () => {
  currentPage.value = 1
  fetchPosts()
})

// 페이지 바뀌면 재조회
watch(currentPage, fetchPosts)

async function toggleLike(post) {
  post.liked = !post.liked
  post.likeCount += post.liked ? 1 : -1
  axios.post(`http://localhost:9090/api/posts/${post.postId}/likes`).catch(() => {})
}

function goToPost(id) {
  router.push(`/post/${id}`)
}
</script>