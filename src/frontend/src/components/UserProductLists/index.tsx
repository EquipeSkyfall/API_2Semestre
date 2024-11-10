import React from "react";
import LowStockList from "./LowStock";
import ExpiringList from "./Expiration";

export interface FilterValues {
    search: string;
    id_setor: number | null;
    id_categoria: number | null;
}

const UserProductsList: React.FC = () => {
    return (
        <div className="md:flex lg:space-x-4">
            <div className="flex-1">
                <LowStockList />
            </div>
            <div className="flex-1">
                <ExpiringList />
            </div>
        </div>
    );
};

export default UserProductsList;
