import prisma from "../dbConnector";

export const fetchProductsWithStock = async () => {
  const products = await prisma.produto.findMany({
    orderBy: {
      nome_produto: 'asc',
    },
    select: {
      id_produto: true,
      lotes: {
        select: {
          quantidade: true,
          saidas: {
            select: {
              quantidade_retirada: true,
            },
           },
          },
        },
      },
    });

    // Calculate stock and filter products with available stock
    const filteredProducts = products.map(product => {
      const totalQuantity = product.lotes.reduce((sum, lote) => sum + lote.quantidade, 0);
      const totalRetirada = product.lotes.reduce((sum, lote) => {
        const totalLoteRetirada = lote.saidas.reduce((saidaSum, saida) => {
          return saidaSum + saida.quantidade_retirada;
        }, 0);
        return sum + totalLoteRetirada;
      }, 0);
      const quantidade_estoque = totalQuantity - totalRetirada;
  
      return {
        id_produto: product.id_produto,
        quantidade_estoque,
      };
    }).filter(product => product.quantidade_estoque > 0);

    return filteredProducts;
};