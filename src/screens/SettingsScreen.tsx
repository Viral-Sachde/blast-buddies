// ============================================================
// BLAST BUDDIES — Settings screen with toggles
// ============================================================

import React from 'react';
import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SubHeader } from '../components/SubHeader';
import { Panel } from '../components/Panel';
import { ChunkyButton } from '../components/ChunkyButton';
import { useTheme } from '../theme';
import { Profile, AppSettings } from '../types';

interface SettingsScreenProps {
  profile: Profile;
  go: (route: string) => void;
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  onReset: () => void;
}

function ToggleRow({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
}) {
  const theme = useTheme();
  return (
    <View style={[styles.row, { borderBottomColor: theme.panelEdge }]}>
      <Text style={[styles.rowLabel, { color: theme.ink }]}>{label}</Text>
      <Pressable
        onPress={onToggle}
        style={[
          styles.toggle,
          { backgroundColor: value ? theme.accent : '#c4cdda' },
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
  const theme = useTheme();

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
      colors={[theme.menuTop, theme.menuBot]}
      style={StyleSheet.absoluteFill}
    >
      <SubHeader title="Settings" profile={profile} onBack={() => go('home')} />
      <View style={styles.content}>
        <Panel>
          <ToggleRow label="🎵 Music" value={settings.music} onToggle={() => toggle('music')} />
          <ToggleRow label="🔊 Sound FX" value={settings.sound} onToggle={() => toggle('sound')} />
          <ToggleRow label="📳 Vibration" value={settings.vibrate} onToggle={() => toggle('vibrate')} />
          <ToggleRow label="🔔 Notifications" value={settings.notify} onToggle={() => toggle('notify')} />
        </Panel>
        <ChunkyButton
          onPress={handleReset}
          variant="gray"
          fontSize={18}
          paddingVertical={14}
          style={styles.resetBtn}
        >
          Reset Progress
        </ChunkyButton>
        <Text style={[styles.version, { color: theme.inkSoft }]}>
          Blast Buddies • v1.0
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  content: {
    position: 'absolute',
    top: 84,
    left: 16,
    right: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 2,
  },
  rowLabel: {
    fontFamily: 'Baloo2-Bold',
    fontWeight: '700',
    fontSize: 18,
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
    width: '100%',
    marginTop: 18,
  },
  version: {
    textAlign: 'center',
    marginTop: 18,
    fontWeight: '600',
    fontSize: 13,
  },
});
