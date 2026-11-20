"use client";

import {
  CalendarDateTime,
  fromDate,
  now,
  parseAbsolute,
  parseDate,
  parseDateTime,
  toCalendarDate,
  toZoned,
} from "@internationalized/date";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { cn } from "@/lib/utils";
import {
  DatePickerContent,
  DatePickerContext,
  DatePickerControl,
  DatePickerInput,
  DatePickerLabel,
  DatePickerNextTrigger,
  DatePickerPositioner,
  DatePickerPrevTrigger,
  DatePickerRangeText,
  DatePickerRoot,
  DatePickerTable,
  DatePickerTableBody,
  DatePickerTableCell,
  DatePickerTableCellTrigger,
  DatePickerTableHead,
  DatePickerTableHeader,
  DatePickerTableRow,
  DatePickerTrigger,
  DatePickerView,
  DatePickerViewControl,
} from "@/registry/thornberry/components/date-picker";

import type {
  CalendarDate,
  DateValue,
  ZonedDateTime,
} from "@internationalized/date";
import type {
  ChangeEvent,
  ComponentProps,
  KeyboardEvent,
  ReactNode,
} from "react";

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

const MINUTES_PER_DAY = 24 * 60;

/** The browser's IANA time zone, e.g. `"America/New_York"` */
const getBrowserTimeZone = (): string =>
  Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

const pad = (value: number, length = 2) =>
  String(Math.abs(value)).padStart(length, "0");

