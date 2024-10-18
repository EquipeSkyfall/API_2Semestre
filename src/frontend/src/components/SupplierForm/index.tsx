import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import useCreateSupplier from '../../Hooks/Supplier/useCreateSuplier';
import { FornecedorFormValues, fornecedorSchema } from './supplierSchema';

const FornecedorForm: React.FC = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    reset 
  } = useForm<FornecedorFormValues>({
    resolver: zodResolver(fornecedorSchema),
  });

  const onSuccess = () => {
    setSuccessMessage('Fornecedor cadastrado com sucesso!');
    reset();
  };

  const mutation = useCreateSupplier(onSuccess, setServerError);

  const onSubmit = (data: FornecedorFormValues) => {
    setServerError(null);
    setSuccessMessage(null);
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="fornecedor-form">
      {successMessage && <p className="success-message">{successMessage}</p>}
      {serverError && <p className="error-message">{serverError}</p>}

      <h2>Cadastrar Fornecedor</h2>

      <div className="form-fields-grid">
        <div className="form-field required">
          <label htmlFor="cnpj_fornecedor">CNPJ</label>
          <input 
            {...register("cnpj_fornecedor")} 
            type="text" 
            id="cnpj_fornecedor" 
            placeholder="Digite o CNPJ"
          />
          {errors.cnpj_fornecedor && <p className="error-message">{errors.cnpj_fornecedor.message}</p>}
        </div>

        <div className="form-field required">
          <label htmlFor="razao_social">Razão Social</label>
          <input 
            {...register('razao_social')} 
            type="text" 
            id="razao_social" 
            placeholder="Digite a Razão Social"
          />
          {errors.razao_social && <p className="error-message">{errors.razao_social.message}</p>}
        </div>

        <div className="form-field optional">
          <label htmlFor="nome_fantasia">Nome Fantasia</label>
          <input 
            {...register('nome_fantasia')} 
            type="text" 
            id="nome_fantasia" 
            placeholder="Digite o Nome Fantasia"
          />
          {errors.nome_fantasia && <p className="error-message">{errors.nome_fantasia.message}</p>}
        </div>

        <div className="form-field optional">
          <label htmlFor="endereco_fornecedor">Endereço</label>
          <input 
            {...register('endereco_fornecedor')} 
            type="text" 
            id="endereco_fornecedor" 
            placeholder="Digite o Endereço"
          />
          {errors.endereco_fornecedor && <p className="error-message">{errors.endereco_fornecedor.message}</p>}
        </div>

        <div className="form-field required">
          <label htmlFor="cidade">Cidade</label>
          <input 
            {...register('cidade')} 
            type="text" 
            id="cidade" 
            placeholder="Digite a Cidade"
          />
          {errors.cidade && <p className="error-message">{errors.cidade.message}</p>}
        </div>

        <div className="form-field required">
          <label htmlFor="estado">Estado</label>
          <input 
            {...register('estado')} 
            type="text" 
            id="estado" 
            placeholder="Ex: SP"
          />
          {errors.estado && <p className="error-message">{errors.estado.message}</p>}
        </div>

        <div className="form-field required">
          <label htmlFor="cep">CEP</label>
          <input 
            {...register('cep')} 
            type="text" 
            id="cep" 
            placeholder="Digite o CEP"
          />
          {errors.cep && <p className="error-message">{errors.cep.message}</p>}
        </div>
      </div>

      <button 
        type="submit" 
        className="submit-button" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Carregando...' : 'Cadastrar'}
      </button>
    </form>
  );
};

export default FornecedorForm;
