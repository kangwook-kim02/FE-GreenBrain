# GreenBrain 프론트엔드 역할 분배

> 기준: 디자인 프로토타입 (`DesignPrototype_GreenBrain`) 완료 시점
실제 구현 대상: Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui
> 

---

## 담당자 요약

| 담당자 | 담당 영역 |
| --- | --- |
| **김강욱** | 로그인 · 회원가입 · 채팅 · 탄소 토큰 UI · 공통 레이아웃(사이드 바) |
| **최정욱** | 챌린지 모달 · 챌린지 피드 · 온보딩· 프로필  |
| **미배정** | 공통 인프라  · 전역 상태 |

---

## 김강욱 — 로그인 / 회원가입 / 채팅 / 탄소 UI / 공통 레이아웃

### 1. 로그인 (`/login`)

- [ ]  이메일 · 비밀번호 폼 구현 (`react-hook-form`)
- [ ]  클라이언트 유효성 검사 (이메일 형식, 비밀번호 미입력 방지)
- [ ]  `POST /api/auth/login` 연동
    - 성공 → `/chat` 이동
    - 실패 → 폼 하단 인라인 에러 메시지 ("이메일 또는 비밀번호가 올바르지 않습니다")
- [ ]  로딩 상태: 버튼 비활성화 + 스피너

### 2. 회원가입 (`/signup`)

- [ ]  이메일 · 비밀번호 · 비밀번호 확인 폼 구현
- [ ]  클라이언트 유효성 검사
    - 이메일 형식
    - 비밀번호 최소 8자, 대소문자 + 숫자 혼합 (정규식)
    - 비밀번호 일치 여부
- [ ]  `POST /api/auth/signup` 연동
    - 성공 → `/onboarding` 이동
    - 실패 → 인라인 에러 ("이미 사용 중인 이메일입니다" 등)
- [ ]  로딩 상태: 버튼 비활성화 + 스피너

### 3. 채팅 (`/chat`)

### 3-1. 채팅 기본 기능

- [ ]  페이지 진입 시 토큰 조회: `GET /api/user/tokens`
- [ ]  메시지 전송: `POST /api/chat/message`
    - Body: `{ message: string }`
    - 응답: `{ reply, carbon_cost, remaining_tokens }`
- [ ]  전송 중 말풍선 로딩 애니메이션 (점 세 개)
- [ ]  ecologits 실패 시 탄소 정보 카드에 "탄소 계산 불가" 표시 (토큰 차감 없음)

### 3-2. 채팅 히스토리

- [ ]  사이드바 히스토리 목록 API 연동: `GET /api/chat/history`
- [ ]  히스토리 항목 클릭 시 해당 채팅 메시지 이력 복원
- [ ]  오늘 / 어제 / 이전 7일 그룹 표시 (현재 mock 데이터 → 실제 API로 교체)

### 3-3. 환영 화면

- [ ]  현재 mock 닉네임 `"환경지킴이"` → 실제 로그인 사용자 이름으로 교체
- [ ]  전역 Context에서 `user.nickname` 읽어 표시

### 4. 탄소 토큰 UI

- [ ]  `TokenBar` 공통 컴포넌트 분리 (현재 Chat.tsx 인라인 → 별도 파일)
- [ ]  토큰 잔여 비율에 따른 색상 전환 (50% 초과: 초록 / 20~50%: 앰버 / 20% 미만: 빨강)
- [ ]  API 응답의 `remaining_tokens` 값으로 실시간 동기화 (클라이언트 자체 계산 금지)
- [ ]  토큰 소진 시 입력창 비활성화 + 소진 안내 화면 전환
- [ ]  `CarbonCard` 컴포넌트 분리 (AI 메시지 하단 탄소 배출량 + 비유 텍스트)

### 5. 공통 레이아웃 / 사이드바

- [ ]  **사이드바 채팅 히스토리** — 현재 mock 데이터 → `GET /api/chat/history` 실제 연동
- [ ]  **사이드바 "새 채팅" 버튼** — 현재 `/chat` 이동 → 새 채팅 세션 생성 API 연동
- [ ]  **모바일 하단 탭 바** 활성 상태 로직 최종 검증 (현재 `useLocation` 기반, 실제 라우팅과 일치 확인)
- [ ]  **접근성 (a11y)** — 포커스 트랩, 키보드 내비게이션, `aria-label` 정비

---

## 최정욱 — 챌린지 / 챌린지 피드 / 프로필

### 1. 온보딩 (`/onboarding`)

- [ ]  3단계 스텝 UI (교통수단 → 식단 → 주거 형태) — 프로토타입 디자인 그대로 유지
- [ ]  선택 전 다음 버튼 비활성화 로직
- [ ]  `POST /api/user/onboarding` 연동
    - Body: `{ transportation, diet, housing }`
    - 성공 → `/chat` 이동
    - 실패 → 에러 토스트 표시

### 2. 챌린지 모달 (`ChallengeModal`)

> 현재 `/challenges` 독립 페이지 대신 Chat 화면 내 팝업으로 통합됨
> 
- [ ]  진입 시 챌린지 조회: `GET /api/challenges/current`
    - 진행 중 챌린지 있으면 해당 챌린지 표시 (새 챌린지 랜덤 표시 방지)
    - 일일 3개 상한 도달 시 "오늘의 챌린지를 모두 완료했습니다" 화면 분기
