import React from 'react';
import Toast from './Toast';
import { useTheme } from '../../contexts/ThemeContext';

const ToastContainer = ({ toasts, removeToast }) => {
  const { currentColors } = useTheme();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      zIndex: 9998,
      pointerEvents: 'none'
    }}>
      {toasts.map((toast) => (
        <div key={toast.id} style={{ pointerEvents: 'auto' }}>
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
            duration={toast.duration}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;