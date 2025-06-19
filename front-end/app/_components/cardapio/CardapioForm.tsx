import { FC } from 'react';

interface CardapioFormData {
  nome: string;
  preco: string;
  descricao: string;
}

interface CardapioFormProps {
  formData: CardapioFormData;
  onChange: (formData: CardapioFormData) => void;
}

export const CardapioForm: FC<CardapioFormProps> = ({ formData, onChange }) => {
  const handleChange = (field: keyof CardapioFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange({ ...formData, [field]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome
        </label>
        <input
          type="text"
          value={formData.nome}
          onChange={handleChange('nome')}
          className="filter-input"
          placeholder="Nome do produto"
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
          placeholder="Preço do produto"
          step="0.01"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          value={formData.descricao}
          onChange={handleChange('descricao')}
          className="filter-input"
          placeholder="Descrição do produto"
          rows={3}
        />
      </div>
    </div>
  );
};