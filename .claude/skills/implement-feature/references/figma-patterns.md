# Figma Make 기준 패턴

> 이 파일은 `DesignPrototype_GreenBrain/`에서 추출한 Figma Make/Stitch 코드 패턴의 기준표다.
> 모든 신규 코드는 이 패턴을 따라야 한다.

## 목차
1. 컴포넌트 구조
2. Tailwind 스타일링
3. 컬러 시스템
4. 카드/컨테이너
5. 버튼
6. 인풋
7. 에러 메시지
8. 아이콘
9. 레이아웃 (SidebarLayout)
10. 반응형
11. 상태 처리
12. 선택 카드
13. TypeScript
14. 라우팅
15. 금지 패턴

---

## 1. 컴포넌트 구조

```tsx
// ✅ 올바른 패턴
interface Props {
  onClose: () => void;
}

export default function ComponentName({ onClose }: Props) {
  return ( ... );
}

// ✅ 내부 서브컴포넌트 (같은 파일 내 정의 가능)
function OptionCard({ option, selected, onSelect }: {
  option: { value: string; label: string; icon: string };
  selected: boolean;
  onSelect: () => void;
}) {
  return ( ... );
}

// ❌ 금지
const ComponentName: React.FC<Props> = () => { ... }
export const ComponentName = () => { ... }
```

---

## 2. Tailwind 스타일링

**조건부 클래스:**
```tsx
// ✅ 템플릿 리터럴 ternary
className={`base-classes ${condition ? "active-cls" : "inactive-cls"}`}

// ✅ 다중 조건
className={`base ${cond1 ? "a" : "b"} ${cond2 ? "c" : ""}`}

// ❌ 금지: style 속성으로 Tailwind 대체 가능한 것
style={{ color: "red", padding: "8px" }}

// ✅ 허용: 동적 값 계산이 필요한 경우만
style={{ width: `${tokenPercentage}%` }}
```

**@apply 사용:** Tailwind로 직접 표현 가능한 곳에 @apply 남발 금지.

---

## 3. 컬러 시스템

| 용도 | 클래스 |
|------|--------|
| 브랜드 주색 | `green-500` (hover: `green-600`) |
| 브랜드 배경 | `green-50` (연한), `green-100` (그라디언트) |
| 페이지 배경 | `bg-gray-50` |
| 카드 배경 | `bg-white` |
| 사이드바 배경 | `bg-gray-900` |
| 에러 | 텍스트: `text-red-700`, 배경: `bg-red-50`, 테두리: `border-red-200` |
| 경고/토큰20~50% | 텍스트: `text-amber-800`, 배경: `bg-amber-50`, 테두리: `border-amber-200` |
| 비활성 버튼 | `bg-gray-300 cursor-not-allowed` |
| 비활성 아이콘 | `text-gray-400` |
| 제목 텍스트 | `text-gray-900` |
| 본문 텍스트 | `text-gray-600` |
| 보조 텍스트 | `text-gray-500` |

---

## 4. 카드/컨테이너

**인증 페이지 (Login, Signup, Onboarding):**
```tsx
<div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
  <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
```

**내부 정보 카드 (Profile, Settings 등):**
```tsx
<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
```

**피드 카드:**
```tsx
<div className="bg-white rounded-xl shadow-md overflow-hidden">
```

**경보/안내 박스:**
```tsx
// 정보 (amber)
<div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
  <p className="text-amber-800 font-semibold text-sm">💡 제목</p>
  <p className="text-amber-700 text-sm mt-1">내용</p>
</div>

// 성공 (green)
<div className="bg-green-50 border border-green-200 rounded-lg p-3">
  <p className="text-sm text-green-700">내용</p>
</div>
```

---

## 5. 버튼

**주 버튼 (전체 너비):**
```tsx
className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors"
```

**주 버튼 (비활성화 포함):**
```tsx
className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
```

**모달 내 주 버튼 (rounded-xl):**
```tsx
className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 rounded-xl transition-colors text-base"
```

**위험 버튼 (Ghost):**
```tsx
className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-red-500 font-semibold hover:bg-red-50 transition-colors"
```

**소형 pill 버튼:**
```tsx
className="flex items-center gap-1.5 text-xs font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-full transition-colors"
```

**아이콘 버튼:**
```tsx
className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
```

---

## 6. 인풋

**기본 텍스트 인풋:**
```tsx
className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
```

**채팅 인풋 (py-3):**
```tsx
className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100"
```

**인라인 편집 인풋:**
```tsx
className="flex-1 px-3 py-2 border-2 border-green-400 rounded-lg text-gray-900 font-semibold focus:outline-none focus:border-green-500 text-lg"
```

**label 패턴:**
```tsx
<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
  이메일
</label>
```

---

## 7. 에러 메시지

**서버 에러 (폼 하단, 박스):**
```tsx
{error && (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
    {error}
  </div>
)}
```

