import { useState } from 'react';
import { uploadFile } from '@services/fileService';

const FileUpload = ({ hasKeys }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [shouldSign, setShouldSign] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileName);
      formData.append('shouldSign', shouldSign);

      await uploadFile(formData);
      setMessage({ text: 'Archivo subido exitosamente', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Error al subir el archivo', type: 'error' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  return (
    <div className="file-upload">
      <h3>Subir Archivo</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="file" onChange={handleFileChange} required />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={shouldSign}
              onChange={() => setShouldSign(!shouldSign)}
              disabled={!hasKeys}
            />
            Firmar digitalmente
          </label>
          {!hasKeys && <small>Debes generar claves primero</small>}
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Subiendo...' : 'Subir Archivo'}
        </button>
      </form>
      {message.text && (
        <p className={`message ${message.type}`}>{message.text}</p>
      )}
    </div>
  );
};

export default FileUpload;