import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Panel } from '../components/Panel';
import { Icon } from '../components/Icon';
import { ChunkyButton } from '../components/ChunkyButton';
import { useTheme } from '../theme';
import { WinResult } from '../types';
import { fmt } from '../components/Chip';

interface WinPopupProps {
  result: WinResult;
  onNext: () => void;
  onHome: () => void;
}

function AnimatedStar({ delay, size, yOffset }: { delay: number; size: number; yOffset: number }) {
  const scale = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.spring(scale, { toValue: 1, damping: 12, stiffness: 200, useNativeDriver: true }),
    ]).start();
  }, []);
  return (
    <Animated.View style={{ transform: [{ scale }, { translateY: yOffset }] }}>
      <Icon name="star" size={size} color="#ffd23f" />
    </Animated.View>
  );
}

function RewardRow({ icon, label, value }: { icon: string; label: string; value: number }) {
  const theme = useTheme();
  return (
    <View style={[styles.rewardRow, { backgroundColor: 'rgba(0,0,0,0.05)' }]}>
      <Text style={[styles.rewardLabel, { color: theme.inkSoft }]}>{label}</Text>
      <View style={styles.rewardValue}>
        <Icon name={icon} size={22} />
        <Text style={[styles.rewardAmount, { color: theme.ink }]}>+{fmt(value)}</Text>
      </View>
    </View>
  );
}

export function WinPopup({ result, onNext, onHome }: WinPopupProps) {
  const theme = useTheme();
  const panelScale = useRef(new Animated.Value(0.6)).current;
  useEffect(() => {
    Animated.spring(panelScale, { toValue: 1, damping: 14, stiffness: 180, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.panelWrapper, { transform: [{ scale: panelScale }] }]}>
        <Panel style={styles.panel}>
          <View style={styles.stars}>
            <AnimatedStar delay={0} size={52} yOffset={0} />
            <AnimatedStar delay={120} size={64} yOffset={-10} />
            <AnimatedStar delay={240} size={52} yOffset={0} />
          </View>
          <Text style={[styles.title, { color: theme.accentD }]}>Level Clear!</Text>
          <View style={styles.rewards}>
            <RewardRow icon="coin" label="Coins popped" value={result.coins} />
            <RewardRow icon="coin" label="Clear bonus" value={result.bonus} />
            <RewardRow icon="gem" label="Gems" value={result.gems} />
          </View>
          <View style={styles.buttons}>
            <ChunkyButton onPress={onHome} variant="gray" fontSize={18} paddingVertical={12} style={styles.homeBtn}>Home</ChunkyButton>
            <ChunkyButton onPress={onNext} variant="accent" fontSize={18} paddingVertical={12} style={styles.nextBtn}>Next →</ChunkyButton>
          </View>
        </Panel>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(20,16,40,0.55)', alignItems: 'center', justifyContent: 'center', zIndex: 40 },
  panelWrapper: { width: 300 },
  panel: { width: '100%', alignItems: 'center', paddingTop: 52 },
  stars: { flexDirection: 'row', justifyContent: 'center', gap: 4, marginTop: -52, marginBottom: 6 },
  title: { fontFamily: 'Baloo2-ExtraBold', fontSize: 38, fontWeight: '800', marginBottom: 14 },
  rewards: { width: '100%', gap: 10, marginBottom: 18 },
  rewardRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 12, paddingVertical: 8, paddingHorizontal: 14 },
  rewardLabel: { fontWeight: '600', fontSize: 15 },
  rewardValue: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rewardAmount: { fontFamily: 'Baloo2-ExtraBold', fontWeight: '800', fontSize: 18 },
  buttons: { flexDirection: 'row', gap: 10, width: '100%' },
  homeBtn: { flex: 1 },
  nextBtn: { flex: 1.4 },
});
