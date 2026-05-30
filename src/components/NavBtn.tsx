// ============================================================
// BLAST BUDDIES — Navigation button (bottom nav)
// ============================================================

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Icon } from './Icon';
import { useTheme } from '../theme';

interface NavBtnProps {
  icon: string;
  label: string;
  color: string;
  onClick: () => void;
  badge?: boolean;
}

export function NavBtn({ icon, label, color, onClick, badge = false }: NavBtnProps) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onClick}
        style={({ pressed }) => [
          styles.btn,
          {
            backgroundColor: color,
            transform: [{ translateY: pressed ? 4 : 0 }],
            shadowOffset: { width: 0, height: pressed ? 1 : 5 },
          },
        ]}
      >
        <Icon name={icon} size={34} color="#fff" />
        {badge && <View style={styles.badge} />}
      </Pressable>
      <Text style={[styles.label, { color: theme.ink }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4,
  },
  btn: {
    position: 'relative',
    width: 66,
    height: 66,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 6,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ff3b3b',
    borderWidth: 2,
    borderColor: '#fff',
  },
  label: {
    fontFamily: 'Baloo2-Bold',
    fontSize: 13,
    fontWeight: '700',
  },
});
