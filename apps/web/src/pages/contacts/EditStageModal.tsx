import { useState } from 'react';
import type { Stage } from './types';
import styles from './EditStageModal.module.css';

type Props = {
  stage: Stage;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
  onMove: (direction: 'left' | 'right') => Promise<void>;
  onDelete: () => Promise<void>;
};

export function EditStageModal({ stage, canMoveLeft, canMoveRight, onClose, onSave, onMove, onDelete }: Props) {
  const [name, setName] = useState(stage.name);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await onSave(name.trim());
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`¿Borrar la etapa "${stage.name}"? Esto solo funciona si no tiene contactos adentro.`)) return;
    setSaving(true);
    setError(null);
    try {
      await onDelete();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo borrar');
      setSaving(false);
    }
  }

  async function handleMove(direction: 'left' | 'right') {
    setSaving(true);
    setError(null);
    try {
      await onMove(direction);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo mover');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Editar etapa</h2>

        {error && <div className={styles.error}>{error}</div>}

        <div>
          <label className={styles.label} htmlFor="stage-name">
            Nombre
          </label>
          <input
            id="stage-name"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.moveRow}>
          <button className={styles.moveButton} disabled={!canMoveLeft || saving} onClick={() => handleMove('left')}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              arrow_back
            </span>
            Mover a la izquierda
          </button>
          <button
            className={styles.moveButton}
            disabled={!canMoveRight || saving}
            onClick={() => handleMove('right')}
          >
            Mover a la derecha
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              arrow_forward
            </span>
          </button>
        </div>

        <div className={styles.actions}>
          <button className={styles.deleteButton} onClick={handleDelete} disabled={saving}>
            Borrar etapa
          </button>
          <div className={styles.rightActions}>
            <button className={styles.cancelButton} onClick={onClose}>
              Cancelar
            </button>
            <button className={styles.saveButton} onClick={handleSave} disabled={saving || !name.trim()}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
