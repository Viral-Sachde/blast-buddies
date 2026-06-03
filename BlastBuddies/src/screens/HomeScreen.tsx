import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Image, Pressable, Animated } from 'react-native';
import { LevelBadge } from '../components/LevelBadge';
import { Chip } from '../components/Chip';
import { Profile, CannonSkin } from '../types';

const { width: W, height: H } = Dimensions.get('window');

// ─── Assets ──────────────────────────────────────────────────────────────────
const BG = require('../../assets/home-screen/home-screen-bg.png');

const PLAY_R = require('../../assets/home-screen/buttons/play/play-regular-state-button.png');
const PLAY_B = require('../../assets/home-screen/buttons/play/play-bounce-state-button.png');
const PLAY_P = require('../../assets/home-screen/buttons/play/play-pressed-state-button.png');

const SHOP_R = require('../../assets/home-screen/buttons/shop/shop-regular-state-button.png');
const SHOP_B = require('../../assets/home-screen/buttons/shop/shop-bounce-state-button.png');
const SHOP_P = require('../../assets/home-screen/buttons/shop/shop-pressed-state-button.png');

const POWER_R = require('../../assets/home-screen/buttons/power/power-regular-state-button.png');
const POWER_B = require('../../assets/home-screen/buttons/power/power-bounce-state-button.png');
const POWER_P = require('../../assets/home-screen/buttons/power/power-pressed-state-button.png');

const DAILY_R = require('../../assets/home-screen/buttons/daily-execlaim/daily-ex-regular-state-button.png');
const DAILY_B = require('../../assets/home-screen/buttons/daily-execlaim/daily-ex-bounce-state-button.png');
const DAILY_P = require('../../assets/home-screen/buttons/daily-execlaim/daily-ex-pressed-state-button.png');

const SETTINGS_R = require('../../assets/home-screen/buttons/settings/settings-regular-state-button.png');
const SETTINGS_B = require('../../assets/home-screen/buttons/settings/settings-bounce-state-button.png');
const SETTINGS_P = require('../../assets/home-screen/buttons/settings/settings-pushed-state-button.png');

// ─── BounceButton ─────────────────────────────────────────────────────────────
// normal → (pressIn) bounce scale-up → pressed scale-down → (pressOut) spring back
type ImgState = 'normal' | 'bounce' | 'pressed';

interface BounceButtonProps {
  normal: any;
  bounce: any;
  pressed: any;
  onPress: () => void;
  width: number;
  height: number;
  style?: object;
  /** Continuous idle pulse (for PLAY button) */
  idlePulse?: boolean;
}

function BounceButton({
  normal, bounce, pressed, onPress,
  width, height, style, idlePulse = false,
}: BounceButtonProps) {
  const [imgState, setImgState] = useState<ImgState>('normal');
  const scale = useRef(new Animated.Value(1)).current;
  const idleAnim = useRef<Animated.CompositeAnimation | null>(null);
  const pressAnim = useRef<Animated.CompositeAnimation | null>(null);

  // Idle gentle pulse (only for PLAY)
  useEffect(() => {
    if (!idlePulse) return;
    idleAnim.current = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.055, duration: 750, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1.0,   duration: 750, useNativeDriver: true }),
      ]),
    );
    idleAnim.current.start();
    return () => idleAnim.current?.stop();
  }, []);

  const stopIdle = useCallback(() => {
    idleAnim.current?.stop();
    pressAnim.current?.stop();
  }, []);

  const startIdle = useCallback(() => {
    if (!idlePulse) return;
    idleAnim.current = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.055, duration: 750, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1.0,   duration: 750, useNativeDriver: true }),
      ]),
    );
    idleAnim.current.start();
  }, []);

  const handlePressIn = useCallback(() => {
    stopIdle();
    setImgState('bounce');
    // Phase 1: scale up (bounce anticipation)
    pressAnim.current = Animated.timing(scale, {
      toValue: 1.14,
      duration: 65,
      useNativeDriver: true,
    });
    pressAnim.current.start(({ finished }) => {
      if (!finished) return;
      // Phase 2: squash down (pressed)
      setImgState('pressed');
      pressAnim.current = Animated.timing(scale, {
        toValue: 0.91,
        duration: 80,
        useNativeDriver: true,
      });
      pressAnim.current.start();
    });
  }, []);

  const handlePressOut = useCallback(() => {
    pressAnim.current?.stop();
    setImgState('normal');
    // Spring back with slight overshoot
    Animated.spring(scale, {
      toValue: 1.0,
      speed: 22,
      bounciness: 9,
      useNativeDriver: true,
    }).start(() => startIdle());
  }, []);

  const src = imgState === 'bounce' ? bounce : imgState === 'pressed' ? pressed : normal;

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={style}
    >
      <Animated.Image
        source={src}
        style={{ width, height, transform: [{ scale }] }}
        resizeMode="contain"
      />
    </Pressable>
  );
}

