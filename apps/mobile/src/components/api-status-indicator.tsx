import { StyleSheet, Text, View } from 'react-native';

import { Brand, Radii, Spacing } from '@/constants/theme';
import type { ApiConnectionStatus } from '@/lib/api-connection';

type ApiStatusIndicatorProps = {
  status: ApiConnectionStatus;
};

const STATUS_LABEL: Record<ApiConnectionStatus, string> = {
  unconfigured: 'API not configured',
  checking: 'Checking API connection',
  connected: 'API connected',
  unreachable: 'API unreachable',
};

const DOT_COLOR: Record<ApiConnectionStatus, string> = {
  unconfigured: Brand.gold,
  checking: Brand.neutral700,
  connected: Brand.success,
  unreachable: Brand.danger,
};

export function ApiStatusIndicator({ status }: ApiStatusIndicatorProps) {
  return (
    <View accessibilityLiveRegion="polite" style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: DOT_COLOR[status] }]} />
        <Text style={styles.title}>{STATUS_LABEL[status]}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    backgroundColor: Brand.white,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: 'rgba(15, 39, 68, 0.08)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: Radii.pill,
  },
  title: {
    color: Brand.navy,
    fontSize: 14,
    fontWeight: '700',
  },
});
