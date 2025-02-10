'use client';

import { FC } from 'react';
import { useState } from 'react';
import { GastoDiario } from '../interfaces';

const gastos: GastoDiario[] = [
  { id: 1, descricao: 'Compra de materiais', valor: 100, data: '2023-10-01' },
  { id: 2, descricao: 'Pagamento de funcionários', valor: 200, data: '2023-10-02' },
];

const GastosPage: FC = () => {
  const [search, setSearch] = useState('');
  const [filteredGastos, setFilteredGastos] = useState(gastos);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    setFilteredGastos(
      gastos.filter((gasto) =>
        gasto.descricao.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-black">Gastos Diários</h1>
      <div className="flex space-x-4">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Pesquisar gastos..."
          className="px-4 py-2 border border-gray-300 rounded-lg flex-1"
        />
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Descrição</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Valor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredGastos.map((gasto) => (
              <tr key={gasto.id}>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{gasto.descricao}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">R$ {gasto.valor.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{gasto.data}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GastosPage;