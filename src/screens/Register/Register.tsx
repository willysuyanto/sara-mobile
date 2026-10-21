import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';

import { useAuth } from '@/hooks';
import { registerSchema } from '@/hooks/domain/auth/schema';
import { useZodForm } from '@/hooks/form';
import { Paths } from '@/navigation/paths';
import type { RootScreenProps } from '@/navigation/types';
import { useTheme } from '@/theme';

import { Button, Text } from '@/components/atoms';
import { FormInput } from '@/components/molecules';
import { AuthTemplate } from '@/components/templates';

function Register({ navigation }: RootScreenProps<Paths.Register>) {
  const { t } = useTranslation();
  const { gutters, layout } = useTheme();
  const { useRegister } = useAuth();
  const register = useRegister();

  const { control, formState, handleSubmit } = useZodForm(registerSchema, {
    defaultValues: {
      confirmPassword: '',
      email: '',
      fullName: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit((values) => {
    register.mutate(values, {
      onSuccess: () => {
        navigation.reset({
          index: 0,
          routes: [{ name: Paths.Dashboard }],
        });
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
        helperMessage={t('screen_register.passwordHelper')}
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
