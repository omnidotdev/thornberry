import { afterEach, describe, expect, mock, test } from "bun:test";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import { DataTable } from "@/registry/thornberry/components/data-table";

import type { ColumnDef } from "@tanstack/react-table";

interface Row {
  id: string;
  name: string;
}

const data: Row[] = [
  { id: "1", name: "Alpha" },
  { id: "2", name: "Bravo" },
  { id: "3", name: "Charlie" },
];

const columns: ColumnDef<Row, unknown>[] = [
  { accessorKey: "name", header: "Name" },
];

const renderTable = (
  props: Partial<Parameters<typeof DataTable<Row>>[0]> = {},
) =>
  render(
    <DataTable
      columns={columns}
      data={data}
      getRowId={(row) => row.id}
      {...props}
    />,
  );

afterEach(() => {
  cleanup();
});

describe("DataTable", () => {
  test("renders a cell for every data row", () => {
    renderTable();
    expect(screen.getByText("Alpha")).toBeDefined();
    expect(screen.getByText("Bravo")).toBeDefined();
    expect(screen.getByText("Charlie")).toBeDefined();
  });

  test("global search narrows the visible rows", () => {
    renderTable({ searchPlaceholder: "Search..." });
    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "brav" },
    });
    expect(screen.queryByText("Bravo")).not.toBeNull();
    expect(screen.queryByText("Alpha")).toBeNull();
    expect(screen.queryByText("Charlie")).toBeNull();
  });

  test("shows the empty label when nothing matches", () => {
    renderTable({
      searchPlaceholder: "Search...",
      emptyLabel: "No results here",
    });
    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "zzz" },
    });
    expect(screen.getByText("No results here")).toBeDefined();
  });

  test("adds a select-all plus per-row checkbox when selection is enabled", () => {
    renderTable({ enableSelection: true });
    // one header select-all checkbox plus one per row
    expect(screen.getAllByRole("checkbox")).toHaveLength(data.length + 1);
  });

  test("omits checkboxes when selection is disabled", () => {
    renderTable();
    expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
  });

  test("renders emptyState in place of the table when there is no data", () => {
    renderTable({ data: [], emptyState: <p>No invoices yet</p> });

    expect(screen.getByText("No invoices yet")).toBeDefined();
    expect(screen.queryByRole("table")).toBeNull();
  });

  test("calls onRowClick with the row", () => {
    const onRowClick = mock((_row: Row) => {});
    renderTable({ onRowClick });

    fireEvent.click(screen.getByText("Bravo"));
    expect(onRowClick).toHaveBeenCalledWith(data[1] as Row);
  });

  test("follows controlled sorting and reports header clicks", () => {
    const onSortingChange = mock(() => {});
    renderTable({ sorting: [{ id: "name", desc: true }], onSortingChange });

    const cells = screen.getAllByRole("cell").map((cell) => cell.textContent);
    expect(cells).toEqual(["Charlie", "Bravo", "Alpha"]);
    expect(
      screen
        .getByRole("columnheader", { name: /Name/ })
        .getAttribute("aria-sort"),
    ).toBe("descending");

    fireEvent.click(screen.getByRole("button", { name: /Name/ }));
    expect(onSortingChange).toHaveBeenCalled();
  });
});
