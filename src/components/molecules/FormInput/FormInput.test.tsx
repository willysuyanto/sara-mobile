import { act, fireEvent, render, screen } from '@testing-library/react-native';
import * as z from 'zod';

import { useZodForm } from '@/hooks/form';

import { Text } from '@/components/atoms';

import TestAppWrapper from '@/tests/TestAppWrapper';

import FormInput from './FormInput';

const LABEL = 'Email';
const ERROR_MESSAGE = 'Email tidak valid';

const schema = z.object({
  email: z.email(ERROR_MESSAGE),
});

function Form() {
  const { control, watch } = useZodForm(schema, {
    defaultValues: { email: '' },
  });

  return (
    <>
      <FormInput control={control} label={LABEL} name="email" testID="email" />
      <Text testID="email-value">{watch('email')}</Text>
    </>
  );
}

const changeEmail = async (email: string) => {
  fireEvent.changeText(screen.getByTestId('email'), email);

  await act(async () => {
    await Promise.resolve();
  });
};

describe('FormInput', () => {
  it('renders its label', () => {
    render(<Form />, { wrapper: TestAppWrapper });

    expect(screen.getByText(LABEL)).toBeTruthy();
  });

  it('keeps the typed value in the form state', async () => {
    render(<Form />, { wrapper: TestAppWrapper });

    await changeEmail('sara@sara.app');

    expect(screen.getByTestId('email-value')).toHaveTextContent(
      'sara@sara.app',
    );
  });

  it('shows the validation message of the field', async () => {
    render(<Form />, { wrapper: TestAppWrapper });

    await changeEmail('bukan-email');

    expect(screen.getByText(ERROR_MESSAGE)).toBeTruthy();
  });

  it('shows no validation message while the value is valid', async () => {
    render(<Form />, { wrapper: TestAppWrapper });

    await changeEmail('bukan-email');

    expect(screen.getByText(ERROR_MESSAGE)).toBeTruthy();

    await changeEmail('sara@sara.app');

    expect(screen.queryByText(ERROR_MESSAGE)).toBeNull();
  });
});
