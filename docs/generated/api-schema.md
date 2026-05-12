> 백엔드 API 명세. 현재 코드에서 추출된 API 호출 목록. 상세 타입은 `.claude/skills/implement-feature/references/api-shapes.md` 참조.

## 인증

| Method | Path | 설명 | 요청 타입 | 응답 타입 |
|--------|------|------|----------|----------|
| POST | `/api/auth/login` | 로그인 | `{ email, password }` | 쿠키 / `{ error }` |
| POST | `/api/auth/signup` | 회원가입 | `{ email, password }` | 쿠키 / `{ error }` |
| POST | `/api/auth/logout` | 로그아웃 | 없음 | 204 |

## 온보딩

| Method | Path | 설명 | 요청 타입 | 응답 타입 |
|--------|------|------|----------|----------|
| POST | `/api/user/onboarding` | 온보딩 저장 | `{ transportation, diet, housing }` | `{ user }` / `{ error }` |

## 채팅

| Method | Path | 설명 | 요청 타입 | 응답 타입 |
|--------|------|------|----------|----------|
| GET | `/api/user/tokens` | 토큰 조회 | 없음 | `{ remaining, max }` |
| GET | `/api/chat/history` | 채팅 히스토리 | 없음 | `{ groups: ChatHistoryGroup[] }` |
| POST | `/api/chat/message` | 메시지 전송 | `{ message }` | `{ reply, carbon_cost, remaining_tokens }` |

## 챌린지

| Method | Path | 설명 | 요청 타입 | 응답 타입 |
|--------|------|------|----------|----------|
| GET | `/api/challenges/current` | 현재 챌린지 조회 | 없음 | `{ challenge, daily_count }` |
| POST | `/api/challenges/{id}/accept` | 챌린지 수락 | 없음 | `{ challenge }` |
| POST | `/api/challenges/{id}/verify` | 챌린지 인증 | `FormData { photo }` | `{ remaining_tokens }` / `{ error }` |

## 인증 피드

| Method | Path | 설명 | 요청 타입 | 응답 타입 |
|--------|------|------|----------|----------|
| GET | `/api/feed` | 피드 목록 | `?page=1` | `{ items: FeedItem[], has_next }` |
| POST | `/api/feed/{item_id}/like` | 좋아요 | 없음 | `{ likes, liked_by_me }` / `{ error }` |
| DELETE | `/api/feed/{item_id}` | 피드 삭제 | 없음 | 204 |

## 프로필

| Method | Path | 설명 | 요청 타입 | 응답 타입 |
|--------|------|------|----------|----------|
| PATCH | `/api/user/profile` | 닉네임 수정 | `{ nickname }` | `{ user }` |
| POST | `/api/user/avatar` | 아바타 업로드 | `FormData { avatar }` | `{ avatar_url }` |
| PATCH | `/api/user/onboarding` | 생활습관 수정 | `{ transportation?, diet?, housing? }` | 200 |

## 공통 에러 처리

| HTTP 상태 | 처리 |
|-----------|------|
| 401 | `/login` 리다이렉트 |
| 403 | 인라인 에러 메시지 |
| 422 | 필드별 에러 메시지 |
| 500 | "일시적인 오류가 발생했습니다" 토스트 |
| 네트워크 오류 | "인터넷 연결을 확인해주세요" 토스트 |
