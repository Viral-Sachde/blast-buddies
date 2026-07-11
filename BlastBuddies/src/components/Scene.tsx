import React, { ReactNode, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Background } from '../types';

const { width: SCREEN_W } = Dimensions.get('window');

interface SceneProps {
  bg: Background;
  children?: ReactNode;
  style?: object;
}

function FloatingCloud({ x, y, w, delay }: { x: string; y: string; w: number; delay: number }) {
  const translateY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, { toValue: -8, duration: 1500 + delay * 500, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 1500 + delay * 500, useNativeDriver: true }),
      ]),
    ).start();
  }, []);
  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: y as any,
        left: x as any,
        width: w,
        height: 26,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.85)',
        transform: [{ translateY }],
      } as any}
    />
  );
}

function FloatingDot({ x, y, size, delay, color }: { x: string; y: string; size: number; delay: number; color: string }) {
  const translateY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, { toValue: -8, duration: 1500 + delay * 400, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 1500 + delay * 400, useNativeDriver: true }),
      ]),
    ).start();
  }, []);
  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: y as any,
        left: x as any,
        width: size,
        height: size,
        borderRadius: 999,
        backgroundColor: color,
        opacity: 0.85,
        transform: [{ translateY }],
      } as any}
    />
  );
}

export function Scene({ bg, children, style = {} }: SceneProps) {
  const b = bg;
  return (
    <View
      style={[StyleSheet.absoluteFill, { overflow: 'hidden', backgroundColor: b.skyTop }, style]}
    >
      <View
        style={{
          position: 'absolute',
          top: '12%',
          right: '16%',
          width: 90,
          height: 90,
          borderRadius: 45,
          backgroundColor: b.deco === 'stars' ? 'rgba(255,233,176,0.9)' : 'rgba(255,246,200,0.6)',
          opacity: b.deco === 'stars' ? 0.9 : 0.8,
        }}
      />

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '62%' }}>
        <Svg viewBox="0 0 440 300" preserveAspectRatio="none" width="100%" height="100%">
          <Path d="M0 150 Q90 70 180 130 T440 110 V300 H0 Z" fill={b.hillFar} opacity="0.85" />
          <Path d="M0 200 Q120 120 240 185 T440 165 V300 H0 Z" fill={b.hillNear} opacity="0.95" />
        </Svg>
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '18%',
          backgroundColor: b.ground,
        }}
      />

      {b.deco === 'clouds' && [0, 1, 2].map((i) => (
        <FloatingCloud key={i} x={`${(i * 37 + 8) % 80}%`} y={`${10 + i * 14}%`} w={70 - i * 8} delay={i} />
      ))}
      {b.deco === 'snow' && Array.from({ length: 16 }).map((_, i) => (
        <FloatingDot key={i} x={`${(i * 37) % 95}%`} y={`${(i * 53) % 90}%`} size={7} delay={i % 4} color="#fff" />
      ))}
      {b.deco === 'bubbles' && Array.from({ length: 12 }).map((_, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            top: `${(i * 47) % 90}%` as any,
            left: `${(i * 41) % 95}%` as any,
            width: 10 + (i % 4) * 5,
            height: 10 + (i % 4) * 5,
            borderRadius: 999,
            backgroundColor: 'rgba(255,255,255,0.28)',
            borderWidth: 1.5,
            borderColor: 'rgba(255,255,255,0.5)',
          }}
        />
      ))}
      {b.deco === 'stars' && Array.from({ length: 26 }).map((_, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            top: `${(i * 53) % 85}%` as any,
            left: `${(i * 71) % 97}%` as any,
            width: 3 + (i % 3),
            height: 3 + (i % 3),
            borderRadius: 999,
            backgroundColor: '#fff',
            opacity: 0.5 + (i % 5) * 0.1,
          }}
        />
      ))}

      {children}
    </View>
  );
}
