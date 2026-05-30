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
    gap: 6,
    backgroundColor: 'rgba(20,18,40,0.34)',
    borderRadius: 999,
    paddingVertical: 4,
    paddingLeft: 6,
    paddingRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  value: {
    color: '#fff',
    fontFamily: 'Baloo2-ExtraBold',
    fontWeight: '800',
    fontSize: 18,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    minWidth: 30,
    textAlign: 'center',
  },
  addBtn: {
    width: 22,
    height: 22,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  addText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
    lineHeight: 20,
  },
});
