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
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// a responses
api.interceptors.response.use((response) => {
  return {
    data: response.data,
    headers: response.headers,
    status: response.status,
    statusText: response.statusText,
    config: response.config,
    request: response.request,
  };
}, (error) => {
  // Manejo centralizado de errores
  console.log('Error en la respuesta:', error);
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
  try {
    const { data, headers } = await api.get(url, {
      responseType: 'blob',
      onDownloadProgress,
    });

    // Obtener nombre del archivo del header Content-Disposition
    const contentDisposition = headers['content-disposition'];
    let fileName = defaultName;

    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename\*=UTF-8''(.+)/);
      if (fileNameMatch && fileNameMatch[1]) {
        fileName = decodeURIComponent(fileNameMatch[1]);
      } else {
        const fallbackMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (fallbackMatch && fallbackMatch[1]) {
          fileName = fallbackMatch[1].replace(/"/g, '');
        }
      }
    } else {
      console.warn('El encabezado Content-Disposition no está presente en la respuesta.');
    }

    return {
      fileName,
      blob: new Blob([data]),
      mimeType: headers['content-type'],
    };
  } catch (error) {
    console.error('Error en downloadFile:', error);
    throw new Error(error.message || 'Error al descargar el archivo');
  }
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