import { afterEach, describe, expect, mock, test } from "bun:test";

import { parseAbsolute } from "@internationalized/date";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import {
  DateTimePicker,
  describeTimeZone,
  formatOffset,
  formatTime,
  normalizeDigits,
  parseTimeInput,
  toIsoWithOffset,
  toZonedDateTime,
} from "@/registry/thornberry/components/date-time-picker";

import type { DateTimePickerValueChangeDetails } from "@/registry/thornberry/components/date-time-picker";

afterEach(cleanup);

const NY = "America/New_York";

const renderPicker = (
  props: Partial<Parameters<typeof DateTimePicker>[0]> = {},
) => {
  const changes: DateTimePickerValueChangeDetails[] = [];
  const onValueChange = mock((d: DateTimePickerValueChangeDetails) => {
    changes.push(d);
  });
  const utils = render(
    <DateTimePicker
      locale="en-US"
      timeZone={NY}
      label="Send at"
      onValueChange={onValueChange}
      {...props}
    />,
  );
  const time = screen.getByLabelText("Time") as HTMLInputElement;
  const last = () => changes.at(-1);
  return { ...utils, changes, onValueChange, time, last };
};

const typeTime = (input: HTMLInputElement, text: string) => {
  fireEvent.change(input, { target: { value: text } });
  fireEvent.blur(input);
};

describe("helpers", () => {
  test("parseTimeInput reads common typed forms", () => {
    expect(parseTimeInput("9")).toEqual({ hour: 9, minute: 0 });
    expect(parseTimeInput("9:30")).toEqual({ hour: 9, minute: 30 });
    expect(parseTimeInput("930")).toEqual({ hour: 9, minute: 30 });
    expect(parseTimeInput("0930")).toEqual({ hour: 9, minute: 30 });
    expect(parseTimeInput("9:30 PM")).toEqual({ hour: 21, minute: 30 });
    expect(parseTimeInput("9.30 p.m.")).toEqual({ hour: 21, minute: 30 });
    expect(parseTimeInput("12am")).toEqual({ hour: 0, minute: 0 });
    expect(parseTimeInput("12:15 pm")).toEqual({ hour: 12, minute: 15 });
    expect(parseTimeInput("21:45")).toEqual({ hour: 21, minute: 45 });
    expect(parseTimeInput("21h45")).toEqual({ hour: 21, minute: 45 });
  });

  test("parseTimeInput rejects non-times", () => {
    expect(parseTimeInput("")).toBeNull();
    expect(parseTimeInput("25:00")).toBeNull();
    expect(parseTimeInput("9:75")).toBeNull();
    expect(parseTimeInput("13pm")).toBeNull();
    expect(parseTimeInput("noon")).toBeNull();
  });

  test("toIsoWithOffset writes the zone's offset, including DST and half hours", () => {
    expect(toIsoWithOffset(parseAbsolute("2026-01-15T14:00:00Z", NY))).toBe(
      "2026-01-15T09:00:00-05:00",
    );
    expect(toIsoWithOffset(parseAbsolute("2026-07-15T14:00:00Z", NY))).toBe(
      "2026-07-15T10:00:00-04:00",
    );
    expect(
      toIsoWithOffset(parseAbsolute("2026-07-15T14:00:00Z", "Asia/Kolkata")),
    ).toBe("2026-07-15T19:30:00+05:30");
    expect(toIsoWithOffset(parseAbsolute("2026-07-15T14:00:00Z", "UTC"))).toBe(
      "2026-07-15T14:00:00+00:00",
    );
    expect(formatOffset(-(3 * 60 + 30) * 60000)).toBe("-03:30");
  });

  test("toZonedDateTime reads ISO strings and Dates, and rejects junk", () => {
    expect(
      toZonedDateTime("2026-11-20T09:00:00-05:00", NY)?.toDate().toISOString(),
    ).toBe("2026-11-20T14:00:00.000Z");
    expect(toZonedDateTime(new Date("2026-11-20T14:00:00Z"), NY)?.hour).toBe(9);
    expect(toZonedDateTime("next tuesday", NY)).toBeNull();
    expect(toZonedDateTime(new Date("nope"), NY)).toBeNull();
  });

  test("describeTimeZone names the zone, its id, and its offset", () => {
    const label = describeTimeZone(
      NY,
      new Date("2026-01-15T12:00:00Z"),
      "en-US",
    );
    expect(label).toContain("Eastern Standard Time");
    expect(label).toContain(NY);
    expect(label).toContain("GMT-05:00");
  });
});

