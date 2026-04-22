import type { FieldErrors } from 'react-hook-form';

/**
 * react-hook-form `register()` 스프레드 뒤에 추가하여
 * aria-invalid / aria-describedby 를 자동으로 부여하는 헬퍼.
 *
 * `FormField` 를 사용하는 경우 자동 주입되므로 이 헬퍼는 불필요.
 * `register` + 직접 `<input>` 을 쓰는 경우에만 사용한다.
 *
 * @example
 * ```tsx
 * <input {...register('email')} {...getFieldProps('email', errors)} />
 * {errors.email && (
 *   <ErrorMessage id="email-error" message={errors.email.message} />
 * )}
 * ```
 */
export function getFieldProps(
  name: string,
  errors: FieldErrors,
): {
  id: string;
  'aria-invalid': true | undefined;
  'aria-describedby': string | undefined;
} {
  const error = errors[name]?.message as string | undefined;
  return {
    id: name,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${name}-error` : undefined,
  };
}
