# Component Specs

> `src/shared/ui/` 컴포넌트 스펙 문서

---

## Button

**용도**: 모든 인터랙티브 액션

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  children: React.ReactNode
}
```

| variant | 배경 | 텍스트 | 테두리 |
|---------|------|--------|--------|
| primary | blue-600 | white | — |
| secondary | slate-100 | slate-800 | — |
| outline | white | blue-600 | blue-600 |
| ghost | transparent | slate-700 | — |
| danger | red-500 | white | — |

---

## Input

**용도**: 텍스트 입력, FormField 내부에서 사용

```tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}
```

- 에러 상태: 빨간 테두리 + Framer Motion `x: [-4, 4, -4, 0]` shake 애니메이션
- 포커스: `ring-2 ring-blue-500`
- 비활성: `bg-slate-100 cursor-not-allowed`

---

## FormField

**용도**: label + Input + 에러 메시지를 묶는 래퍼

```tsx
interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}
```

---

## Modal

**용도**: 확인 대화상자, 상세 정보 팝업

```tsx
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'full'
  children: React.ReactNode
}
```

- 열림: `scale 0.95→1`, `opacity 0→1`
- 닫힘: AnimatePresence로 역방향
- X 버튼: 호버 시 90° 회전

---

## Badge

**용도**: 상태 표시, 태그, 카테고리 레이블

```tsx
interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'new' | 'deadline'
  size?: 'sm' | 'md'
  children: React.ReactNode
}
// 추가 컴포넌트
NumericBadge   // 숫자 카운트 (알림 배지)
DotBadge       // 상태 점 표시
IndicatorBadge // 온라인/오프라인 인디케이터
```

| variant | 배경 | 텍스트 |
|---------|------|--------|
| default | slate-100 | slate-700 |
| success | green-50 | green-600 |
| warning | yellow-50 | yellow-700 |
| error | red-50 | red-600 |
| info | blue-50 | blue-600 |

---

## Skeleton

**용도**: 데이터 로딩 중 자리 표시자

```tsx
interface SkeletonProps {
  variant?: 'rect' | 'circle' | 'text'
  className?: string
  style?: React.CSSProperties
}
```

- 애니메이션: `skeleton-shimmer` (globals.css 정의)
- `will-change: background-position` 최적화

---

## SkeletonCards (복합 스켈레톤)

**용도**: 도메인별 로딩 스켈레톤

| 컴포넌트 | 사용 위치 |
|---------|---------|
| `JobCardSkeleton` | 채용공고 목록 |
| `JobListSkeleton` | 목록 전체 (6개) |
| `JobDetailSkeleton` | 공고 상세 페이지 |
| `UserProfileSkeleton` | 구직자 프로필 |
| `CompanyDashboardSkeleton` | 기업 대시보드 |
| `CompanyJobsSkeleton` | 기업 공고 목록 |
| `TableSkeleton` | 관리자 테이블 |
| `DiagnosisResultSkeleton` | 진단 결과 |
| `FormPageSkeleton` | 폼 페이지 |
| `DiagnosisSkeleton` | 진단 질문 |
| `AdminDashboardSkeleton` | 관리자 대시보드 |

---

## EmptyState

**용도**: 데이터 없음, 검색 결과 없음

```tsx
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}
```

사용 예:
```tsx
<EmptyState
  icon={<SearchX className="w-12 h-12 text-slate-400" />}
  title="검색 결과가 없습니다"
  description="다른 검색어나 필터를 시도해보세요"
  action={<Button variant="outline" onClick={resetFilters}>필터 초기화</Button>}
/>
```

---

## LoadingSpinner

**용도**: 인라인 로딩 인디케이터 (버튼 내, 페이지 중앙 등)

```tsx
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'white' | 'slate'
  label?: string
}
```

- 애니메이션: `animate-spin` (Tailwind CSS, Framer Motion 불사용)
- 접근성: `role="status"` + `aria-label` + `<span className="sr-only">`

---

## StatCard

**용도**: 대시보드 통계 수치

```tsx
interface StatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: { value: number; isPositive: boolean }
  color?: 'blue' | 'green' | 'purple' | 'orange'
}
```

---

## BackToTop

**용도**: 긴 페이지에서 상단으로 돌아가기 버튼

- 스크롤 300px 이상 시 표시 (AnimatePresence)
- 위치: 우하단 고정 (`fixed bottom-6 right-6`)
- 클릭 시 `window.scrollTo({ top: 0, behavior: 'smooth' })`
