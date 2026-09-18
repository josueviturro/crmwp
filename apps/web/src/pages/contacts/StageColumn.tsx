import { useState, type DragEvent } from 'react';
import { ContactCard } from './ContactCard';
import type { Contact, Stage } from './types';
import styles from './StageColumn.module.css';

type Props = {
  stage: Stage;
  contacts: Contact[];
  draggingContactId: string | null;
  onDragStart: (e: DragEvent<HTMLDivElement>, contact: Contact) => void;
  onDragEnd: () => void;
  onDropOnStage: (stageId: string) => void;
  isAdmin: boolean;
  onEditStage: (stage: Stage) => void;
};

export function StageColumn({
  stage,
  contacts,
  draggingContactId,
  onDragStart,
  onDragEnd,
  onDropOnStage,
  isAdmin,
  onEditStage,
}: Props) {
  const [isOver, setIsOver] = useState(false);

  return (
    <div
      className={`${styles.column} ${isOver ? styles.columnOver : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={() => {
        setIsOver(false);
        onDropOnStage(stage.id);
      }}
    >
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.name}>{stage.name}</span>
          <span className={styles.count}>{contacts.length}</span>
        </div>
        {isAdmin && (
          <button className={styles.editButton} title="Editar etapa" onClick={() => onEditStage(stage)}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              more_horiz
            </span>
          </button>
        )}
      </div>
      <div className={styles.body}>
        {contacts.length === 0 && <p className={styles.empty}>Sin contactos en esta etapa</p>}
        {contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            isDragging={draggingContactId === contact.id}
          />
        ))}
      </div>
    </div>
  );
}
