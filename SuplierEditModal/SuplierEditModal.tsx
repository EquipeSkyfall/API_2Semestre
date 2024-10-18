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
        <h2>Edit Supplier</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            CNPJ
            <input {...register('cnpj_fornecedor')}  />
          </label>
		{errors.cnpj_fornecedor && <p>{errors.cnpj_fornecedor.message}</p>}
          <label>
            Nome Fantasia
            <input {...register('nome_fantasia')}  />
          </label>
          {errors.nome_fantasia && <p>{errors.nome_fantasia.message}</p>}
          <label>
            Razão Social
            <input {...register('razao_social')} />
          </label>
          {errors.razao_social && <p>{errors.razao_social.message}</p>}
          <label>
            Cidade
            <input {...register('cidade')} />
          </label>
          {errors.cidade && <p>{errors.cidade.message}</p>}
          <label>
            Estado
            <input {...register('estado')} />
          </label>
          {errors.estado && <p>{errors.estado.message}</p>}
          <label>
            CEP
            <input {...register('cep')} />
          </label>
          {errors.cep && <p>{errors.cep.message}</p>}
          <button type="submit">
            Salvar
          </button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditSupplierModal;
