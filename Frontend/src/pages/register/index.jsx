import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '@services/authService';
import styles from "./register.module.scss";


const RegisterForm = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(email, password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/AsyStorage/login');
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.authTitle}>Registro</h2>
        
        {error && <p className={styles.errorMessage}>{error}</p>}
        
        {success ? (
          <div className={styles.successMessage}>
            ¡Registro exitoso! Redirigiendo a login...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Contraseña:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.formInput}
                required
              />
            </div>
            <button type="submit" className={styles.submitButton}>
              Registrarse
            </button>
          </form>
        )}
        
        <div className={styles.switchText}>
          ¿Ya tienes cuenta?{' '}
          <button onClick={() => navigate('/AsyStorage/login')} className={styles.linkButton}>
            Inicia sesión aquí
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
