import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { apiFetch, ApiError } from '../../lib/api';
import { getAvatarColorVar } from '../../lib/avatarColor';
import { StageBarChart } from './StageBarChart';
import type { Contact, Stage } from '../contacts/types';
import styles from './PipelinePage.module.css';

const STALE_DAYS_THRESHOLD = 3;

function initialsOf(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function PipelinePage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([apiFetch<Contact[]>('/contacts'), apiFetch<Stage[]>('/stages')])
      .then(([contactsData, stagesData]) => {
        setContacts(contactsData);
        setStages([...stagesData].sort((a, b) => a.order - b.order));
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'No se pudo cargar el pipeline'))
      .finally(() => setLoading(false));
  }, []);

  const chartData = useMemo(
    () =>
      stages.map((stage) => ({
        stageId: stage.id,
        stageName: stage.name,
        count: contacts.filter((c) => c.stageId === stage.id).length,
      })),
    [stages, contacts],
  );

  const busiestStage = useMemo(() => {
    if (chartData.length === 0) return null;
    return chartData.reduce((max, d) => (d.count > max.count ? d : max), chartData[0]);
  }, [chartData]);

  const staleContacts = useMemo(() => {
    const now = Date.now();
    return contacts
      .map((c) => ({
        contact: c,
        daysSince: Math.floor((now - new Date(c.updatedAt).getTime()) / (1000 * 60 * 60 * 24)),
      }))
      .filter((c) => c.daysSince >= STALE_DAYS_THRESHOLD)
      .sort((a, b) => b.daysSince - a.daysSince);
  }, [contacts]);

  if (loading) {
    return <div className={styles.page} />;
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Pipeline de ventas</h1>
      <p className={styles.subtitle}>Cómo se reparten tus contactos entre etapas, y quiénes necesitan seguimiento.</p>

      {error && <div className={styles.error}>{error}</div>}

      {!error && (
        <>
          <div className={styles.statsRow}>
            <div className={styles.statCard} style={{ '--stat-color': 'var(--color-primary)' } as CSSProperties}>
              <div className={styles.statIcon}>
                <span className="material-symbols-outlined icon-md">groups</span>
              </div>
              <div className={styles.statText}>
                <span className={styles.statValue}>{contacts.length}</span>
                <span className={styles.statLabel}>Total contactos</span>
              </div>
            </div>
            <div className={styles.statCard} style={{ '--stat-color': 'var(--color-info)' } as CSSProperties}>
              <div className={styles.statIcon}>
                <span className="material-symbols-outlined icon-md">bar_chart</span>
              </div>
              <div className={styles.statText}>
                <span className={styles.statValue}>{busiestStage?.stageName ?? '—'}</span>
                <span className={styles.statLabel}>Etapa con más contactos</span>
              </div>
            </div>
            <div className={styles.statCard} style={{ '--stat-color': 'var(--color-warning)' } as CSSProperties}>
              <div className={styles.statIcon}>
                <span className="material-symbols-outlined icon-md">schedule</span>
              </div>
              <div className={styles.statText}>
                <span className={styles.statValue}>{staleContacts.length}</span>
                <span className={styles.statLabel}>Necesitan seguimiento</span>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Contactos por etapa</h2>
            </div>
            {chartData.length === 0 ? (
              <p className={styles.emptyState}>Todavía no hay etapas configuradas.</p>
            ) : (
              <div className={styles.chartCard}>
                <StageBarChart data={chartData} />
              </div>
            )}
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Necesitan seguimiento</h2>
              <span className={styles.sectionHint}>Sin cambios hace {STALE_DAYS_THRESHOLD}+ días</span>
            </div>
            {staleContacts.length === 0 ? (
              <p className={styles.emptyState}>Ningún contacto lleva tanto tiempo sin actividad. Buen trabajo.</p>
            ) : (
              <div className={styles.followUpList}>
                {staleContacts.map(({ contact, daysSince }) => (
                  <div key={contact.id} className={styles.followUpRow}>
                    <div
                      className={styles.avatar}
                      style={{ '--accent': getAvatarColorVar(contact.id) } as CSSProperties}
                    >
                      {initialsOf(contact.name)}
                    </div>
                    <div className={styles.followUpBody}>
                      <span className={styles.followUpName}>{contact.name}</span>
                      {contact.company && <span className={styles.followUpCompany}>{contact.company}</span>}
                    </div>
                    <span className={styles.followUpStage}>{contact.stage.name}</span>
                    <span className={styles.followUpDays}>hace {daysSince} días</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
