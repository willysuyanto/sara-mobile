import { act, fireEvent, render, screen } from '@testing-library/react-native';
import * as z from 'zod';

import { useZodForm } from '@/hooks/form';

import { Text } from '@/components/atoms';

import TestAppWrapper from '@/tests/TestAppWrapper';

import FormCheckbox from './FormCheckbox';

const LABEL = 'Ingat saya';

const schema = z.object({
  rememberMe: z.boolean(),
});

function Form() {
  const { control, watch } = useZodForm(schema, {
    defaultValues: { rememberMe: false },
  });

  return (
    <>
      <FormCheckbox
        control={control}
        label={LABEL}
        name="rememberMe"
        testID="remember"
      />
      <Text testID="remember-value">{String(watch('rememberMe'))}</Text>
    </>
  );
}

describe('FormCheckbox', () => {
  it('renders its label', () => {
    render(<Form />, { wrapper: TestAppWrapper });

    expect(screen.getByText(LABEL)).toBeTruthy();
  });

  it('reflects the form value and updates it when pressed', async () => {
    render(<Form />, { wrapper: TestAppWrapper });

    expect(screen.getByTestId('remember-value')).toHaveTextContent('false');

    fireEvent.press(screen.getByTestId('remember'));

    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByTestId('remember-value')).toHaveTextContent('true');
    expect(screen.getByTestId('remember')).toHaveProp('accessibilityState', {
      checked: true,
      disabled: false,
    });
  });
});
