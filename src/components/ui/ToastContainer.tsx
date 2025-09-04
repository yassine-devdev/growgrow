import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Toast } from '../../types/index.ts';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertTriangle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
};

const ToastMessage: React.FC<{ toast: Toast, onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
    const role = toast.type === 'error' ? 'alert' : 'status';
    return (
        <div className="bg-brand-surface rounded-lg shadow-lg p-4 flex items-start gap-3 w-full max-w-sm animate-fade-in-down" role={role}>
            <div className="shrink-0">{icons[toast.type]}</div>
            <p className="flex-1 text-sm text-brand-text font-medium">{toast.message}</p>
            <button onClick={() => onRemove(toast.id)} className="shrink-0 p-1 text-brand-text-alt hover:text-brand-text" aria-label="Close notification">
                <X className="w-4 h-4" />
            </button>
        </div>
    )
}

const ToastContainer: React.FC = () => {
    const toasts = useAppStore(s => s.toasts);
    const removeToast = useAppStore(s => s.removeToast);

    if (toasts.length === 0) {
        return null;
    }

    return (
        <div 
            className="fixed top-6 right-6 z-[100] space-y-3"
            role="region"
            aria-live="assertive"
            aria-atomic="true"
        >
            {toasts.map(toast => (
                <ToastMessage key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </div>
    );
};

export default ToastContainer;