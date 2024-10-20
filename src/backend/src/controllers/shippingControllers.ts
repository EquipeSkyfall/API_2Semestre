import express, { Response, Request } from 'express';
import prisma from '../dbConnector';
import { request } from 'http';

class ShipmentControllers {
    public getShipments = async (request: Request, response: Response) => {
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

            const totalShipments = await prisma.saida.count({
                where: whereCondition
            })

            const shipments = await prisma.saida.findMany({
                where: whereCondition,
                skip,
                take: limitNumber,
                orderBy: {
                    data_venda: 'desc',
                },
                include: {
                    saidaProdutos: {
                        include: {
                            loteProduto: {
                                include: {
                                    produto: {
                                        select: {
                                            nome_produto: true,
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })

            response.status(200).json({
                shipments,
                totalShipments,
                totalPages: Math.ceil(totalShipments / limitNumber),
                currentPage: pageNumber
            })
        } catch (error) {
            console.error('Error fetching shipments:', error )
            response.status(500).json({ message: 'Error fetching shipments:', error })
        }
    };

    public createShipment = async (request: Request, response: Response) => {
        const { motivo_saida, produtos } = request.body

        try {
            const shipment = await prisma.saida.create({
                data: {
                    data_venda: new Date(),
                    motivo_saida: motivo_saida
                }
            })

            const saidaProdutosData = produtos.map((produto: any) => ({
                id_saida: shipment.id_saida,
                id_produto: produto.id_produto,
                id_lote: produto.id_lote,
                quantidade_retirada: produto.quantidade_retirada
            })) 

            await prisma.saidaProduto.createMany({
                data: saidaProdutosData
            })

            response.status(201).json({
                message: 'Shipment registered successfully.',
                shipment
            })
        } catch (error) {
            console.error('Error registering shipment:', error)
            response.status(500).json({ message: 'Error registering shipment:', error })
        }
    };

    public updateShipment = async (request: Request, response: Response) => {
        const { id } = request.params

        const { createdAt, updatedAT, motivo_saida, produtos } = request.body
        try {
            const updatedSaida = await prisma.saida.update({
                where: {
                    id_saida: Number(id)
                },
                data: {
                    motivo_saida: motivo_saida
                }
            })

            for (const produto of produtos) {
                await prisma.saidaProduto.update({
                    where: {
                        id_saida_id_produto_id_lote: {
                            id_saida: Number(id),
                            id_produto: produto.id_produto,
                            id_lote: produto.id_lote
                        }
                    },
                    data: {
                        quantidade_retirada: produto.quantidade_retirada
                    }
                })
            }
            response.status(200).json({
                message: 'Shipment and products updated successfully.',
                saida: updatedSaida
            })
        } catch (error) {
            console.error('Error updating shipment and products:', error )
            response.status(500).json({ message: 'Error updating shipment and products:', error })
        }
    };

    public deleteShipment = async (request: Request, response: Response) => {
        const { id } = request.params

        try {
            await prisma.saidaProduto.deleteMany({
                where: { id_saida: Number(id) }
            })

            await prisma.saida.delete({
                where: { id_saida: Number(id) }
            })
            response.status(200).json({ message: 'Shipment deleted successfully.' })
        } catch (error) {
            response.status(500).json({ message: 'Error deleting shipment:', error })
        }
    };

    public getShipmentById = async (request: Request, response: Response) => {
        const { id } = request.params

        try {
            const shipment = await prisma.saida.findUnique({
                where: { id_saida: Number(id) },
                include: {
                    saidaProdutos: {
                        include: {
                            loteProduto: true
                        }
                    }
                }
            })

            if (!shipment) {
                return response.status(404).json({ message: 'Shipment not found.' })
            }

            response.status(200).json(shipment)
        } catch (error) {
            response.status(500).json({ message: 'Error fetching shipment by ID:', error })
        }
    };
}

const shipmentController = new ShipmentControllers()

export { shipmentController }