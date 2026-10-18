import {
  cn
} from "../../../chunks/account-user-two-factor-authentication-81fr4sax.js";

// src/registry/thornberry/components/calendar.tsx
import {
  DateFormatter,
  getLocalTimeZone,
  today
} from "@internationalized/date";
import {
  buildMonthGrid,
  buildWeekDays,
  parseDayKey
} from "@omnidotdev/cadence";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var WEEKDAY_LABELS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat"
];
var orderedWeekdays = (weekStartsOn) => weekStartsOn === 1 ? [...WEEKDAY_LABELS.slice(1), WEEKDAY_LABELS[0]] : WEEKDAY_LABELS;
var CalendarHeader = ({
  title,
  onPrevious,
  onNext,
  onToday,
  className,
  children,
  ...rest
}) => /* @__PURE__ */ jsxs("div", {
  className: cn("flex items-center justify-between px-1 py-3", className),
  ...rest,
  children: [
    /* @__PURE__ */ jsx("h2", {
      className: "font-semibold text-lg",
      children: title
    }),
    /* @__PURE__ */ jsxs("div", {
      className: "flex items-center gap-1",
      children: [
        /* @__PURE__ */ jsx("button", {
          type: "button",
          "aria-label": "Previous",
          onClick: onPrevious,
          className: "rounded-md p-1.5 hover:bg-muted",
          children: /* @__PURE__ */ jsx(ChevronLeftIcon, {
            className: "size-4"
          })
        }),
        /* @__PURE__ */ jsx("button", {
          type: "button",
          onClick: onToday,
          className: "rounded-md border px-2 py-1 text-sm hover:bg-muted",
          children: "Today"
        }),
        /* @__PURE__ */ jsx("button", {
          type: "button",
          "aria-label": "Next",
          onClick: onNext,
          className: "rounded-md p-1.5 hover:bg-muted",
          children: /* @__PURE__ */ jsx(ChevronRightIcon, {
            className: "size-4"
          })
        }),
        children
      ]
    })
  ]
});
var CalendarWeekdays = ({
  weekStartsOn = 0,
  className,
  ...rest
}) => /* @__PURE__ */ jsx("div", {
  className: cn("grid grid-cols-7 border-border border-b", className),
  ...rest,
  children: orderedWeekdays(weekStartsOn).map((day) => /* @__PURE__ */ jsx("div", {
    className: "px-2 py-1 text-center font-medium text-muted-foreground text-xs",
    children: day
  }, day))
});
var CalendarGrid = ({ className, ...rest }) => /* @__PURE__ */ jsx("div", {
  className: cn("grid grid-cols-7", className),
  ...rest
});
var CalendarDayCell = ({
  day,
  isOver,
  className,
  children,
  ...rest
}) => /* @__PURE__ */ jsxs("div", {
  "data-cadence-day": day.key,
  className: cn("flex min-h-24 flex-col border-border border-r border-b p-1", !day.inMonth && "bg-muted/30 text-muted-foreground", isOver && "bg-accent/40", className),
  ...rest,
  children: [
    /* @__PURE__ */ jsx("span", {
      className: cn("inline-flex size-6 items-center justify-center self-start text-xs", day.isToday && "rounded-full bg-primary font-semibold text-primary-foreground"),
      children: day.dayOfMonth
    }),
    /* @__PURE__ */ jsx("div", {
      className: "mt-1 flex flex-col gap-1 overflow-hidden",
      children
    })
  ]
});
var ITEM_TONE_CLASSES = {
  neutral: "",
  danger: "bg-red-500/15 hover:bg-red-500/25",
  warning: "bg-yellow-500/15 hover:bg-yellow-500/25",
  success: "bg-green-500/15 hover:bg-green-500/25",
  info: "bg-blue-500/15 hover:bg-blue-500/25"
};
var CalendarItemAvatarCircle = ({ name, src }) => /* @__PURE__ */ jsxs("span", {
  title: name,
  className: "relative inline-flex size-4 items-center justify-center overflow-hidden rounded-full bg-muted font-medium text-[0.5rem] uppercase leading-none ring-1 ring-background",
  children: [
    name.trim().charAt(0) || "?",
    src && /* @__PURE__ */ jsx("img", {
      src,
      alt: "",
      className: "absolute inset-0 size-full object-cover",
      onError: (event) => {
        event.currentTarget.style.display = "none";
      }
    })
  ]
});
var CalendarItemChip = ({
  isDragging,
  tone = "neutral",
  dots,
  avatars,
  maxAvatars = 3,
  className,
  type,
  children,
  ...rest
}) => /* @__PURE__ */ jsxs("button", {
  type: type ?? "button",
  "data-cadence-item": true,
  className: cn("flex w-full items-center gap-1 rounded bg-accent px-1.5 py-0.5 text-left text-xs hover:bg-accent/80", ITEM_TONE_CLASSES[tone], isDragging && "shadow-lg ring-1 ring-primary", className),
  ...rest,
  children: [
    dots?.slice(0, 3).map((color, index) => /* @__PURE__ */ jsx("span", {
      className: "size-1.5 shrink-0 rounded-full",
      style: { backgroundColor: color }
    }, index)),
    children != null && /* @__PURE__ */ jsx("span", {
      className: "min-w-0 flex-1 truncate",
      children
    }),
    avatars && avatars.length > 0 && /* @__PURE__ */ jsxs("span", {
      className: "flex shrink-0 items-center -space-x-1",
      children: [
        avatars.slice(0, maxAvatars).map((avatar, index) => /* @__PURE__ */ jsx(CalendarItemAvatarCircle, {
          name: avatar.name,
          src: avatar.src
        }, index)),
        avatars.length > maxAvatars && /* @__PURE__ */ jsxs("span", {
          className: "inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-muted px-1 font-medium text-[0.5rem] leading-none ring-1 ring-background",
          children: [
            "+",
            avatars.length - maxAvatars
          ]
        })
      ]
    })
  ]
});
var CalendarMoreToggle = ({
  hiddenCount,
  isExpanded,
  className,
  type,
  ...rest
}) => /* @__PURE__ */ jsx("button", {
  type: type ?? "button",
  className: cn("px-1.5 py-0.5 text-left text-muted-foreground text-xs hover:text-foreground", className),
  ...rest,
  children: isExpanded ? "Show less" : `+${hiddenCount} more`
});
var useCalendarMonth = ({
  initialMonth,
  weekStartsOn = 0,
  timeZone = getLocalTimeZone()
} = {}) => {
  const [month, setMonth] = useState(() => initialMonth ?? today(timeZone).set({ day: 1 }));
  const grid = useMemo(() => buildMonthGrid(month, { weekStartsOn, today: today(timeZone) }), [month, weekStartsOn, timeZone]);
  const label = useMemo(() => new DateFormatter("en-US", {
    month: "long",
    year: "numeric"
  }).format(month.toDate(timeZone)), [month, timeZone]);
  const goToPrevious = useCallback(() => setMonth((current) => current.subtract({ months: 1 })), []);
  const goToNext = useCallback(() => setMonth((current) => current.add({ months: 1 })), []);
  const goToToday = useCallback(() => setMonth(today(timeZone).set({ day: 1 })), [timeZone]);
  return { month, grid, label, goToPrevious, goToNext, goToToday, setMonth };
};
var WEEK_START_FORMAT = new DateFormatter("en-US", {
  month: "short",
  day: "numeric"
});
var WEEK_END_FORMAT = new DateFormatter("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric"
});
var useCalendarView = ({
  range = "month",
  initialDate,
  weekStartsOn = 0,
  timeZone = getLocalTimeZone()
} = {}) => {
  const [anchor, setAnchor] = useState(() => initialDate ?? today(timeZone));
  const grid = useMemo(() => {
    const reference = today(timeZone);
    return range === "week" ? [buildWeekDays(anchor, { weekStartsOn, today: reference })] : buildMonthGrid(anchor.set({ day: 1 }), {
      weekStartsOn,
      today: reference
    });
  }, [range, anchor, weekStartsOn, timeZone]);
  const label = useMemo(() => {
    if (range === "week") {
      const days = buildWeekDays(anchor, { weekStartsOn });
      const start = parseDayKey(days[0].key).toDate(timeZone);
      const end = parseDayKey(days[days.length - 1].key).toDate(timeZone);
      return `${WEEK_START_FORMAT.format(start)} - ${WEEK_END_FORMAT.format(end)}`;
    }
    return new DateFormatter("en-US", {
      month: "long",
      year: "numeric"
    }).format(anchor.toDate(timeZone));
  }, [range, anchor, weekStartsOn, timeZone]);
  const goToPrevious = useCallback(() => setAnchor((current) => range === "week" ? current.subtract({ weeks: 1 }) : current.subtract({ months: 1 })), [range]);
  const goToNext = useCallback(() => setAnchor((current) => range === "week" ? current.add({ weeks: 1 }) : current.add({ months: 1 })), [range]);
  const goToToday = useCallback(() => setAnchor(today(timeZone)), [timeZone]);
  return { range, grid, label, goToPrevious, goToNext, goToToday, setAnchor };
};
var useDayOverflow = ({ count, maxVisible = 3 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasOverflow = count > maxVisible;
  const visibleCount = isExpanded || !hasOverflow ? count : maxVisible;
  const hiddenCount = Math.max(0, count - visibleCount);
  const toggle = useCallback(() => setIsExpanded((value) => !value), []);
  return { visibleCount, hiddenCount, hasOverflow, isExpanded, toggle };
};
export {
  CalendarDayCell,
  CalendarGrid,
  CalendarHeader,
  CalendarItemChip,
  CalendarMoreToggle,
  CalendarWeekdays,
  useCalendarMonth,
  useCalendarView,
  useDayOverflow
};
