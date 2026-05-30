// ============================================================
// BLAST BUDDIES — Upgrades / Power-ups screen
// ============================================================

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SubHeader } from '../components/SubHeader';
import { Icon } from '../components/Icon';
import { ChunkyButton } from '../components/ChunkyButton';
import { useTheme } from '../theme';
import { Profile, UpgradeDef } from '../types';
import { UPGRADES } from '../data';
import { fmt } from '../components/Chip';

interface UpgradesScreenProps {
  profile: Profile;
  go: (route: string) => void;
  doUpgrade: (u: UpgradeDef, cost: number) => void;
}

export function UpgradesScreen({ profile, go, doUpgrade }: UpgradesScreenProps) {
  const theme = useTheme();

  return (
    <LinearGradient
      colors={[theme.menuTop, theme.menuBot]}
      style={StyleSheet.absoluteFill}
    >
      <SubHeader title="Power-Ups" profile={profile} onBack={() => go('home')} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {UPGRADES.map((u) => {
          const lvl = (profile.upgrades as any)[u.id] || 0;
          const maxed = lvl >= u.max;
          const cost = u.base * (lvl + 1);
          const canAfford = profile.coins >= cost;
          return (
            <View
              key={u.id}
              style={[
                styles.row,
                {
                  backgroundColor: theme.panel,
                  borderColor: theme.panelEdge,
                },
              ]}
            >
              {/* Icon */}
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: theme.gem, borderBottomColor: theme.gemD },
                ]}
              >
                <Icon name={u.icon} size={30} color="#fff" />
              </View>

              {/* Info + bar */}
              <View style={styles.info}>
                <Text style={[styles.name, { color: theme.ink }]}>{u.name}</Text>
                <Text style={[styles.desc, { color: theme.inkSoft }]}>{u.desc}</Text>
                <View style={styles.bars}>
                  {Array.from({ length: u.max }).map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.bar,
                        {
                          backgroundColor:
                            i < lvl ? theme.accent : 'rgba(0,0,0,0.12)',
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>

              {/* Buy/MAX button */}
              {maxed ? (
                <Text style={[styles.maxText, { color: theme.accentD }]}>MAX</Text>
              ) : (
                <ChunkyButton
                  onPress={() => canAfford && doUpgrade(u, cost)}
                  variant="gold"
                  disabled={!canAfford}
                  paddingVertical={10}
                  paddingHorizontal={12}
                  style={styles.buyBtn}
                >
                  <View style={styles.buyInner}>
                    <Text style={styles.lvlText}>Lv {lvl + 1}</Text>
                    <View style={styles.costRow}>
                      <Icon name="coin" size={16} />
                      <Text style={styles.costText}>{fmt(cost)}</Text>
                    </View>
                  </View>
                </ChunkyButton>
              )}
            </View>
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll: {
    position: 'absolute',
    top: 76,
    bottom: 0,
    left: 0,
    right: 0,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 20,
    padding: 14,
    borderWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    flexShrink: 0,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontFamily: 'Baloo2-ExtraBold',
    fontWeight: '800',
    fontSize: 18,
  },
  desc: {
    fontSize: 13,
    fontWeight: '500',
  },
  bars: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 6,
  },
  bar: {
    flex: 1,
    height: 8,
    borderRadius: 999,
  },
  maxText: {
    fontFamily: 'Baloo2-ExtraBold',
    fontWeight: '800',
    fontSize: 15,
    paddingHorizontal: 6,
  },
  buyBtn: {
    minWidth: 84,
  },
  buyInner: {
    alignItems: 'center',
    gap: 2,
  },
  lvlText: {
    fontFamily: 'Baloo2-ExtraBold',
    fontSize: 12,
    fontWeight: '800',
    color: '#7a4a00',
  },
  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  costText: {
    fontFamily: 'Baloo2-ExtraBold',
    fontWeight: '800',
    fontSize: 15,
    color: '#7a4a00',
  },
});
