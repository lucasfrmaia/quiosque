import { FC } from "react";
import { Badge } from "@/components/ui/badge";
import { Box } from "lucide-react";
import { Produto, FilterValues } from "@/types/interfaces/entities";
import { DataTable } from "../DataTable";

interface ProdutoTableProps {
  items: Produto[];
  filterValues: FilterValues;
  onEdit: (item: Produto) => void;
  onDelete: (id: Produto) => void;
}

export const ProdutoTable: FC<ProdutoTableProps> = ({
  items,
  filterValues,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      key: "imagem",
      header: "Imagem",
      render: (item: Produto) => (
        <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full">
          {item.imagemUrl ? (
            <img
              src={item.imagemUrl}
              alt={item.nome}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <Box className="h-6 w-6 text-gray-400" />
          )}
        </div>
      ),
      sortable: false,
    },
    {
      key: "nome",
      header: "Nome",
      sortKey: "nome",
      render: (item: Produto) => (
        <div className="font-bold text-sm">{item.nome}</div>
      ),
      sortable: true,
      sorter: (a: Produto, b: Produto) => a.nome.localeCompare(b.nome),
    },
    {
      key: "categoria",
      header: "Categoria",
      render: (item: Produto) => item.categoria?.name || "N/A",
      sortable: false,
    },
    {
      key: "status",
      header: "Status",
      render: (item: Produto) => (
        <Badge
          variant={item.ativo ? "default" : "secondary"}
          className={
            item.ativo
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }
        >
          {item.ativo ? "Ativo" : "Inativo"}
        </Badge>
      ),
      sortable: false,
    },
    {
      key: "desc",
      header: "Descrição",
      render: (item: Produto) => (
        <div className="text-gray-500 text-xs line-clamp-2">
          {item.descricao || "Sem descrição"}
        </div>
      ),
      sortable: false,
    },
  ];

  return (
    <DataTable<Produto>
      items={items}
      columns={columns}
      filterValues={filterValues}
      actions={{
        onEdit,
        onDelete,
      }}
      emptyMessage="Nenhum produto encontrado."
    />
  );
};
