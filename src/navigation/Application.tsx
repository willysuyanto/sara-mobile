import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { restoreSession, useSession } from '@/hooks/domain/auth/session';
import DashboardTabs from '@/navigation/DashboardTabs';
import { Paths } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';

import {
  ForgotPassword,
  Landing,
  Login,
  Register,
  Splashscreen,
  VerifyEmail,
} from '@/screens';

const Stack = createStackNavigator<RootStackParamList>();

function ApplicationNavigator() {
  const { navigationTheme, variant } = useTheme();
  const session = useSession((state) => state.session);

  useEffect(() => {
    void restoreSession();
  }, []);

  if (session.status === 'checking' || session.status === 'restoreError') {
    return (
      <SafeAreaProvider>
        <Splashscreen
          failed={session.status === 'restoreError'}
          onRetry={() => {
            void restoreSession();
          }}
        />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator
          initialRouteName={
            session.status === 'signedIn'
              ? Paths.Dashboard
              : session.showLogin
                ? Paths.Login
                : Paths.Landing
          }
          key={`${variant}-${session.status}`}
          screenOptions={{ headerShown: false }}
        >
          {session.status === 'signedIn' ? (
            <Stack.Screen component={DashboardTabs} name={Paths.Dashboard} />
          ) : (
            <>
              <Stack.Screen component={Landing} name={Paths.Landing} />
              <Stack.Screen component={Login} name={Paths.Login} />
              <Stack.Screen component={Register} name={Paths.Register} />
              <Stack.Screen component={VerifyEmail} name={Paths.VerifyEmail} />
              <Stack.Screen
                component={ForgotPassword}
                name={Paths.ForgotPassword}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default ApplicationNavigator;
