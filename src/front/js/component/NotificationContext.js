// NotificationContext.js
import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';

const NotificationContext = createContext();

export const useNotification = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const [toastId, setToastId] = useState(null);

    const showSuccessToast = (message) => {
        if (toastId) {
            toast.update(toastId, { render: message, type: "success", isLoading: false });
        } else {
            const id = toast.success(message, { autoClose: false });
            setToastId(id);
        }
    };

    const showErrorToast = (message) => {
        toast.error(message, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
        });
    };

    const showWarningToast = (message) => {
        toast.warn(message, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
        });
    };

    const clearToast = () => {
        if (toastId) {
            toast.dismiss(toastId);
            setToastId(null);
        }
    };

    return (
        <NotificationContext.Provider value={{ showSuccessToast, showErrorToast, showWarningToast, clearToast }}>
            {children}
        </NotificationContext.Provider>
    );
};