import { FC } from 'react';

interface EstoqueFormData {
  nome: string;
  quantidade: string;
  preco: string;
}

interface EstoqueFormProps {
  formData: EstoqueFormData;
  onChange: (formData: EstoqueFormData) => void;
}

export const EstoqueForm: FC<EstoqueFormProps> = ({ formData, onChange }) => {
  const handleChange = (field: keyof EstoqueFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
        <input
          type="number"
          value={formData.preco}
          onChange={handleChange('preco')}
          className="filter-input"
          placeholder="Preço do item"
          step="0.01"
        />
      </div>
    </div>
  );
};