// ─── HomeScreen ───────────────────────────────────────────────────────────────
interface HomeScreenProps {
  profile: Profile;
  cannonSkin: CannonSkin;
  go: (route: string) => void;
  onPlay: () => void;
}

// PLAY button width — all bottom buttons span the same total width
const PLAY_W    = W * 0.76;
const PLAY_H    = 82;
const NAV_GAP   = 8;
const NAV_BTN_W = (PLAY_W - NAV_GAP * 2) / 3;  // 3 buttons fill same span as PLAY
const NAV_BTN_H = NAV_BTN_W * 1.08;             // slightly taller than wide (square-ish)

export function HomeScreen({ profile, cannonSkin, go, onPlay }: HomeScreenProps) {
  return (
    <View style={styles.root}>
      <Image source={BG} style={styles.bg} resizeMode="cover" />

      {/* Top HUD — level badge left, coins+gems right */}
      <View style={styles.hud}>
        <LevelBadge level={profile.level} progress={profile.lvlProgress} />
        <View style={styles.chips}>
          <Chip icon="coin" value={profile.coins} onAdd={() => go('shop')} />
          <Chip icon="gem"  value={profile.gems}  onAdd={() => go('shop')} />
        </View>
      </View>

      {/* Settings — top right, clear of HUD */}
      <BounceButton
        normal={SETTINGS_R} bounce={SETTINGS_B} pressed={SETTINGS_P}
        onPress={() => go('settings')}
        width={58} height={58}
        style={styles.settingsBtn}
      />

      {/* PLAY — moved lower so it doesn't cover the cannon platform */}
      <View style={styles.playArea}>
        <BounceButton
          normal={PLAY_R} bounce={PLAY_B} pressed={PLAY_P}
          onPress={onPlay}
          width={PLAY_W} height={PLAY_H}
          idlePulse
        />
      </View>

      {/* SHOP | POWER | DAILY — same total width as PLAY, tight gap, close below */}
      <View style={styles.bottomNav}>
        <BounceButton normal={SHOP_R}  bounce={SHOP_B}  pressed={SHOP_P}  onPress={() => go('shop')}     width={NAV_BTN_W} height={NAV_BTN_H} />
        <BounceButton normal={POWER_R} bounce={POWER_B} pressed={POWER_P} onPress={() => go('upgrades')} width={NAV_BTN_W} height={NAV_BTN_H} />
        <BounceButton normal={DAILY_R} bounce={DAILY_B} pressed={DAILY_P} onPress={() => go('daily')}    width={NAV_BTN_W} height={NAV_BTN_H} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  bg:   { position: 'absolute', width: W, height: H, top: 0, left: 0 },

  hud: {
    position: 'absolute',
    top: 14, left: 12, right: 80,   // right: 80 leaves room for settings circle
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 3,
  },
  chips: { flexDirection: 'row', gap: 8 },

  settingsBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 4,
  },

  // Moved down compared to before — clears the cannon/platform area
  playArea: {
    position: 'absolute',
    bottom: H * 0.135,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 3,
  },

  // Immediately below PLAY, same total width, tight 8px gaps
  bottomNav: {
    position: 'absolute',
    bottom: H * 0.025,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: NAV_GAP,
    zIndex: 3,
  },
});
