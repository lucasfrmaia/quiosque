import { FC } from 'react';

interface EstoqueFormData {
  preco: string;
  quantidade: string;
  dataValidade: string;
  unidade: string;
  produtoId: string;
  estoqueId: string;
  tipo: string;
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Produto ID
        </label>
        <input
          type="number"
          value={formData.produtoId}
          onChange={handleChange('produtoId')}
          className="filter-input"
          placeholder="ID do produto"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Estoque ID
        </label>
        <input
          type="number"
          value={formData.estoqueId}
          onChange={handleChange('estoqueId')}
          className="filter-input"
          placeholder="ID do estoque"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Preço
        </label>
        <input
          type="number"
          value={formData.preco}
          onChange={handleChange('preco')}
          className="filter-input"
          placeholder="Preço unitário"
          step="0.01"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quantidade
        </label>
        <input
          type="number"
          value={formData.quantidade}
          onChange={handleChange('quantidade')}
          className="filter-input"
          placeholder="Quantidade em estoque"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data de Validade
        </label>
        <input
          type="date"
          value={formData.dataValidade}
          onChange={handleChange('dataValidade')}
          className="filter-input"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Unidade
        </label>
        <input
          type="text"
          value={formData.unidade}
          onChange={handleChange('unidade')}
          className="filter-input"
          placeholder="Unidade (ex: Unidade, Kg)"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo
        </label>
        <select
          value={formData.tipo}
          onChange={handleChange('tipo')}
          className="filter-input"
        >
          <option value="Insumo">Insumo</option>
          <option value="Produto">Produto</option>
        </select>
      </div>
    </div>
  );
};