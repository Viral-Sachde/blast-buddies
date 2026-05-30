// ============================================================
// BLAST BUDDIES — Home / Main Menu screen
// ============================================================

import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Logo } from '../components/Logo';
import { BgBlobs } from '../components/BgBlobs';
import { LevelBadge } from '../components/LevelBadge';
import { Chip } from '../components/Chip';
import { Cannon } from '../components/Cannon';
import { NavBtn } from '../components/NavBtn';
import { Icon } from '../components/Icon';
import { ChunkyButton, IconButton } from '../components/ChunkyButton';
import { useTheme } from '../theme';
import { Profile, CannonSkin } from '../types';

interface HomeScreenProps {
  profile: Profile;
  cannonSkin: CannonSkin;
  go: (route: string) => void;
  onPlay: () => void;
}

export function HomeScreen({ profile, cannonSkin, go, onPlay }: HomeScreenProps) {
  const theme = useTheme();

  // Floating cannon animation
  const cannonY = useSharedValue(0);
  useEffect(() => {
    cannonY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1700 }),
        withTiming(0, { duration: 1700 }),
      ),
      -1,
      false,
    );
  }, []);
  const cannonFloatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cannonY.value }],
  }));

  // Pulse animation for PLAY button
  const playScale = useSharedValue(1);
  useEffect(() => {
    playScale.value = withRepeat(
      withSequence(
        withTiming(1.07, { duration: 700 }),
        withTiming(1.0, { duration: 700 }),
      ),
      -1,
      false,
    );
  }, []);
  const playPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: playScale.value }],
  }));

  return (
    <LinearGradient
      colors={[theme.menuTop, theme.menuBot]}
      style={StyleSheet.absoluteFill}
    >
      <BgBlobs />

      {/* Top HUD */}
      <View style={styles.hud}>
        <LevelBadge level={profile.level} progress={profile.lvlProgress} />
        <View style={styles.chips}>
          <Chip icon="coin" value={profile.coins} onAdd={() => go('shop')} />
          <Chip icon="gem" value={profile.gems} onAdd={() => go('shop')} />
        </View>
      </View>

      {/* Settings gear button */}
      <IconButton
        onPress={() => go('settings')}
        style={[styles.settingsBtn]}
      >
        <Icon name="gear" size={24} color="#5a6678" />
      </IconButton>

      {/* Logo */}
      <View style={styles.logoArea}>
        <Logo scale={1} />
      </View>

      {/* Floating cannon */}
      <Animated.View style={[styles.cannonWrapper, cannonFloatStyle]}>
        <Cannon skin={cannonSkin} size={150} angle={-8} />
      </Animated.View>

      {/* Cannon shadow */}
      <View style={styles.cannonShadow} />

      {/* PLAY button */}
      <View style={styles.playArea}>
        <Animated.View style={playPulseStyle}>
          <ChunkyButton
            onPress={onPlay}
            variant="accent"
            fontSize={32}
            paddingVertical={20}
            paddingHorizontal={70}
            style={styles.playBtn}
          >
            <View style={styles.playInner}>
              <Icon name="play" size={30} color="#fff" />
              <Text style={styles.playText}> PLAY</Text>
            </View>
          </ChunkyButton>
        </Animated.View>
      </View>

      {/* Bottom nav */}
      <View style={styles.bottomNav}>
        <NavBtn
          icon="shop"
          label="Shop"
          color={theme.primary}
          onClick={() => go('shop')}
        />
        <NavBtn
          icon="up"
          label="Power"
          color={theme.gem}
          onClick={() => go('upgrades')}
        />
        <NavBtn
          icon="gift"
          label="Daily"
          color={theme.gold}
          onClick={() => go('daily')}
          badge
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
  chips: {
    flexDirection: 'row',
    gap: 8,
  },
  settingsBtn: {
    position: 'absolute',
    top: 92,
    right: 12,
    width: 48,
    height: 48,
    zIndex: 3,
  },
  logoArea: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  cannonWrapper: {
    position: 'absolute',
    bottom: 232,
    alignSelf: 'center',
    zIndex: 2,
  },
  cannonShadow: {
    position: 'absolute',
    bottom: 226,
    alignSelf: 'center',
    width: 130,
    height: 22,
    borderRadius: 65,
    backgroundColor: 'rgba(0,0,0,0.14)',
    zIndex: 1,
  },
  playArea: {
    position: 'absolute',
    bottom: 118,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 3,
  },
  playBtn: {
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  playInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playText: {
    fontFamily: 'Baloo2-ExtraBold',
    fontWeight: '800',
    fontSize: 32,
    color: '#fff',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    zIndex: 3,
  },
});
