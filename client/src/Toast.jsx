import React, { useState, useEffect, createContext, useContext } from 'react';

// Kontekst dla toastów
const ToastContext = createContext();

// Hook do używania toastów w komponentach
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

// Pojedynczy toast
const Toast = ({ id, message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, 3000); // Auto-zamknięcie po 3 sekundach

        return () => clearTimeout(timer);
    }, [id, onClose]);

    const icons = {
        success: 'fa-solid fa-check-circle',
        error: 'fa-solid fa-circle-exclamation',
        info: 'fa-solid fa-info-circle',
        warning: 'fa-solid fa-triangle-exclamation',
        love: 'fa-solid fa-heart'
    };

    return (
        <div className={`toast toast-${type}`}>
            <i className={icons[type] || icons.info}></i>
            <span>{message}</span>
            <button className="toast-close" onClick={() => onClose(id)}>
                <i className="fa-solid fa-xmark"></i>
            </button>
        </div>
    );
};

// Provider dla toastów
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    // Funkcje pomocnicze
    const toast = {
        success: (message) => addToast(message, 'success'),
        error: (message) => addToast(message, 'error'),
        info: (message) => addToast(message, 'info'),
        warning: (message) => addToast(message, 'warning'),
        love: (message) => addToast(message, 'love')
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className="toast-container">
                {toasts.map(t => (
                    <Toast
                        key={t.id}
                        id={t.id}
                        message={t.message}
                        type={t.type}
                        onClose={removeToast}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export default ToastProvider;
