import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useFetchAlertProducts from '../../Hooks/Products/getProductAlert';
import { useProductIds } from '../../contexts/ProductsIdsContext';

function AutoNotifier() {
    const { data } = useFetchAlertProducts();
    const { setExpiringIds, setLowStockIds } = useProductIds();
    const [activeToast, setActiveToast] = useState(null);

    const notify = (message, toastId) => {
        if (activeToast !== toastId) {
            const toastRef = toast(message, {
                toastId,
                position: "bottom-left",
                autoClose: false,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: 0,
                theme: "light",
                className: 'red-toast',
            });
            setActiveToast(toastId);
        } else {
            toast.update(toastId, {
                render: message,
                position: "bottom-left",
                autoClose: false,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: 0,
                theme: "light",
                className: 'red-toast',
            });
        }
    };

    useEffect(() => {
        if (data?.expiring.length > 0) {
            setExpiringIds(data?.expiring.map(product => product.id));
            notify(`${data?.expiring.length} produto(s) próximo da validade!`, 'expiration');
        } else {
            toast.dismiss('expiration');
            setExpiringIds([]);
        }
    }, [data?.expiring]);

    useEffect(() => {
        if (data?.lowStock.length > 0) {
            setLowStockIds(data?.lowStock.map(product => product.id));
            notify(`${data?.lowStock.length} produto(s) com estoque baixo!`, 'low-stock');
        } else {
            toast.dismiss('low-stock'); 
            setLowStockIds([]);
        }
    }, [data?.lowStock]);

    return (
        <ToastContainer
            position="bottom-right"
            autoClose={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            theme="light"
        />
    );
}

export default AutoNotifier;
