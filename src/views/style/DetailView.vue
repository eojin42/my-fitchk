<template>
  <div class="detail-page">
    <div class="container-xl">

      <div v-if="loading" class="loading-state">불러오는 중...</div>
      <div v-else-if="!post.postId" class="empty-state">게시글을 찾을 수 없어요.</div>

      <div v-else class="detail-wrap">

        <!-- ── 좌측: 사진 슬라이더 ── -->
        <div class="detail-image-col">
          <div class="image-wrap" ref="imageWrap" @click="activePin = null">

            <!-- 슬라이더 -->
            <div class="slider-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
              <div
                v-for="(url, idx) in imageUrls"
                :key="idx"
                class="slide"
              >
                <img
                  :src="`http://localhost:9090/uploads/post/${url}`"
                  class="main-image"
                >
              </div>
            </div>

            <!-- 이미지 없을 때 -->
            <div v-if="imageUrls.length === 0" class="image-placeholder">
              <span>이미지 없음</span>
            </div>

            <!-- 체형 정보 오버레이 -->
            <div class="body-overlay" v-if="post.height || post.weight">
              <span v-if="post.height">{{ post.height }}cm</span>
              <span v-if="post.height && post.weight"> · </span>
              <span v-if="post.weight">{{ post.weight }}kg</span>
              <span v-if="post.seasons"> · {{ post.seasons }}</span>
            </div>

            <!-- 슬라이더 화살표 -->
            <button
              v-if="currentSlide > 0"
              class="slide-btn prev"
              @click.stop="currentSlide--"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button
              v-if="currentSlide < imageUrls.length - 1"
              class="slide-btn next"
              @click.stop="currentSlide++"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </button>

            <!-- 슬라이더 인디케이터 -->
            <div class="slide-indicator" v-if="imageUrls.length > 1">
              {{ currentSlide + 1 }} / {{ imageUrls.length }}
            </div>

            <!-- 핀 dot들 (첫 번째 사진에만) -->
            <template v-if="currentSlide === 0">
              <div
                v-for="pin in post.pins"
                :key="pin.itemId"
                class="pin-dot"
                :style="{ left: pin.posX + '%', top: pin.posY + '%' }"
                @click.stop="togglePin(pin)"
              >
                <div class="pin-pulse"></div>
              </div>
            </template>

            <!-- 핀 팝업 -->
            <Transition name="pin-pop">
              <div
                v-if="activePin"
                class="pin-popup"
                :style="getPinPopupStyle(activePin)"
                @click.stop
              >
                <button class="pin-popup-close" @click="activePin = null">✕</button>
                <p class="pin-brand">{{ activePin.brand }}</p>
                <p class="pin-product">{{ activePin.productName }}</p>
                <p class="pin-price" v-if="activePin.price">{{ Number(activePin.price).toLocaleString() }}원</p>
                <a v-if="activePin.purchaseUrl" :href="activePin.purchaseUrl" target="_blank" class="pin-link">구매하기 →</a>
              </div>
            </Transition>

          </div>

          <!-- 핀 안내 -->
          <p class="pin-guide" v-if="post.pins && post.pins.length > 0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            첫 번째 사진의 핀을 클릭하면 아이템 정보를 볼 수 있어요
          </p>
        </div>

        <!-- ── 우측: 게시글 정보 ── -->
        <div class="detail-info-col">

          <!-- 작성자 -->
          <div class="author-row">
            <div class="author-info">
              <div class="author-avatar">
                <img v-if="post.profileImage"
                  :src="`http://localhost:9090/uploads/member/${post.profileImage}`"
                  alt="프로필">
                <span v-else>{{ post.nickname?.charAt(0) }}</span>
              </div>
              <div>
                <p class="author-name">{{ post.nickname }}</p>
                <p class="author-date">{{ formatDate(post.createdAt) }}</p>
              </div>
            </div>
            <button v-if="isMyPost" class="btn-more" @click="showMenu = !showMenu">⋯</button>
            <div class="more-menu" v-if="showMenu">
              <button @click="openEdit">수정</button>
              <button @click="deletePost" class="danger">삭제</button>
            </div>
          </div>

          <div class="divider"></div>

          <!-- 태그 + 본문 -->
          <div class="post-body">
            <div class="tag-group" v-if="post.styleTags || post.tpoTags || post.seasons || post.gender">
              <span class="tag-badge gender" v-if="post.gender">{{ post.gender }}</span>
              <span v-for="tag in splitTags(post.styleTags)" :key="'s'+tag" class="tag-badge">#{{ tag }}</span>
              <span v-for="tag in splitTags(post.tpoTags)"   :key="'t'+tag" class="tag-badge tpo">{{ tag }}</span>
              <span v-for="tag in splitTags(post.seasons)"   :key="'se'+tag" class="tag-badge season">{{ tag }}</span>
            </div>
            <p class="post-content">{{ post.content }}</p>
          </div>

          <!-- 핀 아이템 목록 -->
          <div class="pin-list" v-if="post.pins && post.pins.length > 0">
            <p class="pin-list-title">아이템 정보</p>
            <div class="pin-items-grid">
              <div
                v-for="(pin, idx) in post.pins"
                :key="pin.itemId"
                class="pin-item-box"
                :data-idx="idx + 1"
                @click="togglePin(pin)"
              >
                <div class="pin-item-top">
                  <p class="pin-item-brand">{{ pin.brand }}</p>
                  <p class="pin-item-name">{{ pin.productName }}</p>
                </div>
                <div class="pin-item-bottom">
                  <p class="pin-item-price" v-if="pin.price">{{ Number(pin.price).toLocaleString() }}원</p>
                  <a v-if="pin.purchaseUrl" :href="pin.purchaseUrl" target="_blank" class="pin-item-link" @click.stop>구매 →</a>
                </div>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <!-- 좋아요 / 아카이브 -->
          <div class="action-row">
            <button class="action-btn like" :class="{ active: post.liked }" @click="toggleLike">
              <svg width="18" height="18" viewBox="0 0 24 24"
                :fill="post.liked ? 'currentColor' : 'none'"
                stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              좋아요 {{ post.likeCount }}
            </button>
            <button class="action-btn archive" :class="{ active: post.archived }" @click="toggleArchive">
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

            <div class="comment-input-wrap">
              <div class="comment-avatar"><span>나</span></div>
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
                  <button class="btn-comment-submit" @click="submitComment" :disabled="!commentText.trim()">등록</button>
                </div>
              </div>
            </div>

            <div class="comment-list">
              <div v-for="comment in comments" :key="comment.commentId" class="comment-item">
                <div class="comment-avatar">
                  <img v-if="comment.profileImage"
                    :src="`http://localhost:9090/uploads/member/${comment.profileImage}`"
                    style="width:100%;height:100%;object-fit:cover;border-radius:50%"
                  >
                  <span v-else>{{ comment.nickname?.charAt(0) }}</span>
                </div>
                <div class="comment-body">
                  <div class="comment-header">
                    <span class="comment-name">{{ comment.nickname }}</span>
                    <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
                  </div>
                  <p class="comment-text">{{ comment.content }}</p>
                </div>
                <button v-if="comment.loginId === currentUser" class="comment-delete" @click="deleteComment(comment.commentId)">✕</button>
              </div>
              <div class="comment-empty" v-if="comments.length === 0">첫 번째 댓글을 남겨보세요 👋</div>
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
import http from '@/util/http'

