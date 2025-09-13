import { FC } from 'react';

interface EstoqueFormData {
  nome: string;
  quantidade: string;
  precoUnitario: string;
  categoria: string;
  dataValidade: string;
  produtoId: string;
}

interface EstoqueFormProps {
  formData: EstoqueFormData;
  onChange: (formData: EstoqueFormData) => void;
}

export const EstoqueForm: FC<EstoqueFormProps> = ({ formData, onChange }) => {
  const handleChange = (field: keyof EstoqueFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({ ...formData, [field]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
        <input
          type="text"
          value={formData.nome}
          onChange={handleChange('nome')}
          className="filter-input"
          placeholder="Nome do item"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
        <input
          type="number"
          value={formData.quantidade}
          onChange={handleChange('quantidade')}
          className="filter-input"
          placeholder="Quantidade do item"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Preço Unitário</label>
        <input
          type="number"
          value={formData.precoUnitario}
          onChange={handleChange('precoUnitario')}
          className="filter-input"
          placeholder="Preço unitário do item"
          step="0.01"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
        <input
          type="text"
          value={formData.categoria}
          onChange={handleChange('categoria')}
          className="filter-input"
          placeholder="Categoria do item"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Data de Validade</label>
        <input
          type="date"
          value={formData.dataValidade}
          onChange={handleChange('dataValidade')}
          className="filter-input"
          placeholder="Data de validade"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ID do Produto</label>
        <input
          type="number"
          value={formData.produtoId}
          onChange={handleChange('produtoId')}
          className="filter-input"
          placeholder="ID do produto associado"
        />
      </div>
    </div>
  );
};