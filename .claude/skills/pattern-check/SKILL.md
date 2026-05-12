---
name: pattern-check
description: GreenBrain Figma Make 패턴 검증 스킬. 구현된 코드가 figma-patterns.md 기준 패턴을 준수하는지 검토하고 이슈를 CRITICAL/WARNING/INFO로 분류한다. pattern-guardian이 사용한다.
---

## 검증 기준 파일

검증 시작 전 반드시 읽는다:
- `C:\Users\ices1\web\GreenBrain\FE_GreenBrain\.claude\skills\implement-feature\references\figma-patterns.md`

## 검증 절차

1. `_workspace/{task}_fe-builder_changes.md`에서 수정된 파일 목록을 읽는다.
2. 각 파일을 열어 아래 체크리스트를 항목별로 확인한다.
3. 이슈를 CRITICAL / WARNING / INFO로 분류하여 `_workspace/{task}_pattern_issues.md`에 기록한다.

## CRITICAL — 즉시 수정 필요

CRITICAL 이슈가 하나라도 있으면 오케스트레이터가 fe-builder에게 수정을 요청한다.

| 패턴 위반 | 확인 방법 |
|----------|----------|
| `alert()` / `confirm()` 사용 | 파일에서 `alert(` 검색 |
| `localStorage.setItem/getItem` 사용 | `localStorage.` 검색 |
| `style={{ color:`, `style={{ padding:` 등 Tailwind로 대체 가능한 inline style | `style=\{\{` 검색 후 동적 계산 여부 판단 |
| `React.FC<` 또는 `const X: React.FC` | `React.FC` 검색 |
| `export const ComponentName = () =>` | `export const.*= \(\) =>` 검색 |
| 클라이언트 자체 토큰 계산 (`tokens - carbonCost`, `tokens + n`) | `tokens -`, `tokens +` 검색 |
| 신규 아이콘에 lucide-react import (Trash2 외) | `from "lucide-react"` 검색 후 `Trash2` 외 다른 이름 확인 |

## WARNING — 가능하면 수정

WARNING은 오케스트레이터가 fe-builder에게 권고하지만, 수정 여부는 재량이다.

| 패턴 이탈 | 확인 기준 |
|----------|----------|
| 조건부 className에 `cn(...)` 없이 복잡한 삼항 중첩 (3단 이상) | 가독성 판단 |
| `@apply` 남용 (Tailwind로 직접 표현 가능한데 @apply 사용) | `.css` 파일 확인 |
| 버튼에 `disabled` 속성은 있으나 `disabled:bg-gray-300 disabled:cursor-not-allowed` 클래스 누락 | disabled 버튼 className 확인 |
| 에러 상자 색상이 color system 기준과 다름 (`bg-red-50 border-red-200 text-red-700` 이탈) | error div className 확인 |

## INFO — 참고용

INFO는 보고서에 기록만 하고 수정을 요구하지 않는다.

| 항목 | 기준 |
|------|------|
| 아이콘 크기가 용도별 기준(`w-5 h-5` 기본 등)과 다름 | figma-patterns.md §8 참조 |
| `max-w` 기준 이탈 (채팅/피드 `max-w-4xl`, 프로필 `max-w-2xl`) | 페이지별 확인 |
| label의 `htmlFor` 누락 | form input 확인 |

## 출력 형식

`_workspace/{task}_pattern_issues.md`에 아래 형식으로 저장한다:

```markdown
# 패턴 검증 결과

## 요약
- CRITICAL: N건
- WARNING: N건
- INFO: N건

## CRITICAL

### 1. {파일경로}:{줄번호} — {위반 패턴}
**코드:**
```tsx
{위반 코드 스니펫}
```
**수정 방향:** {무엇으로 바꿔야 하는지}

## WARNING
...

## INFO
...

## 통과 항목
- 위반 없이 통과한 CRITICAL 항목 목록
```

## 작업 원칙

- 직접 파일을 수정하지 않는다.
- 이슈 없음도 명시한다 ("CRITICAL 없음 — 통과").
- 줄 번호를 반드시 포함한다.
