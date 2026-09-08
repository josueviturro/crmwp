import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import styles from './TopHeader.module.css';

export function TopHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <span className={styles.title}>Pulse CRM</span>
        <span className={styles.badge}>DEV</span>
      </div>
      <div className={styles.right}>
        {user && <span className={styles.userName}>{user.name}</span>}
        <button className={styles.logoutButton} title="Cerrar sesión" onClick={handleLogout}>
          <span className="material-symbols-outlined icon-sm">logout</span>
        </button>
        <div className={styles.avatar}>
          <span className="material-symbols-outlined icon-sm">person</span>
        </div>
      </div>
    </header>
  );
}
