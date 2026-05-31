import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated as RNAnimated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Defs, RadialGradient as SvgRadialGradient, Stop, Circle, Ellipse } from 'react-native-svg';
import { ChunkyButton } from '../components/ChunkyButton';
import { Monster } from '../components/Monster';

const { width: W, height: H } = Dimensions.get('window');

interface SplashScreenProps {
  onDone: () => void;
}

const BLOB_CONFIGS = [
  { x: 0.06, y: 0.14, size: 62, color: '#ff5ea8', dark: '#d62f80', rot: -15 },
  { x: 0.72, y: 0.10, size: 74, color: '#ffc83d', dark: '#e09a00', rot: 10 },
  { x: 0.04, y: 0.62, size: 58, color: '#34dec0', dark: '#16a98e', rot: -8 },
  { x: 0.76, y: 0.60, size: 52, color: '#7c5cff', dark: '#5436d6', rot: 12 },
  { x: 0.42, y: 0.76, size: 44, color: '#37c6ff', dark: '#1a8fd6', rot: -5 },
];

function FloatingBlob({ x, y, size, color, dark, rot, delay }: {
  x: number; y: number; size: number; color: string; dark: string; rot: number; delay: number;
}) {
  const anim = useRef(new RNAnimated.Value(0)).current;
  useEffect(() => {
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(anim, { toValue: 1, duration: 1800 + delay * 200, useNativeDriver: true }),
        RNAnimated.timing(anim, { toValue: 0, duration: 1800 + delay * 200, useNativeDriver: true }),
      ]),
    ).start();
  }, []);
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });
  return (
    <RNAnimated.View style={[
      styles.blob,
      {
        left: W * x,
        top: H * y,
        opacity: 0.45,
        transform: [{ translateY }, { rotate: `${rot}deg` }],
      },
    ]}>
      <Monster skin={{ body: color, dark }} num="" size={size} />
    </RNAnimated.View>
  );
}

function Sparkles() {
  const positions = [
    { x: 0.12, y: 0.08 }, { x: 0.82, y: 0.06 }, { x: 0.25, y: 0.30 },
    { x: 0.78, y: 0.32 }, { x: 0.50, y: 0.04 }, { x: 0.15, y: 0.50 },
    { x: 0.88, y: 0.48 }, { x: 0.36, y: 0.68 }, { x: 0.66, y: 0.70 },
    { x: 0.92, y: 0.22 }, { x: 0.05, y: 0.40 }, { x: 0.60, y: 0.15 },
  ];
  return (
    <>
      {positions.map((p, i) => {
        const anim = useRef(new RNAnimated.Value(i % 2)).current;
        useEffect(() => {
          RNAnimated.loop(
            RNAnimated.sequence([
              RNAnimated.timing(anim, { toValue: 1, duration: 500 + (i * 137) % 600, useNativeDriver: true }),
              RNAnimated.timing(anim, { toValue: 0.1, duration: 500 + (i * 137) % 600, useNativeDriver: true }),
            ]),
          ).start();
        }, []);
        const size = 3 + (i % 4);
        return (
          <RNAnimated.View key={i} style={[
            styles.sparkle,
            { left: W * p.x, top: H * p.y, width: size, height: size, borderRadius: size, opacity: anim },
          ]} />
        );
      })}
    </>
  );
}

function LightRays() {
  const anim = useRef(new RNAnimated.Value(0)).current;
  useEffect(() => {
    RNAnimated.loop(
      RNAnimated.timing(anim, { toValue: 1, duration: 24000, useNativeDriver: true }),
    ).start();
  }, []);
  const rotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const rays = Array.from({ length: 10 }, (_, i) => i * 36);
  return (
    <RNAnimated.View style={[styles.raysWrap, { transform: [{ rotate }] }]}>
      <Svg width={420} height={420} viewBox="-210 -210 420 420">
        {rays.map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = Math.cos(rad) * 18, y1 = Math.sin(rad) * 18;
          const x2 = Math.cos((deg - 8) * Math.PI / 180) * 210;
          const y2 = Math.sin((deg - 8) * Math.PI / 180) * 210;
          const x3 = Math.cos((deg + 8) * Math.PI / 180) * 210;
          const y3 = Math.sin((deg + 8) * Math.PI / 180) * 210;
          return (
            <Path key={deg} d={`M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} Z`} fill="rgba(100,190,255,0.06)" />
          );
        })}
      </Svg>
    </RNAnimated.View>
  );
}

