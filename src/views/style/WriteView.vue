<template>
  <div class="write-page">
    <div class="write-wrap">

      <!-- 헤더 -->
      <div class="write-header">
        <button class="btn-back" @click="$router.back()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <h1 class="write-title">{{ isEditMode ? '스냅 수정하기' : '스냅 작성하기' }}</h1>
        <button class="btn-submit-top" @click="handleSubmit" :disabled="!canSubmit || loading">
          {{ loading ? (isEditMode ? '수정 중...' : '등록 중...') : (isEditMode ? '수정하기' : '등록하기') }}
        </button>
      </div>

      <div class="write-body">

        <!-- ① 사진 첨부 -->
        <section class="write-section">
          <div class="section-label">
            사진 첨부 <span class="req">*</span>
            <span class="label-sub">최대 10장</span>
          </div>

          <div class="photo-list">
            <!-- 추가 버튼 -->
            <div
              class="photo-add"
              @click="triggerFileInput"
              v-if="photos.length < 10"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              <span>{{ photos.length }}/10</span>
            </div>

            <!-- 업로드된 사진들 -->
            <div
              v-for="(photo, i) in photos"
              :key="i"
              class="photo-item"
            >
              <img :src="photo.preview" :alt="`사진 ${i+1}`">
              <button class="photo-delete" @click="removePhoto(i)">✕</button>
              <div class="photo-main-badge" v-if="i === 0">대표</div>
            </div>
          </div>
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            multiple
            style="display:none"
            @change="onFileChange"
          >
          <p class="photo-hint">첫 번째 사진이 대표 이미지로 설정돼요.</p>
        </section>

        <div class="section-divider"></div>

        <!-- ② 본문 -->
        <section class="write-section">
          <div class="section-label">본문 입력</div>
          <textarea
            class="write-textarea"
            v-model="form.content"
            placeholder="착용한 #아이템 및 스타일을 소개해 주세요."
            maxlength="2000"
            rows="6"
          ></textarea>

          <!-- 해시태그 추천 -->
          <div class="hashtag-suggestions">
            <button
              v-for="tag in hashtagSuggestions"
              :key="tag"
              type="button"
              class="hashtag-btn"
              @click="insertHashtag(tag)"
            >#{{ tag }}</button>
          </div>

          <div class="textarea-count">{{ form.content.length }}/2,000</div>
        </section>

        <div class="section-divider"></div>

        <!-- ③ 상품 핀 태그 -->
        <section class="write-section">
          <div class="section-label">
            상품 핀 태그
            <span class="label-sub">최대 10개</span>
          </div>

          <!-- 사진 없을 때 -->
          <div class="pin-no-photo" v-if="photos.length === 0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
            <span>사진을 먼저 업로드하면 핀을 찍을 수 있어요</span>
          </div>

          <!-- 핀 에디터 (사진 있을 때) -->
          <div v-else>
            <!-- 핀 모드 안내 -->
            <div class="pin-mode-bar" :class="{ active: pinMode }">
              <span>{{ pinMode ? '📍 사진을 클릭해서 핀을 찍어보세요' : '아래 버튼을 눌러 핀 위치를 지정하세요' }}</span>
              <button
                type="button"
                class="btn-pin-mode"
                :class="{ active: pinMode }"
                @click="pinMode = !pinMode"
                v-if="pins.length < 10"
              >{{ pinMode ? '취소' : '+ 핀 추가' }}</button>
            </div>

            <!-- 사진 + 핀 에디터 -->
            <div
              class="pin-editor"
              ref="pinEditor"
              :class="{ 'pin-cursor': pinMode }"
              @click="onImageClick"
            >
              <img :src="photos[0].preview" class="pin-editor-img" ref="pinEditorImg">

              <!-- 찍힌 핀들 -->
              <div
                v-for="(pin, i) in pins"
                :key="i"
                class="pin-marker"
                :style="{ left: pin.posX + '%', top: pin.posY + '%' }"
                @click.stop="selectPin(i)"
                :class="{ selected: selectedPinIdx === i }"
              >
                <div class="pin-marker-dot"></div>
                <div class="pin-marker-label">{{ pin.brand || '?' }}</div>
              </div>

              <!-- 임시 핀 (클릭 직후) -->
              <div
                v-if="tempPin"
                class="pin-marker temp"
                :style="{ left: tempPin.posX + '%', top: tempPin.posY + '%' }"
              >
                <div class="pin-marker-dot"></div>
              </div>
            </div>

            <!-- 핀 목록 -->
            <div class="pin-list" v-if="pins.length > 0">
              <div
                v-for="(pin, i) in pins"
                :key="i"
                class="pin-item"
                :class="{ selected: selectedPinIdx === i }"
                @click="selectedPinIdx = i"
              >
                <div class="pin-num">{{ i + 1 }}</div>
                <div class="pin-info">
                  <p class="pin-brand">{{ pin.brand || '브랜드 없음' }}</p>
                  <p class="pin-name">{{ pin.productName || '상품명 없음' }}</p>
                </div>
                <p class="pin-price" v-if="pin.price">{{ Number(pin.price).toLocaleString() }}원</p>
                <button class="pin-delete" @click.stop="removePin(i)">✕</button>
              </div>
            </div>
          </div>
        </section>

        <div class="section-divider"></div>

        <!-- ④ 성별 -->
        <section class="write-section">
          <div class="section-label">성별</div>
          <div class="chip-group">
            <button
              v-for="g in genders"
              :key="g"
              type="button"
              class="chip"
              :class="{ active: form.gender === g }"
              @click="form.gender = g"
            >{{ g }}</button>
          </div>
        </section>

        <div class="section-divider"></div>

        <!-- ⑤ 계절 -->
        <section class="write-section">
          <div class="section-label">
            계절
            <span class="label-sub">최대 2개</span>
          </div>
          <div class="chip-group">
            <button
              v-for="s in seasons"
              :key="s"
              type="button"
              class="chip"
              :class="{ active: form.seasons.includes(s) }"
              @click="toggleMulti(form.seasons, s, 2)"
            >{{ s }}</button>
          </div>
        </section>

        <div class="section-divider"></div>

        <!-- ⑥ 스타일 태그 -->
        <section class="write-section">
          <div class="section-label">
            스타일 태그
            <span class="label-sub">최대 2개</span>
          </div>
          <div class="chip-group wrap">
            <button
              v-for="s in styleTags"
              :key="s"
              type="button"
              class="chip"
              :class="{ active: form.styleTags.includes(s) }"
              @click="toggleMulti(form.styleTags, s, 2)"
            >{{ s }}</button>
          </div>
        </section>

        <div class="section-divider"></div>

        <!-- ⑦ TPO -->
        <section class="write-section">
          <div class="section-label">
            TPO
            <span class="label-sub">최대 2개</span>
          </div>
          <div class="chip-group wrap">
            <button
              v-for="t in tpoTags"
              :key="t"
              type="button"
              class="chip"
              :class="{ active: form.tpoTags.includes(t) }"
              @click="toggleMulti(form.tpoTags, t, 2)"
            >{{ t }}</button>
          </div>
        </section>

        <div class="section-divider"></div>

        <!-- ⑧ 체형 정보 -->
        <section class="write-section">
          <div class="section-label-row">
            <div class="section-label">체형 정보 <span class="label-opt">선택</span></div>
          </div>
          <div class="body-info-grid">
            <div class="body-field">
              <label class="body-label">키 (cm)</label>
              <input class="body-input" type="number" v-model="form.height" placeholder="예) 165">
            </div>
            <div class="body-field">
              <label class="body-label">몸무게 (kg)</label>
              <input class="body-input" type="number" v-model="form.weight" placeholder="예) 55">
            </div>
          </div>
        </section>

        <div class="section-divider"></div>

        <!-- 등록 버튼 -->
        <div class="write-footer">
          <p class="error-msg" v-if="errorMsg">{{ errorMsg }}</p>
          <button
            class="btn-submit"
            @click="handleSubmit"
            :disabled="!canSubmit || loading"
          >
          {{ loading ? (isEditMode ? '수정 중...' : '등록 중...') : (isEditMode ? '수정하기' : '등록하기') }}
          </button>
        </div>

      </div>
    </div>

    <!-- 핀 정보 입력 모달 (클릭 후 자동 오픈) -->
    <div class="modal-overlay" v-if="showPinModal" @click.self="cancelPin">
      <div class="modal-box">
        <div class="modal-header">
          <h3 class="modal-title">상품 정보 입력</h3>
          <button class="modal-close" @click="cancelPin">✕</button>
        </div>
        <div class="modal-body">
          <div class="modal-field">
            <label class="modal-label">브랜드 <span class="req">*</span></label>
            <input class="modal-input" type="text" v-model="pinForm.brand" placeholder="예) 나이키" ref="pinBrandInput">
          </div>
          <div class="modal-field">
            <label class="modal-label">상품명 <span class="req">*</span></label>
            <input class="modal-input" type="text" v-model="pinForm.productName" placeholder="예) 에어포스1 화이트">
          </div>
          <div class="modal-field">
            <label class="modal-label">가격 <span class="label-opt">선택</span></label>
            <input class="modal-input" type="number" v-model="pinForm.price" placeholder="예) 129000">
          </div>
          <div class="modal-field">
            <label class="modal-label">구매 링크 <span class="label-opt">선택</span></label>
            <input class="modal-input" type="url" v-model="pinForm.purchaseUrl" placeholder="https://...">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-modal-cancel" @click="cancelPin">취소</button>
          <button
            class="btn-modal-add"
            @click="savePin"
            :disabled="!pinForm.brand || !pinForm.productName"
          >저장</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import http from '@/util/http'

