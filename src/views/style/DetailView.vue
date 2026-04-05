<template>
  <div class="detail-page">
    <div class="container-xl">
      <div class="detail-wrap">

        <!-- ── 좌측: 사진 + 핀 ── -->
        <div class="detail-image-col">
          <div class="image-wrap" ref="imageWrap">

            <!-- 메인 이미지 -->
            <img
              v-if="post.imageUrl"
              :src="post.imageUrl"
              :alt="post.title"
              class="main-image"
            >
            <div v-else class="image-placeholder">
              <span>이미지 없음</span>
            </div>

            <!-- 핀 dot들 -->
            <div
              v-for="pin in post.pins"
              :key="pin.id"
              class="pin-dot"
              :style="{ left: pin.posX + '%', top: pin.posY + '%' }"
              @click.stop="togglePin(pin)"
            >
              <div class="pin-pulse"></div>
            </div>

            <!-- 핀 팝업 -->
            <Transition name="pin-pop">
              <div
                v-if="activePin"
                class="pin-popup"
                :style="getPinPopupStyle(activePin)"
                @click.stop
              >
                <button class="pin-popup-close" @click="activePin = null">✕</button>
                <div class="pin-popup-content">
                  <p class="pin-brand">{{ activePin.brand }}</p>
                  <p class="pin-product">{{ activePin.productName }}</p>
                  <p class="pin-price" v-if="activePin.price">
                    {{ activePin.price.toLocaleString() }}원
                  </p>
                  <a
                    v-if="activePin.purchaseUrl"
                    :href="activePin.purchaseUrl"
                    target="_blank"
                    class="pin-link"
                  >구매하기 →</a>
                </div>
              </div>
            </Transition>

          </div>

          <!-- 핀 안내 -->
          <p class="pin-guide" v-if="post.pins && post.pins.length > 0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            사진의 핀을 클릭하면 아이템 정보를 볼 수 있어요
          </p>
        </div>

        <!-- ── 우측: 게시글 정보 ── -->
        <div class="detail-info-col">

          <!-- 작성자 -->
          <div class="author-row">
            <div class="author-info">
              <div class="author-avatar">
                <img v-if="post.profileImage" :src="post.profileImage" alt="프로필">
                <span v-else>{{ post.nickname?.charAt(0) }}</span>
              </div>
              <div>
                <p class="author-name">{{ post.nickname }}</p>
                <p class="author-date">{{ formatDate(post.createdAt) }}</p>
              </div>
            </div>
            <button
              v-if="isMyPost"
              class="btn-more"
              @click="showMenu = !showMenu"
            >⋯</button>
            <!-- 수정/삭제 메뉴 -->
            <div class="more-menu" v-if="showMenu">
              <button @click="editPost">수정</button>
              <button @click="deletePost" class="danger">삭제</button>
            </div>
          </div>

          <div class="divider"></div>

          <!-- 제목 + 내용 -->
          <div class="post-body">
            <div class="tag-badge">{{ post.categoryName }}</div>
            <h1 class="post-title">{{ post.title }}</h1>
            <p class="post-content">{{ post.content }}</p>
          </div>

          <!-- 핀 아이템 목록 -->
          <div class="pin-list" v-if="post.pins && post.pins.length > 0">
            <p class="pin-list-title">아이템 정보</p>
            <div
              v-for="pin in post.pins"
              :key="pin.id"
              class="pin-item"
              @click="togglePin(pin)"
            >
              <div class="pin-item-icon">●</div>
              <div class="pin-item-info">
                <p class="pin-item-brand">{{ pin.brand }}</p>
                <p class="pin-item-name">{{ pin.productName }}</p>
              </div>
              <p class="pin-item-price" v-if="pin.price">
                {{ pin.price.toLocaleString() }}원
              </p>
            </div>
          </div>

          <div class="divider"></div>

          <!-- 좋아요 / 아카이브 -->
          <div class="action-row">
            <button
              class="action-btn like"
              :class="{ active: post.liked }"
              @click="toggleLike"
            >
              <svg width="18" height="18" viewBox="0 0 24 24"
                :fill="post.liked ? 'currentColor' : 'none'"
                stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              좋아요 {{ post.likeCount }}
            </button>
            <button
              class="action-btn archive"
              :class="{ active: post.archived }"
              @click="toggleArchive"
            >
              <svg width="18" height="18" viewBox="0 0 24 24"
                :fill="post.archived ? 'currentColor' : 'none'"
                stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              아카이브
            </button>
          </div>

          <div class="divider"></div>

          <!-- 댓글 -->
          <div class="comment-section">
            <p class="comment-title">댓글 {{ comments.length }}</p>

            <!-- 댓글 입력 -->
            <div class="comment-input-wrap">
              <div class="comment-avatar">
                <span>나</span>
              </div>
              <div class="comment-input-box">
                <textarea
                  class="comment-input"
                  v-model="commentText"
                  placeholder="댓글을 입력하세요..."
                  rows="2"
                  @keydown.ctrl.enter="submitComment"
                ></textarea>
                <div class="comment-input-footer">
                  <span class="comment-hint">Ctrl + Enter로 등록</span>
                  <button
                    class="btn-comment-submit"
                    @click="submitComment"
                    :disabled="!commentText.trim()"
                  >등록</button>
                </div>
              </div>
            </div>

            <!-- 댓글 목록 -->
            <div class="comment-list">
              <div
                v-for="comment in comments"
                :key="comment.id"
                class="comment-item"
              >
                <div class="comment-avatar">
                  <span>{{ comment.nickname?.charAt(0) }}</span>
                </div>
                <div class="comment-body">
                  <div class="comment-header">
                    <span class="comment-name">{{ comment.nickname }}</span>
                    <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
                  </div>
                  <p class="comment-text">{{ comment.content }}</p>
                </div>
                <button
                  v-if="comment.isMine"
                  class="comment-delete"
                  @click="deleteComment(comment.id)"
                >✕</button>
              </div>

              <!-- 댓글 없음 -->
              <div class="comment-empty" v-if="comments.length === 0">
                첫 번째 댓글을 남겨보세요 👋
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
// import axios from 'axios'