function CannonSvg() {
  return (
    <Svg viewBox="0 0 180 160" width={180} height={160}>
      <Defs>
        <SvgRadialGradient id="glow" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#5ecfff" stopOpacity="0.4" />
          <Stop offset="100%" stopColor="#0040a0" stopOpacity="0" />
        </SvgRadialGradient>
      </Defs>
      <Ellipse cx="90" cy="145" rx="70" ry="14" fill="url(#glow)" />
      <Path d="M76 20 Q90 14 104 20 L110 90 Q90 98 70 90 Z" fill="#5a6a80" stroke="#3a4a58" strokeWidth="4" strokeLinejoin="round" />
      <Path d="M76 20 Q90 14 104 20 L100 34 Q90 28 80 34 Z" fill="#ffd23f" stroke="#b87b00" strokeWidth="3" />
      <Path d="M82 26 L82 86" stroke="rgba(255,255,255,0.3)" strokeWidth="5" strokeLinecap="round" />
      <Path d="M60 90 Q90 82 120 90 L118 116 Q90 122 62 116 Z" fill="#4a5668" stroke="#2c3340" strokeWidth="3" />
      <Path d="M66 96 Q90 90 114 96 L112 106 Q90 110 68 106 Z" fill="#ffd23f" opacity="0.8" />
      <Circle cx="56" cy="130" r="22" fill="#2a2535" stroke="#1a1520" strokeWidth="3" />
      <Circle cx="56" cy="130" r="9" fill="#ffd23f" stroke="#b87b00" strokeWidth="2.5" />
      <Circle cx="52" cy="126" r="3" fill="rgba(255,255,255,0.5)" />
      <Circle cx="124" cy="130" r="22" fill="#2a2535" stroke="#1a1520" strokeWidth="3" />
      <Circle cx="124" cy="130" r="9" fill="#ffd23f" stroke="#b87b00" strokeWidth="2.5" />
      <Circle cx="120" cy="126" r="3" fill="rgba(255,255,255,0.5)" />
    </Svg>
  );
}

export function SplashScreen({ onDone }: SplashScreenProps) {
  const [pct, setPct] = useState(0);
  const barAnim = useRef(new RNAnimated.Value(0)).current;
  const btnScale = useRef(new RNAnimated.Value(1)).current;

  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      p += 4 + Math.random() * 8;
      if (p >= 100) { p = 100; clearInterval(id); }
      setPct(p);
      RNAnimated.timing(barAnim, { toValue: p / 100, duration: 120, useNativeDriver: false }).start();
    }, 110);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (pct >= 100) {
      RNAnimated.loop(
        RNAnimated.sequence([
          RNAnimated.timing(btnScale, { toValue: 1.08, duration: 550, useNativeDriver: true }),
          RNAnimated.timing(btnScale, { toValue: 1.0, duration: 550, useNativeDriver: true }),
        ]),
      ).start();
    }
  }, [pct]);

  const barWidth = barAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <LinearGradient colors={['#040d28', '#081640', '#0c2060', '#1040a0', '#1a6ac8']} locations={[0, 0.2, 0.45, 0.75, 1]} style={StyleSheet.absoluteFill}>
      {BLOB_CONFIGS.map((b, i) => <FloatingBlob key={i} {...b} delay={i} />)}
      <Sparkles />

      <View style={styles.center}>
        <LightRays />

        {/* Logo */}
        <View style={styles.logoWrap}>
          <Text style={styles.blast}>BLAST</Text>
          <Text style={styles.buddies}>BUDDIES</Text>
        </View>

        {/* Cannon */}
        <View style={styles.cannonWrap}>
          <CannonSvg />
        </View>

        {/* Loading bar */}
        <View style={styles.barWrap}>
          <View style={styles.barTrack}>
            <RNAnimated.View style={[styles.barFill, { width: barWidth }]}>
              <LinearGradient colors={['#ffe060', '#ffb820', '#ff9500']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
              <View style={styles.barShine} />
            </RNAnimated.View>
          </View>
          <Text style={styles.loadText}>{pct < 100 ? 'LOADING BUDDIES...' : 'READY!'}</Text>
        </View>

        {pct >= 100 && (
          <RNAnimated.View style={{ marginTop: 24, transform: [{ scale: btnScale }] }}>
            <ChunkyButton onPress={onDone} variant="green" fontSize={22} paddingVertical={15} paddingHorizontal={46}>
              TAP TO PLAY
            </ChunkyButton>
          </RNAnimated.View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  raysWrap: { position: 'absolute', width: 420, height: 420, alignItems: 'center', justifyContent: 'center' },
  blob: { position: 'absolute' },
  sparkle: { position: 'absolute', backgroundColor: '#fff' },
  logoWrap: { alignItems: 'center', zIndex: 2 },
  blast: {
    fontFamily: 'Baloo2-ExtraBold',
    fontWeight: '800',
    fontSize: 80,
    color: '#ffb822',
    textShadowColor: '#7a3000',
    textShadowOffset: { width: 0, height: 8 },
    textShadowRadius: 6,
    transform: [{ rotate: '-3deg' }],
    letterSpacing: 2,
  },
  buddies: {
    fontFamily: 'Baloo2-ExtraBold',
    fontWeight: '800',
    fontSize: 52,
    color: '#2ecbff',
    textShadowColor: '#004880',
    textShadowOffset: { width: 0, height: 6 },
    textShadowRadius: 5,
    transform: [{ rotate: '2.5deg' }],
    marginTop: -8,
    letterSpacing: 1,
  },
  cannonWrap: { marginTop: 10, zIndex: 2 },
  barWrap: { width: 260, marginTop: 14, zIndex: 2 },
  barTrack: {
    height: 30,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.4)',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.45)',
    position: 'relative',
  },
  barFill: { height: '100%', borderRadius: 999, overflow: 'hidden', position: 'relative' },
  barShine: { position: 'absolute', top: 3, left: 12, right: 12, height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.4)' },
  loadText: {
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Baloo2-Bold',
    fontWeight: '700',
    fontSize: 15,
    color: '#90c8ff',
    letterSpacing: 1.5,
  },
});