describe("DateTimePicker", () => {
  test("shows the time zone explicitly", () => {
    renderPicker({ defaultValue: "2026-11-20T09:00:00-05:00" });
    const zone = screen.getByText(/Time zone:/);
    expect(zone.textContent).toContain(NY);
    expect(zone.textContent).toContain("GMT-05:00");
    // and the time field is described by it
    const time = screen.getByLabelText("Time");
    expect(time.getAttribute("aria-describedby")).toContain(zone.id);
  });

  test("defaults the zone to the browser's", () => {
    render(<DateTimePicker locale="en-US" />);
    expect(screen.getByText(/Time zone:/).textContent).toContain(
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    );
  });

  test("emits ISO 8601 with the zone offset when the time changes", () => {
    const { time, last } = renderPicker({
      defaultValue: "2026-11-20T09:00:00-05:00",
    });
    expect(time.value).toBe("9:00 AM");

    typeTime(time, "2:30 pm");
    expect(last()?.value).toBe("2026-11-20T14:30:00-05:00");
    expect(last()?.date?.toISOString()).toBe("2026-11-20T19:30:00.000Z");
    expect(last()?.timeZone).toBe(NY);
    expect(last()?.error).toBeNull();
    // the typed time is normalized for display
    expect(time.value).toBe("2:30 PM");
  });

  test("uses the summer offset for a date in daylight time", () => {
    const { time, last } = renderPicker({
      defaultValue: "2026-07-04T10:00:00-04:00",
    });
    typeTime(time, "10:15");
    expect(last()?.value).toBe("2026-07-04T10:15:00-04:00");
  });

  test("reads a Date value in the given zone", () => {
    const { time } = renderPicker({
      value: new Date("2026-11-20T15:00:00Z"),
      timeZone: "Asia/Kolkata",
    });
    expect(time.value).toBe("8:30 PM");
  });

  test("picking a date first fills in the default time", async () => {
    const { last, container } = renderPicker();
    const dateInput = container.querySelector<HTMLInputElement>(
      "[data-scope='date-picker'][data-part='input']",
    );
    if (!dateInput) throw new Error("no date input");
    await act(async () => {
      fireEvent.change(dateInput, { target: { value: "12/01/2026" } });
      fireEvent.keyDown(dateInput, { key: "Enter" });
    });
    await waitFor(() =>
      expect(last()?.value).toBe("2026-12-01T09:00:00-05:00"),
    );
    expect((screen.getByLabelText("Time") as HTMLInputElement).value).toBe(
      "9:00 AM",
    );
  });

  test("arrow keys step the time by stepMinutes", () => {
    const { time, last } = renderPicker({
      defaultValue: "2026-11-20T09:07:00-05:00",
    });
    fireEvent.keyDown(time, { key: "ArrowUp" });
    expect(last()?.value).toBe("2026-11-20T09:15:00-05:00");
    fireEvent.keyDown(time, { key: "ArrowUp" });
    expect(last()?.value).toBe("2026-11-20T09:30:00-05:00");
    fireEvent.keyDown(time, { key: "ArrowDown" });
    expect(last()?.value).toBe("2026-11-20T09:15:00-05:00");
  });

  test("suggests times every 15 minutes", () => {
    const { container } = renderPicker();
    const options = container.querySelectorAll("datalist option");
    expect(options).toHaveLength(96);
    expect(options[1]?.getAttribute("value")).toBe("12:15 AM");
  });

  test("flags a time it cannot read", () => {
    const { time, last } = renderPicker({
      defaultValue: "2026-11-20T09:00:00-05:00",
    });
    typeTime(time, "25:99");
    expect(last()?.value).toBeNull();
    expect(last()?.error).toBe("invalid-time");
    expect(time.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByRole("alert").textContent).toContain("Enter a time");
  });

  test("respects minValue: rejects earlier times and allows later ones", () => {
    const { time, last } = renderPicker({
      defaultValue: "2026-11-20T13:00:00-05:00",
      minValue: "2026-11-20T12:00:00-05:00",
    });

    typeTime(time, "11:00");
    expect(last()?.value).toBeNull();
    expect(last()?.error).toBe("before-min");
    expect(screen.getByRole("alert").textContent).toContain(
      "on or after Nov 20, 2026, 12:00 PM",
    );

    typeTime(time, "12:15");
    expect(last()?.value).toBe("2026-11-20T12:15:00-05:00");
    expect(last()?.error).toBeNull();
    expect(screen.queryByRole("alert") === null).toBe(true);
  });

  test("minValue in another zone is compared as the same instant", () => {
    const { time, last } = renderPicker({
      defaultValue: "2026-11-20T13:00:00-05:00",
      // 17:30 UTC is 12:30 in New York
      minValue: new Date("2026-11-20T17:30:00Z"),
    });
    typeTime(time, "12:15");
    expect(last()?.error).toBe("before-min");
    typeTime(time, "12:30");
    expect(last()?.value).toBe("2026-11-20T12:30:00-05:00");
  });

  test("minValue drops earlier suggestions on its day", () => {
    const { container } = renderPicker({
      defaultValue: "2026-11-20T13:00:00-05:00",
      minValue: "2026-11-20T12:00:00-05:00",
    });
    const options = Array.from(
      container.querySelectorAll("datalist option"),
    ).map((o) => o.getAttribute("value"));
    expect(options[0]).toBe("12:00 PM");
    expect(options).not.toContain("11:45 AM");
  });

  test("minValue disables earlier days in the calendar", async () => {
    const { container } = renderPicker({
      defaultValue: "2026-11-20T13:00:00-05:00",
      minValue: "2026-11-20T12:00:00-05:00",
    });
    const trigger = container.querySelector<HTMLElement>(
      "[data-scope='date-picker'][data-part='trigger']",
    );
    if (!trigger) throw new Error("no trigger");
    await act(async () => {
      fireEvent.click(trigger);
    });
    const cell = (day: string) =>
      container.querySelector(
        `[data-scope='date-picker'][data-part='table-cell-trigger'][data-value='${day}']`,
      );
    await waitFor(() => expect(cell("2026-11-19")).not.toBeNull());
    expect(cell("2026-11-19")?.hasAttribute("data-disabled")).toBe(true);
    expect(cell("2026-11-21")?.hasAttribute("data-disabled")).toBe(false);
  });

  test("a controlled value follows the parent without clobbering typing", () => {
    const { time, rerender, onValueChange } = renderPicker({
      value: "2026-11-20T09:00:00-05:00",
    });
    rerender(
      <DateTimePicker
        locale="en-US"
        timeZone={NY}
        value="2026-11-21T16:45:00-05:00"
        onValueChange={onValueChange}
      />,
    );
    expect(time.value).toBe("4:45 PM");

    // a partial entry stays put while the parent keeps its value
    fireEvent.change(time, { target: { value: "5:1" } });
    rerender(
      <DateTimePicker
        locale="en-US"
        timeZone={NY}
        value="2026-11-21T16:45:00-05:00"
        onValueChange={onValueChange}
      />,
    );
    expect(time.value).toBe("5:1");
  });

  test("submits the ISO value through a hidden input when named", () => {
    const { container, time } = renderPicker({
      name: "sendAt",
      defaultValue: "2026-11-20T09:00:00-05:00",
    });
    typeTime(time, "10:00");
    expect(
      container
        .querySelector<HTMLInputElement>('input[name="sendAt"]')
        ?.getAttribute("value"),
    ).toBe("2026-11-20T10:00:00-05:00");
  });
});

