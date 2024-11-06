import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProductIdsContextType {
    expiringIds: number[];
    lowStockIds: number[];
    setExpiringIds: (ids: number[]) => void;
    setLowStockIds: (ids: number[]) => void;
}

const ProductIdsContext = createContext<ProductIdsContextType | undefined>(undefined);

export const ProductIdsProvider = ({ children }: { children: ReactNode }) => {
    const [expiringIds, setExpiringIds] = useState<number[]>([]);
    const [lowStockIds, setLowStockIds] = useState<number[]>([]);

    return (
        <ProductIdsContext.Provider value={{ expiringIds, lowStockIds, setExpiringIds, setLowStockIds }}>
            {children}
        </ProductIdsContext.Provider>
    );
};

export const useProductIds = () => {
    const context = useContext(ProductIdsContext);
    if (!context) throw new Error('useProductIds must be used within a ProductIdsProvider');
    return context;
};