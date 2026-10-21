import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { useAuth } from '@/hooks';
import { loginSchema } from '@/hooks/domain/auth/schema';
import { useZodForm } from '@/hooks/form';
import { Paths } from '@/navigation/paths';
import type { RootScreenProps } from '@/navigation/types';
import { useTheme } from '@/theme';

import { Button, Text } from '@/components/atoms';
import { FormCheckbox, FormInput } from '@/components/molecules';
import { AuthTemplate } from '@/components/templates';

function Login({ navigation }: RootScreenProps<Paths.Login>) {
  const { t } = useTranslation();
  const { gutters, layout } = useTheme();
  const { useLogin } = useAuth();
  const login = useLogin();

  const { control, formState, handleSubmit } = useZodForm(loginSchema, {
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = handleSubmit((values) => {
    login.mutate(values, {
      onSuccess: () => {
        navigation.reset({
          index: 0,
          routes: [{ name: Paths.Dashboard }],
        });
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
          layout.justifyBetween,
          gutters.marginTop_4,
        ]}
      >
        <FormCheckbox
          control={control}
          label={t('screen_login.rememberMe')}
          name="rememberMe"
          testID="login-remember"
        />

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
