import React, { useEffect } from 'react';
import { X, AlertTriangle, Trash2, LogOut, UserX } from 'lucide-react';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'default',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'danger':
      case 'delete':
        return <Trash2 className="w-6 h-6" />;
      case 'logout':
        return <LogOut className="w-6 h-6" />;
      case 'deleteAccount':
        return <UserX className="w-6 h-6" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6" />;
      default:
        return <AlertTriangle className="w-6 h-6" />;
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'danger':
      case 'delete':
      case 'deleteAccount':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'logout':
        return 'text-gray-600';
      default:
        return 'text-blue-600';
    }
  };

  const getIconBgColor = () => {
    switch (type) {
      case 'danger':
      case 'delete':
      case 'deleteAccount':
        return 'bg-red-100';
      case 'warning':
        return 'bg-yellow-100';
      case 'logout':
        return 'bg-gray-100';
      default:
        return 'bg-blue-100';
    }
  };

  const getConfirmButtonColor = () => {
    switch (type) {
      case 'danger':
      case 'delete':
      case 'deleteAccount':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500';
      case 'logout':
        return 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500';
      default:
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
          {/* Header with close button */}
          <div className="absolute right-4 top-4">
            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Icon */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${getIconBgColor()}`}>
                <div className={getIconColor()}>
                  {getIcon()}
                </div>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              {title}
            </h3>

            {/* Message */}
            <p className="text-sm text-gray-600 text-center mb-6">
              {message}
            </p>

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${getConfirmButtonColor()}`}
              >
                {loading ? 'Loading...' : confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;