- [ ]  챌린지 수락: `POST /api/challenges/{id}/accept`
- [ ]  사진 업로드 (`POST /api/challenges/{id}/verify`)
    - 클라이언트 유효성: JPEG / PNG / WebP, 최대 10MB (alert 금지 → 인라인 에러)
    - 업로드 중 버튼 비활성화 + 스피너
    - 성공 시 모달 닫기 + 토큰 업데이트 (응답의 `remaining_tokens` 반영)

### 3. 챌린지 피드 (`/challenges/feed`)

### 3-1. 피드 목록

- [ ]  `GET /api/feed?page=1` 연동 (페이지네이션 또는 무한 스크롤)
- [ ]  로딩 중 스켈레톤 카드 3개 표시 (`SkeletonCard` 컴포넌트)
- [ ]  빈 상태: "아직 인증된 챌린지가 없습니다" + 챌린지 이동 버튼

### 3-2. 좋아요

- [ ]  `POST /api/feed/{item_id}/like` 연동
- [ ]  Optimistic UI 적용: 요청 즉시 +1 반영 → 실패 시 롤백
- [ ]  이미 좋아요한 항목: 버튼 비활성화 (초록 강조)
- [ ]  본인 업로드 항목: 버튼 비활성화 (회색), `isOwner` 서버 응답 기준으로 판단
- [ ]  좋아요 3개 달성 배너 표시 로직 (현재 `likes % 3 === 0` 조건 → API 기준으로 교체)

### 3-3. 게시물 삭제

- [ ]  삭제 버튼 클릭 시 확인 다이얼로그 표시 (현재 디자인만 → 로직 구현)
- [ ]  `DELETE /api/feed/{item_id}` 연동
- [ ]  성공 시 목록에서 즉시 제거 (Optimistic UI)

### 4. 프로필 (`/profile`)

- [ ]  닉네임 수정 API 연동: `PATCH /api/user/profile`
- [ ]  프로필 사진 업로드 API 연동: `POST /api/user/avatar`
    - 현재 카메라 아이콘 버튼 → 실제 파일 선택 + 미리보기 + 업로드
- [ ]  생활습관 수정 API 연동: `PATCH /api/user/onboarding`
    - 현재 로컬 state로만 변경됨 → 서버 반영
- [ ]  로그아웃 API 연동: `POST /api/auth/logout`
    - 성공 시 전역 Context 초기화 + `/login` 이동

---

## 미배정

> 아래 항목은 두 담당자 중 한 명이 추가로 맡거나 별도 인력이 필요합니다.
> 

### A. 공통 인프라

- [ ]  **전역 상태 관리 (React Context)** — `user`, `tokens` 초기화 및 API 동기화
    
    ```tsx
    interface AppState {
      user: { id: string; email: string; nickname: string; onboarding_complete: boolean } | null;
      tokens: { remaining: number; max: 150 };
    }
    ```
    
- [ ]  **라우트 가드** — 비로그인 → `/login` 리다이렉트, 온보딩 미완료 → `/onboarding` 리다이렉트
- [ ]  **API 에러 공통 처리 인터셉터**
    
    
    | HTTP 상태 | 처리 |
    | --- | --- |
    | 401 | 로그인 페이지 리다이렉트 |
    | 403 | 인라인 에러 메시지 |
    | 422 | 필드별 유효성 에러 표시 |
    | 500 | "일시적인 오류" 토스트 |
    | 네트워크 오류 | "인터넷 연결 확인" 토스트 |
- [ ]  **Toast 알림 시스템** — 전역 성공 / 에러 알림 컴포넌트 (`sonner` 또는 shadcn/ui Toast)
- [ ]  **Next.js 마이그레이션** — 현재 Vite + React → Next.js App Router 전환
    - `app/` 디렉토리 구조 설정
    - `<Image>` 컴포넌트로 이미지 최적화
    - `layout.tsx` + `page.tsx` 분리

### B. 추가 기능 (고도화 단계)

- [ ]  **이메일 인증** — 회원가입 후 인증 링크 발송 (Supabase Auth, MVP 이후)
- [ ]  **챌린지 난이도 표시** — 누적 완료 횟수에 따른 난이도 뱃지 표시
- [ ]  **주간 탄소 절감량 통계 화면** — 사용자별 누적 탄소 데이터 시각화
- [ ]  **푸시 알림 UI** — 좋아요 수신 알림 표시

---

## 공통 준수 사항

- JWT, 비밀번호, 사용자 ID를 `localStorage`에 저장하지 않는다.
- 토큰 수치를 클라이언트에서 자체 계산하지 않는다 — 항상 API 응답 기준.
- 모든 화면에서 **로딩 / 빈 상태 / 에러 상태** UI를 반드시 구현한다.
- 파일 업로드 유효성 오류는 `alert()` 대신 인라인 에러 메시지로 표시한다.
- 반응형 범위: 모바일 375px ~ 데스크탑 1280px 전 구간 대응.