// Components/Supplier/SupplierProductsModal.tsx
import React, { useState } from 'react';
import useGetSupplierProducts from '../../Hooks/Supplier/useGetSupplierProducts';
import useDeleteProductFromSupplier from '../../Hooks/Supplier/useDeleteProductFromSupplier';

interface SupplierProductsModalProps {
  supplierId: number;
  isOpen: boolean;
  nome_produto: string;
  onClose: () => void;
}


const SupplierProductsModal: React.FC<SupplierProductsModalProps> = ({
  supplierId,
  isOpen,
  onClose,
}) => {
  const { data: products = [], isLoading, isError } = useGetSupplierProducts(supplierId);
  const { mutate: deleteProduct } = useDeleteProductFromSupplier();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter((product) =>
    product.produto.nome_produto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id_produto: number) => {
    console.log(id_produto,supplierId)
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct({ supplierId, id_produto });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Products from Supplier</h2>

        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {isLoading ? (
          <p>Loading products...</p>
        ) : isError ? (
          <p>Error fetching products.</p>
        ) : filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <ul>
            {filteredProducts.map((product) => (
              <li key={product.id_produto}>
                <div>
                  <strong>{product.produto.nome_produto}</strong>
                  <p>ID: {product.id_produto}</p>
                  <p>Preço de custo: {product.preco_custo}</p>
                  <button onClick={() => handleDelete(product.id_produto)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SupplierProductsModal;