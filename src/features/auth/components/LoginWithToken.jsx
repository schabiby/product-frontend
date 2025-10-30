import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

const LoginWithToken = () => {
  const [token, setToken] = useState('');
  const [errors, setErrors] = useState({});
  const { loginWithToken, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { currentColors } = useTheme();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token.trim()) {
      setErrors({ token: 'Token is required' });
      return;
    }

    setErrors({});
    
    try {
      await loginWithToken(token);
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  const insertExampleToken = () => {
    const exampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwibmFtZSI6IlRlc3QgVXNlciIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    setToken(exampleToken);
  };

  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: currentColors.background,
      padding: '20px'
    }}>
      <Card style={{ 
        width: '100%',
        maxWidth: '600px'
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          color: currentColors.text 
        }}>
          JWT Token Login
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              color: currentColors.text 
            }}>
              JWT Token:
            </label>
            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste your JWT token here..."
              rows="6"
              style={{ 
                width: '100%', 
                padding: '12px',
                border: errors.token ? `2px solid ${currentColors.danger}` : `1px solid ${currentColors.border}`,
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '14px',
                resize: 'vertical',
                backgroundColor: currentColors.background,
                color: currentColors.text
              }}
            />
            {errors.token && (
              <span style={{ 
                color: currentColors.danger, 
                fontSize: '14px', 
                marginTop: '5px', 
                display: 'block' 
              }}>
                {errors.token}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <Button 
              type="button" 
              variant="secondary"
              onClick={insertExampleToken}
            >
              Use Example Token
            </Button>
          </div>

          {errors.submit && (
            <div style={{ 
              color: currentColors.danger, 
              backgroundColor: currentColors.surface,
              border: `1px solid ${currentColors.danger}`,
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '20px'
            }}>
              {errors.submit}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading || !token.trim()}
            style={{ width: '100%' }}
          >
            {loading ? 'Authenticating...' : 'Login with Token'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default LoginWithToken;