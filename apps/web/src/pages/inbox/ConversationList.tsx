import type { CSSProperties } from 'react';
import { getAvatarColorVar } from '../../lib/avatarColor';
import type { Contact } from '../contacts/types';
import styles from './ConversationList.module.css';

function initialsOf(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function formatTime(dateString: string) {
  const date = new Date(dateString);
  const isToday = date.toDateString() === new Date().toDateString();
  if (isToday) {
    return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
}

type Props = {
  contacts: Contact[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function ConversationList({ contacts, selectedId, onSelect }: Props) {
  const sorted = [...contacts].sort((a, b) => {
    const aTime = a.messages[0]?.createdAt ?? a.createdAt;
    const bTime = b.messages[0]?.createdAt ?? b.createdAt;
    return new Date(bTime).getTime() - new Date(aTime).getTime();
  });

  return (
    <aside className={styles.list}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerTitleGroup}>
            <h1 className={styles.title}>Mensajes</h1>
            <span className={styles.countBadge}>{contacts.length} activos</span>
          </div>
        </div>

        <div className={styles.searchWrapper}>
          <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
          <input
            className={styles.searchInput}
            placeholder="Buscar por cliente, empresa o etiqueta..."
            type="text"
          />
        </div>
      </div>

      <div className={styles.items}>
        {sorted.length === 0 && (
          <p className={styles.preview} style={{ padding: '0 0.5rem' }}>
            Todavía no hay contactos. Cargalos desde la vista de Contactos y Leads.
          </p>
        )}
        {sorted.map((contact) => {
          const isActive = contact.id === selectedId;
          const lastMessage = contact.messages[0];
          const accentStyle = { '--accent': getAvatarColorVar(contact.id) } as CSSProperties;

          return (
            <button
              key={contact.id}
              onClick={() => onSelect(contact.id)}
              className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
            >
              <div className={styles.avatarWrapper}>
                <div className={styles.avatar} style={accentStyle}>
                  {initialsOf(contact.name)}
                </div>
              </div>

              <div className={styles.body}>
                <div className={styles.rowTop}>
                  <span className={styles.name}>{contact.name}</span>
                  {lastMessage && <span className={styles.time}>{formatTime(lastMessage.createdAt)}</span>}
                </div>
                <div className={styles.rowMeta}>
                  {contact.company && <span className={styles.company}>{contact.company}</span>}
                  <span className={`${styles.tag} ${styles.tagNeutral}`}>{contact.stage.name}</span>
                </div>
                <div className={styles.rowBottom}>
                  <p className={styles.preview}>{lastMessage ? lastMessage.text : 'Sin mensajes todavía'}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
