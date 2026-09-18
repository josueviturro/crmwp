import { useState } from 'react';
import styles from './AddStageColumn.module.css';

export function AddStageColumn({ onCreate }: { onCreate: (name: string) => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onCreate(name.trim());
      setName('');
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.column}>
      {editing ? (
        <div className={styles.form}>
          <input
            autoFocus
            className={styles.input}
            placeholder="Nombre de la etapa"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <div className={styles.actions}>
            <button className={styles.cancelButton} onClick={() => setEditing(false)}>
              Cancelar
            </button>
            <button className={styles.saveButton} onClick={handleCreate} disabled={saving || !name.trim()}>
              Crear
            </button>
          </div>
        </div>
      ) : (
        <button className={styles.trigger} onClick={() => setEditing(true)}>
          <span className="material-symbols-outlined icon-sm">add</span>
          Nueva etapa
        </button>
      )}
    </div>
  );
}
