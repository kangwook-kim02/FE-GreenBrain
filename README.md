# GreenBrain 프론트엔드

AI 탄소 인식 챌린지 플랫폼의 프론트엔드 작업 공간.
Figma Make/Stitch로 생성된 프로토타입을 기반으로 API 연동·상태 처리·디자인 작업을 진행한다.

---

## 레포 구조

이 폴더(`FE_GreenBrain/`)는 Claude Code 하네스와 문서를 담는다.
실제 소스 코드는 상위 레포의 `../DesignPrototype_GreenBrain/`에 있다.

```
GreenBrain/
├── FE_GreenBrain/               ← 이 폴더 (Claude Code는 여기서 열기)
│   ├── .claude/                 # 에이전트 · 스킬 정의
│   ├── .github/                 # 이슈 · PR 템플릿
│   ├── docs/                    # 기획서 · 컨벤션 · 작업 계획
│   ├── CLAUDE.md                # Claude Code 설정 · 트리거 규칙
│   └── README.md                # 이 파일
│
└── DesignPrototype_GreenBrain/  ← 실제 소스 코드
    ├── src/app/pages/           # 페이지 컴포넌트 (7개)
    ├── src/app/components/      # 공용 컴포넌트
    └── src/styles/theme.css     # 디자인 토큰
```

---

## 기술 스택

| 항목 | 버전 / 내용 |
|------|------------|
| 번들러 | Vite |
| 프레임워크 | React 18 + TypeScript |
| 스타일 | Tailwind CSS v4 (breakpoint: `sm:` 640px 단일) |
| 라우팅 | react-router v7 |
| 폼 | react-hook-form (Login·Signup 전환 예정) |
| UI 컴포넌트 | shadcn/ui + Radix UI |
| 아이콘 | 인라인 SVG (lucide-react는 `Trash2`만 사용) |

---

## Claude Code 시작 방법

> Claude Code는 반드시 `FE_GreenBrain/` 폴더에서 열어야 한다.
> 상위 폴더나 `DesignPrototype_GreenBrain/`에서 열면 하네스가 동작하지 않는다.

```bash
cd FE_GreenBrain
claude
```

---

## 주요 워크플로우

### 구현 · API 연동 · 디자인 수정

자연어로 요청하면 `fe-orchestrator` 스킬이 자동으로 파이프라인을 실행한다.

```
"Login 페이지 API 연동해줘"
"ChallengeModal alert() 제거해줘"
"ChallengeFeed 카드 디자인 수정해줘"
"TokenBar 컴포넌트 분리해줘"
```

내부 실행 순서: **fe-builder** (구현) → **pattern-guardian** (패턴 검증) → **fe-qa** (PRD 검증)

---

### GitHub 이슈 기반 작업

모든 작업은 GitHub 이슈를 기준으로 진행한다.

**이슈 작업 시작:**
```
"이슈 #5 작업하자"
"issue #12 해줘"
```
→ 브랜치 자동 생성 → 코드 구현 → 커밋 → PR 생성까지 자동 처리

**이슈 생성:**
```
"이슈 만들어줘"
"Login 버그 리포트 이슈로 만들어줘"
"PRD 기반으로 이슈 만들어줘"
```

> **GitHub 이슈 워크플로우 전제 조건**
> - `gh` CLI 설치: https://cli.github.com
> - 인증: `gh auth login`
> - 원격 저장소 연결: `git remote add origin {repo-url}`
> - 작업 시작 전 `main` 브랜치가 깨끗한 상태여야 함 (미커밋 변경사항 없음)

---

## docs/ 문서 구조

| 경로 | 용도 |
|------|------|
| `docs/PRD.md` | 제품 전체 기획 문서 |
| `docs/PRD-front.md` | 프론트엔드 요구사항 명세 |
| `docs/role.md` | 담당자별 구현 체크리스트 |
| `docs/FRONTEND.md` | 코드 컨벤션 (컴포넌트 패턴 · API 호출 · 에러 처리) |
| `docs/DESIGN.md` | 디자인 시스템 (색상 · 타이포 · 컴포넌트 스타일) |
| `docs/QUALITY_SCORE.md` | 영역별 품질 등급 추적 |
| `docs/design-docs/core-beliefs.md` | 코드 분석 기반 설계 원칙 |
| `docs/exec-plans/` | 이슈별 작업 계획 파일 (자동 생성) |
| `docs/generated/api-schema.md` | API 명세 테이블 |
| `docs/generated/component-inventory.md` | 컴포넌트 전체 목록 |
| `docs/references/` | 외부 라이브러리 레퍼런스 (`{라이브러리}-llms.txt`) |

---

## API 명세 업데이트

백엔드와 API가 확정되면 두 파일을 함께 수정한다:

1. `.claude/skills/implement-feature/references/api-shapes.md` — **에이전트 구현 기준** (필수)
2. `docs/generated/api-schema.md` — 사람용 요약 테이블 (선택)

`api-shapes.md`만 수정하면 에이전트는 새 스펙으로 구현한다.

---

## 주의사항

### 코드 작성 시
- `components/ui/` (shadcn/ui) 파일은 수정하지 않는다
- `alert()` / `confirm()` 사용 금지 — 인라인 에러 메시지로 대체
- `React.FC<Props>` 사용 금지 — `export default function Name()` 사용
- `style={{ color: ... }}` 사용 금지 — Tailwind 클래스 사용
- 토큰 수치 클라이언트 계산 금지 — API 응답 `remaining_tokens` 사용

### 브랜치 · PR
- `main` 브랜치에 직접 push하지 않는다
- 모든 작업은 이슈 브랜치에서 진행 (`feat/issue-N`, `fix/issue-N`)
- PR 머지 시 `closes #N`으로 이슈 자동 close

### Claude Code 폴더
- `.claude/` 내 파일은 하네스 설정 — 함부로 수정하지 않는다
- 수정이 필요하면 `CLAUDE.md` 변경 이력 테이블에 기록한다

---

## 담당자

| 이름 | 담당 영역 |
|------|----------|
| 김강욱 | 로그인 · 회원가입 · 채팅 · 탄소 토큰 UI · 공통 레이아웃 |
| 최정욱 | 챌린지 모달 · 챌린지 피드 · 온보딩 · 프로필 |

상세 체크리스트 → `docs/role.md`
