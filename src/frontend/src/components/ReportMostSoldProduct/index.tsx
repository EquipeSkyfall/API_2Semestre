import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart } from 'react-google-charts';
import { useNavigate } from 'react-router-dom'; // Hook de navegação

interface Product {
  nome_produto: string;
  descricao_produto: string;
  total_sold: number;
}

const ProductReport: React.FC = () => {
  const [mostSoldProducts, setMostSoldProducts] = useState<Product[]>([]);
  const navigate = useNavigate(); // Hook de navegação

  // Função para buscar os produtos mais vendidos
  const fetchMostSoldProducts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:3000/analytics/most-sold-products');
      setMostSoldProducts(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos mais vendidos:', error);
    }
  };

  // Usar useEffect para buscar os dados quando o componente monta
  useEffect(() => {
    fetchMostSoldProducts();
  }, []);

  // Preparar os dados para o gráfico
  const chartData = [
    ['Produto', 'Total Vendido'],
    ...mostSoldProducts.map(product => [product.nome_produto, product.total_sold]),
  ];

  // Configurações do gráfico
  const options = {
    title: 'Produtos Mais Vendidos', // Título do gráfico
    chartArea: { width: '70%' }, // Ajuste da área do gráfico
    hAxis: {
      title: 'Produto', // Título do eixo X
      minValue: 0,
    },
    vAxis: {
      title: 'Total Vendido', // Título do eixo Y
    },
    legend: {
      position: 'top', // Posição da legenda
    },
  };

  return (
    <div>
      <button
        onClick={() => navigate('/report')} // Navegar para a página de Report
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Relatório de Categorias
      </button>
      <h1 className="text-center my-8">Produtos Mais Vendidos</h1> {/* Título centralizado */}

      {/* Gráfico para exibir os produtos mais vendidos */}
      <Chart
        chartType="ColumnChart"
        width="100%"
        height="400px"
        data={chartData}
        options={options} 
      />

      {/* Tabela de produtos mais vendidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {mostSoldProducts.map((product) => (
          <div
            key={product.nome_produto}
            className="bg-white shadow-md rounded-md p-4 border border-gray-200"
          >
            <h2 className="text-xl font-semibold">{product.nome_produto}</h2>
            <p className="text-gray-500">{product.descricao_produto}</p>
            <p className="mt-2 font-medium">Total Vendido: {product.total_sold}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReport;
