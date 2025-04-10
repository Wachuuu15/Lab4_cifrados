import { useState } from 'react';
import { fileService } from '@services/fileService';
import classNames from 'classnames';
import styles from './FileUpload.module.scss';

const FileUpload = ({ hasKeys, onUploadSuccess }) => {  // Añadí onUploadSuccess
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [shouldSign, setShouldSign] = useState(false);
  const [privateKey, setPrivateKey] = useState(null);
  const [privateKeyName, setPrivateKeyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handlePrivateKeyChange = (e) => {
    const keyFile = e.target.files[0];
    setPrivateKey(keyFile);
    setPrivateKeyName(keyFile ? keyFile.name : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
  
    setIsLoading(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append('file', file); // Archivo principal
      formData.append('clavePrivada', privateKey); // Clave privada como texto
      formData.append('firmar', shouldSign); // Indicar si se debe firmar

      const progressCallback = (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );
        setUploadProgress(percentCompleted);
      };
  
      await fileService.uploadFile(formData); // Llamada al servicio
      setMessage({ text: 'Archivo subido exitosamente', type: 'success' });
  
      // Resetear el formulario
      setFile(null);
      setFileName('');
      setPrivateKey(null);
      setShouldSign(false);
      e.target.reset();
      
      // Notificar éxito al componente padre
      if (onUploadSuccess) onUploadSuccess();
      
    } catch (error) {
      setMessage({ 
        text: error.message || 'Error al subir el archivo', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setMessage({ text: '', type: '' });
        setUploadProgress(0);
      }, 3000);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Subir Archivo</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.fileInputLabel}>
            <span className={styles.fileInputText}>
              {fileName || 'Seleccionar archivo...'}
            </span>
            <input 
              type="file" 
              onChange={handleFileChange} 
              className={styles.fileInput}
              required 
              disabled={isLoading}
            />
          </label>
        </div>

        {shouldSign && (
          <div className={styles.formGroup}>
            <label className={styles.textAreaLabel}>
              <span className={styles.textAreaText}>Pegar llave privada (.pem):</span>
              <textarea
                value={privateKey || ''}
                onChange={(e) => setPrivateKey(e.target.value)}
                className={styles.textArea}
                placeholder="Pega aquí tu llave privada"
                disabled={!shouldSign} // Solo habilitar si se selecciona firmar
                required
              />
            </label>
          </div>
        )}
        
        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={shouldSign}
              onChange={() => setShouldSign(!shouldSign)}
              disabled={!hasKeys || isLoading}
              className={styles.checkboxInput}
            />
            <span className={classNames(styles.checkboxCustom, {
              [styles.disabled]: !hasKeys
            })}></span>
            <span className={styles.checkboxText}>Firmar digitalmente</span>
          </label>
          {!hasKeys && (
            <small className={styles.warningText}>Debes generar claves primero</small>
          )}
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading || !file}
          className={classNames(styles.submitButton, {
            [styles.loading]: isLoading
          })}
        >
          {isLoading ? (
            <>
              <span className={styles.spinner}></span>
              {uploadProgress > 0 ? `${uploadProgress}%` : 'Subiendo...'}
            </>
          ) : (
            'Subir Archivo'
          )}
        </button>

        {isLoading && uploadProgress > 0 && (
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </form>
      
      {message.text && (
        <div className={classNames(styles.message, {
          [styles.success]: message.type === 'success',
          [styles.error]: message.type === 'error'
        })}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default FileUpload;