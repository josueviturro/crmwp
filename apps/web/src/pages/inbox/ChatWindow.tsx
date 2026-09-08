import { useState } from 'react';
import type { Conversation, Message } from './types';
import styles from './ChatWindow.module.css';

type Props = {
  conversation: Conversation;
  messages: Message[];
};

export function ChatWindow({ conversation, messages }: Props) {
  const [draft, setDraft] = useState('');

  return (
    <section className={styles.chat}>
      <header className={styles.header}>
        <div className={styles.headerInfo}>
          <div className={styles.avatar}>{conversation.initials}</div>
          <div>
            <span className={styles.headerName}>{conversation.name}</span>
            <div className={styles.headerMeta}>
              <span className={conversation.status === 'online' ? styles.statusOnline : undefined}>
                {conversation.status === 'online' ? 'En línea' : conversation.status === 'away' ? 'Ausente' : 'Desconectado'}
              </span>
              <span>•</span>
              <span>{conversation.company}</span>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.messages}>
        {messages.map((message) => {
          const isAgent = message.from === 'agent';
          return (
            <div
              key={message.id}
              className={`${styles.messageGroup} ${isAgent ? styles.messageGroupAgent : styles.messageGroupCustomer}`}
            >
              <div className={`${styles.messageAuthor} ${isAgent ? styles.authorAgent : styles.authorCustomer}`}>
                {message.authorName}
              </div>
              <div className={`${styles.bubble} ${isAgent ? styles.bubbleAgent : styles.bubbleCustomer}`}>
                <p className={styles.bubbleText}>{message.text}</p>
                <div className={styles.bubbleTime}>
                  <span>{message.time}</span>
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
            className={`${styles.textarea} scrollbar-none`}
            placeholder="Escribí un mensaje..."
            rows={1}
          />
          <button className={styles.sendButton} title="Enviar mensaje" onClick={() => setDraft('')}>
            <span className="material-symbols-outlined icon-md">send</span>
          </button>
        </div>
      </div>
    </section>
  );
}
