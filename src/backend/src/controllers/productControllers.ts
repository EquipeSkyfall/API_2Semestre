import express, { Response, Request } from 'express';
import prisma  from '../dbConnector'; // Make sure your prisma import is correct



class ProductControllers {

  private lowStockCache: { id_produto: number, nome_produto: string, totalStock: number }[] = [];
  private nearExpirationCache: { id_produto: number, nome_produto: string, lote_id: number, expirationDate: Date }[] = [];

  public getProducts = async (request: Request, response: Response) => {
    const { search='', id_setor, id_categoria, id_fornecedor, forshipping, page = '1', limit = '10' } = request.query; 
    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;
    console.log('Received query:', request.query);

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

        const totalProducts = await prisma.produto.count({
            where: whereCondition,
        });

        const products = await prisma.produto.findMany({
            where: whereCondition,
            skip,
            take: limitNumber,
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
              lotes: {
                select: {
                  quantidade: true,
                  saidas: {
                    select: {
                      quantidade_retirada: true,
                    },
                  }
                },
              },
            },
        });

        // Calculate available stock for each product
        const productsWithStock = products.map(product => {
          const totalQuantity = product.lotes.reduce((sum, lote) => sum + lote.quantidade, 0);
          const totalRetirada = product.lotes.reduce((sum, lote) => {
            const totalLoteRetirada = lote.saidas.reduce((saidaSum, saida) => {
              return saidaSum + saida.quantidade_retirada;
            }, 0);
            return sum + totalLoteRetirada;
          }, 0);
          const quantidade_estoque = totalQuantity - totalRetirada;

          return {
            ...product,
            quantidade_estoque,
            nome_categoria: product.categoria?.nome_categoria || 'Sem categoria',
            nome_setor: product.setor?.nome_setor || 'Sem setor',
          };
        });

        const filteredProducts = forshipping 
        ? productsWithStock.filter(product => product.quantidade_estoque > 0) 
        : productsWithStock;

        const totalFilteredProducts = forshipping 
            ? filteredProducts.length 
            : totalProducts;
        
        response.status(200).json({
            products: filteredProducts,
            totalFilteredProducts,
            totalPages: Math.ceil(totalFilteredProducts / limitNumber),
            currentPage: pageNumber,
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        response.status(500).json({ message: 'Error fetching products', error });
    }
  };

  public createProduct = async (request: Request, response: Response) => {
    try {
      // Extract supplier information from the request body
      console.log('Full Request Body:', request.body)

      const { id_fornecedor, preco_custo, ...productData } = request.body;

      console.log('Product Data:', productData);

      const product = await prisma.produto.create({
        data: productData,
      });

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
  public updateProduct = async (request: Request, response: Response) => {
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
  public deleteProduct = async (request: Request, response: Response) => {
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
        return response.status(200).json({ message: 'Product soft deleted successfully' });

      } else {
        await prisma.produtosFornecedor.deleteMany({
          where: { id_produto: Number(id) }, // Delete all supplier relationships for this product
        });
        // If no relationships exist, perform a hard delete
        await prisma.produto.delete({
            where: { id_produto: Number(id) },
        });
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
      }).filter(batch => batch.quantidadeDisponivel > 0);
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

  // Fetching Products with Low Stock and storing them. \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
  public checkLowStock = async () => {
    try {
      const products = await prisma.produto.findMany({
        where: { produto_deletedAt: null }, // Fetch all active products
        include: {
          lotes: {
            include: {
              saidas: true
            }
          }
        }
      });

      const lowStockThreshold = 10; // Example threshold for low stock

      // Clear the previous cache
      this.lowStockCache = [];

      // Iterate through all products and calculate stock
      products.forEach(product => {
        const totalBatches = product.lotes.reduce((sum: number, batch: any) => sum + batch.quantidade, 0);
        const totalShipments = product.lotes.reduce((sum: number, batch: any) => {
          return sum + batch.saidas.reduce((batchSum: number, saida: any) => batchSum + saida.quantidade_retirada, 0);
        }, 0);
        
        const totalStock = totalBatches - totalShipments;

        // If stock is below the threshold, add it to the cache
        if (totalStock <= lowStockThreshold) {
          this.lowStockCache.push({
            id_produto: product.id_produto,
            nome_produto: product.nome_produto,
            totalStock
          });
        }
      });

      console.log("Low stock products cached:", this.lowStockCache);
    } catch (error) {
      console.error('Error checking low stock:', error);
    }
  };

  public getLowStockProducts = (request: Request, response: Response) => {
    try {
      response.status(200).json(this.lowStockCache);
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      response.status(500).json({ message: 'Error fetching low stock products' });
    }
  };
  // Fetching Products with Low Stock and storing them. /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\

  // Fetching Products near Expiration Date and storing them. \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
  public checkNearExpiration = async () => {
    try {
      const products = await prisma.produto.findMany({
        where: { produto_deletedAt: null }, // Fetch all active products
        include: {
          lotes: true // Include product batches with expiration dates
        }
      });

      const expirationThresholdDays = 10;
      const today = new Date();

      // Clear the previous cache
      this.nearExpirationCache = [];

      // Iterate through all products and check for expiration dates
      products.forEach(product => {
        product.lotes.forEach(batch => {
          const expirationDate = batch.validade_produto ? new Date(batch.validade_produto) : null;
          if (expirationDate) {
            const timeDifference = expirationDate.getTime() - today.getTime();
            const daysUntilExpiration = Math.ceil(timeDifference / (1000 * 3600 * 24));
          
            if (daysUntilExpiration <= expirationThresholdDays) {
              this.nearExpirationCache.push({
                id_produto: product.id_produto,
                nome_produto: product.nome_produto,
                lote_id: batch.id_lote,
                expirationDate
              });
            }
          }
        });
      });

      console.log("Near expiration products cached:", this.nearExpirationCache);
    } catch (error) {
      console.error('Error checking near expiration products:', error);
    }
  };

  public getNearExpirationProducts = (request: Request, response: Response) => {
    try {
      response.status(200).json(this.nearExpirationCache);
    } catch (error) {
      console.error('Error fetching near expiration products:', error);
      response.status(500).json({ message: 'Error fetching near expiration products' });
    }
  };
  // Fetching Products near Expiration Date and storing them. /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\

}

const productController = new ProductControllers();

productController.checkLowStock()
productController.checkNearExpiration()

export { productController };