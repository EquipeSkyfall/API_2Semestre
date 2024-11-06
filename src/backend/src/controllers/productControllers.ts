import express, { Response, Request } from 'express';
import prisma  from '../dbConnector'; // Make sure your prisma import is correct
import { logControllers, RequestWithUser } from './logControllers';

class ProductControllers {

  public getProducts = async (request: Request, response: Response) => {
    const { search='', id_setor, id_categoria, id_fornecedor, forshipping, page = '1', limit = '10' } = request.query; 
    const { productsArray = [] } = request.body;
    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;
    // console.log('Received query:', request.query);

    try {
        const whereCondition: any = { produto_deletedAt: null }; // Exclude soft-deleted products

        // Apply filters based on query parameters
        if (search) {
            whereCondition.nome_produto = {
                contains: search,
            };
        }
        if (id_setor) {
            whereCondition.id_setor = parseInt(id_setor as string);
        }
        if (id_categoria) {
            whereCondition.id_categoria = parseInt(id_categoria as string);
        }
        if (id_fornecedor) {
          whereCondition.fornecedores = {
              none: {
                  id_fornecedor: parseInt(id_fornecedor as string),
              },
          };
        }
        if (forshipping) {
          whereCondition.total_estoque = {
            gt: 0,
          };
        }
        if (productsArray.length > 0) {
          whereCondition.id = { in: productsArray }
        }

        const totalProducts = await prisma.produto.count({
            where: whereCondition,
        });

        const productsWithCount = await (await prisma.produto.findMany({
            where: whereCondition,
            skip,
            take: limitNumber,
            orderBy: {
              nome_produto: 'asc',
            },
            include: {
              categoria: {
                select: {
                  nome_categoria: true,
                },
              },
              setor: {
                select: {
                  nome_setor: true,
                },
              },
            },
          }))

        // console.log(productsWithCount)
        response.status(200).json({
          products: productsWithCount,
          totalProducts,
          totalPages: Math.ceil(totalProducts / limitNumber),
          currentPage: pageNumber,
        });
      } catch (error) {
        console.error('Error fetching products:', error);
        response.status(500).json({ message: 'Error fetching products', error });
      }
  };

  public createProduct = async (request: RequestWithUser, response: Response) => {
    try {
      // Extract supplier information from the request body
      // console.log('Full Request Body:', request.body)

      const { id_fornecedor, preco_custo, ...productData } = request.body;

      // console.log('Product Data:', productData);

      const product = await prisma.produto.create({
        data: productData,
      });

      logControllers.logActions(request.user?.id, "Produto criado.", {id_produto: product.id_produto})

      // If a supplier is provided, create the association in ProdutosFornecedor
      if (id_fornecedor) {
        await prisma.produtosFornecedor.create({
          data: {
            id_fornecedor,
            id_produto: product.id_produto,
            preco_custo: preco_custo
          },
        });
      }

      // Send the result as a JSON response
      response.status(201).json(product);
    } catch (error) {
      // Handle any errors that occur during the database query
      response.status(500).json({ message: 'Error creating product', error });
    }
  };



  // FUNÇÕES DE ATUALIZAÇÃO \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
  public updateProduct = async (request: RequestWithUser, response: Response) => {
    const { id } = request.params; // Get the products ID from the URL
    console.log('update query:'+ request.params)
    // Data to update
    console.log(request.body)
    console.log(request.params)
    const {createdAt,updatedAT, ...dataToUpdate} =request.body
    try {
      const updatedProduct = await prisma.produto.update({
        where: { id_produto: Number(id) }, // Update based on ID
        data: {
          ...dataToUpdate
        }
      });

      logControllers.logActions(request.user?.id, "Produto editado.", {id_produto: Number(id)})

      response.status(200).json(updatedProduct);
    } catch (error) {
      response.status(500).json({ message: 'Error updating products', error });
    }
  }

