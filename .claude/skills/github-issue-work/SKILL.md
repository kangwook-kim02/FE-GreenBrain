---
name: github-issue-work
description: GitHub 이슈를 기반으로 프론트엔드 작업을 실행하는 스킬. "issue #숫자", "이슈 #숫자", "#숫자 작업해줘", "#숫자 해줘", "깃허브 이슈 작업", "이슈 기반으로 작업" 등 이슈 번호가 포함된 모든 작업 요청 시 반드시 이 스킬을 사용한다.
---

## 전제 조건

- `gh auth status` — GitHub CLI 인증 확인
- `git status` — 커밋되지 않은 변경사항 없어야 함 (있으면 사용자에게 확인 후 진행)

## 워크플로우

### Phase 1: 이슈 조회

```bash
gh issue view {번호} --json title,body,labels,assignees,milestone,url
```

- 백엔드 전용 라벨 이슈 (`backend` 라벨만 있고 `frontend`/`design` 없음) → 거부 메시지 출력 후 중단
- 프론트엔드 라벨 없어도 UI/화면 관련 내용이면 진행

### Phase 2: 이슈 분석

이슈 본문을 읽고 아래를 파악한다:

| 항목 | 파악 방법 |
|------|----------|
| **작업 유형** | labels 또는 제목 패턴 — feature / bug / design / refactor |
| **브랜치 prefix** | feature→`feat`, bug→`fix`, design→`design`, refactor→`refactor` |
| **관련 파일** | 이슈 본문 + DesignPrototype_GreenBrain/src/ 탐색 |
| **API 연동 여부** | `.claude/skills/implement-feature/references/api-shapes.md` 확인 |

### Phase 3: 작업 계획 파일 생성

`docs/exec-plans/{YYYY-MM-DD}-issue-{번호}.md` 에 저장:

```markdown
# Issue #{번호}: {제목}

> {이슈 URL}
> Labels: {라벨 목록} | Milestone: {마일스톤}
> 생성일: {YYYY-MM-DD}

## 목표
{이슈 본문에서 추출한 핵심 목표}

## 관련 파일
- `{파일경로}` — {이유}

## 작업 분해
- [ ] {세부 작업 1}
- [ ] {세부 작업 2}

## 완료 기준
{이슈의 완료 기준 또는 분석으로 도출한 기준}
```

### Phase 4: 브랜치 생성

```bash
gh issue develop {번호} --checkout
```

`gh issue develop`은 GitHub에서 이슈와 브랜치를 자동 연결한다 — PR 생성 시 이슈가 사이드바에 표시됨.

실패 시 (remote 없거나 권한 문제) 수동 생성으로 fallback:
```bash
git checkout -b {prefix}/issue-{번호}
# 예: feat/issue-5, fix/issue-12, design/issue-8
```

### Phase 5: 작업 시작 코멘트

```bash
gh issue comment {번호} --body "🚀 작업 시작

브랜치: $(git branch --show-current)
작업 계획: docs/exec-plans/{날짜}-issue-{번호}.md"
```

### Phase 6: 작업 실행

작업 유형에 따라 기존 스킬과 연계한다:

| 유형 | 연계 |
|------|------|
| feature / refactor | `fe-orchestrator` 스킬 트리거 |
| bug | `fe-orchestrator` 스킬 트리거 (버그 수정) |
| design | Tailwind 클래스 수정, `pattern-guardian` 통과 확인 |

### Phase 7: 커밋

fe-orchestrator 완료 후 변경사항을 커밋한다.

```bash
git add {변경된 파일들}
git commit -m "{prefix}: {이슈 제목} (#번호)"
# 예: feat: Login 페이지 API 연동 (#5)
```

커밋 메시지 prefix 기준:
- feature → `feat`
- bug → `fix`
- design → `design`
- refactor → `refactor`

### Phase 8: PR 생성

```bash
git push -u origin $(git branch --show-current)
```

`.github/pull_request_template.md`를 읽어 PR body를 작성한 뒤:

```bash
gh pr create \
  --title "{prefix}: {이슈 제목} (#번호)" \
  --body "$(cat <<'EOF'
## 관련 이슈
closes #{번호}

## 변경 사항
{변경 내용 요약}

## 체크리스트
- [x] 로딩 / 에러 / 빈 상태 3종 구현
- [x] `alert()` 미사용 확인
- [x] Tailwind 클래스만 사용
- [x] API 응답 shape과 타입 일치 확인
- [x] 모바일 반응형 확인
- [x] `React.FC` 미사용 확인
- [x] 클라이언트 자체 토큰 계산 없음
EOF
)" \
  --base main
```

체크리스트 항목은 fe-qa 통과 여부 기준으로 체크/미체크를 결정한다.

### Phase 9: 완료 보고

사용자에게 보고:
- PR URL
- 변경 파일 목록
- fe-qa 결과 요약

이슈 close는 하지 않는다 — PR 머지 시 `closes #번호`로 자동 close.

## 참조 파일

- `.github/ISSUE_TEMPLATE/` — 코멘트 일관성 참고
- `.github/pull_request_template.md` — PR body 기준
- `docs/FRONTEND.md` — 컨벤션 적용
- `docs/DESIGN.md` — 디자인 규칙 적용

## 범위 밖

- 백엔드 전용 이슈 (`backend` 라벨, DB/API 서버 코드 변경 요구)
- 이슈 close 또는 라벨 수정
- `.github/ISSUE_TEMPLATE/` 파일 수정
- `main` 브랜치에 직접 push
