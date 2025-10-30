import React, { useState, useEffect } from 'react';
import { productService } from '../productService';
import ProductForm from './ProductForm';
import UpdateStockForm from './UpdateStockForm';
import { useTheme } from '../../../contexts/ThemeContext';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import ConfirmationModal from '../../../components/ui/ConfirmationModal';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingStockProduct, setEditingStockProduct] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const { currentColors } = useTheme();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products. Using demo data.');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (productData) => {
    try {
      setError('');
      const newProduct = await productService.createProduct(productData);
      setProducts(prev => [newProduct, ...prev]);
      setShowForm(false);
      setSuccessMessage(`Product "${newProduct.name}" created successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to create product: ' + err.message);
    }
  };

  const handleUpdateStock = async (productId, newStock) => {
    try {
      setError('');
      const result = await productService.updateStock(productId, newStock);
      
      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, stock: newStock }
          : product
      ));
      
      setEditingStockProduct(null);
      
      const productName = products.find(p => p.id === productId)?.name;
      setSuccessMessage(`Stock for "${productName}" updated to ${newStock} successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (err) {
      setError('Failed to update stock: ' + err.message);
    }
  };

  const handleDeleteClick = (product) => {
    setDeleteConfirmation(product);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation) return;

    try {
      setDeletingProductId(deleteConfirmation.id);
      setError('');
      await productService.deleteProduct(deleteConfirmation.id);
      setProducts(prev => prev.filter(product => product.id !== deleteConfirmation.id));
      setSuccessMessage(`Product "${deleteConfirmation.name}" deleted successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete product: ' + err.message);
    } finally {
      setDeletingProductId(null);
      setDeleteConfirmation(null);
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', color: currentColors.danger };
    if (stock < 5) return { text: 'Very Low Stock', color: '#dc3545', textColor: 'white' };
    if (stock < 10) return { text: 'Low Stock', color: currentColors.warning, textColor: '#000' };
    return { text: 'In Stock', color: currentColors.success, textColor: 'white' };
  };

  const getStockIcon = (stock) => {
    if (stock === 0) return '❌';
    if (stock < 5) return '⚠️';
    if (stock < 10) return '📉';
    return '✅';
  };

  // Calculate statistics
  const totalProducts = products.length;
  const inStockCount = products.filter(p => p.stock >= 10).length;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock < 10).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px',
        color: currentColors.textMuted
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <div>Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Update Stock Modal */}
      {editingStockProduct && (
        <UpdateStockForm
          product={editingStockProduct}
          onStockUpdated={handleUpdateStock}
          onCancel={() => setEditingStockProduct(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <ConfirmationModal
          isOpen={!!deleteConfirmation}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteConfirmation(null)}
          title="Delete Product"
          message={`Are you sure you want to delete "${deleteConfirmation.name}"? This action cannot be undone and will permanently remove the product from your inventory.`}
          confirmText="Delete Product"
          variant="danger"
        />
      )}

      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 style={{ color: currentColors.text, margin: 0 }}>Product Inventory</h2>
          <p style={{ color: currentColors.textMuted, margin: '4px 0 0 0', fontSize: '14px' }}>
            Manage your product catalog and stock levels
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button 
            variant="secondary"
            onClick={loadProducts}
          >
            🔄 Refresh
          </Button>
          <Button 
            variant={showForm ? "danger" : "success"}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '❌ Cancel' : '➕ Add New Product'}
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Card style={{ 
          color: currentColors.success, 
          backgroundColor: currentColors.surface,
          border: `1px solid ${currentColors.success}`,
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>✅</span>
            <span>{successMessage}</span>
          </div>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Card style={{ 
          color: currentColors.danger, 
          backgroundColor: currentColors.surface,
          border: `1px solid ${currentColors.danger}`,
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>❌</span>
            <span>{error}</span>
          </div>
        </Card>
      )}

      {/* Product Form */}
      {showForm && (
        <ProductForm 
          onProductCreated={handleCreateProduct}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Products Count and Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px', 
        marginBottom: '24px' 
      }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: currentColors.primary, marginBottom: '8px' }}>
              {totalProducts}
            </div>
            <div style={{ fontSize: '14px', color: currentColors.textMuted, fontWeight: '500' }}>
              Total Products
            </div>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: currentColors.success, marginBottom: '8px' }}>
              {inStockCount}
            </div>
            <div style={{ fontSize: '14px', color: currentColors.textMuted, fontWeight: '500' }}>
              In Stock
            </div>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: currentColors.warning, marginBottom: '8px' }}>
              {lowStockCount}
            </div>
            <div style={{ fontSize: '14px', color: currentColors.textMuted, fontWeight: '500' }}>
              Low Stock
            </div>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: currentColors.danger, marginBottom: '8px' }}>
              {outOfStockCount}
            </div>
            <div style={{ fontSize: '14px', color: currentColors.textMuted, fontWeight: '500' }}>
              Out of Stock
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: currentColors.primary, marginBottom: '8px' }}>
              ${totalValue.toFixed(2)}
            </div>
            <div style={{ fontSize: '14px', color: currentColors.textMuted, fontWeight: '500' }}>
              Total Inventory Value
            </div>
          </div>
        </Card>
      </div>

      {/* Products Table */}
      {products.length > 0 ? (
        <Card>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              color: currentColors.text
            }}>
              <thead>
                <tr style={{ backgroundColor: currentColors.surface }}>
                  <th style={{ 
                    padding: '16px', 
                    borderBottom: `2px solid ${currentColors.border}`, 
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>Product</th>
                  <th style={{ 
                    padding: '16px', 
                    borderBottom: `2px solid ${currentColors.border}`, 
                    textAlign: 'right',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>Price</th>
                  <th style={{ 
                    padding: '16px', 
                    borderBottom: `2px solid ${currentColors.border}`, 
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>Stock Status</th>
                  <th style={{ 
                    padding: '16px', 
                    borderBottom: `2px solid ${currentColors.border}`, 
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>Category</th>
                  <th style={{ 
                    padding: '16px', 
                    borderBottom: `2px solid ${currentColors.border}`, 
                    textAlign: 'center', 
                    width: '200px',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => {
                  const stockStatus = getStockStatus(product.stock);
                  return (
                    <tr key={product.id} style={{
                      backgroundColor: index % 2 === 0 ? currentColors.background : currentColors.surface,
                      borderBottom: `1px solid ${currentColors.border}`,
                      transition: 'all 0.2s ease'
                    }}>
                      <td style={{ padding: '16px' }}>
                        <div>
                          <strong style={{ fontSize: '16px', display: 'block', marginBottom: '6px' }}>
                            {product.name}
                          </strong>
                          <div style={{ 
                            fontSize: '14px', 
                            color: currentColors.textMuted,
                            lineHeight: '1.4'
                          }}>
                            {product.description}
                          </div>
                          <div style={{ 
                            fontSize: '12px', 
                            color: currentColors.textMuted,
                            marginTop: '4px'
                          }}>
                            ID: {product.id}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <strong style={{ 
                          color: currentColors.primary,
                          fontSize: '16px'
                        }}>
                          ${product.price?.toFixed(2)}
                        </strong>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '20px' }}>
                            {getStockIcon(product.stock)}
                          </span>
                          <span style={{ 
                            padding: '6px 12px', 
                            borderRadius: '20px',
                            backgroundColor: stockStatus.color,
                            color: stockStatus.textColor || 'white',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            display: 'inline-block',
                            minWidth: '120px'
                          }}>
                            {product.stock} units
                          </span>
                          <div style={{ 
                            fontSize: '11px', 
                            color: currentColors.textMuted,
                            fontWeight: '500'
                          }}>
                            {stockStatus.text}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          padding: '6px 12px',
                          backgroundColor: currentColors.surface,
                          borderRadius: '20px',
                          fontSize: '12px',
                          border: `1px solid ${currentColors.border}`,
                          display: 'inline-block',
                          fontWeight: '500'
                        }}>
                          {product.category}
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                          <Button
                            variant="primary"
                            onClick={() => setEditingStockProduct(product)}
                            style={{ padding: '8px 16px', fontSize: '12px', width: '140px' }}
                          >
                            📊 Update Stock
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleDeleteClick(product)}
                            loading={deletingProductId === product.id}
                            disabled={deletingProductId === product.id}
                            style={{ padding: '8px 16px', fontSize: '12px', width: '140px' }}
                          >
                            {deletingProductId === product.id ? 'Deleting...' : '🗑️ Delete'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary Footer */}
          <div style={{ 
            padding: '16px',
            borderTop: `1px solid ${currentColors.border}`,
            backgroundColor: currentColors.surface,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '14px',
            color: currentColors.textMuted
          }}>
            <div>
              Showing <strong>{products.length}</strong> product{products.length !== 1 ? 's' : ''}
            </div>
            <div>
              Inventory Value: <strong>${totalValue.toFixed(2)}</strong>
            </div>
          </div>
        </Card>
      ) : (
        /* Empty State */
        <Card style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ color: currentColors.textMuted, fontSize: '16px' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📦</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px', color: currentColors.text }}>
              No products found
            </div>
            <div style={{ marginBottom: '24px', maxWidth: '400px', margin: '0 auto' }}>
              Your product inventory is empty. Start by adding your first product to manage stock levels and track your inventory.
            </div>
            <Button
              variant="success"
              onClick={() => setShowForm(true)}
              style={{ padding: '12px 24px', fontSize: '16px' }}
            >
              ➕ Create Your First Product
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProductList;