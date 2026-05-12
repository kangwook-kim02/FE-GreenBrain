---
name: github-issue-create
description: GitHub 이슈를 생성하는 스킬. "이슈 만들어줘", "이슈 생성", "issue 만들어", "버그 리포트", "이슈화 해줘", "이슈로 만들어", "PRD 기반으로 이슈", "이 파일 이슈로" 등 이슈 생성을 요청하는 모든 표현 시 반드시 이 스킬을 사용한다.
---

## 핵심 원칙

`.github/ISSUE_TEMPLATE/` 의 기존 템플릿을 반드시 따른다. 자체 포맷 생성 금지.

## 워크플로우

### Phase 1: 템플릿 파악

스킬 실행 시 가장 먼저 읽는다:

```
FE_GreenBrain/.github/ISSUE_TEMPLATE/feature.md
FE_GreenBrain/.github/ISSUE_TEMPLATE/bug.md
FE_GreenBrain/.github/ISSUE_TEMPLATE/design.md
```

### Phase 2: 템플릿 선택

사용자 설명을 분석해 적절한 템플릿을 선택한다:

| 사용자 표현 | 선택 템플릿 |
|-----------|-----------|
| 새 기능, 화면 구현, API 연동, 컴포넌트 추가 | `feature.md` |
| 버그, 오류, 안 됨, 깨짐, 동작 이상 | `bug.md` |
| UI 수정, 디자인 변경, 스타일, Figma | `design.md` |

모호한 경우 사용자에게 확인 후 진행.

### Phase 3: 이슈 내용 작성

- **단건 생성**: 사용자 설명을 분석해 템플릿 항목을 채운다.
- **코드 기반 생성**: "이 파일에서 이슈 만들어줘" → 파일을 읽고 문제점/개선점을 분석해 내용 작성.
- **배치 생성**: "PRD 기반으로 이슈 만들어줘" → PRD-front.md를 읽고 이슈 목록을 먼저 사용자에게 보여준 뒤 승인 후 생성.

### Phase 4: 이슈 생성

```bash
gh issue create \
  --title "{제목}" \
  --body "{템플릿 내용 채운 결과}" \
  --label "{적절한 라벨}"
```

라벨 기준:
- 기능 구현 → `frontend`
- 버그 → `bug, frontend`
- 디자인 → `design, frontend`
- 백엔드 관련 내용 포함 시 → `backend` 라벨 추가 (생성은 하되 백엔드 팀에 전달 안내)

### Phase 5: 결과 보고

생성된 이슈 URL과 번호를 사용자에게 알린다.

## 배치 생성 흐름

```
사용자: "PRD 기반으로 이슈 만들어줘"
→ PRD-front.md 읽기
→ 미구현 항목 파악
→ 이슈 목록 미리보기 출력:
   1. [feat] Login 페이지 API 연동 (feature)
   2. [feat] Chat 상태 처리 구현 (feature)
   ...
→ 사용자 승인 대기 ("전체 생성할까요? 선택하실 항목이 있으면 말씀해주세요.")
→ 승인된 이슈만 순차 생성
```

## 범위 밖

- `.github/ISSUE_TEMPLATE/` 파일 자체 수정 — 템플릿은 팀 합의 없이 변경 금지
- 이슈 삭제 또는 기존 이슈 편집
- 백엔드 전용 이슈 직접 처리 — label에 `backend` 표시 후 사용자에게 안내
