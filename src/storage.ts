// ============================================================
// BLAST BUDDIES — AsyncStorage helpers
// ============================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profile, AppSettings } from './types';
import { DEFAULT_PROFILE, DEFAULT_SETTINGS } from './data';

const PROFILE_KEY = 'bb_profile';
const SETTINGS_KEY = 'bb_settings';
const THEME_KEY = 'bb_theme';

export async function loadProfile(): Promise<Profile> {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    const parsed = JSON.parse(raw);
    // Merge with defaults to handle missing fields
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      upgrades: { ...DEFAULT_PROFILE.upgrades, ...(parsed.upgrades || {}) },
    };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export async function saveProfile(profile: Profile): Promise<void> {
  try {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {}
}

export async function loadSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
}

export async function loadTheme(): Promise<string> {
  try {
    const raw = await AsyncStorage.getItem(THEME_KEY);
    return raw || 'candy';
  } catch {
    return 'candy';
  }
}

export async function saveTheme(theme: string): Promise<void> {
  try {
    await AsyncStorage.setItem(THEME_KEY, theme);
  } catch {}
}
