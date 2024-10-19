import React from 'react';
import { useForm } from 'react-hook-form';
import { FornecedorFormValues, fornecedorSchema } from '../SupplierForm/supplierSchema'; // Adjust the path
import { zodResolver } from '@hookform/resolvers/zod';
import useUpdateSupplier from '../../Hooks/Supplier/useUpdateSupplier';

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
  const { register, handleSubmit, reset,formState:{errors} } = useForm<FornecedorFormValues>({
    resolver: zodResolver(fornecedorSchema),
    defaultValues: supplier || {},
  });

  const { mutate: updateSupplier} = useUpdateSupplier();

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
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className='mb-5'>Editar Fornecedor</h2>
        <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-4'>
            <label className='block text-gray-700 font-medium mb-2'>CNPJ</label>
            <input className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' {...register('cnpj_fornecedor')}  />
            {errors.cnpj_fornecedor && <p className='text-red-500 text-sm mt-1'>{errors.cnpj_fornecedor.message}</p>}
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700 font-medium mb-2'>Nome Fantasia</label>
            <input className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' {...register('nome_fantasia')}  />
            {errors.nome_fantasia && <p className='text-red-500 text-sm mt-1'>{errors.nome_fantasia.message}</p>}
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700 font-medium mb-2'>Razão Social</label>
            <input className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' {...register('razao_social')} />
            {errors.razao_social && <p className='text-red-500 text-sm mt-1'>{errors.razao_social.message}</p>}
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700 font-medium mb-2'>Cidade</label>
            <input className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' {...register('cidade')} />
            {errors.cidade && <p className='text-red-500 text-sm mt-1'>{errors.cidade.message}</p>}
          </div>
          <div className='mb-4'>
          <label className='block text-gray-700 font-medium mb-2'>Estado</label>
          <input className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' {...register('estado')} />
          {errors.estado && <p className='text-red-500 text-sm mt-1'>{errors.estado.message}</p>}
          </div>
          <div className='mb-4'>
          <label className='block text-gray-700 font-medium mb-2'>CEP</label>
          <input className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' {...register('cep')} />
          {errors.cep && <p className='text-red-500 text-sm mt-1'>{errors.cep.message}</p>}
          </div>
          
          <button className='px-3 py-2 bg-green-400 hover:bg-green-700 text-white 
          border-none rounded-md cursor-pointer text-base justify mt-5' type="submit">
            Salvar
          </button>
          <button className='px-3 py-2 bg-red-400 hover:bg-red-700 text-white border-none rounded-md 
          cursor-pointer text-base justify mt-2' type="button" onClick={onClose}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditSupplierModal;
