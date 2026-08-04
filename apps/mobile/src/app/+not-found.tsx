import { Stack, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { Brand, Spacing } from '@/constants/theme';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Screen not found</Text>
        <Text style={styles.body}>
          That route is not part of the WorkProof Global mobile shell yet.
        </Text>
        <AppButton label="Return home" onPress={() => router.replace('/')} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.cream,
    padding: Spacing.lg,
    justifyContent: 'center',
    gap: Spacing.md,
  },
  title: {
    color: Brand.navy,
    fontSize: 24,
    fontWeight: '800',
  },
  body: {
    color: Brand.neutral700,
    fontSize: 16,
    lineHeight: 24,
  },
});
