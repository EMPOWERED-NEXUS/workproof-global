import { Tabs } from 'expo-router';
import { Text, StyleSheet } from 'react-native';

import { Brand } from '@/constants/theme';

function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
  );
}

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: Brand.navy },
        headerTintColor: Brand.cream,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
        tabBarActiveTintColor: Brand.emerald,
        tabBarInactiveTintColor: Brand.neutral700,
        tabBarStyle: {
          backgroundColor: Brand.white,
          borderTopColor: 'rgba(15, 39, 68, 0.08)',
        },
        sceneStyle: { backgroundColor: Brand.cream },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarLabel: ({ focused }) => <TabLabel label="Home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="receipts"
        options={{
          title: 'Receipts',
          tabBarLabel: ({ focused }) => <TabLabel label="Receipts" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: ({ focused }) => <TabLabel label="Profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Brand.neutral700,
  },
  tabLabelFocused: {
    color: Brand.emerald,
  },
});
