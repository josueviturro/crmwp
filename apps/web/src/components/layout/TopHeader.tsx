export function TopHeader() {
  return (
    <header className="fixed top-0 left-16 right-0 h-14 bg-surface-container-lowest/80 backdrop-blur-md z-40 border-b border-outline-variant/20 flex items-center justify-between px-space-base">
      <div className="flex items-center gap-space-md">
        <span className="font-headline-sm text-headline-sm text-on-surface">Pulse CRM</span>
        <span className="px-space-xs py-0.5 rounded text-label-sm font-label-sm bg-surface-container-high text-secondary border border-outline-variant/30">
          DEV
        </span>
      </div>
      <div className="flex items-center gap-space-base">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
        </div>
      </div>
    </header>
  );
}
