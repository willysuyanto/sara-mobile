import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/hooks';
import { AuthApiError } from '@/hooks/domain/auth/authService';
import { verifyEmailSchema } from '@/hooks/domain/auth/schema';
import { useZodForm } from '@/hooks/form';
import { Paths } from '@/navigation/paths';
import type { RootScreenProps } from '@/navigation/types';

import { Button, Text } from '@/components/atoms';
import { FormInput } from '@/components/molecules';
import { AuthTemplate } from '@/components/templates';

const CODE_LENGTH = 6;
const GENERIC_ERROR_MESSAGE = 'common_error';

const toErrorMessage = (error: unknown, fallback: string) =>
  error instanceof AuthApiError &&
  error.message &&
  error.message !== GENERIC_ERROR_MESSAGE
    ? error.message
    : fallback;

function VerifyEmail({
  navigation,
  route,
}: RootScreenProps<Paths.VerifyEmail>) {
  const { t } = useTranslation();
  const { useResendOtp, useVerifyEmail } = useAuth();
  const verifyEmail = useVerifyEmail();
  const resendOtp = useResendOtp();
  const { email, message } = route.params;
  const [errorMessage, setErrorMessage] = useState<string>();
  const [statusMessage, setStatusMessage] = useState<string>();
  const isPending = verifyEmail.isPending || resendOtp.isPending;

  const { control, formState, handleSubmit } = useZodForm(verifyEmailSchema, {
    defaultValues: { code: '', email },
  });

  const onSubmit = handleSubmit((values) => {
    setErrorMessage(undefined);
    setStatusMessage(undefined);
    verifyEmail.mutate(values, {
      onError: (error) => {
        setErrorMessage(toErrorMessage(error, t(GENERIC_ERROR_MESSAGE)));
      },
      onSuccess: () => {
        navigation.reset({
          index: 0,
          routes: [{ name: Paths.Login, params: { email: values.email } }],
        });
      },
    });
  });

  const onResend = () => {
    setErrorMessage(undefined);
    setStatusMessage(undefined);
    resendOtp.mutate(
      { email },
      {
        onError: (error) => {
          setErrorMessage(toErrorMessage(error, t(GENERIC_ERROR_MESSAGE)));
        },
        onSuccess: (result) => {
          setStatusMessage(
            result.message || t('screen_verify_email.resendFallback'),
          );
        },
      },
    );
  };

  return (
    <AuthTemplate
      subtitle={t('screen_verify_email.subtitle')}
      title={t('screen_verify_email.title')}
    >
      <Text
        color="textSecondary"
        testID="verify-email-target"
        variant="bodySecondary"
      >
        {t('screen_verify_email.sentTo', { email })}
      </Text>

      {message ? (
        <Text
          color="textSecondary"
          testID="verify-email-message"
          variant="bodySecondary"
        >
          {message}
        </Text>
      ) : undefined}

      <FormInput
        autoComplete="one-time-code"
        control={control}
        keyboardType="number-pad"
        label={t('screen_verify_email.codeLabel')}
        maxLength={CODE_LENGTH}
        name="code"
        placeholder={t('screen_verify_email.codePlaceholder')}
        size="lg"
        testID="verify-email-code"
        textContentType="oneTimeCode"
      />

      {errorMessage ? (
        <Text
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
          color="errorForeground"
          testID="verify-email-error"
          variant="bodySecondary"
        >
          {errorMessage}
        </Text>
      ) : undefined}

      {statusMessage ? (
        <Text
          accessibilityLiveRegion="polite"
          color="textAccent"
          testID="verify-email-status"
          variant="bodySecondary"
        >
          {statusMessage}
        </Text>
      ) : undefined}

      <Button
        disabled={!formState.isValid || isPending}
        fullWidth
        label={t('screen_verify_email.submit')}
        loading={verifyEmail.isPending}
        onPress={() => {
          void onSubmit();
        }}
        testID="verify-email-submit"
        variant="primary"
      />

      <Button
        disabled={isPending}
        fullWidth
        label={t('screen_verify_email.resend')}
        loading={resendOtp.isPending}
        onPress={onResend}
        testID="verify-email-resend"
        variant="secondary"
      />
    </AuthTemplate>
  );
}

export default VerifyEmail;
