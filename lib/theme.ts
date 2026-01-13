export type ThemeId = "garden" | "sunrise" | "focus";

export type Theme = {
  id: ThemeId;
  label: string;
  description: string;
  colors: {
    bg: string;
    card: string;
    primary: string;
    secondary: string;
    textMain: string;
    textSub: string;
    border: string;
    muted: string;
    accent: string;
    tabShadow: string;
  };
  classes: {
    bg: string;
    card: string;
    primaryBg: string;
    primaryBg5: string;
    primaryBg10: string;
    primaryBg15: string;
    primaryBg50: string;
    primaryBg60: string;
    primaryText: string;
    primaryBorder: string;
    primaryBorder20: string;
    primaryBorder60: string;
    secondaryBg: string;
    secondaryBg15: string;
    secondaryBg40: string;
    textMain: string;
    textSub: string;
    borderSoft: string;
    borderSoftBg: string;
    mutedBg: string;
    accentBg: string;
    shadowPrimary30: string;
    shadowPrimary40: string;
    shadowSecondary30: string;
  };
};

export const themes: Theme[] = [
  {
    id: "garden",
    label: "클래식",
    description: "따뜻하고 편안한 기본 톤",
    colors: {
      bg: "#FBF6F0",
      card: "#FFFCF8",
      primary: "#E08162",
      secondary: "#7F9B8F",
      textMain: "#3C322B",
      textSub: "#7C736C",
      border: "#F0E6DD",
      muted: "#F6EFE8",
      accent: "#F3D7C9",
      tabShadow: "rgba(90, 63, 51, 0.08)",
    },
    classes: {
      bg: "bg-garden-bg",
      card: "bg-garden-card",
      primaryBg: "bg-garden-primary",
      primaryBg5: "bg-garden-primary/5",
      primaryBg10: "bg-garden-primary/10",
      primaryBg15: "bg-garden-primary/15",
      primaryBg50: "bg-garden-primary/50",
      primaryBg60: "bg-garden-primary/60",
      primaryText: "text-garden-primary",
      primaryBorder: "border-garden-primary",
      primaryBorder20: "border-garden-primary/20",
      primaryBorder60: "border-garden-primary/60",
      secondaryBg: "bg-garden-secondary",
      secondaryBg15: "bg-garden-secondary/15",
      secondaryBg40: "bg-garden-secondary/40",
      textMain: "text-garden-text",
      textSub: "text-garden-sub",
      borderSoft: "border-garden-border",
      borderSoftBg: "bg-garden-border",
      mutedBg: "bg-garden-muted",
      accentBg: "bg-garden-accent",
      shadowPrimary30: "shadow-garden-primary/30",
      shadowPrimary40: "shadow-garden-primary/40",
      shadowSecondary30: "shadow-garden-secondary/30",
    },
  },
  {
    id: "sunrise",
    label: "데이라이즈",
    description: "새벽의 온기와 맑은 하늘",
    colors: {
      bg: "#F6F8FC",
      card: "#FFFFFF",
      primary: "#7CB7FF",
      secondary: "#2F6FED",
      textMain: "#1E2433",
      textSub: "#5F6B7A",
      border: "#D8E0EE",
      muted: "#EEF2F8",
      accent: "#FFD166",
      tabShadow: "rgba(23, 41, 77, 0.08)",
    },
    classes: {
      bg: "bg-sunrise-bg",
      card: "bg-sunrise-card",
      primaryBg: "bg-sunrise-primary",
      primaryBg5: "bg-sunrise-primary/5",
      primaryBg10: "bg-sunrise-primary/10",
      primaryBg15: "bg-sunrise-primary/15",
      primaryBg50: "bg-sunrise-primary/50",
      primaryBg60: "bg-sunrise-primary/60",
      primaryText: "text-sunrise-primary",
      primaryBorder: "border-sunrise-primary",
      primaryBorder20: "border-sunrise-primary/20",
      primaryBorder60: "border-sunrise-primary/60",
      secondaryBg: "bg-sunrise-secondary",
      secondaryBg15: "bg-sunrise-secondary/15",
      secondaryBg40: "bg-sunrise-secondary/40",
      textMain: "text-sunrise-text",
      textSub: "text-sunrise-sub",
      borderSoft: "border-sunrise-border",
      borderSoftBg: "bg-sunrise-border",
      mutedBg: "bg-sunrise-muted",
      accentBg: "bg-sunrise-accent",
      shadowPrimary30: "shadow-sunrise-primary/30",
      shadowPrimary40: "shadow-sunrise-primary/40",
      shadowSecondary30: "shadow-sunrise-secondary/30",
    },
  },
  {
    id: "focus",
    label: "포커스",
    description: "차분한 그린과 선명한 집중감",
    colors: {
      bg: "#F4F7F4",
      card: "#FFFFFF",
      primary: "#23B07B",
      secondary: "#1B5E7A",
      textMain: "#1E2A2F",
      textSub: "#5C6B73",
      border: "#D9E4E0",
      muted: "#E9F0ED",
      accent: "#FFC857",
      tabShadow: "rgba(25, 54, 65, 0.08)",
    },
    classes: {
      bg: "bg-focus-bg",
      card: "bg-focus-card",
      primaryBg: "bg-focus-primary",
      primaryBg5: "bg-focus-primary/5",
      primaryBg10: "bg-focus-primary/10",
      primaryBg15: "bg-focus-primary/15",
      primaryBg50: "bg-focus-primary/50",
      primaryBg60: "bg-focus-primary/60",
      primaryText: "text-focus-primary",
      primaryBorder: "border-focus-primary",
      primaryBorder20: "border-focus-primary/20",
      primaryBorder60: "border-focus-primary/60",
      secondaryBg: "bg-focus-secondary",
      secondaryBg15: "bg-focus-secondary/15",
      secondaryBg40: "bg-focus-secondary/40",
      textMain: "text-focus-text",
      textSub: "text-focus-sub",
      borderSoft: "border-focus-border",
      borderSoftBg: "bg-focus-border",
      mutedBg: "bg-focus-muted",
      accentBg: "bg-focus-accent",
      shadowPrimary30: "shadow-focus-primary/30",
      shadowPrimary40: "shadow-focus-primary/40",
      shadowSecondary30: "shadow-focus-secondary/30",
    },
  },
];

export const themeById = themes.reduce<Record<ThemeId, Theme>>(
  (acc, theme) => {
    acc[theme.id] = theme;
    return acc;
  },
  {} as Record<ThemeId, Theme>
);
