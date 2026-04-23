import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField?: keyof T;
  loading?: boolean;
  total?: number;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
}

function Skeleton() {
  return (
    <tr>
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

export default function DataTable<T extends object>({
  columns, data, keyField, loading, total = 0, page = 1, limit = 20,
  onPageChange, emptyMessage = 'Nenhum registro encontrado.',
}: DataTableProps<T>) {
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-light dark:border-border-dark">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400
                              uppercase tracking-wide whitespace-nowrap ${col.className ?? ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light dark:divide-border-dark">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)
              : data.length === 0
              ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-12 text-slate-400 dark:text-slate-500">
                    {emptyMessage}
                  </td>
                </tr>
              )
              : data.map((row, idx) => (
                <tr
                  key={keyField ? String(row[keyField]) : idx}
                  className="table-row-hover"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 text-slate-700 dark:text-slate-300 ${col.className ?? ''}`}>
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border-light dark:border-border-dark">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {(page - 1) * limit + 1}–{Math.min(page * limit, total)} de {total}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-100
                         dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`w-7 h-7 text-xs rounded-md font-medium transition-colors
                    ${p === page
                      ? 'bg-primary text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-100
                         dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
