// ============================================================
// BLAST BUDDIES — Mini background preview for shop tiles
// ============================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Rect, Path, Circle } from 'react-native-svg';
import { Background } from '../types';

interface ScenePreviewProps {
  bg: Background;
  style?: object;
}

export function ScenePreview({ bg, style = {} }: ScenePreviewProps) {
  return (
    <View style={[styles.container, style]}>
      <Svg viewBox="0 0 120 80" preserveAspectRatio="none" width="100%" height="100%">
        <Defs>
          <SvgLinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={bg.skyTop} />
            <Stop offset="1" stopColor={bg.skyBot} />
          </SvgLinearGradient>
        </Defs>
        {/* Sky */}
        <Rect x="0" y="0" width="120" height="80" fill="url(#sky)" />
        {/* Sun / moon */}
        <Circle cx="99" cy="19" r="11" fill={bg.deco === 'stars' ? '#fff' : 'rgba(255,246,200,0.9)'} />
        {/* Hills */}
        <Path d="M0 40 Q30 18 60 36 T120 28 V80 H0Z" fill={bg.hillFar} />
        <Path d="M0 56 Q40 34 70 52 T120 46 V80 H0Z" fill={bg.hillNear} />
        {/* Ground */}
        <Rect x="0" y="62" width="120" height="18" fill={bg.ground} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  },
});