  public addSupplierToProduct = async (request: Request, response: Response) => {
    const { id } = request.params
    const { id_fornecedor, preco_custo } = request.body;
  
    try {
      // Check if the association already exists
      const existingRelation = await prisma.produtosFornecedor.findFirst({
        where: {
          id_produto: Number(id),
          id_fornecedor: Number(id_fornecedor),
        },
      });
  
      if (existingRelation) {
        return response.status(400).json({ message: 'Supplier is already associated with this product.' });
      }
  
      // Create the association
      const newAssociation = await prisma.produtosFornecedor.create({
        data: {
          id_produto: Number(id),
          id_fornecedor: Number(id_fornecedor),
          preco_custo: preco_custo
        },
      });
  
      response.status(201).json(newAssociation);
    } catch (error) {
      response.status(500).json({ message: 'Error adding supplier to product', error });
    }
  };

  public removeSupplierFromProduct = async (request: Request, response: Response) => {
    const { id } = request.params
    const { id_fornecedor } = request.body;
  
    try {
      // Check if the association exists
      const existingRelation = await prisma.produtosFornecedor.findFirst({
        where: {
          id_produto: Number(id),
          id_fornecedor: Number(id_fornecedor),
        },
      });
  
      if (!existingRelation) {
        return response.status(404).json({ message: 'Supplier association not found for this product.' });
      }
  
      // Remove the association
      await prisma.produtosFornecedor.delete({
        where: {
          id_fornecedor_id_produto: {
            id_fornecedor: Number(id_fornecedor),
            id_produto: Number(id),
          },
        },
      });
  
      response.status(200).json({ message: 'Supplier removed from product successfully.' });
    } catch (error) {
      response.status(500).json({ message: 'Error removing supplier from product', error });
    }
  };
  // FUNÇÕES DE ATUALIZAÇÃO /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
  
  

  // Delete a product by ID
  public deleteProduct = async (request: RequestWithUser, response: Response) => {
    const { id } = request.params; // Get the products ID from the URL
    console.log(request.params)
    try {
      const hasLoteRelationships = await prisma.loteProdutos.count({
        where: { id_produto: Number(id) },
      });
      const hasSaidaRelationships = await prisma.saidaProduto.count({
        where: { id_produto: Number(id) },
      });
      const hasRelationships = hasLoteRelationships > 0 || hasSaidaRelationships > 0;

      if (hasRelationships) {
        await prisma.produtosFornecedor.deleteMany({
          where: { id_produto: Number(id) }, // Delete all supplier relationships for this product
        });
        // If there are existing relationships, perform a soft delete
        await prisma.produto.update({
            where: { id_produto: Number(id) },
            data: { produto_deletedAt: new Date() },
        });

        logControllers.logActions(request.user?.id, "Produto deletado.", {id_produto: Number(id)})

        return response.status(200).json({ message: 'Product soft deleted successfully' });
      } else {
        await prisma.produtosFornecedor.deleteMany({
          where: { id_produto: Number(id) }, // Delete all supplier relationships for this product
        });
        // If no relationships exist, perform a hard delete
        await prisma.produto.delete({
            where: { id_produto: Number(id) },
        });

        logControllers.logActions(request.user?.id, "Produto deletado.", {id_produto: Number(id)})

        return response.status(200).json({ message: 'Product deleted successfully' });
      }

    } catch (error) {
        response.status(500).json({ message: 'Error deleting product', error });
    }
  };


  public getProductById = async (request: Request, response: Response) => {
    const { id } = request.params; // Get the products ID from the URL
    console.log(request.params)
    try {
      const products = await prisma.produto.findUnique({
        where: { produto_deletedAt: null, id_produto: Number(id) }, // Find based on ID
      });

      if (!products) {
        return response.status(404).json({ message: 'Product not found' });
      }

      response.status(200).json(products); // Send the products data as JSON response
    } catch (error) {
      response.status(500).json({ message: 'Error fetching products by ID', error });
    }
  };

