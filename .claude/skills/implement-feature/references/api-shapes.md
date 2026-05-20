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

interface Challenge {
  id: string                                          // UUID
  category: 'transport' | 'diet' | 'energy'
  title: string
  description: string
  difficulty: 1 | 2 | 3
  status: 'pending_acceptance' | 'active' | 'completed'
  created_at: string                                  // ISO 8601
  completed_at: string | null                         // ISO 8601
}

interface FeedItem {
  photo_id: string                                    // UUID
  challenge_id: string                               // UUID
  user_id: string                                    // UUID
  nickname: string | null
  profile_image_url: string | null
  title: string                                      // 챌린지 제목
  category: 'transport' | 'diet' | 'energy'
  photo_url: string
  like_count: number
  liked_by_me: boolean
  carbon_saved_gco2eq: number | null
  created_at: string                                 // ISO 8601
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
200:     { message: "Login successful"; onboarding_completed: boolean }  +  HttpOnly 쿠키 access_token 발급
401:     이메일 또는 비밀번호 오류
429:     로그인 5회 초과 실패 (일시 잠금)
422:     요청 형식 오류
→ 성공 시 onboarding_completed: true → /chat, false → /onboarding 이동

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

POST /api/users/onboarding
Body:    { transport_mode: TransportMode; diet_type: DietType; housing_type: HousingType }
201:     { transport_mode: TransportMode; diet_type: DietType; housing_type: HousingType }
400:     인증 필요
→ 온보딩 완료 시 호출. 성공 후 AppContext user.onboarding_completed = true 갱신 + /chat 이동
→ UI 선택값 → API 값 매핑 필요:
   transport_mode: 'public'→'transit', 'car'→'car', 'bike'→'bike', 'walk'→'walk'
   diet_type:      'vegan'→'vegan', 'vegetarian'→'vegetarian', 'balanced'→'flexitarian', 'meat'→'omnivore'
   housing_type:   'apartment'→'apartment', 'house'→'house', 'studio'→'studio', 'shared'→'dorm'
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
Body:    { message: string; model_id?: string }  // model_id: GET /api/chat/models 응답 items[]의 값을 그대로 전송, 변환 금지
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

GET /api/chat/models
응답:    { items: string[] }  // 'provider/model-id' 형식 ex) "openai/gpt-5.5-2026-04-23"
200:     조회 성공
400:     인증 필요
502:     RunyourAI 프로바이더 오류
→ useModels hook에서 사용, SWR 캐싱 적용 (#72)
→ items의 값을 selectedModel state에 그대로 저장 → POST /messages의 model_id로 변환 없이 전송
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

## 챌린지

```
GET /api/challenges/current
응답:    { challenge: Challenge | null }
200:     조회 성공
401:     미인증

POST /api/challenges/generate
Body:    없음
200/201: { challenge: Challenge; created: boolean }
         created=true → 새로 생성, false → 기존 진행 중 반환
401:     미인증
409:     토큰이 남아 있어 챌린지 생성 불가
429:     하루 챌린지 생성 횟수 초과 (최대 3회)
→ 토큰 소진 시 호출

POST /api/challenges/{id}/accept
Body:    없음
200:     { challenge: Challenge }  // status: 'active'
401:     미인증
404:     챌린지 없음 또는 본인 챌린지 아님
409:     pending_acceptance 상태 아님

POST /api/challenges/{id}/photo
Body:    FormData { file: File }  (form-data, 이미지 파일)
200:     {
           photo: { id: string; challenge_id: string; file_url: string; created_at: string }
           challenge: { id: string; status: 'completed'; completed_at: string }
           reward: { type: 'upload_reward'; reward_amount: number; tokens_remaining: number }
         }
400:     파일 형식 오류 / 파일 크기 초과
401:     미인증
404:     챌린지 없음 또는 본인 챌린지 아님
409:     active 상태 아님 또는 이미 사진 업로드됨
→ 업로드 성공 시 reward.tokens_remaining으로 AppContext 업데이트
```

---

## 인증 피드

```
GET /api/challenges/feed
Query:   { limit?: number; offset?: number }  // 기본값 limit=20, offset=0
200:     { items: FeedItem[]; total: number | null; limit: number; offset: number }
400:     query parameter 형식 오류
401:     미인증

DELETE /api/challenge-photos/{photo_id}
200:     { deleted: boolean; photo_id: string; deleted_at: string }
401:     미인증
404:     사진 없음 또는 본인 게시물 아님
409:     이미 삭제된 게시물
→ Optimistic UI: 목록에서 즉시 제거
```

---

## 좋아요

```
POST /api/challenge-photos/{photo_id}/like
Body:    없음
200:     {
           liked: boolean
           photo_id: string
           like_count: number
           reward_given: boolean           // 3개 단위 milestone 도달 시 true
           reward_amount: number           // 미달 시 0.0
           tokens_remaining: number | null // 보상 없으면 null
         }
400:     삭제된 사진 또는 좋아요 불가
401:     미인증
404:     사진 없음
409:     이미 좋아요 누름 또는 본인 사진
429:     신규 계정 제한 또는 일일 보상 한도 초과

GET /api/challenge-photos/{photo_id}/likes
Query:   { limit?: number; offset?: number }
200:     {
           items: Array<{ user_id: string; nickname: string | null; profile_image_url: string | null; liked_at: string }>
           total: number | null
           limit: number
           offset: number
         }
401:     미인증
404:     사진 없음 또는 삭제된 사진
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
