import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../utils/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: any;
  textStyle?: any;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const buttonStyle = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const buttonTextStyle = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.textOnPrimary}
          size="small"
        />
      ) : (
        <Text style={buttonTextStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  
  // Variantes
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  
  secondary: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  
  outline: {
    backgroundColor: 'transparent',
    borderColor: colors.primary,
  },
  
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  
  // Tamaños
  small: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 36,
  },
  
  medium: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 44,
  },
  
  large: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    minHeight: 52,
  },
  
  // Estado deshabilitado
  disabled: {
    backgroundColor: colors.disabled,
    borderColor: colors.disabled,
  },
  
  // Estilos de texto
  text: {
    fontWeight: '500',
    textAlign: 'center',
  },
  
  primaryText: {
    color: colors.textOnPrimary,
  },
  
  secondaryText: {
    color: colors.textOnPrimary,
  },
  
  outlineText: {
    color: colors.primary,
  },
  
  ghostText: {
    color: colors.primary,
  },
  
  disabledText: {
    color: colors.textLight,
  },
  
  // Tamaños de texto
  smallText: {
    fontSize: fontSize.sm,
  },
  
  mediumText: {
    fontSize: fontSize.base,
  },
  
  largeText: {
    fontSize: fontSize.lg,
  },
});

export default Button; 