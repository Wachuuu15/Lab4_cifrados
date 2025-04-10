import { useState, useEffect } from 'react';
import { fileService } from '@services/fileService';

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
          return; // No descargar si la verificación falla
        }
      }

      // Configurar el progreso de descarga
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
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Cargando lista de archivos...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <p>Error: {error}</p>
      <button onClick={() => window.location.reload()}>Reintentar</button>
    </div>
  );

  return (
    <div className="file-download-container">
      <h2 className="section-title">Archivos Disponibles</h2>
      
      {files.length === 0 ? (
        <p className="empty-message">No hay archivos disponibles para descargar.</p>
      ) : (
        <ul className="file-list">
          {files.map(file => (
            <li key={file.id} className="file-item">
              <div className="file-info">
                <span className="file-name">{file.name}</span>
                <span className="file-date">
                  {new Date(file.uploadDate).toLocaleDateString()}
                </span>
                <span className="file-size">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
              
              <div className="file-actions">
                {downloadProgress[file.id] !== undefined ? (
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${downloadProgress[file.id]}%` }}
                    ></div>
                    <span>{downloadProgress[file.id]}%</span>
                  </div>
                ) : (
                  <>
                    <button 
                      className="download-btn"
                      onClick={() => handleDownload(file.id)}
                    >
                      Descargar
                    </button>
                    
                    {file.signed && (
                      <button
                        className="verify-btn"
                        onClick={() => handleDownload(file.id, true)}
                      >
                        Verificar y Descargar
                      </button>
                    )}
                  </>
                )}
                
                {verificationStatus[file.id] && (
                  <span className={`verification-status ${
                    verificationStatus[file.id].includes('✓') ? 'valid' : 'invalid'
                  }`}>
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