describe("localized time entry", () => {
  const locales = [
    "en-US",
    "en-GB",
    "de-DE",
    "fr-FR",
    "es-ES",
    "ja-JP",
    "hi-IN",
    "ko-KR",
    "zh-TW",
    "ar-EG",
    "fa-IR",
    "bn-BD",
  ];

  test.each(locales)("%s reads back its own formatted times", (locale) => {
    for (const time of [
      { hour: 21, minute: 30 },
      { hour: 9, minute: 5 },
      { hour: 0, minute: 0 },
      { hour: 12, minute: 45 },
    ]) {
      expect(parseTimeInput(formatTime(time, locale), locale)).toEqual(time);
    }
  });

  test("normalizes localized digits", () => {
    expect(normalizeDigits("٢١:٣٠")).toBe("21:30");
    expect(normalizeDigits("۲۱:۳۰")).toBe("21:30");
    expect(normalizeDigits("৯:৩০")).toBe("9:30");
    expect(normalizeDigits("२१:३०")).toBe("21:30");
  });

  test("English forms still work in a 24-hour locale", () => {
    expect(parseTimeInput("9:30 pm", "de-DE")).toEqual({
      hour: 21,
      minute: 30,
    });
  });

  test("the picker accepts what it shows in an Arabic locale", () => {
    const changes: DateTimePickerValueChangeDetails[] = [];
    render(
      <DateTimePicker
        locale="ar-EG"
        timeZone={NY}
        defaultValue="2026-11-20T09:00:00-05:00"
        onValueChange={(d) => changes.push(d)}
      />,
    );
    const time = screen.getByLabelText("Time") as HTMLInputElement;
    const shown = formatTime({ hour: 21, minute: 30 }, "ar-EG");
    fireEvent.change(time, { target: { value: shown } });
    fireEvent.blur(time);
    expect(changes.at(-1)?.value).toBe("2026-11-20T21:30:00-05:00");
  });
});

