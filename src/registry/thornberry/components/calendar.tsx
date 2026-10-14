import {
  DateFormatter,
  getLocalTimeZone,
  today,
} from "@internationalized/date";
import { buildMonthGrid } from "@omnidotdev/cadence";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

import type { CalendarDate } from "@internationalized/date";
import type { CalendarDay } from "@omnidotdev/cadence";
import type { ComponentProps, ReactNode } from "react";

/**
 * Presentational, drag-agnostic month/week calendar primitives shared across
 * apps. Like the board primitives, consumers render their own items and layer
 * interactivity (drag-to-reschedule via @hello-pangea/dnd) on top: day cells and
 * item chips carry `data-cadence-day` / `data-cadence-item` so a caller can make
 * a cell a droppable and a chip a draggable without the calendar importing a drag
 * library. Grid math and day bucketing live in @omnidotdev/cadence.
 */

const WEEKDAY_LABELS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

/** Weekday labels ordered for the given week start. */
const orderedWeekdays = (weekStartsOn: 0 | 1): readonly string[] =>
  weekStartsOn === 1
    ? [...WEEKDAY_LABELS.slice(1), WEEKDAY_LABELS[0]]
    : WEEKDAY_LABELS;

interface CalendarHeaderProps extends Omit<ComponentProps<"div">, "title"> {
  /** The period label, e.g. "October 2026". */
  title: ReactNode;
  /** Go to the previous period. */
  onPrevious?: () => void;
  /** Go to the next period. */
  onNext?: () => void;
  /** Jump back to the period containing today. */
  onToday?: () => void;
}

/** Period label plus previous / today / next navigation. */
const CalendarHeader = ({
  title,
  onPrevious,
  onNext,
  onToday,
  className,
  children,
  ...rest
}: CalendarHeaderProps) => (
  <div
    className={cn("flex items-center justify-between px-1 py-3", className)}
    {...rest}
  >
    <h2 className="font-semibold text-lg">{title}</h2>
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label="Previous"
        onClick={onPrevious}
        className="rounded-md p-1.5 hover:bg-muted"
      >
        <ChevronLeftIcon className="size-4" />
      </button>
      <button
        type="button"
        onClick={onToday}
        className="rounded-md border px-2 py-1 text-sm hover:bg-muted"
      >
        Today
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={onNext}
        className="rounded-md p-1.5 hover:bg-muted"
      >
        <ChevronRightIcon className="size-4" />
      </button>
      {children}
    </div>
  </div>
);

interface CalendarWeekdaysProps extends ComponentProps<"div"> {
  /** 0 = Sunday (default), 1 = Monday. */
  weekStartsOn?: 0 | 1;
}

/** The weekday header row, ordered for the given week start. */
const CalendarWeekdays = ({
  weekStartsOn = 0,
  className,
  ...rest
}: CalendarWeekdaysProps) => (
  <div
    className={cn("grid grid-cols-7 border-border border-b", className)}
    {...rest}
  >
    {orderedWeekdays(weekStartsOn).map((day) => (
      <div
        key={day}
        className="px-2 py-1 text-center font-medium text-muted-foreground text-xs"
      >
        {day}
      </div>
    ))}
  </div>
);

/** The seven-column grid surface holding day cells. */
const CalendarGrid = ({ className, ...rest }: ComponentProps<"div">) => (
  <div className={cn("grid grid-cols-7", className)} {...rest} />
);

interface CalendarDayCellProps extends ComponentProps<"div"> {
  /** The day this cell represents. */
  day: CalendarDay;
  /** Whether a draggable is currently hovering over this cell. */
  isOver?: boolean;
}

/**
 * A single day cell: a day-of-month badge (highlighted when today) over a slot
 * for the day's items. Carries `data-cadence-day` so a caller can wrap it as a
 * droppable keyed by the day key.
 */
const CalendarDayCell = ({
  day,
  isOver,
  className,
  children,
  ...rest
}: CalendarDayCellProps) => (
  <div
    data-cadence-day={day.key}
    className={cn(
      "flex min-h-24 flex-col border-border border-r border-b p-1",
      !day.inMonth && "bg-muted/30 text-muted-foreground",
      isOver && "bg-accent/40",
      className,
    )}
    {...rest}
  >
    <span
      className={cn(
        "inline-flex size-6 items-center justify-center self-start text-xs",
        day.isToday &&
          "rounded-full bg-primary font-semibold text-primary-foreground",
      )}
    >
      {day.dayOfMonth}
    </span>
    <div className="mt-1 flex flex-col gap-1 overflow-hidden">{children}</div>
  </div>
);

interface CalendarItemChipProps extends ComponentProps<"button"> {
  /** Whether this chip is currently being dragged. */
  isDragging?: boolean;
}

/**
 * A compact item chip for a calendar cell. Carries `data-cadence-item` so a
 * caller can wrap it as a draggable.
 */
const CalendarItemChip = ({
  isDragging,
  className,
  type,
  ...rest
}: CalendarItemChipProps) => (
  <button
    // biome-ignore lint/a11y/useButtonType: type is forwarded from the caller, defaulting to button
    type={type ?? "button"}
    data-cadence-item
    className={cn(
      "truncate rounded bg-accent px-1.5 py-0.5 text-left text-xs hover:bg-accent/80",
      isDragging && "shadow-lg ring-1 ring-primary",
      className,
    )}
    {...rest}
  />
);

interface UseCalendarMonthOptions {
  /** Month to open on (defaults to the current month). */
  initialMonth?: CalendarDate;
  /** 0 = Sunday (default), 1 = Monday. */
  weekStartsOn?: 0 | 1;
  /** Time zone used to resolve "today" and format the label. */
  timeZone?: string;
}

/**
 * View-state for a month calendar: the viewed month, its 6x7 grid (from
 * @omnidotdev/cadence), a formatted label, and navigation. The grid marks
 * `isToday` against the resolved zone, so rendering stays deterministic.
 */
const useCalendarMonth = ({
  initialMonth,
  weekStartsOn = 0,
  timeZone = getLocalTimeZone(),
}: UseCalendarMonthOptions = {}) => {
  const [month, setMonth] = useState<CalendarDate>(
    () => initialMonth ?? today(timeZone).set({ day: 1 }),
  );

  const grid = useMemo(
    () => buildMonthGrid(month, { weekStartsOn, today: today(timeZone) }),
    [month, weekStartsOn, timeZone],
  );

  const label = useMemo(
    () =>
      new DateFormatter("en-US", {
        month: "long",
        year: "numeric",
      }).format(month.toDate(timeZone)),
    [month, timeZone],
  );

  const goToPrevious = useCallback(
    () => setMonth((current) => current.subtract({ months: 1 })),
    [],
  );
  const goToNext = useCallback(
    () => setMonth((current) => current.add({ months: 1 })),
    [],
  );
  const goToToday = useCallback(
    () => setMonth(today(timeZone).set({ day: 1 })),
    [timeZone],
  );

  return { month, grid, label, goToPrevious, goToNext, goToToday, setMonth };
};

export {
  CalendarHeader,
  CalendarWeekdays,
  CalendarGrid,
  CalendarDayCell,
  CalendarItemChip,
  useCalendarMonth,
};
