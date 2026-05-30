// ============================================================
// BLAST BUDDIES — Monster SVG blob component
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Circle,
  Ellipse,
} from 'react-native-svg';
import { MonsterSkin } from '../types';

interface MonsterProps {
  skin?: MonsterSkin;
  num?: string | number;
  size?: number;
  hurt?: boolean;
  style?: object;
}

export function Monster({
  skin,
  num = '',
  size = 84,
  hurt = false,
  style = {},
}: MonsterProps) {
  const s = skin || { body: '#ff5ea8', dark: '#d62f80' };
  return (
    <View style={[{ position: 'relative', width: size, height: size }, style]}>
      <Svg viewBox="0 0 100 100" width={size} height={size}>
        {/* lumpy blob body */}
        <Path
          d="M50 6c16 0 27 8 31 21 3 9 11 9 11 22 0 18-18 25-42 25S8 90 8 71c0-13 8-13 11-22C23 36 34 6 50 6z"
          fill={s.body}
          stroke={s.dark}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        {/* little horns */}
        <Path d="M28 16c-3-7-1-11 2-12 2 6 4 8 7 10z" fill={s.dark} />
        <Path d="M72 16c3-7 1-11-2-12-2 6-4 8-7 10z" fill={s.dark} />
        {/* belly highlight */}
        <Ellipse cx="50" cy="56" rx="26" ry="22" fill="#fff" opacity="0.9" />
        {/* eyes */}
        <Circle cx="38" cy="40" r="9" fill="#fff" stroke={s.dark} strokeWidth="2.4" />
        <Circle cx="62" cy="40" r="9" fill="#fff" stroke={s.dark} strokeWidth="2.4" />
        <Circle cx={hurt ? 39 : 39.5} cy={hurt ? 43 : 42} r="4.4" fill="#3a2d4d" />
        <Circle cx={hurt ? 61 : 60.5} cy={hurt ? 43 : 42} r="4.4" fill="#3a2d4d" />
        <Circle cx="41" cy="40.5" r="1.6" fill="#fff" />
        <Circle cx="62" cy="40.5" r="1.6" fill="#fff" />
        {/* mouth */}
        {hurt ? (
          <Ellipse cx="50" cy="54" rx="5" ry="6" fill={s.dark} />
        ) : (
          <Path
            d="M43 52q7 6 14 0"
            stroke={s.dark}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        )}
        {/* cheeks */}
        <Circle cx="30" cy="50" r="4" fill={s.dark} opacity="0.25" />
        <Circle cx="70" cy="50" r="4" fill={s.dark} opacity="0.25" />
      </Svg>
      {/* HP number */}
      {num !== '' && (
        <Text
          style={[
            styles.num,
            {
              top: size * 0.6,
              fontSize: size * 0.26,
              color: s.dark,
            },
          ]}
        >
          {num}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  num: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: 'Baloo2-ExtraBold',
    fontWeight: '800',
    textShadowColor: 'rgba(255,255,255,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0,
  },
});