describe("time zone changes", () => {
  test("a new timeZone keeps the moment and reports the new offset", () => {
    const changes: DateTimePickerValueChangeDetails[] = [];
    const view = (tz: string) => (
      <DateTimePicker
        locale="en-US"
        timeZone={tz}
        name="at"
        defaultValue="2026-11-20T09:00:00-05:00"
        onValueChange={(d) => changes.push(d)}
      />
    );
    const { container, rerender } = render(view(NY));
    const time = screen.getByLabelText("Time") as HTMLInputElement;
    typeTime(time, "10:00");
    expect(changes.at(-1)?.value).toBe("2026-11-20T10:00:00-05:00");
    const before = changes.length;

    rerender(view("Europe/London"));
    expect(changes.length).toBe(before + 1);
    expect(changes.at(-1)?.value).toBe("2026-11-20T15:00:00+00:00");
    expect(changes.at(-1)?.timeZone).toBe("Europe/London");
    expect(changes.at(-1)?.date?.toISOString()).toBe(
      "2026-11-20T15:00:00.000Z",
    );
    expect(time.value).toBe("3:00 PM");
    expect(
      container
        .querySelector<HTMLInputElement>('input[name="at"]')
        ?.getAttribute("value"),
    ).toBe("2026-11-20T15:00:00+00:00");
  });
});

