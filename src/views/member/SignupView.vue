<template>
  <div class="signup-page">
    <div class="signup-wrap">

      <!-- 타이틀 -->
      <h1 class="sp-title">{{ isEdit ? 'MY INFO' : 'SIGN UP' }}</h1>
      <div class="sp-title-line"></div>

      <!-- ① 프로필 사진 -->
      <div class="sp-section">
        <div class="sp-section-inner">
          <p class="sp-sec-label">프로필 사진</p>
          <div class="profile-row">
            <div class="profile-circle" @click="triggerFileInput">
              <img v-if="previewUrl" :src="previewUrl" class="profile-img">
              <span v-else class="profile-plus">+</span>
            </div>
            <div class="profile-info">
              <p class="profile-hint">JPG, PNG · 권장 200×200px</p>
              <button type="button" class="sp-btn-sm" @click="triggerFileInput">사진 선택</button>
              <input type="file" ref="fileInput" accept="image/*" style="display:none" @change="onFileChange">
            </div>
          </div>
        </div>
      </div>
      <div class="sp-line"></div>

      <!-- ② 계정 정보 -->
      <div class="sp-section">
        <div class="sp-section-inner">
          <p class="sp-sec-label">계정 정보</p>

          <div class="account-fields" > 
            <!-- 아이디 -->
            <div class="sp-field" >
              <label class="sp-label">아이디 <span class="sp-req">*</span></label>
              <div class="input-btn-wrap">
                <input
                  class="sp-input flex-input"
                  :class="{ 'is-ok': idChecked, 'is-err': idMsg && !idChecked }"
                  type="text"
                  v-model="form.loginId"
                  placeholder="영문, 숫자 6~20자"
                  @input="onIdInput"
                  @keyup.enter="checkId"
                >
                <button
                  type="button"
                  class="inline-btn"
                  @click="checkId"
                  :disabled="!form.loginId || form.loginId.length < 2"
                >중복확인</button>
              </div>
              <p class="sp-hint ok"  v-if="idChecked">✓ 사용 가능한 아이디입니다.</p>
              <p class="sp-hint err" v-else-if="idMsg">✕ {{ idMsg }}</p>
            </div>

            <div class="sp-field">
              <label class="sp-label">비밀번호 <span class="sp-req">*</span></label>
              <input class="sp-input" type="password" v-model="form.password" placeholder="영문, 숫자, 특수문자 8자 이상">
            </div>

            <div class="sp-field">
              <label class="sp-label">비밀번호 확인 <span class="sp-req">*</span></label>
              <input
                class="sp-input"
                :class="{ 'is-ok': form.passwordConfirm && form.password === form.passwordConfirm, 'is-err': form.passwordConfirm && form.password !== form.passwordConfirm }"
                type="password"
                v-model="form.passwordConfirm"
                placeholder="비밀번호를 한 번 더 입력"
              >
              <p class="sp-hint ok"  v-if="form.passwordConfirm && form.password === form.passwordConfirm">✓ 비밀번호가 일치합니다.</p>
              <p class="sp-hint err" v-if="form.passwordConfirm && form.password !== form.passwordConfirm">✕ 비밀번호가 일치하지 않습니다.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="sp-line"></div>

      <!-- ③ 개인 정보 -->
      <div class="sp-section">
        <div class="sp-section-inner">
          <p class="sp-sec-label">개인 정보</p>
          <div class="sp-grid">
            <div class="sp-field">
              <label class="sp-label">이름 <span class="sp-req">*</span></label>
              <input class="sp-input" type="text" v-model="form.name" placeholder="실명">
            </div>
            <div class="sp-field">
              <label class="sp-label">생년월일</label>
              <input class="sp-input sp-date" type="date" v-model="form.birth">
            </div>
            <div class="sp-field">
              <label class="sp-label">전화번호</label>
              <input class="sp-input" type="tel" v-model="form.tel" placeholder="010-0000-0000">
            </div>
            <div class="sp-field">
              <label class="sp-label">이메일</label>
              <input class="sp-input" type="email" v-model="form.email" placeholder="example@email.com">
            </div>
          </div>
        </div>
      </div>
      <div class="sp-line"></div>

      <!-- ④ 스타일 취향 -->
      <div class="sp-section">
        <div class="sp-section-inner">
          <p class="sp-sec-label">스타일 취향 <span class="sp-opt">1개 선택</span></p>
          <div class="style-tags">
            <button
              v-for="tag in styleTags"
              :key="tag"
              type="button"
              class="style-tag"
              :class="{ active: form.styleTag === tag }"
              @click="form.styleTag = form.styleTag === tag ? '' : tag"
            >{{ tag }}</button>
          </div>
        </div>
      </div>
      <div class="sp-line"></div>

      <!-- ⑤ 주소 -->
      <div class="sp-section">
        <div class="sp-section-inner">
          <p class="sp-sec-label">주소 <span class="sp-opt">선택</span></p>
          <div class="sp-field">
            <div class="input-btn-wrap" style="margin-bottom:10px">
              <input class="sp-input flex-input" type="text" v-model="form.zip" placeholder="우편번호" readonly @click="searchAddr" style="cursor:pointer; max-width:200px">
              <button type="button" class="inline-btn" @click="searchAddr">주소 검색</button>
            </div>
            <input class="sp-input" type="text" v-model="form.addr1" placeholder="기본주소" readonly @click="searchAddr" style="cursor:pointer; margin-bottom:8px; display:block; width:100%">
            <input class="sp-input" type="text" v-model="form.addr2" placeholder="상세주소" style="display:block; width:100%">
          </div>
        </div>
      </div>
      <div class="sp-line"></div>

      <!-- ⑥ 약관 -->
      <div class="sp-section">
        <div class="sp-section-inner">
          <p class="sp-sec-label">약관 동의</p>
          <div class="terms-list">
            <div class="term-row term-all" @click="toggleAll">
              <div class="term-chk" :class="{ on: allChecked }"></div>
              <span class="term-txt bold">전체 동의</span>
            </div>
            <div class="term-row" @click="toggle(0)">
              <div class="term-chk" :class="{ on: terms[0] }"></div>
              <span class="term-txt"><em class="badge-req">필수</em> 서비스 이용약관</span>
              <span class="term-arr">›</span>
            </div>
            <div class="term-row" @click="toggle(1)">
              <div class="term-chk" :class="{ on: terms[1] }"></div>
              <span class="term-txt"><em class="badge-req">필수</em> 개인정보 수집 및 이용</span>
              <span class="term-arr">›</span>
            </div>
            <div class="term-row" @click="toggle(2)">
              <div class="term-chk" :class="{ on: terms[2] }"></div>
              <span class="term-txt"><em class="badge-opt">선택</em> 마케팅 수신 동의</span>
              <span class="term-arr">›</span>
            </div>
          </div>
        </div>
      </div>
      <div class="sp-line"></div>

      <!-- 에러 + 제출 -->
      <div class="sp-submit-wrap">
        <p v-if="errorMsg" class="sp-error">{{ errorMsg }}</p>
        <button class="btn-submit" @click="handleSignup" :disabled="loading">
          {{ loading ? '처리 중...' : (isEdit ? '수정하기' : '가입하기')  }}
        </button>
        <p class="to-login">
          이미 계정이 있으신가요?
          <RouterLink to="/login" class="to-login-link">로그인</RouterLink>
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'  
import axios from 'axios'

