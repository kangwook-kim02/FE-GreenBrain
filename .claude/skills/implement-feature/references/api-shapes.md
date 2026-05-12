# API Shape 정의

> 출처: PRD-front.md (GreenBrain)
> 모든 API 연동 시 이 파일의 shape을 기준으로 TypeScript 타입을 작성한다.

## 공통 타입

```typescript
interface Challenge {
  id: string;
  title: string;
  description: string;
  category: "교통" | "식단" | "에너지";
  icon: string;
}

interface FeedItem {
  id: string;
  userId: string;
  username: string;
  challengeTitle: string;
  challengeIcon: string;
  imageUrl: string;
  likes: number;
  likedByMe: boolean;
  isOwner: boolean;
  timestamp: string;
}

interface ChatHistoryGroup {
  label: "오늘" | "어제" | "이전 7일";
  items: { id: string; title: string }[];
}
```

---

## 인증

```
POST /api/auth/login
Body:    { email: string; password: string }
성공:    쿠키 Set-Cookie 헤더 (백엔드 처리) → /chat 이동
실패:    { error: string }  예: "이메일 또는 비밀번호가 올바르지 않습니다"

POST /api/auth/signup
Body:    { email: string; password: string }
성공:    쿠키 Set-Cookie → /onboarding 이동
실패:    { error: string }  예: "이미 사용 중인 이메일입니다"

POST /api/auth/logout
Body:    없음
성공:    204 No Content → Context 초기화 + /login 이동
```

## 온보딩

```
POST /api/user/onboarding
Body:    { transportation: string; diet: string; housing: string }
성공:    { user: { onboarding_complete: true } } → /chat 이동
실패:    { error: string } → 에러 토스트
```

## 채팅

```
GET /api/user/tokens
응답:    { remaining: number; max: 150 }

GET /api/chat/history
응답:    { groups: ChatHistoryGroup[] }

POST /api/chat/message
Body:    { message: string }
응답:    {
           reply: string;
           carbon_cost: number;         // gCO₂eq
           remaining_tokens: number;    // 항상 이 값으로 Context 업데이트
         }
ecologits 실패 시:
응답:    {
           reply: string;
           carbon_cost: null;           // null이면 "탄소 계산 불가" 표시
           remaining_tokens: number;    // 차감 없음
         }
```

## 챌린지

```
GET /api/challenges/current
응답:    {
           challenge: Challenge | null;  // null이면 새 챌린지 생성 가능
           daily_count: number;          // 3 이상이면 상한 도달
         }

POST /api/challenges/{id}/accept
응답:    { challenge: Challenge }

POST /api/challenges/{id}/verify
Body:    FormData { photo: File }       // JPEG/PNG/WebP, 최대 10MB
응답:    { remaining_tokens: number }   // 즉시 Context 업데이트
실패:    { error: string }
```

## 인증 피드

```
GET /api/feed?page=1
응답:    { items: FeedItem[]; has_next: boolean }

POST /api/feed/{item_id}/like
응답:    { likes: number; liked_by_me: boolean }
실패:    { error: string }  // 중복/본인/신규계정

DELETE /api/feed/{item_id}
성공:    204 No Content → 목록에서 즉시 제거 (Optimistic UI)
```

## 프로필

```
PATCH /api/user/profile
Body:    { nickname: string }
성공:    { user: { nickname: string } }

POST /api/user/avatar
Body:    FormData { avatar: File }
응답:    { avatar_url: string }

PATCH /api/user/onboarding
Body:    { transportation?: string; diet?: string; housing?: string }
성공:    200 OK

```

## 에러 공통 처리

| HTTP 상태 | 처리 |
|-----------|------|
| 401 | /login 리다이렉트 |
| 403 | 인라인 에러 메시지 |
| 422 | 필드별 에러 메시지 |
| 500 | "일시적인 오류가 발생했습니다" 토스트 |
| 네트워크 오류 | "인터넷 연결을 확인해주세요" 토스트 |
