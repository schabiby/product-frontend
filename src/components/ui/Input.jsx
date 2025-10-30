import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  onBlur,
  error, 
  required = false,
  placeholder,
  ...props 
}) => {
  const { currentColors } = useTheme();

  return (
    <div style={{ marginBottom: '20px' }}>
      {label && (
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontWeight: '600',
          color: currentColors.text 
        }}>
          {label} {required && '*'}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '12px',
          border: error ? `2px solid ${currentColors.danger}` : `1px solid ${currentColors.border}`,
          borderRadius: '6px',
          fontSize: '14px',
          backgroundColor: currentColors.background,
          color: currentColors.text,
          transition: 'all 0.2s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
        {...props}
      />
      {error && (
        <span style={{ 
          color: currentColors.danger, 
          fontSize: '12px', 
          marginTop: '6px', 
          display: 'block',
          fontWeight: '500'
        }}>
          {error}
        </span>
      )}
    </div>
  );
};