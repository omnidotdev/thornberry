import { cn } from "@/lib/utils";

import type { ComponentProps, ReactNode } from "react";

/**
 * Presentational kanban/board primitives. A drag-agnostic shell shared across
 * apps: consumers render their own data (e.g. feedback posts grouped by status,
 * or tasks grouped by column) and layer interactivity (drag-and-drop) on top via
 * the slots. Keeps board layout/styling in one place instead of each app
 * rebuilding it.
 */

/** Horizontal board surface: columns scroll sideways on desktop, stack on mobile. */
const Board = ({ className, ...rest }: ComponentProps<"div">) => (
  <div
    className={cn(
      "-mx-1 flex flex-col gap-4 px-1 pb-4 sm:flex-row sm:items-start sm:gap-4 sm:overflow-x-auto",
      className,
    )}
    {...rest}
  />
);

/** A single column panel. */
const BoardColumn = ({ className, ...rest }: ComponentProps<"div">) => (
  <div
    className={cn(
      "flex w-full flex-col rounded-xl border border-border-subtle bg-[var(--colors-background-subtle)] sm:w-80 sm:shrink-0",
      className,
    )}
    {...rest}
  />
);

interface BoardColumnHeaderProps extends Omit<ComponentProps<"div">, "title"> {
  /** Column title. */
  title: ReactNode;
  /** Dot color (hex/token); ignored when `icon` is provided. */
  color?: string | null;
  /** Leading icon, replacing the color dot. */
  icon?: ReactNode;
  /** Item count shown as a trailing pill. */
  count?: number;
}

/** Column header: a color dot (or icon) + truncated title + optional count pill. */
const BoardColumnHeader = ({
  title,
  color,
  icon,
  count,
  className,
  children,
  ...rest
}: BoardColumnHeaderProps) => (
  <div
    className={cn(
      "flex items-center justify-between gap-2 px-3 py-2.5",
      className,
    )}
    {...rest}
  >
    <div className="flex min-w-0 items-center gap-2">
      {icon ?? (
        <span
          className="size-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: color ?? "var(--colors-neutral-400)" }}
        />
      )}
      <span className="truncate font-semibold text-foreground text-sm">
        {title}
      </span>
    </div>

    {count != null && (
      <span className="shrink-0 rounded-full bg-[var(--colors-card-item)] px-2 py-0.5 font-medium text-foreground-subtle text-xs tabular-nums">
        {count}
      </span>
    )}

    {children}
  </div>
);

/** Column body: holds the cards (or an empty state). */
const BoardColumnBody = ({ className, ...rest }: ComponentProps<"div">) => (
  <div className={cn("flex flex-col gap-2 px-2 pb-2", className)} {...rest} />
);

/** Empty-state placeholder for a column with no items. */
const BoardColumnEmpty = ({ className, ...rest }: ComponentProps<"p">) => (
  <p
    className={cn(
      "rounded-lg border border-border-subtle border-dashed px-3 py-8 text-center text-foreground-subtle text-xs",
      className,
    )}
    {...rest}
  />
);

export {
  Board,
  BoardColumn,
  BoardColumnHeader,
  BoardColumnBody,
  BoardColumnEmpty,
};
