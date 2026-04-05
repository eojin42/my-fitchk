<template>
  <div class="style-page">

    <!-- 페이지 헤더 -->
    <div class="style-head">
      <div class="container-xl">
        <div class="style-head-inner">
          <div>
            <h1 class="style-title">스타일</h1>
            <p class="style-desc">취향에 맞는 코디를 태그별로 찾아보세요.</p>
          </div>
          <RouterLink to="/post/write" class="btn-upload">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            코디 올리기
          </RouterLink>
        </div>

        <!-- 스타일 태그 목록 -->
        <div class="style-tag-list">
          <button
            v-for="tag in styleTags"
            :key="tag.name"
            class="style-tag-btn"
            :class="{ active: selectedTag === tag.name }"
            @click="selectTag(tag.name)"
          >
            <span class="tag-emoji">{{ tag.emoji }}</span>
            <span class="tag-name">{{ tag.name }}</span>
            <span class="tag-count">{{ tag.count }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 선택된 태그 피드 -->
    <div class="style-feed">
      <div class="container-xl">

        <!-- 선택된 태그 표시 -->
        <div class="feed-header">
          <h2 class="feed-title">
            <span class="feed-tag-name">#{{ selectedTag }}</span>
            <span class="feed-count">{{ filteredPosts.length }}개</span>
          </h2>
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

        <!-- 피드 그리드 -->
        <div class="feed-grid" :class="viewMode">
          <article
            v-for="post in filteredPosts"
            :key="post.id"
            class="fit-card"
            @click="$router.push(`/post/${post.id}`)"
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

        <!-- 게시글 없을 때 -->
        <div class="empty-state" v-if="filteredPosts.length === 0">
          <p class="empty-icon">👗</p>
          <p class="empty-title">아직 게시글이 없어요</p>
          <p class="empty-desc">#{{ selectedTag }} 스타일의 첫 번째 코디를 올려보세요!</p>
          <RouterLink to="/post/write" class="btn-empty">코디 올리기</RouterLink>
        </div>

        <!-- 페이지네이션 -->
        <div class="page-navigation" v-if="filteredPosts.length > 0">
          <div class="paginate">
            <a href="#">‹</a>
            <a href="#" class="active">1</a>
            <a href="#">2</a>
            <a href="#">3</a>
            <a href="#">›</a>
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

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
// import axios from 'axios'

const route = useRoute()

// 스타일 태그 목록
const styleTags = [
  { name: '스트릿',  emoji: '🧢', count: 328 },
  { name: '캐주얼',  emoji: '👕', count: 512 },
  { name: '미니멀',  emoji: '🤍', count: 274 },
  { name: '빈티지',  emoji: '🧥', count: 189 },
  { name: '스포티',  emoji: '👟', count: 156 },
  { name: '포멀',    emoji: '👔', count: 98  },
]

// URL 쿼리로 태그 초기값 설정 (?tag=스트릿)
const selectedTag = ref(route.query.tag || '스트릿')
const viewMode    = ref('grid')

function selectTag(tag) {
  selectedTag.value = tag
  // TODO: API 연동 시 페이지 리셋
}

// 더미 데이터 (실제는 API에서)
// onMounted(async () => {
//   const res = await axios.get('/api/posts', { params: { styleTag: selectedTag.value } })
//   posts.value = res.data
// })

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
  posts.value.filter(p => p.category === selectedTag.value)
)

function toggleLike(post) {
  post.liked = !post.liked
  post.likes += post.liked ? 1 : -1
  // TODO: await axios.post(`/api/posts/${post.id}/likes`)
}
</script>

<style scoped>
.style-page {
  min-height: 100vh;
  background: var(--fc-bg);
  padding-bottom: 60px;
}

/* ── 페이지 헤더 ── */
.style-head {
  background: var(--fc-surface);
  border-bottom: 1px solid var(--fc-line);
  padding: 36px 0 0;
  animation: fadeDown 0.5s cubic-bezier(0.22,1,0.36,1) both;
}

.style-head-inner {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 28px;
}

.style-title {
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: -0.06em;
  color: var(--fc-text);
  margin-bottom: 6px;
}

.style-desc {
  font-size: 0.88rem;
  color: var(--fc-text-muted);
}

.btn-upload {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 42px;
  padding: 0 20px;
  background: var(--fc-black);
  color: #fff;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  flex-shrink: 0;
}
.btn-upload:hover { opacity: 0.85; transform: translateY(-1px); }

/* 스타일 태그 버튼 목록 */
.style-tag-list {
  display: flex;
  gap: 0;
  overflow-x: auto;
  scrollbar-width: none;
}
.style-tag-list::-webkit-scrollbar { display: none; }

.style-tag-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 14px 20px;
  background: none;
  border: none;
  border-bottom: 2.5px solid transparent;
  color: var(--fc-text-muted);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  margin-bottom: -1px;
}

.style-tag-btn:hover { color: var(--fc-text); }

.style-tag-btn.active {
  color: var(--fc-text);
  border-bottom-color: var(--fc-text);
}

.tag-emoji { font-size: 1rem; }
.tag-name  { font-size: 0.95rem; }
.tag-count {
  font-size: 0.72rem;
  font-weight: 400;
  color: var(--fc-text-muted);
  background: var(--fc-bg);
  padding: 1px 6px;
  border-radius: 999px;
}

.style-tag-btn.active .tag-count {
  background: rgba(17,17,17,0.08);
  color: var(--fc-text);
}

