/**
 * Visual theme for a node, expressed as Tailwind utility class strings.
 *
 * Consumers either pick one of the semantic keys in {@link nodeThemes} or
 * pass a fully custom object of this shape.
 */
export interface NodeTheme {
  /** Border classes for the node container */
  border: string;
  /** Background classes for the node container */
  bg: string;
  /** Background classes for the icon badge */
  iconBg: string;
  /** Text/foreground classes for the icon */
  iconText: string;
  /** Accent text classes (labels, emphasis) */
  accent: string;
  /** Background classes applied to connection handles */
  handleColor: string;
  /** Optional box-shadow/glow classes */
  glow?: string;
}

/**
 * Small set of generic, semantic node themes driven by the design
 * system's CSS-variable tokens (card, primary, muted, destructive).
 *
 * `success` and `warning` are not part of the base token set, so they
 * fall back to fixed emerald/amber hues to keep their conventional
 * meaning.
 */
export const nodeThemes = {
  default: {
    border: "border-border",
    bg: "bg-card",
    iconBg: "bg-secondary",
    iconText: "text-secondary-foreground",
    accent: "text-foreground",
    handleColor: "!bg-muted-foreground",
  },
  accent: {
    border: "border-primary",
    bg: "bg-primary/10",
    iconBg: "bg-primary",
    iconText: "text-primary-foreground",
    accent: "text-primary",
    handleColor: "!bg-primary",
    glow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]",
  },
  // success/warning have no design-system token; use fixed hues
  success: {
    border: "border-emerald-300/60 dark:border-emerald-600/40",
    bg: "bg-emerald-50 dark:bg-emerald-950",
    iconBg: "bg-emerald-600 dark:bg-emerald-500",
    iconText: "text-white",
    accent: "text-emerald-600 dark:text-emerald-400",
    handleColor: "!bg-emerald-500",
    glow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]",
  },
  // success/warning have no design-system token; use fixed hues
  warning: {
    border: "border-amber-300/60 dark:border-amber-600/40",
    bg: "bg-amber-50 dark:bg-amber-950",
    iconBg: "bg-amber-500 dark:bg-amber-600",
    iconText: "text-white",
    accent: "text-amber-600 dark:text-amber-400",
    handleColor: "!bg-amber-500",
    glow: "shadow-[0_0_15px_rgba(245,158,11,0.15)]",
  },
  danger: {
    border: "border-destructive",
    bg: "bg-destructive/10",
    iconBg: "bg-destructive",
    iconText: "text-white",
    accent: "text-destructive",
    handleColor: "!bg-destructive",
    glow: "shadow-[0_0_15px_rgba(239,68,68,0.15)]",
  },
  muted: {
    border: "border-border",
    bg: "bg-muted",
    iconBg: "bg-muted-foreground",
    iconText: "text-background",
    accent: "text-muted-foreground",
    handleColor: "!bg-muted-foreground",
  },
} as const satisfies Record<string, NodeTheme>;

/** Union of the built-in semantic theme keys */
export type NodeThemeKey = keyof typeof nodeThemes;

/**
 * Resolve a theme input to a concrete {@link NodeTheme}.
 *
 * A string key is looked up in {@link nodeThemes}; a custom object is
 * returned unchanged.
 */
export const resolveTheme = (theme: NodeThemeKey | NodeTheme): NodeTheme =>
  typeof theme === "string" ? nodeThemes[theme] : theme;
