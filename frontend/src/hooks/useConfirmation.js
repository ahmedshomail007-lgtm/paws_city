import { useState } from 'react';

export const useConfirmation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    title: '',
    message: '',
    type: 'default',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: () => {},
  });
  const [loading, setLoading] = useState(false);

  const showConfirmation = ({
    title,
    message,
    type = 'default',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm = () => {},
  }) => {
    setConfig({
      title,
      message,
      type,
      confirmText,
      cancelText,
      onConfirm,
    });
    setIsOpen(true);
  };

  const hideConfirmation = () => {
    setIsOpen(false);
    setLoading(false);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await config.onConfirm();
      hideConfirmation();
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  return {
    isOpen,
    config,
    loading,
    showConfirmation,
    hideConfirmation,
    handleConfirm,
  };
};