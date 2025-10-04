'use client';

import { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const TableSkeleton: FC<{ lines?: number }> = ({ lines = 5 }) => {
  return (
    <div className="container mx-auto py-6 space-y-6 animate-pulse">
      <div className="flex flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-64 rounded-md" />
        </div>
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>

      <div className="mx-auto max-w-4xl mb-6">
        <div className="flex items-center justify-center gap-4">
          <Skeleton className="h-10 flex-1 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
      </div>

      <Card>
        <CardContent className="py-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-6 w-1/6 rounded-md" />
                <Skeleton className="h-6 w-1/4 rounded-md" />
                <Skeleton className="h-6 w-1/3 rounded-md" />
                <Skeleton className="h-6 w-20 rounded-md ml-auto" />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4">
            <Skeleton className="h-8 w-32 rounded-md" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-8 rounded-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TableSkeleton;
