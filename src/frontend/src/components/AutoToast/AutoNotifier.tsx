import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useFetchAlertProducts from '../../Hooks/Products/getProductAlert';

function AutoNotifier() {
    const { data } = useFetchAlertProducts();
    const [activeToast, setActiveToast] = useState(null);

    const notify = (message, toastId) => {
        if (activeToast !== toastId) {
            toast(message, {
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
        }
    };

    useEffect(() => {
        if (data?.expiring.length > 0) {
            notify(`${data?.expiring.length} produto(s) próximo da validade!`, 'expiration');
        }
    }, [data?.expiring]);

    useEffect(() => {
        if (data?.lowStock.length > 0) {
            notify(`${data?.lowStock.length} produto(s) com estoque baixo!`, 'low-stock');
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