/** Format a UTC offset in milliseconds as `+hh:mm` / `-hh:mm` */
const formatOffset = (offsetMs: number): string => {
  const totalMinutes = Math.round(offsetMs / 60000);
  const sign = totalMinutes < 0 ? "-" : "+";
  const abs = Math.abs(totalMinutes);
  return `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
};

/** ISO 8601 with the zone's offset, e.g. `"2026-07-04T10:15:00-04:00"` */
const toIsoWithOffset = (value: ZonedDateTime): string =>
  `${pad(value.year, 4)}-${pad(value.month)}-${pad(value.day)}T${pad(value.hour)}:${pad(value.minute)}:${pad(value.second)}${formatOffset(value.offset)}`;

const isDevelopment = () =>
  (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env
    ?.NODE_ENV !== "production";
const warnedOffsetless = new Set<string>();

/**
 * Read a point in time into the given zone, or null when it is not one. A
 * string without an offset is wall-clock time in `timeZone`
 */
const toZonedDateTime = (
  value: DateTimeValue | null | undefined,
  timeZone: string,
): ZonedDateTime | null => {
  if (value == null || value === "") return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : fromDate(value, timeZone);
  }
  try {
    return parseAbsolute(value, timeZone);
  } catch {
    // no offset: fall through to wall-clock time in the zone
  }
  let wall: CalendarDateTime | null = null;
  try {
    wall = parseDateTime(value);
  } catch {
    try {
      const day = parseDate(value);
      wall = new CalendarDateTime(day.year, day.month, day.day);
    } catch {
      return null;
    }
  }
  if (isDevelopment() && !warnedOffsetless.has(value)) {
    warnedOffsetless.add(value);
    console.warn(
      `DateTimePicker: "${value}" has no UTC offset, so it is read in ${timeZone}. Pass an offset (or a Date) to name an exact moment.`,
    );
  }
  return toZoned(wall, timeZone, "compatible");
};

/** The wall-clock date and time in `timeZone` as a zoned moment */
const composeDateTime = (
  date: CalendarDate,
  time: TimeOfDay,
  timeZone: string,
  disambiguation: "compatible" | "earlier" | "later" = "compatible",
): ZonedDateTime =>
  toZoned(
    new CalendarDateTime(
      date.year,
      date.month,
      date.day,
      time.hour,
      time.minute,
    ),
    timeZone,
    disambiguation,
  );

/** How a wall-clock time fares on a date with a daylight saving change */
type WallTimeCheck =
  | { kind: "ok" }
  /** The clocks skip this time; `resolved` is the time it moves forward to */
  | { kind: "gap"; resolved: TimeOfDay }
  /** The clocks pass this time twice */
  | { kind: "ambiguous"; earlier: ZonedDateTime; later: ZonedDateTime };

const checkWallTime = (
  date: CalendarDate,
  time: TimeOfDay,
  timeZone: string,
): WallTimeCheck => {
  const compatible = composeDateTime(date, time, timeZone);
  if (compatible.hour !== time.hour || compatible.minute !== time.minute) {
    return {
      kind: "gap",
      resolved: { hour: compatible.hour, minute: compatible.minute },
    };
  }
  const earlier = composeDateTime(date, time, timeZone, "earlier");
  const later = composeDateTime(date, time, timeZone, "later");
  return earlier.offset === later.offset
    ? { kind: "ok" }
    : { kind: "ambiguous", earlier, later };
};

// zero code points of decimal digit sets, so localized digits (Arabic-Indic,
// Persian, Devanagari, Bengali, Thai, fullwidth, ...) read as 0-9
const DIGIT_ZEROS = [
  0x0660, 0x06f0, 0x07c0, 0x0966, 0x09e6, 0x0a66, 0x0ae6, 0x0b66, 0x0be6,
  0x0c66, 0x0ce6, 0x0d66, 0x0de6, 0x0e50, 0x0ed0, 0x0f20, 0x1040, 0x1090,
  0x17e0, 0x1810, 0xff10,
];

/** Replace localized decimal digits with ASCII 0-9 */
const normalizeDigits = (text: string): string =>
  text.replace(/\p{Nd}/gu, (char) => {
    const code = char.codePointAt(0) ?? 0;
    const zero = DIGIT_ZEROS.find((z) => code >= z && code <= z + 9);
    return zero === undefined ? char : String(code - zero);
  });

// spaces (including narrow no-break), dots, and bidi marks carry no meaning
const compact = (text: string) =>
  normalizeDigits(text).toLowerCase().replace(/[\s.‎‏؜]/g, "");

const dayPeriodCache = new Map<
  string,
  { am: string | null; pm: string | null }
>();

/** The locale's AM and PM markers, compacted, or nulls for 24-hour locales */
const dayPeriodLabels = (
  locale?: string,
): { am: string | null; pm: string | null } => {
  const cacheKey = locale ?? "";
  const cached = dayPeriodCache.get(cacheKey);
  if (cached) return cached;
  const label = (hour: number) => {
    const part = new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      timeZone: "UTC",
    })
      .formatToParts(Date.UTC(2000, 0, 1, hour))
      .find((p) => p.type === "dayPeriod")?.value;
    return part ? compact(part) || null : null;
  };
  const labels = { am: label(9), pm: label(21) };
  dayPeriodCache.set(cacheKey, labels);
  return labels;
};

// locales whose AM/PM markers are also recognized whatever the active locale,
// so a time pasted from elsewhere still reads
const FALLBACK_LOCALES = ["ko", "zh", "ja", "ar", "fa", "hi", "bn", "th"];

/** Turn hour and minute digit groups plus an optional meridiem into a time */
const toTimeOfDay = (
  hourDigits: string,
  minuteDigits: string | undefined,
  meridiem: "am" | "pm" | null,
): TimeOfDay | null => {
  let hours = hourDigits;
  let minutes = minuteDigits;
  if (minutes === undefined && hours.length > 2) {
    minutes = hours.slice(-2);
    hours = hours.slice(0, -2);
  }
  if (!hours || hours.length > 2) return null;
  if (minutes !== undefined && minutes.length !== 2) return null;
  let hour = Number(hours);
  const minute = Number(minutes ?? "0");
  if (minute > 59) return null;
  if (meridiem) {
    if (hour < 1 || hour > 12) return null;
    if (hour === 12) hour = meridiem === "pm" ? 12 : 0;
    else if (meridiem === "pm") hour += 12;
  } else if (hour > 23) {
    return null;
  }
  return { hour, minute };
};

/** Parse a time written the way `locale` formats times (its digits and AM/PM markers) */
const parseLocalizedTime = (
  text: string,
  locale?: string,
): TimeOfDay | null => {
  let rest = compact(text);
  if (!rest) return null;
  const { am, pm } = dayPeriodLabels(locale);
  let meridiem: "am" | "pm" | null = null;
  if (pm && rest.includes(pm)) {
    meridiem = "pm";
    rest = rest.replace(pm, "");
  } else if (am && rest.includes(am)) {
    meridiem = "am";
    rest = rest.replace(am, "");
  }
  const groups = rest.match(/\d+/g) ?? [];
  // anything left besides digits and separators (or an "h") is not a time
  const leftover = rest.replace(/\d+/g, "").replace(/h/g, "");
  if (!groups.length || groups.length > 2 || /[\p{L}\p{N}]/u.test(leftover)) {
    return null;
  }
  return toTimeOfDay(groups[0] ?? "", groups[1], meridiem);
};

/** Parse common English forms: `9`, `9:30`, `930`, `9:30pm`, `9.30 p.m.`, `21:30` */
const parseEnglishTime = (text: string): TimeOfDay | null => {
  const cleaned = compact(text);
  const match = /^(\d{1,4})(?:[:h](\d{2}))?(am|pm|a|p)?$/.exec(cleaned);
  if (!match) return null;
  const meridiem = match[3] ? (match[3].startsWith("p") ? "pm" : "am") : null;
  return toTimeOfDay(match[1] ?? "", match[2], meridiem);
};

/**
 * Parse a typed time leniently: the locale's own format (so a formatted time
 * always reads back, in any script), then common English forms (`9`, `9:30`,
 * `930`, `9:30pm`, `9.30 p.m.`, `21:30`). Returns null when it is not a time
 * of day
 */
const parseTimeInput = (text: string, locale?: string): TimeOfDay | null => {
  const local = parseLocalizedTime(text, locale) ?? parseEnglishTime(text);
  if (local) return local;
  for (const fallback of FALLBACK_LOCALES) {
    const parsed = parseLocalizedTime(text, fallback);
    if (parsed) return parsed;
  }
  return null;
};

/** Format a time of day for the locale, e.g. `"9:30 AM"` or `"09:30"` */
const formatTime = (time: TimeOfDay, locale?: string): string =>
  new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(Date.UTC(2000, 0, 1, time.hour, time.minute));

/** E.g. `"Eastern Standard Time (America/New_York, GMT-05:00)"`, using the offset in effect at `at` */
const describeTimeZone = (
  timeZone: string,
  at: Date,
  locale?: string,
): string => {
  const part = (style: Intl.DateTimeFormatOptions["timeZoneName"]) =>
    new Intl.DateTimeFormat(locale, { timeZone, timeZoneName: style })
      .formatToParts(at)
      .find((p) => p.type === "timeZoneName")?.value;
  const name = part("long");
  const offset = part("longOffset");
  const detail = [timeZone, offset].filter(Boolean).join(", ");
  return name && name !== timeZone ? `${name} (${detail})` : detail;
};

const formatMoment = (value: ZonedDateTime, locale?: string): string =>
  new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: value.timeZone,
  }).format(value.toDate());

const minutesOf = (time: TimeOfDay) => time.hour * 60 + time.minute;
const fromMinutes = (minutes: number): TimeOfDay => {
  const wrapped =
    ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  return { hour: Math.floor(wrapped / 60), minute: wrapped % 60 };
};

/** The first whole minute on or after a moment, as minutes into its day */
const earliestMinuteOf = (moment: ZonedDateTime) =>
  moment.hour * 60 +
  moment.minute +
  (moment.second > 0 || moment.millisecond > 0 ? 1 : 0);

const sameDay = (a: CalendarDate, b: CalendarDate) => a.compare(b) === 0;

// the time zone never changes while the page is open, so there is nothing to
// subscribe to; the server snapshot keeps hydration stable
const subscribeNever = () => () => {};

/**
 * The wall-clock time a value asked for when the clocks skip it, e.g. 2:30 for
 * `"2026-03-08T02:30"` in New York. Only a value without an offset can name a
 * skipped time; one with an offset is always a real moment
 */
const skippedTimeOf = (
  value: DateTimeValue | null | undefined,
  timeZone: string,
): TimeOfDay | null => {
  if (typeof value !== "string" || !value) return null;
  try {
    parseAbsolute(value, timeZone);
    return null;
  } catch {
    // no offset: check the wall-clock time below
  }
  let wall: CalendarDateTime;
  try {
    wall = parseDateTime(value);
  } catch {
    return null;
  }
  const time = { hour: wall.hour, minute: wall.minute };
  return checkWallTime(toCalendarDate(wall), time, timeZone).kind === "gap"
    ? time
    : null;
};

const sameMoment = (a: Entry, b: Entry) =>
  Boolean(
    a.date &&
      b.date &&
      a.time &&
      b.time &&
      a.date.compare(b.date) === 0 &&
      a.time.hour === b.time.hour &&
      a.time.minute === b.time.minute,
  );

/** The entry the picker holds: a date, a time, and which occurrence of a repeated time */
interface Entry {
  date: CalendarDate | null;
  time: TimeOfDay | null;
  invalid: boolean;
  /** Use the second occurrence of a time the clocks pass twice */
  second: boolean;
}

/** The entry for a moment in a zone, noting when it is the second of a repeated time */
const entryFromMoment = (moment: ZonedDateTime | null): Entry => {
  if (!moment) return { date: null, time: null, invalid: false, second: false };
  const date = toCalendarDate(moment);
  const time = { hour: moment.hour, minute: moment.minute };
  const check = checkWallTime(date, time, moment.timeZone);
  return {
    date,
    time,
    invalid: false,
    second:
      check.kind === "ambiguous" &&
      moment.offset === check.later.offset &&
      check.earlier.offset !== check.later.offset,
  };
};

interface DateTimePickerProps
  extends Omit<ComponentProps<"div">, "defaultValue" | "onChange"> {
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
const DateTimePicker = ({
  value,
  defaultValue,
  onValueChange,
  timeZone: timeZoneProp,
  minValue,
  maxValue,
  stepMinutes = 15,
  defaultTime = "09:00",
  label = "Date and time",
  description,
  locale,
  disabled,
  required,
  name,
  id: idProp,
  className,
  ...rest
}: DateTimePickerProps) => {
  const browserTimeZone = useSyncExternalStore(
    subscribeNever,
    getBrowserTimeZone,
    () => "UTC",
  );
  const timeZone = timeZoneProp ?? browserTimeZone;
  const step = Math.max(1, Math.round(stepMinutes));

  const generatedId = useId();
  const id = idProp ?? generatedId;
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;
  const timeId = `${id}-time`;
  const listId = `${id}-times`;
  const zoneId = `${id}-zone`;
  const noteId = `${id}-note`;
  const errorId = `${id}-error`;

  const fixedMin = useMemo(
    () => (minValue === "now" ? null : toZonedDateTime(minValue, timeZone)),
    [minValue, timeZone],
  );
  // "now" is read fresh every time the entry is checked
  const getMin = () => (minValue === "now" ? now(timeZone) : fixedMin);
  const max = useMemo(
    () => toZonedDateTime(maxValue, timeZone),
    [maxValue, timeZone],
  );

  const [entry, setEntry] = useState<Entry>(() =>
    entryFromMoment(toZonedDateTime(value ?? defaultValue, timeZone)),
  );
  const { date, time } = entry;
  const [timeText, setTimeText] = useState(() =>
    entry.time ? formatTime(entry.time, locale) : "",
  );
  // the time typed when it fell in a daylight saving gap, for the note
  const [skippedTime, setSkippedTime] = useState<TimeOfDay | null>(() =>
    skippedTimeOf(value ?? defaultValue, timeZone),
  );

  const evaluate = (
    next: Entry,
    zone: string = timeZone,
  ): DateTimePickerValueChangeDetails => {
    const empty = { value: null, date: null, timeZone: zone };
    if (next.invalid) return { ...empty, error: "invalid-time" };
    if (!next.date || !next.time) return { ...empty, error: null };
    const moment = composeDateTime(
      next.date,
      next.time,
      zone,
      next.second ? "later" : "earlier",
    );
    const min = getMin();
    if (min && moment.compare(min) < 0) {
      return { ...empty, error: "before-min" };
    }
    if (max && moment.compare(max) > 0) return { ...empty, error: "after-max" };
    return {
      value: toIsoWithOffset(moment),
      date: moment.toDate(),
      timeZone: zone,
      error: null,
    };
  };

  const current = evaluate(entry);
  const lastEmitted = useRef<{ value: string | null; error: string | null }>({
    value: current.value,
    error: current.error,
  });

  const emit = (next: Entry, zone: string = timeZone) => {
    const details = evaluate(next, zone);
    if (
      details.value === lastEmitted.current.value &&
      details.error === lastEmitted.current.error
    ) {
      return;
    }
    lastEmitted.current = { value: details.value, error: details.error };
    onValueChange?.(details);
  };

  /** Store and report an entry, moving a time the clocks skip to the time it becomes */
  const apply = (next: Entry, text?: string) => {
    let settled = next;
    let skipped: TimeOfDay | null = null;
    if (next.date && next.time && !next.invalid) {
      const check = checkWallTime(next.date, next.time, timeZone);
      if (check.kind === "gap") {
        skipped = next.time;
        settled = { ...next, time: check.resolved, second: false };
      } else if (check.kind === "ok") {
        settled = { ...next, second: false };
      }
    }
    setEntry(settled);
    // keep the note while the entry still holds the time it moved to (e.g.
    // the normalized time committed again on blur)
    setSkippedTime(
      skipped ??
        (skippedTime && sameMoment(settled, entry) ? skippedTime : null),
    );
    // show the time actually used when the typed one was skipped
    if (skipped && settled.time) setTimeText(formatTime(settled.time, locale));
    else if (text !== undefined) setTimeText(text);
    emit(settled);
  };

  // follow a controlled value the parent changed (not one this control just
  // reported, so typing is never clobbered by the echo)
  const controlledInstant =
    value === undefined
      ? undefined
      : (toZonedDateTime(value, timeZone)?.toDate().getTime() ?? null);
  const lastSynced = useRef(controlledInstant);
  // biome-ignore lint/correctness/useExhaustiveDependencies: keyed on the controlled instant only; the value and zone are read for that instant
  useLayoutEffect(() => {
    if (
      controlledInstant === undefined ||
      controlledInstant === lastSynced.current
    ) {
      return;
    }
    lastSynced.current = controlledInstant;
    const emittedInstant = lastEmitted.current.value
      ? new Date(lastEmitted.current.value).getTime()
      : null;
    if (controlledInstant === emittedInstant) return;
    const moment = toZonedDateTime(value, timeZone);
    const next = entryFromMoment(moment);
    setEntry(next);
    setSkippedTime(skippedTimeOf(value, timeZone));
    setTimeText(next.time ? formatTime(next.time, locale) : "");
    lastEmitted.current = {
      value: moment ? toIsoWithOffset(moment) : null,
      error: null,
    };
  }, [controlledInstant]);

  // a new zone keeps the same moment: move the shown date and time into it and
  // report the value again with the new offset
  const previousZone = useRef(timeZone);
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs only when the zone changes
  useEffect(() => {
    const from = previousZone.current;
    previousZone.current = timeZone;
    if (from === timeZone) return;
    if (!entry.date || !entry.time || entry.invalid) {
      emit(entry);
      return;
    }
    const moment = composeDateTime(
      entry.date,
      entry.time,
      from,
      entry.second ? "later" : "earlier",
    );
    const next = entryFromMoment(fromDate(moment.toDate(), timeZone));
    setEntry(next);
    setSkippedTime(null);
    setTimeText(next.time ? formatTime(next.time, locale) : "");
    emit(next);
  }, [timeZone]);

  /** The time to fill in when a date is picked first: `defaultTime`, or the next step on or after the minimum on its day */
  const initialTimeFor = (day: CalendarDate): TimeOfDay => {
    const preferred = parseTimeInput(defaultTime) ?? { hour: 9, minute: 0 };
    const min = getMin();
    if (!min || !sameDay(day, toCalendarDate(min))) return preferred;
    if (composeDateTime(day, preferred, timeZone).compare(min) >= 0) {
      return preferred;
    }
    const next = Math.ceil(earliestMinuteOf(min) / step) * step;
    return next < MINUTES_PER_DAY ? fromMinutes(next) : preferred;
  };

  const commitTimeText = (text: string) => {
    if (!text.trim()) {
      apply({ ...entry, time: null, invalid: false, second: false }, "");
      return;
    }
    const parsed = parseTimeInput(text, locale);
    if (parsed) {
      apply(
        { ...entry, time: parsed, invalid: false, second: false },
        formatTime(parsed, locale),
      );
    } else {
      apply({ ...entry, invalid: true });
    }
  };

  const onDateChange = (details: { value: DateValue[] }) => {
    const picked = details.value[0];
    const nextDate = picked ? toCalendarDate(picked) : null;
    if (nextDate && !entry.time && !entry.invalid) {
      const nextTime = initialTimeFor(nextDate);
      apply(
        { ...entry, date: nextDate, time: nextTime, second: false },
        formatTime(nextTime, locale),
      );
      return;
    }
    apply({ ...entry, date: nextDate, second: false });
  };

  const onTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    setTimeText(text);
    // a picked suggestion (or any fully formatted time) applies right away;
    // partial typing waits for blur or Enter
    const parsed = parseTimeInput(text, locale);
    if (parsed && formatTime(parsed, locale) === text.trim()) {
      apply({ ...entry, time: parsed, invalid: false, second: false });
    }
  };

  const onTimeKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      commitTimeText(timeText);
      return;
    }
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    const base = parseTimeInput(timeText, locale) ??
      time ??
      (date ? initialTimeFor(date) : parseTimeInput(defaultTime)) ?? {
        hour: 9,
        minute: 0,
      };
    const minutes = minutesOf(base);
    const next =
      event.key === "ArrowUp"
        ? Math.floor(minutes / step) * step + step
        : Math.ceil(minutes / step) * step - step;
    const nextTime = fromMinutes(next);
    apply(
      { ...entry, time: nextTime, invalid: false, second: false },
      formatTime(nextTime, locale),
    );
  };

  // suggestions every `step` minutes, skipping times before the minimum on its day
  const min = getMin();
  const minDay = min ? toCalendarDate(min) : null;
  const earliestToday =
    min && date && minDay && sameDay(date, minDay) ? earliestMinuteOf(min) : 0;
  const suggestions = useMemo(() => {
    const options: string[] = [];
    for (let m = 0; m < MINUTES_PER_DAY; m += step) {
      if (m >= earliestToday) options.push(formatTime(fromMinutes(m), locale));
    }
    return options;
  }, [earliestToday, step, locale]);

  const zoneLabel = describeTimeZone(
    timeZone,
    current.date ??
      (date && time
        ? composeDateTime(date, time, timeZone).toDate()
        : new Date()),
    locale,
  );

  // daylight saving notes: a skipped time that moved forward, or a repeated
  // time with a choice of occurrence
  const wallCheck =
    date && time && !entry.invalid ? checkWallTime(date, time, timeZone) : null;
  const ambiguous = wallCheck?.kind === "ambiguous" ? wallCheck : null;
  const timeLabel = time ? formatTime(time, locale) : "";

  const errorMessage =
    current.error === "invalid-time"
      ? `Enter a time like ${formatTime({ hour: 9, minute: 30 }, locale)} or ${formatTime({ hour: 14, minute: 30 }, locale)}.`
      : current.error === "before-min" && min
        ? `Choose a time on or after ${formatMoment(min, locale)}.`
        : current.error === "after-max" && max
          ? `Choose a time on or before ${formatMoment(max, locale)}.`
          : null;

  const describedBy = [
    description ? descriptionId : null,
    zoneId,
    skippedTime || ambiguous ? noteId : null,
    errorMessage ? errorId : null,
  ]
    .filter(Boolean)
    .join(" ");
  const dateInvalid =
    current.error === "before-min" || current.error === "after-max";

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      aria-describedby={description ? descriptionId : undefined}
      className={cn("flex flex-col gap-1.5", className)}
      {...rest}
    >
      <span id={labelId} className="text-sm font-medium">
        {label}
        {required && (
          <span aria-hidden className="text-destructive">
            {" "}
            *
          </span>
        )}
      </span>
      {description && (
        <p id={descriptionId} className="text-muted-foreground text-xs">
          {description}
        </p>
      )}

      <div className="flex flex-wrap items-end gap-3">
        <DatePickerRoot
          value={date ? [date] : []}
          onValueChange={onDateChange}
          timeZone={timeZone}
          min={min ? toCalendarDate(min) : undefined}
          max={max ? toCalendarDate(max) : undefined}
          locale={locale}
          disabled={disabled}
          required={required}
          positioning={{ placement: "bottom-start" }}
          className="min-w-44 flex-1"
        >
          <DatePickerLabel className="text-muted-foreground text-xs font-normal">
            Date
          </DatePickerLabel>
          <DatePickerControl className="gap-0">
            <DatePickerInput
              aria-invalid={dateInvalid || undefined}
              aria-describedby={describedBy}
              className="aria-invalid:border-destructive h-9"
            />
            <DatePickerTrigger className="h-9 w-9" />
          </DatePickerControl>
          <DatePickerPositioner>
            <DatePickerContent className="text-popover-foreground z-50">
              <DatePickerView view="day" className="flex flex-col gap-3">
                <DatePickerContext>
                  {(api) => (
                    <>
                      <DatePickerViewControl>
                        <DatePickerPrevTrigger />
                        <span className="text-sm font-medium">
                          <DatePickerRangeText />
                        </span>
                        <DatePickerNextTrigger />
                      </DatePickerViewControl>
                      <DatePickerTable className="mb-0">
                        <DatePickerTableHead>
                          <DatePickerTableRow>
                            {api.weekDays.map((weekDay) => (
                              <DatePickerTableHeader
                                key={weekDay.long}
                                aria-label={weekDay.long}
                              >
                                {weekDay.narrow}
                              </DatePickerTableHeader>
                            ))}
                          </DatePickerTableRow>
                        </DatePickerTableHead>
                        <DatePickerTableBody>
                          {api.weeks.map((week) => (
                            <DatePickerTableRow key={week[0]?.toString()}>
                              {week.map((day) => (
                                <DatePickerTableCell
                                  key={day.toString()}
                                  value={day}
                                >
                                  <DatePickerTableCellTrigger className="data-selected:text-primary-foreground data-outside-range:text-muted-foreground">
                                    {day.day}
                                  </DatePickerTableCellTrigger>
                                </DatePickerTableCell>
                              ))}
                            </DatePickerTableRow>
                          ))}
                        </DatePickerTableBody>
                      </DatePickerTable>
                    </>
                  )}
                </DatePickerContext>
              </DatePickerView>
            </DatePickerContent>
          </DatePickerPositioner>
        </DatePickerRoot>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={timeId} className="text-muted-foreground text-xs">
            Time
          </label>
          <input
            id={timeId}
            type="text"
            autoComplete="off"
            spellCheck={false}
            list={listId}
            value={timeText}
            placeholder={formatTime({ hour: 9, minute: 0 }, locale)}
            disabled={disabled}
            required={required}
            aria-invalid={current.error ? true : undefined}
            aria-describedby={describedBy}
            onChange={onTimeChange}
            onBlur={(event) => commitTimeText(event.target.value)}
            onKeyDown={onTimeKeyDown}
            className="border-input placeholder:text-muted-foreground focus-visible:ring-primary aria-invalid:border-destructive flex h-9 w-32 rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          />
          <datalist id={listId}>
            {suggestions.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
        </div>
      </div>

      <p id={zoneId} className="text-muted-foreground text-xs">
        Time zone: {zoneLabel}
      </p>
      {skippedTime && time && (
        <p id={noteId} className="text-xs">
          {formatTime(skippedTime, locale)} doesn't exist on this date (the
          clocks go forward); using {timeLabel}.
        </p>
      )}
      {ambiguous && !skippedTime && (
        <div
          id={noteId}
          className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs"
        >
          <span>
            {timeLabel} happens twice on this date (the clocks go back); using
            the {entry.second ? "second" : "first"} (UTC
            {formatOffset(
              (entry.second ? ambiguous.later : ambiguous.earlier).offset,
            )}
            ).
          </span>
          <button
            type="button"
            disabled={disabled}
            className="text-primary focus-visible:ring-primary rounded-sm underline underline-offset-2 focus-visible:ring-2 focus-visible:outline-none"
            onClick={() => apply({ ...entry, second: !entry.second })}
          >
            Use the {entry.second ? "first" : "second"} {timeLabel} (UTC
            {formatOffset(
              (entry.second ? ambiguous.earlier : ambiguous.later).offset,
            )}
            )
          </button>
        </div>
      )}
      {errorMessage && (
        <p id={errorId} role="alert" className="text-destructive text-xs">
          {errorMessage}
        </p>
      )}
      {name && <input type="hidden" name={name} value={current.value ?? ""} />}
    </div>
  );
};

export type {
  DateTimePickerError,
  DateTimePickerProps,
  DateTimePickerValueChangeDetails,
  DateTimeValue,
  TimeOfDay,
};
export {
  DateTimePicker,
  describeTimeZone,
  formatOffset,
  formatTime,
  getBrowserTimeZone,
  normalizeDigits,
  parseTimeInput,
  toIsoWithOffset,
  toZonedDateTime,
};
export default DateTimePicker;
