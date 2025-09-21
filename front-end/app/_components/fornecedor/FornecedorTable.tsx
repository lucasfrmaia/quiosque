import { FC } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Fornecedor } from '@/types/interfaces/entities';
import { FilterValues } from '@/types/interfaces/entities';
import { SortIcon } from '@/app/_components/SortIcon';

interface FornecedorTableProps {
  items: Fornecedor[];
  filterValues: FilterValues;
  onSort: (field: string) => void;
  onEdit: (item: Fornecedor) => void;
  onDelete: (id: number) => void;
}

export const FornecedorTable: FC<FornecedorTableProps> = ({
  items,
  filterValues,
  onSort,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              ID
            </TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => onSort('nome')}
            >
              Nome 
            </TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => onSort('cnpj')}
            >
              CNPJ 
            </TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => onSort('telefone')}
            >
              Telefone 
            </TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => onSort('email')}
            >
              Email 
            </TableHead>
            <TableHead className="text-right">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((fornecedor) => (
            <TableRow key={fornecedor.id}>
              <TableCell className="font-medium">
                {fornecedor.id}
              </TableCell>
              <TableCell>{fornecedor.nome}</TableCell>
              <TableCell>{fornecedor.cnpj || 'N/A'}</TableCell>
              <TableCell>{fornecedor.telefone || 'N/A'}</TableCell>
              <TableCell>{fornecedor.email || 'N/A'}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(fornecedor)}
                  className="mr-2"
                >
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(fornecedor.id)}
                >
                  Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {items.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-gray-500">Nenhum fornecedor encontrado.</p>
        </div>
      )}
    </div>
  );
};