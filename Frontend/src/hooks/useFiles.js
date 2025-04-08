import { useState, useEffect } from 'react';
import { getFiles as fetchFiles } from '../services/fileService';

const useFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getFiles = async () => {
    try {
      setLoading(true);
      const data = await fetchFiles();
      setFiles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFiles();
  }, []);

  return { files, loading, error, refreshFiles: getFiles };
};

export default useFiles;