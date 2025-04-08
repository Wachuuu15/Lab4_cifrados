import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/authService';

const RegisterForm = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
      setSuccess(true);
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } catch (err) {
      setError('Error en el registro. Intenta nuevamente.');
    }
  };

  return (
    <div className="auth-form">
      <h2>Registro</h2>
      {error && <p className="error">{error}</p>}
      {success ? (
        <p className="success">¡Registro exitoso! Redirigiendo a login...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Registrarse</button>
        </form>
      )}
      <p>
        ¿Ya tienes cuenta?{' '}
        <button onClick={onSwitchToLogin} className="link-button">
          Inicia sesión aquí
        </button>
      </p>
    </div>
  );
};

export default RegisterForm;