---
name: testing-patterns
description: Testing patterns for Vitest and React Testing Library
---

# 테스팅 패턴 (Testing Patterns)

## 목적
이 스킬은 Vitest와 React Testing Library를 활용한 테스트 작성 패턴을 제공합니다.

## 사용 시점
- 컴포넌트 구현 후 테스트 작성 시
- 유틸리티 함수 테스트 시
- API 호출 로직 테스트 시
- 훅 테스트 시

## 테스트 명령어

```bash
# 전체 테스트 실행
npm run test

# 테스트 UI
npm run test:ui

# 워치 모드
npm run test:watch

# 커버리지
npm run test:coverage

# E2E API 테스트
npm run test:e2e

# 유닛 테스트만
npm run test:unit
```

## 컴포넌트 테스트 패턴

### 1. 기본 컴포넌트 테스트

```typescript
// src/features/jobs/components/JobCard.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JobCard } from './JobCard';

describe('JobCard', () => {
  const mockJob = {
    id: '1',
    title: 'Frontend Developer',
    company: 'Tech Corp',
    location: 'Seoul',
    salary: 40000000,
  };

  it('renders job information correctly', () => {
    render(<JobCard job={mockJob} />);

    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    expect(screen.getByText('Seoul')).toBeInTheDocument();
    expect(screen.getByText('40,000,000원')).toBeInTheDocument();
  });

  it('applies correct className', () => {
    const { container } = render(<JobCard job={mockJob} />);
    expect(container.firstChild).toHaveClass('bg-white', 'rounded-lg');
  });
});
```

### 2. 사용자 이벤트 테스트

```typescript
// src/features/jobs/components/JobCard.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JobCard } from './JobCard';

describe('JobCard - User Interactions', () => {
  it('calls onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<JobCard job={mockJob} onClick={handleClick} />);

    await user.click(screen.getByRole('button', { name: /지원하기/i }));

    expect(handleClick).toHaveBeenCalledOnce();
    expect(handleClick).toHaveBeenCalledWith(mockJob.id);
  });

  it('toggles bookmark on button click', async () => {
    const handleBookmark = vi.fn();
    const user = userEvent.setup();

    render(<JobCard job={mockJob} onBookmark={handleBookmark} />);

    const bookmarkButton = screen.getByRole('button', { name: /북마크/i });
    await user.click(bookmarkButton);

    expect(handleBookmark).toHaveBeenCalledWith(mockJob.id);
  });
});
```

### 3. 조건부 렌더링 테스트

```typescript
// src/features/jobs/components/JobCard.test.tsx
describe('JobCard - Conditional Rendering', () => {
  it('shows bookmark button for authenticated users', () => {
    render(<JobCard job={mockJob} isAuthenticated={true} />);
    expect(screen.getByRole('button', { name: /북마크/i })).toBeInTheDocument();
  });

  it('hides bookmark button for unauthenticated users', () => {
    render(<JobCard job={mockJob} isAuthenticated={false} />);
    expect(screen.queryByRole('button', { name: /북마크/i })).not.toBeInTheDocument();
  });

  it('shows salary when provided', () => {
    render(<JobCard job={{ ...mockJob, salary: 40000000 }} />);
    expect(screen.getByText('40,000,000원')).toBeInTheDocument();
  });

  it('shows "협의" when salary is null', () => {
    render(<JobCard job={{ ...mockJob, salary: null }} />);
    expect(screen.getByText('협의')).toBeInTheDocument();
  });
});
```

## 폼 테스트 패턴

### 1. 기본 폼 테스트

```typescript
// src/features/auth/components/LoginForm.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('renders all form fields', () => {
    render(<LoginForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/이메일/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/비밀번호/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /로그인/i })).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(<LoginForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/이메일/i), 'test@example.com');
    await user.type(screen.getByLabelText(/비밀번호/i), 'password123');
    await user.click(screen.getByRole('button', { name: /로그인/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});
```

### 2. 유효성 검사 테스트

```typescript
// src/features/auth/components/LoginForm.test.tsx
import { waitFor } from '@testing-library/react';

describe('LoginForm - Validation', () => {
  it('shows error for invalid email', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={vi.fn()} />);

    const emailInput = screen.getByLabelText(/이메일/i);
    await user.type(emailInput, 'invalid-email');
    await user.tab(); // Trigger blur event

    await waitFor(() => {
      expect(screen.getByText(/올바른 이메일 형식이 아닙니다/i)).toBeInTheDocument();
    });
  });

  it('shows error for short password', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={vi.fn()} />);

    const passwordInput = screen.getByLabelText(/비밀번호/i);
    await user.type(passwordInput, '123');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/비밀번호는 최소 8자 이상이어야 합니다/i)).toBeInTheDocument();
    });
  });

  it('does not submit form with validation errors', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(<LoginForm onSubmit={handleSubmit} />);

    await user.click(screen.getByRole('button', { name: /로그인/i }));

    await waitFor(() => {
      expect(handleSubmit).not.toHaveBeenCalled();
    });
  });
});
```