const route     = useRoute()
const router    = useRouter()
const authStore = useAuthStore()

const postId      = route.params.id
const activePin   = ref(null)
const showMenu    = ref(false)
const commentText = ref('')
const loading     = ref(false)
const currentSlide = ref(0)

const post     = ref({})
const comments = ref([])

const currentUser = computed(() => authStore.auth?.username ?? null)
const myLoginId   = ref(null)  
const isMyPost = computed(() => post.value.loginId === authStore.auth.loginId)

// imageUrls: 여러 장 or 단일 imageUrl 대응
const imageUrls = computed(() => {
  if (post.value.imageUrls && post.value.imageUrls.length > 0) return post.value.imageUrls
  if (post.value.imageUrl) return [post.value.imageUrl]
  return []
})



onMounted(async () => {
  loading.value = true
  try {
    const [postRes, commentRes] = await Promise.all([
      http.get(`/posts/${postId}`),
      http.get(`/posts/${postId}/comments`)
    ])
    post.value     = postRes
    comments.value = commentRes

    console.log(post.value)
  } catch (e) {
    console.error('상세 조회 실패', e)
  } finally {
    loading.value = false
  }
})

function togglePin(pin) {
  activePin.value = activePin.value?.itemId === pin.itemId ? null : pin
}

function getPinPopupStyle(pin) {
  const left  = pin.posX > 50 ? 'auto' : (pin.posX + 4) + '%'
  const right = pin.posX > 50 ? (100 - pin.posX + 4) + '%' : 'auto'
  return { top: Math.min(pin.posY, 75) + '%', left, right }
}