const router = useRouter()
const route  = useRoute()  
const isEdit = computed(() => route.path === '/my/edit')

const form = ref({
  loginId: '', password: '', passwordConfirm: '',
  name: '', birth: '', tel: '', email: '',
  zip: '', addr1: '', addr2: '', styleTag: '',
})

const fileInput   = ref(null)
const previewUrl  = ref('')
const profileFile = ref(null)

function triggerFileInput() { fileInput.value.click() }
function onFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  profileFile.value = file
  previewUrl.value  = URL.createObjectURL(file)
}

const idMsg     = ref('')
const idChecked = ref(false)

function onIdInput() { idChecked.value = false; idMsg.value = '' }

async function checkId() {
  if (!form.value.loginId) { idMsg.value = '아이디를 입력해주세요.'; return }
  if (form.value.loginId.length < 6) { idMsg.value = '6자 이상 입력해주세요.'; return }
  try {
    const res = await axios.post('http://localhost:9090/member/userIdCheck', null, { params: { login_id: form.value.loginId } })
    if (res.data.passed === 'true') { idChecked.value = true; idMsg.value = '' }
    else { idChecked.value = false; idMsg.value = '이미 사용 중인 아이디입니다.' }
  } catch { idMsg.value = '확인 중 오류가 발생했습니다.' }
}

