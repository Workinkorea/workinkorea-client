---
name: design-system
description: Blue Design System tokens, component specifications, and page layout patterns for WorkinKorea. Use when creating or refactoring any UI component.
---

# Blue Design System — WorkinKorea

## 목적

이 스킬은 WorkinKorea 프로젝트의 공식 디자인 시스템 사양을 제공합니다. 모든 UI 작업에서 이 토큰과 패턴을 참조하여 일관된 디자인을 보장합니다.

## 사용 시점

- UI 컴포넌트 신규 생성 시
- 기존 컴포넌트 디자인 리팩토링 시
- 페이지 레이아웃 구성 시
- 디자인 일관성 검증 시

## 디자인 참고 파일

- `file:///Users/apple/Downloads/workinkorea-redesign.html`

---

## Color Tokens

### Primary (Blue)

| Token    | Hex     | Tailwind        | 용도                                  |
| -------- | ------- | --------------- | ------------------------------------- |
| blue-50  | #EFF6FF | bg-blue-50      | 배경 강조, 아이콘 배경, info-bg       |
| blue-100 | #DBEAFE | bg-blue-100     | 배지, 프로그레스 바 배경, focus ring  |
| blue-200 | #BFDBFE | border-blue-200 | secondary 버튼 보더, 카드 hover 보더  |
| blue-300 | #93C5FD | text-blue-300   | 히어로 서브텍스트, gradient text 시작 |
| blue-400 | #60A5FA | text-blue-400   | 풋터 브랜드, 아바타 gradient 시작     |
| blue-500 | #3B82F6 | bg-blue-500     | 타임라인 도트, 로고 gradient 시작     |
| blue-600 | #2563EB | bg-blue-600     | **메인 액션 색상**, 버튼, 링크, CTA   |
| blue-700 | #1D4ED8 | bg-blue-700     | 버튼 hover, 로고 gradient 끝          |
| blue-800 | #1E40AF | -               | 히어로 gradient 중간                  |
| blue-900 | #1E3A8A | -               | 히어로 gradient 끝, 다크 배경         |
| blue-950 | #172554 | -               | 히어로 gradient 최끝                  |

### Neutral (Slate)

