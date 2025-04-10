// src/services/api.js
import axios from 'axios';

// Configuración base
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000, //  timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

//  requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `${token}`;
    console.log('Encabezado Authorization:', config.headers.Authorization);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// a responses
api.interceptors.response.use((response) => {
  return response.data;
}, (error) => {
  // Manejo centralizado de errores
  if (error.response) {
    const message = error.response.data?.error || 'Error en la solicitud';
    return Promise.reject(message);
  } else if (error.request) {
    return Promise.reject(new Error('No se recibió respuesta del servidor'));
  } else {
    return Promise.reject(new Error('Error al configurar la solicitud'));
  }
});

// Métodos 
export const downloadFile = async (url, fileName) => {
  const response = await api.get(url, {
    responseType: 'blob'
  });
  
  // Crear el objeto URL para el blob
  const blobUrl = window.URL.createObjectURL(new Blob([response]));
  
  // Crear enlace y disparar la descarga
  const link = document.createElement('a');
  link.href = blobUrl;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  
  // Limpieza
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
};

export const uploadFile = async (url, formData, onUploadProgress) => {
  return api.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress
  });
};

export default api;