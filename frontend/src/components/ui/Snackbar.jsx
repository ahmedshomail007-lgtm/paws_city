import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const Snackbar = ({ message, type = 'info', isVisible, onClose, duration = 4000 }) => {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsShowing(true);
      const timer = setTimeout(() => {
        setIsShowing(false);
        setTimeout(() => {
          onClose && onClose();
        }, 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const handleClose = () => {
    setIsShowing(false);
    setTimeout(() => {
      onClose && onClose();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "flex items-center gap-3 p-4 rounded-lg shadow-lg min-w-80 max-w-md";
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50 text-green-800 border border-green-200`;
      case 'error':
        return `${baseStyles} bg-red-50 text-red-800 border border-red-200`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 text-yellow-800 border border-yellow-200`;
      default:
        return `${baseStyles} bg-blue-50 text-blue-800 border border-blue-200`;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`transition-all duration-300 transform ${
          isShowing ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        } ${getStyles()}`}
      >
        {getIcon()}
        <span className="flex-1 text-sm font-medium">{message}</span>
        <button
          onClick={handleClose}
          className="p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Snackbar;