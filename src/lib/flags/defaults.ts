export interface FlagConfig {
  variants: Record<string, boolean | string | number>;
  defaultVariant: string;
}

export const defaultFlags: Record<string, FlagConfig> = {
  "thornberry-maintenance-mode": {
    variants: {
      on: true,
      off: false,
    },
    defaultVariant: "off",
  },
};

export const FLAGS = {
  MAINTENANCE_MODE: "thornberry-maintenance-mode",
} as const;
