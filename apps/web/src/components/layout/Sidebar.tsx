import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/inbox', icon: 'chat_bubble', label: 'Mensajes' },
  { to: '/contacts', icon: 'group', label: 'Contactos y Leads' },
  { to: '/pipeline', icon: 'view_kanban', label: 'Pipeline de ventas' },
  { to: '/analytics', icon: 'insights', label: 'Analíticas' },
  { to: '/automations', icon: 'schema', label: 'Automatizaciones' },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-16 bg-surface-container-lowest z-50 flex flex-col items-center justify-between py-space-md border-r border-outline-variant/30">
      <div className="flex flex-col items-center gap-space-lg w-full">
        <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
          <span className="material-symbols-outlined text-[22px]">bolt</span>
        </div>

        <nav className="flex flex-col items-center gap-space-xs w-full">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.label}
              className={({ isActive }) =>
                `relative w-full h-11 flex items-center justify-center transition-colors ${
                  isActive
                    ? 'bg-secondary-container text-secondary border-l-2 border-primary'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex flex-col items-center gap-space-md w-full">
        <NavLink
          to="/settings"
          title="Configuración"
          className="w-full h-11 flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
        </NavLink>
        <div className="relative pt-space-xs">
          <div className="w-9 h-9 rounded-full bg-surface-container-high border border-outline-variant/40 flex items-center justify-center text-on-surface">
            <span className="material-symbols-outlined text-[18px]">support_agent</span>
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-surface-container-lowest" />
        </div>
      </div>
    </aside>
  );
}
