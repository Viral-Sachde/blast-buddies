import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Ellipse, Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Logo } from '../components/Logo';
import { LevelBadge } from '../components/LevelBadge';
import { Chip } from '../components/Chip';
import { Cannon } from '../components/Cannon';
import { NavBtn } from '../components/NavBtn';
import { Icon } from '../components/Icon';
import { ChunkyButton, IconButton } from '../components/ChunkyButton';
import { Monster } from '../components/Monster';
import { useTheme } from '../theme';
import { Profile, CannonSkin } from '../types';

const { width: W, height: H } = Dimensions.get('window');

function Landscape() {
  return (
    <View style={styles.landscape}>
      <Svg width={W} height={280} viewBox={`0 0 ${W} 280`}>
        <Path
          d={`M0 120 Q${W * 0.2} 60 ${W * 0.5} 90 Q${W * 0.8} 120 ${W} 80 L${W} 280 L0 280 Z`}
          fill="#4a9e5c"
          opacity={0.6}
        />
        <Path
          d={`M0 160 Q${W * 0.3} 110 ${W * 0.5} 140 Q${W * 0.7} 170 ${W} 130 L${W} 280 L0 280 Z`}
          fill="#3d8f4e"
          opacity={0.8}
        />
        <Path
          d={`M0 200 Q${W * 0.25} 170 ${W * 0.5} 190 Q${W * 0.75} 210 ${W} 180 L${W} 280 L0 280 Z`}
          fill="#2f7a3e"
        />
        <Ellipse cx={W * 0.2} cy={250} rx={16} ry={8} fill="#ffcc00" opacity={0.6} />
        <Ellipse cx={W * 0.4} cy={260} rx={10} ry={6} fill="#ff88aa" opacity={0.5} />
        <Ellipse cx={W * 0.65} cy={245} rx={12} ry={7} fill="#ffcc00" opacity={0.5} />
        <Ellipse cx={W * 0.85} cy={255} rx={14} ry={8} fill="#ff88cc" opacity={0.4} />
      </Svg>
    </View>
  );
}

function Cloud({ x, y, size, opacity }: { x: number; y: number; size: number; opacity: number }) {
  return (
    <View style={[styles.cloud, { left: x, top: y, opacity }]}>
      <Svg width={size} height={size * 0.5} viewBox="0 0 120 60">
        <Ellipse cx="60" cy="38" rx="55" ry="20" fill="#fff" opacity={0.4} />
        <Ellipse cx="40" cy="28" rx="30" ry="22" fill="#fff" opacity={0.5} />
        <Ellipse cx="75" cy="30" rx="28" ry="20" fill="#fff" opacity={0.45} />
        <Ellipse cx="55" cy="22" rx="25" ry="18" fill="#fff" opacity={0.6} />
      </Svg>
    </View>
  );
}

function GrassyPlatform() {
  return (
    <View style={styles.platform}>
      <Svg width={200} height={60} viewBox="0 0 200 60">
        <Ellipse cx="100" cy="30" rx="95" ry="28" fill="#3a8f4a" />
        <Ellipse cx="100" cy="26" rx="90" ry="24" fill="#4aaa5a" />
        <Ellipse cx="100" cy="22" rx="85" ry="20" fill="#55bb66" />
        <Ellipse cx="30" cy="16" rx="5" ry="4" fill="#ff9900" opacity={0.7} />
        <Ellipse cx="170" cy="18" rx="4" ry="3" fill="#ff66aa" opacity={0.6} />
        <Ellipse cx="55" cy="12" rx="3" ry="3" fill="#ffcc00" opacity={0.6} />
        <Ellipse cx="150" cy="14" rx="4" ry="3" fill="#ffcc00" opacity={0.5} />
      </Svg>
    </View>
  );
}

interface HomeScreenProps {
  profile: Profile;
  cannonSkin: CannonSkin;
  go: (route: string) => void;
  onPlay: () => void;
}

export function HomeScreen({ profile, cannonSkin, go, onPlay }: HomeScreenProps) {
  const theme = useTheme();

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
      colors={['#0a1e5c', '#1446a0', '#2a8fd6', '#5ec8ff']}
      locations={[0, 0.35, 0.65, 1]}
      style={StyleSheet.absoluteFill}
    >
      <Cloud x={-20} y={H * 0.28} size={140} opacity={0.3} />
      <Cloud x={W * 0.6} y={H * 0.22} size={120} opacity={0.25} />
      <Cloud x={W * 0.1} y={H * 0.42} size={100} opacity={0.2} />
      <Cloud x={W * 0.7} y={H * 0.45} size={110} opacity={0.15} />

      <Landscape />

      {/* Top HUD */}
      <View style={styles.hud}>
        <LevelBadge level={profile.level} progress={profile.lvlProgress} />
        <View style={styles.chips}>
          <Chip icon="coin" value={profile.coins} onAdd={() => go('shop')} />
          <Chip icon="gem" value={profile.gems} onAdd={() => go('shop')} />
        </View>
      </View>

      {/* Settings gear */}
      <IconButton onPress={() => go('settings')} style={styles.settingsBtn}>
        <Icon name="gear" size={24} color="#fff" />
      </IconButton>

      {/* Logo with buddies */}
      <View style={styles.logoArea}>
        <View style={styles.buddyRow}>
          <Monster skin={{ body: '#ff5ea8', dark: '#d62f80' }} num="" size={42} style={{ transform: [{ rotate: '-12deg' }] }} />
          <Monster skin={{ body: '#34dec0', dark: '#16a98e' }} num="" size={46} style={{ transform: [{ rotate: '-5deg' }] }} />
          <Monster skin={{ body: '#ffc83d', dark: '#e09a00' }} num="" size={52} />
          <Monster skin={{ body: '#ff7a5c', dark: '#d9492c' }} num="" size={46} style={{ transform: [{ rotate: '5deg' }] }} />
          <Monster skin={{ body: '#7c5cff', dark: '#5436d6' }} num="" size={42} style={{ transform: [{ rotate: '12deg' }] }} />
        </View>
        <Logo scale={1} withMascot={false} />
      </View>

      {/* Cannon on grassy platform */}
      <View style={styles.cannonSection}>
        <Animated.View style={cannonFloatStyle}>
          <Cannon skin={cannonSkin} size={150} angle={-8} />
        </Animated.View>
        <GrassyPlatform />
      </View>

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
        <NavBtn icon="shop" label="Shop" color={theme.primary} onClick={() => go('shop')} />
        <NavBtn icon="power" label="Power" color={theme.gem} onClick={() => go('upgrades')} />
        <NavBtn icon="gift" label="Daily" color={theme.gold} onClick={() => go('daily')} badge />
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
    top: 66,
    right: 12,
    width: 48,
    height: 48,
    zIndex: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  logoArea: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  buddyRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: -4,
    alignItems: 'flex-end',
  },
  cannonSection: {
    position: 'absolute',
    bottom: 240,
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  platform: {
    marginTop: -20,
  },
  landscape: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  cloud: {
    position: 'absolute',
    zIndex: 0,
  },
  playArea: {
    position: 'absolute',
    bottom: 130,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 3,
  },
  playBtn: {
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5bc920',
    borderBottomColor: '#3a9a10',
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
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 28,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    zIndex: 3,
  },
});
