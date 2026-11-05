import { Loader2 } from "lucide-react";

import { Button } from "@/registry/thornberry/components/button";
import {
  DialogBackdrop,
  DialogContent,
  DialogDescription,
  DialogPortal,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from "@/registry/thornberry/components/dialog";
import { Label } from "@/registry/thornberry/components/label";
import { PasswordInput } from "@/registry/thornberry/components/password-input";
import { cn } from "@/lib/utils";

import type { ComponentProps, ReactNode } from "react";

/**
 * Which affordance the panel leads with:
 * - `generate`: signed in or a key is set, so Generate runs
 * - `signIn`: no identity and no key, but sign-in is available
 * - `needsKey`: no identity, no sign-in, so a key is the only path
 */
export type AiDescribeMode = "generate" | "signIn" | "needsKey";

export interface AiDescribePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Which affordance to lead with. The host resolves this from auth + key state. */
  mode: AiDescribeMode;
  /** Dialog heading. */
  title?: string;
  /** Short line under the heading. */
  description?: ReactNode;

  /** The prompt text (controlled). */
  prompt: string;
  onPromptChange: (prompt: string) => void;
  placeholder?: string;
  /** Starter prompts shown as chips while the prompt is empty. */
  suggestions?: readonly string[];
  onPickSuggestion?: (suggestion: string) => void;

  /** Fire a generation with the current prompt. */
  onGenerate: () => void;
  /** While true the dialog cannot be dismissed and inputs are disabled. */
  isPending?: boolean;
  generateLabel?: string;

  /** Start sign-in (shown as the primary CTA in `signIn` mode). */
  onSignIn?: () => void;
  signInLabel?: string;

  /**
   * A notice slot, e.g. an error, an out-of-credits message with an upgrade CTA,
   * or a "credits spent" note after a failed-but-billed attempt. The host builds
   * it from `classifyGatewayError`; the panel just renders it
   */
  notice?: ReactNode;

  /** Bring-your-own-key section (a Synapse key, not a raw provider key). */
  byok?: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    value: string;
    onValueChange: (value: string) => void;
    /** Where to mint a key; rendered as a link when present. */
    keyUrl?: string;
    label?: string;
    placeholder?: string;
  };
}

/** A styled textarea matching the input primitive's tokens (Thornberry ships no textarea). */
const PromptTextarea = ({
  className,
  ...props
}: ComponentProps<"textarea">) => (
  <textarea
    className={cn(
      "flex min-h-24 w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
);

/**
 * Describe-to-draft panel: the shared "describe it in plain English, review the
 * draft" entry point for the fleet's AI-creation flow (Facet models, Fractal
 * services). Presentational only: the host injects generation, sign-in, and the
 * Synapse key state (typically from `@omnidotdev/providers/ai-client`), so this
 * owns no network, auth, or billing logic. A draft never auto-applies; the host
 * closes the panel and shows the result for review.
 */
const AiDescribePanel = ({
  open,
  onOpenChange,
  mode,
  title = "Describe it",
  description,
  prompt,
  onPromptChange,
  placeholder = "Describe what you want to build",
  suggestions,
  onPickSuggestion,
  onGenerate,
  isPending = false,
  generateLabel = "Generate",
  onSignIn,
  signInLabel = "Sign in",
  notice,
  byok,
}: AiDescribePanelProps) => {
  const showSuggestions =
    mode === "generate" &&
    prompt.trim().length === 0 &&
    suggestions &&
    suggestions.length > 0;

  const canGenerate = mode === "generate" && prompt.trim().length > 0;

  return (
    <DialogRoot
      open={open}
      onOpenChange={(details) => {
        if (!isPending) onOpenChange(details.open);
      }}
    >
      <DialogPortal>
        <DialogBackdrop />

        <DialogPositioner>
          <DialogContent>
            <div className="flex flex-col gap-1.5">
              <DialogTitle>{title}</DialogTitle>
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </div>

            {mode !== "needsKey" && (
              <div className="space-y-2">
                <PromptTextarea
                  value={prompt}
                  onChange={(event) => onPromptChange(event.target.value)}
                  onKeyDown={(event) => {
                    // Cmd/Ctrl+Enter submits, so the textarea keeps plain Enter
                    if (
                      (event.metaKey || event.ctrlKey) &&
                      event.key === "Enter" &&
                      canGenerate &&
                      !isPending
                    ) {
                      event.preventDefault();
                      onGenerate();
                    }
                  }}
                  placeholder={placeholder}
                  disabled={isPending || mode === "signIn"}
                  aria-label={title}
                />

                {showSuggestions && (
                  <div className="flex flex-wrap gap-2">
                    {suggestions?.map((suggestion) => (
                      <Button
                        key={suggestion}
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isPending}
                        onClick={() => onPickSuggestion?.(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {notice && <div className="text-muted-foreground text-sm">{notice}</div>}

            {byok && (
              <div className="space-y-2">
                <button
                  type="button"
                  className="cursor-pointer text-muted-foreground text-sm underline-offset-4 hover:underline"
                  onClick={() => byok.onOpenChange(!byok.open)}
                  aria-expanded={byok.open}
                >
                  {byok.label ?? "Use your own Synapse key"}
                </button>

                {byok.open && (
                  <div className="space-y-1.5">
                    <Label htmlFor="ai-byok-key">
                      {byok.label ?? "Synapse API key"}
                    </Label>
                    <PasswordInput
                      id="ai-byok-key"
                      value={byok.value}
                      onChange={(event) => byok.onValueChange(event.target.value)}
                      placeholder={byok.placeholder ?? "Synapse API key"}
                      autoComplete="off"
                      spellCheck={false}
                      disabled={isPending}
                    />
                    {byok.keyUrl && (
                      <p className="text-muted-foreground text-xs">
                        Need a key?{" "}
                        <a
                          href={byok.keyUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="underline underline-offset-4"
                        >
                          Create a Synapse key
                        </a>
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              {mode === "signIn" ? (
                <Button onClick={onSignIn} disabled={isPending || !onSignIn}>
                  {signInLabel}
                </Button>
              ) : (
                <Button
                  onClick={onGenerate}
                  disabled={isPending || !canGenerate}
                >
                  {isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    generateLabel
                  )}
                </Button>
              )}
            </div>
          </DialogContent>
        </DialogPositioner>
      </DialogPortal>
    </DialogRoot>
  );
};

export { AiDescribePanel };
