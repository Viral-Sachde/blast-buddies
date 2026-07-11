// ============================================================
// BLAST BUDDIES — App shell: navigation, state, theme
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider, useThemeContext } from './src/theme';
import { loadProfile, saveProfile, loadSettings, saveSettings } from './src/storage';
import { DEFAULT_PROFILE, DEFAULT_SETTINGS, BACKGROUNDS, CANNONS } from './src/data';
import {
  Profile,
  AppSettings,
  Route,
  Popup,
  WinResult,
  LoseResult,
  Background,
  CannonSkin,
  UpgradeDef,
} from './src/types';

import { SplashScreen } from './src/screens/SplashScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ShopScreen } from './src/screens/ShopScreen';
import { UpgradesScreen } from './src/screens/UpgradesScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { DailySpinScreen } from './src/screens/DailySpinScreen';
import { GameScreen } from './src/screens/GameScreen';
import { WinPopup } from './src/popups/WinPopup';
import { GameOverPopup } from './src/popups/GameOverPopup';

interface Prize {
  t: 'coin' | 'gem';
  v: number;
}

function AppContent() {
  const { setTheme } = useThemeContext();
  const [profile, setProfile] = useState<Profile>({ ...DEFAULT_PROFILE });
  const [settings, setSettings] = useState<AppSettings>({ ...DEFAULT_SETTINGS });
  const [route, setRoute] = useState<Route>('splash');
  const [popup, setPopup] = useState<Popup | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load persisted state
  useEffect(() => {
    async function init() {
      const [p, s] = await Promise.all([loadProfile(), loadSettings()]);
      setProfile(p);
      setSettings(s);
      setLoaded(true);
    }
    init();
  }, []);

  // Persist profile changes
  useEffect(() => {
    if (loaded) saveProfile(profile);
  }, [profile, loaded]);

  // Persist settings changes
  useEffect(() => {
    if (loaded) saveSettings(settings);
  }, [settings, loaded]);

  const go = useCallback((r: string) => setRoute(r as Route), []);

  const cannonSkin: CannonSkin =
    CANNONS.find((c) => c.id === profile.selectedCannon) || CANNONS[0];
  const bg: Background =
    BACKGROUNDS.find((b) => b.id === profile.selectedBg) || BACKGROUNDS[0];

  // ---- Profile mutations ----
  const addCoins = useCallback((d: number) => {
    setProfile((p) => ({ ...p, coins: Math.max(0, Math.round(p.coins + d)) }));
  }, []);

  const addGems = useCallback((d: number) => {
    setProfile((p) => ({ ...p, gems: Math.max(0, Math.round(p.gems + d)) }));
  }, []);

  const buyBg = useCallback((b: Background) => {
    setProfile((p) =>
      p.coins >= b.cost
        ? {
            ...p,
            coins: p.coins - b.cost,
            unlockedBgs: [...p.unlockedBgs, b.id],
            selectedBg: b.id,
          }
        : p,
    );
  }, []);

  const selectBg = useCallback((id: string) => {
    setProfile((p) => ({ ...p, selectedBg: id }));
  }, []);

  const buyCannon = useCallback((c: CannonSkin) => {
    setProfile((p) =>
      p.coins >= c.cost
        ? {
            ...p,
            coins: p.coins - c.cost,
            unlockedCannons: [...p.unlockedCannons, c.id],
            selectedCannon: c.id,
          }
        : p,
    );
  }, []);

  const selectCannon = useCallback((id: string) => {
    setProfile((p) => ({ ...p, selectedCannon: id }));
  }, []);

  const doUpgrade = useCallback((u: UpgradeDef, cost: number) => {
    setProfile((p) =>
      p.coins >= cost
        ? {
            ...p,
            coins: p.coins - cost,
            upgrades: {
              ...p.upgrades,
              [u.id]: ((p.upgrades as any)[u.id] || 0) + 1,
            },
          }
        : p,
    );
  }, []);

  const onPrize = useCallback((prize: Prize) => {
    if (prize.t === 'coin') addCoins(prize.v);
    else addGems(prize.v);
  }, [addCoins, addGems]);

  const reset = useCallback(() => {
    setProfile({ ...DEFAULT_PROFILE });
    setSettings({ ...DEFAULT_SETTINGS });
  }, []);

  // ---- Game outcomes ----
  // On win/lose the route goes back to 'home' so the game fully unmounts;
  // the popup renders on top of the home screen. This prevents a fresh game
  // from running (and losing) invisibly behind the popup.
  const onWin = useCallback((result: WinResult) => {
    setProfile((p) => {
      let prog = p.lvlProgress + 0.34;
      let lvl = p.level;
      while (prog >= 1) { prog -= 1; lvl += 1; }
      return {
        ...p,
        coins: p.coins + result.bonus,
        gems: p.gems + result.gems,
        level: lvl,
        lvlProgress: prog,
      };
    });
    setPopup({ kind: 'win', result });
    setRoute('home');
  }, []);

  const onLose = useCallback((result: LoseResult) => {
    setPopup({ kind: 'lose', result });
    setRoute('home');
  }, []);

  const startGame = useCallback(() => {
    setPopup(null);
    setRoute('game');
  }, []);

  if (!loaded) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {route === 'splash' && <SplashScreen onDone={() => go('home')} />}
      {route === 'home' && (
        <HomeScreen
          profile={profile}
          cannonSkin={cannonSkin}
          go={go}
          onPlay={startGame}
        />
      )}
      {route === 'shop' && (
        <ShopScreen
          profile={profile}
          go={go}
          buyBg={buyBg}
          selectBg={selectBg}
          buyCannon={buyCannon}
          selectCannon={selectCannon}
        />
      )}
      {route === 'upgrades' && (
        <UpgradesScreen profile={profile} go={go} doUpgrade={doUpgrade} />
      )}
      {route === 'settings' && (
        <SettingsScreen
          profile={profile}
          go={go}
          settings={settings}
          setSettings={setSettings}
          onReset={reset}
        />
      )}
      {route === 'daily' && (
        <DailySpinScreen profile={profile} go={go} onPrize={onPrize} />
      )}
      {route === 'game' && !popup && (
        <GameScreen
          profile={profile}
          bg={bg}
          cannonSkin={cannonSkin}
          onExit={() => { setPopup(null); go('home'); }}
          onWin={onWin}
          onLose={onLose}
          onCoins={addCoins}
        />
      )}

      {popup && popup.kind === 'win' && (
        <WinPopup
          result={popup.result}
          onHome={() => { setPopup(null); go('home'); }}
          onNext={startGame}
        />
      )}
      {popup && popup.kind === 'lose' && (
        <GameOverPopup
          result={popup.result}
          onHome={() => { setPopup(null); go('home'); }}
          onRetry={startGame}
        />
      )}
    </View>
  );
}

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </SafeAreaProvider>
    </View>
  );
}