async function toggleLike() {
  if (!currentUser.value) { router.push('/member/login'); return }
  post.value.liked = !post.value.liked
  post.value.likeCount += post.value.liked ? 1 : -1
  try {
    await http.post(`/posts/${postId}/likes`)
  } catch (e) {
    post.value.liked = !post.value.liked
    post.value.likeCount += post.value.liked ? 1 : -1
  }
}

async function toggleArchive() {
  if (!currentUser.value) { router.push('/member/login'); return }
  post.value.archived = !post.value.archived
  try {
    await http.post(`/posts/${postId}/archive`)
  } catch (e) {
    post.value.archived = !post.value.archived
  }
}

async function submitComment() {
  if (!commentText.value.trim()) return
  if (!currentUser.value) { router.push('/member/login'); return }
  try {
    await http.post(`/posts/${postId}/comments`, null, { params: { content: commentText.value } })
    commentText.value = ''
    comments.value = await http.get(`/posts/${postId}/comments`)
  } catch (e) {
    console.error('댓글 등록 실패', e)
  }
}

async function deleteComment(commentId) {
  try {
    await http.delete(`/posts/${postId}/comments/${commentId}`)
    comments.value = comments.value.filter(c => c.commentId !== commentId)
  } catch (e) {
    console.error('댓글 삭제 실패', e)
  }
}

async function deletePost() {
  if (!confirm('게시글을 삭제하시겠어요?')) return
  showMenu.value = false
  try {
    await http.delete(`/posts/${postId}`)
    router.push('/')
  } catch (e) {
    console.error('게시글 삭제 실패', e)
  }
}

function openEdit() {
  showMenu.value = false
  router.push(`/post/${postId}/edit`)
}

function splitTags(str) {
  if (!str) return []
  return str.split(',').map(s => s.trim()).filter(Boolean)
}

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

.loading-state, .empty-state {
  text-align: center; padding: 80px 0;
  font-size: 0.95rem; color: var(--fc-text-muted);
}

.detail-wrap {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 40px;
  align-items: flex-start;
}

/* ── 슬라이더 ── */
.detail-image-col { position: sticky; top: 88px; }

.image-wrap {
  position: relative;
  border-radius: var(--fc-radius-md);
  overflow: hidden;
  background: var(--fc-line);
  cursor: default;
}

.slider-track {
  display: flex;
  transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
}

.slide { flex-shrink: 0; width: 100%; }

.main-image {
  width: 100%; display: block;
  max-height: 80vh; object-fit: cover;
}

.image-placeholder {
  width: 100%; aspect-ratio: 3/4;
  display: flex; align-items: center; justify-content: center;
  color: var(--fc-text-muted); font-size: 0.9rem;
}

