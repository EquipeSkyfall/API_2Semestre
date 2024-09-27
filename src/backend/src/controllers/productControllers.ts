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
    const { id } = request.params; // Get the products ID from the URL
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
    const { id } = request.params; // Get the products ID from the URL

    try {
      await prisma.products.delete({
        where: { id: Number(id) } // Delete based on ID
      });
      response.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      response.status(500).json({ message: 'Error deleting product', error });
    }
  };
  
  // public checkEmailExists = async (request: Request, response: Response) => {
  //   const { email } = request.body;
  
  //   try {
  //     const existingUser = await prisma.products.findUnique({
  //       where: { email },
  //     });
  
  //     return response.status(200).json({ exists: !!existingUser });
  //   } catch (error) {
  //     response.status(500).json({ message: 'Error checking email', error });
  //   }
  // }

  public getProductById = async (request: Request, response: Response) => {
    const { id } = request.params; // Get the products ID from the URL
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

  public getProductName = async (request: Request, response: Response) => {
    const { product_name } = request.params; // Get the product Name from the URL
    try {
      const products = await prisma.products.findMany({
        where: {product_name: product_name }, // Find based on Name
      });

      if (!products) {
        return response.status(404).json({ message: 'Product not found' });
      }

      response.status(200).json(products); // Send the products data as JSON response
    } catch (error) {
      response.status(500).json({ message: 'Error fetching products by ID', error });
    }
  };




}

const productController = new ProductControllers();

export { productController };