import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/app-button';
import { Brand, Spacing } from '@/constants/theme';

type PlaceholderScreenProps = {
  title: string;
  description: string;
  onBack?: () => void;
  backLabel?: string;
};

export function PlaceholderScreen({
  title,
  description,
  onBack,
  backLabel = 'Go back',
}: PlaceholderScreenProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>Coming soon</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        {onBack ? <AppButton label={backLabel} variant="secondary" onPress={onBack} /> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Brand.cream,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    justifyContent: 'center',
    gap: Spacing.md,
  },
  eyebrow: {
    color: Brand.emeraldDark,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: Brand.navy,
    fontSize: 28,
    fontWeight: '800',
  },
  description: {
    color: Brand.neutral700,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: Spacing.sm,
  },
});
