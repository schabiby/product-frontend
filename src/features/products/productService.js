import axiosClient from '../../api/axiosClient';

export const productService = {
  async getProducts() {
    try {
      const response = await axiosClient.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      
      if (import.meta.env.DEV) {
        console.warn('Using mock data for development');
        return this.getMockProducts();
      }
      
      throw this.handleApiError(error, 'Failed to fetch products');
    }
  },

  async createProduct(productData) {
    try {
      const response = await axiosClient.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      
      if (import.meta.env.DEV) {
        console.warn('Using mock creation for development');
        const mockProduct = {
          id: Date.now(),
          ...productData,
          description: productData.description || 'No description',
          category: productData.category || 'General',
          createdAt: new Date().toISOString()
        };
        return mockProduct;
      }
      
      throw this.handleApiError(error, 'Failed to create product');
    }
  },

  async updateStock(id, stock) {
    try {
      console.log(`Updating stock for product ${id} to ${stock}`);
      
      // Usar query parameter según la especificación
      const response = await axiosClient.put(`/products/${id}/stock?stock=${stock}`);
      return response.data;
    } catch (error) {
      console.error('Error updating stock:', error);
      
      if (import.meta.env.DEV) {
        console.warn('Using mock stock update for development');
        return {
          id,
          stock: parseInt(stock),
          updatedAt: new Date().toISOString(),
          message: 'Stock updated successfully (simulated)'
        };
      }
      
      throw this.handleApiError(error, 'Failed to update stock');
    }
  },

  async deleteProduct(id) {
    try {
      console.log(`Deleting product with ID: ${id}`);
      const response = await axiosClient.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      
      if (import.meta.env.DEV) {
        console.warn('Using mock deletion for development');
        return { 
          id, 
          message: 'Product deleted successfully (simulated)',
          deleted: true,
          timestamp: new Date().toISOString()
        };
      }
      
      throw this.handleApiError(error, 'Failed to delete product');
    }
  },

  /**
   * Manejar errores de API de forma consistente
   */
  handleApiError(error, defaultMessage) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || defaultMessage;
      return new Error(`HTTP ${status}: ${message}`);
    } else if (error.request) {
      return new Error('Network error: No response from server');
    } else {
      return new Error(error.message || defaultMessage);
    }
  },

  // Mock data mejorada para desarrollo
  getMockProducts() {
    return [
      {
        id: 1,
        name: "Laptop Gaming Pro",
        price: 1299.99,
        stock: 15,
        description: "High-performance gaming laptop with RGB keyboard",
        category: "Electronics",
        createdAt: "2024-01-15T10:30:00Z"
      },
      {
        id: 2,
        name: "Wireless Mouse",
        price: 29.99,
        stock: 50,
        description: "Ergonomic wireless mouse with precision sensor",
        category: "Electronics",
        createdAt: "2024-02-20T14:15:00Z"
      },
      {
        id: 3,
        name: "Mechanical Keyboard",
        price: 89.99,
        stock: 25,
        description: "RGB mechanical keyboard with blue switches",
        category: "Electronics",
        createdAt: "2024-03-10T09:45:00Z"
      },
      {
        id: 4,
        name: "4K Monitor 27\"",
        price: 399.99,
        stock: 8,
        description: "Ultra HD monitor with HDR support",
        category: "Electronics",
        createdAt: "2024-03-25T16:20:00Z"
      },
      {
        id: 5,
        name: "Gaming Chair",
        price: 249.99,
        stock: 12,
        description: "Ergonomic gaming chair with lumbar support",
        category: "Furniture",
        createdAt: "2024-04-01T11:00:00Z"
      }
    ];
  }
};