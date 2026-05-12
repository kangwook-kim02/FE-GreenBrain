> Figma Make/Stitch 생성 컴포넌트 전체 목록. 코드 스캔 기반 자동 추출. 최종 추출일: 2026-05-12.

## 페이지 컴포넌트 (화면전용)

| 컴포넌트명 | 경로 | 분류 | props 수 | 사용처 |
|-----------|------|------|---------|--------|
| Login | `pages/Login.tsx` | 화면전용 | 0 | `routes.ts → /login` |
| Signup | `pages/Signup.tsx` | 화면전용 | 0 | `routes.ts → /signup` |
| Onboarding | `pages/Onboarding.tsx` | 화면전용 | 0 | `routes.ts → /onboarding` |
| Chat | `pages/Chat.tsx` | 화면전용 | 0 | `routes.ts → /chat` |
| Challenges | `pages/Challenges.tsx` | 화면전용 | 0 | `routes.ts → /challenges` |
| ChallengeFeed | `pages/ChallengeFeed.tsx` | 화면전용 | 0 | `routes.ts → /challenges/feed` |
| Profile | `pages/Profile.tsx` | 화면전용 | 0 | `routes.ts → /profile` |

## 공용 컴포넌트

| 컴포넌트명 | 경로 | 분류 | props 수 | 사용처 |
|-----------|------|------|---------|--------|
| SidebarLayout | `components/SidebarLayout.tsx` | 공용 | 1 (children render prop) | Chat, ChallengeFeed, Profile |
| ChallengeModal | `components/ChallengeModal.tsx` | 공용 | 2 (isOpen, onClose) | Chat |
| ChatSidebar | `components/ChatSidebar.tsx` | 공용 | 0 | SidebarLayout |
| NavMenu | `components/NavMenu.tsx` | 공용 | 1 (hiddenOnDesktop?) | Chat, ChallengeFeed, Profile |
| ImageWithFallback | `components/figma/ImageWithFallback.tsx` | 공용 | extends ImgHTMLAttributes | (미사용) |

## 인라인 서브컴포넌트 (분리 예정)

파일 내부에 정의되어 있으며 독립 컴포넌트로 분리할 계획:

| 컴포넌트명 | 현재 위치 | 분리 예정 경로 |
|-----------|----------|--------------|
| TokenBar | `pages/Chat.tsx` 인라인 | `components/TokenBar.tsx` |
| CarbonCard | `pages/Chat.tsx` 인라인 | `components/CarbonCard.tsx` |
| OptionCard | `pages/Profile.tsx` 인라인 | (Profile 전용, 분리 불필요) |
| SectionHeader | `pages/Profile.tsx` 인라인 | (Profile 전용, 분리 불필요) |

## shadcn/ui 컴포넌트 (수정 금지)

경로: `components/ui/` — 37개

accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input, input-otp, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toggle, toggle-group, tooltip
