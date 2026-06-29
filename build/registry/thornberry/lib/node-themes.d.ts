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
export declare const nodeThemes: {
    readonly default: {
        readonly border: "border-border";
        readonly bg: "bg-card";
        readonly iconBg: "bg-secondary";
        readonly iconText: "text-secondary-foreground";
        readonly accent: "text-foreground";
        readonly handleColor: "!bg-muted-foreground";
    };
    readonly accent: {
        readonly border: "border-primary";
        readonly bg: "bg-primary/10";
        readonly iconBg: "bg-primary";
        readonly iconText: "text-primary-foreground";
        readonly accent: "text-primary";
        readonly handleColor: "!bg-primary";
        readonly glow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]";
    };
    readonly success: {
        readonly border: "border-emerald-300/60 dark:border-emerald-600/40";
        readonly bg: "bg-emerald-50 dark:bg-emerald-950";
        readonly iconBg: "bg-emerald-600 dark:bg-emerald-500";
        readonly iconText: "text-white";
        readonly accent: "text-emerald-600 dark:text-emerald-400";
        readonly handleColor: "!bg-emerald-500";
        readonly glow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]";
    };
    readonly warning: {
        readonly border: "border-amber-300/60 dark:border-amber-600/40";
        readonly bg: "bg-amber-50 dark:bg-amber-950";
        readonly iconBg: "bg-amber-500 dark:bg-amber-600";
        readonly iconText: "text-white";
        readonly accent: "text-amber-600 dark:text-amber-400";
        readonly handleColor: "!bg-amber-500";
        readonly glow: "shadow-[0_0_15px_rgba(245,158,11,0.15)]";
    };
    readonly danger: {
        readonly border: "border-destructive";
        readonly bg: "bg-destructive/10";
        readonly iconBg: "bg-destructive";
        readonly iconText: "text-white";
        readonly accent: "text-destructive";
        readonly handleColor: "!bg-destructive";
        readonly glow: "shadow-[0_0_15px_rgba(239,68,68,0.15)]";
    };
    readonly muted: {
        readonly border: "border-border";
        readonly bg: "bg-muted";
        readonly iconBg: "bg-muted-foreground";
        readonly iconText: "text-background";
        readonly accent: "text-muted-foreground";
        readonly handleColor: "!bg-muted-foreground";
    };
};
/** Union of the built-in semantic theme keys */
export type NodeThemeKey = keyof typeof nodeThemes;
/**
 * Resolve a theme input to a concrete {@link NodeTheme}.
 *
 * A string key is looked up in {@link nodeThemes}; a custom object is
 * returned unchanged.
 */
export declare const resolveTheme: (theme: NodeThemeKey | NodeTheme) => NodeTheme;
