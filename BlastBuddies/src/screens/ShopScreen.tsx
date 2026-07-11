// ============================================================
// BLAST BUDDIES — Shop screen: Backgrounds + Cannons
// ============================================================

import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientBG } from '../components/GradientBG';
import { SubHeader } from '../components/SubHeader';
import { ScenePreview } from '../components/ScenePreview';
import { Cannon } from '../components/Cannon';
import { Icon } from '../components/Icon';
import { ChunkyButton } from '../components/ChunkyButton';
import { useTheme } from '../theme';
import { Profile, Background, CannonSkin } from '../types';
import { BACKGROUNDS, CANNONS } from '../data';
import { fmt } from '../components/Chip';

interface ShopScreenProps {
  profile: Profile;
  go: (route: string) => void;
  buyBg: (bg: Background) => void;
  selectBg: (id: string) => void;
  buyCannon: (cn: CannonSkin) => void;
  selectCannon: (id: string) => void;
}

function Tab({
  active,
  children,
  onPress,
}: {
  active: boolean;
  children: string;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.tab,
        {
          backgroundColor: active ? theme.primary : 'rgba(255,255,255,0.6)',
          borderBottomWidth: active ? 4 : 0,
          borderBottomColor: active ? theme.primaryD : 'transparent',
        },
      ]}
    >
      <Text
        style={[
          styles.tabText,
          { color: active ? '#fff' : theme.inkSoft },
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

export function ShopScreen({
  profile,
  go,
  buyBg,
  selectBg,
  buyCannon,
  selectCannon,
}: ShopScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<'bg' | 'cannon'>('bg');

  return (
    <GradientBG colors={[theme.menuTop, theme.menuBot]}>
      <SubHeader title="Shop" profile={profile} onBack={() => go('home')} />

      {/* Tabs */}
      <View style={[styles.tabs, { top: insets.top + 78 }]}>
        <Tab active={tab === 'bg'} onPress={() => setTab('bg')}>
          Backgrounds
        </Tab>
        <Tab active={tab === 'cannon'} onPress={() => setTab('cannon')}>
          Cannons
        </Tab>
      </View>

      <ScrollView
        style={[styles.scroll, { top: insets.top + 138 }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {tab === 'bg' ? (
          <View style={styles.grid}>
            {BACKGROUNDS.map((bg) => {
              const owned = profile.unlockedBgs.includes(bg.id);
              const selected = profile.selectedBg === bg.id;
              const canAfford = profile.coins >= bg.cost;
              return (
                <View
                  key={bg.id}
                  style={[
                    styles.card,
                    {
                      backgroundColor: theme.panel,
                      borderColor: selected ? theme.accent : theme.panelEdge,
                      shadowColor: selected ? theme.accent : '#000',
                    },
                  ]}
                >
                  <View style={styles.preview}>
                    <ScenePreview bg={bg} />
                    {!owned && (
                      <View style={styles.lockOverlay}>
                        <Icon name="lock" size={34} color="#fff" />
                      </View>
                    )}
                  </View>
                  <Text style={[styles.cardName, { color: theme.ink }]}>{bg.name}</Text>
                  {owned ? (
                    <ChunkyButton
                      onPress={() => !selected && selectBg(bg.id)}
                      variant={selected ? 'gray' : 'accent'}
                      disabled={selected}
                      fontSize={16}
                      paddingVertical={9}
                      paddingHorizontal={10}
                      style={styles.cardBtn}
                    >
                      {selected ? 'Equipped' : 'Equip'}
                    </ChunkyButton>
                  ) : (
                    <ChunkyButton
                      onPress={() => canAfford && buyBg(bg)}
                      variant="gold"
                      disabled={!canAfford}
                      fontSize={15}
                      paddingVertical={9}
                      paddingHorizontal={10}
                      style={styles.cardBtn}
                    >
                      <View style={styles.costRow}>
                        <Icon name="coin" size={20} />
                        <Text style={[styles.costText, { color: '#7a4a00' }]}>
                          {fmt(bg.cost)}
                        </Text>
                      </View>
                    </ChunkyButton>
                  )}
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.grid}>
            {CANNONS.map((cn) => {
              const owned = profile.unlockedCannons.includes(cn.id);
              const selected = profile.selectedCannon === cn.id;
              const canAfford = profile.coins >= cn.cost;
              return (
                <View
                  key={cn.id}
                  style={[
                    styles.card,
                    {
                      backgroundColor: theme.panel,
                      borderColor: selected ? theme.accent : theme.panelEdge,
                      shadowColor: selected ? theme.accent : '#000',
                    },
                  ]}
                >
                  <View style={[styles.preview, styles.cannonPreview]}>
                    <Cannon skin={cn} size={100} angle={-6} />
                    {!owned && (
                      <View style={styles.lockOverlay}>
                        <Icon name="lock" size={34} color="#fff" />
                      </View>
                    )}
                  </View>
                  <Text style={[styles.cardName, { color: theme.ink }]}>{cn.name}</Text>
                  {owned ? (
                    <ChunkyButton
                      onPress={() => !selected && selectCannon(cn.id)}
                      variant={selected ? 'gray' : 'accent'}
                      disabled={selected}
                      fontSize={16}
                      paddingVertical={9}
                      paddingHorizontal={10}
                      style={styles.cardBtn}
                    >
                      {selected ? 'Equipped' : 'Equip'}
                    </ChunkyButton>
                  ) : (
                    <ChunkyButton
                      onPress={() => canAfford && buyCannon(cn)}
                      variant="gold"
                      disabled={!canAfford}
                      fontSize={15}
                      paddingVertical={9}
                      paddingHorizontal={10}
                      style={styles.cardBtn}
                    >
                      <View style={styles.costRow}>
                        <Icon name="coin" size={20} />
                        <Text style={[styles.costText, { color: '#7a4a00' }]}>
                          {fmt(cn.cost)}
                        </Text>
                      </View>
                    </ChunkyButton>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </GradientBG>
  );
}

const styles = StyleSheet.create({
  tabs: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    zIndex: 4,
  },
  tab: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontFamily: 'Baloo2-ExtraBold',
    fontWeight: '800',
    fontSize: 17,
  },
  scroll: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  card: {
    width: '47%',
    borderRadius: 18,
    padding: 8,
    borderWidth: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
  preview: {
    height: 96,
    position: 'relative',
  },
  cannonPreview: {
    backgroundColor: '#eef6ff',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 14,
    backgroundColor: 'rgba(20,16,40,0.42)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardName: {
    fontFamily: 'Baloo2-Bold',
    fontWeight: '700',
    fontSize: 15,
    marginVertical: 8,
    marginHorizontal: 2,
    textAlign: 'center',
  },
  cardBtn: {
    width: '100%',
  },
  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  costText: {
    fontFamily: 'Baloo2-ExtraBold',
    fontWeight: '800',
    fontSize: 15,
  },
});
