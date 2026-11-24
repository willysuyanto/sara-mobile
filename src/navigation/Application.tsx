import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
} from '@/screens';

const Stack = createStackNavigator<RootStackParamList>();

function ApplicationNavigator() {
  const { navigationTheme, variant } = useTheme();

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator key={variant} screenOptions={{ headerShown: false }}>
          <Stack.Screen component={Splashscreen} name={Paths.Splashscreen} />
          <Stack.Screen component={Landing} name={Paths.Landing} />
          <Stack.Screen component={Login} name={Paths.Login} />
          <Stack.Screen component={Register} name={Paths.Register} />
          <Stack.Screen
            component={ForgotPassword}
            name={Paths.ForgotPassword}
          />
          <Stack.Screen component={DashboardTabs} name={Paths.Dashboard} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default ApplicationNavigator;
