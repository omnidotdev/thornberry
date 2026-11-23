import { afterEach, describe, expect, mock, test } from "bun:test";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import { ConfirmDialog } from "@/registry/thornberry/components/confirm-dialog";

afterEach(() => {
  cleanup();
});

const baseProps = {
  open: true,
  onOpenChange: () => {},
  title: 'Delete product "Acme"?',
  confirmLabel: "Delete product",
  onConfirm: () => {},
};

describe("ConfirmDialog", () => {
  test("renders as an alert dialog and fires the confirm action", () => {
    const onConfirm = mock(() => {});
    render(<ConfirmDialog {...baseProps} onConfirm={onConfirm} />);

    expect(screen.getByRole("alertdialog")).toBeTruthy();
    fireEvent.click(screen.getByText("Delete product"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  test("shows the error from a failed attempt", () => {
    render(
      <ConfirmDialog {...baseProps} error="Could not delete the product" />,
    );

    expect(screen.getByRole("alert").textContent).toBe(
      "Could not delete the product",
    );
  });

  test("shows the pending label and disables both actions while pending", () => {
    render(
      <ConfirmDialog {...baseProps} isPending pendingLabel="Deleting..." />,
    );

    const confirm = screen.getByText("Deleting...").closest("button");
    expect(confirm?.disabled).toBe(true);
    expect(screen.getByText("Cancel").closest("button")?.disabled).toBe(true);
    expect(screen.queryByText("Delete product")).toBeNull();
  });

  test("styles the confirm button with confirmVariant", () => {
    const { rerender } = render(<ConfirmDialog {...baseProps} />);
    const destructive = screen.getByText("Delete product").className;
    expect(destructive).toContain("bg-destructive");

    rerender(<ConfirmDialog {...baseProps} confirmVariant="solid" />);
    const solid = screen.getByText("Delete product").className;
    expect(solid).toContain("bg-primary");
    expect(solid).not.toContain("bg-destructive");
  });
});
