import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Pressable, Animated } from 'react-native';
import { LevelBadge } from '../components/LevelBadge';
import { Chip } from '../components/Chip';
import { Profile, CannonSkin } from '../types';

const { width: W, height: H } = Dimensions.get('window');

// Backgrounds
const BG = require('../../assets/home-screen/home-screen-bg.png');

// Buttons
const PLAY_NORMAL  = require('../../assets/home-screen/buttons/play/play-regular-state-button.png');
const PLAY_PRESSED = require('../../assets/home-screen/buttons/play/play-pressed-state-button.png');
const PLAY_BOUNCE  = require('../../assets/home-screen/buttons/play/play-bounce-state-button.png');

const SHOP_NORMAL  = require('../../assets/home-screen/buttons/shop/shop-regular-state-button.png');
const SHOP_PRESSED = require('../../assets/home-screen/buttons/shop/shop-pressed-state-button.png');

const POWER_NORMAL  = require('../../assets/home-screen/buttons/power/power-regular-state-button.png');
const POWER_PRESSED = require('../../assets/home-screen/buttons/power/power-pressed-state-button.png');

const DAILY_NORMAL  = require('../../assets/home-screen/buttons/daily-execlaim/daily-ex-regular-state-button.png');
const DAILY_PRESSED = require('../../assets/home-screen/buttons/daily-execlaim/daily-ex-pressed-state-button.png');

const SETTINGS_NORMAL  = require('../../assets/home-screen/buttons/settings/settings-regular-state-button.png');
const SETTINGS_PRESSED = require('../../assets/home-screen/buttons/settings/settings-pushed-state-button.png');

interface PngButtonProps {
  normal: any;
  pressed: any;
  onPress: () => void;
  width: number;
  height: number;
  style?: object;
}
function PngButton({ normal, pressed: pressedSrc, onPress, width, height, style }: PngButtonProps) {
  const [isPressed, setIsPressed] = React.useState(false);
  return (
    <Pressable
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
      style={style}
    >
      <Image source={isPressed ? pressedSrc : normal} style={{ width, height }} resizeMode="contain" />
    </Pressable>
  );
}

interface HomeScreenProps {
  profile: Profile;
  cannonSkin: CannonSkin;
  go: (route: string) => void;
  onPlay: () => void;
}

export function HomeScreen({ profile, cannonSkin, go, onPlay }: HomeScreenProps) {
  // Pulse animation on PLAY button
  const playScale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(playScale, { toValue: 1.06, duration: 700, useNativeDriver: true }),
        Animated.timing(playScale, { toValue: 1.0, duration: 700, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  return (
    <View style={styles.root}>
      {/* Full-screen background */}
      <Image source={BG} style={styles.bg} resizeMode="cover" />

      {/* Top HUD */}
      <View style={styles.hud}>
        <LevelBadge level={profile.level} progress={profile.lvlProgress} />
        <View style={styles.chips}>
          <Chip icon="coin" value={profile.coins} onAdd={() => go('shop')} />
          <Chip icon="gem" value={profile.gems} onAdd={() => go('shop')} />
        </View>
      </View>

      {/* Settings button — top right */}
      <PngButton
        normal={SETTINGS_NORMAL}
        pressed={SETTINGS_PRESSED}
        onPress={() => go('settings')}
        width={58}
        height={58}
        style={styles.settingsBtn}
      />

      {/* PLAY button — center */}
      <Animated.View style={[styles.playArea, { transform: [{ scale: playScale }] }]}>
        <PngButton
          normal={PLAY_NORMAL}
          pressed={PLAY_PRESSED}
          onPress={onPlay}
          width={W * 0.72}
          height={90}
        />
      </Animated.View>

      {/* Bottom nav: SHOP | POWER | DAILY */}
      <View style={styles.bottomNav}>
        <PngButton normal={SHOP_NORMAL} pressed={SHOP_PRESSED} onPress={() => go('shop')} width={96} height={100} />
        <PngButton normal={POWER_NORMAL} pressed={POWER_PRESSED} onPress={() => go('upgrades')} width={96} height={100} />
        <PngButton normal={DAILY_NORMAL} pressed={DAILY_PRESSED} onPress={() => go('daily')} width={96} height={100} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  bg: {
    position: 'absolute',
    width: W,
    height: H,
    top: 0,
    left: 0,
  },
  hud: {
    position: 'absolute',
    top: 14,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 3,
  },
  chips: { flexDirection: 'row', gap: 8 },
  settingsBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 4,
  },
  playArea: {
    position: 'absolute',
    bottom: H * 0.175,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 3,
  },
  bottomNav: {
    position: 'absolute',
    bottom: H * 0.03,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
    zIndex: 3,
  },
});
