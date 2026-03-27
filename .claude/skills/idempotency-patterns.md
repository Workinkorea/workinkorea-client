# Client 역등성 패턴 가이드 (AX 관점)

> **역등성(Idempotency)**: 같은 연산을 여러 번 수행해도 결과가 동일한 성질. `f(f(x)) = f(x)`
> AX 관점에서 클라이언트 역등성은 **"동일한 입력 → 동일한 UI 상태 & 동일한 서버 효과"** 를 보장한다.

---

## 0. 왜 클라이언트에서 역등성이 중요한가

```
사용자 또는 에이전트가:
  - 버튼을 두 번 클릭한다
  - 네트워크 오류 후 재시도한다
  - 같은 페이지를 여러 탭에서 연다
  - 뒤로가기 후 다시 폼을 제출한다

역등성이 없으면 → 중복 주문, 이중 결제, 데이터 불일치
역등성이 있으면 → 안전하게 재시도 가능, 예측 가능한 상태
```

---

## 1. 중복 제출 방지 (Double Submit Prevention)

### 1-1. `isPending` 기반 패턴 (권장)

```tsx
// ✅ React Query의 isPending으로 제출 버튼 자동 비활성화
const { mutate, isPending } = useMutationWithToast({
  mutationFn: (data: JobFormData) => jobsApi.create(data),
  successMessage: '공고가 등록되었습니다',
  redirectUrl: '/company/jobs',
});

return (
  <Button
    type="submit"
    disabled={isPending}   // ← 역등성 보장: 진행 중엔 재클릭 불가
    isLoading={isPending}
  >
    공고 등록
  </Button>
);
```

### 1-2. `useRef` 플래그 패턴 (비동기 경쟁 조건 방어)

```tsx
// ✅ 이중 제출 완전 차단 — ref는 리렌더링에 영향 없음
const isSubmittingRef = useRef(false);

const handleSubmit = async (data: FormData) => {
  if (isSubmittingRef.current) return;   // 이미 처리 중이면 무시
  isSubmittingRef.current = true;

  try {
    await submitMutation.mutateAsync(data);
  } finally {
    isSubmittingRef.current = false;     // 성공/실패 모두 해제
  }
};
```

### 1-3. `useCreateMutation` 활용 (프로젝트 표준)

```tsx
// ✅ 이미 역등성 처리가 내장된 프로젝트 표준 훅
const { mutate, isPending } = useCreateMutation({
  mutationFn: jobsApi.create,
  resourceName: '공고',
  invalidateQueryKeys: [['jobs']],
  redirectUrl: '/company',
});
// → onMutate 에서 loading toast 표시 → 재클릭 방지
// → onSuccess/onError 에서 쿼리 무효화 → 항상 최신 상태
```

---

## 2. 낙관적 업데이트 역등성 (Optimistic Update)

낙관적 업데이트는 "요청 결과를 미리 UI에 반영"하는 패턴. 실패 시 롤백하여 역등성을 보장한다.

```tsx
// ✅ React Query의 낙관적 업데이트 패턴
const queryClient = useQueryClient();

const toggleBookmarkMutation = useMutation({
  mutationFn: (jobId: string) => jobsApi.toggleBookmark(jobId),

  // 1. 즉시 UI 반영 (낙관적)
  onMutate: async (jobId) => {
    // 진행 중인 쿼리 취소 (충돌 방지)
    await queryClient.cancelQueries({ queryKey: ['job', jobId] });

    // 현재 상태 스냅샷 (롤백용)
    const previous = queryClient.getQueryData<Job>(['job', jobId]);

    // 낙관적 업데이트
    queryClient.setQueryData<Job>(['job', jobId], (old) => ({
      ...old!,
      isBookmarked: !old?.isBookmarked,
    }));

    return { previous };  // context로 전달
  },

  // 2. 실패 시 롤백 (역등성 복원)
  onError: (_err, jobId, context) => {
    if (context?.previous) {
      queryClient.setQueryData(['job', jobId], context.previous);
    }
  },

  // 3. 성공/실패 후 서버 상태로 동기화
  onSettled: (_data, _err, jobId) => {
    queryClient.invalidateQueries({ queryKey: ['job', jobId] });
  },
});
```

---

## 3. 요청 중복 제거 (Request Deduplication)

### 3-1. React Query 내장 중복 제거 활용

```tsx
// ✅ 같은 queryKey → 자동 요청 중복 제거 (React Query 내장)
// 여러 컴포넌트가 같은 데이터 요청 시 실제 API는 1번만 호출됨

// CompanyPage.tsx
const { data: company } = useQuery({
  queryKey: ['company', companyId],  // ← 이 키가 역등성 보장의 핵심
  queryFn: () => companyApi.getById(companyId),
});

// CompanyHeader.tsx (같은 페이지에서 동시에 요청해도 1번만 호출)
const { data: company } = useQuery({
  queryKey: ['company', companyId],  // ← 동일 키 → 캐시에서 반환
  queryFn: () => companyApi.getById(companyId),
});
```

