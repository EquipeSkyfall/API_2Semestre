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
    setValue, 
    formState: { errors, isSubmitting }, 
    reset 
  } = useForm<FornecedorFormValues>({
    resolver: zodResolver(fornecedorSchema),
  });

  const formatCNPJ = (value: string) => {
    // Remove all non-numeric characters
    const onlyNumbers = value.replace(/\D/g, '');
    
    // Format the CNPJ as XX.XXX.XXX/0001-XX
    if (onlyNumbers.length <= 14) {
      const formattedCNPJ = onlyNumbers
        .replace(/^(\d{2})(\d)/, '$1.$2') // XX. 
        .replace(/(\d{3})(\d)/, '$1.$2') // XXX.
        .replace(/(\d{3})(\d)/, '$1/$2') // XXX/
        .replace(/(\d{4})(\d)/, '$1-$2'); // 0001-XX

      return formattedCNPJ;
    }

    return onlyNumbers; // Return unformatted if too long
  };

  const formatCEP = (value: string) => {
    // Remove all non-numeric characters
    const onlyNumbers = value.replace(/\D/g, '');

    // Format the CEP as XXXXX-XXX
    if (onlyNumbers.length <= 8) {
      const formattedCEP = onlyNumbers
        .replace(/^(\d{5})(\d)/, '$1-$2'); // XXXXX-XXX

      return formattedCEP;
    }

    return onlyNumbers; // Return unformatted if too long
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCNPJ = formatCNPJ(e.target.value);
    setValue('cnpj_fornecedor', formattedCNPJ); // Update the form state
  };

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCEP = formatCEP(e.target.value);
    setValue('cep', formattedCEP); // Update the form state
  };

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
    <form onSubmit={handleSubmit(onSubmit)} className="flex-1 p-5 bg-gray-100 rounded-lg shadow-md max-h-[80vh] overflow-y-auto box-border ml-10 mr-10">
      {successMessage && <p className="success-message">{successMessage}</p>}
      {serverError && <p className="error-message">{serverError}</p>}

      <h2 className='text-center mb-2 '>Cadastrar Fornecedores</h2>

      <div className="grid grid-cols-3 gap-3">
      <div className="required">
          <label htmlFor="cnpj_fornecedor">CNPJ</label>
          <input 
            {...register("cnpj_fornecedor")} 
            type="text" 
            id="cnpj_fornecedor" 
            placeholder="Digite o CNPJ"
            maxLength={18}
            className='p-2 rounded-md border border-gray-300 text-base box-border h-10 w-full overflow-hidden break-words resize-none'
            onChange={handleCNPJChange} // Add the change handler
          />
          {errors.cnpj_fornecedor && <p className="error-message">{errors.cnpj_fornecedor.message}</p>}
        </div>

        <div className="required">
          <label htmlFor="razao_social">Razão Social</label>
          <input 
            {...register('razao_social')} 
            type="text" 
            id="razao_social" 
            placeholder="Digite a Razão Social"
            className='p-2 rounded-md border border-gray-300 text-base box-border h-10 w-full overflow-hidden break-words resize-none'
          />
          {errors.razao_social && <p className="error-message">{errors.razao_social.message}</p>}
        </div>

        <div className="optional">
          <label htmlFor="nome_fantasia">Nome Fantasia</label>
          <input 
            {...register('nome_fantasia')} 
            type="text" 
            id="nome_fantasia" 
            placeholder="Digite o Nome Fantasia"
            className='p-2 rounded-md border border-gray-300 text-base box-border h-10 w-full overflow-hidden break-words resize-none'
          />
          {errors.nome_fantasia && <p className="error-message">{errors.nome_fantasia.message}</p>}
        </div>

        <div className='required'>
          <label htmlFor="endereco_fornecedor">Endereço</label>
          <input 
            {...register('endereco_fornecedor')} 
            type="text" 
            id="endereco_fornecedor" 
            placeholder="Digite o Endereço"
            className='p-2 rounded-md border border-gray-300 text-base box-border h-10 w-full overflow-hidden break-words resize-none'
          />
          {errors.endereco_fornecedor && <p className="error-message">{errors.endereco_fornecedor.message}</p>}
        </div>

        <div className='required'>
          <label htmlFor="cidade">Cidade</label>
          <input 
            {...register('cidade')} 
            type="text" 
            id="cidade" 
            placeholder="Digite a Cidade"
            className='p-2 rounded-md border border-gray-300 text-base box-border h-10 w-full overflow-hidden break-words resize-none'
          />
          {errors.cidade && <p className="error-message">{errors.cidade.message}</p>}
        </div>

        <div className='required'>
          <label htmlFor="estado">Estado</label>
          <input 
            {...register('estado')} 
            type="text" 
            id="estado" 
            placeholder="Ex: SP"
            maxLength={2}
            className='p-2 rounded-md border border-gray-300 text-base box-border h-10 w-full overflow-hidden break-words resize-none'
          />
          {errors.estado && <p className="error-message">{errors.estado.message}</p>}
        </div>

        <div className='required'>
          <label htmlFor="cep">CEP</label>
          <input 
            {...register('cep')} 
            type="text" 
            id="cep" 
            placeholder="Digite o CEP"
            maxLength={9} // Maximum length of the formatted CEP
            className='p-2 rounded-md border border-gray-300 text-base box-border h-10 w-full overflow-hidden break-words resize-none'
            onChange={handleCEPChange} // Add the change handler
          />
          {errors.cep && <p className="error-message">{errors.cep.message}</p>}
        </div>
      </div>
      
      <div className='flex justify-center'>
        <button 
          type="submit" 
          className="px-5 py-3 bg-cyan-400 hover:bg-sky-400 text-white border-none rounded-md cursor-pointer text-base justify " 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Carregando...' : 'Cadastrar'}
        </button>
      </div>
    </form>
  );
};

export default FornecedorForm;
