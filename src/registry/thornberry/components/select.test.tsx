import { afterEach, describe, expect, mock, test } from "bun:test";

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import { OptionsSelect } from "@/registry/thornberry/components/select";

afterEach(() => {
  cleanup();
});

const options = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly", hint: "Most popular" },
  { value: "yearly", label: "Yearly", disabled: true },
];

describe("OptionsSelect", () => {
  test("shows the placeholder until a value is chosen", () => {
    render(
      <OptionsSelect
        value=""
        options={options}
        onValueChange={() => {}}
        placeholder="Pick a cadence"
        aria-label="Cadence"
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "Cadence" });
    expect(trigger.textContent).toContain("Pick a cadence");
  });

  test("shows the selected label and reports a new choice", async () => {
    const onValueChange = mock((_value: string) => {});
    render(
      <OptionsSelect
        value="weekly"
        options={options}
        onValueChange={onValueChange}
        label="Cadence"
      />,
    );

    expect(screen.getByRole("combobox").textContent).toContain("Weekly");

    await act(async () => {
      fireEvent.click(screen.getByRole("combobox"));
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("option", { name: /Monthly/ }));
    });

    expect(onValueChange).toHaveBeenCalledWith("monthly");
  });

  test("points the trigger at an external label via id", () => {
    render(
      <OptionsSelect
        id="cadence"
        value="weekly"
        options={options}
        onValueChange={() => {}}
      />,
    );

    expect(screen.getByRole("combobox").id).toBe("cadence");
  });
});
