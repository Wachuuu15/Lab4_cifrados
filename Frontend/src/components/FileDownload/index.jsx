import { useState, useEffect } from 'react';
import { fileService } from '@services/fileService';
import classNames from 'classnames';
import styles from './FileDownload.module.scss';

const FileDownload = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState({});
  const [downloadProgress, setDownloadProgress] = useState({});

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const data = await fileService.getFiles();
        setFiles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleDownload = async (fileId, verify = false) => {
    try {
      setDownloadProgress(prev => ({ ...prev, [fileId]: 0 }));
      
      if (verify) {
        const verificationResult = await fileService.verify(fileId);
        setVerificationStatus(prev => ({
          ...prev,
          [fileId]: verificationResult.valid ? '✓ Firma válida' : '✗ Firma inválida'
        }));
        
        if (!verificationResult.valid) {
          return;
        }
      }

      const progressCallback = (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );
        setDownloadProgress(prev => ({ ...prev, [fileId]: percentCompleted }));
      };

      await fileService.download(fileId, verify, progressCallback);
      
    } catch (err) {
      setError(`Error al descargar: ${err.message}`);
    } finally {
      setTimeout(() => {
        setDownloadProgress(prev => ({ ...prev, [fileId]: undefined }));
        setVerificationStatus(prev => ({ ...prev, [fileId]: undefined }));
      }, 3000);
    }
  };

  if (loading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p>Cargando lista de archivos...</p>
    </div>
  );

  if (error) return (
    <div className={styles.errorContainer}>
      <p className={styles.errorMessage}>Error: {error}</p>
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
      <h2 className={styles.title}>Archivos Disponibles</h2>
      
      {files.length === 0 ? (
        <p className={styles.emptyMessage}>No hay archivos disponibles para descargar.</p>
      ) : (
        <ul className={styles.fileList}>
          {files.map(file => (
            <li key={file.id} className={styles.fileItem}>
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileMeta}>
                  <span className={styles.fileDate}>
                    {new Date(file.uploadDate).toLocaleDateString()}
                  </span>
                  <span className={styles.fileSize}>
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </span>
              </div>
              
              <div className={styles.fileActions}>
                {downloadProgress[file.id] !== undefined ? (
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{ width: `${downloadProgress[file.id]}%` }}
                    ></div>
                    <span className={styles.progressText}>{downloadProgress[file.id]}%</span>
                  </div>
                ) : (
                  <>
                    <button 
                      className={classNames(styles.button, styles.downloadButton)}
                      onClick={() => handleDownload(file.id)}
                    >
                      Descargar
                    </button>
                    
                    {file.signed && (
                      <button
                        className={classNames(styles.button, styles.verifyButton)}
                        onClick={() => handleDownload(file.id, true)}
                      >
                        Verificar y Descargar
                      </button>
                    )}
                  </>
                )}
                
                {verificationStatus[file.id] && (
                  <span className={classNames(styles.verificationStatus, {
                    [styles.valid]: verificationStatus[file.id].includes('✓'),
                    [styles.invalid]: verificationStatus[file.id].includes('✗')
                  })}>
                    {verificationStatus[file.id]}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileDownload;