import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';

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
      navigate('/home');
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="auth-form">
      <h2>Iniciar Sesión</h2>
      {error && <p className="error">{error}</p>}
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
        <button type="submit">Iniciar Sesión</button>
      </form>
      <p>
        ¿No tienes cuenta?{' '}
        <button onClick={onSwitchToRegister} className="link-button">
          Regístrate aquí
        </button>
      </p>
    </div>
  );
};

export default LoginForm;