---
name: form-patterns
description: Form management patterns using React Hook Form and Zod
---

# 폼 관리 패턴 (Form Management Patterns)

## 목적
이 스킬은 React Hook Form과 Zod를 활용한 폼 관리 패턴을 제공합니다.

## 사용 시점
- 사용자 입력 폼 구현 시
- 데이터 유효성 검사 시
- 폼 제출 및 에러 처리 시

## 핵심 원칙

1. **타입 안정성**: Zod 스키마에서 타입 자동 추론
2. **선언적 검증**: Zod 스키마로 유효성 규칙 정의
3. **성능 최적화**: React Hook Form의 비제어 컴포넌트 활용
4. **사용자 경험**: 실시간 검증 및 명확한 에러 메시지

## Zod 스키마 패턴

### 1. 기본 스키마

```typescript
// src/features/auth/validations/authSchema.ts
import { z } from 'zod';

// 로그인 스키마
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다'),

  password: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다'),
});

// 타입 자동 추론
export type LoginFormData = z.infer<typeof loginSchema>;
```

### 2. 복잡한 유효성 검사

```typescript
// src/features/auth/validations/signupSchema.ts
import { z } from 'zod';

export const signupSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다'),

  password: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      '비밀번호는 대문자, 소문자, 숫자를 포함해야 합니다'
    ),

  confirmPassword: z
    .string()
    .min(1, '비밀번호 확인을 입력해주세요'),

  name: z
    .string()
    .min(1, '이름을 입력해주세요')
    .max(50, '이름은 50자 이내로 입력해주세요'),

  phone: z
    .string()
    .regex(/^01[0-9]{1}-?[0-9]{4}-?[0-9]{4}$/, '올바른 전화번호 형식이 아닙니다')
    .optional(),

  birthDate: z
    .date({
      required_error: '생년월일을 선택해주세요',
      invalid_type_error: '올바른 날짜 형식이 아닙니다',
    })
    .max(new Date(), '미래 날짜는 선택할 수 없습니다'),

  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: '이용약관에 동의해주세요',
    }),

  // 조건부 필드
  userType: z.enum(['NORMAL', 'COMPANY']),

  companyName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword'],
}).refine((data) => {
  // 기업 회원일 경우 회사명 필수
  if (data.userType === 'COMPANY') {
    return !!data.companyName;
  }
  return true;
}, {
  message: '회사명을 입력해주세요',
  path: ['companyName'],
});

export type SignupFormData = z.infer<typeof signupSchema>;
```

### 3. 중첩 객체 및 배열

```typescript
// src/features/resume/validations/resumeSchema.ts
import { z } from 'zod';

// 경력 사항 스키마
const experienceSchema = z.object({
  company: z.string().min(1, '회사명을 입력해주세요'),
  position: z.string().min(1, '직책을 입력해주세요'),
  startDate: z.date(),
  endDate: z.date().optional(),
  description: z.string().optional(),
}).refine((data) => {
  if (data.endDate) {
    return data.startDate <= data.endDate;
  }
  return true;
}, {
  message: '종료일은 시작일 이후여야 합니다',
  path: ['endDate'],
});

// 학력 사항 스키마
const educationSchema = z.object({
  school: z.string().min(1, '학교명을 입력해주세요'),
  major: z.string().min(1, '전공을 입력해주세요'),
  degree: z.enum(['HIGH_SCHOOL', 'ASSOCIATE', 'BACHELOR', 'MASTER', 'DOCTORATE']),
  graduationDate: z.date(),
});

// 이력서 스키마
export const resumeSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요'),

  profile: z.object({
    name: z.string().min(1, '이름을 입력해주세요'),
    email: z.string().email('올바른 이메일 형식이 아닙니다'),
    phone: z.string().min(1, '전화번호를 입력해주세요'),
  }),

  experiences: z.array(experienceSchema).min(1, '최소 1개의 경력을 입력해주세요'),

  educations: z.array(educationSchema).min(1, '최소 1개의 학력을 입력해주세요'),

  skills: z.array(z.string()).min(1, '최소 1개의 기술을 입력해주세요'),
});

export type ResumeFormData = z.infer<typeof resumeSchema>;
```

