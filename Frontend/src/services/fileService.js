// src/services/fileService.js
import api, { downloadFile, uploadFile as uploadFileFromApi } from './api';

export const fileService = {

  getFiles: async () => {
    return api.get('/archivos');
  },

  /**
   * Descarga un archivo
   * @param {string} fileId - ID del archivo
   * @param {boolean} verify - Verificar firma digital
   * @param {function} onProgress - Callback para progreso
   * @returns {Promise<void>}
   */
  download: async (fileId, verify = false, onProgress) => {
    try {
      const { fileName, blob } = await downloadFile(
        `/archivos/${fileId}/descargar`,
        `archivo_${fileId}`,
        onProgress
      );

      // Crear objeto URL para el blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Crear enlace y disparar descarga
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      // Limpieza
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);

      return fileName;
    } catch (error) {
      console.error('Error descargando archivo:', error);
      throw new Error(error.message || 'Error al descargar el archivo');
    }
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

  verify: async (formData) => {
    return api.post('/archivos/verificar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  

  generateKeys: async (keyType) => {
    const response = await api.post('/auth/generate-keys', { algorithm: keyType });
    
    return response;
  }
};

