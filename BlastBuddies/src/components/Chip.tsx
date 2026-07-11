// ============================================================
// BLAST BUDDIES — Coin/Gem chip component
// ============================================================

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Icon } from './Icon';
import { useTheme } from '../theme';

function fmt(n: number): string {
  n = Math.round(n);
  if (n >= 1000000) return (n / 1000000).toFixed(n % 1000000 ? 1 : 0) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(n % 1000 >= 100 ? 1 : 0) + 'K';
  return '' + n;
}

export { fmt };

interface ChipProps {
  icon: string;
  value: number;
  onAdd?: () => void;
}

export function Chip({ icon, value, onAdd }: ChipProps) {
  const theme = useTheme();
  return (
    <View style={styles.chip}>
      <Icon name={icon} size={24} />
      <Text style={styles.value}>{fmt(value)}</Text>
      {onAdd && (
        <Pressable
          onPress={onAdd}
          style={[styles.addBtn, { backgroundColor: theme.accent }]}
        >
          <Text style={styles.addText}>+</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,10,40,0.62)',
    borderRadius: 999,
    paddingVertical: 5,
    paddingLeft: 5,
    paddingRight: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.28)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 4,
  },
  value: {
    color: '#fff',
    fontFamily: 'Baloo2-ExtraBold',
    fontWeight: '800',
    fontSize: 16,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    minWidth: 28,
    textAlign: 'center',
  },
  addBtn: {
    width: 20,
    height: 20,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  addText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
    lineHeight: 18,
  },
});
