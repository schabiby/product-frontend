import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export const Card = ({ children, style = {} }) => {
  const { currentColors } = useTheme();

  return (
    <div style={{
      backgroundColor: currentColors.card,
      padding: '24px',
      borderRadius: '8px',
      border: `1px solid ${currentColors.border}`,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      ...style
    }}>
      {children}
    </div>
  );
};