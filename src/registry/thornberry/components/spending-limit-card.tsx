import { AlertTriangle } from "lucide-react";
import { useId, useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/thornberry/components/button";
import {
  CardContent,
  CardHeader,
  CardRoot,
  CardTitle,
} from "@/registry/thornberry/components/card";
import { ConfirmDialog } from "@/registry/thornberry/components/confirm-dialog";
import { Input } from "@/registry/thornberry/components/input";
import { Label } from "@/registry/thornberry/components/label";
import {
  ProgressLabel,
  ProgressRange,
  ProgressRoot,
  ProgressTrack,
} from "@/registry/thornberry/components/progress";
import { Skeleton } from "@/registry/thornberry/components/skeleton";

import type { FormEvent, ReactNode } from "react";

/** Lowest hard limit Omni billing accepts ($10) */
const MIN_SPENDING_LIMIT_CENTS = 1_000;

/** Highest hard limit Omni billing accepts ($100,000) */
const MAX_SPENDING_LIMIT_CENTS = 10_000_000;

/** A product's spending limit for one workspace, as the product reports it */
interface SpendingLimitValue {
  /** Monthly cap on overage in cents, or null when none is set */
  hardLimitCents: number | null;
  /** Extra alert threshold in cents, or null when none is set */
  softLimitCents?: number | null;
  /** Overage accrued this billing period in cents */
  currentSpendCents: number;
  /** When the current billing period ends, when known */
  periodEnd?: string | Date | null;
  /** Whether usage past the plan's included amount is paused at the cap */
  suspended: boolean;
}

/** What the card asks the host to save */
interface SpendingLimitChange {
  hardLimitCents: number;
  /** Present only with `withSoftLimit`; null clears the alert */
  softLimitCents?: number | null;
}

/** Format cents as US dollars, dropping the cents when they are zero */
const formatUsdCents = (cents: number): string =>
  (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

/** Whole cents from a typed dollar amount (`80`, `$1,350`, `12.50`), or null */
const parseDollars = (input: string): number | null => {
  const trimmed = input.trim().replace(/^\$/, "").replaceAll(",", "");
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return null;

  return Math.round(Number(trimmed) * 100);
};

/**
 * Parse a spending limit typed by the user into whole cents, or `null` when it
 * is not a plain dollar amount within `min`..`max` cents
 */
const parseSpendingLimitInput = (
  input: string,
  min = MIN_SPENDING_LIMIT_CENTS,
  max = MAX_SPENDING_LIMIT_CENTS,
): number | null => {
  const cents = parseDollars(input);
  if (cents === null || cents < min || cents > max) return null;

  return cents;
};

/**
 * Parse an alert threshold: empty clears it (`null`), an amount above zero and
 * below the hard limit is kept, anything else is invalid (`undefined`)
 */
const parseSoftLimitInput = (
  input: string,
  hardLimitCents: number,
): number | null | undefined => {
  if (input.trim() === "") return null;

  const cents = parseDollars(input);
  if (cents === null || cents <= 0 || cents >= hardLimitCents) return undefined;

  return cents;
};

/** How full the limit is, 0 to 100, or 0 when no limit is set */
const spendingLimitPercent = (
  currentSpendCents: number,
  hardLimitCents: number | null,
): number =>
  hardLimitCents && hardLimitCents > 0
    ? Math.min(100, Math.round((currentSpendCents / hardLimitCents) * 100))
    : 0;

/**
 * Whether a new hard limit pauses usage the moment it is saved: a limit at or
 * below the overage already accrued this period is reached at once
 */
const pausesOnSave = (
  nextHardLimitCents: number,
  currentSpendCents: number,
): boolean => currentSpendCents > 0 && nextHardLimitCents <= currentSpendCents;

/** A period end as a short calendar date, like "Dec 1, 2026", or null */
const formatPeriodEnd = (value: string | Date): string | null => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
};

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

/** A save failure's message: the host throws user-safe errors */
const saveErrorMessage = (err: unknown): string =>
  err instanceof Error && err.message
    ? err.message
    : "Couldn't save the spending limit. Try again.";

interface SpendingLimitCardProps {
  /** Product the limit belongs to, e.g. "Fractal" */
  productName: string;
  /**
   * What pauses at the cap, as a plural noun phrase that reads after "so" and
   * before "pause" (e.g. "requests above your plan's included allowance")
   */
  pausedUsage: string;
  /** The current limit; null when the product reports none for this plan */
  value: SpendingLimitValue | null | undefined;
  /** Whether the viewer may change the limit (workspace owners and admins) */
  canEdit: boolean;
  /**
   * Save a new limit. Resolve to close the form; reject with a user-safe
   * Error to keep it open and show the message. Authorization stays on the
   * server: this only decides what the viewer is offered
   */
  onSave: (change: SpendingLimitChange) => Promise<unknown>;
  isLoading?: boolean;
  /** A failed load, shown in place of the limit */
  error?: ReactNode;
  /** `card` (a product's billing page) or `row` (one line of a list) */
  variant?: "card" | "row";
  /** Heading; "Spending limit" on a card, the product name on a row */
  title?: ReactNode;
  /** Secondary line under a row's heading, e.g. the plan */
  meta?: ReactNode;
  /** Explanation under a card's heading; a product-agnostic default */
  description?: ReactNode;
  /** Extra controls beside the edit button, e.g. a link to the product */
  action?: ReactNode;
  /** Also edit the alert threshold (`softLimitCents`) */
  withSoftLimit?: boolean;
  /** Shown to viewers who cannot edit */
  readOnlyHint?: ReactNode;
  /** Shown when `value` is null: the plan has no spending limit */
  emptyMessage?: ReactNode;
  minCents?: number;
  maxCents?: number;
  className?: string;
}

/**
 * A workspace's spending limit for one product: overage spent this billing
 * period against the monthly cap, when the period ends, and whether usage is
 * paused at the cap. Viewers who can edit set, raise, or lower the cap (there
 * is no way to remove one: raising it is the only opt-in to more spend), with
 * a confirmation before a cap at or below the spend so far pauses usage.
 * Presentational: the host fetches the value and saves through `onSave`
 */
const SpendingLimitCard = ({
  productName,
  pausedUsage,
  value,
  canEdit,
  onSave,
  isLoading = false,
  error,
  variant = "card",
  title,
  meta,
  description,
  action,
  withSoftLimit = false,
  readOnlyHint = "Only workspace owners and admins can change the spending limit.",
  emptyMessage = "No spending limit applies to this plan.",
  minCents = MIN_SPENDING_LIMIT_CENTS,
  maxCents = MAX_SPENDING_LIMIT_CENTS,
  className,
}: SpendingLimitCardProps) => {
  const id = useId();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [softDraft, setSoftDraft] = useState("");
  // the change awaiting confirmation because it pauses usage at once
  const [pendingChange, setPendingChange] =
    useState<SpendingLimitChange | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const hardLimit = value?.hardLimitCents ?? null;
  const softLimit = value?.softLimitCents ?? null;
  const spend = value?.currentSpendCents ?? 0;
  const percent = spendingLimitPercent(spend, hardLimit);
  const periodEnd = value?.periodEnd ? formatPeriodEnd(value.periodEnd) : null;
  const rangeHint = `Enter an amount from ${formatUsdCents(minCents)} to ${formatUsdCents(maxCents)}.`;
  const hardHintId = `${id}-hard-hint`;
  const softErrorId = `${id}-soft-error`;
  const saveErrorId = `${id}-save-error`;

  const draftCents = parseSpendingLimitInput(draft, minCents, maxCents);
  const softCents =
    withSoftLimit && draftCents !== null
      ? parseSoftLimitInput(softDraft, draftCents)
      : null;
  const isUnchanged =
    draftCents === hardLimit && (!withSoftLimit || softCents === softLimit);
  const isValid = draftCents !== null && softCents !== undefined;

  const startEditing = () => {
    setDraft(hardLimit != null ? String(hardLimit / 100) : "");
    setSoftDraft(softLimit != null ? String(softLimit / 100) : "");
    setSaveError(null);
    setIsEditing(true);
  };

  const commit = async (change: SpendingLimitChange) => {
    setIsSaving(true);
    setSaveError(null);
    try {
      await onSave(change);
      setPendingChange(null);
      setIsEditing(false);
    } catch (err) {
      setSaveError(saveErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (draftCents === null || softCents === undefined || isUnchanged) return;

    const change: SpendingLimitChange = withSoftLimit
      ? { hardLimitCents: draftCents, softLimitCents: softCents }
      : { hardLimitCents: draftCents };

    if (pausesOnSave(draftCents, spend)) {
      setSaveError(null);
      setPendingChange(change);
      return;
    }
    void commit(change);
  };

  const editLabel = hardLimit != null ? "Change limit" : "Set limit";

  // a row's accessible name starts with the visible text (WCAG 2.5.3) and
  // names the product so rows in a list stay distinguishable
  const editButton = canEdit && value && !isEditing && (
    <Button
      variant="outline"
      size="sm"
      onClick={startEditing}
      aria-label={
        variant === "row" ? `${editLabel} for ${productName}` : undefined
      }
    >
      {editLabel}
    </Button>
  );

  const controls = (action || editButton) && (
    <div className="flex flex-wrap items-center gap-2">
      {action}
      {editButton}
    </div>
  );

  const amounts = (
    <span className="text-foreground text-sm tabular-nums">
      {formatUsdCents(spend)}
      {hardLimit != null && ` of ${formatUsdCents(hardLimit)}`}
    </span>
  );

  const body = isLoading ? (
    <div className="flex flex-col gap-2" aria-busy>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-2 w-full" />
    </div>
  ) : error ? (
    <p className="text-destructive text-sm">{error}</p>
  ) : !value ? (
    <p className="text-muted-foreground text-sm">{emptyMessage}</p>
  ) : (
    <div className="flex flex-col gap-1.5">
      {hardLimit != null ? (
        <ProgressRoot value={percent} className="gap-1.5">
          <div className="flex flex-wrap items-center justify-between gap-x-2">
            <ProgressLabel className="text-muted-foreground font-normal">
              Overage this period
            </ProgressLabel>
            {amounts}
          </div>
          <ProgressTrack>
            <ProgressRange
              className={cn(
                (percent >= 90 || value.suspended) && "bg-destructive",
              )}
            />
          </ProgressTrack>
        </ProgressRoot>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-x-2">
            <span className="text-muted-foreground text-sm">
              Overage this period
            </span>
            {amounts}
          </div>
          <p className="text-muted-foreground text-xs">
            No limit set. Overage is not capped.
          </p>
        </>
      )}

      {withSoftLimit && softLimit != null && (
        <p className="text-muted-foreground text-xs">
          {`Alert email at ${formatUsdCents(softLimit)}.`}
        </p>
      )}
      {periodEnd && (
        <p className="text-muted-foreground text-xs">
          {`This period ends ${periodEnd}.`}
        </p>
      )}

      {value.suspended && (
        <div
          role="status"
          className="border-destructive/50 bg-destructive/10 mt-1.5 flex items-start gap-2 rounded-lg border p-3 text-sm"
        >
          <AlertTriangle className="text-destructive mt-0.5 size-4 shrink-0" />
          <p className="text-foreground">
            {`The spending limit was reached, so ${pausedUsage} are paused. `}
            {canEdit
              ? "Raise the limit to resume them now."
              : "Ask a workspace owner or admin to raise the limit."}
          </p>
        </div>
      )}
    </div>
  );

  const form = canEdit && value && isEditing && (
    <form method="post" onSubmit={onSubmit} className="flex flex-col gap-2">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-hard`}>Monthly spending limit (USD)</Label>
          <Input
            id={`${id}-hard`}
            name="hardLimit"
            inputMode="decimal"
            autoComplete="off"
            className="w-40"
            placeholder={String(minCents / 100)}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            aria-invalid={draft !== "" && draftCents === null}
            aria-describedby={
              saveError && !pendingChange
                ? `${hardHintId} ${saveErrorId}`
                : hardHintId
            }
            disabled={isSaving}
          />
        </div>
        {withSoftLimit && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-soft`}>Alert email at (USD)</Label>
            <Input
              id={`${id}-soft`}
              name="softLimit"
              inputMode="decimal"
              autoComplete="off"
              className="w-40"
              placeholder="No extra alert"
              value={softDraft}
              onChange={(event) => setSoftDraft(event.target.value)}
              aria-invalid={softCents === undefined}
              aria-describedby={
                softCents === undefined ? softErrorId : undefined
              }
              disabled={isSaving}
            />
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={!isValid || isUnchanged || isSaving}>
            {isSaving && !pendingChange ? "Saving..." : "Save limit"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setIsEditing(false);
              setSaveError(null);
            }}
            disabled={isSaving}
          >
            Cancel
          </Button>
        </div>
      </div>
      {/* the valid range stays visible, and turns into the error when the
          typed amount falls outside it */}
      <p
        id={hardHintId}
        className={cn(
          "text-xs",
          draft !== "" && draftCents === null
            ? "text-destructive"
            : "text-muted-foreground",
        )}
      >
        {rangeHint}
      </p>
      {softCents === undefined && (
        <p id={softErrorId} className="text-destructive text-xs">
          Enter an alert amount below the spending limit, or leave it empty.
        </p>
      )}
      {saveError && !pendingChange && (
        <p id={saveErrorId} role="alert" className="text-destructive text-xs">
          {saveError}
        </p>
      )}
    </form>
  );

  const confirm = (
    <ConfirmDialog
      open={pendingChange !== null}
      onOpenChange={(open) => {
        if (!open) {
          setPendingChange(null);
          setSaveError(null);
        }
      }}
      title={`Set the ${productName} spending limit to ${formatUsdCents(pendingChange?.hardLimitCents ?? 0)}?`}
      description={`This workspace has already spent ${formatUsdCents(spend)} on ${productName} overage this period, so this limit is reached as soon as you save it. ${capitalize(pausedUsage)} pause right away until the limit is raised or the next period starts.`}
      confirmLabel="Set limit and pause"
      pendingLabel="Saving..."
      isPending={isSaving}
      error={pendingChange ? saveError : undefined}
      onConfirm={() => {
        if (pendingChange) void commit(pendingChange);
      }}
    />
  );

  const hint = !canEdit && value && (
    <p className="text-muted-foreground text-xs">{readOnlyHint}</p>
  );

  if (variant === "row") {
    return (
      <div
        className={cn("flex flex-col gap-3 rounded-lg border p-4", className)}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">{title ?? productName}</span>
            {meta && (
              <span className="text-muted-foreground text-xs">{meta}</span>
            )}
          </div>
          {controls}
        </div>
        {body}
        {form}
        {hint}
        {confirm}
      </div>
    );
  }

  return (
    <CardRoot className={className}>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
        <CardTitle className="text-base">{title ?? "Spending limit"}</CardTitle>
        {controls}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-muted-foreground text-sm">
          {description ??
            `Usage above your ${productName} plan's included amount is billed as overage. The spending limit caps that overage each billing period, and the workspace's billing email gets a warning at 75% and 90% of it. Once the limit is reached, ${pausedUsage} pause until it is raised or the next period starts.`}
        </p>
        {body}
        {form}
        {hint}
      </CardContent>
      {confirm}
    </CardRoot>
  );
};

export type { SpendingLimitCardProps, SpendingLimitChange, SpendingLimitValue };
export {
  MAX_SPENDING_LIMIT_CENTS,
  MIN_SPENDING_LIMIT_CENTS,
  SpendingLimitCard,
  formatUsdCents,
  parseSoftLimitInput,
  parseSpendingLimitInput,
  pausesOnSave,
  spendingLimitPercent,
};
