import { useState } from 'react';
import { fileService } from '@services/fileService';
import classNames from 'classnames';
import styles from './FileVerifier.module.scss';

const FileVerifier = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [correoFirmante, setCorreoFirmante] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !correoFirmante) {
      setMessage({ text: 'Completa todos los campos requeridos', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('correo', correoFirmante);

      const res = await fileService.verify(formData); // Nuevo método del servicio
      if (res.data.valido) {
        setMessage({ text: '✅ ' + res.data.mensaje, type: 'success' });
      } else {
        setMessage({ text: '❌ ' + res.data.mensaje, type: 'error' });
      }
    } catch (error) {
      console.log(error);
      setMessage({
        text: error.response?.data?.mensaje || 'Error al verificar el archivo',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Verificar Archivo</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.fileInputLabel}>
            <span className={styles.fileInputText}>
              {fileName || 'Seleccionar archivo a verificar...'}
            </span>
            <input
              type="file"
              onChange={(e) => {
                const selectedFile = e.target.files[0];
                setFile(selectedFile);
                setFileName(selectedFile?.name || '');
              }}
              className={styles.fileInput}
              required
            />
          </label>
        </div>

        <div className={styles.formGroup}>
        <label className={styles.formLabel}>Correo del firmante:</label>
        <input
            type="email"
            value={correoFirmante}
            onChange={(e) => setCorreoFirmante(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={classNames(styles.submitButton, {
            [styles.loading]: isLoading,
          })}
        >
          {isLoading ? 'Verificando...' : 'Verificar Firma'}
        </button>
      </form>

      {message.text && (
        <div className={classNames(styles.message, {
          [styles.success]: message.type === 'success',
          [styles.error]: message.type === 'error',
        })}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default FileVerifier;
