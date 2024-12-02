import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart } from 'react-google-charts';
import { useNavigate } from 'react-router-dom';

interface Category {
  nome_categoria: string;
  total_sold: number;
}

const Report: React.FC = () => {
  const [mostSoldCategories, setMostSoldCategories] = useState<Category[]>([]);
  const [chartData, setChartData] = useState<any[]>([
    ['Categoria', 'Total Vendido'], // Cabeçalhos do gráfico
  ]);

  const navigate = useNavigate(); // Usando o hook para navegação

  // Função para buscar as categorias mais vendidas
  const fetchMostSoldCategories = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:3000/analytics/most-sold-categories');
      setMostSoldCategories(response.data);

      const formattedData = response.data.map((category: Category) => [
        category.nome_categoria,
        category.total_sold,
      ]);

      // Atualizar os dados do gráfico
      setChartData((prevData) => [...prevData, ...formattedData]);
    } catch (error) {
      console.error('Erro ao buscar categorias mais vendidas:', error);
    }
  };

  // Usar useEffect para buscar os dados quando o componente monta
  useEffect(() => {
    fetchMostSoldCategories();
  }, []);

  // Dividir os dados das categorias em duas partes
  const halfIndex = Math.ceil(mostSoldCategories.length / 2);
  const firstHalf = mostSoldCategories.slice(0, halfIndex);
  const secondHalf = mostSoldCategories.slice(halfIndex);

  // Função de navegação para o relatório de produtos
  const goToProductReport = () => {
    navigate('/product-report');
  };

  return (
    <div>
      <button
        onClick={goToProductReport}
        className="mt-4 !m-4 px-6 py-2 bg-cyan-500 !ml-14 text-white rounded-md hover:bg-cyan-600 transition-colors"
      >
        Produtos Mais Vendidos
      </button>

      <button
        onClick={() => navigate('/sales-report')} // Navegar para a página de Report
        className="mt-4 !m-4 px-6 py-2 !ml-14 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors"
      >
        Gráfico Detalhado
      </button>

      <h1 style={{ textAlign: 'center' }} className="text-cyan-600 font-['Afacad_Flux']">Categorias Mais Vendidas</h1>

      {/* Gráfico das categorias mais vendidas */}
      <Chart
        chartType="ColumnChart"
        width="100%"
        height="400px"
        data={chartData}
        options={{
          legend: {
            position: 'top',
          },
          hAxis: {
            title: 'Categoria',
          },
          vAxis: {
            title: 'Total Vendido',
          },
          colors: ['#06b6d4'],
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8 w-[100%]">
        {mostSoldCategories.map((category) => (
          <div
            key={category.nome_categoria}
            className="bg-white transition-transform duration-300 hover:scale-[102%] shadow-md rounded-md p-4 border border-gray-200"
          >
            <h2 className="text-xl transition-colors">
              Categoria: <span className='font-semibold hover:text-cyan-600'>{category.nome_categoria}</span>
            </h2>
            <p className="mt-2 font-medium">Total Vendido: {category.total_sold}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Report;
