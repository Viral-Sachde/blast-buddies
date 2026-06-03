import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import BlastLoadingBar from '../components/BlastLoadingBar';

const { width: W, height: H } = Dimensions.get('window');
const BG = require('../../assets/loading-screen/loading-screen-bg.png');

interface SplashScreenProps {
  onDone: () => void;
}

export function SplashScreen({ onDone }: SplashScreenProps) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let p = 0;
    // ~80ms * ~68 steps ≈ 5.5 seconds total
    const id = setInterval(() => {
      p += 1.2 + Math.random() * 0.8; // 1.2–2.0% per tick, avg ~1.6%
      if (p >= 100) {
        p = 100;
        clearInterval(id);
        setPct(100);
        // Brief pause so bar visually completes, then navigate
        setTimeout(onDone, 350);
        return;
      }
      setPct(Math.round(p));
    }, 80);
    return () => clearInterval(id);
  }, []);

  return (
    <View style={styles.root}>
      <Image source={BG} style={styles.bg} resizeMode="cover" />

      {/* Loading bar only — no text, positioned below the cannon */}
      <View style={styles.barSection}>
        <BlastLoadingBar progress={pct} width={W * 0.78} />
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
  barSection: {
    position: 'absolute',
    bottom: H * 0.16,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
