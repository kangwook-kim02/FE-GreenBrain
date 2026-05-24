> 백엔드 API 명세. 확정 명세 기준(docs/GreenBrain-API.md, 2026-05-19). 상세 타입은 `.claude/skills/implement-feature/references/api-shapes.md` 참조.

## 인증

| Method | Path | 설명 | 요청 타입 | 응답 타입 |
|--------|------|------|----------|----------|
| POST | `/api/auth/signup` | 회원가입 | `{ email, password }` | 201: `{ success, message, data: { id, email, onboarding_completed, created_at } }` |
| POST | `/api/auth/login` | 로그인 | `{ email, password }` | 200: `{ success, message, data: { onboarding_completed } }` + HttpOnly 쿠키 |
| POST | `/api/auth/logout` | 로그아웃 | 없음 | 200: `{ success, message, data: null }` |

## 유저

| Method | Path | 설명 | 요청 타입 | 응답 타입 |
|--------|------|------|----------|----------|
| GET | `/api/users/me` | 현재 사용자 조회 | 없음 | `{ success, message, data: UserMe }` |
| PATCH | `/api/users/me` | 기본 프로필 수정 | `multipart/form-data { nickname?, profile_image? }` | `{ success, message, data: { id, email, nickname, profile_image_url, updated_at } }` |
| GET | `/api/users/profile` | 생활습관 프로필 조회 | 없음 | `{ success, message, data: UserProfile & { updated_at } }` |
| PATCH | `/api/users/profile` | 생활습관 프로필 수정 | `{ transport_mode?, diet_type?, housing_type? }` | `{ success, message, data: UserProfile & { updated_at } }` |
| POST | `/api/users/onboarding` | 온보딩 생활습관 저장 | `{ transport_mode, diet_type, housing_type }` | 201: `{ success, message, data: { transport_mode, diet_type, housing_type, updated_at } }` |

## 채팅

| Method | Path | 설명 | 요청 타입 | 응답 타입 |
|--------|------|------|----------|----------|
| POST | `/api/chat/sessions` | 세션 생성 | 없음 | 201: `{ success, message, data: ChatSession }` |
| GET | `/api/chat/sessions` | 세션 목록 | `?limit&cursor` | `{ success, message, data: { items: ChatSession[], next_cursor } }` |
| PATCH | `/api/chat/sessions/{id}` | 세션 제목 수정 | `{ title? }` | `{ success, message, data: ChatSession }` |
| DELETE | `/api/chat/sessions/{id}` | 세션 삭제 | 없음 | `{ success, message, data: null }` |
| POST | `/api/chat/sessions/{id}/messages` | 메시지 전송 | `{ message, model_id? }` | `{ success, message, data: { response, carbon_gco2eq, tokens_remaining, exhausted, ... } }` |
| GET | `/api/chat/sessions/{id}/messages` | 메시지 목록 | `?limit&cursor` | `{ success, message, data: { items: ChatMessage[], next_cursor } }` |
| GET | `/api/chat/models` | 모델 목록 조회 | 없음 | `{ success, message, data: { items: string[] } }` |

## 토큰

| Method | Path | 설명 | 요청 타입 | 응답 타입 |
|--------|------|------|----------|----------|
| GET | `/api/tokens/today` | 오늘 토큰 상태 | 없음 | `{ success, message, data: TokenToday }` |

## 챌린지

| Method | Path | 설명 | 요청 타입 | 응답 타입 |
|--------|------|------|----------|----------|
| GET | `/api/challenges/current` | 현재 챌린지 조회 | 없음 | `{ success, message, data: { challenge: Challenge \| null } }` |
| POST | `/api/challenges/generate` | 챌린지 생성 | 없음 | 200/201: `{ success, message, data: { challenge: Challenge; created: boolean } }` |
| POST | `/api/challenges/{id}/accept` | 챌린지 수락 | 없음 | `{ success, message, data: { challenge: Challenge } }` |
| POST | `/api/challenges/{id}/photo` | 챌린지 인증 사진 업로드 | `FormData { file }` (필드명 'file') | `{ success, message, data: { photo, challenge, reward } }` |

## 인증 피드

| Method | Path | 설명 | 요청 타입 | 응답 타입 |
|--------|------|------|----------|----------|
| GET | `/api/challenges/feed` | 피드 목록 | `?limit&offset` | `{ success, message, data: { items: FeedItem[], total, limit, offset } }` |
| DELETE | `/api/challenge-photos/{photo_id}` | 피드 삭제 | 없음 | `{ deleted, photo_id, deleted_at }` |

## 좋아요

| Method | Path | 설명 | 요청 타입 | 응답 타입 |
|--------|------|------|----------|----------|
| POST | `/api/challenge-photos/{photo_id}/like` | 좋아요 | 없음 | `{ liked, photo_id, like_count, reward_given, reward_amount, tokens_remaining }` |
| GET | `/api/challenge-photos/{photo_id}/likes` | 좋아요 사용자 목록 | `?limit&offset` | `{ items, total, limit, offset }` |

## 공통 에러 처리

| HTTP 상태 | 처리 |
|-----------|------|
| 401 | `/login` 리다이렉트 |
| 403 | 인라인 에러 메시지 |
| 422 | 필드별 에러 메시지 |
| 429 | 로그인 횟수 초과 인라인 메시지 |
| 500/502 | "일시적인 오류가 발생했습니다" 토스트 |
| 네트워크 오류 | "인터넷 연결을 확인해주세요" 토스트 |
