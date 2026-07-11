// ============================================================
// BLAST BUDDIES — Sub-screen header with back button
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from './Icon';
import { Chip } from './Chip';
import { IconButton } from './ChunkyButton';
import { Profile } from '../types';

interface SubHeaderProps {
  title: string;
  profile: Profile;
  onBack: () => void;
}

export function SubHeader({ title, profile, onBack }: SubHeaderProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <IconButton onPress={onBack} style={styles.backBtn}>
        <Icon name="back" size={26} color="#5a6678" />
      </IconButton>
      <Text style={[styles.title, { color: '#fff' }]}>{title}</Text>
      <Chip icon="coin" value={profile.coins} />
      <Chip icon="gem" value={profile.gems} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingBottom: 14,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 5,
  },
  backBtn: {
    width: 48,
    height: 48,
  },
  title: {
    fontFamily: 'Baloo2-Bold',
    fontSize: 26,
    fontWeight: '700',
    flex: 1,
  },
});
