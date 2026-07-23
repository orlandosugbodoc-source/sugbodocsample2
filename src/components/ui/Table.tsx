import React from 'react';
import { cn } from '../../utils/cn';

export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({ className, children, ...props }) => (
  <div className="relative w-full overflow-x-auto border border-slate-200 rounded-lg bg-white shadow-2xs min-w-0">
    <table className={cn('w-full caption-bottom text-xs border-collapse min-w-[600px] sm:min-w-full', className)} {...props}>
      {children}
    </table>
  </div>
);

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className, children, ...props }) => (
  <thead className={cn('bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider font-semibold text-slate-600 sticky top-0 z-10 select-none', className)} {...props}>
    {children}
  </thead>
);

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className, children, ...props }) => (
  <tbody className={cn('[&_tr:last-child]:border-0 divide-y divide-slate-200/70', className)} {...props}>
    {children}
  </tbody>
);

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ className, children, ...props }) => (
  <tr
    className={cn('transition-colors hover:bg-slate-50/80 data-[state=selected]:bg-slate-100', className)}
    {...props}
  >
    {children}
  </tr>
);

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({ className, children, ...props }) => (
  <th
    className={cn('h-9 px-3.5 text-left align-middle font-bold text-slate-700 text-[11px] whitespace-nowrap [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  >
    {children}
  </th>
);

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ className, children, ...props }) => (
  <td
    className={cn('p-3.5 align-middle text-xs text-slate-900 [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  >
    {children}
  </td>
);