const router  = useRouter()
const route   = useRoute()

// 수정 모드 여부
const editPostId = route.params.id ?? null
const isEditMode = !!editPostId

// 사진
const fileInput = ref(null)
const photos    = ref([])

function triggerFileInput() { fileInput.value.click() }

function onFileChange(e) {
  const files = Array.from(e.target.files)
  const remaining = 10 - photos.value.length
  files.slice(0, remaining).forEach(file => {
    photos.value.push({
      file,
      preview: URL.createObjectURL(file)
    })
  })
  e.target.value = ''
}

function removePhoto(i) {
  URL.revokeObjectURL(photos.value[i].preview)
  photos.value.splice(i, 1)
}

// 폼
const form = ref({
  content:   '',
  gender:    '',
  seasons:   [],
  styleTags: [],
  tpoTags:   [],
  height:    '',
  weight:    '',
})

const genders  = ['여성', '남성', '유니섹스']
const seasons  = ['봄', '여름', '가을', '겨울']
const styleTags = ['캐주얼', '스트릿', '미니멀', '걸리시', '스포티', '클래식', '워크웨어', '로맨틱', '시크', '시티보이', '고프코어', '레트로', '프레피', '리조트', '에스닉']
const tpoTags  = ['데일리', '데이트', '캠퍼스', '출근', '결혼식', '피트니스', '러닝', '요가/필라테스', '바다/수영', '골프', '페스티벌', '등산/아웃도어']