### 3-2. 검색 입력 역등성 (`useDebounce`)

```tsx
// ✅ 연속 입력 중복 요청 방지
const [query, setQuery] = useState('');
const debouncedQuery = useDebounce(query, 400);

const { data: results } = useQuery({
  queryKey: ['jobs', 'search', debouncedQuery],  // 안정적 키
  queryFn: () => jobsApi.search(debouncedQuery),
  enabled: debouncedQuery.length >= 2,
  staleTime: 1000 * 30,  // 30초 내 같은 검색 → 캐시 반환
});

// ❌ 잘못된 패턴: 디바운스 없이 onChange마다 요청
const handleChange = (e) => {
  fetchJobs(e.target.value);  // 키 입력마다 API 호출
};
```

---

## 4. 디자인 토큰 역등성 (Design Token Idempotency)

**디자인 토큰 역등성** = 같은 의미의 값을 어디서든 동일한 클래스/변수로 표현.
위반 시: 같은 색상이 다른 컴포넌트에서 다르게 보이는 불일치 발생.

### 4-1. Canonical 클래스 규칙

```tsx
// ❌ 위반 — Tailwind 기본 크기 클래스 직접 사용
<p className="text-sm">텍스트</p>           // text-sm = 14px (하드코딩)
<h2 className="text-lg">제목</h2>           // text-lg = 18px (하드코딩)
<span className="text-[13px]">캡션</span>   // 임의 픽셀 (절대 금지)

// ✅ 올바름 — Canonical 클래스 (globals.css @theme 정의)
<p className="text-body-3">텍스트</p>       // → 14px (토큰 참조)
<h2 className="text-title-5">제목</h2>      // → 17px (토큰 참조)
<span className="text-caption-1">캡션</span>// → 13px (토큰 참조)
```

```
Typography Canonical 매핑:
  display-1 → 48px   display-2 → 40px
  title-1   → 32px   title-2   → 28px   title-3 → 24px
  title-4   → 20px   title-5   → 17px
  body-1    → 16px   body-2    → 15px   body-3  → 14px
  caption-1 → 13px   caption-2 → 12px   caption-3 → 11px
```

### 4-2. 색상 토큰 역등성

```tsx
// ❌ 위반 — Tailwind 기본 slate 직접 사용 (토큰 우회)
<p className="text-slate-800">본문</p>      // slate-800 ≠ 보장된 토큰
<p className="text-gray-600">보조</p>       // gray ≠ 디자인 시스템

// ✅ 올바름 — 시맨틱 토큰 클래스 사용
<p className="text-label-800">본문</p>      // → #1E293B (토큰 보장)
<p className="text-label-600">보조</p>      // → #475569 (토큰 보장)
<p className="text-label-400">플레이스홀더</p> // → #94A3B8

// 컬러 토큰 시맨틱 매핑:
// label-900 → 제목(가장 강조)    label-800 → 본문 기본
// label-700 → 레이블/강조 본문   label-600 → 보조 본문
// label-500 → 서브텍스트         label-400 → 캡션/placeholder
// label-300 → 비활성
//
// primary-600 → 주요 액션        primary-50 → 배경 tint
// status-error → 에러            status-correct → 성공
```

### 4-3. Figma ↔ 코드 동기화 체크

```
Figma Variable          CSS 변수                   Tailwind 클래스
─────────────────────────────────────────────────────────────────
Color/Primary/600    → --color-primary-600       → bg-primary-600
Color/Label/800      → --color-label-800         → text-label-800
Color/Status/error   → --color-status-error      → text-status-error
Typography/Size/body-3 → --text-body-3 (13px)   → text-body-3
```

---

## 5. 폼 상태 역등성 (Form State Idempotency)

### 5-1. `reset()` 역등성 보장

```tsx
// ✅ 폼 리셋은 항상 같은 초기 상태로 돌아가야 한다
const DEFAULT_VALUES: JobFormData = {
  title: '',
  description: '',
  salary: null,
  visaType: [],
};

const form = useForm<JobFormData>({
  defaultValues: DEFAULT_VALUES,  // ← 역등성의 기준점
});

// 제출 성공 후 리셋
const onSuccess = () => {
  form.reset(DEFAULT_VALUES);  // ← 항상 동일한 초기 상태 (역등성)
  clearFormData();             // localStorage 정리
};

// ❌ 잘못된 패턴: reset()만 호출 (현재 값으로 리셋될 수 있음)
form.reset();  // defaultValues 없으면 현재 값이 새 기본값이 됨
```

### 5-2. `useFormPersist` + `useClearFormPersist` 패턴

