<template>
  <div class="style-page">

    <!-- 페이지 헤더 -->
    <div class="style-head">
      <div class="container-xl">
        <div class="style-head-inner">
          <div>
            <h1 class="style-title">스타일</h1>
            <p class="style-desc">취향에 맞는 코디를 필터로 찾아보세요.</p>
          </div>
          <RouterLink to="/post/write" class="btn-upload">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            코디 올리기
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- 필터 바 -->
    <div class="filter-bar">
      <div class="container-xl">
        <div class="filter-bar-inner">
          <div class="filter-chips">
            <button
              v-for="cat in filterCategories"
              :key="cat.key"
              class="filter-chip"
              :class="{ active: activePanel === cat.key || hasFilter(cat.key) }"
              @click="togglePanel(cat.key)"
            >
              {{ cat.label }}
              <span v-if="getFilterCount(cat.key)" class="filter-badge">{{ getFilterCount(cat.key) }}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                :style="{ transform: activePanel === cat.key ? 'rotate(180deg)' : '', transition: 'transform 0.2s' }">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            <button v-if="hasAnyFilter" class="filter-reset" @click="resetAll">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
              초기화
            </button>
          </div>
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

        <!-- 드롭다운 패널 -->
        <div class="filter-panel" v-if="activePanel">
          <div class="filter-panel-inner">
            <label
              v-for="opt in currentOptions"
              :key="opt"
              class="filter-option"
              :class="{ checked: isSelected(activePanel, opt) }"
            >
              <input type="checkbox" :checked="isSelected(activePanel, opt)" @change="toggleFilter(activePanel, opt)">
              <span class="filter-option-label">{{ opt }}</span>
            </label>
          </div>
        </div>

        <!-- 선택된 필터 태그 -->
        <div class="active-filters" v-if="hasAnyFilter">
          <template v-for="cat in filterCategories" :key="cat.key">
            <span v-for="val in filters[cat.key]" :key="val" class="active-tag">
              {{ val }}
              <button @click="toggleFilter(cat.key, val)">✕</button>
            </span>
          </template>
        </div>
      </div>
    </div>

    <!-- 피드 -->
    <div class="style-feed">
      <div class="container-xl">

        <div class="feed-header">
          <span class="feed-count">{{ totalCount }}개</span>
        </div>

        <div class="feed-grid" :class="viewMode" v-if="posts.length > 0">
          <article
            v-for="post in posts"
            :key="post.postId"
            class="fit-card"
            @click="$router.push(`/post/${post.postId}`)"
          >
            <!-- 썸네일 -->
            <div class="fit-thumb-wrap">
              <img
                :src="post.imageUrl ? `http://localhost:9090/uploads/post/${post.imageUrl}` : ''"
                :alt="post.nickname"
                class="fit-thumb"
              >
              <!-- 좋아요 버튼 -->
              <button
                class="thumb-like"
                type="button"
                @click.stop="toggleLike(post)"
                :class="{ liked: post.liked }"
              >
                <svg width="14" height="14" viewBox="0 0 24 24"
                  :fill="post.liked ? 'currentColor' : 'none'"
                  stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>

            <!-- 카드 하단 텍스트 -->
            <div class="fit-info">
              <!-- 작성자 -->
              <div class="fit-author">
                <img
                  :src="post.profileImage ? `http://localhost:9090/uploads/member/${post.profileImage}` : ''"
                  class="fit-avatar"
                >
                <span class="fit-nickname">{{ post.nickname }}</span>
              </div>
              <!-- 본문 미리보기 -->
              <p class="fit-content">{{ post.content }}</p>
              <!-- 좋아요 + 댓글 수 -->
              <div class="fit-stats">
                <span class="fit-stat">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  {{ post.likeCount }}
                </span>
                <span class="fit-stat">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  {{ post.commentCount }}
                </span>
              </div>
            </div>
          </article>
        </div>

        <!-- 빈 상태 -->
        <div class="empty-state" v-if="!loading && posts.length === 0">
          <p class="empty-icon">👗</p>
          <p class="empty-title">조건에 맞는 게시글이 없어요</p>
          <p class="empty-desc">필터를 바꿔보거나 첫 번째 코디를 올려보세요!</p>
          <RouterLink to="/post/write" class="btn-empty">코디 올리기</RouterLink>
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
    </div>

    <!-- 하단 플로팅 바 -->
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

    <div v-if="activePanel" class="panel-backdrop" @click="activePanel = null"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import http from '@/util/http'

