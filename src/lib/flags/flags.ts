import { startUnleash } from "unleash-client";

import {
  FLAGS_API_HOST,
  FLAGS_CLIENT_KEY,
  isDevEnv,
} from "@/lib/config/env.config";
import { FLAGS, defaultFlags } from "./defaults";

import type { FlagConfig } from "./defaults";

let flagClient: Awaited<ReturnType<typeof startUnleash>> | null = null;
let initialized = false;

async function initializeFlags(): Promise<void> {
  if (initialized) return;
  if (isDevEnv) {
    initialized = true;
    return;
  }

  if (!FLAGS_API_HOST || !FLAGS_CLIENT_KEY) {
    console.warn(
      "Feature flag environment variables not set. Using default flag values.",
    );
    initialized = true;
    return;
  }

  try {
    flagClient = await startUnleash({
      url: FLAGS_API_HOST,
      appName: "thornberry",
      customHeaders: {
        Authorization: FLAGS_CLIENT_KEY,
      },
    });
    initialized = true;
  } catch (error) {
    console.error("Failed to initialize feature flags:", error);
    initialized = true;
  }
}

function getDefaultFlagValue<T>(flagKey: string, fallback: T): T {
  const flagConfig = defaultFlags[flagKey] as FlagConfig | undefined;
  if (flagConfig) return flagConfig.variants[flagConfig.defaultVariant] as T;
  return fallback;
}

/**
 * Check if a feature flag is enabled.
 */
export async function isEnabled(
  flagKey: string,
  defaultValue = false,
): Promise<boolean> {
  await initializeFlags();
  if (!flagClient) {
    return getDefaultFlagValue(flagKey, defaultValue);
  }
  try {
    return flagClient.isEnabled(flagKey);
  } catch {
    return getDefaultFlagValue(flagKey, defaultValue);
  }
}

export { FLAGS };
