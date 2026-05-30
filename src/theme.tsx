// ============================================================
// BLAST BUDDIES — Theme context
// ============================================================

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { THEMES } from './data';
import type { ThemeVars } from './types';

export type ThemeName = 'candy' | 'rainbow' | 'jungle' | 'ocean' | 'galaxy';

interface ThemeContextValue {
  theme: ThemeVars;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
}

const defaultTheme = THEMES.candy.vars;

export const ThemeContext = createContext<ThemeContextValue>({
  theme: defaultTheme,
  themeName: 'candy',
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('candy');

  const setTheme = (name: ThemeName) => {
    setThemeName(name);
  };

  const theme = THEMES[themeName]?.vars ?? defaultTheme;

  return (
    <ThemeContext.Provider value={{ theme, themeName, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeVars {
  return useContext(ThemeContext).theme;
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