const router    = useRouter()
const authStore = useAuthStore()

const filterCategories = [
  { key: 'gender',   label: '성별' },
  { key: 'styleTag', label: '스타일' },
  { key: 'season',   label: '계절' },
  { key: 'tpo',      label: 'TPO' },
]

const filterOptions = {
  gender:   ['여성', '남성', '유니섹스'],
  styleTag: ['캐주얼', '스트릿', '미니멀', '걸리시', '스포티', '클래식', '워크웨어', '로맨틱', '시크', '시티보이', '고프코어', '레트로', '프레피', '리조트', '에스닉'],
  season:   ['봄', '여름', '가을', '겨울'],
  tpo:      ['데일리', '데이트', '캠퍼스', '출근', '결혼식', '피트니스', '러닝', '요가/필라테스', '바다/수영', '골프', '페스티벌', '등산/아웃도어'],
}

const activePanel = ref(null)
const viewMode    = ref('grid')
const posts       = ref([])
const totalCount  = ref(0)
const currentPage = ref(1)
const loading     = ref(false)
const PAGE_SIZE   = 12

const filters = ref({ gender: [], styleTag: [], season: [], tpo: [] })

const currentOptions = computed(() => filterOptions[activePanel.value] || [])

function togglePanel(key) {
  activePanel.value = activePanel.value === key ? null : key
}

function isSelected(key, val) { return filters.value[key].includes(val) }

function toggleFilter(key, val) {
  const arr = filters.value[key]
  const idx = arr.indexOf(val)
  if (idx > -1) arr.splice(idx, 1)
  else arr.push(val)
}

function hasFilter(key)    { return filters.value[key].length > 0 }
function getFilterCount(k) { return filters.value[k].length || 0 }

const hasAnyFilter = computed(() =>
  Object.values(filters.value).some(arr => arr.length > 0)
)

function resetAll() {
  filters.value = { gender: [], styleTag: [], season: [], tpo: [] }
  currentPage.value = 1
}

const totalPage = computed(() => Math.ceil(totalCount.value / PAGE_SIZE))

