// ============================================================
// BLAST BUDDIES — Popup/card panel component
// ============================================================

import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

interface PanelProps {
  children: ReactNode;
  style?: object;
}

export function Panel({ children, style = {} }: PanelProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.panel,
        {
          backgroundColor: theme.panel,
          borderColor: theme.panelEdge,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: 28,
    borderWidth: 4,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.34,
    shadowRadius: 20,
    elevation: 14,
  },
});
