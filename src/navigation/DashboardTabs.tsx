import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';

import { Paths } from '@/navigation/paths';
import type { RootTabParamList } from '@/navigation/types';

import { BottomNavigation } from '@/components/organisms';
import { Dashboard, Placeholder } from '@/screens';

const Tab = createBottomTabNavigator<RootTabParamList>();

function renderTabBar(props: BottomTabBarProps) {
  return <BottomNavigation {...props} />;
}

/**
 * Signed-in shell: the five bottom destinations, with Beranda hosting the
 * dashboard.
 */
function DashboardTabs() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={renderTabBar}>
      <Tab.Screen
        component={Dashboard}
        name={Paths.Beranda}
        options={{ title: t('navigation_tabs.home') }}
      />
      <Tab.Screen
        component={Placeholder}
        name={Paths.Aktivitas}
        options={{ title: t('navigation_tabs.activities') }}
      />
      <Tab.Screen
        component={Placeholder}
        name={Paths.Sara}
        options={{ title: t('navigation_tabs.sara') }}
      />
      <Tab.Screen
        component={Placeholder}
        name={Paths.Riwayat}
        options={{ title: t('navigation_tabs.history') }}
      />
      <Tab.Screen
        component={Placeholder}
        name={Paths.Pengaturan}
        options={{ title: t('navigation_tabs.settings') }}
      />
    </Tab.Navigator>
  );
}

export default DashboardTabs;
