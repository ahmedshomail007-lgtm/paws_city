import { useState } from 'react';

export const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState({
    isVisible: false,
    message: '',
    type: 'info'
  });

  const showSnackbar = (message, type = 'info') => {
    setSnackbar({
      isVisible: true,
      message,
      type
    });
  };

  const hideSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  return {
    snackbar,
    showSnackbar,
    hideSnackbar
  };
};