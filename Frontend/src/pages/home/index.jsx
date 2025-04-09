import { useState, useEffect } from 'react';
import { useAuth } from '@hooks/useAuth';
import { FileList, FileUpload, Key, Navbar} from '@components';

const HomePage = () => {
  const { user, logout } = useAuth();
  const [files, setFiles] = useState([]);
  const [hasKeys, setHasKeys] = useState(false);
  const [activeTab, setActiveTab] = useState('files');

  useEffect(() => {
    // verificar si el usuario ya tiene claves generadas
    // setHasKeys(response.data.hasKeys);
  }, []);

  return (
    <div className="home-container">
      <Navbar user={user} onLogout={logout} />
      
      <div className="tabs">
        <button 
          className={activeTab === 'files' ? 'active' : ''}
          onClick={() => setActiveTab('files')}
        >
          Archivos
        </button>
        <button 
          className={activeTab === 'keys' ? 'active' : ''}
          onClick={() => setActiveTab('keys')}
        >
          Claves
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'files' ? (
          <>
            <FileUpload hasKeys={hasKeys} />
            <FileList files={files} />
          </>
        ) : (
          <Key setHasKeys={setHasKeys} />
        )}
      </div>
    </div>
  );
};

export default HomePage;