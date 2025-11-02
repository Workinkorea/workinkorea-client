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
}

export const FormField = <T extends FieldValues, N extends Path<T>>({
  name,
  control,
  label,
  render,
  error,
  rules
}: FormFieldProps<T, N>) => {
  const fieldId = `field-${name}`;

  return (
    <div className="relative flex flex-col gap-2 w-full">
      <label
        htmlFor={fieldId}
        className="cursor-pointer text-label-400 text-caption-1 text-left self-start"
      >
        {label}
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
