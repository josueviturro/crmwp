import type { Conversation } from './types';

const statusColor: Record<Conversation['status'], string> = {
  online: 'bg-emerald-500',
  away: 'bg-amber-400',
  offline: '',
};

const tagClasses: Record<NonNullable<Conversation['tag']>['tone'], string> = {
  primary: 'bg-primary-container/20 text-primary border-primary/30',
  amber: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  sky: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  neutral: 'bg-surface-container-high text-on-surface-variant border-transparent',
};

type Props = {
  conversations: Conversation[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function ConversationList({ conversations, selectedId, onSelect }: Props) {
  return (
    <aside className="w-80 xl:w-96 flex-shrink-0 flex flex-col bg-surface-container-lowest border-r border-outline-variant/30">
      <div className="p-space-base pb-space-sm flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight">Mensajes</h1>
            <span className="px-space-xs py-0.5 rounded-full text-label-sm font-label-sm bg-primary-container/20 text-primary font-medium">
              {conversations.length} activos
            </span>
          </div>
        </div>

        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant pointer-events-none">
            search
          </span>
          <input
            className="w-full h-9 pl-9 pr-3 bg-surface-container rounded-xl text-body-sm text-on-surface placeholder:text-outline/70 border border-outline-variant/20 focus:border-primary focus:outline-none transition-colors"
            placeholder="Buscar por cliente, empresa o etiqueta..."
            type="text"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/15">
        {conversations.map((conversation) => {
          const isActive = conversation.id === selectedId;
          return (
            <button
              key={conversation.id}
              onClick={() => onSelect(conversation.id)}
              className={`w-full text-left flex items-start gap-space-sm p-space-base transition-colors border-l-4 ${
                isActive
                  ? 'bg-surface-container-low border-primary'
                  : 'border-transparent hover:bg-surface-container-low/60'
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-11 h-11 rounded-xl bg-surface-container-high border border-outline-variant/30 flex items-center justify-center text-primary font-semibold">
                  {conversation.initials}
                </div>
                {conversation.status !== 'offline' && (
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-surface-container-lowest ${statusColor[conversation.status]}`}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="font-headline-sm text-body-md font-semibold text-on-surface truncate">
                    {conversation.name}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant flex-shrink-0">
                    {conversation.time}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[11px] font-mono text-outline font-medium truncate">
                    {conversation.company}
                  </span>
                  {conversation.tag && (
                    <span
                      className={`inline-flex items-center px-1.5 py-0.2 text-[10px] font-semibold rounded border ${tagClasses[conversation.tag.tone]}`}
                    >
                      {conversation.tag.label}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    {conversation.lastMessage}
                  </p>
                  {conversation.unreadCount && (
                    <span className="w-5 h-5 rounded-full bg-primary text-on-primary text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
