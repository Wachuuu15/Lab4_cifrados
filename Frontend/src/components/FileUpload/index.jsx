import { useState } from 'react';
import { fileService } from '@services/fileService';
import classNames from 'classnames';
import styles from './FileUpload.module.scss';

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

      await fileService.uploadFile(formData);
      setMessage({ text: 'Archivo subido exitosamente', type: 'success' });
      // Reset form after successful upload
      setFile(null);
      setFileName('');
      setShouldSign(false);
      e.target.reset();
    } catch (error) {
      setMessage({ text: error.message || 'Error al subir el archivo', type: 'error' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
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
            />
          </label>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={shouldSign}
              onChange={() => setShouldSign(!shouldSign)}
              disabled={!hasKeys}
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
              Subiendo...
            </>
          ) : (
            'Subir Archivo'
          )}
        </button>
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