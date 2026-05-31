import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { G, Path, Circle, Text as SvgText } from 'react-native-svg';
import { SubHeader } from '../components/SubHeader';
import { BgBlobs } from '../components/BgBlobs';
import { ChunkyButton } from '../components/ChunkyButton';
import { useTheme } from '../theme';
import { Profile } from '../types';

interface Prize {
  t: 'coin' | 'gem';
  v: number;
  c: string;
}

const PRIZES: Prize[] = [
  { t: 'coin', v: 100, c: '#ffd23f' },
  { t: 'gem', v: 2, c: '#b07cff' },
  { t: 'coin', v: 250, c: '#ffb84d' },
  { t: 'gem', v: 5, c: '#9a74ff' },
  { t: 'coin', v: 500, c: '#ffc83d' },
  { t: 'gem', v: 1, c: '#cba6ff' },
  { t: 'coin', v: 1000, c: '#ffdf6a' },
  { t: 'gem', v: 10, c: '#8b5cf6' },
];

interface DailySpinScreenProps {
  profile: Profile;
  go: (route: string) => void;
  onPrize: (prize: Prize) => void;
}

function WheelSvg({ prizes }: { prizes: Prize[] }) {
  const seg = 360 / prizes.length;
  const r = 125;
  const cx = 135, cy = 135;

  const segments = prizes.map((p, i) => {
    const startAngle = ((i * seg - 90) * Math.PI) / 180;
    const endAngle = (((i + 1) * seg - 90) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = seg > 180 ? 1 : 0;
    const pathData = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`;
    const midAngle = ((i * seg + seg / 2 - 90) * Math.PI) / 180;
    const textR = r * 0.65;
    const tx = cx + textR * Math.cos(midAngle);
    const ty = cy + textR * Math.sin(midAngle);
    const textRotation = i * seg + seg / 2;
    return { pathData, fill: p.c, tx, ty, textRotation, label: p.v.toString() };
  });

  return (
    <Svg width={270} height={270} viewBox="0 0 270 270">
      {segments.map((seg, i) => (
        <G key={i}>
          <Path d={seg.pathData} fill={seg.fill} />
          <SvgText x={seg.tx} y={seg.ty + 5} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="800"
            transform={`rotate(${seg.textRotation}, ${seg.tx}, ${seg.ty})`}>
            {seg.label}
          </SvgText>
        </G>
      ))}
      <Circle cx="135" cy="135" r="22" fill="#fff" />
    </Svg>
  );
}

export function DailySpinScreen({ profile, go, onPrize }: DailySpinScreenProps) {
  const theme = useTheme();
  const seg = 360 / PRIZES.length;
  const [spinning, setSpinning] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [won, setWon] = useState<Prize | null>(null);
  const rotation = useRef(new Animated.Value(0)).current;

  const spin = () => {
    if (spinning || claimed) return;
    setSpinning(true);
    const idx = Math.floor(Math.random() * PRIZES.length);
    const target = 360 * 5 + (360 - (idx * seg + seg / 2));
    Animated.timing(rotation, {
      toValue: target,
      duration: 3500,
      easing: Easing.bezier(0.17, 0.67, 0.2, 1),
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      setSpinning(false);
      setClaimed(true);
      setWon(PRIZES[idx]);
      onPrize(PRIZES[idx]);
    }, 3600);
  };

  const rotate = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const disabled = spinning || claimed;

  return (
    <LinearGradient colors={[theme.menuTop, theme.menuBot]} style={StyleSheet.absoluteFill}>
      <SubHeader title="Daily Spin" profile={profile} onBack={() => go('home')} />
      <BgBlobs />

      <View style={[styles.teaser, { zIndex: 2 }]}>
        <Text style={[styles.teaserText, { color: theme.ink }]}>Spin for free prizes!</Text>
      </View>

      <View style={styles.wheelContainer}>
        <View style={[styles.pointer, { borderTopColor: theme.primary }]} />
        <View style={[styles.wheelOuter, { borderColor: theme.gold }]}>
          <Animated.View style={{ width: 270, height: 270, transform: [{ rotate }] }}>
            <WheelSvg prizes={PRIZES} />
          </Animated.View>
        </View>
      </View>

      <View style={styles.bottom}>
        {won && (
          <Text style={[styles.wonText, { color: theme.ink }]}>
            You won {won.v} {won.t === 'coin' ? 'coins' : 'gems'}! 🎉
          </Text>
        )}
        <ChunkyButton
          onPress={spin}
          variant={disabled ? 'gray' : 'primary'}
          disabled={disabled}
          fontSize={24}
          paddingVertical={16}
          paddingHorizontal={50}
        >
          {claimed ? 'Come back tomorrow' : spinning ? 'Spinning…' : 'SPIN!'}
        </ChunkyButton>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  teaser: { position: 'absolute', top: 96, left: 0, right: 0, alignItems: 'center' },
  teaserText: { fontFamily: 'Baloo2-Bold', fontSize: 20, fontWeight: '700', opacity: 0.85 },
  wheelContainer: { position: 'absolute', top: '44%', alignSelf: 'center', transform: [{ translateY: -135 }], alignItems: 'center', zIndex: 2 },
  pointer: { width: 0, height: 0, borderLeftWidth: 16, borderRightWidth: 16, borderTopWidth: 26, borderLeftColor: 'transparent', borderRightColor: 'transparent', zIndex: 5, marginBottom: -4 },
  wheelOuter: { width: 270, height: 270, borderRadius: 135, borderWidth: 10, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 10 },
  bottom: { position: 'absolute', bottom: 60, left: 0, right: 0, alignItems: 'center', gap: 12, zIndex: 3 },
  wonText: { fontFamily: 'Baloo2-ExtraBold', fontWeight: '800', fontSize: 20 },
});
