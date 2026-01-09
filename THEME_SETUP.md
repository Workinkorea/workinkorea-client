# Dark/Light Mode Theme Setup Guide

## Overview

다크모드와 라이트모드가 성공적으로 구현되었습니다. 이 문서는 테마 시스템 사용 방법을 설명합니다.

## Architecture

### 1. **Technology Stack**
- **next-themes**: React/Next.js 테마 관리 라이브러리
- **Tailwind CSS v4**: CSS 변수 기반 스타일링
- **CSS Variables**: 동적 색상 변경 지원

### 2. **File Structure**

```
src/
├── app/
│   ├── layout.tsx                      # ThemeProvider 적용됨
│   └── globals.css                     # Dark/Light 모드 CSS 변수 정의
├── shared/
│   ├── lib/
│   │   └── providers/
│   │       └── ThemeProvider.tsx       # next-themes wrapper
│   └── ui/
│       └── ThemeToggle.tsx             # 테마 전환 버튼 컴포넌트
```

---

## How It Works

### 1. **CSS Variables** (`globals.css`)

#### Light Mode (기본값)
```css
:root {
  --color-background-default: #FFFFFF;
  --color-background-alternative: #F5F6FA;
  --color-label-900: #0D0E0E;
  --color-label-700: #6E747E;
  /* ... 기타 색상 변수 */
}
```

#### Dark Mode
```css
.dark {
  --color-background-default: #0a0a0a;
  --color-background-alternative: #1a1a1a;
  --color-label-900: #ededed;
  --color-label-700: #a3a3a3;
  /* ... 기타 색상 변수 */
}
```

### 2. **ThemeProvider** (`src/shared/lib/providers/ThemeProvider.tsx`)

`next-themes`를 래핑한 Provider 컴포넌트:
- `attribute="class"`: HTML에 `.dark` 또는 `.light` 클래스 추가
- `defaultTheme="system"`: 시스템 설정 기본값
- `enableSystem`: OS 테마 설정 감지
- `disableTransitionOnChange`: 테마 전환 시 애니메이션 비활성화 (깜빡임 방지)

### 3. **ThemeToggle Component** (`src/shared/ui/ThemeToggle.tsx`)

사용자가 테마를 전환할 수 있는 토글 버튼:
- **라이트 모드**: 해 아이콘 표시
- **다크 모드**: 달 아이콘 표시
- **Hydration Mismatch 방지**: `mounted` 상태로 SSR/CSR 불일치 해결

---

## Usage Guide

### 1. **ThemeToggle 컴포넌트 사용하기**

어떤 페이지든 ThemeToggle을 import하여 사용할 수 있습니다:

```tsx
import { ThemeToggle } from '@/shared/ui/ThemeToggle';

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <h1>My App</h1>
      <ThemeToggle />
    </header>
  );
}
```

### 2. **프로그래밍 방식으로 테마 제어**

컴포넌트 내에서 `useTheme` 훅을 사용할 수 있습니다:

```tsx
'use client';

import { useTheme } from 'next-themes';

export default function CustomThemeControl() {
  const { theme, setTheme, systemTheme } = useTheme();

  return (
    <div>
      <p>현재 테마: {theme}</p>
      <p>시스템 테마: {systemTheme}</p>

      <button onClick={() => setTheme('light')}>라이트 모드</button>
      <button onClick={() => setTheme('dark')}>다크 모드</button>
      <button onClick={() => setTheme('system')}>시스템 설정</button>
    </div>
  );
}
```

### 3. **CSS 변수 사용하기**

컴포넌트에서 정의된 CSS 변수를 직접 사용:

```tsx
export default function MyComponent() {
  return (
    <div className="bg-[var(--color-background-default)] text-[var(--color-label-900)]">
      <h1>자동으로 다크/라이트 모드 적용</h1>
    </div>
  );
}
```

또는 Tailwind 유틸리티 클래스 사용:

