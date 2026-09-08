import { NavLink } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import styles from './Sidebar.module.css';

const baseNavItems = [
  { to: '/inbox', icon: 'chat_bubble', label: 'Mensajes' },
  { to: '/contacts', icon: 'group', label: 'Contactos y Leads' },
  { to: '/pipeline', icon: 'view_kanban', label: 'Pipeline de ventas' },
  { to: '/analytics', icon: 'insights', label: 'Analíticas' },
  { to: '/automations', icon: 'schema', label: 'Automatizaciones' },
];

const adminNavItem = { to: '/team', icon: 'settings', label: 'Equipo' };

export function Sidebar() {
  const { user } = useAuth();
  const navItems = user?.role === 'ADMIN' ? [...baseNavItems, adminNavItem] : baseNavItems;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.topSection}>
        <div className={styles.logo}>
          <span className="material-symbols-outlined icon-lg">bolt</span>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.label}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <span className="material-symbols-outlined icon-md">{item.icon}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.agentAvatarWrapper}>
          <div className={styles.agentAvatar}>
            <span className="material-symbols-outlined icon-sm">support_agent</span>
          </div>
          <span className={styles.statusDot} />
        </div>
      </div>
    </aside>
  );
}
