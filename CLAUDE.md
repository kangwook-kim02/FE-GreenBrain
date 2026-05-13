# GreenBrain 프론트엔드

> AI 탄소 인식 챌린지 플랫폼. Figma Make/Stitch 프로토타입 기반.

## 내 역할

프론트엔드 + 디자인. 백엔드 API 서버는 다른 팀원 담당 (이 세션 범위 밖).

## 기술 스택 / 경로

- Vite + React 18 + TypeScript
- Tailwind CSS v4 — 단일 breakpoint `sm:` (640px)
- react-router v7, react-hook-form, shadcn/ui + Radix UI
- 아이콘: 인라인 SVG 우선 (lucide-react는 `Trash2`만 허용)

## 컴포넌트 구조

```
components/
├── icons/
│   └── OnboardingIcons.tsx   # 온보딩 아이콘 (props: name) — 프로필 설정에서 재사용
├── ui/
│   └── button.tsx            # shadcn/ui 버튼
├── CarbonCard.tsx
├── EmptyState.tsx
├── SkeletonCard.tsx
└── TokenBar.tsx
```

**디자인 프로토타입**: `../DesignPrototype_GreenBrain` (절대경로: `C:\Users\ices1\web\GreenBrain\DesignPrototype_GreenBrain`)
→ 모든 구현·디자인 작업의 대상 파일이 여기에 있다. 에이전트는 작업 전 반드시 이 경로의 파일을 직접 읽는다.

## 컨벤션 핵심 5가지

1. **컴포넌트**: `export default function Name()` — `React.FC` 금지
2. **스타일**: Tailwind 클래스만 — `style={{}}` 금지 (동적 계산 제외)
3. **에러 표시**: 인라인 메시지 — `alert()` 절대 금지
4. **상태**: API 응답 값 사용 — 클라이언트 자체 계산 금지 (토큰 등)
5. **아이콘**: 인라인 SVG 우선 — 신규 lucide-react 추가 금지

상세 → `docs/FRONTEND.md`, `docs/DESIGN.md`

## 에이전트 / 스킬

| 스킬 | 트리거 | 역할 |
|------|--------|------|
| `fe-orchestrator` | 구현·연동·분리·수정 요청 | fe-builder→pattern-guardian→fe-qa 파이프라인 |
| `github-issue-work` | "issue #번호", "이슈 #번호 작업" | 이슈 기반 작업 실행 + 코멘트 |
| `github-issue-create` | "이슈 만들어줘", "이슈 생성" | GitHub 이슈 생성 |

에이전트: `.claude/agents/` — fe-builder, pattern-guardian, fe-qa

## GitHub 이슈 워크플로우

**모든 작업은 GitHub 이슈 기반**으로 진행한다.

- 작업 시작: `issue #번호 작업하자` → `github-issue-work` 스킬 실행
- 이슈 생성: `이슈 만들어줘` → `github-issue-create` 스킬 실행
- 작업 계획: `docs/exec-plans/{날짜}-issue-{번호}.md` 에 자동 저장
- 이슈 close: PR 머지 시 `closes #번호`로 자동 처리

## docs/ 구조

| 경로 | 설명 |
|------|------|
| `docs/PRD.md` | 제품 전체 기획 문서 |
| `docs/PRD-front.md` | 프론트엔드 요구사항 명세 (fe-qa 검증 기준) |
| `docs/role.md` | 담당자별 구현 체크리스트 |
| `docs/FRONTEND.md` | 프론트엔드 코드 컨벤션 |
| `docs/DESIGN.md` | 디자인 시스템 가이드 |
| `docs/QUALITY_SCORE.md` | 품질 등급 추적 |
| `docs/design-docs/index.md` | 설계 문서 목록 인덱스 |
| `docs/design-docs/core-beliefs.md` | 프로젝트 핵심 원칙 |
| `docs/exec-plans/` | 이슈별 작업 계획 (자동 생성) |
| `docs/generated/api-schema.md` | API 명세 (확정 시 `api-shapes.md`와 함께 수정) |
| `docs/generated/component-inventory.md` | 컴포넌트 목록 (자동 추출) |
| `docs/references/` | 외부 라이브러리 레퍼런스 |

**현재 작업**: `docs/exec-plans/` 참조

## 변경 이력

| 날짜 | 변경 내용 | 대상 | 사유 |
|------|----------|------|------|
| 2026-05-12 | 초기 구성 | 전체 | Figma Make 프로토타입 기반 하네스 도입 |
| 2026-05-12 | GitHub 이슈 스킬 추가, docs/ 구성 | skills/github-*, docs/ | 이슈 기반 워크플로우 도입 |