```tsx
export default function MyComponent() {
  return (
    <div className="bg-background-default text-label-900">
      <h1>Tailwind 클래스로 테마 적용</h1>
    </div>
  );
}
```

---

## Best Practices

### 1. **Hydration Mismatch 방지**

테마를 사용하는 클라이언트 컴포넌트에서는 항상 `mounted` 체크:

```tsx
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemedComponent() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>로딩...</div>;
  }

  return <div>현재 테마: {theme}</div>;
}
```

### 2. **CSS Variables를 우선 사용**

직접 색상값 대신 CSS 변수를 사용하면 자동으로 테마가 적용됩니다:

❌ **나쁜 예**
```tsx
<div className="bg-white text-black">
  컨텐츠
</div>
```

✅ **좋은 예**
```tsx
<div className="bg-[var(--color-background-default)] text-[var(--color-label-900)]">
  컨텐츠
</div>
```

### 3. **새로운 색상 추가하기**

`globals.css`의 `@theme` 블록과 `:root`, `.dark` 섹션에 추가:

```css
@theme {
  --color-accent-500: #3B82F6;
}

:root {
  --color-accent-500: #3B82F6;
}

.dark {
  --color-accent-500: #60A5FA;
}
```

---

## Example: Header with ThemeToggle

```tsx
// src/shared/components/Header.tsx
'use client';

import { ThemeToggle } from '@/shared/ui/ThemeToggle';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-line-400)] bg-[var(--color-background-default)]">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <h1 className="text-title-2 text-[var(--color-label-900)]">
          Work In Korea
        </h1>

        <nav className="flex items-center gap-4">
          <a href="/login" className="text-body-3 text-[var(--color-label-700)] hover:text-[var(--color-primary-500)]">
            로그인
          </a>
          <a href="/signup" className="text-body-3 text-[var(--color-label-700)] hover:text-[var(--color-primary-500)]">
            회원가입
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
```

---

## Testing

### Manual Testing

1. **테마 토글 버튼 클릭**: 즉시 다크/라이트 모드 전환 확인
2. **페이지 새로고침**: 선택한 테마가 유지되는지 확인 (localStorage 저장)
3. **시스템 설정 변경**: OS 다크모드 설정 변경 시 자동 반영 확인

### Browser DevTools

1. F12 → Application → Local Storage
2. `theme` 키 확인 (`light`, `dark`, `system`)

---

## Troubleshooting

### 문제: 테마가 변경되지 않음
- `ThemeProvider`가 `layout.tsx`에 제대로 추가되었는지 확인
- CSS 변수가 `globals.css`에 정의되어 있는지 확인

### 문제: Hydration Mismatch 에러
- 클라이언트 컴포넌트에서 `mounted` 상태 체크 추가
- `suppressHydrationWarning={true}`를 `<html>` 또는 `<body>`에 추가 (이미 적용됨)

### 문제: 색상이 반영되지 않음
- CSS 변수 이름이 올바른지 확인 (예: `var(--color-background-default)`)
- Tailwind config에 색상이 정의되어 있는지 확인

---

## Next Steps

1. **모든 기존 컴포넌트에 다크모드 스타일 적용**
   - `bg-white` → `bg-[var(--color-background-default)]`
   - `text-black` → `text-[var(--color-label-900)]`
   - `border-gray-200` → `border-[var(--color-line-400)]`

2. **Header/Navigation에 ThemeToggle 추가**
   - 사용자가 쉽게 테마를 전환할 수 있도록 배치

3. **컴포넌트별 다크모드 테스트**
   - SignupComponent
   - CompanySignupComponent
   - 기타 주요 페이지

---

## Summary

✅ **완료된 작업**:
- `next-themes` 설치 및 설정
- `ThemeProvider` 생성 및 `layout.tsx`에 적용
- CSS 변수 기반 다크/라이트 모드 색상 정의
- `ThemeToggle` 컴포넌트 생성
- Body 배경색 자동 전환 적용

🎉 **이제 다크모드가 정상적으로 작동합니다!**
