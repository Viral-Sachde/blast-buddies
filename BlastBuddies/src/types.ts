// ============================================================
// BLAST BUDDIES — TypeScript types
// ============================================================

export interface ThemeVars {
  primary: string;
  primaryD: string;
  accent: string;
  accentD: string;
  gold: string;
  goldD: string;
  gem: string;
  gemD: string;
  menuTop: string;
  menuBot: string;
  panel: string;
  panelEdge: string;
  ink: string;
  inkSoft: string;
}

export interface ThemeData {
  label: string;
  vars: ThemeVars;
}

export interface Background {
  id: string;
  name: string;
  cost: number;
  skyTop: string;
  skyBot: string;
  hillFar: string;
  hillNear: string;
  ground: string;
  deco: 'clouds' | 'snow' | 'bubbles' | 'stars';
}

export interface MonsterSkin {
  body: string;
  dark: string;
}

export interface CannonSkin {
  id: string;
  name: string;
  cost: number;
  barrel: string;
  barrelD: string;
  accent: string;
}

export interface UpgradeDef {
  id: string;
  name: string;
  desc: string;
  icon: string;
  base: number;
  max: number;
}

export interface Profile {
  coins: number;
  gems: number;
  level: number;
  lvlProgress: number;
  unlockedBgs: string[];
  selectedBg: string;
  unlockedCannons: string[];
  selectedCannon: string;
  upgrades: {
    power: number;
    speed: number;
    multi: number;
    magnet: number;
  };
}

export interface AppSettings {
  music: boolean;
  sound: boolean;
  vibrate: boolean;
  notify: boolean;
}

export type Route = 'splash' | 'home' | 'shop' | 'upgrades' | 'settings' | 'daily' | 'game';

export type PopupKind = 'win' | 'lose';

export interface WinResult {
  coins: number;
  bonus: number;
  gems: number;
}

export interface LoseResult {
  coins: number;
  popped: number;
}

export type Popup =
  | { kind: 'win'; result: WinResult }
  | { kind: 'lose'; result: LoseResult };

// Game entities
export interface Ball {
  x: number;
  y: number;
  vy: number;
  vx: number;
  dead?: boolean;
}

export interface Monster {
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  skin: MonsterSkin;
  r: number;
  size: number;
  wob: number;
  hurt: number;
  dead?: boolean;
}

export interface Coin {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

export interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  c: string;
}

export interface Pop {
  x: number;
  y: number;
  life: number;
  color: string;
  size: number;
}
