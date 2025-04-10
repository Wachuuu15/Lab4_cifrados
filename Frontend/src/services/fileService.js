// src/services/fileService.js
import api, { downloadFile, uploadFile as uploadFileFromApi } from './api';

export const fileService = {
  getFiles: async () => {
    return api.get('/archivos');
  },

  download: async (fileId, verify = false, onDownloadProgress) => {
    const response = await api.get(`/archivos/${fileId}/descargar?verify=${verify}`, {
      responseType: 'blob',
      onDownloadProgress
    });
    
    const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
    
    const contentDisposition = response.headers['content-disposition'];
    const fileName = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `file_${fileId}`;
    
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

  upload: async (fileData, shouldSign = false) => {
    const formData = new FormData();
    formData.append('file', fileData.file);
    formData.append('fileName', fileData.fileName);
    formData.append('shouldSign', shouldSign);

    return uploadFileFromApi('/archivos/guardar', formData, (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log(`Upload progress: ${percentCompleted}%`);
    });
  },

  verify: async (fileId) => {
    return api.post('/archivos/verificar', { fileId });
  },

  generateKeys: async (keyType) => {
    const response = await api.post('/keys/generate', { keyType });

    // Descargar la clave privada automáticamente
    const privateKeyBlob = new Blob([response.privateKey], { type: 'text/plain' });
    const privateKeyUrl = URL.createObjectURL(privateKeyBlob);
    const link = document.createElement('a');
    link.href = privateKeyUrl;
    link.download = `private_key_${keyType}.pem`;
    link.click();
    
    return response;
  }
};