| Token               | 용도                               |
| ------------------- | ---------------------------------- |
| slate-50 (#F8FAFC)  | 페이지 배경, 입력 내부 배경        |
| slate-100 (#F1F5F9) | 구분선, 탭 border, 태그 배경       |
| slate-200 (#E2E8F0) | 카드/입력 border, 풋터 구분        |
| slate-300 (#CBD5E1) | 체크박스 border, 북마크 비활성     |
| slate-400 (#94A3B8) | 캡션, 힌트, placeholder            |
| slate-500 (#64748B) | 서브텍스트, 비활성 탭              |
| slate-600 (#475569) | 본문 보조, 아웃라인 버튼 텍스트    |
| slate-700 (#334155) | 레이블, 강조 본문                  |
| slate-800 (#1E293B) | **기본 본문 텍스트**               |
| slate-900 (#0F172A) | **제목 텍스트**, 다크 배경(Footer) |

### Semantic

| 용도    | 색상                       | 배경                    |
| ------- | -------------------------- | ----------------------- |
| Success | #10B981 (text-emerald-500) | #ECFDF5 (bg-emerald-50) |
| Warning | #F59E0B (text-amber-500)   | #FFFBEB (bg-amber-50)   |
| Error   | #EF4444 (text-red-500)     | #FEF2F2 (bg-red-50)     |
| Info    | #3B82F6 (text-blue-500)    | #EFF6FF (bg-blue-50)    |

---

## Typography

- **폰트**: Pretendard (본문), Plus Jakarta Sans (브랜드)
- **line-height**: 1.6 (본문), 1.2-1.3 (제목)
- **letter-spacing**: -1px (Hero), -0.5px (브랜드)

---

## 컴포넌트 사양

### Button

```
기본: inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-150
포커스: focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2

| Variant   | 스타일 |
|-----------|--------|
| primary   | bg-blue-600 text-white hover:bg-blue-700 |
| secondary | bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 |
| outline   | bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 |
| ghost     | bg-transparent text-slate-600 hover:bg-slate-100 |

| Size | 스타일 |
|------|--------|
| sm   | px-3.5 py-1.5 text-[13px] |
| md   | px-5 py-2.5 text-sm |
| lg   | px-7 py-3.5 text-[15px] rounded-xl |
| full | w-full (추가 modifier) |
```

### Input

```
기본: w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 bg-white font-sans transition-colors
포커스: focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-100
에러: border-red-500 focus:ring-red-100
플레이스홀더: placeholder:text-slate-400
레이블: block text-[13px] font-semibold text-slate-700 mb-1.5
필수표시: text-red-500 ml-0.5
힌트: text-xs text-slate-400 mt-1
```

### Card

```
기본: bg-white border border-slate-200 rounded-xl overflow-hidden
호버변형: hover:shadow-lg hover:border-blue-200 transition-all duration-200
패딩: p-6 또는 p-7
```

### Badge

```
기본: inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold

| Variant | 스타일 |
|---------|--------|
| blue    | bg-blue-100 text-blue-700 |
| green   | bg-emerald-50 text-emerald-600 |
| orange  | bg-amber-50 text-amber-600 |
| red     | bg-red-50 text-red-500 |
```

### Tab Group

```
컨테이너: flex border-b-2 border-slate-100
탭 아이템: px-5 py-3 text-sm font-medium text-slate-500 border-b-2 border-transparent -mb-[2px] cursor-pointer
Active: text-blue-600 border-blue-600 font-semibold
```

### Modal

```
오버레이: fixed inset-0 bg-black/50 z-40
컨테이너: fixed inset-0 flex items-center justify-center z-50 p-4
패널: bg-white rounded-xl shadow-xl max-w-md w-full p-6
```

---

## 레이아웃 패턴

### Navigation Bar

```
container: flex items-center justify-between px-10 py-4 bg-white border-b border-slate-100 sticky top-0 z-50
로고: font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-blue-600 + 32px 아이콘
링크: text-sm font-medium text-slate-600 / active: text-blue-600 font-semibold
```

### Hero Section

```
배경: bg-gradient-to-br from-blue-600 via-blue-800 to-blue-950 px-[60px] py-20 relative overflow-hidden
장식: ::before, ::after로 radial-gradient 원형 (rgba blue)
배지: glassmorphism (bg-white/12 backdrop-blur-[10px] border-white/15 rounded-full px-3.5 py-1.5 text-[13px] text-blue-200)
타이틀: text-[44px] font-black text-white leading-tight tracking-tight
검색바: bg-white rounded-2xl p-2 flex gap-2 shadow-xl
통계: flex gap-10 mt-10 (수치 text-[28px] font-extrabold text-white)
```

### Auth Layout (Login/Signup)

```
컨테이너: flex min-h-[700px]
좌측 패널: flex-1 bg-gradient-to-br from-blue-600 to-blue-900 flex flex-col justify-center p-[60px] relative overflow-hidden
우측 폼: flex-1 flex flex-col justify-center p-[60px] bg-white
역할 선택: grid grid-cols-2 gap-4 (border-2, selected시 border-blue-500 bg-blue-50)
소셜 로그인: flex gap-3 (border slate-200, rounded-lg, py-3)
구분선: flex items-center gap-4 (::before, ::after로 hr)
```

### Profile Layout

```
컨테이너: grid grid-cols-[280px_1fr] gap-6 p-8 bg-slate-50 min-h-[700px]
사이드바: bg-white border border-slate-200 rounded-xl p-6 h-fit sticky top-20
아바타: w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full
프로필 완성도: bg-blue-50 rounded-lg p-4 (6px 프로그레스 바)
메뉴: py-2.5 px-3 rounded-lg text-sm / active: bg-blue-50 text-blue-700 font-semibold
```

### Job Listing Layout

```
컨테이너: grid grid-cols-[260px_1fr] gap-6 p-8 bg-slate-50
필터 패널: bg-white border rounded-xl p-6 h-fit sticky top-20
카드: bg-white border rounded-xl p-6 flex gap-5 hover:border-blue-200 hover:shadow-md
정렬 버튼: active시 border-blue-500 text-blue-600 bg-blue-50
```

### Job Detail Layout

```
히어로: bg-blue-50 p-8 border-b border-blue-100 (64px 로고, 24px 800 타이틀)
본문: grid grid-cols-[1fr_340px] gap-6 p-8 bg-slate-50
섹션 카드: bg-white border rounded-xl p-7
지원 카드: sticky top-24 shadow-lg rounded-2xl p-7 (금액 text-[28px] font-extrabold text-blue-600)
```

### Footer

```
bg-slate-900 text-slate-400 px-10 py-12
그리드: grid-cols-[2fr_1fr_1fr_1fr] gap-10
브랜드: font-['Plus_Jakarta_Sans'] text-lg font-extrabold text-blue-400
섹션 타이틀: text-xs font-bold text-slate-300 uppercase tracking-wider mb-4
링크: text-[13px] text-slate-500
하단: border-t border-white/[0.06] pt-6 text-xs text-slate-600 flex justify-between
```

---

## Gradient 참고

```
Hero:           from-blue-600 via-blue-800 to-blue-950 (135deg)
CTA Banner:     from-blue-600 to-blue-800
Auth Side:      from-blue-600 to-blue-900
Resume Header:  from-blue-600 to-blue-800
Avatar:         from-blue-400 to-blue-600
Logo Icon:      from-blue-500 to-blue-700
Glassmorphism:  bg-white/[0.12] backdrop-blur-[10px] border-white/[0.15]
Text Gradient:  bg-gradient-to-br from-blue-300 to-blue-400 bg-clip-text text-transparent
```

## 체크리스트

- [ ] 모든 색상이 디자인 토큰 기반인가?
- [ ] 하드코딩된 hex 값이 없는가?
- [ ] font-size, padding, margin이 spacing 스케일을 따르는가?
- [ ] border-radius가 정의된 스케일(sm/md/lg/xl/2xl/full)인가?
- [ ] 그라데이션 방향과 색상이 패턴을 따르는가?
- [ ] 호버/포커스 상태가 정의되어 있는가?
- [ ] 반응형 breakpoint가 적용되어 있는가?
