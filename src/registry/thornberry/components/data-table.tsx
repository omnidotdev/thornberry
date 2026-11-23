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
import type {
  ColumnDef,
  FilterFn,
  OnChangeFn,
  SortingState,
} from "@tanstack/react-table";
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
  /** Stable row id (keeps selection across data changes); defaults to the row index */
  getRowId?: (row: TData) => string;
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
  /** Controlled sorting (e.g. kept in the URL); pair with `onSortingChange` */
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  emptyLabel?: string;
  /**
   * Rendered in place of the whole table, headers included, when `data` is
   * empty (a search with no matches still shows `emptyLabel`)
   */
  emptyState?: ReactNode;
  /** Makes rows clickable; interactive cells should stop propagation */
  onRowClick?: (row: TData) => void;
  /** Minimum table width (e.g. `"48rem"`), so narrow screens scroll it */
  minWidth?: string;
}

/** Per-column options read from `columnDef.meta` */
interface ColumnMeta {
  /** Right-align numeric columns (header and cells) */
  align?: "left" | "right";
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
  sorting: sortingProp,
  onSortingChange,
  emptyLabel = "No results found",
  emptyState,
  onRowClick,
  minWidth,
}: DataTableProps<TData>) => {
  const [sortingState, setSortingState] =
    useState<SortingState>(initialSorting);
  const sorting = sortingProp ?? sortingState;
  const setSorting: OnChangeFn<SortingState> = (updater) => {
    if (sortingProp === undefined) setSortingState(updater);
    onSortingChange?.(updater);
  };
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
    // Fall back to a case-insensitive substring match so the search box filters
    // out of the box when a consumer does not supply a custom globalFilterFn
    globalFilterFn: globalFilterFn ?? "includesString",
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

  if (data.length === 0 && emptyState) return <>{emptyState}</>;

  return (
    <div className="space-y-3">
      {(searchPlaceholder || toolbar) && (
        <div className="flex flex-wrap items-center gap-3">
          {searchPlaceholder && (
            <div className="relative max-w-sm flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
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
        <div className="border-primary/30 bg-primary/10 flex flex-wrap items-center gap-3 rounded-lg border px-3 py-2">
          <span className="text-primary text-sm font-medium">
            {selectedRows.length} selected
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {bulkActions?.(selectedRows, clearSelection)}
          </div>
          <button
            type="button"
            onClick={clearSelection}
            className="text-muted-foreground hover:text-foreground ml-auto text-sm transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* Horizontal scroll keeps rows a single uniform height: cells never wrap
          to a second line, wide tables scroll instead of growing taller */}
      <div className="overflow-x-auto">
        <Table style={minWidth ? { minWidth } : undefined}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  const alignRight =
                    (header.column.columnDef.meta as ColumnMeta | undefined)
                      ?.align === "right";
                  return (
                    <TableHead
                      key={header.id}
                      aria-sort={
                        sorted === "asc"
                          ? "ascending"
                          : sorted === "desc"
                            ? "descending"
                            : canSort
                              ? "none"
                              : undefined
                      }
                      className={cn(
                        "whitespace-nowrap",
                        alignRight && "text-right",
                      )}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className={cn(
                            "hover:text-foreground -ml-1 flex items-center gap-1.5 rounded px-1 py-0.5 transition-colors",
                            alignRight && "ml-auto flex-row-reverse",
                          )}
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
                            <ChevronsUpDown className="text-muted-foreground size-3.5" />
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
                  className="text-muted-foreground py-8 text-center text-sm"
                >
                  {emptyLabel}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    "h-14",
                    row.getIsSelected() && "bg-primary/5",
                    onRowClick && "cursor-pointer hover:bg-muted",
                  )}
                  onClick={
                    onRowClick ? () => onRowClick(row.original) : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "whitespace-nowrap",
                        (cell.column.columnDef.meta as ColumnMeta | undefined)
                          ?.align === "right" && "text-right",
                      )}
                    >
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
