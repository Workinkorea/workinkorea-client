import type { ReactElement } from 'react';
import {
  type Control,
  Controller,
  type ControllerRenderProps,
  type FieldValues,
  type Path,
  type RegisterOptions
} from 'react-hook-form';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

interface DiagnosisFormFieldProps<T extends FieldValues, N extends Path<T>> {
  name: N;
  control: Control<T>;
  label?: string;
  render: (field: ControllerRenderProps<T, N>, fieldId: string) => ReactElement;
  error?: string;
  rules?: RegisterOptions<T, N>;
}

export const DiagnosisFormField = <T extends FieldValues, N extends Path<T>>({
  name,
  control,
  label,
  render,
  rules
}: DiagnosisFormFieldProps<T, N>) => {
  const fieldId = `field-${name}`;

  return (
    <div className="relative flex flex-col gap-2 w-full">
      <label
        htmlFor={fieldId}
        className="cursor-pointer text-label-900 text-title-3 font-semibold text-left self-start"
      >
        {label}
        {rules?.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
          <>
            {render(field as ControllerRenderProps<T, N>, fieldId)}
            {fieldState.error && <ErrorMessage message={fieldState.error.message || ''} />}
          </>
        )}
      />
    </div>
  );
};
