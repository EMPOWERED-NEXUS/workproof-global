import { StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/theme';

type LogoMarkProps = {
  size?: number;
};

/**
 * Text-based logo mark — no external image assets required.
 */
export function LogoMark({ size = 72 }: LogoMarkProps) {
  const fontSize = Math.round(size * 0.42);

  return (
    <View
      accessibilityLabel="WorkProof Global logo"
      style={[
        styles.mark,
        {
          width: size,
          height: size,
          borderRadius: size * 0.22,
        },
      ]}
    >
      <View style={styles.accent} />
      <Text style={[styles.glyph, { fontSize }]}>WP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mark: {
    backgroundColor: Brand.navy,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  accent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '28%',
    backgroundColor: Brand.emerald,
  },
  glyph: {
    color: Brand.cream,
    fontWeight: '800',
    letterSpacing: 1,
    zIndex: 1,
  },
});
