import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';

import { useAuth } from '@/hooks';
import { AuthApiError } from '@/hooks/domain/auth/authService';
import { registerSchema } from '@/hooks/domain/auth/schema';
import { useZodForm } from '@/hooks/form';
import { Paths } from '@/navigation/paths';
import type { RootScreenProps } from '@/navigation/types';
import { useTheme } from '@/theme';

import { Button, Text } from '@/components/atoms';
import { FormInput } from '@/components/molecules';
import { AuthTemplate } from '@/components/templates';

const ACCOUNT_CREATED_EMAIL_FAILED_STATUS = 503;
const GENERIC_ERROR_MESSAGE = 'common_error';
const INVALID_INPUT_STATUS = 422;

const toErrorMessage = (error: unknown, fallback: string) =>
  error instanceof AuthApiError &&
  error.message &&
  error.message !== GENERIC_ERROR_MESSAGE
    ? error.message
    : fallback;

function Register({ navigation }: RootScreenProps<Paths.Register>) {
  const { t } = useTranslation();
  const { gutters, layout } = useTheme();
  const { useRegister } = useAuth();
  const register = useRegister();
  const [errorMessage, setErrorMessage] = useState<string>();

  const { control, formState, handleSubmit } = useZodForm(registerSchema, {
    defaultValues: {
      confirmPassword: '',
      email: '',
      fullName: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit((values) => {
    setErrorMessage(undefined);
    register.mutate(values, {
      onError: (error) => {
        if (
          error instanceof AuthApiError &&
          error.status === ACCOUNT_CREATED_EMAIL_FAILED_STATUS
        ) {
          navigation.navigate(Paths.VerifyEmail, {
            email: values.email,
            message: toErrorMessage(
              error,
              t('screen_verify_email.registerEmailFailed'),
            ),
          });
          return;
        }
        setErrorMessage(
          error instanceof AuthApiError && error.status === INVALID_INPUT_STATUS
            ? t('screen_register.invalidDetails')
            : toErrorMessage(error, t(GENERIC_ERROR_MESSAGE)),
        );
      },
      onSuccess: () => {
        navigation.navigate(Paths.VerifyEmail, { email: values.email });
      },
    });
  });

  const goToLogin = useCallback(() => {
    navigation.navigate(Paths.Login);
  }, [navigation]);

  return (
    <AuthTemplate
      footer={
        <Pressable
          accessibilityRole="button"
          onPress={goToLogin}
          style={[layout.row, layout.justifyCenter, gutters.gap_4]}
          testID="register-login-link"
        >
          <Text color="textSecondary" variant="bodySecondary">
            {t('screen_register.haveAccount')}
          </Text>
          <Text color="textAccent" variant="labelSecondary">
            {t('screen_register.login')}
          </Text>
        </Pressable>
      }
      subtitle={t('screen_register.subtitle')}
      title={t('screen_register.title')}
    >
      <FormInput
        control={control}
        label={t('screen_register.fullNameLabel')}
        name="fullName"
        placeholder={t('screen_register.fullNamePlaceholder')}
        size="lg"
        testID="register-full-name"
        textContentType="name"
      />

      <FormInput
        autoCapitalize="none"
        autoComplete="email"
        control={control}
        keyboardType="email-address"
        label={t('screen_register.emailLabel')}
        name="email"
        placeholder={t('screen_register.emailPlaceholder')}
        size="lg"
        testID="register-email"
        textContentType="emailAddress"
      />

      <FormInput
        autoComplete="new-password"
        control={control}
        label={t('screen_register.passwordLabel')}
        name="password"
        password
        placeholder={t('screen_register.passwordPlaceholder')}
        size="lg"
        testID="register-password"
      />

      <FormInput
        autoComplete="new-password"
        control={control}
        helperMessage={t('screen_register.confirmPasswordHelper')}
        label={t('screen_register.confirmPasswordLabel')}
        name="confirmPassword"
        password
        placeholder={t('screen_register.confirmPasswordPlaceholder')}
        size="lg"
        testID="register-confirm-password"
      />

      {errorMessage ? (
        <Text
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
          color="errorForeground"
          testID="register-error"
          variant="bodySecondary"
        >
          {errorMessage}
        </Text>
      ) : undefined}

      <Button
        disabled={!formState.isValid}
        fullWidth
        label={t('screen_register.submit')}
        loading={register.isPending}
        onPress={() => {
          void onSubmit();
        }}
        testID="register-submit"
        variant="primary"
      />
    </AuthTemplate>
  );
}

export default Register;
