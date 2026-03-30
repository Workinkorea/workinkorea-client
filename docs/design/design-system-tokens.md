# Design System Tokens

> globals.css에서 추출한 실제 사용 토큰 전체 레퍼런스

## 컬러 팔레트

### Primary (Blue)
| 토큰 | 값 | 사용처 |
|------|-----|--------|
| `blue-50` | `#EFF6FF` | 배경 강조, 선택된 행 |
| `blue-100` | `#DBEAFE` | 호버 배경, 태그 배경 |
| `blue-200` | `#BFDBFE` | 비활성 강조 |
| `blue-500` | `#3B82F6` | hover 액션 |
| `blue-600` | `#2563EB` | Primary 버튼, 링크, 포커스 링 |
| `blue-700` | `#1D4ED8` | active/pressed 상태 |

### Neutral (Slate)
| 토큰 | 값 | 사용처 |
|------|-----|--------|
| `slate-50` | `#F8FAFC` | 페이지 배경 |
| `slate-100` | `#F1F5F9` | 카드 대체 배경, 비활성 입력 |
| `slate-200` | `#E2E8F0` | 기본 구분선, 카드 테두리 |
| `slate-300` | `#CBD5E1` | 비활성 테두리 |
| `slate-400` | `#94A3B8` | 비활성 아이콘, placeholder |
| `slate-500` | `#64748B` | 보조 텍스트, 캡션 |
| `slate-700` | `#334155` | 서브 텍스트 |
| `slate-800` | `#1E293B` | 본문 텍스트 |
| `slate-900` | `#0F172A` | 헤딩 |

### Status
| 토큰 | 값 | 사용처 |
|------|-----|--------|
| `green-500` | `#22C55E` | success 아이콘 |
| `green-600` | `#16A34A` | success 버튼/배지 |
| `green-50` | `#F0FDF4` | success 배경 |
| `red-500` | `#EF4444` | error 아이콘, 마감 임박 배지 |
| `red-50` | `#FEF2F2` | error 배경 |
| `yellow-500` | `#EAB308` | warning |
| `yellow-50` | `#FEFCE8` | warning 배경 |

---

## 타이포그래피

### Canonical 클래스 (globals.css 정의)

> 이 클래스들만 사용. `text-sm`, `text-lg` 등 Tailwind 기본 크기는 **절대 금지**.

| 클래스 | font-size | font-weight | line-height | 사용처 |
|--------|-----------|-------------|-------------|--------|
| `text-display-1` | 48px | 700 | 1.2 | 히어로 메인 타이틀 |
| `text-display-2` | 36px | 700 | 1.25 | 섹션 메인 타이틀 |
| `text-title-1` | 28px | 700 | 1.3 | 페이지 타이틀 |
| `text-title-2` | 22px | 600 | 1.35 | 카드/섹션 헤딩 |
| `text-title-3` | 18px | 600 | 1.4 | 서브 헤딩 |
| `text-body-1` | 16px | 400 | 1.6 | 본문 기본 |
| `text-body-2` | 14px | 400 | 1.6 | 본문 보조 |
| `text-label-1` | 15px | 500 | 1.4 | 버튼 텍스트 |
| `text-label-2` | 13px | 500 | 1.4 | 작은 버튼, 배지 |
| `text-caption-1` | 12px | 400 | 1.5 | 캡션, 메타 정보 |
| `text-caption-2` | 11px | 400 | 1.5 | 최소 캡션 |

### 폰트 패밀리
```css
--font-pretendard     /* 본문 전용 */
--font-plus-jakarta-sans  /* 로고/브랜드 전용 */
```

---

## 스페이싱

4배수 시스템:
```
0.5rem = 8px   → gap-2, p-2, m-2
0.75rem = 12px → gap-3, p-3
1rem = 16px    → gap-4, p-4
1.5rem = 24px  → gap-6, p-6
2rem = 32px    → gap-8, p-8
3rem = 48px    → gap-12, p-12
4rem = 64px    → gap-16, p-16
```

---

## Border Radius

| 토큰 | 값 | 사용처 |
|------|-----|--------|
| `rounded-sm` | 4px | 인풋, 태그, 작은 요소 |
| `rounded` | 4px | (기본) |
| `rounded-md` | 6px | 버튼, 카드 |
| `rounded-lg` | 8px | 모달, 드롭다운 |
| `rounded-xl` | 12px | 히어로 카드, 큰 섹션 |
| `rounded-2xl` | 16px | 특별 강조 영역 |
| `rounded-full` | 9999px | 아바타, 배지, 피처 아이콘 |

---

## 그림자

| 토큰 | 사용처 | 구 토큰 이름 |
|------|--------|------------|
| `shadow-sm` | 카드 기본 elevation | `shadow-normal` |
| `shadow-md` | 드롭다운, 호버 카드 | `shadow-strong` |
| `shadow-lg` | 고정 헤더, sticky 요소 | — |
| `shadow-xl` | 모달, 팝업 | `shadow-heavy` |

---

## Z-Index 스택

```
z-0    기본 콘텐츠
z-10   카드 호버 효과
z-20   드롭다운, 툴팁
z-30   sticky 헤더
z-40   모달 오버레이
z-50   모달, 토스트
```

---

## 그라디언트 패턴

```css
/* Hero 배경 */
bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800

/* Split Layout 왼쪽 패널 */
bg-gradient-to-br from-blue-600 to-blue-800

/* CTA 섹션 */
bg-gradient-to-r from-blue-600 to-indigo-600

/* 카드 hover overlay */
bg-gradient-to-t from-black/60 to-transparent
```

---

## 컴포넌트별 토큰 조합 예시

### Primary Button
```tsx
className="bg-blue-600 hover:bg-blue-700 text-white text-label-1 rounded-md px-4 py-2"
```

### Card
```tsx
className="bg-white border border-slate-200 rounded-lg shadow-sm p-4"
```

### Input (정상)
```tsx
className="border border-slate-300 rounded-md text-body-1 text-slate-800 placeholder:text-slate-400"
```

### Input (에러)
```tsx
className="border border-red-500 focus:ring-red-500"
```

### Badge (success)
```tsx
className="bg-green-50 text-green-600 text-label-2 rounded-full px-2 py-0.5"
```
