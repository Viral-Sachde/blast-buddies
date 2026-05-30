// ============================================================
// BLAST BUDDIES — Logo wordmark + mascot monsters
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Monster } from './Monster';
import { useTheme } from '../theme';

interface LogoProps {
  scale?: number;
  withMascot?: boolean;
}

export function Logo({ scale = 1, withMascot = true }: LogoProps) {
  const theme = useTheme();
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1500 }),
        withTiming(0, { duration: 1500 }),
      ),
      -1,
      false,
    );
  }, []);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={styles.container}>
      {withMascot && (
        <Animated.View style={[styles.mascots, floatStyle]}>
          <Monster
            skin={{ body: '#34dec0', dark: '#16a98e' }}
            num=""
            size={Math.round(48 * scale)}
            style={{ transform: [{ rotate: '-10deg' }] }}
          />
          <Monster
            skin={{ body: '#ffc83d', dark: '#e09a00' }}
            num=""
            size={Math.round(62 * scale)}
          />
          <Monster
            skin={{ body: '#7c5cff', dark: '#5436d6' }}
            num=""
            size={Math.round(48 * scale)}
            style={{ transform: [{ rotate: '10deg' }] }}
          />
        </Animated.View>
      )}
      <Text
        style={[
          styles.blast,
          {
            fontSize: Math.round(66 * scale),
            color: '#ffb822',
            textShadowColor: '#c45800',
            textShadowOffset: { width: 0, height: Math.round(7 * scale) },
            textShadowRadius: Math.round(5 * scale),
          },
        ]}
      >
        BLAST
      </Text>
      <Text
        style={[
          styles.buddies,
          {
            fontSize: Math.round(46 * scale),
            color: '#2ecbff',
            textShadowColor: '#0058a0',
            textShadowOffset: { width: 0, height: Math.round(6 * scale) },
            textShadowRadius: Math.round(4 * scale),
            marginTop: Math.round(2 * scale),
          },
        ]}
      >
        BUDDIES
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    lineHeight: 0,
  },
  mascots: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: -6,
    zIndex: 2,
  },
  blast: {
    fontFamily: 'Baloo2-ExtraBold',
    fontWeight: '800',
    transform: [{ rotate: '-3deg' }],
  },
  buddies: {
    fontFamily: 'Baloo2-ExtraBold',
    fontWeight: '800',
    transform: [{ rotate: '2.5deg' }],
  },
});
