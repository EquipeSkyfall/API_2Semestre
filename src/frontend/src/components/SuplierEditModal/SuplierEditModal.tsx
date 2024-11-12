import React from 'react';
import { useForm } from 'react-hook-form';
import { FornecedorFormValues, fornecedorSchema } from '../SupplierForm/supplierSchema'; // Ajuste o caminho
import { zodResolver } from '@hookform/resolvers/zod';
import useUpdateSupplier from '../../Hooks/Supplier/useUpdateSupplier';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import './supliereditmodal.css';

interface EditSupplierModalProps {
  supplier: FornecedorFormValues | null;
  isOpen: boolean;
  onClose: () => void;
}

const EditSupplierModal: React.FC<EditSupplierModalProps> = ({
  supplier,
  isOpen,
  onClose,
}) => {
  const { register, setValue, handleSubmit, reset, formState: { errors } } = useForm<FornecedorFormValues>({
    resolver: zodResolver(fornecedorSchema),
    defaultValues: supplier || {},
  });

  const formatCNPJ = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, '');

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

  const { mutate: updateSupplier } = useUpdateSupplier();

  React.useEffect(() => {
    if (supplier) reset(supplier); // Reset form with supplier data
  }, [supplier, reset]);

  const onSubmit = (data: FornecedorFormValues) => {
    if (supplier) {
      updateSupplier({ ...data, id_fornecedor: supplier.id_fornecedor });
      onClose(); // Close modal after update
    }
  };

  if (!isOpen) return null;

  return (
    <div className="-supplier">
      <div className="modal-content-supplier max-w-lg w-full mx-auto p-6 bg-white rounded-lg shadow-lg sm:w-11/12">
        <button className="fechar-modal absolute !-top-5 sm:!-top-0 !-right-5 sm:!-right-0 text-gray-500 hover:text-gray-700" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2 className='mb-0 sm:mb-4 text-2xl font-bold text-center text-cyan-500 sm:text-xl'>Editar Fornecedor</h2>
        <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-0 sm:mb-4'>
            <label className='block text-gray-700 font-medium'>CNPJ</label>
            <input
              className={`w-full p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cnpj_fornecedor ? 'border-red-500' : 'border-gray-300'}`}
              {...register('cnpj_fornecedor')}
              type="text"
              id="cnpj_fornecedor"
              maxLength={18}
              placeholder={errors.cnpj_fornecedor ? errors.cnpj_fornecedor.message : "Digite o CNPJ"}
              onChange={handleCNPJChange}
            />
          </div>

          <div className='mb-1 sm:mb-4'>
            <label className='block text-gray-700 font-medium'>Nome Fantasia</label>
            <input
              className={`w-full p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nome_fantasia ? 'border-red-500' : 'border-gray-300'}`}
              {...register('nome_fantasia')}
              placeholder={errors.nome_fantasia ? errors.nome_fantasia.message : "Digite o Nome Fantasia"}
            />
          </div>

          <div className='mb-0 sm:mb-4'>
            <label className='block text-gray-700 font-medium'>Razão Social</label>
            <input
              className={`w-full p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.razao_social ? 'border-red-500' : 'border-gray-300'}`}
              {...register('razao_social')}
              placeholder={errors.razao_social ? errors.razao_social.message : "Digite a Razão Social"}
            />
          </div>

          <div className='mb-0 sm:mb-4'>
            <label className='block text-gray-700 font-medium'>Endereço</label>
            <input
              className={`w-full p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.endereco_fornecedor ? 'border-red-500' : 'border-gray-300'}`}
              {...register('endereco_fornecedor')}
              placeholder={errors.endereco_fornecedor ? errors.endereco_fornecedor.message : "Digite o Endereço"}
            />
          </div>

          <div className='mb-0 sm:mb-4'>
            <label className='block text-gray-700 font-medium'>Cidade</label>
            <input
              className={`w-full p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cidade ? 'border-red-500' : 'border-gray-300'}`}
              {...register('cidade')}
              placeholder={errors.cidade ? errors.cidade.message : "Digite a Cidade"}
            />
          </div>

          <div className='mb-0 sm:mb-4'>
            <label className='block text-gray-700 font-medium'>Estado</label>
            <input
              className={`w-full p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.estado ? 'border-red-500' : 'border-gray-300'}`}
              {...register('estado')}
              placeholder={errors.estado ? errors.estado.message : "Digite o Estado"}
            />
          </div>

          <div className='mb-4 sm:mb-4'>
            <label className='block text-gray-700 font-medium'>CEP</label>
            <input
              className={`w-full p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cep ? 'border-red-500' : 'border-gray-300'}`}
              {...register('cep')}
              type="text"
              id="cep"
              placeholder={errors.cep ? errors.cep.message : "Digite o CEP"}
              maxLength={9}
              onChange={handleCEPChange}
            />
          </div>

          <div className="flex justify-between gap-4 mt-1">
            <button
              className='px-4 py-2 bg-green-400 hover:bg-green-500 text-white rounded-md cursor-pointer w-full'
              type="submit">
              Salvar
            </button>
            <button
              className='px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded-md cursor-pointer w-full'
              type="button"
              onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSupplierModal;
