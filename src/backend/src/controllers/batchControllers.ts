import express, { Response, Request } from 'express';
import prisma from '../dbConnector';
import { request } from 'http';
import { productController } from './productControllers';

class BatchControllers {

    public getBatches = async (request: Request, response: Response) => {
        const { search='', page='1', limit='10' } = request.query
        const pageNumber = parseInt(page as string)
        const limitNumber = parseInt(limit as string)
        const skip = (pageNumber - 1) * limitNumber

        try {
            const whereCondition: any = {}

            if (search) {
                const datePattern = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
    
                if (datePattern.test(search as string)) {
                    // Exact date search (e.g., '2024-10-02')
                    whereCondition.data_venda = new Date(search as string);
                } else {
                    // Handle other formats or provide an error response
                    return response.status(400).json({ message: 'Invalid date format. Please use YYYY-MM-DD.' });
                }
            }

            const totalBatches = await prisma.lote.count({
                where: whereCondition
            })

            const batches = await prisma.lote.findMany({
                where: whereCondition,
                skip,
                take: limitNumber,
                orderBy: {
                    data_compra: 'desc',
                },
                include: {
                    fornecedor: {
                        select: {
                            razao_social: true,
                        },
                    },
                    produtos: {
                        select: {
                            quantidade: true,
                            validade_produto: true,
                            produto: {
                                select: {
                                    nome_produto: true,
                                },
                            },
                        },
                    },
                },
            })

            const batchListWithChecks = await Promise.all(batches.map(async (batch) => {
                const hasRelationships = await this.checkBatchRelationships(batch.id_lote)

                return{
                    ...batch,
                    isEditable: !hasRelationships
                }
            }))

            response.status(200).json({
                batchListWithChecks,
                totalBatches,
                totalPages: Math.ceil(totalBatches / limitNumber),
                currentPage: pageNumber
            })
        } catch (error) {
            console.error('Error fetching batches:', error )
            response.status(500).json({ message: 'Error fetching batches:', error })
        }
    };

    public createBatch = async (request: Request, response: Response) => {
        const { id_fornecedor, data_compra, produtos } = request.body

        try {
            const lote = await prisma.lote.create({
                data: {
                    id_fornecedor: id_fornecedor,
                    data_compra: new Date(data_compra)
                }
            })

            const loteProdutosData = produtos.map((produto: any) => ({
                id_lote: lote.id_lote,
                id_produto: produto.id_produto,
                quantidade: produto.quantidade,
                validade_produto: produto.validade_produto ? new Date(produto.validade_produto) : null
            }))

            const updatePromises = produtos.map(async (produto: any) => {
                return prisma.produto.update({
                    where: {
                        id_produto: produto.id_produto
                    },
                    data: {
                        total_estoque: {
                            increment: produto.quantidade
                        }
                    }
                });
            });

            await Promise.all(updatePromises);

            await prisma.loteProdutos.createMany({
                data: loteProdutosData
            });

            response.status(201).json({
                message: 'Batch registered successfully.',
                lote
            })
        } catch (error) {
            console.error('Error registering batch:', error )
            response.status(500).json({ message: 'Error registering batch:', error })
        }
    };

    public updateBatch = async (request: Request, response: Response) => {
        const { id } = request.params

        const { createdAt, updatedAT, data_compra, produtos } = request.body
        try {
            const hasRelationships = await this.checkBatchRelationships(Number(id))

            if (!hasRelationships) {
                const updatedLote = await prisma.lote.update({
                    where: {
                        id_lote: Number(id)
                    },
                    data: {
                        data_compra: new Date(data_compra)
                    }
                })

                for (const produto of produtos) {
                    await prisma.loteProdutos.update({
                        where: {
                            id_lote_id_produto: {
                                id_lote: Number(id),
                                id_produto: produto.id_produto
                            }
                        },
                        data: {
                            quantidade: produto.quantidade,
                            validade_produto: produto.validade_produto ? new Date(produto.validade_produto) : null
                        }
                    })
                }
                return response.status(200).json({
                    message: 'Batch and products updated successfully.',
                    lote: updatedLote
                })
            }
            response.status(400).json({ message: 'Batch cannot be edited.' })
        } catch (error) {
            console.error('Error updating batch and products:', error)
            response.status(500).json({ message: 'Error updating batch and products:', error })
        }
    };

    public deleteBatch = async (request: Request, response: Response) => {
        const { id } = request.params

        try {
            const hasRelationships = await this.checkBatchRelationships(Number(id))

            if (!hasRelationships) {
                await prisma.loteProdutos.deleteMany({
                    where: { id_lote: Number(id) }
                })

                await prisma.lote.delete({
                    where: { id_lote: Number(id) }
                })
                return response.status(200).json({ message: 'Batch deleted successfully.' })
            }
            response.status(400).json({ message: 'Batch cannot be deleted.' })
        } catch (error) {
            response.status(500).json({ message: 'Error deleting batch:', error })
        }
    };

    public getBatchById = async (request: Request, response: Response) => {
        const { id } = request.params

        try {
            const batch = await prisma.lote.findUnique({
                where: { id_lote: Number(id) },
                include: {
                    produtos: { // Include the products associated with the batch
                        include: {
                            produto: true
                        }
                    }
                }
            })

            if (!batch) {
                return response.status(404).json({ message: 'Batch not found.' })
            }

            response.status(200).json(batch)
        } catch (error) {
            response.status(500).json({ message: 'Error fetching batch by ID', error })
        }
    };

    public checkBatchRelationships = async (id_lote: number) => {
        try {    
            // Check if there are any related entries in SaidaProduto
            const hasSaidaProducts = await prisma.saidaProduto.count({
                where: {
                    id_lote: id_lote,
                },
            });
    
            // If either count is greater than 0, the batch has existing relationships
            const hasRelationships = hasSaidaProducts > 0;
    
            return hasRelationships;
        } catch (error) {
            console.error('Error checking batch relationships:', error);
            throw new Error('Error checking batch relationships');
        }
    };
}

const batchController = new BatchControllers()

export { batchController }