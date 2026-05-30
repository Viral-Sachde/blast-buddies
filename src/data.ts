// ============================================================
// BLAST BUDDIES — Game data: themes, backgrounds, monsters
// ============================================================

import type { ThemeData, Background, MonsterSkin, CannonSkin, UpgradeDef } from './types';

export const THEMES: Record<string, ThemeData> = {
  candy: {
    label: 'Candy Pop',
    vars: {
      primary: '#ff5ea8', primaryD: '#d62f80',
      accent: '#34dec0', accentD: '#16a98e',
      gold: '#ffc83d', goldD: '#e09a00',
      gem: '#a974ff', gemD: '#7e44e0',
      menuTop: '#ffd6ec', menuBot: '#c7f0ff',
      panel: '#ffffff', panelEdge: '#ffd0e6',
      ink: '#5a2a55', inkSoft: '#9a6f96',
    },
  },
  rainbow: {
    label: 'Rainbow',
    vars: {
      primary: '#ff5252', primaryD: '#cc2e2e',
      accent: '#37c6ff', accentD: '#1a8fd6',
      gold: '#ffd23f', goldD: '#e0a200',
      gem: '#7c5cff', gemD: '#5436d6',
      menuTop: '#fff0a8', menuBot: '#ffd0e6',
      panel: '#ffffff', panelEdge: '#ffe08a',
      ink: '#3a2d6b', inkSoft: '#8479ad',
    },
  },
  jungle: {
    label: 'Jungle',
    vars: {
      primary: '#ff9f1c', primaryD: '#d97700',
      accent: '#3ec46b', accentD: '#1f9e4a',
      gold: '#ffd23f', goldD: '#e0a200',
      gem: '#16c0c0', gemD: '#0c9292',
      menuTop: '#d6ffb0', menuBot: '#bff0d8',
      panel: '#fbfff4', panelEdge: '#c2ec9e',
      ink: '#235132', inkSoft: '#6f9a7d',
    },
  },
  ocean: {
    label: 'Ocean',
    vars: {
      primary: '#ff7a5c', primaryD: '#d9492c',
      accent: '#26c6da', accentD: '#0e94a8',
      gold: '#ffd23f', goldD: '#e0a200',
      gem: '#5b8def', gemD: '#3460d6',
      menuTop: '#bff0ff', menuBot: '#c8e4ff',
      panel: '#f5fdff', panelEdge: '#a8e0ee',
      ink: '#1f4a63', inkSoft: '#6f97a8',
    },
  },
  galaxy: {
    label: 'Galaxy',
    vars: {
      primary: '#ff5ea8', primaryD: '#c92e7b',
      accent: '#3ce0ff', accentD: '#16a9c9',
      gold: '#ffd23f', goldD: '#e0a200',
      gem: '#b07cff', gemD: '#7e44e0',
      menuTop: '#3a2a7a', menuBot: '#160f3a',
      panel: '#2a1f5e', panelEdge: '#5a3fb0',
      ink: '#ffffff', inkSoft: '#c9bdf5',
    },
  },
};

export const BACKGROUNDS: Background[] = [
  { id: 'meadow', name: 'Sunny Meadow', cost: 0, skyTop: '#7ec8ff', skyBot: '#cfeeff', hillFar: '#9bd0ff', hillNear: '#7fd06a', ground: '#5bbd4e', deco: 'clouds' },
  { id: 'beach', name: 'Sunny Beach', cost: 600, skyTop: '#5fd0ff', skyBot: '#d8f6ff', hillFar: '#9be8ff', hillNear: '#37b7d9', ground: '#ffe0a3', deco: 'clouds' },
  { id: 'candy', name: 'Candy Land', cost: 1800, skyTop: '#ffb8e0', skyBot: '#ffe4f4', hillFar: '#ffc4ec', hillNear: '#ff8fcf', ground: '#ff6fbf', deco: 'clouds' },
  { id: 'snow', name: 'Frosty Peaks', cost: 4000, skyTop: '#9fd4ff', skyBot: '#eaf7ff', hillFar: '#cfeaff', hillNear: '#eef8ff', ground: '#dff0ff', deco: 'snow' },
  { id: 'jungle', name: 'Wild Jungle', cost: 8000, skyTop: '#8fe6b0', skyBot: '#d6ffe2', hillFar: '#4fcf86', hillNear: '#2a9e5a', ground: '#1f8a4a', deco: 'clouds' },
  { id: 'sunset', name: 'Sunset Dunes', cost: 14000, skyTop: '#ff9a5c', skyBot: '#ffd9a3', hillFar: '#ff7e6b', hillNear: '#b85a8f', ground: '#7a4a8f', deco: 'clouds' },
  { id: 'ocean', name: 'Deep Sea', cost: 22000, skyTop: '#1e6fb0', skyBot: '#2fb3c9', hillFar: '#2a8fb8', hillNear: '#1f6f99', ground: '#15527a', deco: 'bubbles' },
  { id: 'galaxy', name: 'Galaxy Rush', cost: 35000, skyTop: '#3a1f6e', skyBot: '#7a3fb0', hillFar: '#5a2f9e', hillNear: '#3a1f7e', ground: '#241454', deco: 'stars' },
];

export const MONSTERS: MonsterSkin[] = [
  { body: '#ff5ea8', dark: '#d62f80' },
  { body: '#34dec0', dark: '#16a98e' },
  { body: '#ffc83d', dark: '#e09a00' },
  { body: '#7c5cff', dark: '#5436d6' },
  { body: '#37c6ff', dark: '#1a8fd6' },
  { body: '#ff7a5c', dark: '#d9492c' },
  { body: '#3ec46b', dark: '#1f9e4a' },
];

export const CANNONS: CannonSkin[] = [
  { id: 'classic', name: 'Classic Cart', cost: 0, barrel: '#7a8aa0', barrelD: '#4a5668', accent: '#ffd23f' },
  { id: 'rose', name: 'Rosy Roller', cost: 400, barrel: '#ff7ab0', barrelD: '#d6478a', accent: '#fff0a8' },
  { id: 'mint', name: 'Minty Blaster', cost: 900, barrel: '#34dec0', barrelD: '#16a98e', accent: '#fff0a8' },
  { id: 'grape', name: 'Grape Tank', cost: 1600, barrel: '#9a74ff', barrelD: '#6e44e0', accent: '#ffd23f' },
  { id: 'gold', name: 'Golden Boomer', cost: 5000, barrel: '#ffcf4d', barrelD: '#e0a200', accent: '#fff6d0' },
];

export const UPGRADES: UpgradeDef[] = [
  { id: 'power', name: 'Blast Power', desc: 'Each ball hits harder', icon: 'power', base: 120, max: 8 },
  { id: 'speed', name: 'Fire Rate', desc: 'Shoot faster', icon: 'speed', base: 150, max: 8 },
  { id: 'multi', name: 'Multi-Ball', desc: 'Fire extra balls', icon: 'multi', base: 300, max: 5 },
  { id: 'magnet', name: 'Coin Magnet', desc: 'Pull in more coins', icon: 'magnet', base: 200, max: 6 },
];

export const DEFAULT_PROFILE = {
  coins: 350,
  gems: 8,
  level: 1,
  lvlProgress: 0.2,
  unlockedBgs: ['meadow'],
  selectedBg: 'meadow',
  unlockedCannons: ['classic'],
  selectedCannon: 'classic',
  upgrades: { power: 1, speed: 1, multi: 0, magnet: 0 },
};

export const DEFAULT_SETTINGS = {
  music: true,
  sound: true,
  vibrate: true,
  notify: false,
};