const pageList = computed(() => {
  const block = Math.floor((currentPage.value - 1) / 10)
  const start = block * 10 + 1
  const end   = Math.min(start + 9, totalPage.value)
  const pages = []
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

function goPage(page) {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function fetchPosts() {
  loading.value = true
  try {
    const params = { page: currentPage.value, size: PAGE_SIZE }
    if (filters.value.gender.length === 1)   params.gender   = filters.value.gender[0]
    if (filters.value.styleTag.length > 0)   params.styleTag = filters.value.styleTag.join(',')
    if (filters.value.season.length > 0)     params.season   = filters.value.season.join(',')
    if (filters.value.tpo.length > 0)        params.tpo      = filters.value.tpo.join(',')

    const res        = await http.get('/posts', { params })
    posts.value      = res.list
    totalCount.value = res.totalCount
  } catch (e) {
    console.error('피드 로딩 실패', e)
  } finally {
    loading.value = false
  }
}

async function toggleLike(post) {
  if (!authStore.auth?.token) { router.push('/member/login'); return }
  post.liked = !post.liked
  post.likeCount += post.liked ? 1 : -1
  try {
    await http.post(`/posts/${post.postId}/likes`)
  } catch (e) {
    post.liked = !post.liked
    post.likeCount += post.liked ? 1 : -1
  }
}

function splitTags(str) {
  if (!str) return []
  return str.split(',').map(s => s.trim()).filter(Boolean)
}

watch(filters, () => {
  currentPage.value = 1
  fetchPosts()
}, { deep: true })
watch(currentPage, fetchPosts)
onMounted(fetchPosts)
</script>

<style scoped>
.style-page {
  min-height: 100vh;
  background: var(--fc-bg);
  padding-bottom: 60px;
}

/* ── 헤더 ── */
.style-head {
  background: var(--fc-surface);
  border-bottom: 1px solid var(--fc-line);
  padding: 36px 0 24px;
}
.style-head-inner { display: flex; align-items: flex-start; justify-content: space-between; }
.style-title { font-size: 2rem; font-weight: 900; letter-spacing: -0.06em; color: var(--fc-text); margin-bottom: 6px; }
.style-desc  { font-size: 0.88rem; color: var(--fc-text-muted); }

.btn-upload {
  display: inline-flex; align-items: center; gap: 6px;
  height: 42px; padding: 0 20px;
  background: var(--fc-black); color: #fff;
  border-radius: 999px; font-size: 0.85rem; font-weight: 600;
  text-decoration: none; transition: all 0.2s; flex-shrink: 0;
}
.btn-upload:hover { opacity: 0.85; transform: translateY(-1px); }

/* ── 필터 바 ── */
.filter-bar {
  background: var(--fc-surface);
  border-bottom: 1px solid var(--fc-line);
  position: sticky; top: 0; z-index: 200;
}
.filter-bar-inner { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; }
.filter-chips     { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

.filter-chip {
  display: inline-flex; align-items: center; gap: 5px;
  height: 36px; padding: 0 14px;
  border: 1.5px solid var(--fc-line); border-radius: 999px;
  background: var(--fc-surface); color: var(--fc-text-muted);
  font-size: 0.85rem; font-weight: 600; cursor: pointer;
  transition: all 0.18s; white-space: nowrap;
}
.filter-chip:hover { border-color: var(--fc-text); color: var(--fc-text); }
.filter-chip.active { background: var(--fc-black); border-color: var(--fc-black); color: #fff; }

.filter-badge {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 18px; height: 18px; padding: 0 4px;
  background: #ff4d6d; color: #fff;
  border-radius: 999px; font-size: 11px; font-weight: 700;
}

.filter-reset {
  display: inline-flex; align-items: center; gap: 5px;
  height: 36px; padding: 0 14px;
  border: none; background: none;
  color: var(--fc-text-muted); font-size: 0.82rem; font-weight: 600;
  cursor: pointer; transition: color 0.15s;
}
.filter-reset:hover { color: var(--fc-text); }

.filter-panel {
  border-top: 1px solid var(--fc-line);
  padding: 16px 0 20px;
  background: var(--fc-surface);
  position: relative; z-index: 201;
}
.filter-panel-inner { display: flex; flex-wrap: wrap; gap: 10px; }

.filter-option {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 16px;
  border: 1.5px solid var(--fc-line); border-radius: 999px;
  cursor: pointer; font-size: 0.88rem; font-weight: 500;
  color: var(--fc-text-muted); background: var(--fc-surface);
  transition: all 0.15s; user-select: none;
}
.filter-option input { display: none; }
.filter-option:hover { border-color: var(--fc-text); color: var(--fc-text); }
.filter-option.checked { background: var(--fc-black); border-color: var(--fc-black); color: #fff; font-weight: 600; }

.active-filters { display: flex; flex-wrap: wrap; gap: 8px; padding: 10px 0 14px; }

.active-tag {
  display: inline-flex; align-items: center; gap: 6px;
  height: 30px; padding: 0 12px;
  background: rgba(17,17,17,0.07); border-radius: 999px;
  font-size: 0.8rem; font-weight: 600; color: var(--fc-text);
}
.active-tag button { background: none; border: none; font-size: 10px; color: var(--fc-text-muted); cursor: pointer; padding: 0; }
.active-tag button:hover { color: #e53e3e; }

.panel-backdrop { position: fixed; inset: 0; z-index: 199; }

.view-icons { display: flex; gap: 8px; }
.view-icons button {
  width: 36px; height: 36px;
  border: 1.5px solid var(--fc-line) !important; border-radius: 10px !important;
  background: var(--fc-surface) !important; color: var(--fc-text-muted);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.2s; padding: 0;
}
.view-icons button.active,
.view-icons button:hover { border-color: var(--fc-text) !important; color: var(--fc-text) !important; }

/* ── 피드 ── */
.style-feed { padding: 24px 0 40px; }
.feed-header { margin-bottom: 16px; }
.feed-count  { font-size: 0.88rem; color: var(--fc-text-muted); font-weight: 500; }

.feed-grid {
  display: grid; gap: 16px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
.feed-grid.list { grid-template-columns: repeat(2, minmax(0, 1fr)); }

/* ── 카드 ── */
.fit-card { cursor: pointer; }

.fit-thumb-wrap {
  border-radius: 14px; overflow: hidden;
  aspect-ratio: 0.78 / 1;
  background: var(--fc-line); position: relative;
}

.fit-thumb {
  width: 100%; height: 100%; object-fit: cover; display: block;
  transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
}
.fit-card:hover .fit-thumb { transform: scale(1.04); }

/* 좋아요 버튼 (우상단) */
.thumb-like {
  position: absolute; top: 10px; right: 10px;
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(255,255,255,0.85);
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: var(--fc-text-muted);
  transition: all 0.2s; z-index: 2;
}
.thumb-like:hover { background: #fff; color: #ff4d6d; }
.thumb-like.liked { background: #fff; color: #ff4d6d; }
.thumb-like.liked svg { fill: #ff4d6d; stroke: #ff4d6d; }

/* 카드 하단 텍스트 */
.fit-info { padding: 10px 4px 4px; }

.fit-author {
  display: flex; align-items: center; gap: 7px; margin-bottom: 6px;
}

.fit-avatar {
  width: 22px; height: 22px; border-radius: 50%;
  object-fit: cover; border: 1.5px solid var(--fc-line); flex-shrink: 0;
  background: var(--fc-bg);
}

.fit-nickname {
  font-size: 0.8rem; font-weight: 700; color: var(--fc-text);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.fit-tags {
  display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 6px;
}

.fit-content {
  font-size: 0.78rem;
  color: var(--fc-text-muted);
  line-height: 1.5;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 4px;
}

.fit-stats {
  display: flex; gap: 10px;
}

.fit-stat {
  display: flex; align-items: center; gap: 4px;
  font-size: 0.75rem; color: var(--fc-text-muted); font-weight: 500;
}

/* 빈 상태 */
.empty-state { text-align: center; padding: 80px 0; }
.empty-icon  { font-size: 3rem; margin-bottom: 14px; }
.empty-title { font-size: 1.1rem; font-weight: 700; color: var(--fc-text); margin-bottom: 8px; }
.empty-desc  { font-size: 0.88rem; color: var(--fc-text-muted); margin-bottom: 24px; }

.btn-empty {
  display: inline-flex; align-items: center;
  height: 46px; padding: 0 28px;
  background: var(--fc-black); color: #fff;
  border-radius: 999px; font-size: 0.88rem; font-weight: 600;
  text-decoration: none; transition: all 0.2s;
}
.btn-empty:hover { opacity: 0.85; transform: translateY(-1px); }

/* 페이지네이션 */
.page-navigation { display: flex; justify-content: center; padding: 32px 0; }
.paginate { display: flex; align-items: center; flex-wrap: wrap; font-size: 14px; }
.paginate a, .paginate span {
  display: flex; align-items: center; justify-content: center;
  min-width: 36px; height: 36px; padding: 0 10px; margin-left: -1px;
  color: var(--fc-text); background: var(--fc-surface);
  border: 1px solid var(--fc-line); text-decoration: none; transition: all 0.15s;
}
.paginate a:hover { background: var(--fc-bg); }
.paginate span.active { color: #fff; background: var(--fc-black); border-color: var(--fc-black); pointer-events: none; }
.paginate :first-child { margin-left: 0; border-radius: 6px 0 0 6px; }
.paginate :last-child  { border-radius: 0 6px 6px 0; }

/* 하단 바 */
.bottom-bar {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 200;
  display: flex; height: 60px;
  background: #0d0d0d; border-top: 1px solid rgba(255,255,255,0.06);
}
.bottom-btn {
  flex: 1; display: flex; flex-direction: row;
  align-items: center; justify-content: center; gap: 8px;
  color: rgba(255,255,255,0.6); font-size: 0.74rem; font-weight: 700;
  text-decoration: none; border-right: 1px solid rgba(255,255,255,0.07);
  transition: all 0.2s;
}
.bottom-btn:last-child { border-right: none; }
.bottom-btn:hover { background: rgba(255,255,255,0.05); color: #fff; }

/* 반응형 */
@media (max-width: 1199px) { .feed-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 991px)  { .feed-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 767px)  {
  .style-title { font-size: 1.6rem; }
  .style-head-inner { flex-direction: column; gap: 16px; }
  .feed-grid, .feed-grid.list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
</style>