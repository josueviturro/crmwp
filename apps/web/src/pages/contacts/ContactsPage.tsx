import { useEffect, useState, type DragEvent } from 'react';
import { apiFetch, ApiError } from '../../lib/api';
import { useAuth } from '../../auth/AuthContext';
import { StageColumn } from './StageColumn';
import { AddStageColumn } from './AddStageColumn';
import { EditStageModal } from './EditStageModal';
import type { Contact, Stage } from './types';
import styles from './ContactsPage.module.css';

export function ContactsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [stages, setStages] = useState<Stage[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draggingContactId, setDraggingContactId] = useState<string | null>(null);
  const [editingStage, setEditingStage] = useState<Stage | null>(null);

  async function loadData() {
    setLoading(true);
    try {
      const [stagesData, contactsData] = await Promise.all([
        apiFetch<Stage[]>('/stages'),
        apiFetch<Contact[]>('/contacts'),
      ]);
      setStages(stagesData);
      setContacts(contactsData);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo cargar Contactos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleDragStart(e: DragEvent<HTMLDivElement>, contact: Contact) {
    setDraggingContactId(contact.id);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragEnd() {
    setDraggingContactId(null);
  }

  async function handleDropOnStage(stageId: string) {
    const contactId = draggingContactId;
    setDraggingContactId(null);
    if (!contactId) return;

    const contact = contacts.find((c) => c.id === contactId);
    if (!contact || contact.stageId === stageId) return;

    const previousStageId = contact.stageId;
    setContacts((prev) => prev.map((c) => (c.id === contactId ? { ...c, stageId } : c)));

    try {
      await apiFetch(`/contacts/${contactId}`, { method: 'PATCH', body: JSON.stringify({ stageId }) });
    } catch (err) {
      setContacts((prev) => prev.map((c) => (c.id === contactId ? { ...c, stageId: previousStageId } : c)));
      alert(err instanceof ApiError ? err.message : 'No se pudo mover el contacto');
    }
  }

  async function handleCreateStage(name: string) {
    const stage = await apiFetch<Stage>('/stages', { method: 'POST', body: JSON.stringify({ name }) });
    setStages((prev) => [...prev, stage]);
  }

  async function handleSaveStage(stageId: string, name: string) {
    const updated = await apiFetch<Stage>(`/stages/${stageId}`, { method: 'PATCH', body: JSON.stringify({ name }) });
    setStages((prev) => prev.map((s) => (s.id === stageId ? updated : s)));
  }

  async function handleDeleteStage(stageId: string) {
    await apiFetch(`/stages/${stageId}`, { method: 'DELETE' });
    setStages((prev) => prev.filter((s) => s.id !== stageId));
  }

  async function handleMoveStage(stageId: string, direction: 'left' | 'right') {
    const sorted = [...stages].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((s) => s.id === stageId);
    const swapIndex = direction === 'left' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= sorted.length) return;

    const orderedIds = sorted.map((s) => s.id);
    [orderedIds[index], orderedIds[swapIndex]] = [orderedIds[swapIndex], orderedIds[index]];

    const updated = await apiFetch<Stage[]>('/stages/reorder', {
      method: 'PATCH',
      body: JSON.stringify({ orderedIds }),
    });
    setStages(updated);
    setEditingStage((prev) => (prev ? (updated.find((s) => s.id === prev.id) ?? null) : null));
  }

  const sortedStages = [...stages].sort((a, b) => a.order - b.order);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Contactos y Leads</h1>
          <p className={styles.subtitle}>Arrastrá una tarjeta entre columnas para cambiarla de etapa.</p>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {!loading && !error && sortedStages.length === 0 && (
        <p className={styles.emptyState}>
          Todavía no hay etapas configuradas{isAdmin ? ' — creá la primera con el botón "Nueva etapa".' : '.'}
        </p>
      )}

      {!loading && (
        <div className={styles.board}>
          {sortedStages.map((stage) => (
            <StageColumn
              key={stage.id}
              stage={stage}
              contacts={contacts.filter((c) => c.stageId === stage.id)}
              draggingContactId={draggingContactId}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDropOnStage={handleDropOnStage}
              isAdmin={isAdmin}
              onEditStage={setEditingStage}
            />
          ))}
          {isAdmin && <AddStageColumn onCreate={handleCreateStage} />}
        </div>
      )}

      {editingStage && (
        <EditStageModal
          stage={editingStage}
          canMoveLeft={sortedStages.findIndex((s) => s.id === editingStage.id) > 0}
          canMoveRight={sortedStages.findIndex((s) => s.id === editingStage.id) < sortedStages.length - 1}
          onClose={() => setEditingStage(null)}
          onSave={(name) => handleSaveStage(editingStage.id, name)}
          onMove={(direction) => handleMoveStage(editingStage.id, direction)}
          onDelete={() => handleDeleteStage(editingStage.id)}
        />
      )}
    </div>
  );
}
