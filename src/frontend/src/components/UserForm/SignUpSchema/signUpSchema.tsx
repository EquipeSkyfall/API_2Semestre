import { z } from 'zod';
const signUpSchema = z.object({
    name: z.string().min(3, { message: "O nome deve ter no mínimo 3 caracteres" }),
    email: z.string().email({ message: "Formato do Email Invalido" }),
    role: z.enum(['Administrador', 'Usuário', 'Gerente'], {
      errorMap: () => ({ message: "Cargo obrigatório" }),
    }),
    password: z.string().min(8, { message: "A senha deve ter no mínimo 8 caracteres" }),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas devem estar iguais",
    path: ["confirmPassword"],
  });
  
export default signUpSchema;