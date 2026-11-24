import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { Paths } from '@/navigation/paths';
import type { RootScreenProps, RootTabParamList } from '@/navigation/types';

import { BottomNavigation } from '@/components/organisms';
import {
  Activity,
  Dashboard,
  HistoryScreen,
  PlannerScreen,
  SettingScreen,
} from '@/screens';

const Tab = createBottomTabNavigator<RootTabParamList>();

function renderTabBar(props: BottomTabBarProps) {
  return <BottomNavigation {...props} />;
}

/**
 * Signed-in shell: the five bottom destinations, with Beranda hosting the
 * dashboard.
 */
function DashboardTabs({ navigation }: RootScreenProps<Paths.Dashboard>) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const signOut = () => {
    queryClient.clear();
    navigation.reset({ index: 0, routes: [{ name: Paths.Landing }] });
  };

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={renderTabBar}>
      <Tab.Screen
        component={Dashboard}
        name={Paths.Beranda}
        options={{ title: t('navigation_tabs.home') }}
      />
      <Tab.Screen
        component={Activity}
        name={Paths.Aktivitas}
        options={{ title: t('navigation_tabs.activities') }}
      />
      <Tab.Screen
        component={PlannerScreen}
        name={Paths.Sara}
        options={{ title: t('navigation_tabs.sara') }}
      />
      <Tab.Screen
        component={HistoryScreen}
        name={Paths.Riwayat}
        options={{ title: t('navigation_tabs.history') }}
      />
      <Tab.Screen
        name={Paths.Pengaturan}
        options={{ title: t('navigation_tabs.settings') }}
      >
        {() => <SettingScreen onSignOut={signOut} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default DashboardTabs;
