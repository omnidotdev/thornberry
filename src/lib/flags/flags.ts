import { flags } from "@/lib/providers";
import { FLAGS } from "./defaults";

/**
 * Check if a feature flag is enabled.
 */
async function isEnabled(
  flagKey: string,
  defaultValue = false,
): Promise<boolean> {
  try {
    return await flags.isEnabled(flagKey);
  } catch {
    return defaultValue;
  }
}

export { FLAGS, isEnabled };
