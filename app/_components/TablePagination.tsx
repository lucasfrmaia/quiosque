"use client";

import { FC, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SortIcon } from "./SortIcon";
import { Pagination } from "./Pagination";

interface Column<T> {
  key: string;
  header: string;
  sortKey?: string;
  render: (item: T) => React.ReactNode;
  sortable?: boolean;
  sorter?: (a: T, b: T) => number;
}

interface TablePaginationProps<T> {
  items: T[];
  columns: Column<T>[];
  itemsPerPage?: number;
  emptyMessage?: string;
}

export const TablePagination = <T,>({
  items,
  columns,
  itemsPerPage = 5,
  emptyMessage = "Nenhum item encontrado.",
}: TablePaginationProps<T>) => {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageItemsPerPage, setPageItemsPerPage] = useState(itemsPerPage);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1); // Reset to first page on sort
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
      return sortDirection === "asc" ? result : -result;
    }
    // Default sorter
    const aValue = (a as any)[sortField];
    const bValue = (b as any)[sortField];
    if (aValue < bValue) {
      return sortDirection === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedItems.length / pageItemsPerPage);
  const startIndex = (currentPage - 1) * pageItemsPerPage;
  const endIndex = Math.min(startIndex + pageItemsPerPage, sortedItems.length);
  const paginatedItems = sortedItems.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setPageItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  if (totalPages === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      {/* Mobile Cards View */}
      <div className="block md:hidden space-y-4">
        {paginatedItems.map((item) => (
          <Card key={(item as any).id || Math.random()} className="shadow-sm border-gray-200">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {columns.map((column) => (
                  <div key={column.key} className="space-y-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {column.header}
                    </span>
                    <div className="text-sm">{column.render(item)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <div className="rounded-md border overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {columns.map((column) => {
                  const columnSortKey = column.sortKey || column.key;
                  return (
                    <TableHead
                      key={column.key}
                      className={`${
                        column.sortable
                          ? "cursor-pointer select-none hover:bg-gray-100"
                          : ""
                      } px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24 ${
                        column.key === "imagem" ? "w-20" : ""
                      }`}
                      onClick={() =>
                        column.sortable && handleSort(columnSortKey)
                      }
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.header}</span>
                        {column.sortable && sortField === columnSortKey && (
                          <SortIcon
                            field={columnSortKey}
                            currentSortField={sortField || ""}
                            currentSortDirection={sortDirection}
                          />
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.map((item, index) => (
                <TableRow
                  key={(item as any).id || index}
                  className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100"
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={`px-4 py-4 text-sm ${
                        column.key === "imagem"
                          ? "text-center p-2"
                          : "align-top"
                      }`}
                    >
                      {column.render(item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={pageItemsPerPage}
        totalItems={sortedItems.length}
        startIndex={startIndex}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {paginatedItems.length === 0 && currentPage > totalPages && (
        <div className="rounded-md border p-8 text-center text-gray-500">
          {emptyMessage}
        </div>
      )}
    </>
  );
};