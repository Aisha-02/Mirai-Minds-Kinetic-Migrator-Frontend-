"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

export type AlvColumn<T extends Record<string, unknown>> = {
  key: keyof T & string;
  label: string;
  /** auto: dropdown when ≤24 distinct values, otherwise text */
  filter?: "text" | "select" | "auto" | "none";
  sortable?: boolean;
  align?: "left" | "right" | "center";
  headerClassName?: string;
  cellClassName?: string;
  render?: (value: unknown, row: T) => ReactNode;
};

type SortState = { key: string; direction: "asc" | "desc" } | null;

type AlvDataGridProps<T extends Record<string, unknown>> = {
  rows: T[];
  columns: AlvColumn<T>[];
  getRowId: (row: T) => string;
  pageSize?: number;
  emptyMessage?: string;
  /** When set with onFiltersChange, filters are controlled by the parent */
  filters?: Record<string, string>;
  onFiltersChange?: (filters: Record<string, string>) => void;
  /** Bump to reset sort + page (e.g. when parent clears filters) */
  resetSignal?: number;
};

function cellText(value: unknown): string {
  if (value == null) return "";
  return String(value);
}

function compareValues(a: unknown, b: unknown): number {
  const left = cellText(a);
  const right = cellText(b);
  const leftNum = Number(left.replace(/,/g, ""));
  const rightNum = Number(right.replace(/,/g, ""));
  if (
    left !== "" &&
    right !== "" &&
    Number.isFinite(leftNum) &&
    Number.isFinite(rightNum)
  ) {
    return leftNum - rightNum;
  }
  return left.localeCompare(right, undefined, { sensitivity: "base" });
}

function resolveFilterMode<T extends Record<string, unknown>>(
  column: AlvColumn<T>,
  distinctCount: number,
): "text" | "select" | "none" {
  if (column.filter === "none") return "none";
  if (column.filter === "text" || column.filter === "select") {
    return column.filter;
  }
  if (distinctCount > 0 && distinctCount <= 24) return "select";
  return "text";
}

