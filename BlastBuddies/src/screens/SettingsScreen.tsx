import React from 'react';
import { View, Text, Pressable, Alert, StyleSheet, Dimensions, Image } from 'react-native';
import { Icon } from '../components/Icon';
import { Chip } from '../components/Chip';
import { IconButton } from '../components/ChunkyButton';
import { Profile, AppSettings } from '../types';

const { width: W, height: H } = Dimensions.get('window');
const BG = require('../../assets/settings-screen/settings-screen-bg.png');

interface SettingsScreenProps {
  profile: Profile;
  go: (route: string) => void;
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  onReset: () => void;
}

function Toggle({ value, onToggle }: { value: boolean; onToggle: () => void }) {
  return (
    <Pressable
      onPress={onToggle}
      style={[styles.toggle, { backgroundColor: value ? '#4cd964' : '#c4cdda' }]}
    >
      <View style={[styles.thumb, { left: value ? 28 : 3 }]} />
    </Pressable>
  );
}

function ToggleRow({
  label,
  iconName,
  iconBg,
  value,
  onToggle,
  last,
}: {
  label: string;
  iconName: string;
  iconBg: string;
  value: boolean;
  onToggle: () => void;
  last?: boolean;
}) {
  return (
    <View style={[styles.row, last ? null : styles.rowBorder]}>
      <View style={styles.rowLeft}>
        <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
          <Icon name={iconName} size={20} color="#fff" />
        </View>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Toggle value={value} onToggle={onToggle} />
    </View>
  );
}

export function SettingsScreen({ profile, go, settings, setSettings, onReset }: SettingsScreenProps) {
  const toggle = (key: keyof AppSettings) =>
    setSettings({ ...settings, [key]: !settings[key] });

  const handleReset = () =>
    Alert.alert('Reset Progress', 'Reset all progress? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: onReset },
    ]);

  return (
    <View style={styles.root}>
      <Image source={BG} style={styles.bg} resizeMode="cover" />

      {/* Header */}
      <View style={styles.header}>
        <IconButton onPress={() => go('home')} style={styles.backBtn}>
          <Icon name="back" size={26} color="#fff" />
        </IconButton>
        <Text style={styles.title}>SETTINGS</Text>
        <View style={styles.headerRight}>
          <Chip icon="coin" value={profile.coins} />
          <Chip icon="gem" value={profile.gems} />
        </View>
      </View>

      {/* Toggles card */}
      <View style={styles.card}>
        <ToggleRow label="MUSIC"         iconName="music"     iconBg="#2ecbff" value={settings.music}   onToggle={() => toggle('music')} />
        <ToggleRow label="SOUND FX"      iconName="soundfx"  iconBg="#ff9500" value={settings.sound}   onToggle={() => toggle('sound')} />
        <ToggleRow label="VIBRATION"     iconName="vibration" iconBg="#ff7b00" value={settings.vibrate} onToggle={() => toggle('vibrate')} />
        <ToggleRow label="NOTIFICATIONS" iconName="bell"      iconBg="#ffc83d" value={settings.notify}  onToggle={() => toggle('notify')} last />
      </View>

      {/* Reset */}
      <Pressable
        onPress={handleReset}
        style={({ pressed }) => [
          styles.resetBtn,
          { backgroundColor: pressed ? '#cc2020' : '#e83030', borderBottomWidth: pressed ? 2 : 5 },
        ]}
      >
        <Text style={styles.resetIcon}>🔄</Text>
        <Text style={styles.resetText}>RESET PROGRESS</Text>
      </Pressable>

      <Text style={styles.version}>Blast Buddies • v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  bg: { position: 'absolute', width: W, height: H, top: 0, left: 0 },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 5,
  },
  backBtn: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  title: {
    fontFamily: 'Baloo2-ExtraBold',
    fontWeight: '800',
    fontSize: 26,
    color: '#fff',
    flex: 1,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerRight: { flexDirection: 'row', gap: 8 },
  card: {
    position: 'absolute',
    top: H * 0.14,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#eef2f8' },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconCircle: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  rowLabel: {
    fontFamily: 'Baloo2-Bold',
    fontWeight: '700',
    fontSize: 17,
    color: '#2a3a5c',
    letterSpacing: 0.5,
  },
  toggle: { width: 58, height: 32, borderRadius: 999, position: 'relative' },
  thumb: {
    position: 'absolute',
    top: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  resetBtn: {
    position: 'absolute',
    top: H * 0.56,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 18,
    borderBottomColor: '#a01818',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  resetIcon: { fontSize: 22 },
  resetText: {
    fontFamily: 'Baloo2-ExtraBold',
    fontWeight: '800',
    fontSize: 20,
    color: '#fff',
    letterSpacing: 1,
  },
  version: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
    color: '#b0c4e8',
  },
});
