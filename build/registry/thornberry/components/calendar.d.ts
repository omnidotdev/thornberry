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
interface CalendarItemChipProps extends ComponentProps<"button"> {
    /** Whether this chip is currently being dragged. */
    isDragging?: boolean;
}
/**
 * A compact item chip for a calendar cell. Carries `data-cadence-item` so a
 * caller can wrap it as a draggable.
 */
declare const CalendarItemChip: ({ isDragging, className, type, ...rest }: CalendarItemChipProps) => import("react/jsx-runtime").JSX.Element;
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
export { CalendarHeader, CalendarWeekdays, CalendarGrid, CalendarDayCell, CalendarItemChip, useCalendarMonth, };
