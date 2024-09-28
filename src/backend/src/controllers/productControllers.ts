import express, { Response, Request } from 'express';
import prisma  from '../dbConnector'; // Make sure your prisma import is correct



class ProductControllers {

  public getAllProducts = async (request: Request, response: Response) => {
    try {
      // Fetch data from the database using Prisma
      const products = await prisma.products.findMany();
      
      // Send the result as a JSON response
      response.status(200).json(products);
    } catch (error) {
      // Handle any errors that occur during the database query
      response.status(500).json({ message: 'Error fetching products', error });
    }
  }


  public createProduct = async (request: Request, response: Response) => {
    try {
    // console.log(request.body)
     
    
      // Fetch data from the database using Prisma

      const product = await prisma.products.create({
        data:{
          ...request.body
        }

      });
      
      // Send the result as a JSON response
      response.status(201).json(product);
    } catch (error) {
      // Handle any errors that occur during the database query
      response.status(500).json({ message: 'Error creating products', error });
    }
  }

  public updateProduct = async (request: Request, response: Response) => {
    const { id } = request.query; // Get the products ID from the URL
    console.log('update query:'+ request.query)
    // Data to update
    console.log(request.body)
    console.log(request.params)
    const {createdAt,updatedAT, ...dataToUpdate} =request.body
    try {
      const updatedProduct = await prisma.products.update({
        where: { id: Number(id) }, // Update based on ID
        data: {
          ...dataToUpdate
        }
      });
      response.status(200).json(updatedProduct);
    } catch (error) {
      response.status(500).json({ message: 'Error updating products', error });
    }
  };

  // Delete a products by ID
  public deleteProduct = async (request: Request, response: Response) => {
    const { id } = request.query; // Get the products ID from the URL
    console.log(request.query)
    try {
      await prisma.products.delete({
        where: { id: Number(id) } // Delete based on ID
      });
      response.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      response.status(500).json({ message: 'Error deleting product', error });
    }
  };
  

  public getProductById = async (request: Request, response: Response) => {
    const { id } = request.query; // Get the products ID from the URL
    console.log(request.query)
    try {
      const products = await prisma.products.findUnique({
        where: { id: Number(id) }, // Find based on ID
      });

      if (!products) {
        return response.status(404).json({ message: 'Product not found' });
      }

      response.status(200).json(products); // Send the products data as JSON response
    } catch (error) {
      response.status(500).json({ message: 'Error fetching products by ID', error });
    }
  };

  public searchProductName = async (request: Request, response: Response) => {
    const { product_name } = request.params; // Use query for searching
    console.log(request.query)
    try {
        const products = await prisma.products.findMany({
            where: {
                product_name: {
                    contains: product_name as string,
                },
            },
        });

        if (products.length === 0) {
            return response.status(404).json({ message: 'Product not found' });
        }

        response.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
        response.status(500).json({ message: 'Error fetching products', error });
    }
};




}

const productController = new ProductControllers();

export { productController };