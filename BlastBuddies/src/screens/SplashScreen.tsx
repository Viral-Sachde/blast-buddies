import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Logo } from '../components/Logo';
import { BgBlobs } from '../components/BgBlobs';
import { Cannon } from '../components/Cannon';
import { ChunkyButton } from '../components/ChunkyButton';
import { useTheme } from '../theme';

const { width: W, height: H } = Dimensions.get('window');

interface SplashScreenProps {
  onDone: () => void;
}

function LightRays() {
  const rotation = useSharedValue(0);
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 30000, easing: Easing.linear }),
      -1,
      false,
    );
  }, []);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
  const rays = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <Animated.View style={[styles.raysContainer, animStyle]}>
      {rays.map((deg) => (
        <View
          key={deg}
          style={[
            styles.ray,
            { transform: [{ rotate: `${deg}deg` }] },
          ]}
        />
      ))}
    </Animated.View>
  );
}

function Sparkle({ x, y, delay: d, size }: { x: number; y: number; delay: number; size: number }) {
  const opacity = useSharedValue(0);
  useEffect(() => {
    opacity.value = withDelay(
      d,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0.1, { duration: 600 }),
        ),
        -1,
        false,
      ),
    );
  }, []);
  const s = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#fff',
        },
        s,
      ]}
    />
  );
}

export function SplashScreen({ onDone }: SplashScreenProps) {
  const theme = useTheme();
  const [pct, setPct] = useState(0);

  const scale = useSharedValue(1);
  useEffect(() => {
    if (pct >= 100) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.07, { duration: 550 }),
          withTiming(1.0, { duration: 550 }),
        ),
        -1,
        false,
      );
    }
  }, [pct]);
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      p += 4 + Math.random() * 9;
      if (p >= 100) {
        p = 100;
        clearInterval(id);
      }
      setPct(p);
    }, 90);
    return () => clearInterval(id);
  }, []);

  const sparkles = [
    { x: W * 0.1, y: H * 0.15, delay: 0, size: 4 },
    { x: W * 0.85, y: H * 0.12, delay: 300, size: 5 },
    { x: W * 0.2, y: H * 0.35, delay: 600, size: 3 },
    { x: W * 0.78, y: H * 0.38, delay: 150, size: 4 },
    { x: W * 0.5, y: H * 0.08, delay: 450, size: 5 },
    { x: W * 0.15, y: H * 0.55, delay: 200, size: 3 },
    { x: W * 0.88, y: H * 0.52, delay: 500, size: 4 },
    { x: W * 0.35, y: H * 0.7, delay: 700, size: 3 },
    { x: W * 0.65, y: H * 0.68, delay: 100, size: 5 },
  ];

  return (
    <LinearGradient
      colors={['#050e2e', '#0a1e5c', '#1446a0', '#1a5cc0']}
      locations={[0, 0.3, 0.7, 1]}
      style={StyleSheet.absoluteFill}
    >
      <BgBlobs />

      {sparkles.map((sp, i) => (
        <Sparkle key={i} {...sp} />
      ))}

      <View style={styles.content}>
        <View style={styles.logoSection}>
          <LightRays />
          <Logo scale={1.1} />
        </View>

        <View style={styles.cannonArea}>
          <Cannon size={140} angle={-8} />
          <View style={styles.cannonPlatform} />
        </View>

        <View style={styles.barArea}>
          <View style={styles.barTrack}>
            <LinearGradient
              colors={['#ffd23f', '#ffb822', '#ff9500']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.barFill,
                { width: `${pct}%` as any },
              ]}
            />
            <View style={styles.barShine} />
          </View>
          <Text style={styles.loadText}>
            {pct < 100 ? 'Loading Buddies...' : 'Ready!'}
          </Text>
        </View>

        {pct >= 100 && (
          <Animated.View style={[styles.playWrapper, pulseStyle]}>
            <ChunkyButton
              onPress={onDone}
              variant="accent"
              fontSize={24}
              paddingVertical={16}
              paddingHorizontal={42}
            >
              TAP TO PLAY
            </ChunkyButton>
          </Animated.View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  logoSection: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  raysContainer: {
    position: 'absolute',
    width: 400,
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ray: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: 18,
    borderRightWidth: 18,
    borderBottomWidth: 200,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(100,180,255,0.08)',
    transformOrigin: 'bottom',
    bottom: '50%',
  },
  cannonArea: {
    alignItems: 'center',
    marginTop: 20,
  },
  cannonPlatform: {
    width: 160,
    height: 16,
    borderRadius: 80,
    backgroundColor: 'rgba(0,80,200,0.25)',
    marginTop: -14,
    shadowColor: '#0af',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  barArea: {
    marginTop: 40,
    width: 260,
    zIndex: 2,
  },
  barTrack: {
    height: 28,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.35)',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.45)',
    position: 'relative',
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
  },
  barShine: {
    position: 'absolute',
    top: 2,
    left: 10,
    right: 10,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  loadText: {
    textAlign: 'center',
    marginTop: 12,
    fontFamily: 'Baloo2-Bold',
    fontWeight: '700',
    fontSize: 16,
    color: '#b0d4ff',
  },
  playWrapper: {
    marginTop: 26,
    zIndex: 2,
  },
});
