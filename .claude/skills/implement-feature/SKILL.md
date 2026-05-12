---
name: implement-feature
description: fe-builder가 사용하는 GreenBrain 프론트엔드 구현 스킬. Figma Make 프로토타입 코드에서 mock 제거·API 연동·상태 처리 추가·컴포넌트 분리·인프라 구현을 수행한다. 구현 작업 시작 전 반드시 이 스킬을 읽는다.
---

## 시작 전 확인

구현 전 반드시 읽는다:
1. `references/figma-patterns.md` — Figma Make 기준 패턴 전체
2. `references/api-shapes.md` — API 응답 shape 정의
3. **대상 파일** (`Read` 도구) — 프로토타입의 현재 코드 구조·스타일 파악
   - 경로: `C:\Users\ices1\web\GreenBrain\DesignPrototype_GreenBrain\src\app\{pages or components}\{파일명}.tsx`
4. **인접 컴포넌트** (디자인 작업 시) — 같은 화면 또는 유사한 카드/버튼/폼을 가진 파일을 1~2개 더 읽어 스타일 일관성 파악

## 구현 유형별 절차

### 1. mock → API 연동

**Before (mock 패턴):**
```tsx
setTimeout(() => {
  // 하드코딩 데이터
  setData(mockData);
  setIsLoading(false);
}, 1000);
```

**After (API 연동 패턴):**
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

### 2. 폼 → react-hook-form 전환

Login, Signup 페이지 기준:

```tsx
import { useForm } from "react-hook-form";

interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();
  const [serverError, setServerError] = useState("");

  const onSubmit = async (data: FormData) => {
    setServerError("");
    // API 호출
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("email", {
          required: "이메일을 입력해주세요.",
          pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: "올바른 이메일 형식이 아닙니다." }
        })}
        type="email"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
      />
      {errors.email && (
        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
      )}
      {/* ... */}
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {serverError}
        </div>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
      >
        {isSubmitting ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}
```

### 3. 상태 처리 3종 추가

모든 API 연동 지점에 반드시 구현:

**로딩:**
```tsx
{isLoading ? (
  <div className="space-y-4">
    {[1,2,3].map(i => (
      <div key={i} className="bg-gray-100 rounded-xl h-48 animate-pulse" />
    ))}
  </div>
) : /* 실제 콘텐츠 */}
```

**에러:**
```tsx
{error && (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
    {error}
  </div>
)}
```

**빈 상태:**
```tsx
{items.length === 0 && (
  <div className="text-center py-12">
    <p className="text-gray-500 mb-4">아직 인증된 챌린지가 없습니다.</p>
    <button
      onClick={() => setShowChallenge(true)}
      className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
    >
      첫 챌린지 시작하기
    </button>
  </div>
)}
```

### 4. 컴포넌트 분리 기준

기존 Chat.tsx에서 분리할 컴포넌트:

**TokenBar** (`components/TokenBar.tsx`):
```tsx
interface Props {
  remaining: number;
  max: number;
  onChallenge: () => void;
}
export default function TokenBar({ remaining, max, onChallenge }: Props) { ... }
```

**CarbonCard** (`components/CarbonCard.tsx`):
```tsx
interface Props {
  carbonCost: number;
}
export default function CarbonCard({ carbonCost }: Props) { ... }
```

**SkeletonCard** (`components/SkeletonCard.tsx`):
```tsx
export default function SkeletonCard() {
  return <div className="bg-gray-100 rounded-xl h-48 animate-pulse" />;
}
```

분리 시 주의: props 타입은 기존 사용 패턴에서 추론하고, 스타일은 기존 코드를 그대로 이동한다.

### 5. React Context 인프라

`contexts/AppContext.tsx`:

```tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface AppState {
  user: {
    id: string;
    email: string;
    nickname: string;
    onboarding_complete: boolean;
  } | null;
  tokens: {
    remaining: number;
    max: number;
  };
}

const AppContext = createContext<{
  state: AppState;
  setUser: (user: AppState["user"]) => void;
  setTokens: (tokens: AppState["tokens"]) => void;
  updateRemainingTokens: (remaining: number) => void;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: null,
    tokens: { remaining: 150, max: 150 },
  });

  const setUser = (user: AppState["user"]) =>
    setState(prev => ({ ...prev, user }));

  const setTokens = (tokens: AppState["tokens"]) =>
    setState(prev => ({ ...prev, tokens }));

  const updateRemainingTokens = (remaining: number) =>
    setState(prev => ({ ...prev, tokens: { ...prev.tokens, remaining } }));

  return (
    <AppContext.Provider value={{ state, setUser, setTokens, updateRemainingTokens }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
```

### 6. 라우트 가드

`components/RouteGuard.tsx`:

```tsx
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";

interface Props {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

export default function RouteGuard({ children, requireOnboarding = false }: Props) {
  const { state } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.user) {
      navigate("/login");
      return;
    }
    if (requireOnboarding && !state.user.onboarding_complete) {
      navigate("/onboarding");
    }
  }, [state.user, requireOnboarding, navigate]);

  if (!state.user) return null;
  if (requireOnboarding && !state.user.onboarding_complete) return null;

  return <>{children}</>;
}
```

## Next.js 마이그레이션 고려사항

현재 코드는 Vite + React Router로 작성됨. Next.js 전환 시:
- `useNavigate` → `useRouter` (next/navigation)
- `<Link to="">` → `<Link href="">` (next/link)
- `createBrowserRouter` → `app/` 디렉토리 구조
- `<img>` → `<Image>` (next/image)

단, 현재는 Vite 기반으로 구현하고, 마이그레이션은 별도 작업으로 처리한다.

## 파일 위치 규칙

프로토타입 루트: `C:\Users\ices1\web\GreenBrain\DesignPrototype_GreenBrain`

```
DesignPrototype_GreenBrain/src/app/
├── pages/          # 페이지 컴포넌트 (기존 유지)
├── components/     # 공통 컴포넌트 (기존 유지)
│   └── ui/         # shadcn/ui (수정 금지)
├── contexts/       # 신규: React Context
└── hooks/          # 신규: 커스텀 훅
```
