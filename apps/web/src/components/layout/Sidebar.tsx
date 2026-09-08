import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

const navItems = [
  { to: '/inbox', icon: 'chat_bubble', label: 'Mensajes' },
  { to: '/contacts', icon: 'group', label: 'Contactos y Leads' },
  { to: '/pipeline', icon: 'view_kanban', label: 'Pipeline de ventas' },
  { to: '/analytics', icon: 'insights', label: 'Analíticas' },
  { to: '/automations', icon: 'schema', label: 'Automatizaciones' },
];

export function Sidebar() {
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
        <NavLink to="/settings" title="Configuración" className={styles.settingsLink}>
          <span className="material-symbols-outlined icon-md">settings</span>
        </NavLink>
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
