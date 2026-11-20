import type { ZonedDateTime } from "@internationalized/date";
import type { ComponentProps, ReactNode } from "react";
/**
 * A point in time: an ISO 8601 string with an offset (or `Z`), or a `Date`. A
 * string without an offset (`"2026-11-20T12:00"`, or a date alone) is read as
 * wall-clock time in the picker's time zone
 */
type DateTimeValue = string | Date;
/** A wall-clock time of day */
interface TimeOfDay {
    hour: number;
    minute: number;
}
/** Why the entered date and time is not a usable value */
type DateTimePickerError = "invalid-time" | "before-min" | "after-max";
/** What `onValueChange` reports */
interface DateTimePickerValueChangeDetails {
    /**
     * The chosen moment as ISO 8601 with the zone's offset, e.g.
     * `"2026-11-20T09:30:00-05:00"`. Null until both a date and a time are
     * entered, and while the entry is invalid or out of range
     */
    value: string | null;
    /** The same moment as a `Date`, or null */
    date: Date | null;
    /** IANA time zone the date and time were entered in */
    timeZone: string;
    /** Why `value` is null despite an entry, or null */
    error: DateTimePickerError | null;
}
/** The browser's IANA time zone, e.g. `"America/New_York"` */
declare const getBrowserTimeZone: () => string;
/** Format a UTC offset in milliseconds as `+hh:mm` / `-hh:mm` */
declare const formatOffset: (offsetMs: number) => string;
/** ISO 8601 with the zone's offset, e.g. `"2026-07-04T10:15:00-04:00"` */
declare const toIsoWithOffset: (value: ZonedDateTime) => string;
/**
 * Read a point in time into the given zone, or null when it is not one. A
 * string without an offset is wall-clock time in `timeZone`
 */
declare const toZonedDateTime: (value: DateTimeValue | null | undefined, timeZone: string) => ZonedDateTime | null;
/** Replace localized decimal digits with ASCII 0-9 */
declare const normalizeDigits: (text: string) => string;
/**
 * Parse a typed time leniently: the locale's own format (so a formatted time
 * always reads back, in any script), then common English forms (`9`, `9:30`,
 * `930`, `9:30pm`, `9.30 p.m.`, `21:30`). Returns null when it is not a time
 * of day
 */
declare const parseTimeInput: (text: string, locale?: string) => TimeOfDay | null;
/** Format a time of day for the locale, e.g. `"9:30 AM"` or `"09:30"` */
declare const formatTime: (time: TimeOfDay, locale?: string) => string;
/** E.g. `"Eastern Standard Time (America/New_York, GMT-05:00)"`, using the offset in effect at `at` */
declare const describeTimeZone: (timeZone: string, at: Date, locale?: string) => string;
interface DateTimePickerProps extends Omit<ComponentProps<"div">, "defaultValue" | "onChange"> {
    /** The chosen moment (controlled). Null clears it */
    value?: DateTimeValue | null;
    /** The initial moment (uncontrolled) */
    defaultValue?: DateTimeValue | null;
    /** Called when the entry changes; `value` is ISO 8601 with offset, or null */
    onValueChange?: (details: DateTimePickerValueChangeDetails) => void;
    /**
     * IANA time zone the date and time are entered in. Defaults to the
     * browser's. Changing it keeps the same moment (the shown date and time move
     * to the new zone) and reports the value again with the new offset
     */
    timeZone?: string;
    /**
     * Earliest allowed moment. `"now"` checks against the current time whenever
     * the entry changes, so a form left open never accepts a time that has passed
     */
    minValue?: DateTimeValue | "now";
    /** Latest allowed moment */
    maxValue?: DateTimeValue;
    /** Minutes between suggested times. Defaults to 15 */
    stepMinutes?: number;
    /** Time filled in when a date is picked first, as `HH:mm`. Defaults to `"09:00"` */
    defaultTime?: string;
    /** Visible label for the whole control. Defaults to "Date and time" */
    label?: ReactNode;
    /** Help text under the label */
    description?: ReactNode;
    /** BCP 47 locale for formatting and parsing. Defaults to the browser's */
    locale?: string;
    disabled?: boolean;
    required?: boolean;
    /** Form field name; submits the ISO value through a hidden input */
    name?: string;
}
/**
 * Pick a date and a time of day in an explicit time zone, e.g. when to send a
 * scheduled email. The date has a calendar and accepts typing; the time accepts
 * free typing (`9:30`, `2:15pm`, `14:15`, or the locale's own format) with
 * suggestions every `stepMinutes`, and the arrow keys step it. The zone is
 * always shown, and daylight saving changes are explained when they affect the
 * chosen time. Reports an ISO 8601 string with offset, so the moment is
 * unambiguous wherever it is read
 *
 * @example
 * <DateTimePicker
 *   label="Send at"
 *   minValue="now"
 *   onValueChange={({ value }) => setSendAt(value)}
 * />
 */
declare const DateTimePicker: ({ value, defaultValue, onValueChange, timeZone: timeZoneProp, minValue, maxValue, stepMinutes, defaultTime, label, description, locale, disabled, required, name, id: idProp, className, ...rest }: DateTimePickerProps) => import("react/jsx-runtime").JSX.Element;
export type { DateTimePickerError, DateTimePickerProps, DateTimePickerValueChangeDetails, DateTimeValue, TimeOfDay, };
export { DateTimePicker, describeTimeZone, formatOffset, formatTime, getBrowserTimeZone, normalizeDigits, parseTimeInput, toIsoWithOffset, toZonedDateTime, };
export default DateTimePicker;
