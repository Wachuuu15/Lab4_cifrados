import { useState, useEffect } from 'react';
import { FileList, FileUpload, FileVerifier, Keys, Navbar} from '@components';
import api from '@services/api';
import useAuth from '@hooks/useAuth';
import styles from "./home.module.scss";

const HomePage = () => {
  const { user, logout } = useAuth();
  const [files, setFiles] = useState([]);
  const [hasKeys, setHasKeys] = useState(false);
  const [activeTab, setActiveTab] = useState('files');

  useEffect(() => {
    // Verificar si el usuario ya tiene claves generadas
    const fetchPublicKey = async () => {
      if (user) {
        try {
          const { data } = await api.get(`/auth/getPublicKey/${user.userEmail}`);
          setHasKeys(!!data.llavepublica);
        } catch (error) {
          console.error('Error al obtener la llave pública:', error);
        }
      }
    };

    fetchPublicKey();
  }, [user]);

  return (
    <div className={styles.homeContainer}>
      <Navbar user={user} onLogout={logout} />
      
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'files' ? styles.active : ''}`}
            onClick={() => setActiveTab('files')}
          >
            Archivos
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'keys' ? styles.active : ''}`}
            onClick={() => setActiveTab('keys')}
          >
            Claves
          </button>
          <div className={`${styles.tabIndicator} ${activeTab === 'keys' ? styles.right : ''}`} />
        </div>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'files' ? (
          <div className={styles.filesSection}>
            <FileUpload hasKeys={hasKeys} />
            <FileList files={files} />
            <FileVerifier hasKeys={hasKeys} />
          </div>
        ) : (
          <div className={styles.keysSection}>
            <Keys setHasKeys={setHasKeys} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
