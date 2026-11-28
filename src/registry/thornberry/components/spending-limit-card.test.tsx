import { afterEach, describe, expect, mock, test } from "bun:test";

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";

import {
  SpendingLimitCard,
  formatUsdCents,
  parseSoftLimitInput,
  parseSpendingLimitInput,
  pausesOnSave,
  spendingLimitPercent,
} from "@/registry/thornberry/components/spending-limit-card";

import type { SpendingLimitValue } from "@/registry/thornberry/components/spending-limit-card";

afterEach(() => {
  cleanup();
});

const value = (
  overrides: Partial<SpendingLimitValue> = {},
): SpendingLimitValue => ({
  hardLimitCents: 8_000,
  currentSpendCents: 2_000,
  periodEnd: "2026-12-01T00:00:00.000Z",
  suspended: false,
  ...overrides,
});

const baseProps = {
  productName: "Herald",
  pausedUsage: "emails above your plan's included amount",
  canEdit: true,
  onSave: () => Promise.resolve(),
};

/** Open the form and type a new hard limit */
const editTo = (amount: string) => {
  fireEvent.click(screen.getByRole("button", { name: "Change limit" }));
  fireEvent.change(screen.getByLabelText("Monthly spending limit (USD)"), {
    target: { value: amount },
  });
};

describe("helpers", () => {
  test("formats cents as dollars, dropping zero cents", () => {
    expect(formatUsdCents(8_000)).toBe("$80");
    expect(formatUsdCents(135_050)).toBe("$1,350.50");
  });

  test("parses typed amounts within the $10 to $100,000 range", () => {
    expect(parseSpendingLimitInput("100")).toBe(10_000);
    expect(parseSpendingLimitInput("$1,350.50")).toBe(135_050);
    expect(parseSpendingLimitInput("9.99")).toBeNull();
    expect(parseSpendingLimitInput("100001")).toBeNull();
    expect(parseSpendingLimitInput("100000")).toBe(10_000_000);
    expect(parseSpendingLimitInput("-50")).toBeNull();
    expect(parseSpendingLimitInput("12.345")).toBeNull();
    expect(parseSpendingLimitInput("1e3")).toBeNull();
    expect(parseSpendingLimitInput("")).toBeNull();
  });

  test("parses an alert below the hard limit, empty clearing it", () => {
    expect(parseSoftLimitInput("", 10_000)).toBeNull();
    expect(parseSoftLimitInput("50", 10_000)).toBe(5_000);
    expect(parseSoftLimitInput("100", 10_000)).toBeUndefined();
    expect(parseSoftLimitInput("0", 10_000)).toBeUndefined();
  });

  test("pauses on save only at or below a nonzero spend", () => {
    expect(pausesOnSave(2_000, 2_000)).toBe(true);
    expect(pausesOnSave(1_500, 2_000)).toBe(true);
    expect(pausesOnSave(2_001, 2_000)).toBe(false);
    expect(pausesOnSave(1_000, 0)).toBe(false);
  });

  test("caps the used percentage at 100", () => {
    expect(spendingLimitPercent(2_000, 8_000)).toBe(25);
    expect(spendingLimitPercent(9_000, 8_000)).toBe(100);
    expect(spendingLimitPercent(9_000, null)).toBe(0);
  });
});

