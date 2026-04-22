import type { ReactElement } from 'react';
import {
  type Control,
  Controller,
  type ControllerRenderProps,
  type FieldValues,
  type Path,
  type RegisterOptions
} from 'react-hook-form';
import { ErrorMessage } from './ErrorMessage';

interface FormFieldProps<T extends FieldValues, N extends Path<T>> {
  name: N;
  control: Control<T>;
  label?: string;
  render: (field: ControllerRenderProps<T, N>, fieldId: string) => ReactElement;
  error?: string;
  rules?: RegisterOptions<T, N>;
  variant?: 'default' | 'diagnosis';
}

export const FormField = <T extends FieldValues, N extends Path<T>>({
  name,
  control,
  label,
  render,
  rules,
  variant = 'default'
}: FormFieldProps<T, N>) => {
  const fieldId = `field-${name}`;
  const errorId = `${fieldId}-error`;

  const labelClassName = variant === 'diagnosis'
    ? "cursor-pointer text-slate-900 text-title-5 font-semibold text-left self-start"
    : "cursor-pointer text-slate-700 text-caption-1 font-semibold text-left self-start";

  return (
    <div className="relative flex flex-col gap-2 w-full">
      {label && (
        <label
          htmlFor={fieldId}
          className={labelClassName}
        >
          {label}
          {rules?.required && (
            <>
              <span aria-hidden="true" className="text-red-500 ml-0.5">*</span>
              <span className="sr-only">(필수)</span>
            </>
          )}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => {
          const hasError = !!fieldState.error;

          // aria 속성을 field 에 주입하여 render 콜백이 스프레드하면 자동 적용
          const enhancedField = {
            ...field,
            'aria-invalid': hasError || undefined,
            'aria-describedby': hasError ? errorId : undefined,
            'aria-required': rules?.required ? true : undefined,
          } as ControllerRenderProps<T, N>;

          return (
            <>
              {render(enhancedField, fieldId)}
              {fieldState.error && (
                <ErrorMessage
                  id={errorId}
                  message={fieldState.error.message || ''}
                  variant={variant}
                />
              )}
            </>
          );
        }}
      />
    </div>
  );
};
