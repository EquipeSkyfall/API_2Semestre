import React, { useState } from "react";
import LowStockList from "./LowStock";
import ExpiringList from "./Expiration";

export interface FilterValues {
    search: string;
    id_setor: number | null;
    id_categoria: number | null;
}

const UserProductsList: React.FC = () => {
    return (
        <>
            <LowStockList />
            <ExpiringList />
        </>
    );
};

export default UserProductsList;