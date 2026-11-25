"use client";

import { useMemo, useState } from "react";
import { ArrowDown01Icon, ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/icon";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { LIMITS } from "@/config/limits";
import { PRO_COPY } from "@/config/pro-copy";
import { cn } from "@/lib/utils";
import { usePreferencesStore } from "@/store/preferences-store";
import type { IconSvgElement } from "@hugeicons/react";

export interface Column<T> {
  id: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  /** Ascending comparator. Without it the column is not sortable. */
  sort?: (a: T, b: T) => number;
  align?: "right";
  hideBelow?: "sm" | "md" | "lg";
  className?: string;
}

interface DataTableProps<T> {
  rows: T[];
  columns: Column<T>[];
  rowId: (row: T) => string;
  caption: string;
  initialSort?: { id: string; direction: "asc" | "desc" };
  pageSize?: number;
  onRowClick?: (row: T) => void;
  bulkActions?: (selectedIds: string[], clear: () => void) => React.ReactNode;
  empty: { icon: IconSvgElement; title: string; description: string };
}

const HIDE = { sm: "hidden sm:table-cell", md: "hidden md:table-cell", lg: "hidden lg:table-cell" } as const;

// filtering lives in the page, which passes rows already filtered
export function DataTable<T>({ rows, columns, rowId, caption, initialSort, pageSize: requestedPageSize = 10, onRowClick, bulkActions, empty }: DataTableProps<T>) {
  // Free caps are applied to the data, not just hidden in the UI
  const pageSize = Math.min(requestedPageSize, LIMITS.maxPageSize);
  const compact = usePreferencesStore((state) => state.compactTables);
  const [sort, setSort] = useState(initialSort ?? null);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);

  const sorted = useMemo(() => {
    const column = columns.find((c) => c.id === sort?.id);
    if (!column?.sort || !sort) return rows;
    const sign = sort.direction === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => sign * (column.sort as (a: T, b: T) => number)(a, b));
  }, [rows, columns, sort]);

  const shown = useMemo(() => sorted.slice(0, LIMITS.maxTableRows), [sorted]);
  const pageCount = Math.max(1, Math.ceil(shown.length / pageSize));
  const current = Math.min(page, pageCount - 1);
  const visible = shown.slice(current * pageSize, (current + 1) * pageSize);
  const visibleIds = visible.map(rowId);
  const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.includes(id));
  const toggleSort = (id: string) =>
    setSort((prev) => (prev?.id === id ? { id, direction: prev.direction === "asc" ? "desc" : "asc" } : { id, direction: "asc" }));

  if (rows.length === 0) {
    return (
      <div className="surface-card">
        <EmptyState icon={empty.icon} title={empty.title} description={empty.description} />
      </div>
    );
  }

  return (
    <div className="surface-card overflow-hidden">
      {bulkActions && selected.length > 0 && (
        <div className="bg-brand-subtle border-border flex flex-wrap items-center gap-3 border-b px-4 py-2 text-sm">
          <span className="font-medium" data-numeric>{selected.length} sélectionné{selected.length > 1 ? "s" : ""}</span>
          <div className="flex items-center gap-1.5">{bulkActions(selected, () => setSelected([]))}</div>
        </div>
      )}

      <div className="scrollbar-slim overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-border bg-muted/50 text-muted-foreground border-b text-xs">
              {bulkActions && (
                <th scope="col" className="w-10 pl-4">
                  <Checkbox
                    aria-label="Tout sélectionner sur cette page"
                    checked={allSelected}
                    onChange={() => setSelected(allSelected ? selected.filter((id) => !visibleIds.includes(id)) : [...new Set([...selected, ...visibleIds])])}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  aria-sort={sort?.id === column.id ? (sort.direction === "asc" ? "ascending" : "descending") : undefined}
                  className={cn("px-4 py-2.5 font-medium", column.align === "right" && "text-right", column.hideBelow && HIDE[column.hideBelow])}
                >
                  {column.sort ? (
                    <button type="button" onClick={() => toggleSort(column.id)} className={cn("hover:text-foreground inline-flex items-center gap-1", column.align === "right" && "flex-row-reverse")}>
                      {column.header}
                      {sort?.id === column.id && <Icon icon={ArrowDown01Icon} size={12} className={cn(sort.direction === "asc" && "rotate-180")} />}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => {
              const id = rowId(row);
              return (
                <tr
                  key={id}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn("border-border border-b transition-colors last:border-b-0", onRowClick && "cursor-pointer", selected.includes(id) ? "bg-brand-subtle/50" : "hover:bg-muted/40")}
                >
                  {bulkActions && (
                    <td className="pl-4" onClick={(event) => event.stopPropagation()}>
                      <Checkbox aria-label="Sélectionner la ligne" checked={selected.includes(id)} onChange={() => setSelected(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id])} />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.id} className={cn("px-4", compact ? "py-1.5" : "py-3", column.align === "right" && "text-right", column.hideBelow && HIDE[column.hideBelow], column.className)}>
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <footer className="border-border text-muted-foreground flex items-center justify-between gap-3 border-t px-4 py-2.5 text-xs">
        <span data-numeric>
          {current * pageSize + 1}–{Math.min(shown.length, (current + 1) * pageSize)} sur {shown.length}
          {sorted.length > shown.length && ` · ${PRO_COPY.tableLimit(LIMITS.maxTableRows)}`}
        </span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" aria-label="Page précédente" disabled={current === 0} onClick={() => setPage(current - 1)}>
            <Icon icon={ArrowLeft01Icon} size={15} />
          </Button>
          <span data-numeric>Page {current + 1} / {pageCount}</span>
          <Button variant="ghost" size="icon-sm" aria-label="Page suivante" disabled={current >= pageCount - 1} onClick={() => setPage(current + 1)}>
            <Icon icon={ArrowRight01Icon} size={15} />
          </Button>
        </div>
      </footer>
    </div>
  );
}
