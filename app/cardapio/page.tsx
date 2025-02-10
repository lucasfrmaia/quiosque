'use client';

import { FC } from 'react';
import { useState } from 'react';
import { Produto } from '../interfaces';

const produtos: Produto[] = [
  { id: 1, nome: 'Produto 1', preco: 10, descricao: 'Descrição do Produto 1' },
  { id: 2, nome: 'Produto 2', preco: 20, descricao: 'Descrição do Produto 2' },
];

const CardapioPage: FC = () => {
  const [search, setSearch] = useState('');
  const [filteredProdutos, setFilteredProdutos] = useState(produtos);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    setFilteredProdutos(
      produtos.filter((produto) =>
        produto.nome.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Cardápio</h1>
      <div className="flex space-x-4">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Pesquisar produtos..."
          className="px-4 py-2 border border-gray-300 rounded-lg flex-1"
        />
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProdutos.map((produto) => (
              <tr key={produto.id}>
                <td className="px-6 py-4 whitespace-nowrap">{produto.nome}</td>
                <td className="px-6 py-4 whitespace-nowrap">R$ {produto.preco.toFixed(2)}</td>
                <td className="px-6 py-4">{produto.descricao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CardapioPage;