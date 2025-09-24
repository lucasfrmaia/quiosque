'use client';

import { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
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
  onSort: (field: string) => void;
  onEdit: (item: T) => void;
  onDelete: (id: number) => void;
  emptyMessage?: string;
}

export const DataTable = <T extends { id: number }>({
  items,
  columns,
  filterValues,
  onSort,
  onEdit,
  onDelete,
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
    onSort(field);
  };

  const getSorter = (columnKey: string) => {
    const column = columns.find(c => (c.sortKey || c.key) === columnKey);
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

  if (sortedItems.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.header}</TableHead>
              ))}
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => {
              const columnSortKey = column.sortKey || column.key;
              return (
                <TableHead
                  key={column.key}
                  className={column.sortable ? 'cursor-pointer select-none' : ''}
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
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.map((item) => (
            <TableRow key={item.id} className="hover:bg-accent/50">
              {columns.map((column) => (
                <TableCell key={column.key}>{column.render(item)}</TableCell>
              ))}
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};