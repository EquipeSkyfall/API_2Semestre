import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import useAddProductsToSupplier from '../../Hooks/Supplier/useAddProductsToSupplier';
import useSearchProducts from '../../Hooks/Products/getSearchProductbyNameHook';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface AddProductToSupplierModalProps {
  supplierId: number;
  isOpen: boolean;
  onClose: () => void;
}

interface ProductFormValues {
  preco_custo: Record<number, number>; // Store price per product ID
}

const AddProductToSupplierModal: React.FC<AddProductToSupplierModalProps> = ({
  supplierId,
  isOpen,
  onClose,
}) => {
  const { control, handleSubmit, register, reset,watch } = useForm<ProductFormValues>();
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Set your desired limit for products per page

  const { products, isLoading } = useSearchProducts({search: watch('search') || '', id_fornecedor: supplierId, page: page, limit: limit});
  const { mutate: addProductsToSupplier } = useAddProductsToSupplier();

  const handleCheckboxChange = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const onSubmit = (data: ProductFormValues) => {
    const productsToAdd = selectedProducts.map((id) => ({
      id_produto: id,
      preco_custo: data.preco_custo[id] || 0, // Default to 0 if no value is provided
    }));

    console.log('Products to add:', productsToAdd);

    addProductsToSupplier(
      { supplierId, products: productsToAdd },
      {
        onSuccess: () => {
          // Reset the form and selected products on success
          reset();
          setSelectedProducts([]);
          onClose(); // Optionally close the modal
        },
      }
    );
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
      <button className="close-button" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>  
        <h2>Adicionar Produtos ao Fornecedor</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="Procurando Produtos..."
            {...register('search')}
            className='text-center mt-2 mb-2'
          />

          {isLoading ? (
            <p>Procurando Produtos...</p>
          ) : (
            <ul className="space-y-4">
              {products.map((product) => (
                <li className="flex items-center justify-between bg-gray-100 p-4 rounded-md shadow-md" 
                key={product.id_produto}>
                  <label className="flex items-center space-x-3 text-gray-800">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id_produto)}
                      onChange={() => handleCheckboxChange(product.id_produto)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="text-lg font-medium">
                    {product.nome_produto} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco_venda)}
                    </span>
                  </label>

                  {selectedProducts.includes(product.id_produto) && (
                    <div className="mt-4 md:mt-0 space-y-2">
                      <h3 className='text-sm font-medium text-gray-700'>preço de custo</h3>
                    <Controller
                      name={`preco_custo.${product.id_produto}`}
                      control={control}
                      defaultValue={0}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          step="0.01"
                          placeholder="Enter cost price"
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 
                          focus:ring-blue-500 focus:border-transparent"
                        />
                      )}
                    />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          <div className="pagination-controls mt-5">
            <button className='px-2 py-1 bg-cyan-400 hover:bg-sky-400 text-white border-none 
            rounded-md cursor-pointer text-base justify ml-2' type="button" onClick={handlePreviousPage} disabled={page === 1}>
              Anterior
            </button>
            <button className='px-2 py-1 bg-cyan-400 hover:bg-sky-400 text-white border-none 
            rounded-md cursor-pointer text-base justify ml-2' type="button" onClick={handleNextPage}>
              Próximo
            </button>
          </div>

          <button className='px-3 py-2 bg-green-400 hover:bg-green-700 text-white border-none rounded-md cursor-pointer text-base justify mt-5' type="submit">
            Adicionar
          </button>
          <button className='px-3 py-2 bg-red-400 hover:bg-red-700 text-white border-none rounded-md cursor-pointer text-base justify mt-2 ml-5'
          type="button" onClick={onClose}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductToSupplierModal;