const styleTags = ['스트릿', '빈티지', '포멀', '캐주얼', '미니멀', '스포티', '추구하는 스타일']

function searchAddr() {
  new window.daum.Postcode({
    oncomplete(data) { form.value.zip = data.zonecode; form.value.addr1 = data.roadAddress }
  }).open()
}

const terms      = ref([false, false, false])
const allChecked = computed(() => terms.value.every(Boolean))
function toggle(i)   { terms.value[i] = !terms.value[i] }
function toggleAll() { const n = !allChecked.value; terms.value = [n, n, n] }

const errorMsg = ref('')
const loading  = ref(false)

async function handleSignup() {
  errorMsg.value = ''
  if (!idChecked.value)                                   return (errorMsg.value = '아이디 중복 확인을 해주세요.')
  if (!form.value.password)                               return (errorMsg.value = '비밀번호를 입력해주세요.')
  if (form.value.password !== form.value.passwordConfirm) return (errorMsg.value = '비밀번호가 일치하지 않습니다.')
  if (!form.value.name)                                   return (errorMsg.value = '이름을 입력해주세요.')
  if (!terms.value[0] || !terms.value[1])                 return (errorMsg.value = '필수 약관에 동의해주세요.')
  loading.value = true
  try {
    const fd = new FormData()
    fd.append('login_id', form.value.loginId)   // camelCase → snake_case
    fd.append('password', form.value.password)
    fd.append('name', form.value.name)
    fd.append('birth', form.value.birth)
    fd.append('tel', form.value.tel)
    fd.append('email', form.value.email)
    fd.append('zip', form.value.zip)
    fd.append('addr1', form.value.addr1)
    fd.append('addr2', form.value.addr2)
    fd.append('styleTag', form.value.styleTag)
    fd.append('receive_email', terms.value[2] ? '1' : '0')
    if (profileFile.value) fd.append('selectFile', profileFile.value)

     if (isEdit.value) {
      // 정보수정 API
      await axios.post('http://localhost:9090/member/update', fd)
      router.push('/complete?type=update')
    } else {
      // 회원가입 API
      await axios.post('http://localhost:9090/member/account', fd)
      router.push('/complete?type=signup')
    }
  } catch (e) {
    errorMsg.value = '회원가입 중 오류가 발생했습니다.'
  } finally { loading.value = false }
}
</script>

<style scoped>
.signup-page {
  min-height: 100vh;
  background: #fff;
  padding: 60px 20px 100px;
  animation: fadeIn 0.4s ease both;
}

.signup-wrap {
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
}

/* 타이틀 */
.sp-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: 0.25em;
  color: #111;
  margin-bottom: 28px;
  animation: slideDown 0.5s cubic-bezier(0.22,1,0.36,1) both;
}

