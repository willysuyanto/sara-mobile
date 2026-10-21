import { act, renderHook, waitFor } from '@testing-library/react-native';
import * as z from 'zod';

import { useZodForm } from './useZodForm';

const schema = z.object({
  email: z.email('Email tidak valid'),
  name: z.string().min(3, 'Nama minimal 3 karakter'),
});

const schemaWithCoercion = z.object({
  age: z.coerce.number(),
});

describe('useZodForm', () => {
  it('returns the form API with the given default values', () => {
    const { result } = renderHook(() =>
      useZodForm(schema, {
        defaultValues: { email: 'sara@sara.app', name: 'SARA' },
      }),
    );

    expect(result.current.getValues()).toEqual({
      email: 'sara@sara.app',
      name: 'SARA',
    });
  });

  it('exposes the schema messages as validation errors', async () => {
    const { result } = renderHook(() => {
      const form = useZodForm(schema, {
        defaultValues: { email: '', name: '' },
      });

      return { errors: form.formState.errors, form };
    });

    act(() => {
      result.current.form.setValue('email', 'bukan-email');
    });

    await act(async () => {
      await result.current.form.trigger('email');
    });

    expect(result.current.errors.email?.message).toBe('Email tidak valid');
  });

  it('clears the validation error once the value is valid', async () => {
    const { result } = renderHook(() => {
      const form = useZodForm(schema, {
        defaultValues: { email: '', name: '' },
      });

      return { errors: form.formState.errors, form };
    });

    act(() => {
      result.current.form.setValue('email', 'bukan-email');
    });

    await act(async () => {
      await result.current.form.trigger('email');
    });

    expect(result.current.errors.email).toBeDefined();

    act(() => {
      result.current.form.setValue('email', 'sara@sara.app', {
        shouldValidate: true,
      });
    });

    await waitFor(() => {
      expect(result.current.errors.email).toBeUndefined();
    });
  });

  it('submits the parsed output of the schema', async () => {
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useZodForm(schemaWithCoercion, { defaultValues: { age: '42' } }),
    );

    await act(async () => {
      await result.current.handleSubmit(onSubmit)();
    });

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({ age: 42 }, undefined);
  });

  it('does not submit when the schema does not match', async () => {
    const onSubmit = jest.fn();
    const { result } = renderHook(() => {
      const form = useZodForm(schema, {
        defaultValues: { email: 'bukan-email', name: '' },
      });

      return { errors: form.formState.errors, form };
    });

    await act(async () => {
      await result.current.form.handleSubmit(onSubmit)();
    });

    expect(onSubmit).not.toHaveBeenCalled();
    expect(result.current.errors.email?.message).toBe('Email tidak valid');
  });
});
