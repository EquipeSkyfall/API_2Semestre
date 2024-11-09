import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import useAddProductsToSupplier from '../../Hooks/Supplier/useAddProductsToSupplier';
import useSearchProducts from '../../Hooks/Products/getSearchProductbyNameHook';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import './addproducttosuppliermodal.css'

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
  const { control, handleSubmit, register, reset, watch, setValue, setError } = useForm<ProductFormValues>();
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(7); // Set your desired limit for products per page
  const [precoCusto, setPrecoCusto] = useState<Record<number, string>>({});
  const { products, isLoading, totalPages } = useSearchProducts({ search: watch('search') || '', id_fornecedor: supplierId, page: page, limit: limit });
  const { mutate: addProductsToSupplier } = useAddProductsToSupplier();
  const currentPageState = page

  const handleCheckboxChange = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handlePrecoCustoChange = (productId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Replace invalid characters and prepare for formatting
    const numericValue = value.replace(/\D/g, '');

    // Format as BRL currency
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(parseFloat(numericValue) / 100);

    // Set the formatted currency string to state for this product ID
    setPrecoCusto((prevState) => ({
      ...prevState,
      [productId]: formattedValue,
    }));

    // Calculate precoNumber from the numericValue directly
    const precoNumber = parseFloat(numericValue) / 100; // Convert to number

    // Check if precoNumber is valid and set the Zod error if not
    if (isNaN(precoNumber) || precoNumber <= 0) {
      setError(`preco_custo.${productId}`, { type: 'manual', message: 'Preço de custo é obrigatório.' });
      return;
    }

    // Use setValue to set the parsed value in react-hook-form
    setValue(`preco_custo.${productId}`, precoNumber);
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
          setPrecoCusto({});
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
    <div className="modal-overlay-product">
      <div className="modal-content-product">
        <button className="close-button" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2 className='font-["Afacad_Flux"] text-cyan-600'>Adicionar Produtos ao Fornecedor</h2>

        <form onSubmit={handleSubmit(onSubmit)} className='overflow-hidden'>
          <div className='translate-x-7 w-11/12'>
            <input
              type="text"
              placeholder="Procurando Produtos..."
              {...register('search')}
              className='text-center'
            />
          </div>

          {isLoading ? (
            <p className='border-cyan-600'>Procurando Produtos...</p>
          ) : (
            <ul className="space-y-2">
              {products.map((product) => (
                <li className="flex items-center justify-between bg-gray-100 p-4 rounded-md shadow-md"
                  key={product.id_produto}>
                  <label className="flex items-center space-x-3 text-gray-800">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id_produto)}
                      onChange={() => handleCheckboxChange(product.id_produto)}
                      className="form-checkbox h-4 w-4 text-cyan-700"
                    />
                    <span className="text-lg font-medium">
                      {product.nome_produto} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco_venda)}
                    </span>
                  </label>

                  {selectedProducts.includes(product.id_produto) && (
                    <div className="flex w-60 h-12 space-y-2 -mt-4 -mb-2">
                      <h3 className='text-lg font-["Afacad_Flux"] mt-3 w-60 text-cyan-700 -ml-10'>Preço de Custo:</h3>
                      <Controller
                        name={`preco_custo.${product.id_produto}`}
                        control={control}
                        defaultValue={0}
                        render={({ field }) => (
                          <input
                            {...field}
                            value={precoCusto[product.id_produto] || ''} // Use formatted value
                            onChange={(e) => handlePrecoCustoChange(product.id_produto, e)} // Call handler per product
                            type="text"
                            placeholder="Formato: R$ 0,00"
                          />
                        )}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

<div className="mt-5 flex flex-col justify-center items-center">
  {/* Linha superior com os botões "Anterior" e "Próximo" */}
  <div className="flex items-center justify-center space-x-4 mb-4">
    <button
      className="px-6 py-2 bg-gray-400 hover:bg-gray-500 transition duration-300 ease-in-out text-white border-none rounded-md cursor-pointer text-base"
      type="button"
      onClick={handlePreviousPage}
      disabled={page === 1}
    >
      Anterior
    </button>

    <span className="text-base">
      Página {currentPageState} de {totalPages}
    </span>

    <button
      className="px-6 py-2 bg-cyan-400 hover:bg-cyan-600 transition duration-300 ease-in-out text-white border-none rounded-md cursor-pointer text-base"
      type="button"
      onClick={handleNextPage}
    >
      Próximo
    </button>
  </div>

  {/* Linha inferior com os botões "Cancelar" e "Adicionar" */}
  <div className="flex items-center justify-center space-x-4">
    <button
      className="px-16 py-3 bg-red-400 hover:bg-red-700 transition duration-300 ease-in-out text-white border-none rounded-md cursor-pointer text-lg"
      type="button"
      onClick={onClose}
    >
      Cancelar
    </button>

    <button
      className="px-16 py-3 bg-green-500 text-white hover:bg-green-700 transition duration-300 ease-in-out border-none rounded-md cursor-pointer text-lg"
      type="submit"
    >
      Adicionar
    </button>
  </div>
</div>

        </form>
      </div>
    </div>
  );
};

export default AddProductToSupplierModal;
