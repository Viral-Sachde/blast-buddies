import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  Circle as SvgCircle,
  G,
  Rect,
  Line,
  Ellipse,
  Path,
} from 'react-native-svg';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useSharedValue, runOnJS } from 'react-native-reanimated';
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
const CANNON_Y = SH - 92;

interface GameScreenProps {
  profile: Profile;
  bg: Background;
  cannonSkin: CannonSkin;
  onExit: () => void;
  onWin: (result: { coins: number; bonus: number; gems: number }) => void;
  onLose: (result: { coins: number; popped: number }) => void;
  onCoins: (n: number) => void;
}

interface DrawSnapshot {
  balls: Ball[];
  monsters: Monster[];
  coins: Coin[];
  pops: Pop[];
  sparks: Spark[];
  cannonX: number;
  cannonAngle: number;
}

export function GameScreen({
  profile, bg, cannonSkin, onExit, onWin, onLose, onCoins,
}: GameScreenProps) {
  const theme = useTheme();
  const [paused, setPaused] = useState(false);
  const [hud, setHud] = useState({ lives: 3, popped: 0 });
  const [snapshot, setSnapshot] = useState<DrawSnapshot>({
    balls: [], monsters: [], coins: [], pops: [], sparks: [],
    cannonX: SW / 2, cannonAngle: 0,
  });

  const pausedRef = useRef(false);
  const doneRef = useRef(false);
  const liveRef = useRef({ lives: 3, popped: 0, earned: 0 });
  const rafRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number | null>(null);
  const cannonXRef = useRef(SW / 2);
  const cannonXShared = useSharedValue(SW / 2);

  const lvl = profile.level;
  const goal = 18 + lvl * 3;
  const ups = profile.upgrades || { power: 1, speed: 1, multi: 0, magnet: 0 };
  const fireInterval = Math.max(170, 480 - (ups.speed || 0) * 42);
  const damage = 1 + (ups.power || 0);
  const multiLvl = ups.multi || 0;
  const magnetLvl = ups.magnet || 0;

  const balls = useRef<Ball[]>([]);
  const monsters = useRef<Monster[]>([]);
  const coins = useRef<Coin[]>([]);
  const pops = useRef<Pop[]>([]);
  const sparks = useRef<Spark[]>([]);
  const lastShot = useRef(0);
  const lastSpawn = useRef(0);

  function spawnMonster(yOff: number) {
    const skin = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
    const size = 60 + Math.random() * 28;
    const base = 8 + lvl * 5;
    const hp = Math.round(base * (0.6 + Math.random() * 1.6));
    const m = size / 2 + 14;
    monsters.current.push({
      x: m + Math.random() * (SW - m * 2),
      y: -size / 2 - yOff * 80,
      hp, maxHp: hp, skin,
      r: size / 2, size, wob: Math.random() * 6.28, hurt: 0,
    });
  }

  const updateCannonX = useCallback((x: number) => {
    cannonXRef.current = x;
  }, []);

  useEffect(() => {
    for (let i = 0; i < 4; i++) spawnMonster(i);

    function loop(now: number) {
      if (prevTimeRef.current === null) {
        prevTimeRef.current = now;
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      const dt = Math.min(0.05, (now - prevTimeRef.current) / 1000);
      prevTimeRef.current = now;

      const cx = cannonXRef.current;

      if (!pausedRef.current && !doneRef.current) {
        if (now - lastShot.current > fireInterval) {
          lastShot.current = now;
          const offs = [0];
          for (let i = 1; i <= multiLvl; i++) { offs.push(i * 16, -i * 16); }
          offs.forEach((o) => {
            balls.current.push({ x: cx + o, y: CANNON_Y - 30, vy: -680, vx: o * 0.5 });
          });
        }

        const every = Math.max(850, 1700 - lvl * 30);
        if (now - lastSpawn.current > every && monsters.current.length < 9) {
          lastSpawn.current = now;
          spawnMonster(0);
        }

        for (const b of balls.current) { b.y += b.vy * dt; b.x += b.vx * dt; }
        balls.current = balls.current.filter((b) => b.y > -30 && !b.dead);

        const fall = 14 + lvl * 1.1;
        for (const m of monsters.current) {
          m.y += fall * dt;
          m.wob += dt * 3;
          if (m.hurt > 0) m.hurt -= dt;
        }

        for (const m of monsters.current) {
          for (const b of balls.current) {
            if (b.dead) continue;
            const dx = b.x - m.x, dy = b.y - m.y;
            if (dx * dx + dy * dy < (m.r + 9) * (m.r + 9)) {
              b.dead = true;
              m.hp -= damage;
              m.hurt = 0.18;
              for (let i = 0; i < 4; i++) {
                sparks.current.push({ x: b.x, y: b.y, vx: (Math.random() - 0.5) * 180, vy: -Math.random() * 160 - 40, life: 0.4, c: m.skin.body });
              }
              if (m.hp <= 0) {
                m.dead = true;
                const reward = Math.round(m.maxHp * (1.1 + magnetLvl * 0.12));
                liveRef.current.earned += reward;
                liveRef.current.popped += 1;
                onCoins(reward);
                for (let i = 0; i < 4; i++) {
                  coins.current.push({ x: m.x, y: m.y, vx: (Math.random() - 0.5) * 200, vy: -Math.random() * 220 - 80, life: 0.9 });
                }
                pops.current.push({ x: m.x, y: m.y, life: 0.5, color: m.skin.body, size: m.size });
                setHud({ lives: liveRef.current.lives, popped: liveRef.current.popped });
                if (liveRef.current.popped >= goal && !doneRef.current) {
                  doneRef.current = true;
                  onWin({ coins: liveRef.current.earned, bonus: 60 + lvl * 15, gems: 1 + Math.floor(lvl / 4) });
                }
              }
            }
          }
        }
        balls.current = balls.current.filter((b) => !b.dead);

        for (const m of monsters.current) {
          if (!m.dead && m.y + m.r * 0.4 >= CANNON_Y) {
            m.dead = true;
            pops.current.push({ x: m.x, y: m.y, life: 0.5, color: '#ff5252', size: m.size });
            liveRef.current.lives -= 1;
            setHud({ lives: liveRef.current.lives, popped: liveRef.current.popped });
            if (liveRef.current.lives <= 0 && !doneRef.current) {
              doneRef.current = true;
              onLose({ coins: liveRef.current.earned, popped: liveRef.current.popped });
            }
          }
        }
        monsters.current = monsters.current.filter((m) => !m.dead);

        for (const c of coins.current) { c.vy += 520 * dt; c.x += c.vx * dt; c.y += c.vy * dt; c.life -= dt; }
        coins.current = coins.current.filter((c) => c.life > 0);
        for (const sp of sparks.current) { sp.x += sp.vx * dt; sp.y += sp.vy * dt; sp.vy += 300 * dt; sp.life -= dt; }
        sparks.current = sparks.current.filter((s) => s.life > 0);
        for (const p of pops.current) p.life -= dt;
        pops.current = pops.current.filter((p) => p.life > 0);
      }

      const a = Math.max(-26, Math.min(26, (cx - SW / 2) * 0.06));
      setSnapshot({
        balls: balls.current.map((b) => ({ ...b })),
        monsters: monsters.current.map((m) => ({ ...m })),
        coins: coins.current.map((c) => ({ ...c })),
        pops: pops.current.map((p) => ({ ...p })),
        sparks: sparks.current.map((s) => ({ ...s })),
        cannonX: cx,
        cannonAngle: a,
      });

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      balls.current = []; monsters.current = []; coins.current = []; pops.current = []; sparks.current = [];
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { pausedRef.current = paused; }, [paused]);

  const panGesture = Gesture.Pan()
    .onBegin((e) => { 'worklet'; runOnJS(updateCannonX)(Math.max(34, Math.min(SW - 34, e.x))); })
    .onUpdate((e) => { 'worklet'; runOnJS(updateCannonX)(Math.max(34, Math.min(SW - 34, e.x))); });
  const tapGesture = Gesture.Tap()
    .onEnd((e) => { 'worklet'; runOnJS(updateCannonX)(Math.max(34, Math.min(SW - 34, e.x))); });
  const gesture = Gesture.Race(panGesture, tapGesture);

  const { cannonX, cannonAngle } = snapshot;

  // Cannon barrel transform
  const rad = (cannonAngle * Math.PI) / 180;
  const cos = Math.cos(rad), sin = Math.sin(rad);
  const ox = 60, oy = 78;
  const tx = ox - ox * cos + oy * sin;
  const ty = oy - ox * sin - oy * cos;
  const barrelT = `matrix(${cos.toFixed(4)},${sin.toFixed(4)},${(-sin).toFixed(4)},${cos.toFixed(4)},${tx.toFixed(4)},${ty.toFixed(4)})`;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Scene bg={bg} />

      {/* Game canvas — pure SVG, no Skia */}
      <GestureDetector gesture={gesture}>
        <View style={StyleSheet.absoluteFill}>
          <Svg width={SW} height={SH} style={StyleSheet.absoluteFill}>
            {/* Danger line */}
            <Line x1={0} y1={CANNON_Y} x2={SW} y2={CANNON_Y} stroke="rgba(255,82,82,0.45)" strokeWidth={3} strokeDasharray="8,6" />

            {/* Monsters */}
            {snapshot.monsters.map((m, i) => {
              const ey = m.y - m.r * 0.16;
              const ex = m.r * 0.34;
              return (
                <G key={i} transform={`translate(${m.x},${m.y})`}>
                  <SvgCircle r={m.r} fill={m.skin.body} stroke={m.skin.dark} strokeWidth={3} />
                  <Ellipse cx={0} cy={m.r * 0.24} rx={m.r * 0.62} ry={m.r * 0.56} fill="rgba(255,255,255,0.88)" />
                  <SvgCircle cx={-ex} cy={-m.r * 0.16} r={m.r * 0.2} fill="#fff" stroke={m.skin.dark} strokeWidth={2} />
                  <SvgCircle cx={ex} cy={-m.r * 0.16} r={m.r * 0.2} fill="#fff" stroke={m.skin.dark} strokeWidth={2} />
                  <SvgCircle cx={-ex} cy={-m.r * 0.12} r={m.r * 0.1} fill="#3a2d4d" />
                  <SvgCircle cx={ex} cy={-m.r * 0.12} r={m.r * 0.1} fill="#3a2d4d" />
                  {m.hurt > 0
                    ? <Ellipse cx={0} cy={m.r * 0.2} rx={m.r * 0.12} ry={m.r * 0.14} fill={m.skin.dark} />
                    : <Path d={`M ${-m.r * 0.18} ${m.r * 0.15} Q 0 ${m.r * 0.32} ${m.r * 0.18} ${m.r * 0.15}`}
                        stroke={m.skin.dark} strokeWidth={2.5} fill="none" strokeLinecap="round" />
                  }
                  {/* HP bar */}
                  <Rect x={-m.r} y={m.r + 4} width={m.r * 2} height={6} rx={3} fill="rgba(0,0,0,0.3)" />
                  <Rect x={-m.r} y={m.r + 4} width={m.r * 2 * Math.max(0, m.hp / m.maxHp)} height={6} rx={3}
                    fill={m.hp / m.maxHp > 0.5 ? '#4cd964' : '#ff5252'} />
                </G>
              );
            })}

            {/* Balls */}
            {snapshot.balls.map((b, i) => (
              <SvgCircle key={i} cx={b.x} cy={b.y} r={9} fill="#ffd23f" stroke="#e09a00" strokeWidth={2} />
            ))}

            {/* Sparks */}
            {snapshot.sparks.map((sp, i) => (
              <SvgCircle key={i} cx={sp.x} cy={sp.y} r={3} fill={sp.c} opacity={Math.max(0, sp.life * 2.5)} />
            ))}

            {/* Coins */}
            {snapshot.coins.map((c, i) => (
              <SvgCircle key={i} cx={c.x} cy={c.y} r={7} fill="#ffd23f" stroke="#e09a00" strokeWidth={1.5} opacity={Math.min(1, c.life * 2)} />
            ))}

            {/* Pop rings */}
            {snapshot.pops.map((p, i) => {
              const k = 0.5 - p.life;
              const rad2 = Math.max(1, p.size * (0.5 + k * 1.4));
              return (
                <SvgCircle key={i} cx={p.x} cy={p.y} r={rad2} fill="none" stroke={p.color}
                  strokeWidth={4} opacity={Math.max(0, p.life * 2)} />
              );
            })}

            {/* Cannon */}
            <G transform={`translate(${cannonX - 60}, ${CANNON_Y - 44})`}>
              <G transform={barrelT}>
                <Rect x="46" y="20" width="28" height="60" rx="13"
                  fill={cannonSkin.barrel} stroke={cannonSkin.barrelD} strokeWidth="4" />
                <Rect x="46" y="20" width="28" height="14" rx="7"
                  fill={cannonSkin.accent} stroke={cannonSkin.barrelD} strokeWidth="4" />
              </G>
              <Rect x="38" y="72" width="44" height="26" rx="9"
                fill={cannonSkin.barrelD} stroke="#2c3340" strokeWidth="3" />
              <Rect x="44" y="76" width="32" height="8" rx="4"
                fill={cannonSkin.accent} opacity="0.85" />
              <SvgCircle cx="42" cy="100" r="15" fill="#3a3340" stroke="#2c2730" strokeWidth="3" />
              <SvgCircle cx="42" cy="100" r="6" fill={cannonSkin.accent} stroke="#b87b00" strokeWidth="2" />
              <SvgCircle cx="78" cy="100" r="15" fill="#3a3340" stroke="#2c2730" strokeWidth="3" />
              <SvgCircle cx="78" cy="100" r="6" fill={cannonSkin.accent} stroke="#b87b00" strokeWidth="2" />
            </G>
          </Svg>
        </View>
      </GestureDetector>

      {/* HUD */}
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

      <View style={styles.goalArea} pointerEvents="none">
        <View style={styles.lives}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={{ opacity: i < hud.lives ? 1 : 0.22 }}>
              <Icon name="heart" size={26} color="#ff5252" />
            </View>
          ))}
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, {
            width: `${Math.min(100, (hud.popped / goal) * 100)}%` as any,
            backgroundColor: theme.accent,
          }]} />
        </View>
        <Text style={styles.goalText}>POP {hud.popped}/{goal} BUDDIES</Text>
      </View>

      {paused && (
        <View style={styles.pauseOverlay}>
          <Panel style={styles.pausePanel}>
            <Text style={[styles.pauseTitle, { color: theme.ink }]}>Paused</Text>
            <ChunkyButton onPress={() => setPaused(false)} variant="accent" fontSize={18} paddingVertical={14} style={styles.resumeBtn}>Resume</ChunkyButton>
            <ChunkyButton onPress={onExit} variant="gray" fontSize={18} paddingVertical={14} style={styles.quitBtn}>Quit to Menu</ChunkyButton>
          </Panel>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hud: { position: 'absolute', top: 14, left: 12, right: 12, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  hudLeft: { gap: 8 },
  chips: { flexDirection: 'row', gap: 8 },
  pauseBtn: { width: 48, height: 48 },
  goalArea: { position: 'absolute', top: 100, left: 0, right: 0, alignItems: 'center', gap: 6 },
  lives: { flexDirection: 'row', gap: 5 },
  progressTrack: { width: 184, height: 14, borderRadius: 999, backgroundColor: 'rgba(20,18,40,0.4)', overflow: 'hidden', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  progressFill: { height: '100%', borderRadius: 999 },
  goalText: { fontFamily: 'Baloo2-Bold', fontSize: 13, fontWeight: '700', color: '#fff', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  pauseOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(20,16,40,0.55)', alignItems: 'center', justifyContent: 'center', zIndex: 20 },
  pausePanel: { width: 280, alignItems: 'center' },
  pauseTitle: { fontFamily: 'Baloo2-ExtraBold', fontSize: 30, fontWeight: '800', marginBottom: 18 },
  resumeBtn: { width: '100%', marginBottom: 12 },
  quitBtn: { width: '100%' },
});
