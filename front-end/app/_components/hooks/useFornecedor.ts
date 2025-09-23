import { useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Fornecedor, FilterValues, SortDirection } from '@/types/interfaces/entities';
import { useRouter, useSearchParams } from 'next/navigation';

const defaultFilters: FilterValues = {
  currentPage: 1,
  itemsPerPage: 10,
};

export const useFornecedor = () => {
  const queryClient = useQueryClient();
  const router = useRouter()
  const searchParams = useSearchParams();
  
  const getFiltersFromParams = useCallback(() => {
     const params = new URLSearchParams(searchParams.toString());

     const currentPage = Number(params.get('page')) || defaultFilters.currentPage
     const itemsPerPage = Number(params.get('limit')) || defaultFilters.itemsPerPage
     const search = params.get('search')

     params.set('page', String(currentPage))
     params.set('limit', String(itemsPerPage))

     if (search)
       params.set('search', String(search))

     return {
       currentPage,
       itemsPerPage,
       search: search || "",
       toString: params.toString()
     };
 
   }, [searchParams]);

   const appliedFilters = getFiltersFromParams()
   const paramsToString = appliedFilters.toString

   // Moved to top level
   const fornecedorQuery = useQuery<{ fornecedores: Fornecedor[]; total: number }>({
     queryKey: ['fornecedores', paramsToString],
     queryFn: async () => {
       const response = await fetch(`/api/fornecedor/findPerPage?${paramsToString}`);
       
       if (!response.ok) {
         throw new Error('Failed to fetch fornecedores');
       }
       const result = await response.json();

       return result;
     },
   })

   const createMutation = useMutation({
     mutationFn: async (fornecedor: Omit<Fornecedor, 'id' | 'compras'>) => {
       const response = await fetch('/api/fornecedor/create', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(fornecedor),
       });
       if (!response.ok) {
         throw new Error('Failed to create fornecedor');
       }
       const result = await response.json();
       if (!result.success) {
         throw new Error(result.error || 'Failed to create fornecedor');
       }
       return result.data;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['fornecedores', paramsToString] });
     },
   });

   const handleCreate = (fornecedor: Omit<Fornecedor, 'id' | 'compras'>) => {
     createMutation.mutate(fornecedor);
   };

   const editMutation = useMutation({
     mutationFn: async ({ id, updates }: { id: number; updates: Partial<Omit<Fornecedor, 'id' | 'compras'>> }) => {
       const response = await fetch(`/api/fornecedor/update/${id}`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(updates),
       });
       if (!response.ok) {
         throw new Error('Failed to update fornecedor');
       }
       const result = await response.json();
       if (!result.success) {
         throw new Error(result.error || 'Failed to update fornecedor');
       }
       return result.data;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['fornecedores', paramsToString] });
     },
   });

   const handleEdit = (id: number, updates: Partial<Omit<Fornecedor, 'id' | 'compras'>>) => {
     editMutation.mutate({ id, updates });
   };

   const deleteMutation = useMutation({
     mutationFn: async (id: number) => {
       const response = await fetch(`/api/fornecedor/delete/${id}`, {
         method: 'DELETE',
       });
       if (!response.ok) {
         throw new Error('Failed to delete fornecedor');
       }
       const result = await response.json();
       if (!result.success) {
         throw new Error(result.error || 'Failed to delete fornecedor');
       }
       return result;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['fornecedores', paramsToString] });
     },
   });

   const handleDelete = (id: number) => {
     deleteMutation.mutate(id);
   };

   const getActiveFilters = () => {
     const active = [];
     if (appliedFilters.search) {
       active.push({ label: 'Nome', value: appliedFilters.search });
     }
     return active;
   };

   const updateUrl = useCallback((newFilters: FilterValues) => {
     const params = new URLSearchParams(searchParams.toString());
     params.set('page', newFilters.currentPage.toString());
     params.set('limit', newFilters.itemsPerPage.toString());

     if (newFilters.search) {
       params.set('search', newFilters.search);
     } else {
       params.delete('search');
     }

     router.replace(`?${params.toString()}`);
   }, [router, searchParams]);

   const handleApply = () => {
     const newFilters = { ...appliedFilters, currentPage: 1 };
     updateUrl(newFilters);
   };

   const handleRemoveFilter = (index: number) => {
     const activeFilters = getActiveFilters();
     const filterToRemove = activeFilters[index];

     let newFilters = { ...appliedFilters };
     switch (filterToRemove.label) {
       case 'Nome':
         newFilters = { ...newFilters, search: '' };
         break;
     }
     updateUrl(newFilters);
   };

   const resetFilters = () => {
     const params = new URLSearchParams();
     router.replace(`?${params.toString()}`);
   };

   const handleSort = (field: string) => {};

   const handlePageChange = (page: number) => {
     const newFilters = { ...appliedFilters, currentPage: page };
     updateUrl(newFilters);
   };

   const handleItemsPerPageChange = (itemsPerPage: number) => {
     const newFilters = { ...appliedFilters, itemsPerPage, currentPage: 1 };
     updateUrl(newFilters);
   };

   return {
     fornecedorQuery,
     handleCreate,
     handleEdit,
     handleDelete,
     handleApply,
     handleRemoveFilter,
     resetFilters,
     handleSort,
     handlePageChange,
     handleItemsPerPageChange,
     updateUrl,
     getActiveFilters,
     appliedFilters
   };
};