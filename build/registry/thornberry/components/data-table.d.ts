import type { ColumnDef, FilterFn, SortingState } from "@tanstack/react-table";
import type { ReactNode } from "react";
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
declare const DataTable: <TData>({ columns, data, getRowId, searchPlaceholder, globalFilterFn, toolbar, enableSelection, rowSelectable, bulkActions, initialSorting, emptyLabel, }: DataTableProps<TData>) => import("react/jsx-runtime").JSX.Element;
export { DataTable, type DataTableProps };