export function AlvDataGrid<T extends Record<string, unknown>>({
  rows,
  columns,
  getRowId,
  pageSize = 25,
  emptyMessage = "No rows to display",
  filters: controlledFilters,
  onFiltersChange,
  resetSignal = 0,
}: AlvDataGridProps<T>) {
  const [internalFilters, setInternalFilters] = useState<
    Record<string, string>
  >({});
  const [sort, setSort] = useState<SortState>(null);
  const [page, setPage] = useState(0);

  const filters = controlledFilters ?? internalFilters;
  const isControlled = Boolean(onFiltersChange);

  useEffect(() => {
    if (resetSignal > 0) {
      setSort(null);
      setPage(0);
    }
  }, [resetSignal]);

  function updateFilters(next: Record<string, string>) {
    if (isControlled) onFiltersChange?.(next);
    else setInternalFilters(next);
    setPage(0);
  }

  const distinctByColumn = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const column of columns) {
      const values = new Set<string>();
      for (const row of rows) {
        const text = cellText(row[column.key]);
        if (text) values.add(text);
      }
      map[column.key] = [...values].sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" }),
      );
    }
    return map;
  }, [columns, rows]);

  const filteredSorted = useMemo(() => {
    let next = rows;

    const activeFilters = Object.entries(filters).filter(
      ([, value]) => value.trim() !== "",
    );
    if (activeFilters.length > 0) {
      next = next.filter((row) =>
        activeFilters.every(([key, raw]) => {
          const cell = cellText(row[key]).toLowerCase();
          const query = raw.trim().toLowerCase();
          const column = columns.find((c) => c.key === key);
          const mode = resolveFilterMode(
            column ?? { key: key as keyof T & string, label: key },
            distinctByColumn[key]?.length ?? 0,
          );
          if (mode === "select") return cell === query;
          return cell.includes(query);
        }),
      );
    }

    if (sort) {
      const { key, direction } = sort;
      next = [...next].sort((a, b) => {
        const result = compareValues(a[key], b[key]);
        return direction === "asc" ? result : -result;
      });
    }

    return next;
  }, [rows, filters, sort, columns, distinctByColumn]);

  const pageCount = Math.max(1, Math.ceil(filteredSorted.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = filteredSorted.slice(
    safePage * pageSize,
    safePage * pageSize + pageSize,
  );

  function setFilter(key: string, value: string) {
    updateFilters({ ...filters, [key]: value });
  }

  function toggleSort(key: string) {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, direction: "asc" };
      if (prev.direction === "asc") return { key, direction: "desc" };
      return null;
    });
  }

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-high">
              {columns.map((column) => {
                const sortable = column.sortable !== false;
                const active = sort?.key === column.key;
                const align =
                  column.align === "right"
                    ? "text-right"
                    : column.align === "center"
                      ? "text-center"
                      : "text-left";
                return (
                  <th
                    key={column.key}
                    className={`whitespace-nowrap p-4 font-label-caps text-label-caps font-semibold tracking-wider text-on-surface uppercase ${align} ${column.headerClassName ?? ""}`}
                  >
                    {sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(column.key)}
                        className="inline-flex items-center gap-1 transition-colors hover:text-white"
                      >
                        {column.label}
                        <Icon
                          name={
                            active
                              ? sort.direction === "asc"
                                ? "arrow_upward"
                                : "arrow_downward"
                              : "unfold_more"
                          }
                          className={`text-[14px] ${active ? "text-primary" : "opacity-40"}`}
                        />
                      </button>
                    ) : (
                      column.label
                    )}
                  </th>
                );
              })}
            </tr>
            <tr className="border-b border-outline-variant bg-surface-container-high">
              {columns.map((column) => {
                const distinct = distinctByColumn[column.key] ?? [];
                const mode = resolveFilterMode(column, distinct.length);
                const value = filters[column.key] ?? "";
                return (
                  <th
                    key={`filter-${column.key}`}
                    className={`px-4 pb-3 pt-0 align-top ${column.headerClassName ?? ""}`}
                  >
                    {mode === "none" ? (
                      <span className="block h-[30px]" />
                    ) : mode === "select" ? (
                      <select
                        value={value}
                        onChange={(event) =>
                          setFilter(column.key, event.target.value)
                        }
                        className="w-full rounded border border-outline-variant/30 bg-surface-dim px-2 py-1.5 font-body-sm text-body-sm text-on-surface focus:border-primary focus:outline-none"
                        aria-label={`Filter ${column.label}`}
                      >
                        <option value="">All</option>
                        {distinct.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={value}
                        onChange={(event) =>
                          setFilter(column.key, event.target.value)
                        }
                        placeholder="Filter…"
                        className="w-full rounded border border-outline-variant/30 bg-surface-dim px-2 py-1.5 font-body-sm text-body-sm text-on-surface focus:border-primary focus:outline-none"
                        aria-label={`Filter ${column.label}`}
                      />
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant bg-surface-container font-body-md text-body-md">
            {pageRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-6 text-center text-on-surface-variant"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pageRows.map((row) => (
                <tr
                  key={getRowId(row)}
                  className="group transition-colors hover:bg-surface-container-highest"
                >
                  {columns.map((column) => {
                    const value = row[column.key];
                    const align =
                      column.align === "right"
                        ? "text-right"
                        : column.align === "center"
                          ? "text-center"
                          : "text-left";
                    return (
                      <td
                        key={column.key}
                        className={`p-4 ${align} ${column.cellClassName ?? ""}`}
                      >
                        {column.render
                          ? column.render(value, row)
                          : cellText(value)}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container-high p-4">
        <span className="font-body-sm text-body-sm text-on-surface">
          Showing{" "}
          {filteredSorted.length === 0 ? 0 : safePage * pageSize + 1}-
          {Math.min((safePage + 1) * pageSize, filteredSorted.length)} of{" "}
          {filteredSorted.length} issues
          {filteredSorted.length !== rows.length
            ? ` (filtered from ${rows.length})`
            : ""}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={safePage <= 0}
            onClick={() => setPage(Math.max(0, safePage - 1))}
            className="rounded p-1 text-on-surface hover:bg-surface-container-highest disabled:opacity-50"
            aria-label="Previous page"
          >
            <Icon name="chevron_left" />
          </button>
          <button
            type="button"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage(Math.min(pageCount - 1, safePage + 1))}
            className="rounded p-1 text-white hover:bg-surface-container-highest disabled:opacity-50"
            aria-label="Next page"
          >
            <Icon name="chevron_right" />
          </button>
        </div>
      </div>
    </div>
  );
}
