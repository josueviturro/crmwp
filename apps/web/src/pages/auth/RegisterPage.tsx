import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch, ApiError } from '../../lib/api';
import { useAuth } from '../../auth/AuthContext';
import styles from './AuthLayout.module.css';

type RegisterResponse = {
  accessToken: string;
  user: { id: string; email: string; name: string };
};

export function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await apiFetch<RegisterResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ businessName, name, email, password }),
      });
      login(data.accessToken);
      navigate('/inbox');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo crear la cuenta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className="material-symbols-outlined icon-lg">bolt</span>
        </div>
        <h1 className={styles.title}>Registrá tu negocio</h1>
        <p className={styles.subtitle}>Creá tu cuenta y empezá a usar el CRM</p>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="businessName">
              Nombre del negocio
            </label>
            <input
              id="businessName"
              required
              className={styles.input}
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">
              Tu nombre
            </label>
            <input id="name" required className={styles.input} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <div className={styles.footer}>
          ¿Ya tenés cuenta?{' '}
          <Link className={styles.footerLink} to="/login">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
