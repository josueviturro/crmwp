import { useState, type CSSProperties } from 'react';
import { getAvatarColorVar } from '../../lib/avatarColor';
import type { Contact, Message } from '../contacts/types';
import styles from './ChatWindow.module.css';

function initialsOf(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}

type Props = {
  contact: Contact;
  messages: Message[];
  onSendMessage: (text: string) => Promise<void>;
};

export function ChatWindow({ contact, messages, onSendMessage }: Props) {
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const accentStyle = { '--accent': getAvatarColorVar(contact.id) } as CSSProperties;

  async function handleSend() {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      await onSendMessage(text);
      setDraft('');
    } finally {
      setSending(false);
    }
  }

  return (
    <section className={styles.chat}>
      <header className={styles.header}>
        <div className={styles.headerInfo}>
          <div className={styles.avatar} style={accentStyle}>
            {initialsOf(contact.name)}
          </div>
          <div>
            <span className={styles.headerName}>{contact.name}</span>
            <div className={styles.headerMeta}>
              <span>{contact.stage.name}</span>
              {contact.company && (
                <>
                  <span>•</span>
                  <span>{contact.company}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className={styles.messages}>
        {messages.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--color-on-surface-variant)', fontSize: 13 }}>
            Todavía no hay mensajes con este contacto.
          </p>
        )}
        {messages.map((message) => {
          const isAgent = message.direction === 'OUTBOUND';
          return (
            <div
              key={message.id}
              className={`${styles.messageGroup} ${isAgent ? styles.messageGroupAgent : styles.messageGroupCustomer}`}
            >
              <div className={`${styles.messageAuthor} ${isAgent ? styles.authorAgent : styles.authorCustomer}`}>
                {isAgent ? (message.sentBy?.name ?? 'Vos') : contact.name}
              </div>
              <div className={`${styles.bubble} ${isAgent ? styles.bubbleAgent : styles.bubbleCustomer}`}>
                <p className={styles.bubbleText}>{message.text}</p>
                <div className={styles.bubbleTime}>
                  <span>{formatTime(message.createdAt)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.composer}>
        <div className={styles.composerInner}>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className={`${styles.textarea} scrollbar-none`}
            placeholder="Escribí un mensaje..."
            rows={1}
          />
          <button className={styles.sendButton} title="Enviar mensaje" onClick={handleSend} disabled={sending}>
            <span className="material-symbols-outlined icon-md">send</span>
          </button>
        </div>
      </div>
    </section>
  );
}
