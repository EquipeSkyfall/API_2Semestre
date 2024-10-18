import { z } from 'zod';

export const fornecedorSchema = z.object({
  cnpj_fornecedor: z.string().min(14, 'CNPJ deve ter 14 Dígitos').max(14, 'CNPJ deve ter 14 digitos'),
  razao_social: z.string().min(1, 'É necessário informar a Razão Social').max(255),
  nome_fantasia: z.string().max(255).optional(),
  endereco_fornecedor: z.string().max(255).optional(),
  cidade: z.string().min(1, 'É necessário informar a Cidade').max(100),
  estado: z.string().length(2, 'Estado Deve ter pelo menos 2 Dígitos'),
  cep: z.string().min(9, 'CEP deve possuri 9 Dígitos').max(9),
});

export type FornecedorFormValues = z.infer<typeof fornecedorSchema>;
