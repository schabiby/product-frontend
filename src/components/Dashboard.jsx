import React from 'react';
import { useAuth } from '../features/auth/context/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ProductList from '../features/products/components/ProductList';
import { Button } from './ui/Button';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme, currentColors } = useTheme();
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: currentColors.background,
      color: currentColors.text 
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: currentColors.header,
        padding: '20px 0',
        borderBottom: `1px solid ${currentColors.border}`,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div>
            <h1 style={{ margin: 0, color: currentColors.text }}>Product Management</h1>
            <p style={{ 
              margin: '5px 0 0 0', 
              color: currentColors.textMuted,
              fontSize: '14px'
            }}>
              Welcome, {user?.name} ({user?.email})
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Button 
              variant="outline"
              onClick={toggleTheme}
            >
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </Button>
            <div style={{ 
              padding: '8px 12px', 
              backgroundColor: currentColors.surface,
              borderRadius: '6px',
              fontSize: '14px',
              border: `1px solid ${currentColors.border}`
            }}>
              Role: <strong>{user?.role}</strong>
            </div>
            <Button 
              variant="danger"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        padding: '20px'
      }}>
        <ProductList />
      </div>
    </div>
  );
};

export default Dashboard;