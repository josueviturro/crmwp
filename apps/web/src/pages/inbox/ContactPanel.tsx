import { useEffect, useState, type CSSProperties } from 'react';
import { apiFetch, ApiError } from '../../lib/api';
import { getAvatarColorVar } from '../../lib/avatarColor';
import type { Contact, Stage } from '../contacts/types';
import type { Member } from '../team/types';
import styles from './ContactPanel.module.css';

type Props = {
  contact: Contact;
  onContactUpdate: (contact: Contact) => void;
};

export function ContactPanel({ contact, onContactUpdate }: Props) {
  const accentStyle = { '--accent': getAvatarColorVar(contact.id) } as CSSProperties;

  const [editing, setEditing] = useState(false);
  const [company, setCompany] = useState(contact.company ?? '');
  const [email, setEmail] = useState(contact.email ?? '');
  const [notes, setNotes] = useState(contact.notes ?? '');
  const [assignedToId, setAssignedToId] = useState(contact.assignedTo?.id ?? '');
  const [members, setMembers] = useState<Member[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [changingStage, setChangingStage] = useState(false);
  const [stageError, setStageError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Member[]>('/team')
      .then(setMembers)
      .catch(() => setMembers([]));
    apiFetch<Stage[]>('/stages')
      .then((data) => setStages([...data].sort((a, b) => a.order - b.order)))
      .catch(() => setStages([]));
  }, []);

  async function handleStageChange(stageId: string) {
    setChangingStage(true);
    setStageError(null);
    try {
      const updated = await apiFetch<Contact>(`/contacts/${contact.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ stageId }),
      });
      onContactUpdate({ ...updated, messages: contact.messages });
    } catch (err) {
      setStageError(err instanceof ApiError ? err.message : 'No se pudo cambiar la etapa');
    } finally {
      setChangingStage(false);
    }
  }

  useEffect(() => {
    setCompany(contact.company ?? '');
    setEmail(contact.email ?? '');
    setNotes(contact.notes ?? '');
    setAssignedToId(contact.assignedTo?.id ?? '');
    setEditing(false);
  }, [contact.id]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const updated = await apiFetch<Contact>(`/contacts/${contact.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          company: company.trim() || null,
          email: email.trim() || null,
          notes: notes.trim() || null,
          assignedToId: assignedToId || null,
        }),
      });
      onContactUpdate({ ...updated, messages: contact.messages });
      setEditing(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo guardar');
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setCompany(contact.company ?? '');
    setEmail(contact.email ?? '');
    setNotes(contact.notes ?? '');
    setAssignedToId(contact.assignedTo?.id ?? '');
    setError(null);
    setEditing(false);
  }

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
        {stageError && <div className={styles.error}>{stageError}</div>}
        <select
          className={styles.stageSelect}
          value={contact.stageId}
          disabled={changingStage || stages.length === 0}
          onChange={(e) => handleStageChange(e.target.value)}
        >
          {stages.map((stage) => (
            <option key={stage.id} value={stage.id}>
              {stage.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.section}>
        <div className={styles.editableHeader}>
          <span className={styles.sectionLabel} style={{ marginBottom: 0 }}>
            Datos del contacto
          </span>
          {!editing && (
            <button className={styles.editLink} onClick={() => setEditing(true)}>
              Editar
            </button>
          )}
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {editing ? (
          <div className={styles.form}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Teléfono</label>
              <span className={styles.detailValueMono}>{contact.phone}</span>
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="panel-email">
                Email
              </label>
              <input
                id="panel-email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Sin cargar"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="panel-company">
                Empresa
              </label>
              <input
                id="panel-company"
                className={styles.input}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Sin cargar"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="panel-assigned">
                Asignado a
              </label>
              <select
                id="panel-assigned"
                className={styles.input}
                value={assignedToId}
                onChange={(e) => setAssignedToId(e.target.value)}
              >
                <option value="">Sin asignar</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="panel-notes">
                Nota interna
              </label>
              <textarea
                id="panel-notes"
                className={styles.textarea}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Escribí una nota..."
              />
            </div>
            <div className={styles.formActions}>
              <button className={styles.cancelButton} onClick={handleCancel} disabled={saving}>
                Cancelar
              </button>
              <button className={styles.saveButton} onClick={handleSave} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        ) : (
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
        )}
      </div>

      {!editing && (
        <div className={styles.section} style={{ borderBottom: 'none' }}>
          <span className={styles.sectionLabel}>Nota interna</span>
          <div className={styles.note}>{contact.notes ?? 'Todavía no hay notas para este contacto.'}</div>
        </div>
      )}
    </aside>
  );
}