const hashtagSuggestions = ['오늘의스냅', '꾸안꾸', '출근룩', '체형커버코디', '여행코디', '데이트룩', '봄코디']

function toggleMulti(arr, val, max) {
  const idx = arr.indexOf(val)
  if (idx > -1) { arr.splice(idx, 1) }
  else if (arr.length < max) { arr.push(val) }
}

function insertHashtag(tag) {
  form.value.content += ` #${tag}`
}

// 핀
const pins          = ref([])
const pinMode       = ref(false)
const tempPin       = ref(null)
const selectedPinIdx = ref(null)
const showPinModal  = ref(false)
const pinEditor     = ref(null)
const pinBrandInput = ref(null)
const pinForm       = ref({ brand: '', productName: '', price: '', purchaseUrl: '' })

// 사진 위 클릭 → 핀 위치 계산
function onImageClick(e) {
  if (!pinMode.value) return
  if (pins.value.length >= 10) return

  const rect = pinEditor.value.getBoundingClientRect()
  const posX = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1)
  const posY = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1)

  tempPin.value = { posX: Number(posX), posY: Number(posY) }
  pinForm.value = { brand: '', productName: '', price: '', purchaseUrl: '' }
  showPinModal.value = true

  // 모달 열리면 브랜드 input 포커스
  setTimeout(() => pinBrandInput.value?.focus(), 100)
}

// 핀 저장
function savePin() {
  if (!pinForm.value.brand || !pinForm.value.productName) return
  pins.value.push({
    ...pinForm.value,
    posX: tempPin.value.posX,
    posY: tempPin.value.posY,
  })
  tempPin.value     = null
  showPinModal.value = false
  pinMode.value      = false
}

// 핀 취소
function cancelPin() {
  tempPin.value      = null
  showPinModal.value = false
}

// 핀 선택
function selectPin(i) {
  selectedPinIdx.value = selectedPinIdx.value === i ? null : i
}

function removePin(i) {
  pins.value.splice(i, 1)
  if (selectedPinIdx.value === i) selectedPinIdx.value = null
}

