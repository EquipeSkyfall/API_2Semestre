import express, { Response, Request } from 'express';
import prisma  from '../dbConnector'; // Make sure your prisma import is correct



class UserController {

  public getAllUsers = async (request: Request, response: Response) => {
    try {
      // Fetch data from the database using Prisma
      const usersData = await prisma.users.findMany();
      
      // Send the result as a JSON response
      response.status(200).json(usersData);
    } catch (error) {
      // Handle any errors that occur during the database query
      response.status(500).json({ message: 'Error fetching users', error });
    }
  }
  public createUser = async (request: Request, response: Response) => {
    try {
    console.log(request.body)
     const {email,password,name,role} = request.body;
      // Fetch data from the database using Prisma
     
      const existingUser = await prisma.users.findUnique({
        where: { email },
      });
  
      if (existingUser) {
        return response.status(400).json({ message: 'Email already exists' });
      }
  
     
     
      const users = await prisma.users.create({
        data:{
            name,
            email,
            password,
            role
        }

      });
      
      // Send the result as a JSON response
      response.status(200).json(users);
    } catch (error) {
      // Handle any errors that occur during the database query
      response.status(500).json({ message: 'Error creating users', error });
    }
  }

  public updateUser = async (request: Request, response: Response) => {
    const { id } = request.params; // Get the users ID from the URL
    const { password, name, role } = request.body; // Data to update
    console.log(request.body)
    console.log(request.params)
    try {
      const updatedUser = await prisma.users.update({
        where: { id: Number(id) }, // Update based on ID
        data: {
          
          password,
          name,
          role
        }
      });
      response.status(200).json(updatedUser);
    } catch (error) {
      response.status(500).json({ message: 'Error updating users', error });
    }
  };

  // Delete a users by ID
  public deleteUser = async (request: Request, response: Response) => {
    const { id } = request.params; // Get the users ID from the URL

    try {
      await prisma.users.delete({
        where: { id: Number(id) } // Delete based on ID
      });
      response.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      response.status(500).json({ message: 'Error deleting users', error });
    }
  };
  
  // public checkEmailExists = async (request: Request, response: Response) => {
  //   const { email } = request.body;
  
  //   try {
  //     const existingUser = await prisma.users.findUnique({
  //       where: { email },
  //     });
  
  //     return response.status(200).json({ exists: !!existingUser });
  //   } catch (error) {
  //     response.status(500).json({ message: 'Error checking email', error });
  //   }
  // }

  public getUserById = async (request: Request, response: Response) => {
    const { id } = request.params; // Get the users ID from the URL
    try {
      const users = await prisma.users.findUnique({
        where: { id: Number(id) }, // Find based on ID
      });

      if (!users) {
        return response.status(404).json({ message: 'User not found' });
      }

      response.status(200).json(users); // Send the users data as JSON response
    } catch (error) {
      response.status(500).json({ message: 'Error fetching users by ID', error });
    }
  };




  
}

const userControllers = new UserController();

export { userControllers };