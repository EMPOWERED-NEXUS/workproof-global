import { forwardRef } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Brand, Radii, Spacing } from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type AppButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
};

/**
 * Accessible branded button. Styles are applied after any parent style
 * (e.g. Link asChild) so background/text contrast cannot be stripped.
 */
export const AppButton = forwardRef<React.ElementRef<typeof Pressable>, AppButtonProps>(
  function AppButton({ label, variant = 'primary', disabled, style, ...props }, ref) {
    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityLabel={label}
        disabled={disabled}
        style={({ pressed }) => [
          styles.base,
          variantStyles[variant],
          style,
          pressed && !disabled ? styles.pressed : null,
          disabled ? styles.disabled : null,
        ]}
        {...props}
      >
        <Text style={[styles.label, labelStyles[variant]]}>{label}</Text>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: Brand.emerald,
    borderWidth: 0,
  },
  secondary: {
    backgroundColor: Brand.white,
    borderWidth: 2,
    borderColor: Brand.navy,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
});

const labelStyles = StyleSheet.create({
  primary: {
    color: Brand.white,
  },
  secondary: {
    color: Brand.navy,
  },
  ghost: {
    color: Brand.emeraldDark,
  },
});