// 수정 모드: 기존 게시글 불러오기
onMounted(async () => {
  if (!isEditMode) return
  try {
    const post = await http.get(`/posts/${editPostId}`)
    form.value.content   = post.content   ?? ''
    form.value.gender    = post.gender    ?? ''
    form.value.seasons   = post.seasons   ? post.seasons.split(',').map(s => s.trim()).filter(Boolean)   : []
    form.value.styleTags = post.styleTags ? post.styleTags.split(',').map(s => s.trim()).filter(Boolean) : []
    form.value.tpoTags   = post.tpoTags   ? post.tpoTags.split(',').map(s => s.trim()).filter(Boolean)   : []
    form.value.height    = post.height    ?? ''
    form.value.weight    = post.weight    ?? ''
    // 기존 이미지는 미리보기로 표시 (업로드 파일 없이)
    const urls = post.imageUrls?.length ? post.imageUrls : (post.imageUrl ? [post.imageUrl] : [])
    urls.forEach(url => {
      photos.value.push({ file: null, preview: `http://localhost:9090/uploads/post/${url}`, existing: url })
    })
    // 기존 핀 불러오기
    if (post.pins?.length) {
      pins.value = post.pins.map(p => ({
        brand: p.brand, productName: p.productName,
        price: p.price, purchaseUrl: p.purchaseUrl,
        posX: p.posX, posY: p.posY,
      }))
    }
  } catch (e) {
    console.error('게시글 불러오기 실패', e)
  }
})
const canSubmit = computed(() =>
  photos.value.length > 0 && form.value.content.trim().length > 0
)

const errorMsg = ref('')
const loading  = ref(false)

