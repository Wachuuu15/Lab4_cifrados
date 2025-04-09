import { useState, useEffect } from 'react';
import { fileService } from '@services/fileService';


const FileList = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const loadFiles = async () => {
        try {
          const data = await fileService.getFiles();
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
        await fileService.download(fileId);
      } catch (err) {
        alert(`Error al descargar: ${err.message}`);
      }
    };
  
    if (loading) return <div>Cargando archivos...</div>;
    if (error) return <div>Error: {error}</div>;
  
    return (
      <div>
        <h2>Mis Archivos</h2>
        <ul>
          {files.map(file => (
            <li key={file.id}>
              {file.name}
              <button onClick={() => handleDownload(file.id)}>
                Descargar
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
export default FileList;
  