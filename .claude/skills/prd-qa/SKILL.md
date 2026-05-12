---
name: prd-qa
description: GreenBrain PRD 기반 QA 스킬. 구현된 코드가 PRD-front.md 요구사항을 충족하는지 교차 검증한다. API shape 불일치·상태 처리 누락·보안 정책 위반을 탐지한다. fe-qa가 사용한다.
---

## 검증 기준 파일

검증 시작 전 반드시 읽는다 (순서대로):
1. `C:\Users\ices1\web\GreenBrain\FE_GreenBrain\docs\PRD-front.md` — 화면별 요구사항
2. `C:\Users\ices1\web\GreenBrain\FE_GreenBrain\docs\role.md` — 담당자별 체크리스트 (작업 범위 확인용)
3. `C:\Users\ices1\web\GreenBrain\FE_GreenBrain\.claude\skills\implement-feature\references\api-shapes.md` — API shape 정의
4. `C:\Users\ices1\web\GreenBrain\FE_GreenBrain\.claude\skills\prd-qa\references\state-checklist.md` — 페이지별 상태 처리 체크리스트

## 검증 절차

1. `_workspace/{task}_fe-builder_changes.md`에서 수정된 파일 목록을 읽는다.
2. PRD-front.md에서 해당 파일(화면)의 요구사항 섹션을 찾는다.
3. state-checklist.md에서 해당 화면의 체크리스트를 확인한다.
4. 각 파일을 열어 아래 체크 항목을 수행한다.
5. 결과를 `_workspace/{task}_qa_result.md`에 기록한다.

## 체크 항목

### 1. 상태 처리 (3종 모두 필수)

state-checklist.md의 페이지별 기준을 따른다. 공통 원칙:

- **로딩 상태**: API 호출 시작부터 완료까지 버튼 비활성화(`disabled`) 또는 스켈레톤 카드(`animate-pulse`) 존재
- **에러 상태**: `alert()` 없이 인라인 에러 메시지 (`bg-red-50 border border-red-200 text-red-700`) 또는 필드 단위 에러 (`text-red-500 text-sm`) 존재
- **빈 상태**: 목록이 빈 경우 안내 문구 + CTA 버튼 존재 (목록 조회가 없는 페이지 제외)

### 2. API shape 정합성

api-shapes.md의 응답 shape과 컴포넌트 타입/필드명을 교차 비교한다.

| 확인 항목 | 방법 |
|----------|------|
| 응답 필드명 일치 | API shape의 `snake_case` vs 컴포넌트의 `camelCase` 매핑 확인 |
| 옵셔널 필드 처리 | `carbon_cost: null` 허용 여부 — `null` 체크 없이 수치 계산하면 이슈 |
| `remaining_tokens` 즉시 Context 업데이트 | API 응답 후 `updateRemainingTokens(data.remaining_tokens)` 호출 여부 |
| 챌린지 `daily_count >= 3` 처리 | 상한 도달 시 새 챌린지 생성 불가 UI 존재 여부 |

### 3. 보안

| 확인 항목 | 방법 |
|----------|------|
| `localStorage`에 JWT/비밀번호/userId 저장 없음 | `localStorage.setItem` 검색 |
| 토큰 클라이언트 자체 계산 없음 | `tokens -`, `remaining - ` 등 수식 검색 |
| 비밀번호 `console.log` 없음 | `console.log` + password 인접 여부 |

### 4. PRD 요구사항 준수

PRD-front.md의 해당 섹션을 읽고 명세된 동작이 구현됐는지 확인한다.

주요 검증 포인트:
- 성공 시 PRD에 명시된 경로로 이동 (`/chat`, `/onboarding` 등)
- 실패 응답 `{ error: string }` → 인라인 에러 표시
- 401 응답 → `/login` 리다이렉트 처리
- 500 응답 → "일시적인 오류가 발생했습니다" 토스트

## 출력 형식

`_workspace/{task}_qa_result.md`에 아래 형식으로 저장한다:

```markdown
# QA 결과

## 요약
- 상태: PASS / FAIL
- 이슈 수: N건 (차단: N, 권고: N)

## 체크리스트

| 항목 | 결과 | 비고 |
|------|------|------|
| 로딩 상태 | ✅ / ❌ | |
| 에러 상태 | ✅ / ❌ | |
| 빈 상태 | ✅ / ❌ | 해당 없음 가능 |
| API shape 일치 | ✅ / ❌ | |
| 보안 | ✅ / ❌ | |
| PRD 요구사항 | ✅ / ❌ | |

## 이슈 목록

### [차단] {파일경로}:{줄번호} — {이슈 제목}
**현상:** {구체적 설명}
**PRD 근거:** {PRD-front.md 섹션 + 인용}
**수정 방향:** {무엇을 어떻게}

### [권고] ...
```

## 작업 원칙

- 직접 파일을 수정하지 않는다.
- "코드가 존재하는가"가 아니라 **경계면을 교차 비교**한다.
- 이전 QA 결과가 있으면 (`_workspace/` 확인) 기존 이슈 해소 여부를 먼저 확인한다.
- 해당 없는 체크 항목은 "해당 없음"으로 명시 (생략하지 않음).