/* 슬라이더 버튼 */
.slide-btn {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(255,255,255,0.9);
  border: none; cursor: pointer; z-index: 5;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transition: all 0.15s;
}
.slide-btn:hover { background: #fff; transform: translateY(-50%) scale(1.05); }
.slide-btn.prev { left: 12px; }
.slide-btn.next { right: 12px; }

/* 인디케이터 */
.slide-indicator {
  position: absolute; bottom: 12px; right: 12px;
  background: rgba(0,0,0,0.5);
  color: #fff; font-size: 0.72rem; font-weight: 600;
  padding: 3px 10px; border-radius: 999px;
  z-index: 4;
}

/* 체형 오버레이 */
.body-overlay {
  position: absolute; top: 12px; left: 12px;
  background: rgba(0,0,0,0.45); color: #fff;
  font-size: 0.75rem; font-weight: 600;
  padding: 4px 10px; border-radius: 999px;
  z-index: 4; backdrop-filter: blur(4px);
}

/* 핀 */
.pin-dot {
  position: absolute; width: 22px; height: 22px;
  transform: translate(-50%, -50%);
  cursor: pointer; z-index: 3;
}
.pin-dot::before {
  content: '';
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 10px; height: 10px; border-radius: 50%;
  background: #fff; border: 2px solid #111;
  transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
  z-index: 2;
}
.pin-dot:hover::before { transform: translate(-50%, -50%) scale(1.4); }

.pin-pulse {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 22px; height: 22px; border-radius: 50%;
  background: rgba(255,255,255,0.35);
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%,100% { transform: translate(-50%,-50%) scale(1); opacity: 0.6; }
  50%      { transform: translate(-50%,-50%) scale(1.6); opacity: 0; }
}

.pin-popup {
  position: absolute; z-index: 10;
  background: #fff; border-radius: 12px;
  padding: 14px 16px; min-width: 180px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.18);
}
.pin-popup-close {
  position: absolute; top: 8px; right: 10px;
  background: none; border: none; font-size: 12px; color: #aaa; cursor: pointer;
}
.pin-brand   { font-size: 0.72rem; color: var(--fc-text-muted); margin-bottom: 3px; }
.pin-product { font-size: 0.92rem; font-weight: 700; color: var(--fc-text); margin-bottom: 4px; }
.pin-price   { font-size: 0.88rem; font-weight: 600; color: var(--fc-text); margin-bottom: 10px; }
.pin-link    {
  font-size: 0.8rem; color: var(--fc-text); font-weight: 600;
  text-decoration: none; border-bottom: 1px solid var(--fc-text); padding-bottom: 1px;
}

.pin-pop-enter-active, .pin-pop-leave-active { transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1); }
.pin-pop-enter-from, .pin-pop-leave-to { opacity: 0; transform: scale(0.85); }

.pin-guide {
  display: flex; align-items: center; gap: 5px;
  font-size: 0.75rem; color: var(--fc-text-muted);
  margin-top: 10px; padding: 0 4px;
}

/* ── 우측 ── */
.detail-info-col {
  background: var(--fc-surface);
  border-radius: var(--fc-radius-md);
  padding: 24px;
  box-shadow: var(--fc-shadow-sm);
}

.author-row {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 20px; position: relative;
}
.author-info { display: flex; align-items: center; gap: 12px; }
.author-avatar {
  width: 44px; height: 44px; border-radius: 50%; overflow: hidden;
  background: var(--fc-bg); display: flex; align-items: center; justify-content: center;
  font-size: 1rem; font-weight: 700; color: var(--fc-text);
  border: 1.5px solid var(--fc-line); flex-shrink: 0;
}
.author-avatar img { width: 100%; height: 100%; object-fit: cover; }
.author-name { font-size: 0.95rem; font-weight: 700; color: var(--fc-text); }
.author-date { font-size: 0.78rem; color: var(--fc-text-muted); margin-top: 2px; }

