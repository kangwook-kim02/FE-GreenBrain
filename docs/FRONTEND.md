> GreenBrain 프론트엔드 코드 컨벤션. Figma Make/Stitch 생성 코드 패턴을 기준으로 문서화.

## 폴더 구조

```
DesignPrototype_GreenBrain/src/
├── app/
│   ├── App.tsx                  # RouterProvider 진입점
│   ├── routes.ts                # createBrowserRouter 라우트 정의
│   ├── pages/                   # 라우트별 페이지 컴포넌트
│   ├── components/              # 공용 컴포넌트
│   │   ├── figma/               # Figma Make 전용 유틸 (ImageWithFallback 등)
│   │   └── ui/                  # shadcn/ui — 수정 금지
│   ├── contexts/                # (예정) React Context
│   └── hooks/                   # (예정) 커스텀 훅
├── styles/
│   └── theme.css                # Tailwind v4 @theme, CSS 커스텀 속성
└── main.tsx
```

## 컴포넌트 패턴

```tsx
// ✅ 표준
export default function ComponentName({ prop }: Props) { ... }

// ✅ 같은 파일 내 서브컴포넌트
function SubComponent({ ... }: { ... }) { ... }

// ❌ 금지
const ComponentName: React.FC<Props> = () => { ... }
export const ComponentName = () => { ... }
```

Props 인터페이스는 사용 파일 내부에 정의한다. 공유 타입 파일 없음.

## 스타일링

Tailwind 클래스만 사용. `style={{}}` 금지 (동적 값 계산 제외).

```tsx
// ✅ 조건부 클래스
className={`base ${condition ? "active" : "inactive"}`}

// ✅ 동적 계산만 허용
style={{ width: `${percentage}%` }}

// ❌ 금지
style={{ color: "red", padding: "8px" }}
```

## 반응형

`sm:` (640px) 단일 breakpoint.

```tsx
className="hidden sm:flex"   // 데스크탑 전용
className="flex sm:hidden"   // 모바일 전용
className="pb-16 sm:pb-0"    // 모바일 탭바 여백
```

## 라우팅

```tsx
import { useNavigate, Link, useLocation } from "react-router";

const navigate = useNavigate();
navigate("/chat");

<Link to="/signup" className="text-green-500 hover:text-green-600 font-medium">
  회원가입
</Link>
```

## 상태 관리

- **로컬 UI 상태**: `useState`
- **전역 상태**: `contexts/AppContext.tsx` (예정)
- **폼 상태**: `react-hook-form` (Login, Signup 전환 예정 — 현재 `useState`)

## API 호출 패턴

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");
  try {
    const res = await fetch("/api/...", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ... }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "오류가 발생했습니다.");
      return;
    }
    const data = await res.json();
    // 성공 처리
  } catch {
    setError("인터넷 연결을 확인해주세요.");
  } finally {
    setIsLoading(false);
  }
};
```

## 에러 처리

```tsx
// 서버 에러 (폼 하단)
{error && (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
    {error}
  </div>
)}

// 필드 단위 에러 (react-hook-form)
{errors.email && (
  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
)}
```

## 아이콘

인라인 SVG 우선. `lucide-react`는 `Trash2`만 사용 중, 신규 추가 금지.

```tsx
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="..." />
</svg>
```

크기 기준: `w-3.5` 소형 pill | `w-4` 사이드바 | `w-5` 기본 | `w-6` 좋아요/전송 | `w-8` 인증 | `w-10` 랜딩

## 모달 패턴

```tsx
// 모바일: 하단 시트 / 데스크탑: 중앙 다이얼로그
<div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
  <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl">
```

## Import 순서

```tsx
// 1. React
import { useState, useEffect } from "react";
// 2. 라우팅
import { useNavigate, Link } from "react-router";
// 3. 외부 라이브러리
import { useForm } from "react-hook-form";
// 4. 내부 컴포넌트
import SidebarLayout from "../components/SidebarLayout";
// 5. 타입은 인터페이스로 같은 파일 내 정의
```

## 금지 패턴

| 금지 | 대안 |
|------|------|
| `alert()` / `confirm()` | 인라인 에러 메시지 또는 모달 |
| `localStorage.setItem/getItem` | 쿠키(백엔드), Context |
| `style={{ color: ... }}` | Tailwind 클래스 |
| `React.FC<Props>` | `function Name(props: Props)` |
| `tokens - carbonCost` | API 응답 `remaining_tokens` |
| 신규 lucide-react 아이콘 | 인라인 SVG |
