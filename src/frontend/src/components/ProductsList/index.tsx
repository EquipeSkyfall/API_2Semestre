import React from 'react';
import FetchAllProducts from '../../Hooks/Products/fetchAllProductsHook'; // Import the custom hook

const ProductsList: React.FC = () => {
  const { data: products, isLoading, isError, error } = FetchAllProducts();

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (isError) {
    return <div>Error loading products: {error?.message}</div>;
  }

  return (
    <div>
      <h2>Product List</h2>
      {products && products.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <h3>{product.product_name}</h3>
              <p>Brand: {product.brand}</p>
              <p>Price: ${product.price.toFixed(2)}</p>
              <p>Retail Price: ${product.retail_price.toFixed(2)}</p>
              <p>Quantity: {product.quantity}</p>
              
              {/* Optional fields */}
              {product.description && <p>Description: {product.description}</p>}
              {product.stock_location && <p>Stock Location: {product.stock_location}</p>}
              {product.id_category && <p>Category ID: {product.id_category}</p>}
              {product.id_sector && <p>Sector ID: {product.id_sector}</p>}
              {product.url_image && (
                <div>
                  <p>Image:</p>
                  <img src={product.url_image} alt={product.product_name} style={{ width: '100px', height: '100px' }} />
                </div>
              )}
              {product.weight && <p>Weight: {product.weight} kg</p>}
              {product.height && <p>Height: {product.height} cm</p>}
              {product.width && <p>Width: {product.width} cm</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
};

export default ProductsList;
