// ============================================================
// BLAST BUDDIES — Level Badge + progress bar
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

interface LevelBadgeProps {
  level: number;
  progress: number;
}

export function LevelBadge({ level, progress }: LevelBadgeProps) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <View style={[styles.badge, { backgroundColor: theme.gold, borderBottomColor: theme.goldD }]}>
        <Text style={styles.lvlLabel}>LVL</Text>
        <Text style={[styles.lvlNum, { color: '#7a4a00' }]}>{level}</Text>
      </View>
      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            { width: `${Math.min(100, progress * 100)}%` as any },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,10,40,0.62)',
    borderRadius: 16,
    paddingVertical: 5,
    paddingLeft: 6,
    paddingRight: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.28)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 4,
  },
  badge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
  },
  lvlLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#8a5a00',
    lineHeight: 10,
  },
  lvlNum: {
    fontFamily: 'Baloo2-ExtraBold',
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 18,
  },
  barTrack: {
    width: 70,
    height: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.3)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#4fd636',
  },
});
