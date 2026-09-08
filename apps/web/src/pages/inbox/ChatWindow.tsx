import { useState } from 'react';
import type { Conversation, Message } from './types';

type Props = {
  conversation: Conversation;
  messages: Message[];
};

export function ChatWindow({ conversation, messages }: Props) {
  const [draft, setDraft] = useState('');

  return (
    <section className="flex-1 flex flex-col min-w-[480px] bg-surface relative overflow-hidden">
      <header className="h-16 px-space-lg bg-surface-container-lowest/90 backdrop-blur border-b border-outline-variant/30 flex items-center justify-between z-10">
        <div className="flex items-center gap-space-md min-w-0">
          <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-outline-variant/30 flex items-center justify-center text-primary font-semibold">
            {conversation.initials}
          </div>
          <div className="min-w-0">
            <span className="font-headline-sm text-body-md text-on-surface font-semibold truncate block">
              {conversation.name}
            </span>
            <div className="flex items-center gap-2 text-label-sm font-label-sm text-on-surface-variant">
              <span className="text-emerald-400 font-medium">
                {conversation.status === 'online' ? 'En línea' : conversation.status === 'away' ? 'Ausente' : 'Desconectado'}
              </span>
              <span>•</span>
              <span className="truncate">{conversation.company}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-space-base xl:p-space-lg flex flex-col gap-space-md z-10">
        {messages.map((message) => {
          const isAgent = message.from === 'agent';
          return (
            <div
              key={message.id}
              className={`flex flex-col max-w-xl group ${isAgent ? 'items-end self-end' : 'items-start'}`}
            >
              <div className="flex items-baseline gap-2 mb-1 px-1">
                <span className={`text-label-sm font-label-sm font-semibold ${isAgent ? 'text-primary' : 'text-secondary'}`}>
                  {message.authorName}
                </span>
              </div>
              <div
                className={`p-3.5 rounded-2xl shadow-md ${
                  isAgent
                    ? 'rounded-br-xs bg-primary-container/30 border border-primary/40 text-on-surface'
                    : 'rounded-bl-xs bg-surface-container-high border border-outline-variant/30 text-on-surface'
                }`}
              >
                <p className="font-body-md text-body-md leading-relaxed">{message.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1 text-right">
                  <span className="text-label-sm font-label-sm text-outline font-mono">{message.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-space-base bg-surface-container-lowest border-t border-outline-variant/30 z-10">
        <div className="flex items-end gap-space-sm bg-surface-container rounded-2xl p-2 border border-outline-variant/30 focus-within:border-primary transition-colors">
          <div className="flex-1 min-w-0">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="w-full bg-transparent text-body-md text-on-surface placeholder:text-outline/70 border-0 resize-none focus:outline-none max-h-32 py-1.5 scrollbar-none font-body-md"
              placeholder="Escribí un mensaje..."
              rows={1}
            />
          </div>
          <button
            className="w-10 h-10 rounded-xl bg-primary hover:bg-primary-container text-on-primary flex items-center justify-center shadow-lg transition-transform active:scale-95 flex-shrink-0"
            title="Enviar mensaje"
            onClick={() => setDraft('')}
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </div>
      </div>
    </section>
  );
}
