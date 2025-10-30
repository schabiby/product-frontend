import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

const UpdateStockForm = ({ product, onStockUpdated, onCancel }) => {
  const [newStock, setNewStock] = useState(product.stock.toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentColors } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const stockValue = parseInt(newStock);
    
    if (isNaN(stockValue) || stockValue < 0) {
      setError('Stock must be a valid non-negative number');
      return;
    }

    if (stockValue > 100000) {
      setError('Stock cannot exceed 100,000 units');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onStockUpdated(product.id, stockValue);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const stockDifference = parseInt(newStock) - product.stock;
  const isIncreasing = stockDifference > 0;
  const isDecreasing = stockDifference < 0;

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
        maxWidth: '450px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <h3 style={{ 
          marginBottom: '20px', 
          color: currentColors.text,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          📊 Update Stock
        </h3>
        
        {/* Product Info */}
        <div style={{ 
          marginBottom: '20px',
          padding: '16px',
          backgroundColor: currentColors.surface,
          borderRadius: '8px',
          border: `1px solid ${currentColors.border}`
        }}>
          <h4 style={{ 
            margin: '0 0 8px 0', 
            color: currentColors.text,
            fontSize: '16px'
          }}>
            {product.name}
          </h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '10px',
            fontSize: '14px'
          }}>
            <div>
              <span style={{ color: currentColors.textMuted }}>Current Price:</span>
              <div style={{ fontWeight: 'bold', color: currentColors.primary }}>
                ${product.price?.toFixed(2)}
              </div>
            </div>
            <div>
              <span style={{ color: currentColors.textMuted }}>Current Stock:</span>
              <div style={{ 
                fontWeight: 'bold', 
                color: product.stock === 0 ? currentColors.danger : 
                       product.stock < 10 ? currentColors.warning : currentColors.success 
              }}>
                {product.stock} units
              </div>
            </div>
          </div>
        </div>

        {/* Stock Change Preview */}
        {!isNaN(parseInt(newStock)) && stockDifference !== 0 && (
          <div style={{ 
            marginBottom: '20px',
            padding: '12px',
            backgroundColor: isIncreasing ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)',
            border: `1px solid ${isIncreasing ? currentColors.success : currentColors.danger}`,
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontWeight: 'bold',
              color: isIncreasing ? currentColors.success : currentColors.danger,
              marginBottom: '4px'
            }}>
              {isIncreasing ? '📈 Stock Increase' : '📉 Stock Decrease'}
            </div>
            <div style={{ fontSize: '14px', color: currentColors.text }}>
              {Math.abs(stockDifference)} units ({isIncreasing ? '+' : ''}{stockDifference})
            </div>
            <div style={{ fontSize: '12px', color: currentColors.textMuted, marginTop: '4px' }}>
              New total: {parseInt(newStock)} units
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              color: currentColors.text 
            }}>
              New Stock Quantity *
            </label>
            <input
              type="number"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              min="0"
              max="100000"
              style={{
                width: '100%',
                padding: '12px',
                border: error ? `2px solid ${currentColors.danger}` : `1px solid ${currentColors.border}`,
                borderRadius: '6px',
                fontSize: '16px',
                backgroundColor: currentColors.background,
                color: currentColors.text,
                transition: 'all 0.2s ease'
              }}
              autoFocus
            />
            {error && (
              <span style={{ 
                color: currentColors.danger, 
                fontSize: '14px', 
                marginTop: '6px', 
                display: 'block' 
              }}>
                ❌ {error}
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '8px',
            marginBottom: '20px'
          }}>
            <Button
              type="button"
              variant="outline"
              onClick={() => setNewStock('0')}
              style={{ fontSize: '12px', padding: '8px' }}
            >
              Set to 0
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setNewStock((product.stock + 10).toString())}
              style={{ fontSize: '12px', padding: '8px' }}
            >
              +10 Units
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setNewStock((product.stock + 50).toString())}
              style={{ fontSize: '12px', padding: '8px' }}
            >
              +50 Units
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setNewStock((product.stock + 100).toString())}
              style={{ fontSize: '12px', padding: '8px' }}
            >
              +100 Units
            </Button>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading || parseInt(newStock) === product.stock}
            >
              {loading ? 'Updating...' : 'Update Stock'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UpdateStockForm;