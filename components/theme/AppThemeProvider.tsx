import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { themeById, themes, type Theme, type ThemeId } from "@/lib/theme";

const THEME_STORAGE_KEY = "dayrise.theme";

type ThemeContextValue = {
  themeId: ThemeId;
  theme: Theme;
  setThemeId: (next: ThemeId) => void;
  isReady: boolean;
  availableThemes: Theme[];
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>("garden");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((stored) => {
        if (!isMounted) return;
        if (stored && stored in themeById) {
          setThemeIdState(stored as ThemeId);
        }
        setIsReady(true);
      })
      .catch(() => {
        if (!isMounted) return;
        setIsReady(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const setThemeId = (next: ThemeId) => {
    setThemeIdState(next);
    AsyncStorage.setItem(THEME_STORAGE_KEY, next).catch(() => {});
  };

  const theme = themeById[themeId];
  const value = useMemo<ThemeContextValue>(
    () => ({
      themeId,
      theme,
      setThemeId,
      isReady,
      availableThemes: themes,
    }),
    [isReady, theme, themeId]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within AppThemeProvider");
  }
  return context;
}
