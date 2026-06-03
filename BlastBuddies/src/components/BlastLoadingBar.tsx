import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";

type Props = {
  progress: number; // 0–100
  width?: number | string;
};

const BAR_HEIGHT = 28;

export default function BlastLoadingBar({ progress, width = "100%" }: Props) {
  const safeProgress = Math.max(0, Math.min(100, progress));

  // Animated fill width (0 → 1)
  const fillAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: safeProgress / 100,
      duration: 220,
      useNativeDriver: false, // width cannot use native driver
    }).start();
  }, [safeProgress]);

  // Shimmer loop on the shine overlay
  const shimmerX = useRef(new Animated.Value(-1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerX, { toValue: 1, duration: 1100, useNativeDriver: false }),
        Animated.timing(shimmerX, { toValue: -1, duration: 0, useNativeDriver: false }),
      ]),
    ).start();
  }, []);

  const fillWidth = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  // shimmer translates from left edge to right edge of the fill
  const shimmerLeft = shimmerX.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-40%", "110%"],
  });

  return (
    <View style={[styles.outer, { width }]}>
      <View style={styles.track}>
        {/* Filled portion */}
        <Animated.View style={[styles.fill, { width: fillWidth }]}>
          {/* Static top shine */}
          <View style={styles.staticShine} />
          {/* Moving shimmer streak */}
          <Animated.View style={[styles.shimmer, { left: shimmerLeft }]} />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    height: BAR_HEIGHT,
    borderRadius: 999,
    backgroundColor: "#0D6EFF",
    padding: 3,
    shadowColor: "#2A7FFF",
    shadowOpacity: 0.9,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  track: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: "#001B84",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#00125A",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#FFD400",
    borderTopWidth: 1,
    borderTopColor: "#FFF06A",
    borderBottomWidth: 1,
    borderBottomColor: "#FF9800",
    overflow: "hidden",
  },
  staticShine: {
    position: "absolute",
    top: 2,
    left: 8,
    right: 8,
    height: 7,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  shimmer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "30%",
    backgroundColor: "rgba(255,255,255,0.22)",
    transform: [{ skewX: "-20deg" }],
  },
});
