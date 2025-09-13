import { FC } from 'react';

interface GastosFormData {
  produtoId: string;
  quantidade: string;
  preco: string;
  unidade: string;
  data: string;
}

interface GastosFormProps {
  formData: GastosFormData;
  onChange: (formData: GastosFormData) => void;
}

export const GastosForm: FC<GastosFormProps> = ({ formData, onChange }) => {
  const handleChange = (field: keyof GastosFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
          Quantidade
        </label>
        <input
          type="number"
          value={formData.quantidade}
          onChange={handleChange('quantidade')}
          className="filter-input"
          placeholder="Quantidade comprada"
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
          Unidade
        </label>
        <input
          type="text"
          value={formData.unidade}
          onChange={handleChange('unidade')}
          className="filter-input"
          placeholder="Unidade (ex: Unidade)"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data
        </label>
        <input
          type="date"
          value={formData.data}
          onChange={handleChange('data')}
          className="filter-input"
        />
      </div>
    </div>
  );
};