async function handleSubmit() {
  errorMsg.value = ''
  if (photos.value.length === 0) return (errorMsg.value = '사진을 최소 1장 첨부해주세요.')
  if (!form.value.content.trim()) return (errorMsg.value = '본문을 입력해주세요.')

  loading.value = true
  try {
    const fd = new FormData()
    fd.append('content',   form.value.content)
    fd.append('gender',    form.value.gender)
    fd.append('seasons',   form.value.seasons.join(','))
    fd.append('styleTags', form.value.styleTags.join(','))
    fd.append('tpoTags',   form.value.tpoTags.join(','))
    fd.append('height',    form.value.height)
    fd.append('weight',    form.value.weight)

    // 새로 추가된 사진만 전송 (file이 있는 것)
    const newPhotos = photos.value.filter(p => p.file)
    if (newPhotos.length > 0) fd.append('imageFile', newPhotos[0].file)

    if (isEditMode) {
      await http.put(`/posts/${editPostId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      router.push(`/posts/${editPostId}`)
    } else {
      await http.post('/posts', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      router.push('/')
    }
  } catch (e) {
    errorMsg.value = e.message || '오류가 발생했습니다.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.write-page {
  min-height: 100vh;
  background: var(--fc-bg);
  padding-bottom: 40px;
}

.write-wrap {
  max-width: 640px;
  margin: 0 auto;
}

/* 헤더 */
.write-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: var(--fc-surface);
  border-bottom: 1px solid var(--fc-line);
  position: sticky;
  top: 72px;
  z-index: 50;
}

.btn-back {
  width: 36px; height: 36px;
  background: none; border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--fc-text);
  border-radius: 8px;
  transition: background 0.15s;
}
.btn-back:hover { background: var(--fc-bg); }

.write-title {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--fc-text);
}

.btn-submit-top {
  height: 36px;
  padding: 0 18px;
  background: var(--fc-black);
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-submit-top:hover    { opacity: 0.82; }
.btn-submit-top:disabled { opacity: 0.35; cursor: default; }

/* 바디 */
.write-body {
  background: var(--fc-surface);
}

/* 섹션 */
.write-section { padding: 24px 20px; }
.section-divider { height: 8px; background: var(--fc-bg); }

.section-label {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--fc-text);
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.section-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.section-label-row .section-label { margin-bottom: 0; }

.label-sub {
  font-size: 0.72rem;
  font-weight: 400;
  color: var(--fc-text-muted);
}

.label-opt {
  font-size: 0.72rem;
  font-weight: 400;
  color: var(--fc-text-muted);
  background: var(--fc-bg);
  padding: 1px 7px;
  border-radius: 999px;
}

.req { color: #e53e3e; font-size: 0.9rem; }

.section-desc {
  font-size: 0.82rem;
  color: var(--fc-text-muted);
  margin-bottom: 14px;
}

/* 사진 */
.photo-list {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 4px;
}
.photo-list::-webkit-scrollbar { display: none; }

.photo-add {
  flex-shrink: 0;
  width: 90px; height: 90px;
  border: 1.5px dashed var(--fc-line-dark);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  color: var(--fc-text-muted);
  font-size: 0.72rem;
  transition: border-color 0.2s, background 0.2s;
}
.photo-add:hover { border-color: var(--fc-text); background: var(--fc-bg); color: var(--fc-text); }

.photo-item {
  flex-shrink: 0;
  width: 90px; height: 90px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.photo-item img { width: 100%; height: 100%; object-fit: cover; display: block; }

.photo-delete {
  position: absolute;
  top: 4px; right: 4px;
  width: 20px; height: 20px;
  background: rgba(0,0,0,0.55);
  color: #fff;
  border: none;
  border-radius: 50%;
  font-size: 10px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
}

.photo-main-badge {
  position: absolute;
  bottom: 4px; left: 4px;
  background: rgba(0,0,0,0.55);
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.photo-hint {
  font-size: 0.75rem;
  color: var(--fc-text-muted);
  margin-top: 10px;
}

/* 텍스트에어리아 */
.write-textarea {
  width: 100% !important;
  background: var(--fc-bg) !important;
  border: 1.5px solid var(--fc-line) !important;
  border-radius: 12px !important;
  color: var(--fc-text) !important;
  padding: 14px !important;
  font-size: 0.92rem !important;
  line-height: 1.7 !important;
  resize: none !important;
  outline: none !important;
  transition: border-color 0.2s !important;
  display: block !important;
  height: auto !important;
}
.write-textarea:focus { border-color: var(--fc-text) !important; background: var(--fc-surface) !important; }
.write-textarea::placeholder { color: var(--fc-text-muted) !important; }

.hashtag-suggestions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.hashtag-btn {
  padding: 5px 12px;
  background: var(--fc-bg);
  border: 1px solid var(--fc-line) !important;
  border-radius: 999px;
  font-size: 0.78rem;
  color: var(--fc-text-soft);
  cursor: pointer;
  transition: all 0.15s;
}
.hashtag-btn:hover { border-color: var(--fc-text) !important; color: var(--fc-text); }

.textarea-count {
  text-align: right;
  font-size: 0.72rem;
  color: var(--fc-text-muted);
  margin-top: 6px;
}

/* 핀 에디터 */
.pin-no-photo {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: var(--fc-bg);
  border-radius: 10px;
  font-size: 0.85rem;
  color: var(--fc-text-muted);
}

.pin-mode-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: var(--fc-bg);
  border-radius: 10px;
  margin-bottom: 12px;
  font-size: 0.82rem;
  color: var(--fc-text-muted);
  border: 1.5px solid var(--fc-line);
  transition: all 0.2s;
}

.pin-mode-bar.active {
  background: rgba(17,17,17,0.04);
  border-color: var(--fc-text);
  color: var(--fc-text);
}

.btn-pin-mode {
  height: 30px;
  padding: 0 14px;
  background: var(--fc-text);
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  flex-shrink: 0;
  transition: opacity 0.2s;
}
.btn-pin-mode:hover   { opacity: 0.8; }
.btn-pin-mode.active  { background: #e53e3e; }

.pin-editor {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 14px;
  user-select: none;
}

.pin-editor.pin-cursor { cursor: crosshair; }

.pin-editor-img {
  width: 100%;
  display: block;
  max-height: 480px;
  object-fit: contain;
  background: #000;
}

/* 핀 마커 */
.pin-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

.pin-marker-dot {
  width: 18px; height: 18px;
  border-radius: 50%;
  background: #fff;
  border: 2.5px solid #111;
  transition: transform 0.15s cubic-bezier(0.34,1.56,0.64,1);
  box-shadow: 0 2px 6px rgba(0,0,0,0.25);
}

.pin-marker:hover .pin-marker-dot,
.pin-marker.selected .pin-marker-dot { transform: scale(1.3); }
.pin-marker.selected .pin-marker-dot { background: #111; }

.pin-marker-label {
  background: rgba(0,0,0,0.7);
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none;
}

.pin-marker.temp .pin-marker-dot {
  background: #e53e3e;
  border-color: #e53e3e;
  animation: tempPulse 0.6s ease infinite alternate;
}

@keyframes tempPulse {
  from { transform: scale(1); }
  to   { transform: scale(1.3); }
}

/* 핀 목록 */
.pin-list { display: flex; flex-direction: column; gap: 8px; }

.pin-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: var(--fc-bg);
  border-radius: 10px;
  cursor: pointer;
  border: 1.5px solid transparent;
  transition: border-color 0.15s;
}
.pin-item.selected { border-color: var(--fc-text); }
.pin-item:hover    { border-color: var(--fc-line-dark); }

.pin-num {
  width: 22px; height: 22px;
  border-radius: 50%;
  background: var(--fc-text);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.pin-info { flex: 1; min-width: 0; }
.pin-brand { font-size: 0.72rem; color: var(--fc-text-muted); }
.pin-name  { font-size: 0.88rem; font-weight: 600; color: var(--fc-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pin-price { font-size: 0.85rem; font-weight: 700; color: var(--fc-text); flex-shrink: 0; }

.pin-delete {
  background: none; border: none;
  font-size: 12px; color: var(--fc-text-muted);
  cursor: pointer; padding: 4px;
  transition: color 0.15s; flex-shrink: 0;
}
.pin-delete:hover { color: #e53e3e; }

/* 칩 */
.chip-group {
  display: flex;
  gap: 8px;
}

.chip-group.wrap { flex-wrap: wrap; }

.chip {
  padding: 8px 16px;
  background: var(--fc-bg);
  border: 1.5px solid var(--fc-line) !important;
  border-radius: 999px;
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--fc-text-soft);
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.chip:hover  { border-color: var(--fc-text) !important; color: var(--fc-text); }
.chip.active { background: var(--fc-text) !important; border-color: var(--fc-text) !important; color: #fff; font-weight: 600; }

/* 체형 */
.body-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.body-label {
  display: block;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--fc-text);
  margin-bottom: 6px;
}

.body-input {
  width: 100% !important;
  height: 46px !important;
  background: var(--fc-bg) !important;
  border: 1.5px solid var(--fc-line) !important;
  border-radius: 10px !important;
  color: var(--fc-text) !important;
  padding: 0 14px !important;
  font-size: 0.92rem !important;
  outline: none !important;
  transition: border-color 0.2s !important;
  box-shadow: none !important;
}
.body-input:focus { border-color: var(--fc-text) !important; background: var(--fc-surface) !important; }

/* 푸터 */
.write-footer { padding: 20px; }

.error-msg {
  font-size: 0.82rem;
  color: #e53e3e;
  text-align: center;
  margin-bottom: 12px;
  padding: 10px;
  background: rgba(229,62,62,0.05);
  border-radius: 8px;
}

.btn-submit {
  width: 100%;
  height: 52px;
  background: var(--fc-black);
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-submit:hover    { opacity: 0.85; }
.btn-submit:disabled { opacity: 0.35; cursor: default; }

/* 모달 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 500;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.modal-box {
  width: 100%;
  max-width: 640px;
  background: var(--fc-surface);
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  animation: slideUp 0.3s cubic-bezier(0.22,1,0.36,1);
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 16px;
  border-bottom: 1px solid var(--fc-line);
}

.modal-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--fc-text);
}

.modal-close {
  background: none; border: none;
  font-size: 1rem; color: var(--fc-text-muted);
  cursor: pointer;
}

.modal-body { padding: 20px; }

.modal-field { margin-bottom: 14px; }

.modal-label {
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--fc-text);
  margin-bottom: 6px;
}

.modal-input {
  width: 100% !important;
  height: 46px !important;
  background: var(--fc-bg) !important;
  border: 1.5px solid var(--fc-line) !important;
  border-radius: 10px !important;
  color: var(--fc-text) !important;
  padding: 0 14px !important;
  font-size: 0.92rem !important;
  outline: none !important;
  transition: border-color 0.2s !important;
  box-shadow: none !important;
  display: block !important;
}
.modal-input:focus { border-color: var(--fc-text) !important; background: var(--fc-surface) !important; }

.modal-footer {
  display: flex;
  gap: 10px;
  padding: 16px 20px 24px;
  border-top: 1px solid var(--fc-line);
}

.btn-modal-cancel {
  flex: 1;
  height: 48px;
  background: var(--fc-bg);
  border: 1.5px solid var(--fc-line) !important;
  border-radius: 999px;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--fc-text-soft);
  cursor: pointer;
  transition: all 0.15s;
}
.btn-modal-cancel:hover { border-color: var(--fc-text) !important; color: var(--fc-text); }

.btn-modal-add {
  flex: 1;
  height: 48px;
  background: var(--fc-black);
  border: none;
  border-radius: 999px;
  font-size: 0.92rem;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-modal-add:hover    { opacity: 0.82; }
.btn-modal-add:disabled { opacity: 0.35; cursor: default; }
</style>