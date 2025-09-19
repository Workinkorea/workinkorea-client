import type { ReactElement } from 'react';
import {
  type Control,
  Controller,
  type ControllerRenderProps,
  type FieldValues,
  type Path
} from 'react-hook-form';
import { ErrorMessage } from './ErrorMessage';

interface FormFieldProps<T extends FieldValues, N extends Path<T>> {
  name: N;
  control: Control<T>;
  label?: string;
  render: (field: ControllerRenderProps<T, N>, fieldId: string) => ReactElement;
  error?: string;
}

export const FormField = <T extends FieldValues, N extends Path<T>>({
  name,
  control,
  label,
  render,
  error
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
        render={({ field }) => render(field as ControllerRenderProps<T, N>, fieldId)}
      />
      {error && <ErrorMessage message={error} />}
    </div>
  );
};
