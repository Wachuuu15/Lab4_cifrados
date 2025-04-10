// src/services/authService.js
import api from './api';

  /**
   * Inicia sesión con email y contraseña
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{token: string, user: object}>}
   */

  export const login =  async (email, password) => {
    try {
      const response = await api.post('/auth/login', { 
        email, 
        contrasena: password,
        llavepublica: null
      });

      const token = response.token;
      if (!token) {
        throw new Error('No se recibió un token válido del servidor');
      }
  
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `${token}`;
      
      return {
        token,
        user: response.user
      };
    } catch (error) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      throw error;
    }
  };

    /**
   * Registra un nuevo usuario
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{message: string}>}
   */
    export const register = async (email, password) => {
      try {
        const response = await api.post('/auth/register', {
          correo: email,
          contrasena: password,
          llavepublica: null,
          tipofirma: null
        });
        return response;
      } catch (error) {
        if (error.response && error.response.status === 409) {
          throw new Error('El email ya está registrado');
        }
        throw error;
      }
    };
    
    /**
   * Cierra la sesión actual
   * @param {boolean} [callApi=false] - Si es true, llama al endpoint de logout en el backend
   * @returns {Promise<void>}
   */
  export const  logout = async (callApi = false) => {
      if (callApi) {
        try {
          await api.post('/auth/logout');
        } catch (error) {
          console.error('Error al cerrar sesión en el backend:', error);
        }
      }
      
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
  };
  

  export const verifyToken = async () => {
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
  };

  /**
   * Obtiene el token almacenado
   * @returns {string|null}
   */
  export const getToken = () => {
    return localStorage.getItem('token');
  };

  /**
   * Actualiza el token almacenado
   * @param {string} newToken
   */
  export const updateToken = (newToken) => {
    localStorage.setItem('token', newToken);
    api.defaults.headers.common['Authorization'] = `${newToken}`;
  };

export const authService = {




};


