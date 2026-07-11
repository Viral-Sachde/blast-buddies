// ============================================================
// BLAST BUDDIES — Vertical gradient background
// Uses react-native-svg (New Architecture compatible) instead of
// react-native-linear-gradient, which crashes on RN 0.85 / Fabric.
// ============================================================

import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Rect } from 'react-native-svg';

interface GradientBGProps {
  colors: [string, string];
  style?: object;
  children?: ReactNode;
}

export function GradientBG({ colors, style, children }: GradientBGProps) {
  return (
    <View style={[StyleSheet.absoluteFill, style]}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <SvgLinearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors[0]} />
            <Stop offset="1" stopColor={colors[1]} />
          </SvgLinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#bgGrad)" />
      </Svg>
      {children}
    </View>
  );
}
