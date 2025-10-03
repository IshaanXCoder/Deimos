import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getButtonStyle = () => {
    const baseStyle = {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    };

    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          borderColor: colors.secondary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: colors.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = () => {
    const baseColor = variant === 'outline' || variant === 'ghost' ? colors.primary : '#ffffff';
    return { color: disabled ? colors.mutedForeground : baseColor };
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return { paddingHorizontal: 12, paddingVertical: 8, minHeight: 36 };
      case 'lg':
        return { paddingHorizontal: 24, paddingVertical: 16, minHeight: 56 };
      default:
        return { paddingHorizontal: 16, paddingVertical: 12, minHeight: 44 };
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        getButtonStyle(),
        getSizeStyle(),
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextStyle().color} />
      ) : (
        <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
});