.btn-more {
  background: none; border: none; font-size: 1.2rem; color: var(--fc-text-muted);
  cursor: pointer; padding: 4px 8px; border-radius: 6px; transition: background 0.15s;
}
.btn-more:hover { background: var(--fc-bg); }

.more-menu {
  position: absolute; top: 100%; right: 0;
  background: var(--fc-surface); border: 1px solid var(--fc-line);
  border-radius: 10px; overflow: hidden; z-index: 10; box-shadow: var(--fc-shadow-md);
}
.more-menu button {
  display: block; width: 100%; padding: 10px 20px;
  background: none; border: none; font-size: 0.88rem; color: var(--fc-text);
  cursor: pointer; text-align: left; transition: background 0.15s;
}
.more-menu button:hover { background: var(--fc-bg); }
.more-menu button.danger { color: #e53e3e; }

.divider { height: 1px; background: var(--fc-line); margin: 18px 0; }

/* 태그 */
.tag-group { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
.tag-badge {
  display: inline-block; padding: 3px 10px;
  background: var(--fc-bg); border: 1px solid var(--fc-line);
  border-radius: 999px; font-size: 0.72rem; font-weight: 600; color: var(--fc-text-muted);
}
.tag-badge.gender { background: #f5f5f5; color: var(--fc-text); }
.tag-badge.tpo    { background: #f0f4ff; border-color: #c7d4ff; color: #4a6cf7; }
.tag-badge.season { background: #f0fff4; border-color: #b2f0cb; color: #2d8a4e; }

.post-content { font-size: 0.9rem; color: var(--fc-text-soft); line-height: 1.8; white-space: pre-line; }

/* 수정 박스 */
.edit-box { margin-bottom: 12px; }

.edit-textarea {
  width: 100% !important;
  background: var(--fc-bg) !important;
  border: 1.5px solid var(--fc-line) !important;
  border-radius: 10px !important;
  color: var(--fc-text) !important;
  padding: 12px 14px !important;
  font-size: 0.9rem !important;
  line-height: 1.8 !important;
  resize: vertical !important;
  outline: none !important;
  display: block !important;
  box-sizing: border-box !important;
}
.edit-textarea:focus { border-color: var(--fc-text) !important; }

.edit-actions {
  display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px;
}

.btn-edit-cancel {
  height: 34px; padding: 0 16px;
  background: none; border: 1.5px solid var(--fc-line);
  border-radius: 8px; font-size: 0.82rem; font-weight: 600;
  color: var(--fc-text-muted); cursor: pointer; transition: all 0.15s;
}
.btn-edit-cancel:hover { border-color: var(--fc-text); color: var(--fc-text); }

.btn-edit-save {
  height: 34px; padding: 0 16px;
  background: var(--fc-black); border: none;
  border-radius: 8px; font-size: 0.82rem; font-weight: 700;
  color: #fff; cursor: pointer; transition: opacity 0.15s;
}
.btn-edit-save:hover { opacity: 0.8; }

/* 핀 아이템 */
.pin-list { margin-top: 4px; }
.pin-list-title {
  font-size: 0.78rem; font-weight: 700; color: var(--fc-text-muted);
  letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 10px;
}

.pin-items-grid {
  display: flex; gap: 10px;
  overflow-x: auto; padding-bottom: 4px; scrollbar-width: none;
}
.pin-items-grid::-webkit-scrollbar { display: none; }

.pin-item-box {
  flex-shrink: 0; width: 160px;
  border: 1.5px solid var(--fc-line); border-radius: 14px;
  padding: 14px; cursor: pointer;
  transition: all 0.18s; background: var(--fc-surface);
  position: relative;
}
.pin-item-box:hover {
  border-color: var(--fc-text);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
}
.pin-item-box::before {
  content: attr(data-idx);
  position: absolute; top: 10px; right: 10px;
  width: 20px; height: 20px; border-radius: 50%;
  background: var(--fc-text); color: #fff;
  font-size: 10px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}

.pin-item-top    { margin-bottom: 12px; padding-right: 20px; }
.pin-item-bottom { display: flex; align-items: center; justify-content: space-between; gap: 4px; }
.pin-item-brand  { font-size: 0.7rem; color: var(--fc-text-muted); margin-bottom: 4px; }
.pin-item-name   {
  font-size: 0.85rem; font-weight: 700; color: var(--fc-text);
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.4;
}
.pin-item-price { font-size: 0.82rem; font-weight: 700; color: var(--fc-text); white-space: nowrap; }
.pin-item-link {
  flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center;
  height: 26px; padding: 0 10px;
  background: var(--fc-text); color: #fff; border-radius: 999px;
  font-size: 0.7rem; font-weight: 700; text-decoration: none;
  transition: opacity 0.15s; white-space: nowrap;
}
.pin-item-link:hover { opacity: 0.75; }

/* 좋아요/아카이브 */
.action-row { display: flex; gap: 10px; }
.action-btn {
  flex: 1; height: 46px; display: flex; align-items: center; justify-content: center; gap: 8px;
  border-radius: 10px; font-size: 0.88rem; font-weight: 600; cursor: pointer;
  transition: all 0.18s; border: 1.5px solid var(--fc-line); background: none; color: var(--fc-text-soft);
}
.action-btn:hover { border-color: var(--fc-text); color: var(--fc-text); }
.action-btn.like.active    { background: #fff0f3; border-color: #ff4d6d; color: #ff4d6d; }
.action-btn.archive.active { background: var(--fc-bg); border-color: var(--fc-text); color: var(--fc-text); }

/* 댓글 */
.comment-title { font-size: 0.88rem; font-weight: 700; color: var(--fc-text); margin-bottom: 14px; }
.comment-input-wrap { display: flex; gap: 10px; margin-bottom: 20px; }
.comment-avatar {
  width: 34px; height: 34px; border-radius: 50%;
  background: var(--fc-bg); border: 1.5px solid var(--fc-line);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.8rem; font-weight: 700; color: var(--fc-text); flex-shrink: 0; overflow: hidden;
}
.comment-input-box { flex: 1; }
.comment-input {
  width: 100% !important; background: var(--fc-bg) !important;
  border: 1.5px solid var(--fc-line) !important; border-radius: 10px !important;
  color: var(--fc-text) !important; padding: 10px 14px !important;
  font-size: 0.88rem !important; resize: none !important; outline: none !important;
  transition: border-color 0.2s !important; display: block !important;
}
.comment-input:focus { border-color: var(--fc-text) !important; background: var(--fc-surface) !important; }
.comment-input::placeholder { color: var(--fc-text-muted) !important; }
.comment-input-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 6px; }
.comment-hint { font-size: 0.72rem; color: var(--fc-text-muted); }
.btn-comment-submit {
  height: 32px; padding: 0 16px; background: var(--fc-black); color: #fff;
  border: none; border-radius: 8px; font-size: 0.8rem; font-weight: 600;
  cursor: pointer; transition: opacity 0.2s;
}
.btn-comment-submit:hover    { opacity: 0.8; }
.btn-comment-submit:disabled { opacity: 0.35; cursor: default; }

.comment-list { display: flex; flex-direction: column; gap: 14px; }
.comment-item { display: flex; gap: 10px; align-items: flex-start; }
.comment-body { flex: 1; min-width: 0; }
.comment-header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.comment-name { font-size: 0.85rem; font-weight: 700; color: var(--fc-text); }
.comment-date { font-size: 0.72rem; color: var(--fc-text-muted); }
.comment-text { font-size: 0.88rem; color: var(--fc-text-soft); line-height: 1.6; }
.comment-delete {
  background: none; border: none; font-size: 11px; color: var(--fc-text-muted);
  cursor: pointer; flex-shrink: 0; padding: 2px 4px; transition: color 0.15s;
}
.comment-delete:hover { color: #e53e3e; }
.comment-empty { text-align: center; padding: 24px 0; font-size: 0.88rem; color: var(--fc-text-muted); }

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