import { Stack } from 'expo-router';

import { Brand } from '@/constants/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Brand.navy },
        headerTintColor: Brand.cream,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: Brand.cream },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="login" options={{ title: 'Sign in' }} />
      <Stack.Screen name="register" options={{ title: 'Create profile' }} />
    </Stack>
  );
}