describe("daylight saving", () => {
  test("a skipped time moves forward and says so", () => {
    const { time, last } = renderPicker({
      defaultValue: "2026-03-08T01:00:00-05:00",
    });
    typeTime(time, "2:30 am");
    expect(last()?.value).toBe("2026-03-08T03:30:00-04:00");
    expect(time.value).toBe("3:30 AM");
    expect(
      screen.getByText(/2:30 AM doesn't exist on this date/).textContent,
    ).toContain("using 3:30 AM");
  });

  test("a repeated time uses the first occurrence and offers the second", () => {
    const { time, last } = renderPicker({
      defaultValue: "2026-11-01T00:00:00-04:00",
    });
    typeTime(time, "1:30 am");
    expect(last()?.value).toBe("2026-11-01T01:30:00-04:00");
    expect(screen.getByText(/happens twice/).textContent).toContain(
      "using the first (UTC-04:00)",
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Use the second 1:30 AM (UTC-05:00)",
      }),
    );
    expect(last()?.value).toBe("2026-11-01T01:30:00-05:00");
    expect(
      Boolean(
        screen.getByRole("button", {
          name: "Use the first 1:30 AM (UTC-04:00)",
        }),
      ),
    ).toBe(true);
  });

  test("a value on the second occurrence opens with it chosen", () => {
    renderPicker({ defaultValue: "2026-11-01T01:30:00-05:00" });
    expect(screen.getByText(/happens twice/).textContent).toContain(
      "using the second (UTC-05:00)",
    );
  });

  test("a value naming a skipped time shows the same note", () => {
    const { time } = renderPicker({ defaultValue: "2026-03-08T02:30" });
    expect(time.value).toBe("3:30 AM");
    expect(
      screen.getByText(/2:30 AM doesn't exist on this date/).textContent,
    ).toContain("using 3:30 AM");
  });

  test("the note stays when the moved time is committed again on blur", () => {
    const { time } = renderPicker({
      defaultValue: "2026-03-08T01:00:00-05:00",
    });
    fireEvent.change(time, { target: { value: "2:30 AM" } });
    fireEvent.blur(time);
    expect(time.value).toBe("3:30 AM");
    fireEvent.blur(time);
    expect(
      Boolean(screen.queryByText(/2:30 AM doesn't exist on this date/)),
    ).toBe(true);
    // a different time clears it
    typeTime(time, "4:00 am");
    expect(screen.queryByText(/doesn't exist/) === null).toBe(true);
  });

  test("no note on an ordinary date", () => {
    renderPicker({ defaultValue: "2026-11-20T01:30:00-05:00" });
    expect(screen.queryByText(/happens twice|doesn't exist/) === null).toBe(
      true,
    );
  });
});

describe("bounds", () => {
  test("a minValue without an offset is read in the picker's zone, with a warning", () => {
    const warn = mock(() => {});
    const original = console.warn;
    console.warn = warn;
    try {
      const { time, last } = renderPicker({
        defaultValue: "2026-11-20T13:00:00-05:00",
        minValue: "2026-11-20T12:00:00",
      });
      typeTime(time, "8:00");
      expect(last()?.error).toBe("before-min");
      typeTime(time, "12:15");
      expect(last()?.value).toBe("2026-11-20T12:15:00-05:00");
      expect(warn).toHaveBeenCalled();
    } finally {
      console.warn = original;
    }
  });

  test('minValue="now" checks against the current time on every change', () => {
    const { time, last } = renderPicker({
      defaultValue: "2020-01-01T09:00:00-05:00",
      minValue: "now",
    });
    typeTime(time, "10:00");
    // already before the minimum when opened, so nothing new is reported, but
    // the entry is refused and explained
    expect(last()?.value ?? null).toBeNull();
    expect(screen.getByRole("alert").textContent).toContain("on or after");
    cleanup();
    const later = renderPicker({
      defaultValue: "2099-01-01T09:00:00-05:00",
      minValue: "now",
    });
    typeTime(later.time, "10:00");
    expect(later.last()?.value).toBe("2099-01-01T10:00:00-05:00");
  });

  test("a minValue with seconds drops the minute it falls in from suggestions", () => {
    const { container } = renderPicker({
      defaultValue: "2026-11-20T13:00:00-05:00",
      minValue: "2026-11-20T12:00:30-05:00",
    });
    const options = Array.from(
      container.querySelectorAll("datalist option"),
    ).map((o) => o.getAttribute("value"));
    expect(options[0]).toBe("12:15 PM");
  });
});
