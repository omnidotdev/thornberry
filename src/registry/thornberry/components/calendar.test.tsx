import { describe, expect, test } from "bun:test";

import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
  today,
} from "@internationalized/date";
import { act, renderHook } from "@testing-library/react";

import { useCalendarMonth } from "@/registry/thornberry/components/calendar";

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
