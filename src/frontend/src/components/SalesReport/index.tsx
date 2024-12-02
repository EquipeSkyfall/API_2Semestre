import React, { useState } from 'react';
import axios from 'axios';
import { Chart } from 'react-google-charts';
import { useNavigate } from 'react-router-dom';

interface SalesData {
  date: string;
  total_sold: number;
}

const SalesReport: React.FC = () => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const navigate = useNavigate();

  // Função para buscar as vendas por data
  const fetchSalesData = async (date: string) => {
    try {
      const response = await axios.get('http://127.0.0.1:3000/analytics/sales-over-time/2');
      setSalesData(response.data);
    } catch (error) {
      console.error('Erro ao buscar dados de vendas:', error);
    }
  };

  // Função chamada ao submeter a data
  const handleDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate) {
      fetchSalesData(selectedDate);
    }
  };

  // Preparar os dados para o gráfico
  const chartData = [
    ['Data', 'Total Vendido'],
    ...salesData.map((data) => [data.date, data.total_sold]),
  ];

  // Configurações do gráfico
  const options = {
    chartArea: { width: '80%' },
    hAxis: {
      title: 'Data',
      minValue: 0,
    },
    vAxis: {
      title: 'Total Vendido',
    },
    legend: {
      position: 'top',
    },
    colors: ['#06b6d4'],
  };

  return (
    <div>
      
      <button
        onClick={() => navigate('/report')} // Navegar para a página de Relatório de Categorias
        className="mt-4 !m-4 px-6 py-2 !ml-14 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors"
      >
        Relatório de Categorias
      </button>

      <button
        onClick={() => navigate('/product-report')} // Navegar para a página de Produtos Mais Vendidos
        className="mt-4 !m-4 px-6 py-2 !ml-14 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors"
      >
        Produtos Mais Vendidos
      </button>

      <h1 className="text-center text-cyan-600 font-['Afacad_Flux']">Relatório de Vendas por Data</h1>

      {/* Formulário para selecionar a data */}
      <form onSubmit={handleDateSubmit} className="mt-8 text-center">
        <label htmlFor="date" className="mr-2">Selecione a Data:</label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 h-50 w-80 py-2 rounded-md border border-gray-300"
        />
        <button
          type="submit"
          className="ml-4 px-6 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors"
        >
          Buscar
        </button>
      </form>

      {/* Exibição dos dados em formato de tabela */}
{salesData.length > 0 && (
  <div className=" mx-auto mt-8 w-[60%]">
    <table className="min-w-full border-collapse table-auto w-full text-left">
      <thead>
        <tr>
          <th className="px-4 py-2 border-b border-gray-200">Data</th>
          <th className="px-4 py-2 border-b border-gray-200">Total Vendido</th>
        </tr>
      </thead>
      <tbody>
        {salesData.map((data) => (
          <tr key={data.date}>
            <td className="px-4 py-2 border-b border-gray-200">{data.date}</td>
            <td className="px-4 py-2 border-b border-gray-200">{data.total_sold}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

    </div>
  );
};

export default SalesReport;