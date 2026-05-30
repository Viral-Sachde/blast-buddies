// ============================================================
// BLAST BUDDIES — 3D chunky press button system
// ============================================================

import React, { ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

type ButtonVariant = 'primary' | 'accent' | 'gold' | 'gray';

interface ChunkyButtonProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: object;
  textStyle?: object;
  fontSize?: number;
  paddingVertical?: number;
  paddingHorizontal?: number;
}

export function ChunkyButton({
  children,
  onPress,
  variant = 'primary',
  disabled = false,
  style = {},
  textStyle = {},
  fontSize = 20,
  paddingVertical = 14,
  paddingHorizontal = 22,
}: ChunkyButtonProps) {
  const theme = useTheme();

  const colors = {
    primary: { bg: theme.primary, shadow: theme.primaryD, text: '#fff', textShadow: 'rgba(0,0,0,0.18)' },
    accent: { bg: theme.accent, shadow: theme.accentD, text: '#fff', textShadow: 'rgba(0,0,0,0.18)' },
    gold: { bg: theme.gold, shadow: theme.goldD, text: '#7a4a00', textShadow: 'rgba(255,255,255,0.4)' },
    gray: { bg: '#c4cdda', shadow: '#97a3b5', text: '#5a6678', textShadow: 'none' },
  };

  const c = colors[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: c.bg,
          borderBottomWidth: pressed ? 2 : 6,
          borderBottomColor: c.shadow,
          transform: [{ translateY: pressed ? 4 : 0 }],
          paddingVertical,
          paddingHorizontal,
          opacity: disabled ? 0.7 : 1,
        },
        style,
      ]}
    >
      {typeof children === 'string' ? (
        <Text
          style={[
            styles.text,
            {
              fontSize,
              color: c.text,
              textShadowColor: c.textShadow,
            },
            textStyle,
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

export function IconButton({
  children,
  onPress,
  style = {},
}: {
  children: ReactNode;
  onPress?: () => void;
  style?: object;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconBtn,
        {
          transform: [{ translateY: pressed ? 4 : 0 }],
          borderBottomWidth: pressed ? 2 : 5,
        },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 6,
  },
  text: {
    fontFamily: 'Baloo2-ExtraBold',
    fontWeight: '800',
    letterSpacing: 0.3,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 0,
  },
  iconBtn: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#eef2f8',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#c2cad6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },
});
