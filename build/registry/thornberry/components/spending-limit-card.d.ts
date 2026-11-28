import type { ReactNode } from "react";
/** Lowest hard limit Omni billing accepts ($10) */
declare const MIN_SPENDING_LIMIT_CENTS = 1000;
/** Highest hard limit Omni billing accepts ($100,000) */
declare const MAX_SPENDING_LIMIT_CENTS = 10000000;
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
declare const formatUsdCents: (cents: number) => string;
/**
 * Parse a spending limit typed by the user into whole cents, or `null` when it
 * is not a plain dollar amount within `min`..`max` cents
 */
declare const parseSpendingLimitInput: (input: string, min?: number, max?: number) => number | null;
/**
 * Parse an alert threshold: empty clears it (`null`), an amount above zero and
 * below the hard limit is kept, anything else is invalid (`undefined`)
 */
declare const parseSoftLimitInput: (input: string, hardLimitCents: number) => number | null | undefined;
/** How full the limit is, 0 to 100, or 0 when no limit is set */
declare const spendingLimitPercent: (currentSpendCents: number, hardLimitCents: number | null) => number;
/**
 * Whether a new hard limit pauses usage the moment it is saved: a limit at or
 * below the overage already accrued this period is reached at once
 */
declare const pausesOnSave: (nextHardLimitCents: number, currentSpendCents: number) => boolean;
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
declare const SpendingLimitCard: ({ productName, pausedUsage, value, canEdit, onSave, isLoading, error, variant, title, meta, description, action, withSoftLimit, readOnlyHint, emptyMessage, minCents, maxCents, className, }: SpendingLimitCardProps) => import("react/jsx-runtime").JSX.Element;
export type { SpendingLimitCardProps, SpendingLimitChange, SpendingLimitValue };
export { MAX_SPENDING_LIMIT_CENTS, MIN_SPENDING_LIMIT_CENTS, SpendingLimitCard, formatUsdCents, parseSoftLimitInput, parseSpendingLimitInput, pausesOnSave, spendingLimitPercent, };