## React Hook Form 패턴

### 1. 기본 폼

```typescript
// src/features/auth/components/LoginForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../validations/authSchema';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="이메일"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />

      <Input
        label="비밀번호"
        type="password"
        {...register('password')}
        error={errors.password?.message}
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? '로그인 중...' : '로그인'}
      </Button>
    </form>
  );
}
```

### 2. 필드 배열 (동적 필드)

```typescript
// src/features/resume/components/ExperienceFields.tsx
'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import type { ResumeFormData } from '../validations/resumeSchema';

export function ExperienceFields() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ResumeFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experiences',
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">경력 사항</h3>

      {fields.map((field, index) => (
        <div key={field.id} className="border rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">경력 {index + 1}</h4>
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 hover:text-red-700"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            )}
          </div>

          <Input
            label="회사명"
            {...register(`experiences.${index}.company`)}
            error={errors.experiences?.[index]?.company?.message}
          />

          <Input
            label="직책"
            {...register(`experiences.${index}.position`)}
            error={errors.experiences?.[index]?.position?.message}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="시작일"
              type="date"
              {...register(`experiences.${index}.startDate`)}
              error={errors.experiences?.[index]?.startDate?.message}
            />

            <Input
              label="종료일 (선택)"
              type="date"
              {...register(`experiences.${index}.endDate`)}
              error={errors.experiences?.[index]?.endDate?.message}
            />
          </div>

          <Input
            label="업무 설명 (선택)"
            {...register(`experiences.${index}.description`)}
            error={errors.experiences?.[index]?.description?.message}
          />
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => append({
          company: '',
          position: '',
          startDate: new Date(),
          endDate: undefined,
          description: '',
        })}
        className="w-full"
      >
        <PlusIcon className="w-4 h-4 mr-2" />
        경력 추가
      </Button>
    </div>
  );
}
```

### 3. 파일 업로드

```typescript
// src/features/profile/components/ProfileImageUpload.tsx
'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import Image from 'next/image';
import { UploadIcon, XIcon } from 'lucide-react';

export function ProfileImageUpload() {
  const { register, setValue, watch } = useFormContext();
  const [preview, setPreview] = useState<string | null>(null);

  const imageFile = watch('profileImage');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // 폼에 파일 설정
      setValue('profileImage', file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setValue('profileImage', null);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">프로필 이미지</label>

      {preview ? (
        <div className="relative w-32 h-32 rounded-full overflow-hidden">
          <Image
            src={preview}
            alt="프로필 미리보기"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:border-blue-500">
          <div className="text-center">
            <UploadIcon className="w-8 h-8 mx-auto text-gray-400" />
            <span className="text-xs text-gray-500 mt-1">업로드</span>
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      )}
    </div>
  );
}
```

### 4. 조건부 필드

```typescript
// src/features/auth/components/SignupForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormData } from '../validations/signupSchema';

export function SignupForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const userType = watch('userType');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* 공통 필드 */}
      <Input label="이메일" {...register('email')} error={errors.email?.message} />
      <Input label="비밀번호" type="password" {...register('password')} error={errors.password?.message} />

      {/* 사용자 타입 선택 */}
      <div>
        <label className="block text-sm font-medium mb-2">회원 유형</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input type="radio" value="NORMAL" {...register('userType')} />
            <span className="ml-2">일반 회원</span>
          </label>
          <label className="flex items-center">
            <input type="radio" value="COMPANY" {...register('userType')} />
            <span className="ml-2">기업 회원</span>
          </label>
        </div>
      </div>

      {/* 일반 회원 전용 필드 */}
      {userType === 'NORMAL' && (
        <>
          <Input label="국적" {...register('nationality')} error={errors.nationality?.message} />
          <Input label="전화번호" {...register('phone')} error={errors.phone?.message} />
        </>
      )}

      {/* 기업 회원 전용 필드 */}
      {userType === 'COMPANY' && (
        <>
          <Input label="회사명" {...register('companyName')} error={errors.companyName?.message} />
          <Input label="사업자등록번호" {...register('businessNumber')} error={errors.businessNumber?.message} />
        </>
      )}

      <Button type="submit">회원가입</Button>
    </form>
  );
}
```

