<template>
  <div class="my-page">

    <!-- 프로필 섹션 -->
    <div class="profile-section">
      <div class="container-xl">
        <div class="profile-wrap">

          <!-- 프로필 이미지 -->
          <div class="profile-avatar-wrap">
            <div class="profile-avatar">
              <img v-if="user.profileImage" :src="user.profileImage" alt="프로필">
              <span v-else class="avatar-initial">{{ user.nickname?.charAt(0) }}</span>
            </div>
          </div>

          <!-- 프로필 정보 -->
          <div class="profile-info">
            <div class="profile-top">
              <h1 class="profile-nickname">{{ user.nickname }}</h1>
              <RouterLink to="/my/edit" class="btn-edit">프로필 수정</RouterLink>
            </div>

            <!-- 통계 -->
            <div class="profile-stats">
              <div class="stat-item">
                <span class="stat-num">{{ user.postCount }}</span>
                <span class="stat-label">게시물</span>
              </div>
              <div class="stat-item">
                <span class="stat-num">{{ user.likedCount }}</span>
                <span class="stat-label">좋아요</span>
              </div>
              <div class="stat-item">
                <span class="stat-num">{{ user.archivedCount }}</span>
                <span class="stat-label">아카이브</span>
              </div>
            </div>

            <!-- 체형 정보 -->
            <p class="profile-body" v-if="user.height || user.weight">
              {{ user.height ? user.height + 'cm' : '' }}
              {{ user.height && user.weight ? ' · ' : '' }}
              {{ user.weight ? user.weight + 'kg' : '' }}
              {{ user.skinTone ? ' · ' + user.skinTone : '' }}
            </p>

            <!-- 스타일 태그 -->
            <div class="profile-tags" v-if="user.styleTag">
              <span
                v-for="tag in user.styleTag.split(',')"
                :key="tag"
                class="profile-tag"
              >#{{ tag.trim() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 탭 -->
    <div class="tab-bar">
      <div class="container-xl">
        <div class="tabs">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="tab"
            :class="{ active: currentTab === tab.key }"
            @click="currentTab = tab.key"
          >
            <component :is="tab.icon" />
            {{ tab.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- 게시글 그리드 -->
    <div class="container-xl">

      <!-- 내 게시글 탭 -->
      <div v-if="currentTab === 'posts'">
        <div class="post-grid" v-if="myPosts.length > 0">
          <div
            v-for="post in myPosts"
            :key="post.postId"
            class="post-thumb"
            @click="$router.push(`/post/${post.postId}`)"
          >
            <img :src="post.imageUrl" :alt="post.content">
            <div class="post-thumb-overlay">
              <span class="thumb-likes">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                {{ post.likeCount }}
              </span>
            </div>
          </div>
        </div>
        <div class="empty-state" v-else>
          <p class="empty-icon">📸</p>
          <p class="empty-title">아직 게시물이 없어요</p>
          <p class="empty-desc">첫 번째 코디를 올려보세요!</p>
          <RouterLink to="/post/write" class="btn-empty">코디 올리기</RouterLink>
        </div>
      </div>

      <!-- 좋아요 탭 -->
      <div v-if="currentTab === 'liked'">
        <div class="post-grid" v-if="likedPosts.length > 0">
          <div
            v-for="post in likedPosts"
            :key="post.postId"
            class="post-thumb"
            @click="$router.push(`/post/${post.postId}`)"
          >
            <img :src="post.imageUrl" :alt="post.content">
            <div class="post-thumb-overlay">
              <span class="thumb-likes">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                {{ post.likeCount }}
              </span>
            </div>
          </div>
        </div>
        <div class="empty-state" v-else>
          <p class="empty-icon">🤍</p>
          <p class="empty-title">좋아요한 게시물이 없어요</p>
          <p class="empty-desc">마음에 드는 코디에 좋아요를 눌러보세요!</p>
          <RouterLink to="/" class="btn-empty">피드 둘러보기</RouterLink>
        </div>
      </div>

      <!-- 아카이브 탭 -->
      <div v-if="currentTab === 'archived'">
        <div class="post-grid" v-if="archivedPosts.length > 0">
          <div
            v-for="post in archivedPosts"
            :key="post.postId"
            class="post-thumb"
            @click="$router.push(`/post/${post.postId}`)"
          >
            <img :src="post.imageUrl" :alt="post.content">
            <div class="post-thumb-overlay">
              <span class="thumb-likes">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                {{ post.likeCount }}
              </span>
            </div>
          </div>
        </div>
        <div class="empty-state" v-else>
          <p class="empty-icon">📁</p>
          <p class="empty-title">아카이브한 게시물이 없어요</p>
          <p class="empty-desc">저장하고 싶은 코디를 아카이브해보세요!</p>
          <RouterLink to="/" class="btn-empty">피드 둘러보기</RouterLink>
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
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
// import axios from 'axios'

const authStore = useAuthStore()
const router    = useRouter()
const currentTab = ref('posts')

const tabs = [
  { key: 'posts',    label: '게시물',   icon: 'span' },
  { key: 'liked',    label: '좋아요',   icon: 'span' },
  { key: 'archived', label: '아카이브', icon: 'span' },
]

// 더미 유저 데이터
const user = ref({
  nickname:     '@태혁',
  profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  postCount:    12,
  likedCount:   48,
  archivedCount: 23,
  height:       178,
  weight:       68,
  skinTone:     '웜톤',
  styleTag:     '스트릿,캐주얼',
})

// 더미 게시글
const myPosts = ref([
  { postId:1, imageUrl:'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&q=80', likeCount:321 },
  { postId:2, imageUrl:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80', likeCount:195 },
  { postId:3, imageUrl:'https://images.unsplash.com/photo-1523359346063-d879354c0ea5?w=400&q=80', likeCount:374 },
  { postId:4, imageUrl:'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80', likeCount:153 },
  { postId:5, imageUrl:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80', likeCount:153 },
  { postId:6, imageUrl:'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80', likeCount:192 },
])

const likedPosts    = ref([
  { postId:7,  imageUrl:'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80', likeCount:192 },
  { postId:8,  imageUrl:'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80', likeCount:158 },
  { postId:9,  imageUrl:'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&q=80', likeCount:267 },
])

const archivedPosts = ref([
  { postId:10, imageUrl:'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&q=80', likeCount:553 },
  { postId:11, imageUrl:'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80', likeCount:994 },
])

// TODO: 실제 API 연동
// onMounted(async () => {
//   if (!authStore.auth?.token) { router.push('/login'); return }
//   const res = await axios.get('/api/member/me')
//   user.value = res.data
//   const posts = await axios.get('/api/posts/my')
//   myPosts.value = posts.data
// })
</script>

<style scoped>
.my-page {
  min-height: 100vh;
  background: var(--fc-bg);
  padding-bottom: 80px;
}

/* 프로필 섹션 */
.profile-section {
  background: var(--fc-surface);
  padding: 28px 0 24px;
  border-bottom: 1px solid var(--fc-line);
}

.profile-wrap {
  display: flex;
  gap: 28px;
  align-items: flex-start;
}

/* 아바타 */
.profile-avatar-wrap { flex-shrink: 0; }

.profile-avatar {
  width: 88px; height: 88px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--fc-bg);
  border: 2px solid var(--fc-line);
  display: flex; align-items: center; justify-content: center;
}

.profile-avatar img { width: 100%; height: 100%; object-fit: cover; }

.avatar-initial {
  font-size: 2rem;
  font-weight: 700;
  color: var(--fc-text);
}

/* 프로필 정보 */
.profile-info { flex: 1; min-width: 0; }

.profile-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.profile-nickname {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--fc-text);
  letter-spacing: -0.03em;
}

.btn-edit {
  height: 34px;
  padding: 0 16px;
  background: none;
  border: 1.5px solid var(--fc-line-dark);
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--fc-text);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  transition: all 0.2s;
}
.btn-edit:hover { background: var(--fc-bg); }

/* 통계 */
.profile-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-num {
  font-size: 1.1rem;
  font-weight: 900;
  color: var(--fc-text);
  letter-spacing: -0.04em;
}

.stat-label {
  font-size: 0.72rem;
  color: var(--fc-text-muted);
}

.profile-body {
  font-size: 0.82rem;
  color: var(--fc-text-muted);
  margin-bottom: 8px;
}

.profile-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.profile-tag {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--fc-text);
  background: var(--fc-bg);
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid var(--fc-line);
}

