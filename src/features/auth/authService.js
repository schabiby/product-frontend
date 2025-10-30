export const authService = {
  async loginWithToken(token) {
    if (!token || token.trim() === '') {
      throw new Error('Token is required');
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    localStorage.setItem('token', token);

    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      
      const user = {
        id: decodedPayload.id || 1,
        email: decodedPayload.email || 'user@example.com',
        name: decodedPayload.name || 'User',
        role: decodedPayload.role || 'user'
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      return { user, token };
    } catch (error) {
      const user = {
        id: 1,
        email: 'user@example.com',
        name: 'User',
        role: 'user'
      };
      localStorage.setItem('user', JSON.stringify(user));
      return { user, token };
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};