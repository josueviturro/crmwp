import type { CSSProperties } from 'react';
import { getAvatarColorVar } from '../../lib/avatarColor';
import type { Contact } from '../contacts/types';
import styles from './ContactPanel.module.css';

export function ContactPanel({ contact }: { contact: Contact }) {
  const accentStyle = { '--accent': getAvatarColorVar(contact.id) } as CSSProperties;

  return (
    <aside className={styles.panel}>
      <div className={styles.headerSection}>
        <div className={styles.avatar} style={accentStyle}>
          {contact.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()}
        </div>
        <h2 className={styles.name}>{contact.name}</h2>
        {contact.company && <p className={styles.role}>{contact.company}</p>}
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Etapa de venta</span>
        <div className={styles.stageCurrent}>
          <span className={styles.stageName}>{contact.stage.name}</span>
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Datos del contacto</span>
        <div className={styles.detailsList}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Teléfono:</span>
            <span className={styles.detailValueMono}>{contact.phone}</span>
          </div>
          {contact.email && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Email:</span>
              <span className={styles.detailValueLink}>{contact.email}</span>
            </div>
          )}
          {contact.company && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Empresa:</span>
              <span className={styles.detailValue}>{contact.company}</span>
            </div>
          )}
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Asignado a:</span>
            <span className={styles.detailValue}>{contact.assignedTo?.name ?? 'Sin asignar'}</span>
          </div>
        </div>
      </div>

      <div className={styles.section} style={{ borderBottom: 'none' }}>
        <span className={styles.sectionLabel}>Nota interna</span>
        <div className={styles.note}>{contact.notes ?? 'Todavía no hay notas para este contacto.'}</div>
      </div>
    </aside>
  );
}