.sp-title-line { width: 100%; height: 1px; background: #e5e5e5; }
.sp-line       { width: 100%; height: 1px; background: #e5e5e5; }

/* 섹션 */
.sp-section {
  padding: 32px 0;
  animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
}

.sp-section:nth-child(2)  { animation-delay: 0.05s; }
.sp-section:nth-child(4)  { animation-delay: 0.1s;  }
.sp-section:nth-child(6)  { animation-delay: 0.15s; }
.sp-section:nth-child(8)  { animation-delay: 0.2s;  }
.sp-section:nth-child(10) { animation-delay: 0.25s; }
.sp-section:nth-child(12) { animation-delay: 0.3s;  }

.sp-section-inner {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.sp-sec-label {
  width: 130px;
  flex-shrink: 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: #111;
  padding-top: 4px;
  letter-spacing: 0.02em;
}

.sp-opt {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 400;
  color: #999;
  margin-left: 4px;
}

/* 프로필 */
.profile-row { display: flex; align-items: center; gap: 20px; flex: 1; }

.profile-circle {
  width: 72px; height: 72px;
  border-radius: 50%;
  border: 1.5px solid #ddd;
  background: #f8f8f8;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; flex-shrink: 0; cursor: pointer;
  transition: border-color 0.2s, transform 0.15s cubic-bezier(0.34,1.56,0.64,1);
}
.profile-circle:hover { border-color: #111; transform: scale(1.05); }
.profile-img   { width: 100%; height: 100%; object-fit: cover; }
.profile-plus  { font-size: 1.4rem; color: #bbb; font-weight: 300; }
.profile-hint  { font-size: 0.78rem; color: #888; margin-bottom: 10px; }

.sp-btn-sm {
  background: #fff;
  border: 1.5px solid #111;
  color: #111;
  padding: 8px 16px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s, transform 0.15s cubic-bezier(0.34,1.56,0.64,1);
}
.sp-btn-sm:hover  { background: #111; color: #fff; transform: scale(1.04); }
.sp-btn-sm:active { transform: scale(0.96); }

/* 계정 정보 필드 세로 배치 */
.account-fields {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 필드 */
.sp-field { flex: 1; margin-bottom: 14px; }
.sp-field:last-child { margin-bottom: 0; }

.sp-label {
  display: block;
  font-size: 0.82rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 7px;
}

.sp-req { color: #e53e3e; font-weight: 700; }

/* ★ 핵심: 인풋 + 버튼 가로 배치 */
.input-btn-wrap {
  display: flex !important;
  flex-direction: row !important;
  align-items: stretch !important;
  gap: 8px !important;
  width: 100%;
}

.flex-input {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  width: auto !important;
}

.inline-btn {
  flex-shrink: 0 !important;
  height: 46px !important;
  padding: 0 18px !important;
  background: #111 !important;
  border: none !important;
  color: #fff !important;
  font-size: 0.82rem !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  white-space: nowrap !important;
  transition: background 0.2s, transform 0.15s cubic-bezier(0.34,1.56,0.64,1) !important;
  border-radius: 0 !important;
}
.inline-btn:hover:not(:disabled)  { background: #333 !important; transform: scale(1.04) !important; }
.inline-btn:active                 { transform: scale(0.96) !important; }
.inline-btn:disabled               { opacity: 0.35 !important; cursor: default !important; }

.sp-input {
  width: 100% !important;
  height: 46px !important;
  background: #f8f8f8 !important;
  border: 1px solid #e0e0e0 !important;
  border-radius: 0 !important;
  color: #111 !important;
  padding: 0 14px !important;
  font-size: 0.9rem !important;
  font-weight: 400 !important;
  outline: none !important;
  transition: border-color 0.2s, background 0.2s !important;
  box-shadow: none !important;
  display: block !important;
}
.sp-input:focus {
  border-color: #111 !important;
  background: #fff !important;
}
.sp-input::placeholder { color: #aaa !important; font-size: 0.85rem; }
.sp-input[readonly]    { cursor: pointer; }
.sp-date { color: #555 !important; }

.is-ok  { border-color: #38a169 !important; }
.is-err { border-color: #e53e3e !important; }

.sp-hint { font-size: 0.78rem; margin-top: 5px; font-weight: 500; }
.sp-hint.ok  { color: #38a169; }
.sp-hint.err { color: #e53e3e; }

/* 그리드 */
.sp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; flex: 1; }

/* 스타일 태그 */
.style-tags { display: flex; flex-wrap: wrap; gap: 8px; flex: 1; }

.style-tag {
  padding: 9px 18px;
  background: #fff;
  border: 1.5px solid #ddd !important;
  color: #555;
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 0;
  transition: all 0.15s, transform 0.15s cubic-bezier(0.34,1.56,0.64,1);
}
.style-tag:hover  { border-color: #111 !important; color: #111; transform: scale(1.04); }
.style-tag:active { transform: scale(0.96); }
.style-tag.active { background: #111 !important; border-color: #111 !important; color: #fff; }

/* 약관 */
.terms-list { flex: 1; }

.term-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.15s;
}
.term-row:last-child { border-bottom: none; }
.term-row.term-all   { font-weight: 700; }
.term-row:hover      { background: #fafafa; }

.term-chk {
  width: 18px; height: 18px;
  border: 1.5px solid #ccc;
  border-radius: 3px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: all 0.15s cubic-bezier(0.34,1.56,0.64,1);
}
.term-chk.on { background: #111; border-color: #111; transform: scale(1.1); }
.term-chk.on::after {
  content: '';
  width: 9px; height: 5px;
  border-left: 2px solid #fff;
  border-bottom: 2px solid #fff;
  transform: rotate(-45deg) translateY(-1px);
  display: block;
}

.term-txt      { font-size: 0.88rem; color: #444; flex: 1; }
.term-txt.bold { font-weight: 700; color: #111; font-size: 0.9rem; }
.term-arr      { font-size: 1rem; color: #ccc; }

.badge-req {
  font-style: normal;
  font-size: 0.68rem;
  font-weight: 700;
  color: #fff;
  background: #111;
  padding: 1px 6px;
  margin-right: 6px;
}

.badge-opt {
  font-style: normal;
  font-size: 0.68rem;
  font-weight: 600;
  color: #888;
  border: 1px solid #ddd;
  padding: 1px 6px;
  margin-right: 6px;
}

/* 제출 */
.sp-submit-wrap {
  padding: 36px 0 0;
  animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.35s both;
}

.sp-error {
  font-size: 0.85rem;
  color: #e53e3e;
  text-align: center;
  margin-bottom: 14px;
  padding: 12px;
  background: rgba(229,62,62,0.05);
  border: 1px solid rgba(229,62,62,0.2);
  animation: shake 0.4s cubic-bezier(0.36,0.07,0.19,0.97);
}

.btn-submit {
  display: block;
  width: 100%;
  height: 54px;
  background: #111;
  color: #fff;
  border: none;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s cubic-bezier(0.34,1.56,0.64,1);
}
.btn-submit:hover  { background: #333; transform: scale(1.01); }
.btn-submit:active { transform: scale(0.99); }
.btn-submit:disabled { opacity: 0.4; cursor: default; transform: none; }

.to-login {
  text-align: center;
  margin-top: 18px;
  font-size: 0.85rem;
  color: #888;
}

.to-login-link {
  color: #111;
  font-weight: 700;
  text-decoration: none;
  margin-left: 4px;
  border-bottom: 1.5px solid currentColor;
  padding-bottom: 1px;
  transition: opacity 0.2s;
}
.to-login-link:hover { opacity: 0.6; }

/* 애니메이션 */
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-16px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes shake {
  0%,100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

/* 반응형 */
@media (max-width: 640px) {
  .sp-section-inner { flex-direction: column; gap: 12px; }
  .sp-sec-label     { width: auto; }
  .sp-grid          { grid-template-columns: 1fr; }
}
</style>