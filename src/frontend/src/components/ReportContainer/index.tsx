import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart } from 'react-google-charts';

interface Category {
  nome_categoria: string;
}


//Apenas o modelo de como deixar os dados para colocar no grafico
const chartData = [
  ['Year', 'Material Inserted', 'Material Removed'],
  ['2020', 500, 200],
  ['2021', 800, 300],
  ['2022', 600, 500],
  ['2023', 900, 400],
];

const Report: React.FC = () => {
  const [mostSoldCategories, setMostSoldCategories] = useState<Category[]>([]);

  // Função para buscar as categorias mais vendidas
  const fetchMostSoldCategories = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:3000/analytics/most-sold-categories');
      setMostSoldCategories(response.data);
    } catch (error) {
      console.error('Erro ao buscar categorias mais vendidas:', error);
    }
  };

  // Usar useEffect para buscar os dados quando o componente monta
  useEffect(() => {
    fetchMostSoldCategories();
  }, []);

  return (
    <div>
      <h1>Categorias Mais Vendidas</h1>

      {/*Apenas o modelo do gráfico para usar como base*/}
      <Chart
        chartType="ColumnChart"
        width="100%"
        height="400px"
        data={chartData}
      />

      <ul>
        {mostSoldCategories.map(category => (
          <li key={category.nome_categoria}>
            {category.nome_categoria}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Report;
