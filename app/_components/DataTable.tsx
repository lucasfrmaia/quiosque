'use client';

import { FC, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import { SortIcon } from './SortIcon';
import { FilterValues } from '@/types/interfaces/entities';

interface Column<T> {
  key: string;
  header: string;
  sortKey?: string;
  render: (item: T) => React.ReactNode;
  sortable?: boolean;
  sorter?: (a: T, b: T) => number;
}

interface DataTableProps<T> {
  items: T[];
  columns: Column<T>[];
  filterValues: FilterValues;
  actions?: {
    onEdit: (item: T) => void;
    onDelete: (item: T) => void;
    onView?: (item: T) => void;
  };
  emptyMessage?: string;
}

export const DataTable = <T extends { id: number }>({
  items,
  columns,
  filterValues,
  actions,
  emptyMessage = 'Nenhum item encontrado.',
}: DataTableProps<T>) => {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortField, setSortField] = useState<string | null>(null);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSorter = (columnKey: string) => {
    const column = columns.find((c) => (c.sortKey || c.key) === columnKey);
    return column?.sorter;
  };

  const sortedItems = [...items].sort((a, b) => {
    if (!sortField) return 0;
    const sorter = getSorter(sortField);
    if (sorter) {
      const result = sorter(a, b);
      return sortDirection === 'asc' ? result : -result;
    }
    // Default sorter
    const aValue = (a as any)[sortField];
    const bValue = (b as any)[sortField];
    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Empty state handled in return

  return (
    <>
      {/* Mobile Cards View */}
      <div className="block md:hidden space-y-4">
        {sortedItems.map((item) => (
          <Card key={item.id} className="shadow-md border border-gray-200 rounded-xl">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                {columns.map((column) => (
                  <div key={column.key} className="space-y-2 text-center">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gray-100 px-2 py-1 rounded-full inline-block">
                      {column.header}
                    </span>
                    <div className="text-base font-medium text-gray-900">{column.render(item)}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200">
                {actions?.onView && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => actions.onView && actions?.onView(item)}
                  >
                    Ver
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => actions?.onEdit(item)}
                  className="text-purple-600 hover:bg-purple-50 border-purple-200 hover:border-purple-300 transition-all duration-200"
                  aria-label="Editar item"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => actions?.onDelete(item)}
                  aria-label="Excluir item"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <div className="rounded-xl border border-gray-200 overflow-hidden shadow-lg bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {columns.map((column) => {
                  const columnSortKey = column.sortKey || column.key;
                  return (
                    <TableHead
                      key={column.key}
                      className={`${
                        column.sortable ? 'cursor-pointer select-none hover:bg-gray-100' : ''
                      } px-4 py-3 text-rigth text-xs font-semibold text-gray-700 uppercase tracking-wide bg-gray-100 border-b-2 border-gray-200 w-24 ${
                        column.key === 'imagem' ? 'w-20' : ''
                      } font-sans`}
                      onClick={() => column.sortable && handleSort(columnSortKey)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.header}</span>
                        {column.sortable && sortField === columnSortKey && (
                          <SortIcon
                            field={columnSortKey}
                            currentSortField={sortField || ''}
                            currentSortDirection={sortDirection}
                          />
                        )}
                      </div>
                    </TableHead>
                  );
                })}

                {actions && (
                  <TableHead className="text-center px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide bg-gray-100 b-2 border-gray-200 font-sans">
                    Ações
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-gradient-to-r from-blue-50 to-indigo-50 transition-all duration-200 border-b border-gray-200 even:bg-gray-50"
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={`px-6 py-4 text-sm text-left font-medium text-gray-900 ${
                        column.key === 'imagem' ? 'p-2' : ''
                      }`}
                    >
                      {column.render(item)}
                    </TableCell>
                  ))}

                  {actions && (
                    <TableCell className="text-right px-6 py-4">
                      <div className="flex justify-end space-x-3">
                        {actions?.onView && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => actions.onView && actions?.onView(item)}
                          >
                            Ver
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => actions.onEdit(item)}
                          className="text-purple-600 hover:bg-purple-50 border-purple-200 hover:border-purple-300 transition-all duration-200"
                          aria-label="Editar item"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => actions.onDelete(item)}
                          className="text-red-600 hover:bg-red-50 border-red-200 hover:border-red-300 transition-all duration-200"
                          aria-label="Excluir item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {sortedItems.length === 0 && (
        <div className="rounded-md border p-8 text-center text-gray-500">{emptyMessage}</div>
      )}
    </>
  );
};
