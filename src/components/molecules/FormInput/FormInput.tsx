import type { ComponentProps } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Input from '@/components/molecules/Input/Input';

type Properties<TFieldValues extends FieldValues> = {
  readonly control: Control<TFieldValues>;
  readonly label: string;
  readonly name: FieldPath<TFieldValues>;
} & Omit<
  ComponentProps<typeof Input>,
  'error' | 'errorMessage' | 'label' | 'onBlur' | 'onChangeText' | 'value'
>;

const toTextValue = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined;

/**
 * Binds a react-hook-form field to the `Input` molecule: value, change and
 * blur events are handled by the form, validation messages drive the error
 * state of the field. Schema messages are translation keys resolved here.
 */
function FormInput<TFieldValues extends FieldValues>({
  control,
  label,
  name,
  ...props
}: Properties<TFieldValues>) {
  const { t } = useTranslation();
  const { field, fieldState } = useController({ control, name });

  const handleBlur = () => {
    field.onBlur();
  };

  const handleChangeText = (text: string) => {
    field.onChange(text);
  };

  return (
    <Input
      {...props}
      error={fieldState.invalid}
      errorMessage={
        fieldState.error?.message ? t(fieldState.error.message) : undefined
      }
      label={label}
      onBlur={handleBlur}
      onChangeText={handleChangeText}
      value={toTextValue(field.value)}
    />
  );
}

export default FormInput;
