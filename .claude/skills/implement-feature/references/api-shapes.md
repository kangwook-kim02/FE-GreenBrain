# API Shape 정의

> 출처: docs/GreenBrain-API.md (확정 명세 2026-05-15)
> 모든 API 연동 시 이 파일의 shape을 기준으로 TypeScript 타입을 작성한다.

---

## 공통 타입

```typescript
// GET /api/users/me 응답
interface UserMe {
  id: string                        // UUID
  email: string
  nickname: string | null
  profile_image_url: string | null
  onboarding_completed: boolean
  profile: UserProfile | null       // 온보딩 미완료 시 null
  today_tokens: {
    date: string                    // YYYY-MM-DD
    tokens_remaining: number        // gCO2eq
  }
}

interface UserProfile {
  transport_mode: 'car' | 'transit' | 'walk' | 'bike' | 'mixed'
  diet_type: 'omnivore' | 'vegetarian' | 'vegan' | 'flexitarian'
  housing_type: 'apartment' | 'house' | 'studio' | 'dorm' | 'other'
}

interface ChatSession {
  id: string        // UUID
  title: string | null
  created_at: string  // ISO 8601
  updated_at: string  // ISO 8601
}

interface ChatMessage {
  id: string        // UUID
  session_id: string
  role: 'user' | 'assistant'
  content: string
  carbon_gco2eq: number | null
  created_at: string  // ISO 8601
}

interface TokenToday {
  date: string              // YYYY-MM-DD (KST)
  tokens_remaining: number  // gCO2eq, 0 이상 150 이하
  upload_reward_given: number
  like_reward_given: number // 최대 60
  total_reward_given: number
  challenge_count: number   // 최대 3
  updated_at: string        // ISO 8601
}

// 챌린지·피드 타입 — API 명세 확정 전 placeholder
interface Challenge {
  id: string
  title: string
  description: string
  category: '교통' | '식단' | '에너지'
  icon: string
}

interface FeedItem {
  id: string
  userId: string
  username: string
  challengeTitle: string
  imageUrl: string
  likes: number
  likedByMe: boolean
  isOwner: boolean
  timestamp: string
}
```

---

## 인증

```
POST /api/auth/signup
Body:    { email: string; password: string }
201:     { id: string; email: string; onboarding_completed: false; created_at: string }
400:     이미 가입된 이메일
422:     요청 형식 오류
→ 성공 시 /onboarding 이동

POST /api/auth/login
Body:    { email: string; password: string }
200:     { message: "Login successful" }  +  HttpOnly 쿠키 access_token 발급
401:     이메일 또는 비밀번호 오류
429:     로그인 5회 초과 실패 (일시 잠금)
422:     요청 형식 오류
→ 성공 시 /chat 이동

POST /api/auth/logout
Body:    없음
200:     { message: "Logout successful" }  +  access_token 쿠키 만료 처리
→ Context 초기화 + /login 이동
```

---

## 유저

```
GET /api/users/me
응답:    UserMe
401:     인증되지 않은 사용자
→ AppContext user, tokens 초기화에 사용

PATCH /api/users/me
Body:    { nickname?: string; profile_image_url?: string }
200:     { id, email, nickname, profile_image_url, updated_at }
401:     인증되지 않은 사용자
422:     요청 형식 오류

GET /api/users/profile
응답:    UserProfile & { updated_at: string }
401:     인증되지 않은 사용자
404:     생활습관 프로필 없음

PATCH /api/users/profile
Body:    { transport_mode?: string; diet_type?: string; housing_type?: string }
200:     UserProfile & { updated_at: string }
401:     인증되지 않은 사용자
404:     생활습관 프로필 없음
422:     요청 형식 오류
```

---

## 채팅

```
POST /api/chat/sessions
Body:    없음
201:     ChatSession
401:     Authentication required
→ 새 채팅 시작 시 먼저 세션 생성, 반환된 id로 메시지 전송

GET /api/chat/sessions
Query:   { limit?: number; cursor?: string }
200:     { items: ChatSession[]; next_cursor: string | null }
401:     Authentication required
→ ChatSidebar 히스토리 목록에 사용

PATCH /api/chat/sessions/{session_id}
Body:    { title?: string | null }
200:     ChatSession
401:     Authentication required
404:     Chat session not found

DELETE /api/chat/sessions/{session_id}
204:     No Content
401:     Authentication required
404:     Chat session not found

POST /api/chat/sessions/{session_id}/messages
Body:    { message: string }
200:     {
           message_id: string
           response_message_id: string
           response: string              // AI 응답 텍스트
           carbon_gco2eq: number | null  // null이면 "탄소 계산 불가" 표시
           tokens_remaining: number      // 항상 이 값으로 AppContext tokens 업데이트
           exhausted: boolean            // true면 토큰 소진 화면 전환
           session_title: string | null  // 자동 생성 세션 제목
         }
401:     Authentication required
403:     Daily chat tokens are exhausted
404:     Chat session not found
502:     AI provider failed

GET /api/chat/sessions/{session_id}/messages
Query:   { limit?: number; cursor?: string }
200:     { items: ChatMessage[]; next_cursor: string | null }
401:     Authentication required
404:     Chat session not found
```

---

## 토큰

```
GET /api/tokens/today
응답:    TokenToday
401:     인증되지 않은 사용자
→ 토큰 바 표시, 챌린지 일일 상한(challenge_count >= 3) 판단에 사용
```

---

## 챌린지 (API 명세 미확정 — placeholder)

```
GET /api/challenges/current
응답:    { challenge: Challenge | null; daily_count: number }

POST /api/challenges/{id}/accept
응답:    { challenge: Challenge }

POST /api/challenges/{id}/verify
Body:    FormData { photo: File }  (JPEG/PNG/WebP, 최대 10MB)
응답:    { tokens_remaining: number }
실패:    { error: string }
```

---

## 인증 피드 (API 명세 미확정 — placeholder)

```
GET /api/feed
Query:   { page?: number }
응답:    { items: FeedItem[]; has_next: boolean }

POST /api/feed/{item_id}/like
응답:    { likes: number; liked_by_me: boolean }
실패:    { error: string }

DELETE /api/feed/{item_id}
204:     No Content
→ Optimistic UI: 목록에서 즉시 제거
```

---

## 에러 공통 처리

| HTTP 상태 | 처리 |
|-----------|------|
| 401 | `/login` 리다이렉트 |
| 403 | 인라인 에러 메시지 (토큰 소진 등) |
| 422 | 필드별 에러 메시지 |
| 429 | "로그인 시도 횟수를 초과했습니다" 인라인 메시지 |
| 500/502 | "일시적인 오류가 발생했습니다" 토스트 |
| 네트워크 오류 | "인터넷 연결을 확인해주세요" 토스트 |
