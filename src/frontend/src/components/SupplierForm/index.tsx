import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import useCreateSupplier from '../../Hooks/Supplier/useCreateSuplier';
import { FornecedorFormValues, fornecedorSchema } from './supplierSchema';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FornecedorForm: React.FC = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FornecedorFormValues>({
    resolver: zodResolver(fornecedorSchema),
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (successMessage) {
      timer = setTimeout(() => setSuccessMessage(null), 3000);
    }
    if (serverError) {
      timer = setTimeout(() => setServerError(null), 3000);
    }
    return () => clearTimeout(timer);
  }, [successMessage, serverError]);

  const formatCNPJ = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, '');
    if (onlyNumbers.length <= 14) {
      const formattedCNPJ = onlyNumbers
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
      return formattedCNPJ;
    }
    return onlyNumbers;
  };

  const formatCEP = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, '');
    if (onlyNumbers.length <= 8) {
      const formattedCEP = onlyNumbers.replace(/^(\d{5})(\d)/, '$1-$2');
      return formattedCEP;
    }
    return onlyNumbers;
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCNPJ = formatCNPJ(e.target.value);
    if (formattedCNPJ.length <= 18) {
      setValue('cnpj_fornecedor', formattedCNPJ);
    }
  };

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCEP = formatCEP(e.target.value);
    if (formattedCEP.length <= 9) {
      setValue('cep', formattedCEP);
    }
  };

  const onSuccess = () => {
    setSuccessMessage('Fornecedor cadastrado com sucesso!');
    reset();
  };

  const mutation = useCreateSupplier(onSuccess, setServerError);

  const onSubmit = (data: FornecedorFormValues) => {
    setServerError(null);
    setSuccessMessage(null);
    mutation.mutate(data, {
      onError: (error: { message: string; }) => {
        if (error.message.includes("fornecedor já cadastrado")) {
          setServerError("Esse fornecedor já está cadastrado.");
        } else {
          setServerError("Esse fornecedor já foi cadastrado.");
        }
      },
    });
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  };


  return (
    <div>
      {/* Apenas o botão que abre o modal será mantido */}
      <button
        onClick={openModal}
        className="bg-cyan-400 text-white p-2 rounded-md transition-colors"
      >
        Cadastro de Fornecedor
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white p-6 rounded-lg w-full max-w-sm sm:max-w-md md:max-w-2xl h-auto max-h-[80vh] flex flex-col relative overflow-y-auto md:overflow-visible">
            <button
              onClick={closeModal}
              className="close-button absolute top-2 right-2 md:top-4 md:right-4 bg-transparent text-gray-700 hover:text-red-500 focus:outline-none z-10 transition-none"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 flex-1">
              {successMessage && <p className="text-green-500 text-center" aria-live="assertive">{successMessage}</p>}
              {serverError && <p className="text-red-500 text-center" aria-live="assertive">{serverError}</p>}

              <h2 className='text-center text-lg font-semibold'>Cadastrar Fornecedores</h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="required">
                <label htmlFor="cnpj_fornecedor" className="block text-sm" style={{ color: '#374151' }}>CNPJ</label>
                  <input
                    {...register("cnpj_fornecedor")}
                    type="text"
                    id="cnpj_fornecedor"
                    placeholder={errors.cnpj_fornecedor ? errors.cnpj_fornecedor.message : "Digite o CNPJ"}
                    maxLength={18}
                    className={`p-2 rounded-md border w-full ${errors.cnpj_fornecedor ? 'border-red-500' : 'border-gray-300'}`}
                    onChange={handleCNPJChange}
                  />
                </div>

                <div className="required">
                  <label htmlFor="razao_social" className="block text-sm" style={{ color: '#374151' }}>Razão Social</label>
                  <input
                    {...register('razao_social')}
                    type="text"
                    id="razao_social"
                    placeholder={errors.razao_social ? errors.razao_social.message : "Digite a Razão Social"}
                    className={`p-2 rounded-md border w-full ${errors.razao_social ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="optional">
                  <label htmlFor="nome_fantasia" className="block text-sm" style={{ color: '#374151' }}>Nome Fantasia</label>
                  <input
                    {...register('nome_fantasia')}
                    type="text"
                    id="nome_fantasia"
                    placeholder={errors.nome_fantasia ? errors.nome_fantasia.message : "Digite o Nome Fantasia"}
                    className={`p-2 rounded-md border w-full ${errors.nome_fantasia ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>

                <div className="required">
                  <label htmlFor="endereco_fornecedor" className="block text-sm" style={{ color: '#374151' }}>Endereço</label>
                  <input
                    {...register('endereco_fornecedor')}
                    type="text"
                    id="endereco_fornecedor"
                    placeholder={errors.endereco_fornecedor ? errors.endereco_fornecedor.message : "Digite o Endereço"}
                    className={`p-2 rounded-md border w-full ${errors.endereco_fornecedor ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="required">
                    <label htmlFor="cidade" className="block text-sm" style={{ color: '#374151' }}>Cidade</label>
                    <input
                      {...register('cidade')}
                      type="text"
                      id="cidade"
                      placeholder={errors.cidade ? errors.cidade.message : "Digite a Cidade"}
                      className={`p-2 rounded-md border w-full ${errors.cidade ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  </div>

                  <div className="required">
                    <label htmlFor="estado" className="block text-sm" style={{ color: '#374151' }}>Estado</label>
                    <input
                      {...register('estado')}
                      type="text"
                      id="estado"
                      placeholder={errors.estado ? errors.estado.message : "Ex: SP"}
                      maxLength={2}
                      className={`p-2 rounded-md border w-full ${errors.estado ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  </div>
                </div>

                <div className="required">
                  <label htmlFor="cep" className="block text-sm" style={{ color: '#374151' }}>CEP</label>
                  <input
                    {...register('cep')}
                    type="text"
                    id="cep"
                    placeholder={errors.cep ? errors.cep.message : "Digite o CEP"}
                    maxLength={9}
                    className={`p-2 rounded-md border w-full ${errors.cep ? 'border-red-500' : 'border-gray-300'}`}
                    onChange={handleCEPChange}
                  />
                </div>
              </div>

              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className={`bg-cyan-400 text-white p-2 rounded-md transition-colors ${isSubmitting && 'opacity-50 cursor-not-allowed'}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FornecedorForm;
