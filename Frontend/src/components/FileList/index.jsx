import { useState, useEffect } from 'react';
import { fileService } from '@services/fileService';
import classNames from 'classnames';
import styles from './FileList.module.scss';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState({});

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const { data } = await fileService.getFiles();
        setFiles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, []);

  const handleDownload = async (fileId) => {
    try {
      //console.log('Descargando archivo:', fileId);
      setDownloading(prev => ({ ...prev, [fileId]: true }));
      await fileService.download(fileId);
    } catch (err) {
      setError(`Error al descargar: ${err.message}`);
      setTimeout(() => setError(null), 3000);
    } finally {
      setDownloading(prev => ({ ...prev, [fileId]: false }));
    }
  };

  if (loading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p>Cargando archivos...</p>
    </div>
  );

  if (error) return (
    <div className={styles.errorContainer}>
      <p className={styles.errorMessage}>{error}</p>
      <button 
        className={styles.retryButton}
        onClick={() => window.location.reload()}
      >
        Reintentar
      </button>
    </div>
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Mis Archivos</h2>
      
      {files.length === 0 ? (
        <div className={styles.emptyState}>
          <svg className={styles.emptyIcon} viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
          <p>No tienes archivos subidos aún</p>
        </div>
      ) : (
        <ul className={styles.fileList}>
          {files.map(file => (
            <li key={file.id} className={styles.fileItem}>
              <div className={styles.fileInfo}>
                <svg className={styles.fileIcon} viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
                <div className={styles.fileDetails}>
                  <span className={styles.fileName}>Archivo: {file.nombre}</span>
                  <span className={styles.fileName}>Autor: {file.correo}</span>
                  <span className={styles.fileName}>Firmado: {file.firma ? 'Si' : 'No'}</span>
                  {file.firma && (
                    <span className={styles.fileName}>Firmado con: {file.tipofirma}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDownload(file.id)}
                disabled={downloading[file.id]}
                className={classNames(styles.downloadButton, {
                  [styles.downloading]: downloading[file.id]
                })}
              >
                {downloading[file.id] ? (
                  <>
                    <span className={styles.downloadSpinner}></span>
                    Descargando...
                  </>
                ) : (
                  'Descargar'
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileList;