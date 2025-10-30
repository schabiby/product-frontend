import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      // Colores para modo claro
      light: {
        background: '#ffffff',
        surface: '#f8f9fa',
        primary: '#007bff',
        secondary: '#6c757d',
        success: '#28a745',
        danger: '#dc3545',
        warning: '#ffc107',
        text: '#212529',
        textMuted: '#6c757d',
        border: '#dee2e6',
        header: '#ffffff',
        card: '#ffffff'
      },
      // Colores para modo oscuro
      dark: {
        background: '#121212',
        surface: '#1e1e1e',
        primary: '#0d6efd',
        secondary: '#5a6268',
        success: '#198754',
        danger: '#dc3545',
        warning: '#ffc107',
        text: '#e9ecef',
        textMuted: '#adb5bd',
        border: '#495057',
        header: '#2d3748',
        card: '#2d3748'
      }
    }
  };

  const currentColors = theme.colors[isDarkMode ? 'dark' : 'light'];

  return (
    <ThemeContext.Provider value={{ ...theme, currentColors }}>
      <div style={{
        backgroundColor: currentColors.background,
        color: currentColors.text,
        minHeight: '100vh',
        transition: 'all 0.3s ease'
      }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};