import {
  Button2
} from "../../../chunks/ai-describe-panel-h4yrvya3.js";
import {
  CardRoot2,
  CardHeader2,
  CardTitle2,
  CardContent2
} from "../../../chunks/ai-describe-panel-6x8c66n6.js";
import"../../../chunks/ai-describe-panel-6bn090ct.js";
import {
  Input2
} from "../../../chunks/ai-describe-panel-hj664zsh.js";
import {
  Label2
} from "../../../chunks/ai-describe-panel-fa46q8yp.js";
import {
  ConfirmDialog2
} from "../../../chunks/ai-describe-panel-jbj1fzyj.js";
import {
  ProgressRoot2,
  ProgressLabel2,
  ProgressTrack2,
  ProgressRange2
} from "../../../chunks/ai-describe-panel-ymknvxsd.js";
import {
  Skeleton2
} from "../../../chunks/ai-describe-panel-htat80e9.js";
import {
  cn
} from "../../../chunks/ai-describe-panel-81fr4sax.js";

// src/registry/thornberry/components/spending-limit-card.tsx
import { AlertTriangle } from "lucide-react";
import { useId, useState } from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
var MIN_SPENDING_LIMIT_CENTS = 1000;
var MAX_SPENDING_LIMIT_CENTS = 1e7;
var formatUsdCents = (cents) => (cents / 100).toLocaleString("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  maximumFractionDigits: 2
});
var parseDollars = (input) => {
  const trimmed = input.trim().replace(/^\$/, "").replaceAll(",", "");
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed))
    return null;
  return Math.round(Number(trimmed) * 100);
};
var parseSpendingLimitInput = (input, min = MIN_SPENDING_LIMIT_CENTS, max = MAX_SPENDING_LIMIT_CENTS) => {
  const cents = parseDollars(input);
  if (cents === null || cents < min || cents > max)
    return null;
  return cents;
};
var parseSoftLimitInput = (input, hardLimitCents) => {
  if (input.trim() === "")
    return null;
  const cents = parseDollars(input);
  if (cents === null || cents <= 0 || cents >= hardLimitCents)
    return;
  return cents;
};
var spendingLimitPercent = (currentSpendCents, hardLimitCents) => hardLimitCents && hardLimitCents > 0 ? Math.min(100, Math.round(currentSpendCents / hardLimitCents * 100)) : 0;
var pausesOnSave = (nextHardLimitCents, currentSpendCents) => currentSpendCents > 0 && nextHardLimitCents <= currentSpendCents;
var formatPeriodEnd = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime()))
    return null;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  });
};
var capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);
var saveErrorMessage = (err) => err instanceof Error && err.message ? err.message : "Couldn't save the spending limit. Try again.";
var SpendingLimitCard = ({
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
  className
}) => {
  const id = useId();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [softDraft, setSoftDraft] = useState("");
  const [pendingChange, setPendingChange] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
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
  const softCents = withSoftLimit && draftCents !== null ? parseSoftLimitInput(softDraft, draftCents) : null;
  const isUnchanged = draftCents === hardLimit && (!withSoftLimit || softCents === softLimit);
  const isValid = draftCents !== null && softCents !== undefined;
  const startEditing = () => {
    setDraft(hardLimit != null ? String(hardLimit / 100) : "");
    setSoftDraft(softLimit != null ? String(softLimit / 100) : "");
    setSaveError(null);
    setIsEditing(true);
  };
  const commit = async (change) => {
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
  const onSubmit = (event) => {
    event.preventDefault();
    if (draftCents === null || softCents === undefined || isUnchanged)
      return;
    const change = withSoftLimit ? { hardLimitCents: draftCents, softLimitCents: softCents } : { hardLimitCents: draftCents };
    if (pausesOnSave(draftCents, spend)) {
      setSaveError(null);
      setPendingChange(change);
      return;
    }
    commit(change);
  };
  const editLabel = hardLimit != null ? "Change limit" : "Set limit";
  const editButton = canEdit && value && !isEditing && /* @__PURE__ */ jsx(Button2, {
    variant: "outline",
    size: "sm",
    onClick: startEditing,
    "aria-label": variant === "row" ? `${editLabel} for ${productName}` : undefined,
    children: editLabel
  });
  const controls = (action || editButton) && /* @__PURE__ */ jsxs("div", {
    className: "flex flex-wrap items-center gap-2",
    children: [
      action,
      editButton
    ]
  });
  const amounts = /* @__PURE__ */ jsxs("span", {
    className: "text-foreground text-sm tabular-nums",
    children: [
      formatUsdCents(spend),
      hardLimit != null && ` of ${formatUsdCents(hardLimit)}`
    ]
  });
  const body = isLoading ? /* @__PURE__ */ jsxs("div", {
    className: "flex flex-col gap-2",
    "aria-busy": true,
    children: [
      /* @__PURE__ */ jsx(Skeleton2, {
        className: "h-4 w-full"
      }),
      /* @__PURE__ */ jsx(Skeleton2, {
        className: "h-2 w-full"
      })
    ]
  }) : error ? /* @__PURE__ */ jsx("p", {
    className: "text-destructive text-sm",
    children: error
  }) : !value ? /* @__PURE__ */ jsx("p", {
    className: "text-muted-foreground text-sm",
    children: emptyMessage
  }) : /* @__PURE__ */ jsxs("div", {
    className: "flex flex-col gap-1.5",
    children: [
      hardLimit != null ? /* @__PURE__ */ jsxs(ProgressRoot2, {
        value: percent,
        className: "gap-1.5",
        children: [
          /* @__PURE__ */ jsxs("div", {
            className: "flex flex-wrap items-center justify-between gap-x-2",
            children: [
              /* @__PURE__ */ jsx(ProgressLabel2, {
                className: "text-muted-foreground font-normal",
                children: "Overage this period"
              }),
              amounts
            ]
          }),
          /* @__PURE__ */ jsx(ProgressTrack2, {
            children: /* @__PURE__ */ jsx(ProgressRange2, {
              className: cn((percent >= 90 || value.suspended) && "bg-destructive")
            })
          })
        ]
      }) : /* @__PURE__ */ jsxs(Fragment, {
        children: [
          /* @__PURE__ */ jsxs("div", {
            className: "flex flex-wrap items-center justify-between gap-x-2",
            children: [
              /* @__PURE__ */ jsx("span", {
                className: "text-muted-foreground text-sm",
                children: "Overage this period"
              }),
              amounts
            ]
          }),
          /* @__PURE__ */ jsx("p", {
            className: "text-muted-foreground text-xs",
            children: "No limit set. Overage is not capped."
          })
        ]
      }),
      withSoftLimit && softLimit != null && /* @__PURE__ */ jsx("p", {
        className: "text-muted-foreground text-xs",
        children: `Alert email at ${formatUsdCents(softLimit)}.`
      }),
      periodEnd && /* @__PURE__ */ jsx("p", {
        className: "text-muted-foreground text-xs",
        children: `This period ends ${periodEnd}.`
      }),
      value.suspended && /* @__PURE__ */ jsxs("div", {
        role: "status",
        className: "border-destructive/50 bg-destructive/10 mt-1.5 flex items-start gap-2 rounded-lg border p-3 text-sm",
        children: [
          /* @__PURE__ */ jsx(AlertTriangle, {
            className: "text-destructive mt-0.5 size-4 shrink-0"
          }),
          /* @__PURE__ */ jsxs("p", {
            className: "text-foreground",
            children: [
              `The spending limit was reached, so ${pausedUsage} are paused. `,
              canEdit ? "Raise the limit to resume them now." : "Ask a workspace owner or admin to raise the limit."
            ]
          })
        ]
      })
    ]
  });
  const form = canEdit && value && isEditing && /* @__PURE__ */ jsxs("form", {
    method: "post",
    onSubmit,
    className: "flex flex-col gap-2",
    children: [
      /* @__PURE__ */ jsxs("div", {
        className: "flex flex-wrap items-end gap-3",
        children: [
          /* @__PURE__ */ jsxs("div", {
            className: "flex flex-col gap-1.5",
            children: [
              /* @__PURE__ */ jsx(Label2, {
                htmlFor: `${id}-hard`,
                children: "Monthly spending limit (USD)"
              }),
              /* @__PURE__ */ jsx(Input2, {
                id: `${id}-hard`,
                name: "hardLimit",
                inputMode: "decimal",
                autoComplete: "off",
                className: "w-40",
                placeholder: String(minCents / 100),
                value: draft,
                onChange: (event) => setDraft(event.target.value),
                "aria-invalid": draft !== "" && draftCents === null,
                "aria-describedby": saveError && !pendingChange ? `${hardHintId} ${saveErrorId}` : hardHintId,
                disabled: isSaving
              })
            ]
          }),
          withSoftLimit && /* @__PURE__ */ jsxs("div", {
            className: "flex flex-col gap-1.5",
            children: [
              /* @__PURE__ */ jsx(Label2, {
                htmlFor: `${id}-soft`,
                children: "Alert email at (USD)"
              }),
              /* @__PURE__ */ jsx(Input2, {
                id: `${id}-soft`,
                name: "softLimit",
                inputMode: "decimal",
                autoComplete: "off",
                className: "w-40",
                placeholder: "No extra alert",
                value: softDraft,
                onChange: (event) => setSoftDraft(event.target.value),
                "aria-invalid": softCents === undefined,
                "aria-describedby": softCents === undefined ? softErrorId : undefined,
                disabled: isSaving
              })
            ]
          }),
          /* @__PURE__ */ jsxs("div", {
            className: "flex flex-wrap gap-2",
            children: [
              /* @__PURE__ */ jsx(Button2, {
                type: "submit",
                disabled: !isValid || isUnchanged || isSaving,
                children: isSaving && !pendingChange ? "Saving..." : "Save limit"
              }),
              /* @__PURE__ */ jsx(Button2, {
                variant: "ghost",
                onClick: () => {
                  setIsEditing(false);
                  setSaveError(null);
                },
                disabled: isSaving,
                children: "Cancel"
              })
            ]
          })
        ]
      }),
      /* @__PURE__ */ jsx("p", {
        id: hardHintId,
        className: cn("text-xs", draft !== "" && draftCents === null ? "text-destructive" : "text-muted-foreground"),
        children: rangeHint
      }),
      softCents === undefined && /* @__PURE__ */ jsx("p", {
        id: softErrorId,
        className: "text-destructive text-xs",
        children: "Enter an alert amount below the spending limit, or leave it empty."
      }),
      saveError && !pendingChange && /* @__PURE__ */ jsx("p", {
        id: saveErrorId,
        role: "alert",
        className: "text-destructive text-xs",
        children: saveError
      })
    ]
  });
  const confirm = /* @__PURE__ */ jsx(ConfirmDialog2, {
    open: pendingChange !== null,
    onOpenChange: (open) => {
      if (!open) {
        setPendingChange(null);
        setSaveError(null);
      }
    },
    title: `Set the ${productName} spending limit to ${formatUsdCents(pendingChange?.hardLimitCents ?? 0)}?`,
    description: `This workspace has already spent ${formatUsdCents(spend)} on ${productName} overage this period, so this limit is reached as soon as you save it. ${capitalize(pausedUsage)} pause right away until the limit is raised or the next period starts.`,
    confirmLabel: "Set limit and pause",
    pendingLabel: "Saving...",
    isPending: isSaving,
    error: pendingChange ? saveError : undefined,
    onConfirm: () => {
      if (pendingChange)
        commit(pendingChange);
    }
  });
  const hint = !canEdit && value && /* @__PURE__ */ jsx("p", {
    className: "text-muted-foreground text-xs",
    children: readOnlyHint
  });
  if (variant === "row") {
    return /* @__PURE__ */ jsxs("div", {
      className: cn("flex flex-col gap-3 rounded-lg border p-4", className),
      children: [
        /* @__PURE__ */ jsxs("div", {
          className: "flex flex-wrap items-start justify-between gap-3",
          children: [
            /* @__PURE__ */ jsxs("div", {
              className: "flex flex-col gap-0.5",
              children: [
                /* @__PURE__ */ jsx("span", {
                  className: "text-sm font-medium",
                  children: title ?? productName
                }),
                meta && /* @__PURE__ */ jsx("span", {
                  className: "text-muted-foreground text-xs",
                  children: meta
                })
              ]
            }),
            controls
          ]
        }),
        body,
        form,
        hint,
        confirm
      ]
    });
  }
  return /* @__PURE__ */ jsxs(CardRoot2, {
    className,
    children: [
      /* @__PURE__ */ jsxs(CardHeader2, {
        className: "flex flex-row flex-wrap items-center justify-between gap-3",
        children: [
          /* @__PURE__ */ jsx(CardTitle2, {
            className: "text-base",
            children: title ?? "Spending limit"
          }),
          controls
        ]
      }),
      /* @__PURE__ */ jsxs(CardContent2, {
        className: "flex flex-col gap-4",
        children: [
          /* @__PURE__ */ jsx("p", {
            className: "text-muted-foreground text-sm",
            children: description ?? `Usage above your ${productName} plan's included amount is billed as overage. The spending limit caps that overage each billing period, and the workspace's billing email gets a warning at 75% and 90% of it. Once the limit is reached, ${pausedUsage} pause until it is raised or the next period starts.`
          }),
          body,
          form,
          hint
        ]
      }),
      confirm
    ]
  });
};
export {
  MAX_SPENDING_LIMIT_CENTS,
  MIN_SPENDING_LIMIT_CENTS,
  SpendingLimitCard,
  formatUsdCents,
  parseSoftLimitInput,
  parseSpendingLimitInput,
  pausesOnSave,
  spendingLimitPercent
};
