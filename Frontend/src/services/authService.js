// src/services/authService.js
import api from './api';

export const authService = {
  /**
   * Inicia sesión con email y contraseña
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{token: string, user: object}>}
   */
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { 
        email, 
        password 
      });
      
      // Almacenar el token en localStorage
      localStorage.setItem('token', response.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
      
      return {
        token: response.token,
        user: response.user
      };
    } catch (error) {
    
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      throw error;
    }
  },

  /**
   * Registra un nuevo usuario
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{message: string}>}
   */
  register: async (email, password) => {
    try {
      const response = await api.post('/auth/register', {
        email,
        password
      });
      return response;
    } catch (error) {
      if (error.response && error.response.status === 409) {
        throw new Error('El email ya está registrado');
      }
      throw error;
    }
  },

  verifyToken: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token disponible');
    }

    try {
      const response = await api.get('/auth/verify');
      return response.user;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
      }
      throw error;
    }
  },

  /**
   * Cierra la sesión actual
   * @param {boolean} [callApi=false] - Si es true, llama al endpoint de logout en el backend
   * @returns {Promise<void>}
   */
  logout: async (callApi = false) => {
    if (callApi) {
      try {
        await api.post('/auth/logout');
      } catch (error) {
        console.error('Error al cerrar sesión en el backend:', error);
      }
    }
    
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  },

  /**
   * Obtiene el token almacenado
   * @returns {string|null}
   */
  getToken: () => {
    return localStorage.getItem('token');
  },
  updateToken: (newToken) => {
    localStorage.setItem('token', newToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  }
};