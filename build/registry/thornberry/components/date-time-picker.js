import"../../../chunks/ai-describe-panel-h4yrvya3.js";
import {
  DatePickerContext2,
  DatePickerPositioner2,
  DatePickerRangeText2,
  DatePickerView2,
  DatePickerTableBody2,
  DatePickerTableHead2,
  DatePickerTableRow2,
  DatePickerRoot2,
  DatePickerLabel2,
  DatePickerControl2,
  DatePickerInput2,
  DatePickerTrigger2,
  DatePickerContent2,
  DatePickerViewControl2,
  DatePickerPrevTrigger2,
  DatePickerNextTrigger2,
  DatePickerTable2,
  DatePickerTableHeader2,
  DatePickerTableCell2,
  DatePickerTableCellTrigger2
} from "../../../chunks/ai-describe-panel-wkyzhkz3.js";
import {
  cn
} from "../../../chunks/ai-describe-panel-81fr4sax.js";

// src/registry/thornberry/components/date-time-picker.tsx
import {
  CalendarDateTime,
  fromDate,
  now,
  parseAbsolute,
  parseDate,
  parseDateTime,
  toCalendarDate,
  toZoned
} from "@internationalized/date";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore
} from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
"use client";
var MINUTES_PER_DAY = 24 * 60;
var getBrowserTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
var pad = (value, length = 2) => String(Math.abs(value)).padStart(length, "0");
var formatOffset = (offsetMs) => {
  const totalMinutes = Math.round(offsetMs / 60000);
  const sign = totalMinutes < 0 ? "-" : "+";
  const abs = Math.abs(totalMinutes);
  return `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
};
var toIsoWithOffset = (value) => `${pad(value.year, 4)}-${pad(value.month)}-${pad(value.day)}T${pad(value.hour)}:${pad(value.minute)}:${pad(value.second)}${formatOffset(value.offset)}`;
var isDevelopment = () => globalThis.process?.env?.NODE_ENV !== "production";
var warnedOffsetless = new Set;
var toZonedDateTime = (value, timeZone) => {
  if (value == null || value === "")
    return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : fromDate(value, timeZone);
  }
  try {
    return parseAbsolute(value, timeZone);
  } catch {}
  let wall = null;
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
    console.warn(`DateTimePicker: "${value}" has no UTC offset, so it is read in ${timeZone}. Pass an offset (or a Date) to name an exact moment.`);
  }
  return toZoned(wall, timeZone, "compatible");
};
var composeDateTime = (date, time, timeZone, disambiguation = "compatible") => toZoned(new CalendarDateTime(date.year, date.month, date.day, time.hour, time.minute), timeZone, disambiguation);
var checkWallTime = (date, time, timeZone) => {
  const compatible = composeDateTime(date, time, timeZone);
  if (compatible.hour !== time.hour || compatible.minute !== time.minute) {
    return {
      kind: "gap",
      resolved: { hour: compatible.hour, minute: compatible.minute }
    };
  }
  const earlier = composeDateTime(date, time, timeZone, "earlier");
  const later = composeDateTime(date, time, timeZone, "later");
  return earlier.offset === later.offset ? { kind: "ok" } : { kind: "ambiguous", earlier, later };
};
var DIGIT_ZEROS = [
  1632,
  1776,
  1984,
  2406,
  2534,
  2662,
  2790,
  2918,
  3046,
  3174,
  3302,
  3430,
  3558,
  3664,
  3792,
  3872,
  4160,
  4240,
  6112,
  6160,
  65296
];
var normalizeDigits = (text) => text.replace(/\p{Nd}/gu, (char) => {
  const code = char.codePointAt(0) ?? 0;
  const zero = DIGIT_ZEROS.find((z) => code >= z && code <= z + 9);
  return zero === undefined ? char : String(code - zero);
});
var compact = (text) => normalizeDigits(text).toLowerCase().replace(/[\s.‎‏؜]/g, "");
var dayPeriodCache = new Map;
var dayPeriodLabels = (locale) => {
  const cacheKey = locale ?? "";
  const cached = dayPeriodCache.get(cacheKey);
  if (cached)
    return cached;
  const label = (hour) => {
    const part = new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      timeZone: "UTC"
    }).formatToParts(Date.UTC(2000, 0, 1, hour)).find((p) => p.type === "dayPeriod")?.value;
    return part ? compact(part) || null : null;
  };
  const labels = { am: label(9), pm: label(21) };
  dayPeriodCache.set(cacheKey, labels);
  return labels;
};
var FALLBACK_LOCALES = ["ko", "zh", "ja", "ar", "fa", "hi", "bn", "th"];
var toTimeOfDay = (hourDigits, minuteDigits, meridiem) => {
  let hours = hourDigits;
  let minutes = minuteDigits;
  if (minutes === undefined && hours.length > 2) {
    minutes = hours.slice(-2);
    hours = hours.slice(0, -2);
  }
  if (!hours || hours.length > 2)
    return null;
  if (minutes !== undefined && minutes.length !== 2)
    return null;
  let hour = Number(hours);
  const minute = Number(minutes ?? "0");
  if (minute > 59)
    return null;
  if (meridiem) {
    if (hour < 1 || hour > 12)
      return null;
    if (hour === 12)
      hour = meridiem === "pm" ? 12 : 0;
    else if (meridiem === "pm")
      hour += 12;
  } else if (hour > 23) {
    return null;
  }
  return { hour, minute };
};
var parseLocalizedTime = (text, locale) => {
  let rest = compact(text);
  if (!rest)
    return null;
  const { am, pm } = dayPeriodLabels(locale);
  let meridiem = null;
  if (pm && rest.includes(pm)) {
    meridiem = "pm";
    rest = rest.replace(pm, "");
  } else if (am && rest.includes(am)) {
    meridiem = "am";
    rest = rest.replace(am, "");
  }
  const groups = rest.match(/\d+/g) ?? [];
  const leftover = rest.replace(/\d+/g, "").replace(/h/g, "");
  if (!groups.length || groups.length > 2 || /[\p{L}\p{N}]/u.test(leftover)) {
    return null;
  }
  return toTimeOfDay(groups[0] ?? "", groups[1], meridiem);
};
var parseEnglishTime = (text) => {
  const cleaned = compact(text);
  const match = /^(\d{1,4})(?:[:h](\d{2}))?(am|pm|a|p)?$/.exec(cleaned);
  if (!match)
    return null;
  const meridiem = match[3] ? match[3].startsWith("p") ? "pm" : "am" : null;
  return toTimeOfDay(match[1] ?? "", match[2], meridiem);
};
var parseTimeInput = (text, locale) => {
  const local = parseLocalizedTime(text, locale) ?? parseEnglishTime(text);
  if (local)
    return local;
  for (const fallback of FALLBACK_LOCALES) {
    const parsed = parseLocalizedTime(text, fallback);
    if (parsed)
      return parsed;
  }
  return null;
};
var formatTime = (time, locale) => new Intl.DateTimeFormat(locale, {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC"
}).format(Date.UTC(2000, 0, 1, time.hour, time.minute));
var describeTimeZone = (timeZone, at, locale) => {
  const part = (style) => new Intl.DateTimeFormat(locale, { timeZone, timeZoneName: style }).formatToParts(at).find((p) => p.type === "timeZoneName")?.value;
  const name = part("long");
  const offset = part("longOffset");
  const detail = [timeZone, offset].filter(Boolean).join(", ");
  return name && name !== timeZone ? `${name} (${detail})` : detail;
};
var formatMoment = (value, locale) => new Intl.DateTimeFormat(locale, {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: value.timeZone
}).format(value.toDate());
var minutesOf = (time) => time.hour * 60 + time.minute;
var fromMinutes = (minutes) => {
  const wrapped = (minutes % MINUTES_PER_DAY + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  return { hour: Math.floor(wrapped / 60), minute: wrapped % 60 };
};
var earliestMinuteOf = (moment) => moment.hour * 60 + moment.minute + (moment.second > 0 || moment.millisecond > 0 ? 1 : 0);
var sameDay = (a, b) => a.compare(b) === 0;
var subscribeNever = () => () => {};
var skippedTimeOf = (value, timeZone) => {
  if (typeof value !== "string" || !value)
    return null;
  try {
    parseAbsolute(value, timeZone);
    return null;
  } catch {}
  let wall;
  try {
    wall = parseDateTime(value);
  } catch {
    return null;
  }
  const time = { hour: wall.hour, minute: wall.minute };
  return checkWallTime(toCalendarDate(wall), time, timeZone).kind === "gap" ? time : null;
};
var sameMoment = (a, b) => Boolean(a.date && b.date && a.time && b.time && a.date.compare(b.date) === 0 && a.time.hour === b.time.hour && a.time.minute === b.time.minute);
var entryFromMoment = (moment) => {
  if (!moment)
    return { date: null, time: null, invalid: false, second: false };
  const date = toCalendarDate(moment);
  const time = { hour: moment.hour, minute: moment.minute };
  const check = checkWallTime(date, time, moment.timeZone);
  return {
    date,
    time,
    invalid: false,
    second: check.kind === "ambiguous" && moment.offset === check.later.offset && check.earlier.offset !== check.later.offset
  };
};
var DateTimePicker = ({
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
}) => {
  const browserTimeZone = useSyncExternalStore(subscribeNever, getBrowserTimeZone, () => "UTC");
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
  const fixedMin = useMemo(() => minValue === "now" ? null : toZonedDateTime(minValue, timeZone), [minValue, timeZone]);
  const getMin = () => minValue === "now" ? now(timeZone) : fixedMin;
  const max = useMemo(() => toZonedDateTime(maxValue, timeZone), [maxValue, timeZone]);
  const [entry, setEntry] = useState(() => entryFromMoment(toZonedDateTime(value ?? defaultValue, timeZone)));
  const { date, time } = entry;
  const [timeText, setTimeText] = useState(() => entry.time ? formatTime(entry.time, locale) : "");
  const [skippedTime, setSkippedTime] = useState(() => skippedTimeOf(value ?? defaultValue, timeZone));
  const evaluate = (next, zone = timeZone) => {
    const empty = { value: null, date: null, timeZone: zone };
    if (next.invalid)
      return { ...empty, error: "invalid-time" };
    if (!next.date || !next.time)
      return { ...empty, error: null };
    const moment = composeDateTime(next.date, next.time, zone, next.second ? "later" : "earlier");
    const min = getMin();
    if (min && moment.compare(min) < 0) {
      return { ...empty, error: "before-min" };
    }
    if (max && moment.compare(max) > 0)
      return { ...empty, error: "after-max" };
    return {
      value: toIsoWithOffset(moment),
      date: moment.toDate(),
      timeZone: zone,
      error: null
    };
  };
  const current = evaluate(entry);
  const lastEmitted = useRef({
    value: current.value,
    error: current.error
  });
  const emit = (next, zone = timeZone) => {
    const details = evaluate(next, zone);
    if (details.value === lastEmitted.current.value && details.error === lastEmitted.current.error) {
      return;
    }
    lastEmitted.current = { value: details.value, error: details.error };
    onValueChange?.(details);
  };
  const apply = (next, text) => {
    let settled = next;
    let skipped = null;
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
    setSkippedTime(skipped ?? (skippedTime && sameMoment(settled, entry) ? skippedTime : null));
    if (skipped && settled.time)
      setTimeText(formatTime(settled.time, locale));
    else if (text !== undefined)
      setTimeText(text);
    emit(settled);
  };
  const controlledInstant = value === undefined ? undefined : toZonedDateTime(value, timeZone)?.toDate().getTime() ?? null;
  const lastSynced = useRef(controlledInstant);
  useLayoutEffect(() => {
    if (controlledInstant === undefined || controlledInstant === lastSynced.current) {
      return;
    }
    lastSynced.current = controlledInstant;
    const emittedInstant = lastEmitted.current.value ? new Date(lastEmitted.current.value).getTime() : null;
    if (controlledInstant === emittedInstant)
      return;
    const moment = toZonedDateTime(value, timeZone);
    const next = entryFromMoment(moment);
    setEntry(next);
    setSkippedTime(skippedTimeOf(value, timeZone));
    setTimeText(next.time ? formatTime(next.time, locale) : "");
    lastEmitted.current = {
      value: moment ? toIsoWithOffset(moment) : null,
      error: null
    };
  }, [controlledInstant]);
  const previousZone = useRef(timeZone);
  useEffect(() => {
    const from = previousZone.current;
    previousZone.current = timeZone;
    if (from === timeZone)
      return;
    if (!entry.date || !entry.time || entry.invalid) {
      emit(entry);
      return;
    }
    const moment = composeDateTime(entry.date, entry.time, from, entry.second ? "later" : "earlier");
    const next = entryFromMoment(fromDate(moment.toDate(), timeZone));
    setEntry(next);
    setSkippedTime(null);
    setTimeText(next.time ? formatTime(next.time, locale) : "");
    emit(next);
  }, [timeZone]);
  const initialTimeFor = (day) => {
    const preferred = parseTimeInput(defaultTime) ?? { hour: 9, minute: 0 };
    const min = getMin();
    if (!min || !sameDay(day, toCalendarDate(min)))
      return preferred;
    if (composeDateTime(day, preferred, timeZone).compare(min) >= 0) {
      return preferred;
    }
    const next = Math.ceil(earliestMinuteOf(min) / step) * step;
    return next < MINUTES_PER_DAY ? fromMinutes(next) : preferred;
  };
  const commitTimeText = (text) => {
    if (!text.trim()) {
      apply({ ...entry, time: null, invalid: false, second: false }, "");
      return;
    }
    const parsed = parseTimeInput(text, locale);
    if (parsed) {
      apply({ ...entry, time: parsed, invalid: false, second: false }, formatTime(parsed, locale));
    } else {
      apply({ ...entry, invalid: true });
    }
  };
  const onDateChange = (details) => {
    const picked = details.value[0];
    const nextDate = picked ? toCalendarDate(picked) : null;
    if (nextDate && !entry.time && !entry.invalid) {
      const nextTime = initialTimeFor(nextDate);
      apply({ ...entry, date: nextDate, time: nextTime, second: false }, formatTime(nextTime, locale));
      return;
    }
    apply({ ...entry, date: nextDate, second: false });
  };
  const onTimeChange = (event) => {
    const text = event.target.value;
    setTimeText(text);
    const parsed = parseTimeInput(text, locale);
    if (parsed && formatTime(parsed, locale) === text.trim()) {
      apply({ ...entry, time: parsed, invalid: false, second: false });
    }
  };
  const onTimeKeyDown = (event) => {
    if (event.key === "Enter") {
      commitTimeText(timeText);
      return;
    }
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown")
      return;
    event.preventDefault();
    const base = parseTimeInput(timeText, locale) ?? time ?? (date ? initialTimeFor(date) : parseTimeInput(defaultTime)) ?? {
      hour: 9,
      minute: 0
    };
    const minutes = minutesOf(base);
    const next = event.key === "ArrowUp" ? Math.floor(minutes / step) * step + step : Math.ceil(minutes / step) * step - step;
    const nextTime = fromMinutes(next);
    apply({ ...entry, time: nextTime, invalid: false, second: false }, formatTime(nextTime, locale));
  };
  const min = getMin();
  const minDay = min ? toCalendarDate(min) : null;
  const earliestToday = min && date && minDay && sameDay(date, minDay) ? earliestMinuteOf(min) : 0;
  const suggestions = useMemo(() => {
    const options = [];
    for (let m = 0;m < MINUTES_PER_DAY; m += step) {
      if (m >= earliestToday)
        options.push(formatTime(fromMinutes(m), locale));
    }
    return options;
  }, [earliestToday, step, locale]);
  const zoneLabel = describeTimeZone(timeZone, current.date ?? (date && time ? composeDateTime(date, time, timeZone).toDate() : new Date), locale);
  const wallCheck = date && time && !entry.invalid ? checkWallTime(date, time, timeZone) : null;
  const ambiguous = wallCheck?.kind === "ambiguous" ? wallCheck : null;
  const timeLabel = time ? formatTime(time, locale) : "";
  const errorMessage = current.error === "invalid-time" ? `Enter a time like ${formatTime({ hour: 9, minute: 30 }, locale)} or ${formatTime({ hour: 14, minute: 30 }, locale)}.` : current.error === "before-min" && min ? `Choose a time on or after ${formatMoment(min, locale)}.` : current.error === "after-max" && max ? `Choose a time on or before ${formatMoment(max, locale)}.` : null;
  const describedBy = [
    description ? descriptionId : null,
    zoneId,
    skippedTime || ambiguous ? noteId : null,
    errorMessage ? errorId : null
  ].filter(Boolean).join(" ");
  const dateInvalid = current.error === "before-min" || current.error === "after-max";
  return /* @__PURE__ */ jsxs("div", {
    role: "group",
    "aria-labelledby": labelId,
    "aria-describedby": description ? descriptionId : undefined,
    className: cn("flex flex-col gap-1.5", className),
    ...rest,
    children: [
      /* @__PURE__ */ jsxs("span", {
        id: labelId,
        className: "text-sm font-medium",
        children: [
          label,
          required && /* @__PURE__ */ jsxs("span", {
            "aria-hidden": true,
            className: "text-destructive",
            children: [
              " ",
              "*"
            ]
          })
        ]
      }),
      description && /* @__PURE__ */ jsx("p", {
        id: descriptionId,
        className: "text-muted-foreground text-xs",
        children: description
      }),
      /* @__PURE__ */ jsxs("div", {
        className: "flex flex-wrap items-end gap-3",
        children: [
          /* @__PURE__ */ jsxs(DatePickerRoot2, {
            value: date ? [date] : [],
            onValueChange: onDateChange,
            timeZone,
            min: min ? toCalendarDate(min) : undefined,
            max: max ? toCalendarDate(max) : undefined,
            locale,
            disabled,
            required,
            positioning: { placement: "bottom-start" },
            className: "min-w-44 flex-1",
            children: [
              /* @__PURE__ */ jsx(DatePickerLabel2, {
                className: "text-muted-foreground text-xs font-normal",
                children: "Date"
              }),
              /* @__PURE__ */ jsxs(DatePickerControl2, {
                className: "gap-0",
                children: [
                  /* @__PURE__ */ jsx(DatePickerInput2, {
                    "aria-invalid": dateInvalid || undefined,
                    "aria-describedby": describedBy,
                    className: "aria-invalid:border-destructive h-9"
                  }),
                  /* @__PURE__ */ jsx(DatePickerTrigger2, {
                    className: "h-9 w-9"
                  })
                ]
              }),
              /* @__PURE__ */ jsx(DatePickerPositioner2, {
                children: /* @__PURE__ */ jsx(DatePickerContent2, {
                  className: "text-popover-foreground z-50",
                  children: /* @__PURE__ */ jsx(DatePickerView2, {
                    view: "day",
                    className: "flex flex-col gap-3",
                    children: /* @__PURE__ */ jsx(DatePickerContext2, {
                      children: (api) => /* @__PURE__ */ jsxs(Fragment, {
                        children: [
                          /* @__PURE__ */ jsxs(DatePickerViewControl2, {
                            children: [
                              /* @__PURE__ */ jsx(DatePickerPrevTrigger2, {}),
                              /* @__PURE__ */ jsx("span", {
                                className: "text-sm font-medium",
                                children: /* @__PURE__ */ jsx(DatePickerRangeText2, {})
                              }),
                              /* @__PURE__ */ jsx(DatePickerNextTrigger2, {})
                            ]
                          }),
                          /* @__PURE__ */ jsxs(DatePickerTable2, {
                            className: "mb-0",
                            children: [
                              /* @__PURE__ */ jsx(DatePickerTableHead2, {
                                children: /* @__PURE__ */ jsx(DatePickerTableRow2, {
                                  children: api.weekDays.map((weekDay) => /* @__PURE__ */ jsx(DatePickerTableHeader2, {
                                    "aria-label": weekDay.long,
                                    children: weekDay.narrow
                                  }, weekDay.long))
                                })
                              }),
                              /* @__PURE__ */ jsx(DatePickerTableBody2, {
                                children: api.weeks.map((week) => /* @__PURE__ */ jsx(DatePickerTableRow2, {
                                  children: week.map((day) => /* @__PURE__ */ jsx(DatePickerTableCell2, {
                                    value: day,
                                    children: /* @__PURE__ */ jsx(DatePickerTableCellTrigger2, {
                                      className: "data-selected:text-primary-foreground data-outside-range:text-muted-foreground",
                                      children: day.day
                                    })
                                  }, day.toString()))
                                }, week[0]?.toString()))
                              })
                            ]
                          })
                        ]
                      })
                    })
                  })
                })
              })
            ]
          }),
          /* @__PURE__ */ jsxs("div", {
            className: "flex flex-col gap-1.5",
            children: [
              /* @__PURE__ */ jsx("label", {
                htmlFor: timeId,
                className: "text-muted-foreground text-xs",
                children: "Time"
              }),
              /* @__PURE__ */ jsx("input", {
                id: timeId,
                type: "text",
                autoComplete: "off",
                spellCheck: false,
                list: listId,
                value: timeText,
                placeholder: formatTime({ hour: 9, minute: 0 }, locale),
                disabled,
                required,
                "aria-invalid": current.error ? true : undefined,
                "aria-describedby": describedBy,
                onChange: onTimeChange,
                onBlur: (event) => commitTimeText(event.target.value),
                onKeyDown: onTimeKeyDown,
                className: "border-input placeholder:text-muted-foreground focus-visible:ring-primary aria-invalid:border-destructive flex h-9 w-32 rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              }),
              /* @__PURE__ */ jsx("datalist", {
                id: listId,
                children: suggestions.map((option) => /* @__PURE__ */ jsx("option", {
                  value: option
                }, option))
              })
            ]
          })
        ]
      }),
      /* @__PURE__ */ jsxs("p", {
        id: zoneId,
        className: "text-muted-foreground text-xs",
        children: [
          "Time zone: ",
          zoneLabel
        ]
      }),
      skippedTime && time && /* @__PURE__ */ jsxs("p", {
        id: noteId,
        className: "text-xs",
        children: [
          formatTime(skippedTime, locale),
          " doesn't exist on this date (the clocks go forward); using ",
          timeLabel,
          "."
        ]
      }),
      ambiguous && !skippedTime && /* @__PURE__ */ jsxs("div", {
        id: noteId,
        className: "flex flex-wrap items-center gap-x-2 gap-y-1 text-xs",
        children: [
          /* @__PURE__ */ jsxs("span", {
            children: [
              timeLabel,
              " happens twice on this date (the clocks go back); using the ",
              entry.second ? "second" : "first",
              " (UTC",
              formatOffset((entry.second ? ambiguous.later : ambiguous.earlier).offset),
              ")."
            ]
          }),
          /* @__PURE__ */ jsxs("button", {
            type: "button",
            disabled,
            className: "text-primary focus-visible:ring-primary rounded-sm underline underline-offset-2 focus-visible:ring-2 focus-visible:outline-none",
            onClick: () => apply({ ...entry, second: !entry.second }),
            children: [
              "Use the ",
              entry.second ? "first" : "second",
              " ",
              timeLabel,
              " (UTC",
              formatOffset((entry.second ? ambiguous.earlier : ambiguous.later).offset),
              ")"
            ]
          })
        ]
      }),
      errorMessage && /* @__PURE__ */ jsx("p", {
        id: errorId,
        role: "alert",
        className: "text-destructive text-xs",
        children: errorMessage
      }),
      name && /* @__PURE__ */ jsx("input", {
        type: "hidden",
        name,
        value: current.value ?? ""
      })
    ]
  });
};
var date_time_picker_default = DateTimePicker;
export {
  DateTimePicker,
  date_time_picker_default as default,
  describeTimeZone,
  formatOffset,
  formatTime,
  getBrowserTimeZone,
  normalizeDigits,
  parseTimeInput,
  toIsoWithOffset,
  toZonedDateTime
};