/* ── 피드 ── */
.style-feed { padding: 28px 0 40px; }

.feed-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  animation: fadeUp 0.4s ease both;
}

.feed-title {
  display: flex;
  align-items: baseline;
  gap: 10px;
  font-size: 1.4rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: var(--fc-text);
}

.feed-count {
  font-size: 0.85rem;
  font-weight: 400;
  color: var(--fc-text-muted);
  letter-spacing: 0;
}

.view-icons { display: flex; gap: 8px; }

.view-icons button {
  width: 38px; height: 38px;
  border: 1.5px solid var(--fc-line) !important;
  border-radius: 10px !important;
  background: var(--fc-surface) !important;
  color: var(--fc-text-muted);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}
.view-icons button.active,
.view-icons button:hover {
  border-color: var(--fc-text) !important;
  color: var(--fc-text) !important;
}

/* 피드 그리드 */
.feed-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  animation: fadeUp 0.5s ease 0.1s both;
}

.feed-grid.list { grid-template-columns: repeat(2, minmax(0, 1fr)); }

.fit-card { cursor: pointer; }

.fit-thumb-wrap {
  border-radius: 18px;
  overflow: hidden;
  aspect-ratio: 0.78 / 1;
  background: var(--fc-line);
  position: relative;
}

.fit-thumb {
  width: 100%; height: 100%;
  object-fit: cover; display: block;
  transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
}

.fit-card:hover .fit-thumb { transform: scale(1.04); }

.fit-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 45%);
  display: flex; align-items: flex-end; padding: 12px;
}

.fit-overlay-inner {
  width: 100%; display: flex;
  align-items: center; justify-content: space-between; gap: 6px;
}

.overlay-user { display: flex; align-items: center; gap: 7px; min-width: 0; }

.overlay-avatar {
  width: 26px; height: 26px; border-radius: 50%;
  object-fit: cover; border: 1.5px solid rgba(255,255,255,0.55); flex-shrink: 0;
}

.overlay-name {
  font-size: 0.78rem; font-weight: 700; color: #fff;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.overlay-like {
  display: flex; align-items: center; gap: 4px;
  background: none !important; border: none !important;
  color: rgba(255,255,255,0.85); font-size: 0.78rem; font-weight: 700;
  cursor: pointer; flex-shrink: 0; transition: color 0.2s; padding: 0;
}
.overlay-like:hover, .overlay-like.liked { color: #ff4d6d; }
.overlay-like.liked svg { fill: #ff4d6d; stroke: #ff4d6d; }

/* 빈 상태 */
.empty-state {
  text-align: center;
  padding: 80px 0;
  animation: fadeUp 0.4s ease both;
}

.empty-icon  { font-size: 3rem; margin-bottom: 14px; }
.empty-title { font-size: 1.1rem; font-weight: 700; color: var(--fc-text); margin-bottom: 8px; }
.empty-desc  { font-size: 0.88rem; color: var(--fc-text-muted); margin-bottom: 24px; }

.btn-empty {
  display: inline-flex;
  align-items: center;
  height: 46px; padding: 0 28px;
  background: var(--fc-black); color: #fff;
  border-radius: 999px; font-size: 0.88rem; font-weight: 600;
  text-decoration: none; transition: all 0.2s;
}
.btn-empty:hover { opacity: 0.85; transform: translateY(-1px); }

/* 페이지네이션 */
.page-navigation {
  display: flex !important;
  justify-content: center !important;
  padding: 32px 0 !important;
}

.paginate {
  display: flex !important;
  align-items: center !important;
  flex-wrap: wrap !important;
  font-size: 14px !important;
}

.paginate a,
.paginate span {
  position: relative;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-width: 36px !important; height: 36px !important;
  padding: 0 10px !important; margin-left: -1px !important;
  color: var(--fc-text) !important;
  background: var(--fc-surface) !important;
  border: 1px solid var(--fc-line) !important;
  text-decoration: none !important;
  transition: all 0.15s !important;
}

.paginate a:hover { background: var(--fc-bg) !important; }

.paginate span,
.paginate a.active {
  color: #fff !important;
  background: var(--fc-black) !important;
  border-color: var(--fc-black) !important;
  pointer-events: none !important;
}

.paginate :first-child { margin-left: 0 !important; border-radius: 6px 0 0 6px !important; }
.paginate :last-child  { border-radius: 0 6px 6px 0 !important; }

/* 하단 플로팅 바 */
.bottom-bar {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 200;
  display: flex !important; flex-direction: row !important;
  align-items: stretch; height: 60px;
  background: #0d0d0d; border-top: 1px solid rgba(255,255,255,0.06);
}

.bottom-btn {
  flex: 1;
  display: flex !important; flex-direction: row !important;
  align-items: center; justify-content: center; gap: 8px;
  color: rgba(255,255,255,0.6); font-size: 0.74rem; font-weight: 700;
  letter-spacing: 0.1em; text-transform: none;
  text-decoration: none; border-right: 1px solid rgba(255,255,255,0.07);
  transition: all 0.2s; cursor: pointer;
}
.bottom-btn:last-child { border-right: none; }
.bottom-btn:hover { background: rgba(255,255,255,0.05); color: #fff; }

/* 애니메이션 */
@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* 반응형 */
@media (max-width: 1199px) { .feed-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 991px)  { .feed-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 767px)  {
  .style-title { font-size: 1.6rem; }
  .style-head-inner { flex-direction: column; gap: 16px; }
  .feed-grid, .feed-grid.list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
</style>