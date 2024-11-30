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

      // Formatar os dados para o gráfico
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
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
      Produtos Mais Vendidos
      </button>

      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Categorias Mais Vendidas</h1>

      {/* Gráfico das categorias mais vendidas */}
      <Chart
        chartType="ColumnChart"
        width="100%"
        height="400px"
        data={chartData}
        options={{
          title: 'Categorias Mais Vendidas',
          hAxis: {
            title: 'Categoria',
          },
          vAxis: {
            title: 'Total Vendido',
          },
        }}
      />

      {/* Tabelas das categorias mais vendidas, lado a lado */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-evenly',
          marginTop: '20px',
          gap: '10px',
        }}
      >
        {/* Primeira metade */}
        <div style={{ flex: '0 0 45%', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'center' }}>
                <th style={{ border: '1px solid #ddd', padding: '5px' }}>Categoria</th>
                <th style={{ border: '1px solid #ddd', padding: '5px' }}>Vendas</th>
              </tr>
            </thead>
            <tbody>
              {firstHalf.map((category, index) => (
                <tr
                  key={category.nome_categoria}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9',
                  }}
                >
                  <td style={{ border: '1px solid #ddd', padding: '5px' }}>
                    {category.nome_categoria}
                  </td>
                  <td
                    style={{
                      border: '1px solid #ddd',
                      padding: '5px',
                      textAlign: 'center',
                    }}
                  >
                    {category.total_sold}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Segunda metade */}
        <div style={{ flex: '0 0 45%', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'center' }}>
                <th style={{ border: '1px solid #ddd', padding: '5px' }}>Categoria</th>
                <th style={{ border: '1px solid #ddd', padding: '5px' }}>Vendas</th>
              </tr>
            </thead>
            <tbody>
              {secondHalf.map((category, index) => (
                <tr
                  key={category.nome_categoria}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9',
                  }}
                >
                  <td style={{ border: '1px solid #ddd', padding: '5px' }}>
                    {category.nome_categoria}
                  </td>
                  <td
                    style={{
                      border: '1px solid #ddd',
                      padding: '5px',
                      textAlign: 'center',
                    }}
                  >
                    {category.total_sold}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Report;
