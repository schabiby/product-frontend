import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export const Button = ({ 
  children, 
  variant = 'primary',
  loading = false,
  disabled = false,
  ...props 
}) => {
  const { currentColors } = useTheme();

  const getVariantStyle = () => {
    const baseStyle = {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '6px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      opacity: disabled ? 0.6 : 1,
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    switch (variant) {
      case 'primary':
        return { ...baseStyle, backgroundColor: currentColors.primary, color: 'white' };
      case 'success':
        return { ...baseStyle, backgroundColor: currentColors.success, color: 'white' };
      case 'danger':
        return { ...baseStyle, backgroundColor: currentColors.danger, color: 'white' };
      case 'secondary':
        return { ...baseStyle, backgroundColor: currentColors.secondary, color: 'white' };
      case 'outline':
        return { 
          ...baseStyle, 
          backgroundColor: 'transparent', 
          color: currentColors.primary,
          border: `2px solid ${currentColors.primary}`
        };
      default:
        return baseStyle;
    }
  };

  return (
    <button 
      style={getVariantStyle()} 
      disabled={disabled || loading}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.target.style.transform = 'translateY(-1px)';
          e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        }
      }}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};