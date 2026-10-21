import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';

import { forgotPasswordSchema } from '@/hooks/domain/auth/schema';
import { useZodForm } from '@/hooks/form';
import { Paths } from '@/navigation/paths';
import type { RootScreenProps } from '@/navigation/types';
import { useTheme } from '@/theme';

import { Button, Text } from '@/components/atoms';
import { FormInput } from '@/components/molecules';
import { AuthTemplate } from '@/components/templates';

function ForgotPassword({ navigation }: RootScreenProps<Paths.ForgotPassword>) {
  const { t } = useTranslation();
  const { gutters, layout } = useTheme();

  const { control, formState, handleSubmit } = useZodForm(
    forgotPasswordSchema,
    {
      defaultValues: { email: '' },
    },
  );

  const onSubmit = handleSubmit(() => undefined);

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
          testID="forgot-password-login-link"
        >
          <Text color="textSecondary" variant="bodySecondary">
            {t('screen_forgot_password.backToLoginQuestion')}
          </Text>
          <Text color="textAccent" variant="labelSecondary">
            {t('screen_forgot_password.login')}
          </Text>
        </Pressable>
      }
      subtitle={t('screen_forgot_password.subtitle')}
      title={t('screen_forgot_password.title')}
    >
      <FormInput
        autoCapitalize="none"
        autoComplete="email"
        control={control}
        keyboardType="email-address"
        label={t('screen_forgot_password.emailLabel')}
        name="email"
        placeholder={t('screen_forgot_password.emailPlaceholder')}
        size="lg"
        testID="forgot-password-email"
        textContentType="emailAddress"
      />

      <Button
        disabled={!formState.isValid}
        fullWidth
        label={t('screen_forgot_password.submit')}
        onPress={() => {
          void onSubmit();
        }}
        testID="forgot-password-submit"
        variant="primary"
      />
    </AuthTemplate>
  );
}

export default ForgotPassword;
