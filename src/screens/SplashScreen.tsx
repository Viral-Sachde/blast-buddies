// ============================================================
// BLAST BUDDIES — Splash screen with loading bar
// ============================================================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
import { ChunkyButton } from '../components/ChunkyButton';
import { useTheme } from '../theme';

interface SplashScreenProps {
  onDone: () => void;
}

export function SplashScreen({ onDone }: SplashScreenProps) {
  const theme = useTheme();
  const [pct, setPct] = useState(0);

  // Pulse animation for the TAP TO PLAY button
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

  return (
    <LinearGradient
      colors={[theme.menuTop, theme.menuBot]}
      style={StyleSheet.absoluteFill}
    >
      <BgBlobs />
      <View style={styles.content}>
        <Logo scale={1.05} />

        {/* Loading bar */}
        <View style={styles.barArea}>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${pct}%` as any,
                  backgroundColor: theme.primary,
                },
              ]}
            />
          </View>
          <Text style={[styles.loadText, { color: theme.ink }]}>
            {pct < 100 ? 'Loading buddies…' : 'Ready!'}
          </Text>
        </View>

        {/* TAP TO PLAY button */}
        {pct >= 100 && (
          <Animated.View style={[styles.playWrapper, pulseStyle]}>
            <ChunkyButton
              onPress={onDone}
              variant="primary"
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
  barArea: {
    marginTop: 54,
    width: 220,
    zIndex: 2,
  },
  barTrack: {
    height: 20,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.16)',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
  },
  loadText: {
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Baloo2-Bold',
    fontWeight: '700',
    opacity: 0.8,
  },
  playWrapper: {
    marginTop: 26,
    zIndex: 2,
  },
});