### 3. 로딩 상태 테스트

```typescript
describe('LoginForm - Loading State', () => {
  it('disables submit button while submitting', async () => {
    const handleSubmit = vi.fn(() => new Promise(resolve => setTimeout(resolve, 1000)));
    const user = userEvent.setup();

    render(<LoginForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/이메일/i), 'test@example.com');
    await user.type(screen.getByLabelText(/비밀번호/i), 'password123');

    const submitButton = screen.getByRole('button', { name: /로그인/i });
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/로그인 중.../i)).toBeInTheDocument();
  });
});
```

## 훅 테스트 패턴

### 1. 기본 훅 테스트

```typescript
// src/shared/hooks/useDebounce.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('test', 500));
    expect(result.current).toBe('test');
  });

  it('debounces value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // 값 변경
    rerender({ value: 'updated', delay: 500 });
    expect(result.current).toBe('initial'); // 아직 이전 값

    // 시간 경과
    vi.advanceTimersByTime(500);
    await waitFor(() => {
      expect(result.current).toBe('updated');
    });
  });
});
```

### 2. React Query 훅 테스트

```typescript
// src/features/jobs/hooks/useJobs.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useJobs } from './useJobs';
import * as jobsApi from '../api/jobs';

vi.mock('../api/jobs');

describe('useJobs', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  afterEach(() => {
    queryClient.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('fetches jobs successfully', async () => {
    const mockJobs = [
      { id: '1', title: 'Job 1' },
      { id: '2', title: 'Job 2' },
    ];

    vi.mocked(jobsApi.getJobs).mockResolvedValue(mockJobs);

    const { result } = renderHook(() => useJobs(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockJobs);
    expect(jobsApi.getJobs).toHaveBeenCalledOnce();
  });

  it('handles fetch error', async () => {
    const error = new Error('Failed to fetch');
    vi.mocked(jobsApi.getJobs).mockRejectedValue(error);

    const { result } = renderHook(() => useJobs(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });
});
```

## 유틸리티 함수 테스트 패턴

```typescript
// src/shared/lib/formatters.test.ts
import { describe, it, expect } from 'vitest';
import { formatSalary, formatDate, formatPhoneNumber } from './formatters';

describe('formatSalary', () => {
  it('formats salary with commas', () => {
    expect(formatSalary(40000000)).toBe('40,000,000원');
    expect(formatSalary(1000)).toBe('1,000원');
    expect(formatSalary(0)).toBe('0원');
  });

  it('handles null and undefined', () => {
    expect(formatSalary(null)).toBe('협의');
    expect(formatSalary(undefined)).toBe('협의');
  });
});

describe('formatDate', () => {
  it('formats date in Korean format', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('2024년 1월 15일');
  });

  it('formats relative date', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    expect(formatDate(yesterday, { relative: true })).toBe('1일 전');
  });
});

describe('formatPhoneNumber', () => {
  it('formats Korean phone numbers', () => {
    expect(formatPhoneNumber('01012345678')).toBe('010-1234-5678');
    expect(formatPhoneNumber('0212345678')).toBe('02-1234-5678');
  });

  it('handles already formatted numbers', () => {
    expect(formatPhoneNumber('010-1234-5678')).toBe('010-1234-5678');
  });

  it('returns original for invalid format', () => {
    expect(formatPhoneNumber('invalid')).toBe('invalid');
  });
});
```

## API 테스트 패턴 (E2E)

