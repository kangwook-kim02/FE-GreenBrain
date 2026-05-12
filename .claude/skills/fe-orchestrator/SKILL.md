---
name: fe-orchestrator
description: GreenBrain 프론트엔드 구현 워크플로우 오케스트레이터. "구현해줘", "연동해줘", "분리해줘", "만들어줘", "추가해줘", "수정해줘", "다시 해줘", "페이지 작업", "컴포넌트 작업", "API 연결", "Context 설정", "라우트 가드" 등 프론트엔드 코드 변경을 수반하는 모든 요청 시 이 스킬을 반드시 사용한다. fe-builder(구현) → pattern-guardian(패턴 검증) → fe-qa(PRD 검증) 파이프라인을 조율한다. 단순 질문·파일 읽기·분석 요청은 직접 응답 가능.
---

## 실행 모드: 순차 서브에이전트 파이프라인

fe-builder → pattern-guardian → fe-qa 순서로 Agent 도구를 사용해 순차 실행한다.
각 단계 산출물은 `_workspace/` 파일에 저장하여 다음 단계로 전달한다.

## Phase 0: 컨텍스트 확인

`C:\Users\ices1\web\GreenBrain\FE_GreenBrain\_workspace\` 디렉토리 존재 여부 확인.

- `_workspace/` 없음 → **초기 실행**
- `_workspace/` 있음 + 부분 수정 요청 → **부분 재실행**: 해당 단계(fe-builder만 등) 재호출
- `_workspace/` 있음 + 새 작업 → `_workspace/`를 `_workspace_prev/`로 이동 후 새 실행

## Phase 1: 작업 분석

1. 사용자 요청에서 작업 대상(파일 경로, 기능)을 파악한다.
2. `C:\Users\ices1\web\GreenBrain\FE_GreenBrain\docs\role.md`를 읽어 해당 기능의 체크리스트 항목을 확인한다.
3. `C:\Users\ices1\web\GreenBrain\FE_GreenBrain\docs\PRD-front.md`에서 해당 화면의 요구사항을 확인한다.
4. 프로토타입에서 대상 파일을 직접 읽어 현재 코드 구조·스타일을 파악한다.
   - 경로: `C:\Users\ices1\web\GreenBrain\DesignPrototype_GreenBrain\src\app\`
   - 대상 파일 탐색: `pages/{화면명}.tsx` 또는 `components/{컴포넌트명}.tsx`
   - 디자인 작업이면 인접 컴포넌트도 함께 읽어 스타일 일관성을 파악한다.
5. `_workspace/` 디렉토리를 생성한다.

## Phase 2: 구현 (fe-builder)

```
Agent(
  subagent_type: "general-purpose",
  model: "opus",
  prompt: """
    fe-builder 역할을 수행한다.
    에이전트 정의: C:\Users\ices1\web\GreenBrain\FE_GreenBrain\.claude\agents\fe-builder.md
    스킬: C:\Users\ices1\web\GreenBrain\FE_GreenBrain\.claude\skills\implement-feature\SKILL.md
    
    작업 요청: {사용자 요청}
    대상 파일: {파일 경로}
    프로토타입 루트: C:\Users\ices1\web\GreenBrain\DesignPrototype_GreenBrain
    API 스펙: C:\Users\ices1\web\GreenBrain\FE_GreenBrain\.claude\skills\implement-feature\references\api-shapes.md
    
    구현 전 대상 파일을 반드시 직접 읽어 현재 스타일·구조를 파악할 것.
    디자인 작업이면 인접 컴포넌트도 읽어 일관성을 맞출 것.
    완료 후 수정된 파일 목록을 _workspace/{task}_fe-builder_changes.md에 저장할 것.
  """
)
```

## Phase 3: 패턴 검증 (pattern-guardian)

fe-builder 완료 후 실행.

```
Agent(
  subagent_type: "Explore",
  model: "opus",
  prompt: """
    pattern-guardian 역할을 수행한다.
    에이전트 정의: C:\Users\ices1\web\GreenBrain\FE_GreenBrain\.claude\agents\pattern-guardian.md
    스킬: C:\Users\ices1\web\GreenBrain\FE_GreenBrain\.claude\skills\pattern-check\SKILL.md
    
    검토 대상: _workspace/{task}_fe-builder_changes.md 내 파일 목록
    
    완료 후 이슈 목록을 _workspace/{task}_pattern_issues.md에 저장할 것.
  """
)
```

CRITICAL 이슈 존재 시 → fe-builder를 다시 호출하여 수정 → pattern-guardian 재검토.
최대 2회 반복 후에도 CRITICAL 존재 시 사용자에게 에스컬레이션.

## Phase 4: PRD QA (fe-qa)

pattern-guardian CRITICAL 없음 확인 후 실행.

```
Agent(
  subagent_type: "Explore",
  model: "opus",
  prompt: """
    fe-qa 역할을 수행한다.
    에이전트 정의: C:\Users\ices1\web\GreenBrain\FE_GreenBrain\.claude\agents\fe-qa.md
    스킬: C:\Users\ices1\web\GreenBrain\FE_GreenBrain\.claude\skills\prd-qa\SKILL.md
    
    검증 대상: _workspace/{task}_fe-builder_changes.md 내 파일 목록
    
    완료 후 QA 결과를 _workspace/{task}_qa_result.md에 저장할 것.
  """
)
```

이슈 발견 시 → fe-builder 수정 → fe-qa 재검증.
최대 2회 반복 후에도 이슈 존재 시 사용자에게 에스컬레이션.

## Phase 5: 결과 보고

사용자에게 보고:
- 구현된 기능 요약
- 수정된 파일 목록 (경로)
- role.md에서 완료 처리된 체크리스트 항목
- 미해결 이슈 (있다면 이유 포함)

## 에러 핸들링

- 파일 경로를 찾지 못할 경우: 오케스트레이터가 직접 Glob/Grep으로 파일을 찾아 전달
- 에이전트 실패 시: 1회 재시도, 재실패 시 부분 결과와 함께 보고
- 같은 이슈 3회 반복 시: 사용자에게 에스컬레이션

## 테스트 시나리오

**정상 흐름 — "Login 페이지 API 연동해줘":**
1. role.md 확인: 김강욱 1. 로그인 항목
2. PRD-front.md 확인: 5.1 로그인 요구사항
3. fe-builder: Login.tsx에 API 연동 + 에러 처리 + 로딩 상태 구현
4. pattern-guardian: CRITICAL 없음 확인
5. fe-qa: 로딩/에러/빈 상태 3종 확인 → 통과
6. 보고: 수정 파일 + 체크리스트 완료 항목

**에러 흐름 — CRITICAL 패턴 위반:**
1. fe-builder: ChallengeModal.tsx 구현 중 alert() 사용
2. pattern-guardian: CRITICAL — alert() 발견
3. fe-builder: 인라인 에러 메시지로 수정
4. pattern-guardian: 재검토 통과
5. fe-qa: 통과 → 완료
