import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '@services/authService';
import styles from "./login.module.scss";


const LoginForm = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await login(email, password);
      localStorage.setItem('token', token);
      navigate('/AsyStorage');
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.authTitle}>Iniciar Sesión</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
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
            Iniciar Sesión
          </button>
        </form>
        <div className={styles.switchText}>
          ¿No tienes cuenta?{' '}
          <button onClick={() => navigate('/AsyStorage/register')} className={styles.linkButton}>
            Regístrate aquí
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;