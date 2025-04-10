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
export const downloadFile = async (url, defaultName, onDownloadProgress) => {
  const response = await api.get(url, {
    responseType: 'blob',
    onDownloadProgress,
  });

  // Obtener nombre del archivo del header Content-Disposition
  const contentDisposition = response.headers['content-disposition'];
  let fileName = defaultName;

  if (contentDisposition) {
    const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
    if (fileNameMatch && fileNameMatch[1]) {
      fileName = fileNameMatch[1].replace(/"/g, '');
    }
  }

  return {
    fileName,
    blob: new Blob([response.data]),
    mimeType: response.headers['content-type'],
  };
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