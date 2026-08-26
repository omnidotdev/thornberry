import { afterEach, describe, expect, test } from "bun:test";

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
});
