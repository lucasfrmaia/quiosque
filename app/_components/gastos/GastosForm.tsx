import { FC } from 'react';

interface GastosFormData {
  descricao: string;
  valor: string;
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
          Descrição
        </label>
        <input
          type="text"
          value={formData.descricao}
          onChange={handleChange('descricao')}
          className="filter-input"
          placeholder="Descrição do gasto"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Valor
        </label>
        <input
          type="number"
          value={formData.valor}
          onChange={handleChange('valor')}
          className="filter-input"
          placeholder="Valor do gasto"
          step="0.01"
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