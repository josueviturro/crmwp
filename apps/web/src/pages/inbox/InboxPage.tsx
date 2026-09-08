import { useState } from 'react';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';
import { ContactPanel } from './ContactPanel';
import { conversations, messagesByConversation, contactDetailsByConversation } from './mockData';

export function InboxPage() {
  const [selectedId, setSelectedId] = useState(conversations[0].id);

  const selectedConversation = conversations.find((c) => c.id === selectedId)!;
  const messages = messagesByConversation[selectedId] ?? [];
  const contact = contactDetailsByConversation[selectedId];

  return (
    <div className="flex w-full h-[calc(100vh-3.5rem)] overflow-hidden bg-background">
      <ConversationList conversations={conversations} selectedId={selectedId} onSelect={setSelectedId} />
      <ChatWindow conversation={selectedConversation} messages={messages} />
      {contact ? (
        <ContactPanel contact={contact} />
      ) : (
        <aside className="w-80 xl:w-96 flex-shrink-0 flex items-center justify-center bg-surface-container-lowest border-l border-outline-variant/30 p-space-base text-center">
          <p className="text-body-sm text-on-surface-variant">
            Todavía no hay datos de CRM cargados para este contacto.
          </p>
        </aside>
      )}
    </div>
  );
}
