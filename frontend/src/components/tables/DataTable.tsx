import React from 'react';
import { cn } from '../../utils/format';
import { EmptyState } from '../ui/States';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
  hideOn?: 'sm' | 'md' | 'lg';
}

export function DataTable<T extends {id: string;}>({
  columns,
  rows,
  tone = 'light',
  onRowClick,
  emptyTitle = 'Aucun résultat',
  emptyMessage = 'Ajustez vos filtres pour afficher des données.'







}: {columns: Array<Column<T>>;rows: T[];tone?: 'light' | 'dark';onRowClick?: (row: T) => void;emptyTitle?: string;emptyMessage?: string;}) {
  const hideClass = (hideOn?: 'sm' | 'md' | 'lg') =>
  hideOn === 'sm' ? 'hidden sm:table-cell' : hideOn === 'md' ? 'hidden md:table-cell' : hideOn === 'lg' ? 'hidden lg:table-cell' : '';

  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} tone={tone} />;
  }

  return (
    <div className="ecomer-scroll w-full overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className={cn(tone === 'light' ? 'bg-slate-50' : 'bg-white/5')}>
            {columns.map((c) =>
            <th
              key={c.key}
              scope="col"
              className={cn(
                'whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wider',
                tone === 'light' ? 'text-slate-500' : 'text-slate-400',
                hideClass(c.hideOn),
                c.className
              )}>
              
                {c.header}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) =>
          <tr
            key={row.id}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            className={cn(
              'border-t transition-colors',
              tone === 'light' ? 'border-hairline hover:bg-slate-50/80' : 'border-white/5 hover:bg-white/5',
              onRowClick && 'cursor-pointer'
            )}>
            
              {columns.map((c) =>
            <td
              key={c.key}
              className={cn(
                'px-4 py-3 align-middle',
                tone === 'light' ? 'text-slate-700' : 'text-slate-300',
                hideClass(c.hideOn),
                c.className
              )}>
              
                  {c.render(row)}
                </td>
            )}
            </tr>
          )}
        </tbody>
      </table>
    </div>);

}