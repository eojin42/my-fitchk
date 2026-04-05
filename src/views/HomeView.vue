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
              v-for="post in filteredPosts"
              :key="post.id"
              class="fit-card"
              @click="goToPost(post.id)"
            >
              <div class="fit-thumb-wrap">
                <img :src="post.image" :alt="post.user" class="fit-thumb">
                <div class="fit-overlay">
                  <div class="fit-overlay-inner">
                    <div class="overlay-user">
                      <img :src="post.profile" :alt="post.user" class="overlay-avatar">
                      <span class="overlay-name">{{ post.user }}</span>
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
                      {{ post.likes }}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div class="page-navigation">
            <div class="paginate">
              <a href="#">‹</a>
              <a href="#" class="active">1</a>
              <a href="#">2</a>
              <a href="#">3</a>
              <a href="#">...</a>
              <a href="#">›</a>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import '@/assets/css/home.css'

const router = useRouter()

// 히어로 슬라이드 — 무신사 스냅 감성 이미지
const heroSlides = [
  {
    kicker: '오늘의 코디를 기록하세요',
    title: '나만의 핏을<br>공유하세요.',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80'
  },
  {
    kicker: '트렌드 무드 아카이브',
    title: '스타일을<br>발견하세요.',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1600&q=80'
  },
  {
    kicker: '스트릿 스타일 데일리',
    title: '나만의 스타일,<br>나만의 룰.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80'
  }
]

const currentSlideIdx = ref(0)
const currentSlide = computed(() => heroSlides[currentSlideIdx.value])

let slideTimer = null
onMounted(() => {
  slideTimer = setInterval(() => {
    currentSlideIdx.value = (currentSlideIdx.value + 1) % heroSlides.length
  }, 4200)
})
onUnmounted(() => clearInterval(slideTimer))

// 카테고리
const categories = ['전체', '스트릿', '캐주얼', '미니멀', '빈티지', '스포티']
const selectedCategory = ref('전체')
const viewMode = ref('grid')

const posts = ref([
  { id:1,  user:'@태혁',  category:'스트릿',  likes:321, liked:false, image:'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=600&q=80',  profile:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80' },
  { id:2,  user:'@예림',  category:'캐주얼',  likes:280, liked:false, image:'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80',  profile:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80' },
  { id:3,  user:'@동원',  category:'미니멀',  likes:192, liked:false, image:'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',  profile:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80' },
  { id:4,  user:'@히히요', category:'빈티지',  likes:267, liked:false, image:'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=600&q=80',  profile:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80' },
  { id:5,  user:'@루비',  category:'스트릿',  likes:153, liked:false, image:'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80',  profile:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80' },
  { id:6,  user:'@레오',  category:'캐주얼',  likes:153, liked:false, image:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',  profile:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' },
  { id:7,  user:'@이사',  category:'미니멀',  likes:553, liked:false, image:'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=600&q=80',  profile:'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80' },
  { id:8,  user:'@규리',  category:'빈티지',  likes:158, liked:false, image:'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80',  profile:'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=100&q=80' },
  { id:9,  user:'@태성',  category:'스트릿',  likes:195, liked:false, image:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',  profile:'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=100&q=80' },
  { id:10, user:'@이사',  category:'미니멀',  likes:374, liked:false, image:'https://images.unsplash.com/photo-1523359346063-d879354c0ea5?auto=format&fit=crop&w=600&q=80',  profile:'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80' },
  { id:11, user:'@규리',  category:'캐주얼',  likes:192, liked:false, image:'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80',  profile:'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=100&q=80' },
  { id:12, user:'@수진',  category:'빈티지',  likes:994, liked:false, image:'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',  profile:'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=100&q=80' },
])

const filteredPosts = computed(() =>
  selectedCategory.value === '전체'
    ? posts.value
    : posts.value.filter(p => p.category === selectedCategory.value)
)

function toggleLike(post) {
  post.liked = !post.liked
  post.likes += post.liked ? 1 : -1
  // TODO: await axios.post(`/api/posts/${post.id}/likes`)
}

function goToPost(id) {
  router.push(`/post/${id}`)
}
</script>