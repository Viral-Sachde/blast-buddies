import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Pressable, Animated } from 'react-native';
import BlastLoadingBar from '../components/BlastLoadingBar';

const { width: W, height: H } = Dimensions.get('window');

const BG = require('../../assets/loading-screen/loading-screen-bg.png');
const PLAY_NORMAL = require('../../assets/home-screen/buttons/play/play-regular-state-button.png');
const PLAY_PRESSED = require('../../assets/home-screen/buttons/play/play-pressed-state-button.png');

interface SplashScreenProps {
  onDone: () => void;
}

export function SplashScreen({ onDone }: SplashScreenProps) {
  const [pct, setPct] = useState(0);
  const [pressed, setPressed] = useState(false);
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      p += 4 + Math.random() * 8;
      if (p >= 100) { p = 100; clearInterval(id); }
      setPct(Math.round(p));
    }, 110);
    return () => clearInterval(id);
  }, []);

  // Pulse the play button once loaded
  useEffect(() => {
    if (pct >= 100) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(btnScale, { toValue: 1.06, duration: 600, useNativeDriver: true }),
          Animated.timing(btnScale, { toValue: 1.0, duration: 600, useNativeDriver: true }),
        ]),
      ).start();
    }
  }, [pct >= 100]);

  return (
    <View style={styles.root}>
      <Image source={BG} style={styles.bg} resizeMode="cover" />

      {/* Loading bar — lower portion of screen, a bit above the bottom */}
      <View style={styles.barSection}>
        <BlastLoadingBar progress={pct} width={W * 0.78} />
        <Text style={styles.loadText}>
          {pct < 100 ? `LOADING BUDDIES...  ${pct}%` : 'READY!'}
        </Text>
      </View>

      {/* TAP TO PLAY once loaded */}
      {pct >= 100 && (
        <Animated.View style={[styles.playWrapper, { transform: [{ scale: btnScale }] }]}>
          <Pressable
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            onPress={onDone}
          >
            <Image
              source={pressed ? PLAY_PRESSED : PLAY_NORMAL}
              style={styles.playBtn}
              resizeMode="contain"
            />
          </Pressable>
        </Animated.View>
      )}
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
  barSection: {
    position: 'absolute',
    bottom: H * 0.20,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 10,
  },
  loadText: {
    fontFamily: 'Baloo2-Bold',
    fontWeight: '700',
    fontSize: 15,
    color: '#90c8ff',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  playWrapper: {
    position: 'absolute',
    bottom: H * 0.10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  playBtn: {
    width: 260,
    height: 80,
  },
});
