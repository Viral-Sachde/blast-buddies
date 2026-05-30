// ============================================================
// BLAST BUDDIES — Game Over popup (sad monster)
// ============================================================

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { Panel } from '../components/Panel';
import { Monster } from '../components/Monster';
import { ChunkyButton } from '../components/ChunkyButton';
import { useTheme } from '../theme';
import { LoseResult } from '../types';
import { fmt } from '../components/Chip';

interface GameOverPopupProps {
  result: LoseResult;
  onRetry: () => void;
  onHome: () => void;
}

export function GameOverPopup({ result, onRetry, onHome }: GameOverPopupProps) {
  const theme = useTheme();

  const panelScale = useSharedValue(0.6);
  const wobble = useSharedValue(0);

  useEffect(() => {
    panelScale.value = withSpring(1, { damping: 14, stiffness: 180 });
    wobble.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 350 }),
        withTiming(3, { duration: 350 }),
        withTiming(0, { duration: 350 }),
      ),
      -1,
      false,
    );
  }, []);

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ scale: panelScale.value }],
  }));

  const monsterStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${wobble.value}deg` }],
  }));

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.panelWrapper, panelStyle]}>
        <Panel style={styles.panel}>
          {/* Wobbling monster */}
          <Animated.View style={[styles.monsterWrapper, monsterStyle]}>
            <Monster
              skin={{ body: '#9aa6b8', dark: '#6b7688' }}
              num=""
              size={92}
              hurt
            />
          </Animated.View>

          <Text style={[styles.title, { color: theme.primaryD }]}>
            Buddies broke through!
          </Text>
          <Text style={[styles.desc, { color: theme.inkSoft }]}>
            You popped {result.popped} buddies and kept {fmt(result.coins)} coins.
          </Text>

          <View style={styles.buttons}>
            <ChunkyButton
              onPress={onHome}
              variant="gray"
              fontSize={18}
              paddingVertical={12}
              style={styles.homeBtn}
            >
              Home
            </ChunkyButton>
            <ChunkyButton
              onPress={onRetry}
              variant="primary"
              fontSize={18}
              paddingVertical={12}
              style={styles.retryBtn}
            >
              Try Again
            </ChunkyButton>
          </View>
        </Panel>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(20,16,40,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 40,
  },
  panelWrapper: {
    width: 290,
  },
  panel: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 46,
  },
  monsterWrapper: {
    marginTop: -46,
    marginBottom: 6,
  },
  title: {
    fontFamily: 'Baloo2-ExtraBold',
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  desc: {
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  homeBtn: {
    flex: 1,
  },
  retryBtn: {
    flex: 1.4,
  },
});
