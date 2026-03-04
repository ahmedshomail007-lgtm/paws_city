import React from 'react';
import { useConfirmation } from '../hooks/useConfirmation';
import ConfirmationModal from '../components/ui/ConfirmationModal';

const ConfirmationDemo = () => {
  const { 
    isOpen, 
    config, 
    loading, 
    showConfirmation, 
    hideConfirmation, 
    handleConfirm 
  } = useConfirmation();

  const demoConfirmations = [
    {
      title: "Delete Item",
      message: "Are you sure you want to delete this item? This action cannot be undone.",
      type: "delete",
      confirmText: "Delete",
      cancelText: "Cancel"
    },
    {
      title: "Delete Account",
      message: "Are you sure you want to permanently delete your account? All your data will be lost forever.",
      type: "deleteAccount",
      confirmText: "Delete Account",
      cancelText: "Keep Account"
    },
    {
      title: "Logout",
      message: "Are you sure you want to logout from your session?",
      type: "logout",
      confirmText: "Logout",
      cancelText: "Stay"
    },
    {
      title: "Important Warning",
      message: "This action may have serious consequences. Please proceed with caution.",
      type: "warning",
      confirmText: "Proceed",
      cancelText: "Cancel"
    },
    {
      title: "Confirmation Required",
      message: "Do you want to continue with this action?",
      type: "default",
      confirmText: "Yes",
      cancelText: "No"
    }
  ];

  const handleDemo = (demo) => {
    showConfirmation({
      ...demo,
      onConfirm: async () => {
        // Simulate async action
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert(`Action confirmed: ${demo.title}`);
      }
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Confirmation Modal Demo</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {demoConfirmations.map((demo, index) => (
          <button
            key={index}
            onClick={() => handleDemo(demo)}
            className={`p-4 rounded-lg border-2 text-left transition-all hover:scale-105 ${
              demo.type === 'delete' || demo.type === 'deleteAccount'
                ? 'border-red-200 bg-red-50 hover:bg-red-100 text-red-800'
                : demo.type === 'logout'
                ? 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800'
                : demo.type === 'warning'
                ? 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100 text-yellow-800'
                : 'border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800'
            }`}
          >
            <h3 className="font-semibold">{demo.title}</h3>
            <p className="text-sm mt-1 opacity-75">{demo.message}</p>
            <span className="text-xs mt-2 block opacity-60">
              Click to see {demo.type} confirmation
            </span>
          </button>
        ))}
      </div>

      <ConfirmationModal
        isOpen={isOpen}
        onClose={hideConfirmation}
        onConfirm={handleConfirm}
        title={config.title}
        message={config.message}
        type={config.type}
        confirmText={config.confirmText}
        cancelText={config.cancelText}
        loading={loading}
      />
    </div>
  );
};

export default ConfirmationDemo;