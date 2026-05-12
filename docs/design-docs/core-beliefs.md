> GreenBrain 프론트엔드의 핵심 설계 원칙. Figma Make/Stitch 생성 코드 분석 결과를 기반으로 도출함.

## 1. UI 충실도 최우선

Figma Make가 생성한 컴포넌트는 디자인 픽셀 충실도를 최우선으로 설계되어 있다. 인라인 SVG 아이콘, `active:scale-[0.98]` 같은 미세 인터랙션, px 단위 여백 조정이 표준 패턴이다. 이 충실도를 유지하는 것이 추상화보다 중요하다.

**코드 근거**: SidebarLayout의 `pb-16 sm:pb-0`, NavMenu의 `absolute top-0 w-8 h-0.5 rounded-full bg-green-500` 활성 탭 인디케이터.

## 2. 상태는 최소, 출처는 명확하게

각 컴포넌트는 자신의 UI 상태만 소유한다. `useState`로 충분한 경우 전역 상태 도입을 지양한다. 단, 서버에서 오는 수치(토큰 잔여량 등)는 반드시 API 응답으로만 업데이트하고 클라이언트가 계산하지 않는다.

**코드 근거**: Chat.tsx의 `setTokens(prev => Math.max(0, prev - carbonCost))` 패턴은 금지 대상으로 식별됨 — API 응답 `remaining_tokens`로 교체 예정.

## 3. 타입은 사용처 가까이

공유 타입 파일 없이 인터페이스를 사용하는 파일 내부에 정의한다. 파일 간 의존성을 줄이고, 컴포넌트 이동/삭제 시 타입도 함께 이동/삭제된다.

**코드 근거**: ChallengeFeed.tsx의 `interface FeedItem`, Chat.tsx의 `interface Message`, Profile.tsx의 `type EditingSection`.

## 4. 레이아웃 공유는 렌더 프랍으로

SidebarLayout이 `children: (toggleButton: ReactNode) => ReactNode` 형태를 사용한다. 레이아웃 로직(사이드바 열림/닫힘, 모바일 탭바)과 페이지 콘텐츠를 완전히 분리하면서도 toggleButton을 원하는 위치에 배치할 수 있다.

**코드 근거**: `SidebarLayout.tsx`, 사용처 `Chat.tsx`, `ChallengeFeed.tsx`, `Profile.tsx`.

## 5. 단일 반응형 분기

`sm:` (640px) breakpoint 하나만 사용한다. 모바일/데스크탑 두 형태만 구분하고, 중간 단계(md, lg, xl)는 다루지 않는다. 복잡한 반응형 로직은 설계에서 배제되어 있다.

**코드 근거**: `hidden sm:flex`, `flex sm:hidden`, `pb-16 sm:pb-0`, `fixed bottom-0 sm:hidden` 패턴이 전 컴포넌트에서 일관되게 사용됨.

## 6. 에러는 문맥 안에

모달/toast/`alert()`이 아닌, 에러가 발생한 폼/카드 내부에 인라인으로 표시한다. 사용자가 에러와 입력 필드를 동시에 볼 수 있어야 한다.

**코드 근거**: Login.tsx, Signup.tsx의 `bg-red-50 border border-red-200 text-red-700` 박스 패턴. ChallengeModal.tsx와 Challenges.tsx의 `alert()` 사용은 이 원칙을 위반한 기술부채로 식별됨.

## 7. 아이콘 자급자족

인라인 SVG를 기본으로 사용해 외부 아이콘 라이브러리 의존성을 최소화한다. lucide-react는 `Trash2` 하나만 사용 중이며, 신규 아이콘은 인라인 SVG로 추가한다.

**코드 근거**: 전 컴포넌트에서 `<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">` 패턴. `from "lucide-react"`는 ChallengeFeed.tsx에서만 Trash2 단독 import.

## 8. 컴포넌트는 함수 선언식

`export default function ComponentName()` 형태를 표준으로 한다. `React.FC<Props>`와 화살표 함수 export는 금지한다. 같은 파일 내 서브컴포넌트도 동일 패턴으로 정의한다.

**코드 근거**: 모든 페이지/컴포넌트가 함수 선언식을 사용. Profile.tsx의 `function OptionCard()`, `function SectionHeader()`가 동일 파일 내 서브컴포넌트 패턴의 예시.
