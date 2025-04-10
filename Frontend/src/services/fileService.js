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
        `/archivos/${fileId}/descargar?verify=${verify}`,
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

