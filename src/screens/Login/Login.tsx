import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { useAuth } from '@/hooks';
import { AuthApiError } from '@/hooks/domain/auth/authService';
import { loginSchema } from '@/hooks/domain/auth/schema';
import { useZodForm } from '@/hooks/form';
import { Paths } from '@/navigation/paths';
import type { RootScreenProps } from '@/navigation/types';
import { useTheme } from '@/theme';

import { Button, Text } from '@/components/atoms';
import { FormInput } from '@/components/molecules';
import { AuthTemplate } from '@/components/templates';

const EMAIL_NOT_VERIFIED_STATUS = 403;
const GENERIC_ERROR_MESSAGE = 'common_error';
const INVALID_CREDENTIALS_STATUS = 401;
const INVALID_INPUT_STATUS = 422;

const toErrorMessage = (error: unknown, fallback: string) =>
  error instanceof AuthApiError &&
  error.message &&
  error.message !== GENERIC_ERROR_MESSAGE
    ? error.message
    : fallback;

function Login({ navigation, route }: RootScreenProps<Paths.Login>) {
  const { t } = useTranslation();
  const { gutters, layout } = useTheme();
  const { useLogin } = useAuth();
  const login = useLogin();
  const [errorMessage, setErrorMessage] = useState<string>();

  const { control, formState, handleSubmit } = useZodForm(loginSchema, {
    defaultValues: {
      email: route.params?.email ?? '',
      password: '',
    },
  });

  const onSubmit = handleSubmit((values) => {
    setErrorMessage(undefined);
    login.mutate(values, {
      onError: (error) => {
        if (
          error instanceof AuthApiError &&
          error.status === EMAIL_NOT_VERIFIED_STATUS &&
          error.code === 'EMAIL_NOT_VERIFIED'
        ) {
          navigation.navigate(Paths.VerifyEmail, { email: values.email });
          return;
        }
        setErrorMessage(
          error instanceof AuthApiError &&
            (error.status === INVALID_CREDENTIALS_STATUS ||
              error.status === INVALID_INPUT_STATUS)
            ? t('screen_login.invalidCredentials')
            : toErrorMessage(error, t(GENERIC_ERROR_MESSAGE)),
        );
      },
    });
  });

  const goToRegister = useCallback(() => {
    navigation.navigate(Paths.Register);
  }, [navigation]);

  const goToForgotPassword = useCallback(() => {
    navigation.navigate(Paths.ForgotPassword);
  }, [navigation]);

  return (
    <AuthTemplate
      footer={
        <Pressable
          accessibilityRole="button"
          onPress={goToRegister}
          style={[layout.row, layout.justifyCenter, gutters.gap_4]}
          testID="login-register-link"
        >
          <Text color="textSecondary" variant="bodySecondary">
            {t('screen_login.noAccount')}
          </Text>
          <Text color="textAccent" variant="labelSecondary">
            {t('screen_login.register')}
          </Text>
        </Pressable>
      }
      subtitle={t('screen_login.subtitle')}
      title={t('screen_login.title')}
    >
      <FormInput
        autoCapitalize="none"
        autoComplete="email"
        control={control}
        keyboardType="email-address"
        label={t('screen_login.emailLabel')}
        name="email"
        placeholder={t('screen_login.emailPlaceholder')}
        size="lg"
        testID="login-email"
        textContentType="emailAddress"
      />

      <FormInput
        autoComplete="current-password"
        control={control}
        label={t('screen_login.passwordLabel')}
        name="password"
        password
        placeholder={t('screen_login.passwordPlaceholder')}
        size="lg"
        testID="login-password"
      />

      <View
        style={[
          layout.row,
          layout.itemsCenter,
          layout.justifyEnd,
          gutters.marginTop_4,
        ]}
      >
        <Pressable
          accessibilityRole="button"
          onPress={goToForgotPassword}
          testID="login-forgot-password"
        >
          <Text color="textAccent" variant="bodySecondary">
            {t('screen_login.forgotPassword')}
          </Text>
        </Pressable>
      </View>

      {errorMessage ? (
        <Text
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
          color="errorForeground"
          testID="login-error"
          variant="bodySecondary"
        >
          {errorMessage}
        </Text>
      ) : undefined}

      <Button
        disabled={!formState.isValid}
        fullWidth
        label={t('screen_login.submit')}
        loading={login.isPending}
        onPress={() => {
          void onSubmit();
        }}
        testID="login-submit"
        variant="primary"
      />
    </AuthTemplate>
  );
}

export default Login;
