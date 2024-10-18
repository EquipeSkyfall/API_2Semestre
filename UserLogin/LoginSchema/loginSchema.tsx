import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email({ message: "O Email informado é inválido" }),
  password: z.string().min(8, { message: "A senha informada é invalida" }),
});

export default loginSchema;