```tsx
// ✅ 폼 지속성 + 제출 후 명시적 클리어 = 역등성 사이클 완성
const form = useForm<SignupData>({ defaultValues: SIGNUP_DEFAULTS });
const clearFormData = useClearFormPersist('signup-form');

// 자동 저장 (1초 디바운스)
useFormPersistWithReactHookForm('signup-form', form, {
  excludeFields: ['password', 'confirmPassword'],  // 민감 데이터 제외
});

const onSubmit = async (data: SignupData) => {
  try {
    await signupMutation.mutateAsync(data);
    clearFormData();           // ← 성공 후 저장 데이터 클리어
    form.reset(SIGNUP_DEFAULTS); // ← 역등성 복원
  } catch {
    // 실패 시 저장 데이터 유지 (재시도 가능)
  }
};
```

---

## 6. 렌더링 역등성 (Pure Component Pattern)

### 6-1. 순수 컴포넌트 보장

```tsx
// ✅ 같은 props → 반드시 같은 렌더링 결과
// JobCard: variant, status, salary 등 동일 props → 동일 UI

// ❌ 위반: 렌더 중 사이드 이펙트
const JobCard = ({ job }: { job: Job }) => {
  console.log('render', job.id);  // 사이드 이펙트 (제거)
  analytics.track('card_view');   // 렌더 중 추적 금지
  return <div>{job.title}</div>;
};

// ✅ 올바름: 순수 렌더링, 사이드 이펙트는 useEffect로
const JobCard = ({ job }: { job: Job }) => {
  useEffect(() => {
    analytics.track('card_view', { jobId: job.id });
  }, [job.id]);  // 마운트 시 1회만

  return <div>{job.title}</div>;
};
```

### 6-2. `useEffect` 역등성 (클린업 필수)

```tsx
// ✅ 클린업으로 역등성 보장
useEffect(() => {
  // ESC 키 리스너 등록
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };
  document.addEventListener('keydown', handleEscape);

  // 클린업: 언마운트 시 제거 (중복 등록 방지)
  return () => {
    document.removeEventListener('keydown', handleEscape);
  };
}, [onClose]);  // 의존성 배열로 재등록 조건 명시

// ❌ 클린업 없으면: 컴포넌트가 여러 번 마운트 시 리스너 중복 등록
```

---

## 7. 쿼리 무효화 역등성 (Cache Invalidation)

```tsx
// ✅ 서버 변경 후 관련 쿼리 일괄 무효화 = 캐시 일관성 보장
const { mutate } = useMutationWithToast({
  mutationFn: jobsApi.update,
  successMessage: '공고가 수정되었습니다',
  invalidateQueryKeys: [
    ['jobs'],            // 목록 쿼리 무효화
    ['job', jobId],      // 단건 쿼리 무효화
    ['company', 'jobs'], // 회사별 공고 무효화
  ],
  // 세 쿼리 모두 무효화 → 다음 접근 시 서버에서 재요청
  // 결과: 어떤 순서로 무효화해도 최종 상태는 동일 (역등성)
});
```

---

## 8. 실전 체크리스트

```
폼 제출 전:
  □ isPending으로 버튼 disabled 처리했는가?
  □ defaultValues가 상수로 정의되어 있는가?
  □ 비밀번호 등 민감 필드를 excludeFields에 추가했는가?

API 연동 시:
  □ useMutationWithToast (또는 파생 훅) 사용했는가?
  □ invalidateQueryKeys에 관련 쿼리 모두 포함했는가?
  □ onError 시 사용자에게 재시도 가능하다는 피드백 제공했는가?

컴포넌트 작성 시:
  □ useEffect에 클린업 함수 있는가?
  □ 렌더 함수 내 사이드 이펙트 없는가?
  □ text-sm / text-lg 등 금지된 타이포그래피 클래스 없는가?
  □ text-slate-* 대신 text-label-* 사용했는가?
  □ 임의 픽셀값(text-[13px]) 없는가?

디자인 토큰:
  □ Figma 변수(Color/*, Typography/*)와 CSS 변수 일치하는가?
  □ 신규 컴포넌트에 canonical 클래스만 사용했는가?
```

---

## 9. 역등성 위반 감지 도구

```tsx
// shared/lib/utils/idempotency-guard.ts
// 개발 환경에서 역등성 위반 감지

export function assertIdempotentReset<T>(
  currentValues: T,
  defaultValues: T,
  formName: string
) {
  if (process.env.NODE_ENV !== 'development') return;

  const diff = Object.entries(defaultValues as Record<string, unknown>)
    .filter(([key, val]) => (currentValues as Record<string, unknown>)[key] !== val);

  if (diff.length > 0) {
    console.warn(
      `[역등성 경고] ${formName} reset() 호출 시 defaultValues와 불일치:`,
      Object.fromEntries(diff)
    );
  }
}

// 사용법:
// assertIdempotentReset(form.getValues(), DEFAULT_VALUES, 'signup-form');
```

---

*작성일: 2026-03-26 | Work in Korea Client 역등성 패턴 가이드 v1.0*
*위 패턴들은 globals.css 디자인 토큰, useMutationWithToast, useFormPersist 등 기존 코드와 완전 연동됨*
