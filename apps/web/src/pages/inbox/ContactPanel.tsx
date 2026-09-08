import type { ContactDetails } from './types';

export function ContactPanel({ contact }: { contact: ContactDetails }) {
  const steps = 5;

  return (
    <aside className="w-80 xl:w-96 flex-shrink-0 flex flex-col bg-surface-container-lowest border-l border-outline-variant/30 overflow-y-auto">
      <div className="p-space-base border-b border-outline-variant/20 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-container-high border-2 border-primary/40 flex items-center justify-center text-primary text-headline-md font-semibold mb-3">
          {contact.name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </div>
        <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">{contact.name}</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {contact.role} @ <span className="text-secondary font-medium">{contact.company}</span>
        </p>
      </div>

      <div className="p-space-base border-b border-outline-variant/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-label-sm font-label-sm uppercase tracking-wider text-outline font-semibold">
            Etapa de venta
          </span>
          <span className="text-label-sm font-mono text-primary font-bold">
            Paso {contact.pipelineStepIndex} de {steps}
          </span>
        </div>
        <div className="grid grid-cols-5 gap-1 mb-2">
          {Array.from({ length: steps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full ${i < contact.pipelineStepIndex ? 'bg-primary' : 'bg-surface-container-high'}`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container border border-outline-variant/20">
          <span className="text-body-sm font-body-sm font-semibold text-on-surface">{contact.pipelineStage}</span>
          <span className="text-label-sm font-mono text-success font-bold">{contact.dealValue}</span>
        </div>
      </div>

      <div className="p-space-base border-b border-outline-variant/20 space-y-2.5">
        <span className="text-label-sm font-label-sm uppercase tracking-wider text-outline font-semibold">
          Datos del contacto
        </span>
        <div className="space-y-2 text-body-sm mt-2">
          <div className="flex items-start justify-between gap-2">
            <span className="text-outline text-label-md">Teléfono:</span>
            <span className="font-mono text-on-surface">{contact.phone}</span>
          </div>
          <div className="flex items-start justify-between gap-2">
            <span className="text-outline text-label-md">Email:</span>
            <span className="font-mono text-secondary truncate max-w-[180px]">{contact.email}</span>
          </div>
          <div className="flex items-start justify-between gap-2">
            <span className="text-outline text-label-md">Empresa:</span>
            <span className="text-on-surface text-right">
              {contact.company} ({contact.companySize})
            </span>
          </div>
          <div className="flex items-start justify-between gap-2">
            <span className="text-outline text-label-md">Origen:</span>
            <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant text-[11px] font-medium">
              {contact.source}
            </span>
          </div>
        </div>
      </div>

      <div className="p-space-base border-b border-outline-variant/20">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-label-sm font-label-sm uppercase tracking-wider text-outline font-semibold">
            Etiquetas
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {contact.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-lg bg-primary-container/20 border border-primary/40 text-primary text-label-sm font-semibold"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="p-space-base space-y-2">
        <span className="text-label-sm font-label-sm uppercase tracking-wider text-outline font-semibold">
          Nota interna
        </span>
        <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/30 text-body-sm text-on-surface-variant leading-relaxed">
          {contact.note}
        </div>
      </div>
    </aside>
  );
}
