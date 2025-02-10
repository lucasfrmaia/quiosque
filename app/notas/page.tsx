'use client';

import { FC } from 'react';
import { useState } from 'react';
import { NotaFiscal } from '../interfaces';

const notas: NotaFiscal[] = [
  { id: 1, produtoId: 1, quantidade: 10, data: '2023-10-01', total: 100 },
  { id: 2, produtoId: 2, quantidade: 5, data: '2023-10-02', total: 100 },
];

const NotasPage: FC = () => {
  const [search, setSearch] = useState('');
  const [filteredNotas, setFilteredNotas] = useState(notas);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    setFilteredNotas(
      notas.filter((nota) =>
        nota.produtoId.toString().includes(value) ||
        nota.data.includes(value)
      )
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-black">Notas Fiscais</h1>
      <div className="flex space-x-4">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Pesquisar notas fiscais..."
          className="px-4 py-2 border border-gray-300 rounded-lg flex-1"
        />
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Produto ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Quantidade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredNotas.map((nota) => (
              <tr key={nota.id}>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{nota.produtoId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{nota.quantidade}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{nota.data}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">R$ {nota.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotasPage;