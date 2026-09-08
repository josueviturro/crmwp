import type { Conversation } from './types';
import styles from './ConversationList.module.css';

const statusDotClass: Record<Conversation['status'], string> = {
  online: styles.statusOnline,
  away: styles.statusAway,
  offline: '',
};

const tagClass: Record<NonNullable<Conversation['tag']>['tone'], string> = {
  primary: styles.tagPrimary,
  warning: styles.tagWarning,
  info: styles.tagInfo,
  neutral: styles.tagNeutral,
};

type Props = {
  conversations: Conversation[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function ConversationList({ conversations, selectedId, onSelect }: Props) {
  return (
    <aside className={styles.list}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerTitleGroup}>
            <h1 className={styles.title}>Mensajes</h1>
            <span className={styles.countBadge}>{conversations.length} activos</span>
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
        {conversations.map((conversation) => {
          const isActive = conversation.id === selectedId;
          return (
            <button
              key={conversation.id}
              onClick={() => onSelect(conversation.id)}
              className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
            >
              <div className={styles.avatarWrapper}>
                <div className={styles.avatar}>{conversation.initials}</div>
                {conversation.status !== 'offline' && (
                  <span className={`${styles.statusDot} ${statusDotClass[conversation.status]}`} />
                )}
              </div>

              <div className={styles.body}>
                <div className={styles.rowTop}>
                  <span className={styles.name}>{conversation.name}</span>
                  <span className={styles.time}>{conversation.time}</span>
                </div>
                <div className={styles.rowMeta}>
                  <span className={styles.company}>{conversation.company}</span>
                  {conversation.tag && (
                    <span className={`${styles.tag} ${tagClass[conversation.tag.tone]}`}>
                      {conversation.tag.label}
                    </span>
                  )}
                </div>
                <div className={styles.rowBottom}>
                  <p className={styles.preview}>{conversation.lastMessage}</p>
                  {conversation.unreadCount && <span className={styles.unreadBadge}>{conversation.unreadCount}</span>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
