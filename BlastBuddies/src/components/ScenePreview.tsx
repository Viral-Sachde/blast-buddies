// ============================================================
// BLAST BUDDIES — Mini background preview for shop tiles
// ============================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { Background } from '../types';

interface ScenePreviewProps {
  bg: Background;
  style?: object;
}

export function ScenePreview({ bg, style = {} }: ScenePreviewProps) {
  return (
    <LinearGradient
      colors={[bg.skyTop, bg.skyBot]}
      style={[styles.container, style]}
    >
      {/* Sun */}
      <View
        style={[
          styles.sun,
          { backgroundColor: bg.deco === 'stars' ? '#fff' : 'rgba(255,246,200,0.9)' },
        ]}
      />
      {/* Hills */}
      <View style={StyleSheet.absoluteFill}>
        <Svg viewBox="0 0 120 80" preserveAspectRatio="none" width="100%" height="100%">
          <Path d="M0 40 Q30 18 60 36 T120 28 V80 H0Z" fill={bg.hillFar} />
          <Path d="M0 56 Q40 34 70 52 T120 46 V80 H0Z" fill={bg.hillNear} />
        </Svg>
      </View>
      {/* Ground */}
      <View style={[styles.ground, { backgroundColor: bg.ground }]} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  },
  sun: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '22%',
  },
});
