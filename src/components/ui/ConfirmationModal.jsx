import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './Button';
import { Card } from './Card';

const ConfirmationModal = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  variant = "danger" 
}) => {
  const { currentColors } = useTheme();

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <Card style={{
        width: '100%',
        maxWidth: '400px'
      }}>
        <h3 style={{ 
          marginBottom: '16px', 
          color: currentColors.text,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          {variant === 'danger' ? '⚠️' : 'ℹ️'} {title}
        </h3>
        
        <p style={{ 
          marginBottom: '24px', 
          color: currentColors.text,
          lineHeight: '1.5'
        }}>
          {message}
        </p>

        <div style={{ 
          display: 'flex', 
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <Button
            variant="secondary"
            onClick={onCancel}
          >
            {cancelText}
          </Button>
          
          <Button
            variant={variant}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ConfirmationModal;