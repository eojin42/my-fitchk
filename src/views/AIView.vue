<template>
  <div class="ai-page">
    <div class="ai-wrap">

      <!-- 헤더 -->
      <div class="ai-header">
        <div class="ai-header-inner">
          <div class="ai-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/>
              <path d="M12 8v4l3 3"/>
            </svg>
            FitChk AI
          </div>
          <button class="btn-clear" @click="clearChat" v-if="messages.length > 0">
            대화 초기화
          </button>
        </div>
      </div>

      <!-- 채팅 영역 -->
      <div class="chat-area" ref="chatArea">

        <!-- 초기 화면 -->
        <div class="ai-intro" v-if="messages.length === 0">
          <div class="intro-icon">✨</div>
          <h2 class="intro-title">무엇을 도와드릴까요?</h2>
          <p class="intro-desc">패션 정보, 코디 추천, 쇼핑 도우미까지<br>뭐든 물어보세요!</p>

          <!-- 빠른 시작 버튼 -->
          <div class="quick-btns">
            <button
              v-for="q in quickQuestions"
              :key="q.label"
              class="quick-btn"
              @click="sendQuick(q.text)"
            >
              <span class="quick-icon">{{ q.icon }}</span>
              <span class="quick-label">{{ q.label }}</span>
            </button>
          </div>
        </div>

        <!-- 메시지 목록 -->
        <div class="message-list" v-else>
          <div
            v-for="(msg, i) in messages"
            :key="i"
            class="message-wrap"
            :class="msg.role"
          >
            <!-- AI 아바타 -->
            <div class="msg-avatar" v-if="msg.role === 'assistant'">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/>
              </svg>
            </div>

            <div class="message-bubble" :class="msg.role">
              <!-- 스트리밍 중 로딩 -->
              <div class="typing-dots" v-if="msg.loading">
                <span></span><span></span><span></span>
              </div>
              <div class="msg-text" v-else v-html="formatMsg(msg.content)"></div>
            </div>
          </div>
        </div>

      </div>

      <!-- 입력창 -->
      <div class="chat-input-wrap">
        <!-- 모드 선택 -->
        <div class="mode-tabs">
          <button
            v-for="mode in modes"
            :key="mode.key"
            class="mode-tab"
            :class="{ active: currentMode === mode.key }"
            @click="currentMode = mode.key"
          >
            {{ mode.icon }} {{ mode.label }}
          </button>
        </div>

        <div class="input-row">
          <textarea
            class="chat-input"
            v-model="inputText"
            :placeholder="currentModeInfo.placeholder"
            rows="1"
            @keydown.enter.exact.prevent="sendMessage"
            @keydown.shift.enter="() => {}"
            @input="autoResize"
            ref="inputRef"
          ></textarea>
          <button
            class="btn-send"
            @click="sendMessage"
            :disabled="!inputText.trim() || loading"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 5v14M5 12l7-7 7 7"/>
            </svg>
          </button>
        </div>
        <p class="input-hint">Enter로 전송 · Shift+Enter로 줄바꿈</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

const chatArea  = ref(null)
const inputRef  = ref(null)
const inputText = ref('')
const loading   = ref(false)
const messages  = ref([])
const currentMode = ref('codi')

const modes = [
  { key: 'codi',     icon: '👗', label: '코디 추천',   placeholder: '예) 30대 직장인 여성 봄 출근룩 추천해줘' },
  { key: 'shopping', icon: '🛍', label: '쇼핑 도우미', placeholder: '예) 10만원대 오버핏 코치자켓 추천해줘' },
  { key: 'info',     icon: '🔍', label: '옷 정보',     placeholder: '예) 고어텍스랑 일반 아우터 차이 뭐야?' },
]

const currentModeInfo = computed(() =>
  modes.find(m => m.key === currentMode.value)
)

