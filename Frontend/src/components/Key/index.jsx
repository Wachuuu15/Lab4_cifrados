import { useState } from 'react';
import { fileService } from '@services/fileService';
import classNames from 'classnames';
import styles from './Key.module.scss';

const KeyGenerator = ({ setHasKeys }) => {
  const [keyType, setKeyType] = useState('RSA');
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const { data: response } = await fileService.generateKeys(keyType);
  
      const privateKeyBlob = new Blob([response.privateKey], { type: 'text/plain' });
      const privateKeyUrl = URL.createObjectURL(privateKeyBlob);
      const privateKeyLink = document.createElement('a');
      privateKeyLink.href = privateKeyUrl;
      privateKeyLink.download = `private_key_${keyType}.pem`;
      privateKeyLink.click();
  
      setMessage({ text: 'Claves generadas exitosamente', type: 'success' });
      setHasKeys(true);
    } catch (error) {
      setMessage({ text: error.message || 'Error generando claves', type: 'error' });
    } finally {
      setIsGenerating(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Generar Claves</h3>
      
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Tipo de Clave:
          <select 
            value={keyType} 
            onChange={(e) => setKeyType(e.target.value)}
            className={styles.select}
            disabled={isGenerating}
          >
            <option value="RSA">RSA</option>
            <option value="ECC">ECC (Elliptic Curve)</option>
          </select>
        </label>
      </div>
      
      <button 
        onClick={handleGenerate} 
        disabled={isGenerating}
        className={classNames(styles.generateButton, {
          [styles.generating]: isGenerating
        })}
      >
        {isGenerating ? (
          <>
            <span className={styles.spinner}></span>
            Generando...
          </>
        ) : 'Generar Claves'}
      </button>
      
      <p className={styles.note}>
        <strong>Nota:</strong> La clave privada se descargará automáticamente. 
        Guárdala en un lugar seguro.
      </p>
      
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

export default KeyGenerator;