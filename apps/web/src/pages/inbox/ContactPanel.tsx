import type { ContactDetails } from './types';
import styles from './ContactPanel.module.css';

export function ContactPanel({ contact }: { contact: ContactDetails }) {
  const steps = 5;

  return (
    <aside className={styles.panel}>
      <div className={styles.headerSection}>
        <div className={styles.avatar}>
          {contact.name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </div>
        <h2 className={styles.name}>{contact.name}</h2>
        <p className={styles.role}>
          {contact.role} @ <span className={styles.roleCompany}>{contact.company}</span>
        </p>
      </div>

      <div className={styles.section}>
        <div className={styles.stageHeader}>
          <span className={styles.sectionLabel} style={{ marginBottom: 0 }}>
            Etapa de venta
          </span>
          <span className={styles.stageStep}>
            Paso {contact.pipelineStepIndex} de {steps}
          </span>
        </div>
        <div className={styles.stageBar}>
          {Array.from({ length: steps }).map((_, i) => (
            <div key={i} className={`${styles.stageSegment} ${i < contact.pipelineStepIndex ? styles.stageSegmentDone : ''}`} />
          ))}
        </div>
        <div className={styles.stageCurrent}>
          <span className={styles.stageName}>{contact.pipelineStage}</span>
          <span className={styles.dealValue}>{contact.dealValue}</span>
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Datos del contacto</span>
        <div className={styles.detailsList}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Teléfono:</span>
            <span className={styles.detailValueMono}>{contact.phone}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Email:</span>
            <span className={styles.detailValueLink}>{contact.email}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Empresa:</span>
            <span className={styles.detailValue}>
              {contact.company} ({contact.companySize})
            </span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Origen:</span>
            <span className={styles.sourceBadge}>{contact.source}</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Etiquetas</span>
        <div className={styles.tagsWrap}>
          {contact.tags.map((tag) => (
            <span key={tag} className={styles.tagPill}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.section} style={{ borderBottom: 'none' }}>
        <span className={styles.sectionLabel}>Nota interna</span>
        <div className={styles.note}>{contact.note}</div>
      </div>
    </aside>
  );
}