  public getProductBatches = async (request: Request, response: Response) => {
    const { id } = request.params

    try {
      const productBatch = await prisma.loteProdutos.findMany({
        where: { id_produto: Number(id) },
        include: {
          saidas: true
        },
        orderBy: {
          validade_produto: 'asc', // Sort by validade_produto in ascending order
        }
      })

      const result = productBatch.map(batch => {
        const totalSaida = batch.saidas.reduce((sum: any, saida: any) => {
          return sum + saida.quantidade_retirada
        }, 0)

        return {
          id_lote: batch.id_lote,
          id_produto: batch.id_produto,
          quantidadeDisponivel: batch.quantidade - totalSaida,
          validade_produto: batch.validade_produto
        }
      }).filter(batch => batch.quantidadeDisponivel > 0)
        .sort((a, b) => {
          // Handle null validade_produto values: Place batches with null expiration at the end
          if (a.validade_produto === null) return 1;
          if (b.validade_produto === null) return -1;
          // Compare Date objects
          return new Date(a.validade_produto).getTime() - new Date(b.validade_produto).getTime();
        });

      console.log(result)

      response.status(200).json(result)
    } catch (error) {
      response.status(500).json({ message: 'Error fetching batches for product:', error })
    }
  };

  public getProductsWithMissingData = async (request: Request, response: Response) => {
    try {
        const productsWithMissingData = await prisma.produto.findMany({
            where: {
                produto_deletedAt: null,
                OR: [
                    { id_categoria: null },
                    { id_setor: null }
                ]
            }
        });

        response.status(200).json(productsWithMissingData);
    } catch (error) {
        console.error('Error fetching products with missing category or sector:', error);
        response.status(500).json({ message: 'Error fetching products', error });
    }
  };

  public getProductsWithLowStock = async (request: Request, response: Response) => {
    try{
      const productsWithLowStock = await prisma.produto.findMany({
        where: {
          produto_deletedAt: null,
          total_estoque: {
            lt: 11
          }
        },
        select: {
          id_produto: true, // Select only the 'id' field
        },
      });

      console.log('Talk to me LowStock: ',productsWithLowStock)

      response.status(200).json(productsWithLowStock);
    } catch (error) {
      console.error("Error fetching products with low stock:", error);
      response.status(500).json({ error: "Failed to fetch products with low stock" });
    }
  };

  public getProductsWithExpiringBatches = async (request: Request, response: Response) => {
    try {
        // Get today's date and calculate the target date (10 days from now)
        const today = new Date();
        const targetDate = new Date();
        targetDate.setDate(today.getDate() + 10);

        const productsWithExpiringBatches = await prisma.produto.findMany({
            where: {
                produto_deletedAt: null,
                lotes: {
                    some: {
                        validade_produto: {
                            lte: targetDate,
                            gte: today
                        },
                        quantidade: {
                            not: {
                                equals: 0,
                            }
                        }
                    }
                }
            },
            select: {
                id_produto: true, // Select only the 'id' field
            },
        });

        // Prepare an array to hold products that pass the quantity check
        const validProducts = [];

        // Iterate over each product and check the quantity
        for (const product of productsWithExpiringBatches) {
            const lotes = await prisma.loteProdutos.findMany({
                where: {
                    id_produto: product.id_produto,
                },
                include: {
                    saidas: true,
                },
            });

            // Calculate total quantity across all lotes minus total sales
            let totalQuantity = 0;
            lotes.forEach(lote => {
                const totalSaidas = lote.saidas.reduce((sum, saida) => sum + saida.quantidade_retirada, 0);
                totalQuantity += lote.quantidade - totalSaidas;
            });

            // Check if total quantity is greater than zero
            if (totalQuantity > 0) {
                validProducts.push(product);
            }
        }

        console.log('Valid products with expiring batches: ', validProducts);

        response.status(200).json(validProducts);
    } catch (error) {
        console.error("Error fetching products with expiring batches:", error);
        response.status(500).json({ error: "Failed to fetch products with expiring batches" });
    }
  };
}

const productController = new ProductControllers();

export { productController };