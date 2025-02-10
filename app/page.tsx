export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Vendas do Dia</h2>
          <p className="text-3xl font-bold">R$ 1.234,56</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Produtos Vendidos</h2>
          <p className="text-3xl font-bold">45</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Gastos do Dia</h2>
          <p className="text-3xl font-bold">R$ 345,67</p>
        </div>
      </div>
    </div>
  );
}
