import type { CSSProperties, DragEvent } from 'react';
import { getAvatarColorVar } from '../../lib/avatarColor';
import type { Contact } from './types';
import styles from './ContactCard.module.css';

function initialsOf(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

type Props = {
  contact: Contact;
  onDragStart: (e: DragEvent<HTMLDivElement>, contact: Contact) => void;
  onDragEnd: () => void;
  isDragging: boolean;
};

export function ContactCard({ contact, onDragStart, onDragEnd, isDragging }: Props) {
  const cardStyle = { '--accent': getAvatarColorVar(contact.id) } as CSSProperties;

  return (
    <div
      className={`${styles.card} ${isDragging ? styles.dragging : ''}`}
      style={cardStyle}
      draggable
      onDragStart={(e) => onDragStart(e, contact)}
      onDragEnd={onDragEnd}
    >
      <div className={styles.topRow}>
        <div className={styles.avatar}>{initialsOf(contact.name)}</div>
        <div className={styles.nameBlock}>
          <span className={styles.name}>{contact.name}</span>
          {contact.company && <span className={styles.company}>{contact.company}</span>}
        </div>
      </div>
      <div className={styles.footer}>
        <span className={styles.phone}>{contact.phone}</span>
        {contact.assignedTo && (
          <div
            className={styles.assignee}
            style={{ '--assignee-accent': getAvatarColorVar(contact.assignedTo.id) } as CSSProperties}
            title={`Asignado a ${contact.assignedTo.name}`}
          >
            {initialsOf(contact.assignedTo.name)}
          </div>
        )}
      </div>
    </div>
  );
}
