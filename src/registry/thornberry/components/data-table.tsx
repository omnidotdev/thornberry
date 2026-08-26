import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronsUpDown,
  Minus,
  Search,
} from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import {
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxRoot,
} from "@/registry/thornberry/components/checkbox";
import { Input } from "@/registry/thornberry/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/thornberry/components/table";

import type { CheckboxCheckedState } from "@ark-ui/react/checkbox";
import type { ColumnDef, FilterFn, SortingState } from "@tanstack/react-table";
import type { ReactNode } from "react";

/**
 * Selection checkbox composed from the thornberry checkbox primitives. Ark's
 * checkbox is a composition rather than a single controlled element, so the
 * data table wraps it into the boolean/indeterminate contract TanStack Table
 * expects for its select-all and per-row toggles.
 */
const SelectionCheckbox = ({
  checked,
  onCheckedChange,
  "aria-label": ariaLabel,
}: {
  checked: CheckboxCheckedState;
  onCheckedChange: (checked: CheckboxCheckedState) => void;
  "aria-label": string;
}) => (
  <CheckboxRoot
    checked={checked}
    onCheckedChange={(details) => onCheckedChange(details.checked)}
    aria-label={ariaLabel}
  >
    <CheckboxControl className="size-4 rounded-sm">
      <CheckboxIndicator>
        <Check className="size-3" />
      </CheckboxIndicator>
      <CheckboxIndicator indeterminate>
        <Minus className="size-3" />
      </CheckboxIndicator>
    </CheckboxControl>
    <CheckboxHiddenInput />
  </CheckboxRoot>
);

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  getRowId: (row: TData) => string;
  /** Show a global search box with this placeholder when provided. */
  searchPlaceholder?: string;
  /**
   * Override how the search box matches a row. Defaults to TanStack's built-in
   * per-column match, which only covers accessor columns. Pass a custom fn to
   * search fields that aren't shown as their own column (e.g. tag arrays).
   */
  globalFilterFn?: FilterFn<TData>;
  /** Custom filter controls (e.g. category pills) rendered in the toolbar. */
  toolbar?: ReactNode;
  /** Enable a leading selection column plus the bulk action bar. */
  enableSelection?: boolean;
  /** Gate which rows are selectable. Defaults to all. */
  rowSelectable?: (row: TData) => boolean;
  /** Renders inside the bulk bar; receives the selected rows and a reset fn. */
  bulkActions?: (rows: TData[], clearSelection: () => void) => ReactNode;
  initialSorting?: SortingState;
  emptyLabel?: string;
}

// biome-ignore lint/suspicious/noExplicitAny: TanStack column defs are heterogeneous
type AnyColumnDef<TData> = ColumnDef<TData, any>;

/**
 * Advanced data table built on TanStack Table. Supports column definitions, a
 * global search box, sortable headers, a custom filter toolbar slot, optional
 * row selection with a bulk action bar, initial sorting, an empty state, and
 * uniform row heights inside a horizontal-scroll container.
 *
 * @example
 * <DataTable
 *   columns={columns}
 *   data={rows}
 *   getRowId={(row) => row.id}
 *   searchPlaceholder="Search clients"
 *   enableSelection
 *   bulkActions={(rows, clear) => (
 *     <Button onClick={() => archive(rows)}>Archive {rows.length}</Button>
 *   )}
 * />
 */
const DataTable = <TData,>({
  columns,
  data,
  getRowId,
  searchPlaceholder,
  globalFilterFn,
  toolbar,
  enableSelection = false,
  rowSelectable,
  bulkActions,
  initialSorting = [],
  emptyLabel = "No results found",
}: DataTableProps<TData>) => {
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  const selectionColumn: AnyColumnDef<TData> = {
    id: "select",
    enableSorting: false,
    size: 36,
    header: ({ table }) => (
      <SelectionCheckbox
        aria-label="Select all rows"
        checked={
          table.getIsAllRowsSelected()
            ? true
            : table.getIsSomeRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={(value) => table.toggleAllRowsSelected(value === true)}
      />
    ),
    cell: ({ row }) => (
      <SelectionCheckbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(value === true)}
      />
    ),
  };

  const table = useReactTable({
    data,
    columns: enableSelection
      ? [selectionColumn, ...(columns as AnyColumnDef<TData>[])]
      : columns,
    getRowId,
    globalFilterFn,
    state: { sorting, globalFilter, rowSelection },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: enableSelection
      ? rowSelectable
        ? (row) => rowSelectable(row.original)
        : true
      : false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);
  const clearSelection = () => setRowSelection({});

  return (
    <div className="space-y-3">
      {(searchPlaceholder || toolbar) && (
        <div className="flex flex-wrap items-center gap-3">
          {searchPlaceholder && (
            <div className="relative max-w-sm flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10"
              />
            </div>
          )}
          {toolbar}
        </div>
      )}

      {enableSelection && selectedRows.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2">
          <span className="font-medium text-primary text-sm">
            {selectedRows.length} selected
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {bulkActions?.(selectedRows, clearSelection)}
          </div>
          <button
            type="button"
            onClick={clearSelection}
            className="ml-auto text-muted-foreground text-sm transition-colors hover:text-foreground"
          >
            Clear
          </button>
        </div>
      )}

      {/* Horizontal scroll keeps rows a single uniform height: cells never wrap
          to a second line, wide tables scroll instead of growing taller */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <TableHead
                      key={header.id}
                      className="whitespace-nowrap"
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="-ml-1 flex items-center gap-1.5 rounded px-1 py-0.5 transition-colors hover:text-foreground"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {sorted === "asc" ? (
                            <ArrowUp className="size-3.5" />
                          ) : sorted === "desc" ? (
                            <ArrowDown className="size-3.5" />
                          ) : (
                            <ChevronsUpDown className="size-3.5 text-muted-foreground" />
                          )}
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="py-8 text-center text-muted-foreground text-sm"
                >
                  {emptyLabel}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn("h-14", row.getIsSelected() && "bg-primary/5")}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export { DataTable, type DataTableProps };
