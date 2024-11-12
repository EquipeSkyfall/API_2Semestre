// ProductsPage.tsx
import React, { useEffect } from 'react';
import ProductsContainer from '../components/ProductContainer';

function ProductsPage() {
    return (
        <div className='!overflow-x-hidden !overflow-y-hidden'>
            <ProductsContainer />
        </div>
    );
}

export default ProductsPage;