**필드 단위 에러 (react-hook-form):**
```tsx
{errors.email && (
  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
)}
```

**파일 업로드 에러 (인라인):**
```tsx
{fileError && (
  <p className="text-red-500 text-xs mt-2">{fileError}</p>
)}
```

`alert()` 사용 절대 금지.

---

## 8. 아이콘

**인라인 SVG (주류 패턴):**
```tsx
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="..." />
</svg>
```

**크기 기준:**
- `w-3.5 h-3.5` — 아주 소형 (pill 버튼 내)
- `w-4 h-4` — 소형 (사이드바, 드롭다운)
- `w-5 h-5` — 기본 (헤더, 닫기 버튼)
- `w-6 h-6` — 대형 (좋아요, 전송)
- `w-8 h-8` — 인증 아이콘
- `w-10 h-10` — 랜딩/헤딩 아이콘

**lucide-react:** 현재 `Trash2`만 사용. 신규 아이콘은 인라인 SVG 우선.

---

## 9. 레이아웃 (SidebarLayout)

Chat, ChallengeFeed, Profile에서 공통 사용:

```tsx
<SidebarLayout>
  {(toggleButton) => (
    <div className="flex-1 flex flex-col overflow-hidden [bg-gray-50]">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0 [p-4]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            {toggleButton}
            <h1 className="text-2xl font-bold text-gray-900 flex-1">제목</h1>
            <NavMenu hiddenOnDesktop />
          </div>
        </div>
      </header>

      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4">
          {/* 콘텐츠 */}
        </div>
      </div>
    </div>
  )}
</SidebarLayout>
```

**max-w 기준:**
- 채팅, 피드: `max-w-4xl`
- 프로필, 온보딩: `max-w-2xl`

---

## 10. 반응형

**단일 breakpoint: `sm` (640px)**

```tsx
// 데스크탑 전용
className="hidden sm:flex"
// 모바일 전용
className="flex sm:hidden"
// 모바일 탭 바 여백
className="pb-16 sm:pb-0"
// 모바일: 하단 시트, 데스크탑: 중앙 다이얼로그
className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
// 모달 카드
className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl"
```

---

## 11. 상태 처리

**로딩 버튼:**
```tsx
const [isLoading, setIsLoading] = useState(false);

<button disabled={isLoading} className="... disabled:bg-gray-300 disabled:cursor-not-allowed">
  {isLoading ? "처리 중..." : "제출"}
</button>
```

**채팅 말풍선 로딩:**
```tsx
<div className="flex gap-2">
  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
</div>
```

**스켈레톤 카드:**
```tsx
<div className="bg-gray-100 rounded-xl h-48 animate-pulse" />
```

---

## 12. 선택 카드 패턴 (Onboarding, Profile)

```tsx
<button
  onClick={() => setSelected(option.value)}
  className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center gap-4 cursor-pointer shadow-sm hover:shadow-md active:scale-[0.98] ${
    selected === option.value
      ? "border-green-500 bg-green-50 shadow-md"
      : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
  }`}
>
  <span className="text-3xl">{option.icon}</span>
  <span className="font-medium text-gray-900 flex-1">{option.label}</span>
  {selected === option.value && (
    <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    </span>
  )}
</button>
```

Profile 내 소형 선택 카드는 `p-3`으로 사용.

---

## 13. TypeScript

```tsx
// ✅ 로컬 인터페이스 (파일 내, 비노출)
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  carbonCost?: number;  // 옵셔널은 ?
}

// ✅ 유니온 null 타입
type EditingSection = "transport" | "diet" | "housing" | null;

// ✅ 인라인 배열 아이템 타입
option: { value: string; label: string; icon: string }

// ✅ 이벤트 핸들러 타입
const handleSubmit = async (e: React.FormEvent) => { ... }
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { ... }
```

---

## 14. 라우팅

```tsx
import { useNavigate, Link, useLocation } from "react-router";

const navigate = useNavigate();
const location = useLocation();

// 이동
navigate("/chat");

// 링크
<Link to="/signup" className="text-green-500 hover:text-green-600 font-medium">
  회원가입
</Link>

// 현재 경로 확인
const active = location.pathname === "/chat";
```

---

## 15. 금지 패턴

| 금지 | 대안 |
|------|------|
| `alert()` / `confirm()` | 인라인 에러 메시지 또는 모달 |
| `localStorage.setItem/getItem` | 쿠키(백엔드), Context |
| `style={{ color: ... }}` | Tailwind 클래스 |
| `React.FC<Props>` | `function ComponentName(props: Props)` |
| `tokens - carbonCost` 클라이언트 계산 | API 응답 `remaining_tokens` 사용 |
| 신규 아이콘에 lucide-react | 인라인 SVG |
| `className={cn(...)}` 없이 복잡한 조건 | 템플릿 리터럴 ternary |