/* 탭 */
.tab-bar {
  background: var(--fc-surface);
  border-bottom: 1px solid var(--fc-line);
  position: sticky;
  top: 72px;
  z-index: 10;
}

.tabs {
  display: flex;
}

.tab {
  flex: 1;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--fc-text-muted);
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: -1px;
}

.tab:hover { color: var(--fc-text); }

.tab.active {
  color: var(--fc-text);
  border-bottom-color: var(--fc-text);
}

/* 게시글 그리드 */
.post-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  padding: 2px 0;
}

.post-thumb {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  cursor: pointer;
  background: var(--fc-line);
}

.post-thumb img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.post-thumb:hover img { transform: scale(1.05); }

.post-thumb-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.post-thumb:hover .post-thumb-overlay { background: rgba(0,0,0,0.3); }

.thumb-likes {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #fff;
  font-size: 0.88rem;
  font-weight: 700;
  opacity: 0;
  transition: opacity 0.2s;
}

.post-thumb:hover .thumb-likes { opacity: 1; }

/* 빈 상태 */
.empty-state {
  text-align: center;
  padding: 64px 20px;
}

.empty-icon  { font-size: 2.5rem; margin-bottom: 12px; }
.empty-title { font-size: 1rem; font-weight: 700; color: var(--fc-text); margin-bottom: 6px; }
.empty-desc  { font-size: 0.85rem; color: var(--fc-text-muted); margin-bottom: 20px; }

.btn-empty {
  display: inline-flex;
  align-items: center;
  height: 42px; padding: 0 24px;
  background: var(--fc-black); color: #fff;
  border-radius: 999px; font-size: 0.88rem; font-weight: 600;
  text-decoration: none; transition: opacity 0.2s;
}
.btn-empty:hover { opacity: 0.82; }

/* 하단 바 */
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
  text-decoration: none; border-right: 1px solid rgba(255,255,255,0.07);
  transition: all 0.2s; cursor: pointer;
}
.bottom-btn:last-child { border-right: none; }
.bottom-btn:hover { background: rgba(255,255,255,0.05); color: #fff; }

/* 반응형 */
@media (max-width: 640px) {
  .profile-wrap   { gap: 16px; }
  .profile-avatar { width: 72px; height: 72px; }
  .profile-stats  { gap: 16px; }
}
</style>