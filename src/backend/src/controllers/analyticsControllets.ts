import prisma from "../dbConnector";
import { Request, Response } from 'express';

export const getMostSoldProducts = async (req:Request, res:Response) => {
    try {
        const mostSoldProducts = await prisma.saidaProduto.groupBy({
            by: ['id_produto'],
            _sum: {
                quantidade_retirada: true,
            },
            orderBy: {
                _sum: {
                    quantidade_retirada: 'desc',
                },
            },
            take: 10, // Limit to the top 10 most sold products
        });

        // Include product details
        const productsWithDetails = await Promise.all(
            mostSoldProducts.map(async (entry) => {
                const product = await prisma.produto.findUnique({
                    where: { id_produto: entry.id_produto },
                    select: { nome_produto: true, descricao_produto: true },
                });
                return {
                    id_produto: entry.id_produto,
                    nome_produto: product?.nome_produto || 'N/A',
                    descricao_produto: product?.descricao_produto || 'N/A',
                    total_sold: entry._sum.quantidade_retirada || 0,
                };
            })
        );

        res.json(productsWithDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch most sold products' });
    }
};


export const getMostSoldCategories = async (req: Request, res: Response) => {
    try {
        const mostSoldCategories = await prisma.saidaProduto.groupBy({
            by: ['id_produto'],
            _sum: {
                quantidade_retirada: true,
            },
        });

        // Map product sales to categories
        const categorySales: Record<number, number> = {}; // Explicit typing

        for (const sale of mostSoldCategories) {
            const product = await prisma.produto.findUnique({
                where: { id_produto: sale.id_produto },
                select: { id_categoria: true },
            });

            if (product && product.id_categoria) {
                if (!categorySales[product.id_categoria]) {
                    categorySales[product.id_categoria] = 0;
                }
                categorySales[product.id_categoria] += sale._sum.quantidade_retirada || 0;
            }
        }

        // Fetch category details
        const categories = await prisma.categoria.findMany();
        const result = categories.map((category) => ({
            id_categoria: category.id_categoria,
            nome_categoria: category.nome_categoria,
            total_sold: categorySales[category.id_categoria] || 0,
        }));

        result.sort((a, b) => b.total_sold - a.total_sold); // Sort by sales descending

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch most sold categories' });
    }
};


export const getProductSalesOverTime = async (req: Request, res: Response) => {
    const { id_produto } = req.params;

    try {
        // Fetch sales data grouped by date
        const salesOverTime = await prisma.saidaProduto.groupBy({
            by: ['id_saida'], // Grouping by 'id_saida' to later get dates from 'saida'
            where: {
                id_produto: parseInt(id_produto),
            },
            _sum: {
                quantidade_retirada: true,
            },
        });

        const dailySales: Record<string, number> = {}; // Object to group sales by date

        // Aggregate sales by day
        for (const sale of salesOverTime) {
            const saleDate = await prisma.saida.findUnique({
                where: { id_saida: sale.id_saida },
                select: { data_venda: true },
            });

            if (saleDate?.data_venda) {
                const dateKey = saleDate.data_venda.toISOString().split('T')[0]; // Format date as YYYY-MM-DD

                if (!dailySales[dateKey]) {
                    dailySales[dateKey] = 0;
                }

                dailySales[dateKey] += sale._sum.quantidade_retirada || 0;
            }
        }

        // Convert dailySales object to an array for frontend consumption
        const timeSeries = Object.entries(dailySales).map(([date, total_sold]) => ({
            date,
            total_sold,
        }));

        // Sort by date in ascending order
        timeSeries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        res.json(timeSeries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch product sales over time' });
    }
};
