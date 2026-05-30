// ============================================================
// BLAST BUDDIES — Game screen with Skia canvas
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import {
  Canvas,
  Circle as SkiaCircle,
  Path as SkiaPath,
  Group,
  Skia,
  RadialGradient,
  vec,
} from '@shopify/react-native-skia';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import {
  useSharedValue,
  useFrameCallback,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { G, Rect, Circle as SvgCircle } from 'react-native-svg';
import { LevelBadge } from '../components/LevelBadge';
import { Chip } from '../components/Chip';
import { Icon } from '../components/Icon';
import { Panel } from '../components/Panel';
import { Scene } from '../components/Scene';
import { ChunkyButton, IconButton } from '../components/ChunkyButton';
import { useTheme } from '../theme';
import { Profile, Background, CannonSkin, Ball, Monster, Coin, Spark, Pop } from '../types';
import { MONSTERS } from '../data';

const { width: SW, height: SH } = Dimensions.get('window');

interface GameScreenProps {
  profile: Profile;
  bg: Background;
  cannonSkin: CannonSkin;
  onExit: () => void;
  onWin: (result: { coins: number; bonus: number; gems: number }) => void;
  onLose: (result: { coins: number; popped: number }) => void;
  onCoins: (n: number) => void;
}

interface GameState {
  balls: Ball[];
  monsters: Monster[];
  coins: Coin[];
  pops: Pop[];
  sparks: Spark[];
  cannonX: number;
  w: number;
  h: number;
  cannonY: number;
  lastShot: number;
  lastSpawn: number;
}

// Snapshot for rendering (safe to read from main thread)
interface DrawSnapshot {
  balls: Ball[];
  monsters: Monster[];
  coins: Coin[];
  pops: Pop[];
  sparks: Spark[];
  cannonY: number;
  w: number;
}

function CannonSvg({ skin, size = 120, angle = 0 }: { skin: CannonSkin; size: number; angle: number }) {
  const c = skin;
  const rad = (angle * Math.PI) / 180;
  const ox = 60;
  const oy = 78;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const tx = ox - ox * cos + oy * sin;
  const ty = oy - ox * sin - oy * cos;
  const barrelTransform = `matrix(${cos.toFixed(6)},${sin.toFixed(6)},${(-sin).toFixed(6)},${cos.toFixed(6)},${tx.toFixed(6)},${ty.toFixed(6)})`;

  return (
    <Svg viewBox="0 0 120 120" width={size} height={size}>
      <G transform={barrelTransform}>
        <Rect x="46" y="20" width="28" height="60" rx="13" fill={c.barrel} stroke={c.barrelD} strokeWidth="4" />
        <Rect x="46" y="20" width="28" height="14" rx="7" fill={c.accent} stroke={c.barrelD} strokeWidth="4" />
        <Rect x="51" y="24" width="6" height="48" rx="3" fill="#fff" opacity="0.35" />
      </G>
      <Rect x="38" y="72" width="44" height="26" rx="9" fill={c.barrelD} stroke="#2c3340" strokeWidth="3" />
      <Rect x="44" y="76" width="32" height="8" rx="4" fill={c.accent} opacity="0.85" />
      <SvgCircle cx="42" cy="100" r="15" fill="#3a3340" stroke="#2c2730" strokeWidth="3" />
      <SvgCircle cx="42" cy="100" r="6" fill={c.accent} stroke="#b87b00" strokeWidth="2" />
      <SvgCircle cx="78" cy="100" r="15" fill="#3a3340" stroke="#2c2730" strokeWidth="3" />
      <SvgCircle cx="78" cy="100" r="6" fill={c.accent} stroke="#b87b00" strokeWidth="2" />
    </Svg>
  );
}

function MonsterSkia({ m }: { m: Monster }) {
  const r = m.r;
  const wob = Math.sin(m.wob) * 0.06;
  const scale = m.hurt > 0 ? 1.12 : 1.0;
  const hurt = m.hurt > 0;
  const ey = -r * 0.16;
  const ex = r * 0.34;

  // Body
  const bodyPath = Skia.Path.Make();
  bodyPath.addCircle(0, 0, r);

  // Left horn
  const lhPath = Skia.Path.Make();
  lhPath.moveTo(-r * 0.5, -r * 0.78);
  lhPath.lineTo(-r * 0.34, -r * 1.05);
  lhPath.lineTo(-r * 0.18, -r * 0.82);
  lhPath.close();

  // Right horn
  const rhPath = Skia.Path.Make();
  rhPath.moveTo(r * 0.5, -r * 0.78);
  rhPath.lineTo(r * 0.34, -r * 1.05);
  rhPath.lineTo(r * 0.18, -r * 0.82);
  rhPath.close();

  // Belly
  const bellyPath = Skia.Path.Make();
  bellyPath.addOval({
    x: -r * 0.62,
    y: r * 0.18 - r * 0.55,
    width: r * 1.24,
    height: r * 1.1,
  });

  // Left eye
  const leyePath = Skia.Path.Make();
  leyePath.addCircle(-ex, ey, r * 0.2);

  // Right eye
  const reyePath = Skia.Path.Make();
  reyePath.addCircle(ex, ey, r * 0.2);

  // Left pupil
  const lpupPath = Skia.Path.Make();
  lpupPath.addCircle(-ex, ey + (hurt ? 2 : 1), r * 0.1);

  // Right pupil
  const rpupPath = Skia.Path.Make();
  rpupPath.addCircle(ex, ey + (hurt ? 2 : 1), r * 0.1);

  // Highlight dots
  const lhighlightPath = Skia.Path.Make();
  lhighlightPath.addCircle(-ex + r * 0.06, ey - r * 0.08, r * 0.04);
  const rhighlightPath = Skia.Path.Make();
  rhighlightPath.addCircle(ex + r * 0.06, ey - r * 0.08, r * 0.04);

  // Mouth
  const mouthPath = Skia.Path.Make();
  if (hurt) {
    mouthPath.addOval({
      x: -r * 0.12,
      y: r * 0.18 - r * 0.12,
      width: r * 0.24,
      height: r * 0.24,
    });
  } else {
    // Happy arc mouth - approximate with quadratic bezier
    mouthPath.moveTo(-r * 0.18, r * 0.14);
    mouthPath.quadTo(0, r * 0.32, r * 0.18, r * 0.14);
  }

  // Cheeks
  const lcheekPath = Skia.Path.Make();
  lcheekPath.addCircle(-r * 0.5, r * 0.2, r * 0.1);
  const rcheekPath = Skia.Path.Make();
  rcheekPath.addCircle(r * 0.5, r * 0.2, r * 0.1);

  const transform = [
    { translateX: m.x },
    { translateY: m.y },
    { rotate: wob },
    { scale },
  ] as any;

  return (
    <Group transform={transform}>
      {/* Body */}
      <SkiaPath path={bodyPath} color={m.skin.body} />
      <SkiaPath path={bodyPath} color={m.skin.dark} style="stroke" strokeWidth={4} />
      {/* Horns */}
      <SkiaPath path={lhPath} color={m.skin.dark} />
      <SkiaPath path={rhPath} color={m.skin.dark} />
      {/* Belly */}
      <SkiaPath path={bellyPath} color="rgba(255,255,255,0.92)" />
      {/* Eyes white */}
      <SkiaPath path={leyePath} color="#fff" />
      <SkiaPath path={leyePath} color={m.skin.dark} style="stroke" strokeWidth={2.4} />
      <SkiaPath path={reyePath} color="#fff" />
      <SkiaPath path={reyePath} color={m.skin.dark} style="stroke" strokeWidth={2.4} />
      {/* Pupils */}
      <SkiaPath path={lpupPath} color="#3a2d4d" />
      <SkiaPath path={rpupPath} color="#3a2d4d" />
      {/* Highlights */}
      <SkiaPath path={lhighlightPath} color="#fff" />
      <SkiaPath path={rhighlightPath} color="#fff" />
      {/* Mouth */}
      <SkiaPath path={mouthPath} color={m.skin.dark} style="stroke" strokeWidth={3} strokeCap="round" />
      {/* Cheeks */}
      <SkiaPath path={lcheekPath} color={m.skin.dark} opacity={0.25} />
      <SkiaPath path={rcheekPath} color={m.skin.dark} opacity={0.25} />
    </Group>
  );
}

function BallSkia({ b }: { b: Ball }) {
  return (
    <SkiaCircle cx={b.x} cy={b.y} r={9}>
      <RadialGradient
        c={vec(b.x - 3, b.y - 3)}
        r={10}
        colors={['#ffffff', '#ffd23f', '#e0a200']}
        positions={[0, 0.6, 1]}
      />
    </SkiaCircle>
  );
}

function PopRingSkia({ p }: { p: Pop }) {
  const k = 0.5 - p.life;
  const rad = Math.max(1, p.size * (0.5 + k * 1.4));
  const ringPath = Skia.Path.Make();
  ringPath.addCircle(p.x, p.y, rad);
  return (
    <SkiaPath
      path={ringPath}
      color={p.color}
      style="stroke"
      strokeWidth={4}
      opacity={Math.max(0, p.life * 2)}
    />
  );
}

export function GameScreen({
  profile,
  bg,
  cannonSkin,
  onExit,
  onWin,
  onLose,
  onCoins,
}: GameScreenProps) {
  const theme = useTheme();
  const [paused, setPaused] = useState(false);
  const [hud, setHud] = useState({ lives: 3, popped: 0 });
  const [cannonAngle, setCannonAngle] = useState(-8);
  const [cannonLeft, setCannonLeft] = useState(SW / 2 - 60);
  const [snapshot, setSnapshot] = useState<DrawSnapshot>({
    balls: [],
    monsters: [],
    coins: [],
    pops: [],
    sparks: [],
    cannonY: SH - 92,
    w: SW,
  });

  const pausedRef = useRef(false);
  const doneRef = useRef(false);
  const live = useRef({ lives: 3, popped: 0, earned: 0 });

  const lvl = profile.level;
  const goal = 18 + lvl * 3;
  const ups = profile.upgrades || { power: 1, speed: 1, multi: 0, magnet: 0 };
  const fireInterval = Math.max(170, 480 - (ups.speed || 0) * 42);
  const damage = 1 + (ups.power || 0);
  const multiLvl = ups.multi || 0;
  const magnetLvl = ups.magnet || 0;

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // Game state in a ref to avoid re-renders
  const S = useRef<GameState>({
    balls: [],
    monsters: [],
    coins: [],
    pops: [],
    sparks: [],
    cannonX: SW / 2,
    w: SW,
    h: SH,
    cannonY: SH - 92,
    lastShot: 0,
    lastSpawn: 0,
  }).current;

  // Touch cannonX tracking
  const cannonXShared = useSharedValue(SW / 2);

  const updateHud = useCallback((lives: number, popped: number) => {
    setHud({ lives, popped });
  }, []);

  const triggerWin = useCallback(
    (result: { coins: number; bonus: number; gems: number }) => {
      onWin(result);
    },
    [onWin],
  );

  const triggerLose = useCallback(
    (result: { coins: number; popped: number }) => {
      onLose(result);
    },
    [onLose],
  );

  const triggerCoins = useCallback(
    (n: number) => {
      onCoins(n);
    },
    [onCoins],
  );

  const updateSnapshot = useCallback((snap: DrawSnapshot) => {
    setSnapshot(snap);
  }, []);

  const updateCannon = useCallback((angle: number, left: number) => {
    setCannonAngle(angle);
    setCannonLeft(left);
  }, []);

  function spawnMonster(idx: number) {
    const skin = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
    const size = 64 + Math.random() * 28;
    const base = 8 + lvl * 5;
    const hp = Math.round(base * (0.6 + Math.random() * 1.6));
    const m = size / 2 + 14;
    S.monsters.push({
      x: m + Math.random() * (S.w - m * 2),
      y: -size / 2 - idx * 78,
      hp,
      maxHp: hp,
      skin,
      r: size / 2,
      size,
      wob: Math.random() * 6.28,
      hurt: 0,
    });
  }

  // Initialize monsters
  useEffect(() => {
    for (let i = 0; i < 4; i++) spawnMonster(i);
    return () => {
      S.balls = [];
      S.monsters = [];
      S.coins = [];
      S.pops = [];
      S.sparks = [];
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prevTime = useRef<number | null>(null);

  useFrameCallback((frameInfo) => {
    const now = frameInfo.timestamp;
    if (prevTime.current === null) {
      prevTime.current = now;
      return;
    }
    const dt = Math.min(0.05, (now - prevTime.current) / 1000);
    prevTime.current = now;

    S.cannonX = cannonXShared.value;

    if (!pausedRef.current && !doneRef.current) {
      // Fire
      if (now - S.lastShot > fireInterval) {
        S.lastShot = now;
        const offs = [0];
        for (let i = 1; i <= multiLvl; i++) {
          offs.push(i * 15, -i * 15);
        }
        offs.forEach((o) => {
          S.balls.push({
            x: S.cannonX + o,
            y: S.cannonY - 28,
            vy: -700,
            vx: o * 0.5,
          });
        });
      }

      // Spawn
      const every = Math.max(850, 1700 - lvl * 30);
      if (now - S.lastSpawn > every && S.monsters.length < 9) {
        S.lastSpawn = now;
        spawnMonster(0);
      }

      // Move balls
      for (const b of S.balls) {
        b.y += b.vy * dt;
        b.x += b.vx * dt;
      }
      S.balls = S.balls.filter((b) => b.y > -30 && !b.dead);

      // Move monsters
      const fall = 15 + lvl * 1.1;
      for (const m of S.monsters) {
        m.y += fall * dt;
        m.wob += dt * 3;
        if (m.hurt > 0) m.hurt -= dt;
      }

      // Collisions
      for (const m of S.monsters) {
        for (const b of S.balls) {
          if (b.dead) continue;
          const dx = b.x - m.x;
          const dy = b.y - m.y;
          if (dx * dx + dy * dy < (m.r + 9) * (m.r + 9)) {
            b.dead = true;
            m.hp -= damage;
            m.hurt = 0.18;
            for (let i = 0; i < 4; i++) {
              S.sparks.push({
                x: b.x,
                y: b.y,
                vx: (Math.random() - 0.5) * 180,
                vy: -Math.random() * 160 - 40,
                life: 0.4,
                c: m.skin.body,
              });
            }
            if (m.hp <= 0) {
              m.dead = true;
              const reward = Math.round(m.maxHp * (1.1 + magnetLvl * 0.12));
              live.current.earned += reward;
              live.current.popped += 1;
              runOnJS(triggerCoins)(reward);
              for (let i = 0; i < 5; i++) {
                S.coins.push({
                  x: m.x,
                  y: m.y,
                  vx: (Math.random() - 0.5) * 200,
                  vy: -Math.random() * 220 - 80,
                  life: 0.9,
                });
              }
              S.pops.push({
                x: m.x,
                y: m.y,
                life: 0.5,
                color: m.skin.body,
                size: m.size,
              });
              runOnJS(updateHud)(live.current.lives, live.current.popped);
              if (live.current.popped >= goal && !doneRef.current) {
                doneRef.current = true;
                const result = {
                  coins: live.current.earned,
                  bonus: 60 + lvl * 15,
                  gems: 1 + Math.floor(lvl / 4),
                };
                runOnJS(triggerWin)(result);
              }
            }
          }
        }
      }
      S.balls = S.balls.filter((b) => !b.dead);

      // Breaches
      for (const m of S.monsters) {
        if (!m.dead && m.y + m.r * 0.4 >= S.cannonY) {
          m.dead = true;
          S.pops.push({
            x: m.x,
            y: m.y,
            life: 0.5,
            color: '#ff5252',
            size: m.size,
          });
          live.current.lives -= 1;
          runOnJS(updateHud)(live.current.lives, live.current.popped);
          if (live.current.lives <= 0 && !doneRef.current) {
            doneRef.current = true;
            const result = {
              coins: live.current.earned,
              popped: live.current.popped,
            };
            runOnJS(triggerLose)(result);
          }
        }
      }
      S.monsters = S.monsters.filter((m) => !m.dead);

      // Particles
      for (const c of S.coins) {
        c.vy += 520 * dt;
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        c.life -= dt;
      }
      S.coins = S.coins.filter((c) => c.life > 0);

      for (const sp of S.sparks) {
        sp.x += sp.vx * dt;
        sp.y += sp.vy * dt;
        sp.vy += 300 * dt;
        sp.life -= dt;
      }
      S.sparks = S.sparks.filter((s) => s.life > 0);

      for (const p of S.pops) p.life -= dt;
      S.pops = S.pops.filter((p) => p.life > 0);

      // Cannon position
      const a = Math.max(-26, Math.min(26, (S.cannonX - S.w / 2) * 0.06));
      runOnJS(updateCannon)(a, S.cannonX - 60);
    }

    // Push snapshot to React
    runOnJS(updateSnapshot)({
      balls: S.balls.map((b) => ({ ...b })),
      monsters: S.monsters.map((m) => ({ ...m })),
      coins: S.coins.map((c) => ({ ...c })),
      pops: S.pops.map((p) => ({ ...p })),
      sparks: S.sparks.map((s) => ({ ...s })),
      cannonY: S.cannonY,
      w: S.w,
    });
  }, true);

  // Gesture for cannon tracking
  const panGesture = Gesture.Pan()
    .onBegin((e) => {
      'worklet';
      cannonXShared.value = Math.max(34, Math.min(SW - 34, e.x));
    })
    .onUpdate((e) => {
      'worklet';
      cannonXShared.value = Math.max(34, Math.min(SW - 34, e.x));
    });

  const tapGesture = Gesture.Tap().onEnd((e) => {
    'worklet';
    cannonXShared.value = Math.max(34, Math.min(SW - 34, e.x));
  });

  const gesture = Gesture.Race(panGesture, tapGesture);

  // Danger line path
  const dangerPath = Skia.Path.Make();
  dangerPath.moveTo(0, snapshot.cannonY);
  dangerPath.lineTo(snapshot.w, snapshot.cannonY);

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Background scene */}
      <Scene bg={bg} />

      {/* Skia Canvas */}
      <GestureDetector gesture={gesture}>
        <Canvas style={StyleSheet.absoluteFill}>
          {/* Danger line */}
          <SkiaPath
            path={dangerPath}
            color="rgba(255,82,82,0.5)"
            style="stroke"
            strokeWidth={4}
          />

          {/* Monsters */}
          {snapshot.monsters.map((m, idx) => (
            <MonsterSkia key={idx} m={m} />
          ))}

          {/* Balls */}
          {snapshot.balls.map((b, idx) => (
            <BallSkia key={idx} b={b} />
          ))}

          {/* Sparks */}
          {snapshot.sparks.map((sp, idx) => (
            <SkiaCircle
              key={idx}
              cx={sp.x}
              cy={sp.y}
              r={3.4}
              color={sp.c}
              opacity={Math.max(0, sp.life * 2.5)}
            />
          ))}

          {/* Coins */}
          {snapshot.coins.map((c, idx) => (
            <SkiaCircle
              key={idx}
              cx={c.x}
              cy={c.y}
              r={8}
              color="#ffd23f"
              opacity={Math.min(1, c.life * 2)}
            />
          ))}

          {/* Pop rings */}
          {snapshot.pops.map((p, idx) => (
            <PopRingSkia key={idx} p={p} />
          ))}
        </Canvas>
      </GestureDetector>

      {/* Cannon SVG */}
      <View
        pointerEvents="none"
        style={[
          styles.cannonContainer,
          { left: cannonLeft, top: snapshot.cannonY - 44 },
        ]}
      >
        <CannonSvg skin={cannonSkin} size={120} angle={cannonAngle} />
      </View>

      {/* HUD overlay */}
      <View style={styles.hud} pointerEvents="box-none">
        <View style={styles.hudLeft}>
          <LevelBadge level={profile.level} progress={profile.lvlProgress} />
          <View style={styles.chips}>
            <Chip icon="coin" value={profile.coins} />
            <Chip icon="gem" value={profile.gems} />
          </View>
        </View>
        <IconButton onPress={() => setPaused(true)} style={styles.pauseBtn}>
          <Icon name="pause" size={26} color="#5a6678" />
        </IconButton>
      </View>

      {/* Goal + lives */}
      <View style={styles.goalArea} pointerEvents="none">
        <View style={styles.lives}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={{ opacity: i < hud.lives ? 1 : 0.22 }}>
              <Icon name="heart" size={26} color="#ff5252" />
            </View>
          ))}
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(100, (hud.popped / goal) * 100)}%` as any,
                backgroundColor: theme.accent,
              },
            ]}
          />
        </View>
        <Text style={styles.goalText}>
          POP {hud.popped}/{goal} BUDDIES
        </Text>
      </View>

      {/* Pause overlay */}
      {paused && (
        <View style={styles.pauseOverlay}>
          <Panel style={styles.pausePanel}>
            <Text style={[styles.pauseTitle, { color: theme.ink }]}>Paused</Text>
            <ChunkyButton
              onPress={() => setPaused(false)}
              variant="accent"
              fontSize={18}
              paddingVertical={14}
              style={styles.resumeBtn}
            >
              Resume
            </ChunkyButton>
            <ChunkyButton
              onPress={onExit}
              variant="gray"
              fontSize={18}
              paddingVertical={14}
              style={styles.quitBtn}
            >
              Quit to Menu
            </ChunkyButton>
          </Panel>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hud: {
    position: 'absolute',
    top: 14,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  hudLeft: {
    gap: 8,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
  },
  pauseBtn: {
    width: 48,
    height: 48,
  },
  cannonContainer: {
    position: 'absolute',
  },
  goalArea: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 6,
  },
  lives: {
    flexDirection: 'row',
    gap: 5,
  },
  progressTrack: {
    width: 184,
    height: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(20,18,40,0.4)',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  goalText: {
    fontFamily: 'Baloo2-Bold',
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  pauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(20,16,40,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  pausePanel: {
    width: 280,
    alignItems: 'center',
  },
  pauseTitle: {
    fontFamily: 'Baloo2-ExtraBold',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 18,
  },
  resumeBtn: {
    width: '100%',
    marginBottom: 12,
  },
  quitBtn: {
    width: '100%',
  },
});
