import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { Brand } from '@/constants/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Brand.navy },
          headerTintColor: Brand.cream,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: Brand.cream },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: 'Not found' }} />
      </Stack>
    </>
  );
}
