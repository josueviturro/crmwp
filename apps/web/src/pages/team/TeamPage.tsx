import { useEffect, useState, type FormEvent } from 'react';
import { apiFetch, ApiError } from '../../lib/api';
import { useAuth } from '../../auth/AuthContext';
import type { Member, Role } from './types';
import styles from './TeamPage.module.css';

export function TeamPage() {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  async function loadMembers() {
    setLoading(true);
    try {
      const data = await apiFetch<Member[]>('/team');
      setMembers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo cargar el equipo');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMembers();
  }, []);

  async function handleRoleChange(memberId: string, role: Role) {
    try {
      await apiFetch(`/team/${memberId}/role`, { method: 'PATCH', body: JSON.stringify({ role }) });
      setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, role } : m)));
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'No se pudo cambiar el rol');
    }
  }

  async function handleRemove(memberId: string, name: string) {
    if (!confirm(`¿Eliminar a ${name} del equipo? Va a perder el acceso al CRM.`)) return;
    try {
      await apiFetch(`/team/${memberId}`, { method: 'DELETE' });
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'No se pudo eliminar');
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Equipo</h1>
          <p className={styles.subtitle}>Las personas que pueden gestionar este CRM.</p>
        </div>
        {isAdmin && (
          <button className={styles.inviteButton} onClick={() => setShowInvite(true)}>
            <span className="material-symbols-outlined icon-sm">person_add</span>
            Invitar miembro
          </button>
        )}
      </div>

      {loading && <p className={styles.subtitle}>Cargando equipo...</p>}
      {error && <div className={styles.error}>{error}</div>}

      {!loading && !error && (
        <div className={styles.list}>
          {members.map((member) => {
            const isMe = member.id === user?.id;
            return (
              <div key={member.id} className={styles.row}>
                <div className={styles.avatar}>
                  {member.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div className={styles.info}>
                  <div className={styles.nameRow}>
                    <span className={styles.name}>{member.name}</span>
                    {isMe && <span className={styles.youBadge}>VOS</span>}
                  </div>
                  <p className={styles.email}>{member.email}</p>
                </div>
                <div className={styles.actions}>
                  {isAdmin && !isMe ? (
                    <select
                      className={styles.roleSelect}
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value as Role)}
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="AGENT">Agente</option>
                    </select>
                  ) : (
                    <span className={styles.roleBadge}>{member.role === 'ADMIN' ? 'Admin' : 'Agente'}</span>
                  )}
                  {isAdmin && !isMe && (
                    <button
                      className={styles.removeButton}
                      title="Eliminar del equipo"
                      onClick={() => handleRemove(member.id, member.name)}
                    >
                      <span className="material-symbols-outlined icon-sm">delete</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showInvite && (
        <InviteModal
          onClose={() => setShowInvite(false)}
          onInvited={(member) => setMembers((prev) => [...prev, member])}
        />
      )}
    </div>
  );
}

type InviteResponse = { user: Member; temporaryPassword: string };

function InviteModal({ onClose, onInvited }: { onClose: () => void; onInvited: (member: Member) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('AGENT');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InviteResponse | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await apiFetch<InviteResponse>('/team/invite', {
        method: 'POST',
        body: JSON.stringify({ name, email, role }),
      });
      setResult(data);
      onInvited(data.user);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo invitar');
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    onClose();
  }

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {result ? (
          <div className={styles.successBox}>
            <h2 className={styles.modalTitle}>¡{result.user.name} fue invitado!</h2>
            <p className={styles.successText}>
              Pasale esta contraseña temporal para que pueda entrar. Se muestra <strong>una sola vez</strong>, después
              no se puede volver a ver.
            </p>
            <div className={styles.passwordBox}>
              <span>{result.temporaryPassword}</span>
              <button
                className={styles.copyButton}
                title="Copiar"
                onClick={() => navigator.clipboard.writeText(result.temporaryPassword)}
              >
                <span className="material-symbols-outlined icon-sm">content_copy</span>
              </button>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.submitButton} onClick={handleClose}>
                Listo
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className={styles.modalTitle}>Invitar miembro</h2>
            {error && <div className={styles.error}>{error}</div>}
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="member-name">
                  Nombre
                </label>
                <input
                  id="member-name"
                  required
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="member-email">
                  Email
                </label>
                <input
                  id="member-email"
                  type="email"
                  required
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="member-role">
                  Rol
                </label>
                <select
                  id="member-role"
                  className={styles.select}
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                >
                  <option value="AGENT">Agente</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelButton} onClick={handleClose}>
                  Cancelar
                </button>
                <button type="submit" className={styles.submitButton} disabled={loading}>
                  {loading ? 'Invitando...' : 'Invitar'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