```typescript
// tests/api/jobs.test.ts
import { describe, it, expect } from 'vitest';
import { fetchClient } from '@/shared/api/fetchClient';

describe('Jobs API', () => {
  it('GET /api/posts/company - fetches job listings', async () => {
    const response = await fetchClient.get('/api/posts/company');

    expect(response).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);

    if (response.data.length > 0) {
      const job = response.data[0];
      expect(job).toHaveProperty('id');
      expect(job).toHaveProperty('title');
      expect(job).toHaveProperty('company');
    }
  });

  it('GET /api/posts/company/:id - fetches single job', async () => {
    // 먼저 목록에서 ID 가져오기
    const listResponse = await fetchClient.get('/api/posts/company');
    const firstJobId = listResponse.data[0].id;

    const response = await fetchClient.get(`/api/posts/company/${firstJobId}`);

    expect(response).toBeDefined();
    expect(response.id).toBe(firstJobId);
    expect(response).toHaveProperty('title');
    expect(response).toHaveProperty('description');
  });

  it('POST /api/posts/company - creates new job (authenticated)', async () => {
    const newJob = {
      title: 'Test Job',
      description: 'Test Description',
      location: 'Seoul',
      salary: 40000000,
    };

    const response = await fetchClient.post('/api/posts/company', newJob);

    expect(response).toBeDefined();
    expect(response.title).toBe(newJob.title);
    expect(response).toHaveProperty('id');

    // 생성된 데이터 정리
    await fetchClient.delete(`/api/posts/company/${response.id}`);
  });
});
```

## Mock 패턴

### 1. API Mock

```typescript
// src/features/jobs/__mocks__/jobsApi.ts
import type { Job } from '../types/job';

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'Tech Corp',
    location: 'Seoul',
    salary: 40000000,
  },
  {
    id: '2',
    title: 'Backend Developer',
    company: 'Software Inc',
    location: 'Busan',
    salary: 45000000,
  },
];

export const getJobs = vi.fn().mockResolvedValue(mockJobs);
export const getJob = vi.fn().mockResolvedValue(mockJobs[0]);
export const createJob = vi.fn().mockResolvedValue({ ...mockJobs[0], id: '3' });
```

### 2. Next.js Router Mock

```typescript
// vitest.setup.ts or test file
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/test-path',
  useSearchParams: () => new URLSearchParams(),
}));
```

### 3. React Query Provider Mock

```typescript
// src/shared/test-utils/queryProvider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = createQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

## 테스트 유틸리티

### 1. Custom Render

```typescript
// src/shared/test-utils/render.tsx
import { render, RenderOptions } from '@testing-library/react';
import { QueryProvider } from './queryProvider';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  withQuery?: boolean;
}

export function customRender(
  ui: React.ReactElement,
  { withQuery = true, ...options }: CustomRenderOptions = {}
) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    if (withQuery) {
      return <QueryProvider>{children}</QueryProvider>;
    }
    return <>{children}</>;
  };

  return render(ui, { wrapper: Wrapper, ...options });
}

// 사용 예시
import { customRender as render } from '@/shared/test-utils/render';

test('component with query', () => {
  render(<MyComponent />, { withQuery: true });
});
```

### 2. Test Helpers

```typescript
// src/shared/test-utils/helpers.ts
export function waitForLoadingToFinish() {
  return waitFor(() => {
    expect(screen.queryByText(/로딩/i)).not.toBeInTheDocument();
  });
}

export function fillForm(fields: Record<string, string>) {
  return Promise.all(
    Object.entries(fields).map(([label, value]) => {
      const input = screen.getByLabelText(new RegExp(label, 'i'));
      return userEvent.type(input, value);
    })
  );
}

export async function submitForm() {
  const user = userEvent.setup();
  const submitButton = screen.getByRole('button', { name: /제출/i });
  await user.click(submitButton);
}
```

## 체크리스트

### 테스트 작성 시
- [ ] AAA 패턴 (Arrange-Act-Assert)
- [ ] 사용자 중심 쿼리 (`getByRole`, `getByLabelText`)
- [ ] `userEvent` 사용 (fireEvent 대신)
- [ ] 비동기 처리 (`waitFor`, `findBy*`)
- [ ] Mock 최소화
- [ ] 명확한 테스트 설명

### 컴포넌트 테스트
- [ ] 렌더링 테스트
- [ ] 사용자 인터랙션 테스트
- [ ] 조건부 렌더링 테스트
- [ ] 에러 상태 테스트
- [ ] 접근성 확인

### 폼 테스트
- [ ] 모든 필드 렌더링 확인
- [ ] 유효성 검사 테스트
- [ ] 제출 로직 테스트
- [ ] 로딩 상태 테스트

### 훅 테스트
- [ ] `renderHook` 사용
- [ ] Provider 래핑
- [ ] 반환값 검증
- [ ] 에러 케이스 테스트

## 참고 자료

- [Vitest 공식 문서](https://vitest.dev/)
- [React Testing Library 공식 문서](https://testing-library.com/react)
- [testing-specialist 에이전트](/.claude/agents/testing-specialist.md)