const quickQuestions = [
  { icon: '👗', label: '오늘 뭐 입지?',      text: '오늘 봄날씨에 어울리는 캐주얼 코디 추천해줘' },
  { icon: '🛍', label: '예산별 추천',        text: '5만원 이하로 살 수 있는 스트릿 스타일 아이템 추천해줘' },
  { icon: '💡', label: '스타일 분석',        text: '미니멀 스타일이 뭔지 설명해주고 핵심 아이템 알려줘' },
  { icon: '🧥', label: '소재 정보',          text: '겨울 패딩 소재별 장단점 알려줘' },
]

function getSystemPrompt() {
  const modePrompts = {
    codi:     '당신은 패션 전문가입니다. 사용자의 체형, 나이, TPO에 맞는 코디를 구체적으로 추천해주세요. 아이템명, 색상, 브랜드까지 구체적으로 제안하고 스타일링 팁도 함께 알려주세요.',
    shopping: '당신은 패션 쇼핑 전문가입니다. 예산과 취향에 맞는 구체적인 아이템을 추천해주세요. 브랜드명, 예상 가격대, 구매처 정보도 함께 알려주세요.',
    info:     '당신은 패션 정보 전문가입니다. 소재, 브랜드, 스타일 트렌드 등 패션에 관한 정보를 쉽고 친절하게 설명해주세요.',
  }
  return modePrompts[currentMode.value]
}

async function sendMessage() {
  if (!inputText.value.trim() || loading.value) return

  const userText = inputText.value.trim()
  inputText.value = ''
  autoResize()

  // 유저 메시지 추가
  messages.value.push({ role: 'user', content: userText })

  // AI 로딩 메시지 추가
  messages.value.push({ role: 'assistant', content: '', loading: true })
  loading.value = true

  await scrollToBottom()

  try {
    // Anthropic API 호출
    const history = messages.value
      .filter(m => !m.loading)
      .slice(0, -1)  // 마지막 로딩 메시지 제외
      .map(m => ({ role: m.role, content: m.content }))

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: getSystemPrompt(),
        messages: [
          ...history,
          { role: 'user', content: userText }
        ]
      })
    })

    const data = await response.json()
    const aiText = data.content?.[0]?.text || '죄송해요, 답변을 가져오지 못했어요.'

    // 로딩 메시지 → 실제 답변으로 교체
    const lastIdx = messages.value.length - 1
    messages.value[lastIdx] = { role: 'assistant', content: aiText, loading: false }

  } catch (e) {
    const lastIdx = messages.value.length - 1
    messages.value[lastIdx] = {
      role: 'assistant',
      content: '일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
      loading: false
    }
  } finally {
    loading.value = false
    await scrollToBottom()
  }
}

function sendQuick(text) {
  inputText.value = text
  sendMessage()
}

function clearChat() {
  messages.value = []
}

async function scrollToBottom() {
  await nextTick()
  if (chatArea.value) {
    chatArea.value.scrollTop = chatArea.value.scrollHeight
  }
}

function autoResize() {
  const el = inputRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 120) + 'px'
}

// 메시지 줄바꿈 처리
function formatMsg(text) {
  return text.replace(/\n/g, '<br>')
}
</script>

<style scoped>
.ai-page {
  min-height: 100vh;
  background: var(--fc-bg);
  display: flex;
  flex-direction: column;
}

.ai-wrap {
  max-width: 760px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 72px);
}

/* 헤더 */
.ai-header {
  padding: 16px 20px;
  background: var(--fc-surface);
  border-bottom: 1px solid var(--fc-line);
  flex-shrink: 0;
}

.ai-header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ai-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  font-weight: 700;
  color: var(--fc-text);
  letter-spacing: -0.02em;
}

