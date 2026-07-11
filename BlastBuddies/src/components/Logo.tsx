import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Monster } from './Monster';

interface LogoProps {
  scale?: number;
  withMascot?: boolean;
}

export function Logo({ scale = 1, withMascot = true }: LogoProps) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, { toValue: -8, duration: 1500, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {withMascot && (
        <Animated.View style={[styles.mascots, { transform: [{ translateY }] }]}>
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
    color: '#ffb822',
    textShadowColor: '#7a3000',
    transform: [{ rotate: '-3deg' }],
  },
  buddies: {
    fontFamily: 'Baloo2-ExtraBold',
    fontWeight: '800',
    color: '#2ecbff',
    textShadowColor: '#004880',
    transform: [{ rotate: '2.5deg' }],
  },
});
