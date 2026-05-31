import React, { useRef, useEffect } from 'react';
import { View, Animated } from 'react-native';
import { Monster } from './Monster';
import { MONSTERS } from '../data';

const BLOB_CONFIGS = [
  { x: '8%', y: '12%', s: 56, k: 0, d: 0 },
  { x: '80%', y: '16%', s: 70, k: 2, d: 1.2 },
  { x: '14%', y: '78%', s: 64, k: 4, d: 0.6 },
  { x: '82%', y: '72%', s: 50, k: 3, d: 1.8 },
  { x: '60%', y: '86%', s: 44, k: 1, d: 0.3 },
];

function FloatingBlob({ config }: { config: typeof BLOB_CONFIGS[0] }) {
  const translateY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, { toValue: -8, duration: 1500 + config.d * 500, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 1500 + config.d * 500, useNativeDriver: true }),
      ]),
    ).start();
  }, []);
  return (
    <Animated.View
      style={[
        { position: 'absolute', left: config.x as any, top: config.y as any, opacity: 0.35, transform: [{ translateY }] },
      ]}
    >
      <Monster skin={MONSTERS[config.k]} num="" size={config.s} />
    </Animated.View>
  );
}

export function BgBlobs() {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
      {BLOB_CONFIGS.map((b, i) => (
        <FloatingBlob key={i} config={b} />
      ))}
    </View>
  );
}
