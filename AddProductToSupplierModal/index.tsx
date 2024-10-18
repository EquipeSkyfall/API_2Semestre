import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import useAddProductsToSupplier from '../../Hooks/Supplier/useAddProductsToSupplier';
import useSearchProducts from '../../Hooks/Products/getSearchProductbyNameHook';

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

  const { products, isLoading } = useSearchProducts(page, limit, watch('search') || '');
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
        <h2>Add Products to Supplier</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="Search for products..."
            {...register('search')}
          />

          {isLoading ? (
            <p>Loading products...</p>
          ) : (
            <ul>
              {products.map((product) => (
                <li key={product.id_produto}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id_produto)}
                      onChange={() => handleCheckboxChange(product.id_produto)}
                    />
                    {product.nome_produto} - ${product.preco_venda}
                  </label>

                  {selectedProducts.includes(product.id_produto) && (
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
                        />
                      )}
                    />
                  )}
                </li>
              ))}
            </ul>
          )}

          <div className="pagination-controls">
            <button type="button" onClick={handlePreviousPage} disabled={page === 1}>
              Previous
            </button>
            <button type="button" onClick={handleNextPage}>
              Next
            </button>
          </div>

          <button type="submit">Add Products</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductToSupplierModal;
