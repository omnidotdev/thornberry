import { describe, expect, test } from "bun:test";

import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
  today,
} from "@internationalized/date";
import { act, renderHook } from "@testing-library/react";

import {
  useCalendarMonth,
  useCalendarView,
  useDayOverflow,
} from "@/registry/thornberry/components/calendar";

describe("useCalendarMonth", () => {
  test("opens on the given month with its grid and label", () => {
    const { result } = renderHook(() =>
      useCalendarMonth({ initialMonth: new CalendarDate(2026, 10, 1) }),
    );
    expect(result.current.label).toBe("October 2026");
    expect(result.current.grid).toHaveLength(6);
    // Oct 1 2026 is a Thursday, so a Sunday-start grid opens on Sep 27
    expect(result.current.grid[0]?.[0]?.key).toBe("2026-09-27");
  });

  test("navigates to the next and previous month", () => {
    const { result } = renderHook(() =>
      useCalendarMonth({ initialMonth: new CalendarDate(2026, 10, 1) }),
    );
    act(() => result.current.goToNext());
    expect(result.current.label).toBe("November 2026");
    act(() => result.current.goToPrevious());
    act(() => result.current.goToPrevious());
    expect(result.current.label).toBe("September 2026");
  });

  test("jumps back to the month containing today", () => {
    const timeZone = getLocalTimeZone();
    const expected = new DateFormatter("en-US", {
      month: "long",
      year: "numeric",
    }).format(today(timeZone).toDate(timeZone));

    const { result } = renderHook(() =>
      useCalendarMonth({ initialMonth: new CalendarDate(2020, 1, 1) }),
    );
    act(() => result.current.goToToday());
    expect(result.current.label).toBe(expected);
  });
});

describe("useCalendarView", () => {
  test("month range yields a 6x7 grid", () => {
    const { result } = renderHook(() =>
      useCalendarView({
        range: "month",
        initialDate: new CalendarDate(2026, 10, 1),
      }),
    );
    expect(result.current.grid).toHaveLength(6);
    expect(result.current.label).toBe("October 2026");
  });

  test("week range yields a single row of 7 and a range label", () => {
    const { result } = renderHook(() =>
      useCalendarView({
        range: "week",
        initialDate: new CalendarDate(2026, 10, 7),
      }),
    );
    expect(result.current.grid).toHaveLength(1);
    expect(result.current.grid[0]).toHaveLength(7);
    // Oct 7 2026 is a Wednesday; a Sunday-start week runs Oct 4 - Oct 10
    expect(result.current.grid[0]?.[0]?.key).toBe("2026-10-04");
    expect(result.current.label).toBe("Oct 4 - Oct 10, 2026");
  });

  test("week navigation steps by a week", () => {
    const { result } = renderHook(() =>
      useCalendarView({
        range: "week",
        initialDate: new CalendarDate(2026, 10, 7),
      }),
    );
    act(() => result.current.goToNext());
    expect(result.current.grid[0]?.[0]?.key).toBe("2026-10-11");
    act(() => result.current.goToPrevious());
    act(() => result.current.goToPrevious());
    expect(result.current.grid[0]?.[0]?.key).toBe("2026-09-27");
  });
});

describe("useDayOverflow", () => {
  test("shows all items when at or under the cap", () => {
    const { result } = renderHook(() => useDayOverflow({ count: 3 }));
    expect(result.current.hasOverflow).toBe(false);
    expect(result.current.visibleCount).toBe(3);
    expect(result.current.hiddenCount).toBe(0);
  });

  test("caps visible items and reports the hidden count", () => {
    const { result } = renderHook(() => useDayOverflow({ count: 7 }));
    expect(result.current.hasOverflow).toBe(true);
    expect(result.current.visibleCount).toBe(3);
    expect(result.current.hiddenCount).toBe(4);
  });

  test("toggle expands to all items and collapses back", () => {
    const { result } = renderHook(() =>
      useDayOverflow({ count: 7, maxVisible: 2 }),
    );
    expect(result.current.visibleCount).toBe(2);
    act(() => result.current.toggle());
    expect(result.current.isExpanded).toBe(true);
    expect(result.current.visibleCount).toBe(7);
    expect(result.current.hiddenCount).toBe(0);
    act(() => result.current.toggle());
    expect(result.current.visibleCount).toBe(2);
  });
});