const route     = useRoute()
const router    = useRouter()
const authStore = useAuthStore()

const postId    = route.params.id
const activePin = ref(null)
const showMenu  = ref(false)
const commentText = ref('')

// 더미 데이터 (실제는 API에서)
const post = ref({
  id: postId,
  title: '오늘의 스트릿 코디',
  content: '날씨가 선선해서 꺼낸 올드스쿨 무드.\n오버핏 코치자켓에 와이드 팬츠 조합이에요.',
  imageUrl: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80',
  categoryName: '스트릿',
  nickname: '@태혁',
  profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
  createdAt: new Date().toISOString(),
  likeCount: 321,
  liked: false,
  archived: false,
  pins: [
    { id:1, brand:'나이키', productName:'코치 자켓 올드스쿨', price:129000, purchaseUrl:'#', posX:42, posY:30 },
    { id:2, brand:'리바이스', productName:'와이드 팬츠 501', price:89000, purchaseUrl:'#', posX:55, posY:70 },
    { id:3, brand:'뉴발란스', productName:'992 그레이', price:179000, purchaseUrl:'#', posX:38, posY:88 },
  ]
})

const comments = ref([
  { id:1, nickname:'@예림', content:'코치자켓 어디꺼예요? 너무 탐나요 ㅠ', createdAt: new Date().toISOString(), isMine: false },
  { id:2, nickname:'@동원', content:'신발이랑 코디 완벽하다', createdAt: new Date().toISOString(), isMine: false },
])

// TODO: 실제 API 연동
// onMounted(async () => {
//   const res = await axios.get(`/api/posts/${postId}`)
//   post.value = res.data
//   const cRes = await axios.get(`/api/posts/${postId}/comments`)
//   comments.value = cRes.data
// })

const isMyPost = computed(() =>
  authStore.auth?.username === post.value.nickname
)

// 핀 토글
function togglePin(pin) {
  activePin.value = activePin.value?.id === pin.id ? null : pin
}

// 핀 팝업 위치 계산 (이미지 우측 또는 좌측)
function getPinPopupStyle(pin) {
  const left = pin.posX > 50 ? 'auto' : (pin.posX + 4) + '%'
  const right = pin.posX > 50 ? (100 - pin.posX + 4) + '%' : 'auto'
  return {
    top: Math.min(pin.posY, 75) + '%',
    left, right,
  }
}

// 좋아요
function toggleLike() {
  if (!authStore.auth?.token) { router.push('/login'); return }
  post.value.liked = !post.value.liked
  post.value.likeCount += post.value.liked ? 1 : -1
  // TODO: await axios.post(`/api/posts/${postId}/likes`)
}

// 아카이브
function toggleArchive() {
  if (!authStore.auth?.token) { router.push('/login'); return }
  post.value.archived = !post.value.archived
  // TODO: await axios.post(`/api/posts/${postId}/archive`)
}

