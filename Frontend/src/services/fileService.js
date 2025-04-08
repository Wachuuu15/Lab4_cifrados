import api, { downloadFile, uploadFile } from './api';

export const fileService = {
    getFiles: async () => {
      return api.get('/archivos');
    },
    
    download: async (fileId, verify = false) => {
      return downloadFile(`/archivos/${fileId}/descargar?verify=${verify}`, `file_${fileId}`);
    },
    
    upload: async (fileData, shouldSign = false) => {
      const formData = new FormData();
      formData.append('file', fileData.file);
      formData.append('fileName', fileData.fileName);
      formData.append('shouldSign', shouldSign);
      
      return uploadFile('/archivos/guardar', formData, (progressEvent) => {
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
  