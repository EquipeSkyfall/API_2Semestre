import express, { Response, Request } from 'express';
import prisma  from '../dbConnector'; // Make sure your prisma import is correct



class ProductControllers {

  public getProducts = async (request: Request, response: Response) => {
    const { search='', id_setor, id_categoria, page = '1', limit = '10' } = request.query; 
    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

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

        const totalProducts = await prisma.produto.count({
            where: whereCondition,
        });

        const products = await prisma.produto.findMany({
            where: whereCondition,
            skip,
            take: limitNumber,
        });

        response.status(200).json({
            products,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limitNumber),
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

      const { id_fornecedor, ...productData } = request.body;

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
          },
        });
      }

      // Send the result as a JSON response
      response.status(201).json(product);
    } catch (error) {
      // Handle any errors that occur during the database query
      response.status(500).json({ message: 'Error creating product', error });
    }
  }



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
    const { id_fornecedor } = request.body;
  
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

}

const productController = new ProductControllers();

export { productController };