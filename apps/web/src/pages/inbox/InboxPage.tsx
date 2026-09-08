import { useState } from 'react';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';
import { ContactPanel } from './ContactPanel';
import { conversations, messagesByConversation, contactDetailsByConversation } from './mockData';
import styles from './InboxPage.module.css';

export function InboxPage() {
  const [selectedId, setSelectedId] = useState(conversations[0].id);

  const selectedConversation = conversations.find((c) => c.id === selectedId)!;
  const messages = messagesByConversation[selectedId] ?? [];
  const contact = contactDetailsByConversation[selectedId];

  return (
    <div className={styles.container}>
      <ConversationList conversations={conversations} selectedId={selectedId} onSelect={setSelectedId} />
      <ChatWindow conversation={selectedConversation} messages={messages} />
      {contact ? (
        <ContactPanel contact={contact} />
      ) : (
        <aside className={styles.emptyPanel}>
          <p className={styles.emptyText}>Todavía no hay datos de CRM cargados para este contacto.</p>
        </aside>
      )}
    </div>
  );
}
