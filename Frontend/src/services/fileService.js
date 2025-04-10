// src/services/fileService.js
import api, { downloadFile, uploadFile as uploadFileFromApi } from './api';

export const fileService = {
  getFiles: async () => {
    return api.get('/archivos');
  },

  download: async (fileId, verify = false, onDownloadProgress) => {
    const response = await api.get(`/archivos/${fileId}/descargar`, {
      responseType: 'blob',
      onDownloadProgress,
    });
  
    const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
  
    // Intentar obtener el nombre del archivo desde Content-Disposition
    const contentDisposition = response.headers['content-disposition'];
    const fileName = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `file_${fileId}`; // Nombre por defecto si no está el encabezado
  
    // Crear enlace y disparar la descarga
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
  
    // Limpieza
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  
    return fileName;
  },

  uploadFile: async (formData) => {
    return api.post('/archivos/guardar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Progreso de subida: ${percentCompleted}%`);
      },
    });
  },

  verify: async (fileId) => {
    return api.post('/archivos/verificar', { fileId });
  },

  generateKeys: async (keyType) => {
    const response = await api.post('/auth/generate-keys', { algorithm: keyType });
    
    return response;
  }
};

