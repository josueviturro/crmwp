import { useEffect, useState } from 'react';
import { apiFetch, ApiError } from '../../lib/api';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';
import { ContactPanel } from './ContactPanel';
import type { Contact, Message } from '../contacts/types';
import styles from './InboxPage.module.css';

export function InboxPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Contact[]>('/contacts')
      .then((data) => {
        setContacts(data);
        if (data.length > 0) {
          setSelectedId(data[0].id);
        }
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'No se pudieron cargar los contactos'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    apiFetch<Message[]>(`/contacts/${selectedId}/messages`)
      .then(setMessages)
      .catch(() => setMessages([]));
  }, [selectedId]);

  async function handleSendMessage(text: string) {
    if (!selectedId) return;
    const message = await apiFetch<Message>(`/contacts/${selectedId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    setMessages((prev) => [...prev, message]);
    setContacts((prev) => prev.map((c) => (c.id === selectedId ? { ...c, messages: [message] } : c)));
  }

  function handleContactUpdate(updated: Contact) {
    setContacts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }

  const selectedContact = contacts.find((c) => c.id === selectedId) ?? null;

  if (loading) {
    return <div className={styles.container} />;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.emptyText} style={{ margin: 'auto' }}>
          {error}
        </p>
      </div>
    );
  }

  if (contacts.length === 0 || !selectedContact) {
    return (
      <div className={styles.container}>
        <p className={styles.emptyText} style={{ margin: 'auto' }}>
          Todavía no hay contactos. Andá a Contactos y Leads para crear el primero.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ConversationList contacts={contacts} selectedId={selectedId} onSelect={setSelectedId} />
      <ChatWindow contact={selectedContact} messages={messages} onSendMessage={handleSendMessage} />
      <ContactPanel contact={selectedContact} onContactUpdate={handleContactUpdate} />
    </div>
  );
}
