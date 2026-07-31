import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiStatusIndicator } from '@/components/api-status-indicator';
import { AppButton } from '@/components/app-button';
import { LogoMark } from '@/components/logo-mark';
import { Brand, Spacing } from '@/constants/theme';
import { API_URL, isApiConfigured } from '@/lib/api-config';
import {
  checkApiConnection,
  type ApiConnectionStatus,
} from '@/lib/api-connection';

export default function WelcomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width - Spacing.lg * 2, 440);

  const [apiStatus, setApiStatus] = useState<ApiConnectionStatus>(
    isApiConfigured ? 'checking' : 'unconfigured',
  );

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const status = await checkApiConnection();
      if (!cancelled) {
        setApiStatus(status);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.hero, { maxWidth: contentWidth }]}>
          <LogoMark size={88} />

          <Text accessibilityRole="header" style={styles.brand}>
            WorkProof Global
          </Text>

          <Text style={styles.tagline}>
            Turn every completed job into portable proof.
          </Text>

          <Text style={styles.explanation}>
            Build a worker-owned record of completed jobs with client-confirmed
            Verified Work Receipts — portable proof you control.
          </Text>

          <View style={styles.actions}>
            <AppButton
              label="Sign in"
              variant="primary"
              onPress={() => router.push('/(auth)/login')}
            />
            <AppButton
              label="Create profile"
              variant="secondary"
              onPress={() => router.push('/(auth)/register')}
            />
          </View>

          <ApiStatusIndicator status={apiStatus} />

          {__DEV__ && (
            <Text style={styles.devLine}>
              API: {API_URL || 'missing'} | Status: {apiStatus}
            </Text>
          )}

          <Text style={styles.eyebrow}>African innovation · Worker ownership</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Brand.cream,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  hero: {
    width: '100%',
    alignItems: 'center',
    gap: Spacing.md,
  },
  brand: {
    color: Brand.navy,
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  tagline: {
    color: Brand.emeraldDark,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 26,
  },
  explanation: {
    color: Brand.neutral700,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 360,
  },
  actions: {
    alignSelf: 'stretch',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  devLine: {
    alignSelf: 'stretch',
    color: Brand.neutral700,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
  eyebrow: {
    marginTop: Spacing.sm,
    color: Brand.gold,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});
