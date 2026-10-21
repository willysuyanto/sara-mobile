import type { ComponentProps } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { useController } from 'react-hook-form';

import Checkbox from '@/components/molecules/Checkbox/Checkbox';

type Properties<TFieldValues extends FieldValues> = {
  readonly control: Control<TFieldValues>;
  readonly label: string;
  readonly name: FieldPath<TFieldValues>;
} & Omit<ComponentProps<typeof Checkbox>, 'checked' | 'label' | 'onChange'>;

const toBoolean = (value: unknown): boolean => value === true;

/**
 * Binds a react-hook-form field to the `Checkbox` molecule: checked state and
 * change events are handled by the form.
 */
function FormCheckbox<TFieldValues extends FieldValues>({
  control,
  label,
  name,
  ...props
}: Properties<TFieldValues>) {
  const { field } = useController({ control, name });

  return (
    <Checkbox
      {...props}
      checked={toBoolean(field.value)}
      label={label}
      onChange={(next) => {
        field.onChange(next);
      }}
    />
  );
}

export default FormCheckbox;
