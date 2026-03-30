# Page Layout Patterns

> 주요 페이지별 레이아웃 패턴, 반응형 동작, 코드 예시

---

## 레이아웃 원칙

1. **max-w-* 는 layout.tsx에서만** — page.tsx에서 직접 사용 금지
2. **컨테이너 너비**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
3. **섹션 패딩**: `py-12 sm:py-16 lg:py-24`

---

## Pattern 1 — Split Layout

**사용 페이지**: 로그인, 회원가입, 기업 로그인

```
Mobile (< 768px)          Tablet+ (≥ 768px)
┌─────────────────┐       ┌────────┬────────┐
│   Form only     │       │ Brand  │  Form  │
│                 │       │ Panel  │ Panel  │
│                 │       │        │        │
└─────────────────┘       └────────┴────────┘
```

```tsx
// layout.tsx
export default function AuthLayout({ children }) {
  return <div className="min-h-screen">{children}</div>
}

// LoginContent.tsx
<div className="min-h-screen flex">
  {/* Left — Brand panel */}
  <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 flex-col justify-center p-12">
    {/* 브랜드 메시지, 피처 리스트 */}
  </div>
  {/* Right — Form panel */}
  <div className="w-full md:w-1/2 flex items-center justify-center p-8">
    {/* 폼 내용 */}
  </div>
</div>
```

---

## Pattern 2 — Single Column Centered (폼/컨텐츠 페이지)

**사용 페이지**: 이력서 작성, 회원가입 폼, 진단

```
모든 해상도:
┌─────────────────────────────┐
│          Header             │
├─────────────────────────────┤
│  [   max-w-xl mx-auto   ]   │
│  [       Form           ]   │
│  [                      ]   │
└─────────────────────────────┘
```

```tsx
// app/(auth)/signup/layout.tsx
export default function SignupLayout({ children }) {
  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      {children}
    </main>
  )
}
```

---

## Pattern 3 — Wide List Grid (목록/탐색 페이지)

**사용 페이지**: 채용공고 목록, 랜딩 섹션

```
Mobile        Tablet        Desktop       Wide
┌──┐          ┌──┬──┐       ┌──┬──┬──┐   ┌──┬──┬──┬──┐
│  │          │  │  │       │  │  │  │   │  │  │  │  │
└──┘          └──┴──┘       └──┴──┴──┘   └──┴──┴──┴──┘
1 col         2 cols        3 cols        4 cols
```

```tsx
<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {jobs.map(job => <JobCard key={job.id} job={job} />)}
  </div>
</section>
```

---

## Pattern 4 — Content + Sticky Sidebar

**사용 페이지**: 채용공고 상세

```
Mobile (< 1024px)         Desktop (≥ 1024px)
┌─────────────────┐       ┌──────────────┬──────────┐
│  Job Content    │       │ Job Content  │  Apply   │
│                 │       │   (2/3)      │  Panel   │
│                 │       │              │ (sticky) │
│ ┌─────────────┐ │       │              │          │
│ │ Apply (fixed│ │       └──────────────┴──────────┘
│ │  bottom)    │ │
└─└─────────────┘┘
```

```tsx
<div className="max-w-5xl mx-auto px-4 py-8">
  <div className="lg:grid lg:grid-cols-3 lg:gap-8">
    {/* Main content */}
    <div className="lg:col-span-2">
      <JobContent post={post} />
    </div>
    {/* Sticky sidebar */}
    <div className="hidden lg:block">
      <div className="sticky top-24">
        <ApplyPanel post={post} />
      </div>
    </div>
  </div>
  {/* Mobile fixed apply bar */}
  <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-slate-200 p-4">
    <ApplyButton />
  </div>
</div>
```

---

## Pattern 5 — Dashboard (기업/관리자)

**사용 페이지**: 기업 대시보드, 관리자 페이지

```
Mobile                    Desktop (≥ 1024px)
┌─────────────────┐       ┌──────┬─────────────────┐
│  Header         │       │      │ Header          │
├─────────────────┤       │ Side │─────────────────┤
│  Mobile Tabs    │       │ bar  │ Main Content    │
├─────────────────┤       │      │                 │
│  Content        │       │      │                 │
└─────────────────┘       └──────┴─────────────────┘
```

```tsx
// company/layout.tsx
export default function CompanyLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <CompanySidebar className="hidden lg:flex w-64 flex-shrink-0" />
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
```

---

## Pattern 6 — Hero + Sections (랜딩 페이지)

**사용 페이지**: `/` 메인 페이지

```
┌─────────────────────────────────────────────┐
│            Hero Section                     │
│   full-width gradient, search bar          │
├─────────────────────────────────────────────┤
│        Job Categories (max-w-7xl)           │
├─────────────────────────────────────────────┤
│        Popular Jobs (max-w-7xl)             │
├─────────────────────────────────────────────┤
│        Services Section (max-w-7xl)         │
├─────────────────────────────────────────────┤
│        CTA Section (full-width)             │
├─────────────────────────────────────────────┤
│        Footer (bg-slate-900)                │
└─────────────────────────────────────────────┘
```

각 섹션은 독립적인 padding + max-w-7xl 컨테이너 사용.

---

## 공통 Header 동작

```
Mobile                Desktop
┌──────────────────┐  ┌────────────────────────────────┐
│ Logo  [☰ Menu]   │  │ Logo  [Jobs] [Company] [...] Login │
└──────────────────┘  └────────────────────────────────┘
```

- 모바일: Hamburger → MobileNav 드로어 (`w-full sm:max-w-sm`)
- 스크롤 시 배경 `bg-white/95 backdrop-blur-sm shadow-sm`
- 로그인 상태에 따라 우상단 버튼 변경

---

## 레이아웃 체크리스트

새 페이지 작성 전:
- [ ] `layout.tsx`에서 max-w-* 주입됐는가?
- [ ] 모바일 first로 작성됐는가? (sm/md/lg 순서)
- [ ] 인증 필요 경로인가? (middleware.ts 확인)
- [ ] loading.tsx 있는가? (스켈레톤 표시)
- [ ] error.tsx 있는가?