### 5. 실시간 검증

```typescript
// src/features/auth/components/EmailField.tsx
'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { Input } from '@/shared/ui/Input';
import { checkEmailAvailability } from '../api/checkEmail';

export function EmailField() {
  const { register, formState: { errors } } = useFormContext();
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const email = e.target.value;

    if (email && !errors.email) {
      setIsChecking(true);

      try {
        const available = await checkEmailAvailability(email);
        setIsAvailable(available);
      } catch (error) {
        console.error('Email check error:', error);
      } finally {
        setIsChecking(false);
      }
    }
  };

  return (
    <div className="relative">
      <Input
        label="이메일"
        type="email"
        {...register('email')}
        onBlur={handleBlur}
        error={errors.email?.message}
      />

      {isChecking && (
        <div className="absolute right-3 top-9 text-gray-400">
          확인 중...
        </div>
      )}

      {!isChecking && isAvailable === true && (
        <div className="absolute right-3 top-9 text-green-500">
          <CheckCircleIcon className="w-5 h-5" />
        </div>
      )}

      {!isChecking && isAvailable === false && (
        <div className="absolute right-3 top-9 text-red-500">
          <XCircleIcon className="w-5 h-5" />
        </div>
      )}

      {isAvailable === false && (
        <p className="mt-1 text-sm text-red-500">
          이미 사용 중인 이메일입니다
        </p>
      )}
    </div>
  );
}
```

## 폼 제출 패턴

### 1. 기본 제출

```typescript
// src/features/auth/pages/LoginClient.tsx
'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LoginForm } from '../components/LoginForm';
import { login } from '../api/login';
import type { LoginFormData } from '../validations/authSchema';

export function LoginClient() {
  const router = useRouter();

  const handleSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data);

      toast.success('로그인에 성공했습니다');

      if (response.user.userType === 'COMPANY') {
        router.push('/company');
      } else {
        router.push('/user');
      }

      router.refresh();
    } catch (error) {
      toast.error('로그인에 실패했습니다');
      console.error('Login error:', error);
    }
  };

  return <LoginForm onSubmit={handleSubmit} />;
}
```

### 2. React Query Mutation과 함께 사용

```typescript
// src/features/jobs/pages/CreateJobClient.tsx
'use client';

import { useRouter } from 'next/navigation';
import { JobForm } from '../components/JobForm';
import { useCreateJob } from '../hooks/useCreateJob';
import type { CreateJobRequest } from '../types/job';

export function CreateJobClient() {
  const router = useRouter();
  const createJob = useCreateJob({
    onSuccess: () => {
      router.push('/company/jobs');
    },
  });

  const handleSubmit = async (data: CreateJobRequest) => {
    await createJob.mutateAsync(data);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">채용 공고 등록</h1>
      <JobForm onSubmit={handleSubmit} />
    </div>
  );
}
```

## 체크리스트

### Zod 스키마 작성 시
- [ ] 모든 필드 유효성 검사 규칙 정의
- [ ] 명확한 에러 메시지 (한글)
- [ ] `z.infer`로 타입 추론
- [ ] `refine`으로 복잡한 검증 (비밀번호 일치 등)

### React Hook Form 사용 시
- [ ] `zodResolver` 사용
- [ ] `defaultValues` 설정
- [ ] `formState.errors` 에러 표시
- [ ] `formState.isSubmitting` 로딩 상태
- [ ] 제출 버튼 `disabled` 처리

### 폼 컴포넌트 작성 시
- [ ] `'use client'` 지시문
- [ ] 에러 메시지 표시
- [ ] 로딩 상태 UI
- [ ] 접근성 (label, aria-*)
- [ ] 키보드 네비게이션

## 참고 자료

- [React Hook Form 공식 문서](https://react-hook-form.com/)
- [Zod 공식 문서](https://zod.dev/)
- [프로젝트 CLAUDE.md](/.claude/Claude.md)
