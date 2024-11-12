import React, { useState, useEffect } from 'react';
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
  preco_custo: Record<number, number>;
}

const AddProductToSupplierModal: React.FC<AddProductToSupplierModalProps> = ({
  supplierId,
  isOpen,
  onClose,
}) => {
  const { control, handleSubmit, register, reset, watch, setValue, setError } = useForm<ProductFormValues>();
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(7);
  const [precoCusto, setPrecoCusto] = useState<Record<number, string>>({});
  const { products, isLoading, totalPages } = useSearchProducts({
    search: watch('search') || '',
    id_fornecedor: supplierId,
    page: page,
    limit: limit,
  });
  const { mutate: addProductsToSupplier } = useAddProductsToSupplier();

  const handleCheckboxChange = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handlePrecoCustoChange = (productId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numericValue = value.replace(/\D/g, '');
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(parseFloat(numericValue) / 100);

    setPrecoCusto((prevState) => ({
      ...prevState,
      [productId]: formattedValue,
    }));

    const precoNumber = parseFloat(numericValue) / 100;

    if (isNaN(precoNumber) || precoNumber <= 0) {
      setError(`preco_custo.${productId}`, { type: 'manual', message: 'Preço de custo é obrigatório.' });
      return;
    }

    setValue(`preco_custo.${productId}`, precoNumber);
  };

  const onSubmit = (data: ProductFormValues) => {
    const productsToAdd = selectedProducts.map((id) => ({
      id_produto: id,
      preco_custo: data.preco_custo[id] || 0,
    }));

    addProductsToSupplier(
      { supplierId, products: productsToAdd },
      {
        onSuccess: () => {
          reset();
          setSelectedProducts([]);
          setPrecoCusto({});
          onClose();
        },
      }
    );
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  useEffect(() => {
    if (isOpen) {
      const inputElement = document.getElementById('product-search') as HTMLInputElement;
      if (inputElement) inputElement.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-product text-xs md:text-sm inset-0 flex justify-center items-center">
  <div className="modal-content-product w-full sm:max-w-screen-md h-5/6 sm:h-auto flex flex-col !overflow-x-hidden">
    <button className="close-button !-right-5 sm:!-right-0 !-top-2 sm:!-top-0" onClick={onClose}>
      <FontAwesomeIcon icon={faTimes} />
    </button>
    <h2 className="font-['Afacad_Flux'] text-cyan-600 text-center mb-2">Adicionar Produtos ao Fornecedor</h2>

    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full overflow-y-auto">
      <div className="w-11/12 mx-auto mb-1">
        <input
          id="product-search"
          type="text"
          placeholder="Procurando Produtos..."
          {...register('search')}
          className="text-center w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      {isLoading ? (
        <p className="text-center text-cyan-600">Procurando Produtos...</p>
      ) : (
        <ul className="space-y-2 flex-grow overflow-y-auto px-0 !mb-2">
          {products.map((product) => (
            <li className="flex items-center justify-between bg-gray-100 p-4 rounded-md shadow-md" key={product.id_produto}>
              <label className="flex items-center space-x-3 text-gray-800">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id_produto)}
                  onChange={() => handleCheckboxChange(product.id_produto)}
                  className="form-checkbox h-4 w-4 text-cyan-700"
                />
                <span className="text-sm sm:text-lg font-medium">
                  {product.nome_produto} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco_venda)}
                </span>
              </label>

              {selectedProducts.includes(product.id_produto) && (
                <div className="flex flex-col pl-2 sm:pl-0 sm:flex-row w-full sm:w-60 space-y-2 mt-2 sm:mt-0">
                  <label className="text-base sm:text-lg font-['Afacad_Flux'] text-cyan-700">
                    Preço de Custo:
                  </label>
                  <Controller
                    name={`preco_custo.${product.id_produto}`}
                    control={control}
                    defaultValue={0}
                    render={({ field }) => (
                      <input
                        {...field}
                        value={precoCusto[product.id_produto] || ''}
                        onChange={(e) => handlePrecoCustoChange(product.id_produto, e)}
                        type="text"
                        placeholder="Formato: R$ 0,00"
                        className="!text-xs sm:text-base p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    )}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="pagination flex justify-center items-center space-x-4 mt-4">
        <button
          onClick={(e) => {
            e.preventDefault();
            handlePrevPage();
          }}
          disabled={page === 1}
          className="px-3 py-2 bg-gray-300 hover:bg-gray-400 !rounded"
        >
          Anterior
        </button>
        <span>Página {page} de {totalPages}</span>
        <button
          onClick={(e) => {
            e.preventDefault();
            handleNextPage();
          }}
          disabled={page === totalPages}
          className="px-3 py-2 bg-gray-300 hover:bg-gray-400 !rounded"
        >
          Próximo
        </button>
      </div>

      <div className="flex space-x-1 mt-4">
        <button
          className="w-1/2 px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded-md"
          type="button"
          onClick={onClose}
        >
          Cancelar
        </button>
        <button
          className="w-1/2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
          type="submit"
        >
          Adicionar
        </button>
      </div>
    </form>
  </div>
</div>

  );
};

export default AddProductToSupplierModal;
