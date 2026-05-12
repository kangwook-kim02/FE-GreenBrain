> GreenBrain 디자인 시스템 가이드. Figma Make/Stitch 스타일 코드에서 추출한 디자인 토큰과 패턴.

## 색상 시스템

| 용도 | Tailwind 클래스 | 비고 |
|------|---------------|------|
| 브랜드 주색 | `green-500` | hover: `green-600` |
| 브랜드 배경 (연) | `green-50` | |
| 브랜드 배경 (그라디언트) | `green-100` | `from-green-50 to-green-100` |
| 페이지 배경 | `bg-gray-50` | 내부 화면 |
| 카드 배경 | `bg-white` | |
| 사이드바 배경 | `bg-gray-900` | 다크 사이드바 |
| 에러 텍스트 | `text-red-700` | |
| 에러 배경 | `bg-red-50` | |
| 에러 테두리 | `border-red-200` | |
| 경고 텍스트 | `text-amber-800` / `text-amber-700` | |
| 경고 배경 | `bg-amber-50` | |
| 경고 테두리 | `border-amber-200` | |
| 비활성 버튼 | `bg-gray-300` | |
| 비활성 아이콘 | `text-gray-400` | |
| 제목 텍스트 | `text-gray-900` | |
| 본문 텍스트 | `text-gray-600` | |
| 보조 텍스트 | `text-gray-500` | |
| 사이드바 활성 항목 테두리 | `border-green-400` | `border-l-2` |

## 타이포그래피

| 용도 | 클래스 |
|------|--------|
| 페이지 제목 | `text-3xl font-bold text-gray-900` |
| 섹션 제목 | `text-2xl font-bold text-gray-900` |
| 카드 제목 | `text-xl font-semibold text-gray-900` |
| 본문 | `text-base text-gray-600` |
| 보조 텍스트 | `text-sm text-gray-500` |
| 라벨 | `text-sm font-medium text-gray-700` |
| 버튼 | `font-semibold` |
| 챌린지 카테고리 pill | `text-sm font-medium text-green-700` |

## 스페이싱

| 용도 | 값 |
|------|-----|
| 인증 페이지 카드 패딩 | `p-8` |
| 내부 카드 패딩 | `p-6` |
| 일반 컨테이너 패딩 | `p-4` |
| 섹션 간격 | `space-y-4` / `mb-6` / `mb-8` |
| 인풋 패딩 | `px-4 py-2` (기본) / `px-4 py-3` (채팅) |
| 버튼 패딩 | `py-3 px-6` (주 버튼) / `py-3.5` (모달) |

## 그림자

| 용도 | 클래스 |
|------|--------|
| 인증 카드 (Login, Signup, Onboarding) | `shadow-xl` |
| 피드 카드 | `shadow-md` |
| 내부 정보 카드 | `shadow-sm` |
| 선택 카드 (hover) | `shadow-md` |
| 선택 카드 (기본) | `shadow-sm` |

## 라운딩

| 용도 | 클래스 |
|------|--------|
| 인증 카드 | `rounded-2xl` |
| 모달 카드 (데스크탑) | `sm:rounded-2xl` |
| 인터랙션 카드 | `rounded-xl` |
| 버튼 (주) | `rounded-lg` |
| 버튼 (모달 내) | `rounded-xl` |
| pill 버튼 | `rounded-full` |
| 인풋 | `rounded-lg` |
| 인라인 배지 | `rounded-full` |

## 카드 패턴

```tsx
/* 인증 페이지 카드 */
<div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
  <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">

/* 내부 정보 카드 */
<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

/* 피드 카드 */
<div className="bg-white rounded-xl shadow-md overflow-hidden">

/* 정보 박스 (amber) */
<div className="bg-amber-50 border border-amber-200 rounded-xl p-4">

/* 성공 박스 (green) */
<div className="bg-green-50 border border-green-200 rounded-lg p-3">
```

## 버튼 패턴

```tsx
/* 주 버튼 */
className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors"

/* 주 버튼 (비활성 포함) */
className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"

/* 위험 버튼 (ghost) */
className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-red-500 font-semibold hover:bg-red-50 transition-colors"

/* pill 버튼 */
className="flex items-center gap-1.5 text-xs font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-full transition-colors"
```

## 인풋 패턴

```tsx
/* 기본 */
className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"

/* 채팅 */
className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100"
```

## 애니메이션

| 용도 | 클래스 |
|------|--------|
| 로딩 말풍선 | `animate-bounce` + `delay-100`, `delay-200` |
| 스켈레톤 카드 | `animate-pulse` |
| 버튼 클릭 | `active:scale-[0.98]` |
| 색상 전환 | `transition-colors` |
| 그림자 전환 | `hover:shadow-md` |

## 선택 카드 (Onboarding, Profile)

```tsx
className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center gap-4 cursor-pointer shadow-sm hover:shadow-md active:scale-[0.98] ${
  selected === option.value
    ? "border-green-500 bg-green-50 shadow-md"
    : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
}`}
```

## max-width 기준

| 화면 | `max-w` |
|------|---------|
| 채팅, 피드 | `max-w-4xl` |
| 프로필, 온보딩 | `max-w-2xl` |
| 인증 (Login, Signup) | `max-w-md` |
| 챌린지 독립 페이지 | `max-w-2xl` |

## 다크모드

현재 미지원. 사이드바(`bg-gray-900`)는 기능상 다크이지만 전체 다크모드 토글은 구현되지 않음.

## CSS 커스텀 속성 (`theme.css`)

```css
--radius: 0.625rem;
--green-500: oklch(0.723 0.219 149.579);
--background: oklch(1 0 0);
--foreground: oklch(0.145 0 0);
```

Tailwind v4 `@theme inline` 블록에서 CSS 변수를 Tailwind 색상으로 매핑.
