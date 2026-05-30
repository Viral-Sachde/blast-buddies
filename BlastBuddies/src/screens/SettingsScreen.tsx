import React from 'react';
import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SubHeader } from '../components/SubHeader';
import { Panel } from '../components/Panel';
import { Icon } from '../components/Icon';
import { Profile, AppSettings } from '../types';

interface SettingsScreenProps {
  profile: Profile;
  go: (route: string) => void;
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  onReset: () => void;
}

function SettingsIcon({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <View style={[styles.iconCircle, { backgroundColor: color }]}>
      {children}
    </View>
  );
}

function ToggleRow({
  label,
  value,
  onToggle,
  iconColor,
  iconName,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
  iconColor: string;
  iconName: string;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <SettingsIcon color={iconColor}>
          <Icon name={iconName} size={20} color="#fff" />
        </SettingsIcon>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Pressable
        onPress={onToggle}
        style={[
          styles.toggle,
          { backgroundColor: value ? '#4cd964' : '#c4cdda' },
        ]}
      >
        <View
          style={[
            styles.thumb,
            { left: value ? 29 : 3 },
          ]}
        />
      </Pressable>
    </View>
  );
}

export function SettingsScreen({
  profile,
  go,
  settings,
  setSettings,
  onReset,
}: SettingsScreenProps) {
  const toggle = (key: keyof AppSettings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Progress',
      'Reset all progress? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: onReset },
      ],
    );
  };

  return (
    <LinearGradient
      colors={['#0a1e5c', '#1446a0', '#2a8fd6']}
      locations={[0, 0.5, 1]}
      style={StyleSheet.absoluteFill}
    >
      <SubHeader title="SETTINGS" profile={profile} onBack={() => go('home')} />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.screenTitle}>SETTINGS</Text>
          <Text style={styles.star}>⭐</Text>
        </View>

        <Panel style={styles.card}>
          <ToggleRow
            label="MUSIC"
            value={settings.music}
            onToggle={() => toggle('music')}
            iconColor="#2ecbff"
            iconName="star"
          />
          <ToggleRow
            label="SOUND FX"
            value={settings.sound}
            onToggle={() => toggle('sound')}
            iconColor="#ff9500"
            iconName="power"
          />
          <ToggleRow
            label="VIBRATION"
            value={settings.vibrate}
            onToggle={() => toggle('vibrate')}
            iconColor="#ff9500"
            iconName="speed"
          />
          <ToggleRow
            label="NOTIFICATIONS"
            value={settings.notify}
            onToggle={() => toggle('notify')}
            iconColor="#ffc83d"
            iconName="gift"
          />
        </Panel>

        <Pressable
          onPress={handleReset}
          style={({ pressed }) => [
            styles.resetBtn,
            {
              backgroundColor: pressed ? '#cc2020' : '#e83030',
              transform: [{ translateY: pressed ? 3 : 0 }],
              borderBottomWidth: pressed ? 2 : 5,
            },
          ]}
        >
          <Text style={styles.resetIcon}>🔄</Text>
          <Text style={styles.resetText}>RESET PROGRESS</Text>
        </Pressable>

        <Text style={styles.version}>
          Blast Buddies • v1.0.0
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  content: {
    position: 'absolute',
    top: 74,
    left: 16,
    right: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  screenTitle: {
    fontFamily: 'Baloo2-ExtraBold',
    fontWeight: '800',
    fontSize: 32,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  star: {
    fontSize: 22,
  },
  card: {
    borderRadius: 24,
    padding: 8,
    paddingVertical: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eef2f8',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontFamily: 'Baloo2-Bold',
    fontWeight: '700',
    fontSize: 17,
    color: '#2a3a5c',
    letterSpacing: 0.5,
  },
  toggle: {
    width: 60,
    height: 34,
    borderRadius: 999,
    position: 'relative',
  },
  thumb: {
    position: 'absolute',
    top: 3,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 18,
    borderBottomColor: '#a01818',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  resetIcon: {
    fontSize: 22,
  },
  resetText: {
    fontFamily: 'Baloo2-ExtraBold',
    fontWeight: '800',
    fontSize: 20,
    color: '#fff',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  version: {
    textAlign: 'center',
    marginTop: 22,
    fontWeight: '600',
    fontSize: 14,
    color: '#b0c4e8',
  },
});
