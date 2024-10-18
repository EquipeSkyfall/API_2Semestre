import express, { Response, Request } from 'express';
import prisma  from '../dbConnector';

class SupplierControllers {

    public getSuppliers = async (request: Request, response: Response) => {
        const { search = '', cidade, estado, page = '1', limit = '10' } = request.query
        const pageNumber = parseInt(page as string)
        const limitNumber = parseInt(limit as string)
        const skip = (pageNumber-1) * limitNumber

        try {
            const whereCondition: any = { fornecedor_deletedAt: null }

            if (search) {
                whereCondition.razao_social = {
                    contains: search
                }
            }
            if (cidade) {
                whereCondition.cidade = cidade as string
            }
            if (estado) {
                whereCondition.estado = estado as string
            }

            const totalSuppliers = await prisma.fornecedor.count({
                where: whereCondition
            })

            const suppliers = await prisma.fornecedor.findMany({
                where: whereCondition,
                skip,
                take: limitNumber
            })

            response.status(200).json({
                suppliers,
                totalSuppliers,
                totalPages: Math.ceil(totalSuppliers / limitNumber),
                currentPage: pageNumber
            })
        } catch (error) {
            console.error('Error fetching suppliers:', error)
            response.status(500).json({ message: 'Error fetching suppliers:', error })
        }
    };

    public createSupplier = async (request: Request, response: Response) => {
        try {
            console.log('Full Request Body:', request.body)
            const { ...supplierData } = request.body
            console.log('Supplier Data:', supplierData);

            const supplier = await prisma.fornecedor.create({
                data: supplierData
            })

            response.status(201).json(supplier)
        } catch (error) {
            response.status(500).json({ message: 'Error creating supplier:', error })
        }
    };

    public updateSupplier = async (request: Request, response: Response) => {
        const { id } = request.params

        const { createdAt, updatedAT, ...dataToUpdate } = request.body
        try {
            const updatedSupplier = await prisma.fornecedor.update({
                where: { id_fornecedor: Number(id) },
                data: {
                    ...dataToUpdate
                }
            })
            response.status(200).json(updatedSupplier)
        } catch (error) {
            response.status(500).json({ message: 'Error updating supplier', error})
        }
    };

    public addProductToSupplier = async (request: Request, response: Response) => {
        const { id } = request.params; // Supplier ID from the URL parameters
        const { products } = request.body; // Expecting an array of products in the request body
    
        try {
            // Validate input
            if (!Array.isArray(products) || products.length === 0) {
                return response.status(400).json({ message: 'Invalid input. Please provide an array of products.' });
            }
    
            const createPromises = products.map(async ({ id_produto, preco_custo }) => {
                return prisma.produtosFornecedor.create({
                    data: {
                        id_produto: Number(id_produto),
                        id_fornecedor: Number(id),
                        preco_custo: preco_custo,
                    },
                });
            });
    
            // Wait for all associations to be created
            const results = await Promise.all(createPromises);

            const createdAssociations = results.filter(result => !(typeof result === 'object' && 'message' in result));
    
            response.status(201).json({
                message: 'Products associated with supplier successfully.',
                createdAssociations
            });
        } catch (error) {
            response.status(500).json({ message: 'Error adding supplier to products', error });
        }
    };
    
    public removeProductFromSupplier = async (request: Request, response: Response) => {
        const { id } = request.params;
        const { products } = request.body;
      
        try {
            // Validate input
            if (!Array.isArray(products) || products.length === 0) {
                return response.status(400).json({ message: 'Invalid input. Please provide an array of products.' });
            }
    
            const deletePromises = products.map(async ({ id_produto }) => {
                await prisma.produtosFornecedor.delete({
                    where: {
                        id_fornecedor_id_produto: {
                            id_fornecedor: Number(id),
                            id_produto: Number(id_produto),
                        },
                    },
                });
                return { id_produto, message: 'Supplier removed from product successfully.' };
            });
    
            // Wait for all deletions to complete
            const results = await Promise.all(deletePromises);
    
            // Separate successful deletions and messages for not found associations
            const successfulDeletions = results.filter(result => !(typeof result === 'object' && result.message.includes('not found')));
            const notFoundAssociations = results.filter(result => typeof result === 'object' && result.message.includes('not found'));
    
            response.status(200).json({
                message: 'Products processed for removal from supplier successfully.',
                successfulDeletions,
                notFoundAssociations,
            });
        } catch (error) {
          response.status(500).json({ message: 'Error removing supplier from products', error });
        }
    };

    public deleteSupplier = async (request: Request, response: Response) => {
        const { id } = request.params

        try {
            const hasLoteRelationships = await prisma.lote.count({
                where: { id_fornecedor: Number(id) }
            })
            const hasRelationships = hasLoteRelationships > 0

            if (hasRelationships) {
                await prisma.fornecedor.update({
                    where: { id_fornecedor: Number(id) },
                    data: { fornecedor_deletedAt: new Date() }
                })
            } else {
                await prisma.produtosFornecedor.deleteMany({
                    where: { id_fornecedor: Number(id) }
                })
                await prisma.fornecedor.delete({
                    where: { id_fornecedor: Number(id) }
                })
                return response.status(200).json({ message: 'Supplier deleted successfully' })
            }
        } catch (error) {
            response.status(500).json({ message: 'Error deleting supplier:', error })
        }
    };

    public getSupplierById = async (request: Request, response: Response) => {
        const { id } = request.params

        try {
            const suppliers = await prisma.fornecedor.findUnique({
                where: { fornecedor_deletedAt: null, id_fornecedor: Number(id) }
            })

            if (!suppliers) {
                return response.status(404).json({ message: 'Supplier not found.' })
            }

            response.status(200).json(suppliers)
        } catch (error) {
            response.status(500).json({ message: 'Error fetching supplier by ID:', error })
        }
    };

    public getProductsFromSupplier = async (request: Request, response: Response) => {
        const { id } = request.params

        try {
            const products = await prisma.produtosFornecedor.findMany({
                where: { id_fornecedor: Number(id) },
                include: {
                    produto: {
                        select: {
                            nome_produto: true,
                            id_categoria: true,
                            permalink_imagem: true,
                            categoria: {
                                select: {
                                    nome_categoria: true
                                }
                            }
                        }
                    }
                }
            })

            if (!products) {
                return response.status(404).json({ message: 'Nenhum produto encontrado.' })
            }

            response.status(200).json(products)
        } catch (error) {
            response.status(500).json({ message: 'Error fetching products:', error })
        }
    };

}

const supplierController = new SupplierControllers()

export { supplierController }