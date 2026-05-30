// ============================================================
// BLAST BUDDIES — Cannon cart SVG component
// ============================================================

import React from 'react';
import { View } from 'react-native';
import Svg, { G, Rect, Circle } from 'react-native-svg';
import { CannonSkin } from '../types';

interface CannonProps {
  skin?: CannonSkin;
  size?: number;
  angle?: number;
  style?: object;
}

export function Cannon({ skin, size = 120, angle = 0, style = {} }: CannonProps) {
  const c = skin || { barrel: '#7a8aa0', barrelD: '#4a5668', accent: '#ffd23f' };
  // Transform origin for barrel rotation is (60, 78) in the 120x120 viewBox
  const rad = (angle * Math.PI) / 180;
  const ox = 60;
  const oy = 78;
  // Compute transform matrix for rotation around (ox, oy)
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const tx = ox - ox * cos + oy * sin;
  const ty = oy - ox * sin - oy * cos;
  const barrelTransform = `matrix(${cos},${sin},${-sin},${cos},${tx},${ty})`;

  return (
    <View style={[{ width: size, height: size, position: 'relative' }, style]}>
      <Svg viewBox="0 0 120 120" width={size} height={size}>
        {/* barrel (rotates) */}
        <G transform={barrelTransform}>
          <Rect x="46" y="20" width="28" height="60" rx="13" fill={c.barrel} stroke={c.barrelD} strokeWidth="4" />
          <Rect x="46" y="20" width="28" height="14" rx="7" fill={c.accent} stroke={c.barrelD} strokeWidth="4" />
          <Rect x="51" y="24" width="6" height="48" rx="3" fill="#fff" opacity="0.35" />
        </G>
        {/* body */}
        <Rect x="38" y="72" width="44" height="26" rx="9" fill={c.barrelD} stroke="#2c3340" strokeWidth="3" />
        <Rect x="44" y="76" width="32" height="8" rx="4" fill={c.accent} opacity="0.85" />
        {/* wheels */}
        <Circle cx="42" cy="100" r="15" fill="#3a3340" stroke="#2c2730" strokeWidth="3" />
        <Circle cx="42" cy="100" r="6" fill={c.accent} stroke="#b87b00" strokeWidth="2" />
        <Circle cx="78" cy="100" r="15" fill="#3a3340" stroke="#2c2730" strokeWidth="3" />
        <Circle cx="78" cy="100" r="6" fill={c.accent} stroke="#b87b00" strokeWidth="2" />
      </Svg>
    </View>
  );
}
