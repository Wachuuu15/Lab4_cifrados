import { useState } from 'react';
import { generateKeys } from '../../services/fileService';

const KeyGenerator = ({ setHasKeys }) => {
  const [keyType, setKeyType] = useState('RSA');
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const keys = await generateKeys(keyType);
      
      // descarga la clave privada
      const privateKeyBlob = new Blob([keys.privateKey], { type: 'text/plain' });
      const privateKeyUrl = URL.createObjectURL(privateKeyBlob);
      const privateKeyLink = document.createElement('a');
      privateKeyLink.href = privateKeyUrl;
      privateKeyLink.download = `private_key_${keyType}.pem`;
      privateKeyLink.click();
      
      setMessage({ text: 'Claves generadas exitosamente', type: 'success' });
      setHasKeys(true);
    } catch (error) {
      setMessage({ text: 'Error generando claves', type: 'error' });
    } finally {
      setIsGenerating(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  return (
    <div className="key-generator">
      <h3>Generar Claves</h3>
      <div>
        <label>
          Tipo de Clave:
          <select value={keyType} onChange={(e) => setKeyType(e.target.value)}>
            <option value="RSA">RSA</option>
            <option value="ECC">ECC (Elliptic Curve)</option>
          </select>
        </label>
      </div>
      <button onClick={handleGenerate} disabled={isGenerating}>
        {isGenerating ? 'Generando...' : 'Generar Claves'}
      </button>
      <p className="note">
        Nota: La clave privada se descargará automáticamente. Guárdala en un lugar seguro.
      </p>
      {message.text && (
        <p className={`message ${message.type}`}>{message.text}</p>
      )}
    </div>
  );
};

export default KeyGenerator;