describe("SpendingLimitCard", () => {
  test("shows spend against the limit, the progress, and the period end", () => {
    render(<SpendingLimitCard {...baseProps} value={value()} />);

    expect(screen.getByText("$20 of $80")).toBeDefined();
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe(
      "25",
    );
    expect(screen.getByText("This period ends Dec 1, 2026.")).toBeDefined();
    expect(screen.getByText(/Herald plan's included amount/)).toBeDefined();
  });

  test("offers no remove action", () => {
    render(<SpendingLimitCard {...baseProps} value={value()} />);

    expect(screen.queryByRole("button", { name: /remove/i })).toBeNull();
  });

  test("lets a member view but not change the limit", () => {
    render(
      <SpendingLimitCard {...baseProps} canEdit={false} value={value()} />,
    );

    expect(screen.queryByRole("button", { name: "Change limit" })).toBeNull();
    expect(
      screen.getByText(
        "Only workspace owners and admins can change the spending limit.",
      ),
    ).toBeDefined();
  });

  test("tells a member who to ask when usage is paused", () => {
    render(
      <SpendingLimitCard
        {...baseProps}
        canEdit={false}
        value={value({ currentSpendCents: 8_000, suspended: true })}
      />,
    );

    expect(screen.getByRole("status").textContent).toContain(
      "emails above your plan's included amount are paused",
    );
    expect(screen.getByRole("status").textContent).toContain(
      "Ask a workspace owner or admin",
    );
  });

  test("saves a raised limit without a confirmation", async () => {
    const onSave = mock(() => Promise.resolve());
    render(
      <SpendingLimitCard {...baseProps} onSave={onSave} value={value()} />,
    );

    editTo("150");
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Save limit" }));
    });

    expect(onSave).toHaveBeenCalledWith({ hardLimitCents: 15_000 });
    expect(screen.queryByLabelText("Monthly spending limit (USD)")).toBeNull();
  });

  test("shows the valid range before any entry and links it to the input", () => {
    render(<SpendingLimitCard {...baseProps} value={value()} />);

    fireEvent.click(screen.getByRole("button", { name: "Change limit" }));
    const input = screen.getByLabelText("Monthly spending limit (USD)");
    const hint = screen.getByText("Enter an amount from $10 to $100,000.");

    expect(hint.className).toContain("text-muted-foreground");
    expect(input.getAttribute("aria-describedby")).toBe(hint.id);
  });

  test("refuses amounts outside the range", () => {
    render(<SpendingLimitCard {...baseProps} value={value()} />);

    editTo("5");
    const save = screen.getByRole("button", { name: "Save limit" });
    expect((save as HTMLButtonElement).disabled).toBe(true);
    const hint = screen.getByText("Enter an amount from $10 to $100,000.");
    expect(hint.className).toContain("text-destructive");
    expect(
      screen
        .getByLabelText("Monthly spending limit (USD)")
        .getAttribute("aria-describedby"),
    ).toBe(hint.id);

    fireEvent.change(screen.getByLabelText("Monthly spending limit (USD)"), {
      target: { value: "100001" },
    });
    expect((save as HTMLButtonElement).disabled).toBe(true);
  });

  test("confirms before a limit at or below the spend pauses usage", async () => {
    const onSave = mock(() => Promise.resolve());
    render(
      <SpendingLimitCard {...baseProps} onSave={onSave} value={value()} />,
    );

    editTo("20");
    fireEvent.click(screen.getByRole("button", { name: "Save limit" }));
    expect(onSave).not.toHaveBeenCalled();

    const dialog = await screen.findByRole("alertdialog");
    expect(
      within(dialog).getByText("Set the Herald spending limit to $20?"),
    ).toBeDefined();

    await act(async () => {
      fireEvent.click(
        within(dialog).getByRole("button", { name: "Set limit and pause" }),
      );
    });
    expect(onSave).toHaveBeenCalledWith({ hardLimitCents: 2_000 });
  });

  test("keeps the form open with the message when saving fails", async () => {
    const onSave = mock(() =>
      Promise.reject(new Error("The spending limit must be at least $10")),
    );
    render(
      <SpendingLimitCard {...baseProps} onSave={onSave} value={value()} />,
    );

    editTo("150");
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Save limit" }));
    });

    expect(screen.getByRole("alert").textContent).toBe(
      "The spending limit must be at least $10",
    );
    expect(screen.getByLabelText("Monthly spending limit (USD)")).toBeDefined();
  });

  test("offers to set a limit when none is set", () => {
    render(
      <SpendingLimitCard
        {...baseProps}
        value={value({ hardLimitCents: null })}
      />,
    );

    expect(
      screen.getByText("No limit set. Overage is not capped."),
    ).toBeDefined();
    expect(screen.getByRole("button", { name: "Set limit" })).toBeDefined();
    expect(screen.queryByRole("progressbar")).toBeNull();
  });

  test("edits the alert threshold with withSoftLimit", async () => {
    const onSave = mock(() => Promise.resolve());
    render(
      <SpendingLimitCard
        {...baseProps}
        withSoftLimit
        onSave={onSave}
        value={value({ softLimitCents: 5_000 })}
      />,
    );

    expect(screen.getByText("Alert email at $50.")).toBeDefined();
    editTo("80");
    const soft = screen.getByLabelText("Alert email at (USD)");
    fireEvent.change(soft, { target: { value: "90" } });
    const softError = screen.getByText(/alert amount below the spending limit/);
    expect(soft.getAttribute("aria-describedby")).toBe(softError.id);

    fireEvent.change(soft, { target: { value: "" } });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Save limit" }));
    });
    expect(onSave).toHaveBeenCalledWith({
      hardLimitCents: 8_000,
      softLimitCents: null,
    });
  });

  test("shows the empty, loading, and error states", () => {
    const { rerender } = render(
      <SpendingLimitCard {...baseProps} value={null} />,
    );
    expect(
      screen.getByText("No spending limit applies to this plan."),
    ).toBeDefined();
    expect(screen.queryByRole("button", { name: "Set limit" })).toBeNull();

    rerender(
      <SpendingLimitCard
        {...baseProps}
        value={undefined}
        error="Couldn't load the spending limit."
      />,
    );
    expect(screen.getByText("Couldn't load the spending limit.")).toBeDefined();

    rerender(<SpendingLimitCard {...baseProps} value={undefined} isLoading />);
    expect(document.querySelector("[aria-busy]")).not.toBeNull();
  });

  test("renders a row with the product heading, meta, and action", () => {
    render(
      <SpendingLimitCard
        {...baseProps}
        variant="row"
        meta="Growth plan"
        action={<a href="https://herald.omni.dev">Open Herald</a>}
        value={value()}
      />,
    );

    expect(screen.getByText("Herald")).toBeDefined();
    expect(screen.getByText("Growth plan")).toBeDefined();
    expect(screen.getByText("Open Herald")).toBeDefined();
    expect(
      screen.getByRole("button", { name: "Change limit for Herald" }),
    ).toBeDefined();
  });

  test("names a row's set button after its visible text", () => {
    render(
      <SpendingLimitCard
        {...baseProps}
        variant="row"
        value={value({ hardLimitCents: null })}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Set limit for Herald" }),
    ).toBeDefined();
  });
});
