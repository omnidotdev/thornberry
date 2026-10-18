import type { CalendarDate } from "@internationalized/date";
import type { CalendarDay } from "@omnidotdev/cadence";
import type { ComponentProps, ReactNode } from "react";
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
declare const CalendarHeader: ({ title, onPrevious, onNext, onToday, className, children, ...rest }: CalendarHeaderProps) => import("react/jsx-runtime").JSX.Element;
interface CalendarWeekdaysProps extends ComponentProps<"div"> {
    /** 0 = Sunday (default), 1 = Monday. */
    weekStartsOn?: 0 | 1;
}
/** The weekday header row, ordered for the given week start. */
declare const CalendarWeekdays: ({ weekStartsOn, className, ...rest }: CalendarWeekdaysProps) => import("react/jsx-runtime").JSX.Element;
/** The seven-column grid surface holding day cells. */
declare const CalendarGrid: ({ className, ...rest }: ComponentProps<"div">) => import("react/jsx-runtime").JSX.Element;
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
declare const CalendarDayCell: ({ day, isOver, className, children, ...rest }: CalendarDayCellProps) => import("react/jsx-runtime").JSX.Element;
/**
 * A chip's background tint. Consumers map their own domain onto a tone (e.g. a
 * task priority -> danger/warning/success) so the chip stays domain-agnostic.
 */
export type CalendarItemTone = "neutral" | "danger" | "warning" | "success" | "info";
interface CalendarItemChipProps extends ComponentProps<"button"> {
    /** Whether this chip is currently being dragged. */
    isDragging?: boolean;
    /** Soft background tint; map a domain concept (e.g. priority) onto it. */
    tone?: CalendarItemTone;
    /** Leading color dots (CSS color strings), e.g. label colors. Capped at 3. */
    dots?: readonly string[];
}
/**
 * A compact item chip for a calendar cell: an optional priority-style tint, up
 * to three leading color dots (e.g. labels), then the truncated content.
 * Carries `data-cadence-item` so a caller can wrap it as a draggable.
 */
declare const CalendarItemChip: ({ isDragging, tone, dots, className, type, children, ...rest }: CalendarItemChipProps) => import("react/jsx-runtime").JSX.Element;
interface CalendarMoreToggleProps extends ComponentProps<"button"> {
    /** How many items are hidden behind the toggle. */
    hiddenCount: number;
    /** Whether the day is currently expanded. */
    isExpanded: boolean;
}
/**
 * The "+N more" / "Show less" control for a day cell with more items than it
 * shows by default. Pair with {@link useDayOverflow}.
 */
declare const CalendarMoreToggle: ({ hiddenCount, isExpanded, className, type, ...rest }: CalendarMoreToggleProps) => import("react/jsx-runtime").JSX.Element;
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
declare const useCalendarMonth: ({ initialMonth, weekStartsOn, timeZone, }?: UseCalendarMonthOptions) => {
    month: CalendarDate;
    grid: CalendarDay[][];
    label: string;
    goToPrevious: () => void;
    goToNext: () => void;
    goToToday: () => void;
    setMonth: import("react").Dispatch<import("react").SetStateAction<CalendarDate>>;
};
interface UseDayOverflowOptions {
    /** Total number of items for the day. */
    count: number;
    /** How many to show before collapsing the rest (default 3). */
    maxVisible?: number;
}
/**
 * Per-cell overflow state: how many items to render, how many are hidden, and a
 * toggle to expand/collapse. Keeps a busy day from stretching its grid row -
 * slice your items to `visibleCount`, render them, then render a
 * {@link CalendarMoreToggle} when `hasOverflow`. Call once per day cell (e.g.
 * from a per-day component), not inside a loop.
 */
declare const useDayOverflow: ({ count, maxVisible }: UseDayOverflowOptions) => {
    visibleCount: number;
    hiddenCount: number;
    hasOverflow: boolean;
    isExpanded: boolean;
    toggle: () => void;
};
export { CalendarHeader, CalendarWeekdays, CalendarGrid, CalendarDayCell, CalendarItemChip, CalendarMoreToggle, useCalendarMonth, useDayOverflow, };
