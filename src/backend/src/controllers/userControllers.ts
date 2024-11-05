import express, { Response, Request } from 'express';
import prisma  from '../dbConnector'; // Make sure your prisma import is correct
import bcrypt from 'bcrypt';
import { JWT_SECRET } from '../secrets';
import { logControllers, RequestWithUser } from './logControllers';
const jwt = require('jsonwebtoken') 
const { promisify } = require('util');



class UserController {

  public getAllUsers = async (request: Request, response: Response) => {
    const { page = '1', limit = '10', searchTerm = '' } = request.query;
  // console.log(request.query)
    // Convert query params to appropriate types
    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * pageSize;
  
    const totalUsers = await prisma.users.count({
      where: {
        name: { contains: searchTerm as string }
      },
    });
    
    // console.log(searchTerm)
    try {
      // Fetch data from the database using Prisma with pagination and search
      if(!searchTerm){
         const usersData = await prisma.users.findMany({
          skip:(pageNumber -1) * pageSize,
          take: pageSize
         })
        //  console.log(usersData) 
         response.status(200).json({
          users: usersData,
          totalPages: Math.ceil(totalUsers / pageSize),
          currentPage: pageNumber,
        }) 
        return
      }
      
      const usersData = await prisma.users.findMany({
        where: {
          name: { contains: searchTerm as string }
        },
        skip,
        take: pageSize,
      });

      
  
      response.status(200).json({
        users: usersData,
        totalPages: Math.ceil(totalUsers / pageSize),
        currentPage: pageNumber,
      });
    } catch (error) {
      response.status(500).json({ message: 'Error fetching users', error });
    }
  };

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
  
     const hashedPassword = await bcrypt.hash(password,10);
     
      const users = await prisma.users.create({
        data:{
            name,
            email,
            password: hashedPassword,
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

  public updateUser = async (request: RequestWithUser, response: Response) => {
    const { id } = request.params; // Get the users ID from the URL
    const { oldPassword, password, name, email, role } = request.body; // Data to update
    console.log(request.body)
    console.log(request.params)
    try {
      const user = await prisma.users.findUnique({
        where: { id: Number(id) },
    });

    if (!user) {
      return response.status(404).json({ message: 'User not found' });
  }

  if (user.role !== 'Administrador' && oldPassword) {
    const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordCorrect) {
        return response.status(400).json({ message: 'Incorrect old password' });
    }
}

if (email && email !== user.email) {
  const emailExists = await prisma.users.findUnique({
      where: { email },
  });
  if (emailExists) {
      return response.status(400).json({ message: 'Email already exists' });
  }
}



      const updatedUser = await prisma.users.update({
        where: { id: Number(id) }, // Update based on ID
        data: {
          email,
          password: password ? await bcrypt.hash(password, 10) : user.password,
          name,
          role
        }
      });

      logControllers.logActions(request.user?.id, "Usuário editado.", { id_affected_user: Number(id) })

      response.status(200).json(updatedUser);
    } catch (error) {
      response.status(500).json({ message: 'Error updating users', error });
    }
  };

  // Delete a users by ID
  public deleteUser = async (request: RequestWithUser, response: Response) => {
    const { id } = request.params; // Get the users ID from the URL

    try {
      await prisma.users.delete({
        where: { id: Number(id) } // Delete based on ID
      });

      logControllers.logActions(request.user?.id, "Usuário editado.", { id_affected_user: Number(id) })

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

public getMe = async(request:Request,response:Response) =>{
  const token = request.cookies.jwt
  // console.log(token)
  const decoded = await promisify(jwt.verify)(token, JWT_SECRET);
  console.log(decoded)
  try{
    const user = await prisma.users.findUnique({
      where:{id:Number(decoded.id)}
    })
    if (!user) {
      return response.status(404).json({ message: 'User not found' });
    }
    console.log(user)
    response.status(200).json(user); 
  }catch(error){
    response.status(500).json({ message: 'Error fetching users by ID', error });
  }

}

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

  public login = async(request:Request,response: Response) =>{
    const {email,password} = request.body
    
    try{
      const user = await prisma.users.findUnique({
        where: {email: email},
      })
      
      if(!user){
        return response.status(404).json({message:'Usuário não encontrado'})
      }
      // console.log(user.password)
      // console.log(password)
      if (!await bcrypt.compare(password, user.password)) {
        return response.status(401).json({ message: 'Usuário ou Senha incorretos' });  
      }
    // console.log(user)
    //verification token
    const token = jwt.sign({id : user.id}, JWT_SECRET,{expiresIn:'1d'})
    const cookieOptions={
      expires : new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite :'None' as 'none',
      path: '/'
    }
    response.cookie('jwt',token, cookieOptions)
    // console.log(token)
    return response.status(201).json({
       message: 'Login successful',
       expiration: Date.now() + 1 * 24 * 60 * 60 * 1000,
       token,
        data:{
          user
        }}); // send a success response
    }catch(error){
      response.status(500).json({message:'Error Login users'})
    }
  };



  
}

const userControllers = new UserController();

export { userControllers };