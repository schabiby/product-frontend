import React, { useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Toast = ({ message, type, onClose, duration = 5000 }) => {
  const { currentColors } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getToastStyle = () => {
    const baseStyle = {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '15px 20px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: 'bold',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 9999,
      minWidth: '300px',
      maxWidth: '500px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      border: `1px solid ${currentColors.border}`
    };

    switch (type) {
      case 'success':
        return { ...baseStyle, backgroundColor: currentColors.success };
      case 'error':
        return { ...baseStyle, backgroundColor: currentColors.danger };
      case 'warning':
        return { ...baseStyle, backgroundColor: currentColors.warning, color: '#212529' };
      case 'info':
        return { ...baseStyle, backgroundColor: currentColors.primary };
      default:
        return { ...baseStyle, backgroundColor: currentColors.secondary };
    }
  };

  return (
    <div style={getToastStyle()}>
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          fontSize: '18px',
          cursor: 'pointer',
          marginLeft: '10px'
        }}
      >
        ×
      </button>
    </div>
  );
};

export default Toast;