.btn-clear {
  font-size: 0.78rem;
  color: var(--fc-text-muted);
  background: none;
  border: 1px solid var(--fc-line);
  border-radius: 999px;
  padding: 5px 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-clear:hover { border-color: var(--fc-text); color: var(--fc-text); }

/* 채팅 영역 */
.chat-area {
  flex: 1;
  overflow-y: auto;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
}

/* 인트로 */
.ai-intro {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 0;
  animation: fadeUp 0.5s ease both;
}

.intro-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.intro-title {
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: var(--fc-text);
  margin-bottom: 8px;
}

.intro-desc {
  font-size: 0.9rem;
  color: var(--fc-text-muted);
  line-height: 1.7;
  margin-bottom: 32px;
}

.quick-btns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
  max-width: 480px;
}

.quick-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px;
  background: var(--fc-surface);
  border: 1.5px solid var(--fc-line) !important;
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}
.quick-btn:hover { border-color: var(--fc-text) !important; transform: translateY(-1px); }

.quick-icon { font-size: 1.1rem; flex-shrink: 0; }
.quick-label { font-size: 0.88rem; font-weight: 600; color: var(--fc-text); }

/* 메시지 */
.message-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-wrap {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  animation: fadeUp 0.3s ease both;
}

.message-wrap.user {
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: var(--fc-black);
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.message-bubble {
  max-width: 72%;
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 0.92rem;
  line-height: 1.7;
}

.message-bubble.user {
  background: var(--fc-black);
  color: #fff;
  border-radius: 16px 4px 16px 16px;
}

.message-bubble.assistant {
  background: var(--fc-surface);
  color: var(--fc-text);
  border: 1px solid var(--fc-line);
  border-radius: 4px 16px 16px 16px;
}

/* 타이핑 애니메이션 */
.typing-dots {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 4px 0;
}

.typing-dots span {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--fc-text-muted);
  animation: typingBounce 1.2s ease infinite;
}
.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typingBounce {
  0%,60%,100% { transform: translateY(0); }
  30%         { transform: translateY(-6px); }
}

/* 입력창 */
.chat-input-wrap {
  padding: 12px 20px 20px;
  background: var(--fc-surface);
  border-top: 1px solid var(--fc-line);
  flex-shrink: 0;
}

/* 모드 탭 */
.mode-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
  overflow-x: auto;
  scrollbar-width: none;
}
.mode-tabs::-webkit-scrollbar { display: none; }

.mode-tab {
  flex-shrink: 0;
  height: 32px;
  padding: 0 14px;
  background: var(--fc-bg);
  border: 1.5px solid var(--fc-line) !important;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--fc-text-muted);
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.mode-tab:hover  { border-color: var(--fc-text) !important; color: var(--fc-text); }
.mode-tab.active { background: var(--fc-text) !important; border-color: var(--fc-text) !important; color: #fff; }

.input-row {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.chat-input {
  flex: 1 !important;
  min-width: 0 !important;
  background: var(--fc-bg) !important;
  border: 1.5px solid var(--fc-line) !important;
  border-radius: 12px !important;
  color: var(--fc-text) !important;
  padding: 12px 16px !important;
  font-size: 0.92rem !important;
  line-height: 1.5 !important;
  resize: none !important;
  outline: none !important;
  transition: border-color 0.2s !important;
  overflow: hidden !important;
  box-shadow: none !important;
  min-height: 46px !important;
  max-height: 120px !important;
  height: 46px !important;
}
.chat-input:focus {
  border-color: var(--fc-text) !important;
  background: var(--fc-surface) !important;
}
.chat-input::placeholder { color: var(--fc-text-muted) !important; }

.btn-send {
  width: 46px; height: 46px;
  background: var(--fc-black);
  border: none;
  border-radius: 12px;
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s;
}
.btn-send:hover    { opacity: 0.82; transform: translateY(-1px); }
.btn-send:active   { transform: scale(0.95); }
.btn-send:disabled { opacity: 0.35; cursor: default; transform: none; }

.input-hint {
  font-size: 0.72rem;
  color: var(--fc-text-muted);
  margin-top: 6px;
  text-align: right;
}

/* 애니메이션 */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* 반응형 */
@media (max-width: 640px) {
  .quick-btns { grid-template-columns: 1fr; }
  .message-bubble { max-width: 88%; }
}
</style>