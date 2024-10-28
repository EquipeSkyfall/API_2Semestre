import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../secrets";
import prisma from "../dbConnector";
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// Define a type for the expected user object
interface User {
    id: number;
    role: string;
}

// Extend the Request interface to include the user property
interface RequestWithUser extends Request {
    user?: User; // Optional user property
}

const catchAsync = (fn: any) => {
    return (req: RequestWithUser, res: Response, next: NextFunction) => {
        fn(req, res, next).catch((err: any) => next(err));
    };
};

export const auth = catchAsync(async (request: RequestWithUser, response: Response, next: NextFunction) => {
    let token: string | undefined; // Explicitly typing token as undefined if not found

    // Access the authorization header correctly
    console.log(request.headers)
    // console.log('lal')
    
    if(
        request.headers.authorization && request.headers.authorization.startsWith('Bearer')
    ){
        token =request.headers.authorization.split(' ')[1];
    }
    else if (request.headers.cookie) {
        const cookieToken = request.headers.cookie.split('; ').find(row => row.startsWith('jwt='));
        token = cookieToken ? cookieToken.split('=')[1] : undefined; // Extract the token value
    }
    if (!token) {
        return response.status(401).json({ message: 'Token not provided' }); // Handle case where token is missing
    }
    // console.log(token)
    console.log(request.cookies)
    try{

        const decoded = await promisify(jwt.verify)(token, JWT_SECRET);
        console.log('Decoded'+decoded.id)
        const currUser: User | null = await prisma.users.findUnique({
            where: { id: Number(decoded.id) },
            select: { id: true, role: true } // Fetch the necessary fields
    
        });

         // Check if currUser is null and handle it
    if (!currUser) {
        return response.status(401).json({ message: 'User not found' });
    }
    request.user = currUser;
    
    next(); // Proceed to the next middleware
    }catch(error){
        return response.status(401).json({ message: 'Token is expired or invalid' });
    }
    
});

export const restrictedTo = (...roles: string[]) => {
    return (request: RequestWithUser, response: Response, next: NextFunction) => {
        const user = request.user; // Access the user property
        if (!user || !roles.includes(user.role)) {
            return response.status(403).json({ message: 'You do not have permission to perform this action.' });
        }    
        next();
    };
};