// 댓글 등록
async function submitComment() {
  if (!commentText.value.trim()) return
  if (!authStore.auth?.token) { router.push('/login'); return }

  // TODO: await axios.post(`/api/posts/${postId}/comments`, { content: commentText.value })
  comments.value.push({
    id: Date.now(),
    nickname: authStore.auth.username || '나',
    content: commentText.value,
    createdAt: new Date().toISOString(),
    isMine: true
  })
  commentText.value = ''
}

// 댓글 삭제
function deleteComment(id) {
  comments.value = comments.value.filter(c => c.id !== id)
  // TODO: await axios.delete(`/api/posts/${postId}/comments/${id}`)
}

// 수정
function editPost() {
  showMenu.value = false
  router.push(`/post/${postId}/edit`)
}

// 삭제
async function deletePost() {
  if (!confirm('게시글을 삭제하시겠어요?')) return
  // TODO: await axios.delete(`/api/posts/${postId}`)
  router.push('/')
}

// 날짜 포맷
function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`
}
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: var(--fc-bg);
  padding: 32px 0 80px;
}

.detail-wrap {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 40px;
  align-items: flex-start;
}

/* ── 좌측 이미지 ── */
.detail-image-col { position: sticky; top: 88px; }

.image-wrap {
  position: relative;
  border-radius: var(--fc-radius-md);
  overflow: hidden;
  background: var(--fc-line);
  cursor: crosshair;
}

.main-image {
  width: 100%;
  display: block;
  max-height: 80vh;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  aspect-ratio: 3/4;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--fc-text-muted);
  font-size: 0.9rem;
}

/* 핀 */
.pin-dot {
  position: absolute;
  width: 22px; height: 22px;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 3;
}

.pin-dot::before {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 10px; height: 10px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #111;
  transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
  z-index: 2;
}

.pin-dot:hover::before { transform: translate(-50%, -50%) scale(1.4); }

.pin-pulse {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 22px; height: 22px;
  border-radius: 50%;
  background: rgba(255,255,255,0.35);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,100% { transform: translate(-50%,-50%) scale(1); opacity: 0.6; }
  50%      { transform: translate(-50%,-50%) scale(1.6); opacity: 0; }
}

/* 핀 팝업 */
.pin-popup {
  position: absolute;
  z-index: 10;
  background: #fff;
  border-radius: 12px;
  padding: 14px 16px;
  min-width: 180px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.18);
}

.pin-popup-close {
  position: absolute;
  top: 8px; right: 10px;
  background: none; border: none;
  font-size: 12px; color: #aaa;
  cursor: pointer;
}

.pin-brand   { font-size: 0.72rem; color: var(--fc-text-muted); letter-spacing: 0.04em; margin-bottom: 3px; }
.pin-product { font-size: 0.92rem; font-weight: 700; color: var(--fc-text); margin-bottom: 4px; }
.pin-price   { font-size: 0.88rem; font-weight: 600; color: var(--fc-text); margin-bottom: 10px; }
.pin-link    { font-size: 0.8rem; color: var(--fc-text); font-weight: 600; text-decoration: none; border-bottom: 1px solid var(--fc-text); padding-bottom: 1px; }

.pin-pop-enter-active, .pin-pop-leave-active { transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1); }
.pin-pop-enter-from, .pin-pop-leave-to { opacity: 0; transform: scale(0.85); }

.pin-guide {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  color: var(--fc-text-muted);
  margin-top: 10px;
  padding: 0 4px;
}

/* ── 우측 정보 ── */
.detail-info-col {
  background: var(--fc-surface);
  border-radius: var(--fc-radius-md);
  padding: 24px;
  box-shadow: var(--fc-shadow-sm);
}

/* 작성자 */
.author-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  position: relative;
}

.author-info { display: flex; align-items: center; gap: 12px; }

.author-avatar {
  width: 44px; height: 44px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--fc-bg);
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; font-weight: 700; color: var(--fc-text);
  border: 1.5px solid var(--fc-line);
  flex-shrink: 0;
}
.author-avatar img { width: 100%; height: 100%; object-fit: cover; }

.author-name { font-size: 0.95rem; font-weight: 700; color: var(--fc-text); }
.author-date { font-size: 0.78rem; color: var(--fc-text-muted); margin-top: 2px; }

.btn-more {
  background: none; border: none;
  font-size: 1.2rem; color: var(--fc-text-muted);
  cursor: pointer; padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.15s;
}
.btn-more:hover { background: var(--fc-bg); }

.more-menu {
  position: absolute;
  top: 100%; right: 0;
  background: var(--fc-surface);
  border: 1px solid var(--fc-line);
  border-radius: 10px;
  overflow: hidden;
  z-index: 10;
  box-shadow: var(--fc-shadow-md);
}
.more-menu button {
  display: block; width: 100%;
  padding: 10px 20px;
  background: none; border: none;
  font-size: 0.88rem; color: var(--fc-text);
  cursor: pointer; text-align: left;
  transition: background 0.15s;
}
.more-menu button:hover { background: var(--fc-bg); }
.more-menu button.danger { color: #e53e3e; }

.divider { height: 1px; background: var(--fc-line); margin: 18px 0; }

/* 게시글 본문 */
.tag-badge {
  display: inline-block;
  padding: 3px 10px;
  background: var(--fc-bg);
  border: 1px solid var(--fc-line);
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--fc-text-muted);
  margin-bottom: 10px;
}

.post-title {
  font-size: 1.3rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: var(--fc-text);
  margin-bottom: 10px;
}

.post-content {
  font-size: 0.9rem;
  color: var(--fc-text-soft);
  line-height: 1.8;
  white-space: pre-line;
}

/* 핀 아이템 목록 */
.pin-list { margin-top: 4px; }

.pin-list-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--fc-text-muted);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.pin-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s;
  margin-bottom: 4px;
}
.pin-item:hover { background: var(--fc-bg); }

.pin-item-icon { font-size: 8px; color: var(--fc-text); flex-shrink: 0; }
.pin-item-info { flex: 1; min-width: 0; }
.pin-item-brand { font-size: 0.72rem; color: var(--fc-text-muted); }
.pin-item-name  { font-size: 0.88rem; font-weight: 600; color: var(--fc-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pin-item-price { font-size: 0.88rem; font-weight: 700; color: var(--fc-text); flex-shrink: 0; }

/* 좋아요 / 아카이브 */
.action-row { display: flex; gap: 10px; }

.action-btn {
  flex: 1;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s;
  border: 1.5px solid var(--fc-line);
  background: none;
  color: var(--fc-text-soft);
}

.action-btn:hover { border-color: var(--fc-text); color: var(--fc-text); }

.action-btn.like.active   { background: #fff0f3; border-color: #ff4d6d; color: #ff4d6d; }
.action-btn.archive.active { background: var(--fc-bg); border-color: var(--fc-text); color: var(--fc-text); }

/* 댓글 */
.comment-section { }

.comment-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--fc-text);
  margin-bottom: 14px;
}

.comment-input-wrap {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.comment-avatar {
  width: 34px; height: 34px;
  border-radius: 50%;
  background: var(--fc-bg);
  border: 1.5px solid var(--fc-line);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.8rem; font-weight: 700; color: var(--fc-text);
  flex-shrink: 0;
}

.comment-input-box { flex: 1; }

.comment-input {
  width: 100% !important;
  background: var(--fc-bg) !important;
  border: 1.5px solid var(--fc-line) !important;
  border-radius: 10px !important;
  color: var(--fc-text) !important;
  padding: 10px 14px !important;
  font-size: 0.88rem !important;
  resize: none !important;
  outline: none !important;
  transition: border-color 0.2s !important;
  height: auto !important;
  display: block !important;
}
.comment-input:focus { border-color: var(--fc-text) !important; background: var(--fc-surface) !important; }
.comment-input::placeholder { color: var(--fc-text-muted) !important; }

.comment-input-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
}

.comment-hint { font-size: 0.72rem; color: var(--fc-text-muted); }

.btn-comment-submit {
  height: 32px;
  padding: 0 16px;
  background: var(--fc-black);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-comment-submit:hover    { opacity: 0.8; }
.btn-comment-submit:disabled { opacity: 0.35; cursor: default; }

.comment-list { display: flex; flex-direction: column; gap: 14px; }

.comment-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.comment-body { flex: 1; min-width: 0; }

.comment-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.comment-name { font-size: 0.85rem; font-weight: 700; color: var(--fc-text); }
.comment-date { font-size: 0.72rem; color: var(--fc-text-muted); }
.comment-text { font-size: 0.88rem; color: var(--fc-text-soft); line-height: 1.6; }

.comment-delete {
  background: none; border: none;
  font-size: 11px; color: var(--fc-text-muted);
  cursor: pointer; flex-shrink: 0;
  padding: 2px 4px;
  transition: color 0.15s;
}
.comment-delete:hover { color: #e53e3e; }

.comment-empty {
  text-align: center;
  padding: 24px 0;
  font-size: 0.88rem;
  color: var(--fc-text-muted);
}

/* 반응형 */
@media (max-width: 1024px) {
  .detail-wrap { grid-template-columns: 1fr; }
  .detail-image-col { position: static; }
}

@media (max-width: 640px) {
  .detail-page { padding: 0 0 80px; }
  .detail-info-col { border-radius: 0; box-shadow: none; }
}
</style>