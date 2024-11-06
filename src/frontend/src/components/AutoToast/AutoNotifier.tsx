import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useFetchAlertProducts from '../../Hooks/Products/getProductAlert';

function AutoNotifier() {
    const { data } = useFetchAlertProducts();
    const [activeToast, setActiveToast] = useState(null);

    const notify = (message, toastId) => {
        if (activeToast !== toastId) {
            const toastRef = toast(message, {
                toastId,
                position: "bottom-right",
                autoClose: 5000,
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
                position: "bottom-right",
                autoClose: 5000,
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
            notify(`${data?.expiring.length} produto(s) próximo da validade!`, 'expiration');
        } else {
            toast.dismiss('expiration'); 
        }
    }, [data?.expiring]);

    useEffect(() => {
        if (data?.lowStock.length > 0) {
            notify(`${data?.lowStock.length} produto(s) com estoque baixo!`, 'low-stock');
        } else {
            toast.dismiss('low-stock'); 
        }
    }, [data?.lowStock]);

    return (
        <ToastContainer
            position="bottom-right"
            autoClose={5000}
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
