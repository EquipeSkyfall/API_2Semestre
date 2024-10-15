import { z } from 'zod';
const signUpSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
    email: z.string().email({ message: "Invalid email format" }),
    role: z.enum(['admin', 'user', 'manager'], {
      errorMap: () => ({ message: "Role is required" }),
    }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });
  
export default signUpSchema;